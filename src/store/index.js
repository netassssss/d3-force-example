import getters from './getters';
import nodeHelperInstances from './nodeHelper/NeuralManager';

export default {
  state: {
    nodes: [],
    links: [],
  },
  mutations: {
    SET_NODES(state, nodes) {
      state.nodes = nodes;
    },
    SET_LINKS(state, links) {
      state.links = links;
    },
  },
  actions: {
    createInstance() {
      nodeHelperInstances.set(this);
    },
    init({ commit, dispatch }) {
      dispatch('createInstance');
      const { nodes, links } = nodeHelperInstances.get(this, 'createInitialNodesAndLinks');
      commit('SET_NODES', nodes);
      commit('SET_LINKS', links);
    },
    updateNodes({ commit }) {
      const { nodes, links } = nodeHelperInstances.get(this, 'updateLinks');
      commit('SET_NODES', nodes);
      commit('SET_LINKS', links);
    },
  },
  getters,
};
