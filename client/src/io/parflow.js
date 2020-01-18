/* eslint-disable arrow-body-style */
export default function createMethods(session) {
  return {
    abc: (a) => session.call('abc', [a]),
    subscribe: (callback) =>
      session.subscribe('parflow.subscription', callback),
    unsubscribe: (subscription) => session.unsubscribe(subscription),
  };
}
