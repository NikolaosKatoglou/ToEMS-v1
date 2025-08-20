export default {
  addLog({ commit }, payload) {
    commit("addLog", payload);
  },
  clearLogs({ commit }) {
    commit("clearLogs");
  },
};
