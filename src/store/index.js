import { getNodesAndLinks } from './nodesHelper';
import getters from './getters';

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
    init({ commit }) {
      const { nodes, links } = getNodesAndLinks();
      commit('SET_NODES', nodes);
      commit('SET_LINKS', links);
    },
  },
  getters,
};
