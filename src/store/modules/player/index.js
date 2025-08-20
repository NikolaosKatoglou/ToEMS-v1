import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

export default {
  namespaced: true,
  state() {
    return {
      maxHp: 100,
      hp: 100,
      rage: 0,
      exp: 0,
      level: 1,
      leveledUp: false,
      wonLastBattle: false,
      monstersSlain: 0,
      playerDeaths: 0,
      round: 1,
      nextHealRound: 4,
      name: "Nameless Hero",
    };
  },
  getters,
  mutations,
  actions,
};
