/* eslint-disable arrow-body-style */
export default function createMethods(session) {
  return {
    getIndicator: () => session.call('parflow.sandtank.indicator', []),
    subscribeToSaturation: (callback) =>
      session.subscribe('parflow.sandtank.saturation', callback),
    unsubscribeToSaturation: (subscription) =>
      session.unsubscribe(subscription),
  };
}
