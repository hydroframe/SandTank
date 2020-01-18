import Vuex from 'vuex';

import parflow from './parflow';
import pvw from './pvw';
import ui from './ui';

function createStore() {
  return new Vuex.Store({
    modules: {
      parflow,
      pvw,
      ui,
    },
  });
}

export default createStore;
