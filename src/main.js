import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import { createStore } from './store/storeHelper';

Vue.config.productionTip = false;

Vue.use(Vuex);

const store = createStore();

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
