import Vuex from 'vuex';

import parflow from './parflow';
import pvw from './pvw';
import sandtank from './sandtank';
import ui from './ui';

function createStore() {
  return new Vuex.Store({
    modules: {
      parflow,
      pvw,
      sandtank,
      ui,
    },
  });
}

export default createStore;
