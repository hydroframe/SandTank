/* eslint-disable arrow-body-style */
export default function createMethods(session) {
  return {
    getServerState: () => session.call('parflow.sandtank.initialize', []),
    reset: () => session.call('parflow.sandtank.reset', []),
    updateConfiguration: (config) =>
      session.call('parflow.sandtank.config.update', [config]),
    subscribeToSaturation: (callback) =>
      session.subscribe('parflow.sandtank.saturation', callback),
    subscribeToIndicator: (callback) =>
      session.subscribe('parflow.sandtank.indicator', callback),
    unsubscribe: (subscription) => session.unsubscribe(subscription),
  };
}
