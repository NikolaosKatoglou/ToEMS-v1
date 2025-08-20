export default {
  addLog(state, payload) {
    state.logs.unshift(payload); // assuming logs is an array
  },
  clearLogs(state) {
    state.logs = [];
  },
};
