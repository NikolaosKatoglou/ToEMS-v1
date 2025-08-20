import getters from "./getters.js";
import mutations from "./mutations.js";
import actions from "./actions.js";

export default {
  namespaced: true,
  state() {
    return {
      name: "Lizard",
      hp: 50,
      maxHp: 50,
      level: 1,
      nextMonsters: [],
    };
  },
  getters,
  mutations,
  actions,
};
