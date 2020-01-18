import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';

import 'typeface-roboto';

import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

import App from 'parflow-web/src/components/core/App';
import shortcuts from 'parflow-web/src/shortcuts';
import vuetifyConfig from 'parflow-web/src/vuetify.config.js';
import createStore from 'parflow-web/src/stores';

// ----------------------------------------------------------------------------

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(Vuetify);

// ----------------------------------------------------------------------------

const store = createStore();
shortcuts.register(store);

new Vue({
  vuetify: new Vuetify(vuetifyConfig),
  store,
  render: (h) => h(App),
  beforeDestroy: shortcuts.unregister,
}).$mount('#app');
