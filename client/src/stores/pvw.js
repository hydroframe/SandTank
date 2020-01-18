import SmartConnect from 'wslink/src/SmartConnect';
import vtkWSLinkClient from 'vtk.js/Sources/IO/Core/WSLinkClient';

import Parflow from 'parflow-web/src/io/parflow';

export default {
  state: {
    config: {
      application: 'sandtank',
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
    PVW_CONNECT({ commit, state }) {
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
          clientToConnect = vtkWSLinkClient.newInstance();
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
          .connect(config)
          .then((validClient) => {
            commit('PVW_CLIENT_SET', validClient);
            clientToConnect.endBusy();
            commit('PVW_CONNECTED_SET', true);
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
  },
};
