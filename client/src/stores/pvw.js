import SmartConnect from 'wslink/src/SmartConnect';
import vtkWSLinkClient from 'vtk.js/Sources/IO/Core/WSLinkClient';
import vtkURLExtract from 'vtk.js/Sources/Common/Core/URLExtract';

import Parflow from 'parflow-web/src/io/parflow';

// ----------------------------------------------------------------------------
// Ensure we keep the same hostname regardless what the server advertise
// ----------------------------------------------------------------------------

// Process arguments from URL
const userParams = vtkURLExtract.extractURLParameters();

function configDecorator(config) {
  // We actually have a sessionURL in the config, we rewrite it
  if (config.sessionURL && !userParams.dev) {
    const sessionUrl = new URL(config.sessionURL);
    sessionUrl.host = window.location.host;
    return Object.assign({}, config, {
      sessionURL: sessionUrl.toString(),
    });
  }
  return config;
}

// ----------------------------------------------------------------------------

export default {
  state: {
    config: {
      application: 'sandtank',
      sessionURL: userParams.dev ? 'ws://localhost:1234/ws' : null,
      name: 'default',
      sessionManagerURL: window.SANDTANK_SESSION_MANAGER_URL,
    },
    client: null,
    error: null,
    connected: false,
    busyCount: 0,
  },
  getters: {
    PVW_CONNECTED(state) {
      return state.connected;
    },
    PVW_BUSY(state) {
      return !!state.busyCount;
    },
    PVW_RUN_ID(state) {
      if (userParams.dev) {
        return 'devrun';
      }
      return state.client && state.client.getConfig().id;
    },
  },
  mutations: {
    PVW_CONNECTED_SET(state, value) {
      state.connected = value;
    },
    PVW_CLIENT_SET(state, value) {
      state.client = value;
    },
    PVW_BUSY_COUNT_SET(state, value) {
      state.busyCount = value;
    },
    PVW_ERROR_SET(state, value) {
      state.error = value;
    },
  },
  actions: {
    PVW_CONNECT({ commit, state, dispatch }) {
      // Bind vtkWSLinkClient to our SmartConnect
      vtkWSLinkClient.setSmartConnectClass(SmartConnect);

      return new Promise((resolve, reject) => {
        const { config, client } = state;
        if (client && client.isConnected()) {
          try {
            client.disconnect();
          } catch (e) {
            console.log(e);
          }
          commit('PVW_CONNECTED_SET', false);
        }
        let clientToConnect = client;
        if (!clientToConnect) {
          clientToConnect = vtkWSLinkClient.newInstance({ configDecorator });
          clientToConnect.setProtocols({
            Parflow,
          });
        }

        // Connect to busy store
        clientToConnect.onBusyChange((count) => {
          commit('PVW_BUSY_COUNT_SET', count);
        });
        clientToConnect.beginBusy();

        // Error
        clientToConnect.onConnectionError((httpReq) => {
          const message =
            (httpReq && httpReq.response && httpReq.response.error) ||
            `Connection error`;
          console.error(message);
          commit('PVW_ERROR_SET', message);
          commit('PVW_CONNECTED_SET', false);
          console.log(httpReq);
          reject();
        });

        // Close
        clientToConnect.onConnectionClose((httpReq) => {
          const message =
            (httpReq && httpReq.response && httpReq.response.error) ||
            `Connection close`;
          console.error(message);
          commit('PVW_ERROR_SET', message);
          commit('PVW_CONNECTED_SET', false);
          console.log(httpReq);
          reject();
        });

        // Connect
        clientToConnect
          .connect(Object.assign({}, config, userParams))
          .then((validClient) => {
            commit('PVW_CLIENT_SET', validClient);
            clientToConnect.endBusy();
            commit('PVW_CONNECTED_SET', true);

            // Attach subscription
            validClient
              .getRemote()
              .Parflow.subscribeToSaturation(([saturationArray]) => {
                dispatch('SANDTANK_SATURATION_UPDATE', saturationArray);
              });

            validClient
              .getRemote()
              .Parflow.subscribeToTotalStorage(([totalStorage]) => {
                dispatch('SANDTANK_TOTAL_STORAGE_UPDATE', totalStorage);
              });

            validClient
              .getRemote()
              .Parflow.subscribeToPumping(([pumping]) => {
                dispatch('SANDTANK_PUMPING_UPDATE', pumping);
              });

            validClient
              .getRemote()
              .Parflow.subscribeToIndicator(([indicator]) => {
                dispatch('SANDTANK_INDICATOR_UPDATE', indicator);
              });

            validClient
              .getRemote()
              .Parflow.subscribeToPressures(([pressures]) => {
                dispatch('SANDTANK_PRESSURES_UPDATE', pressures);
              });

            validClient
              .getRemote()
              .Parflow.subscribeToStorages(([storages]) => {
                dispatch('SANDTANK_STORAGES_UPDATE', storages);
              });

            validClient
              .getRemote()
              .Parflow.subscribeToFlows(([flows]) => {
              dispatch('SANDTANK_FLOWS_UPDATE', flows);
            });

            validClient
              .getRemote()
              .Parflow.subscribeToConcentration(([concentration]) => {
                dispatch('SANDTANK_CONCENTRATION_UPDATE', concentration);
              });

            validClient
              .getRemote()
              .Parflow.subscribeToRunComplete(([output]) => {
                dispatch('PARFLOW_RUN_COMPLETE', output);
              });

            // Initialize server
            validClient
              .getRemote()
              .Parflow.getServerState()
              .then((domain) => {
                commit('SANDTANK_DOMAIN_SET', domain);
                commit('PARFLOW_RUN_LENGTH_SET', domain.setup.simulationLength);

                domain.setup.indicators.forEach(({ key, value }) => {
                  commit('PARFLOW_K_SET', { [key]: value });
                });

                dispatch('SANDTANK_RESET');

                // Get solid mask
                validClient
                  .getRemote()
                  .Parflow.getSolidMask(10)
                  .then((mask) => {
                    dispatch('SANDTANK_MASK_UPDATE', mask);
                  });
              })
              .catch(console.error);

            resolve(validClient);
          })
          .catch((error) => {
            console.error(error);
            reject();
          });
      });
    },
    PVW_DISCONNECT({ commit, state }) {
      return new Promise((resolve, reject) => {
        const { client } = state;
        if (client && client.isConnected()) {
          try {
            client.disconnect();
            resolve();
          } catch (e) {
            console.log(e);
            reject(e);
          }
          commit('PVW_CONNECTED_SET', false);
        }
      });
    },
    async PVW_RESET({ state }) {
      return state.client
        .getRemote()
        .Parflow.reset()
        .catch(console.error);
    },
    async PVW_CONFIG_UPDATE({ state }, config = null) {
      return state.client
        .getRemote()
        .Parflow.updateConfiguration(config)
        .catch(console.error);
    },
    PVW_EXIT({ state }) {
      return state.client
        .getRemote()
        .Parflow.onExit()
        .catch(console.error);
    },
  },
};
