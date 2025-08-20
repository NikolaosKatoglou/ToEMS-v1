export default {
    namespaced: true,
    state() {
      return {
        currentUser: null,
      };
    },
    mutations: {
      setUser(state, user) {
        state.currentUser = user;
      },
      clearUser(state) {
        state.currentUser = null;
      },
    },
    getters: {
      isLoggedIn(state) {
        return !!state.currentUser;
      },
      getUser(state) {
        return state.currentUser;
      },
    },
  };
  