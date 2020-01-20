/* eslint-disable arrow-body-style */
export default function createMethods(session) {
  return {
    getIndicator: () => session.call('parflow.sandtank.indicator', []),
    subscribe: (callback) =>
      session.subscribe('parflow.subscription', callback),
    unsubscribe: (subscription) => session.unsubscribe(subscription),
  };
}
