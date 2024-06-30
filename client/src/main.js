import 'core-js/modules/web.immediate';

import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import VueGtag from 'vue-gtag';

import 'typeface-roboto';

import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

import App from 'parflow-web/src/components/core/App';
import shortcuts from 'parflow-web/src/shortcuts';
import vuetifyConfig from 'parflow-web/src/vuetify.config.js';
import createStore from 'parflow-web/src/stores';

if (!window.SANDTANK_SESSION_MANAGER_URL) {
  window.SANDTANK_SESSION_MANAGER_URL = '/paraview/';
}

// ----------------------------------------------------------------------------

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(Vuetify);
Vue.config.productionTip = false;
Vue.use(VueGtag,
  {config: 
     {
       id: 'G-YY63PD0T3J',
       params: {
         send_page_view: false
       }
     }
   }
 );
 
// ----------------------------------------------------------------------------

const store = createStore();
shortcuts.register(store);

new Vue({
  vuetify: new Vuetify(vuetifyConfig),
  store,
  render: (h) => h(App),
  beforeDestroy: shortcuts.unregister,
}).$mount('#app');
