import Vuex from 'vuex';
import mainStore from './index';

export const createStore = () => new Vuex.Store({
  ...mainStore,
});

export default {
  createStore,
};
