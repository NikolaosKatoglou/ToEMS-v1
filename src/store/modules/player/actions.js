import {
  normalAttackPower,
  doubleAttackPower,
  specialAttackPower1,
  specialAttackPower2,
  specialAttackPower3,
  healPower,
  handleMonsterDamage,
  calculateRageGain,
} from "../helpers/playerHelpers";

import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../../firebase";

export default {
  //normal attacks
  attackMonster({ state, commit, rootState, dispatch }) {
    const name = state.name;
    const damage = normalAttackPower(state.level);
    const rageGain = calculateRageGain(damage, state.level);
    commit("addRage", rageGain); // player gets rage on hitting
    commit("incrementRound");
    dispatch(
      "log/addLog",
      {
        actor: name,
        action: "attacks",
        target: "Monster",
        targetName: rootState.monster.name,
        value: damage,
        type: "damage",
      },
      { root: true }
    );

    handleMonsterDamage({ commit, rootState, dispatch }, damage);
  },

  doubleAttackMonster({ state, commit, rootState, dispatch }) {
    const name = state.name;
    commit("incrementRound");
    for (let i = 0; i < 2; i++) {
      if (rootState.monster.hp <= 0) break;
      const damage = doubleAttackPower(state.level);
      const rageGain = calculateRageGain(damage, state.level);
      handleMonsterDamage({ commit, rootState, dispatch }, damage);
      commit("addRage", rageGain);

      dispatch(
        "log/addLog",
        {
          actor: name,
          action: "double-attacks",
          target: "Monster",
          targetName: rootState.monster.name,
          value: damage,
          type: "damage",
        },
        { root: true }
      );
    }
  },

  //special attacks
  specialAttackRageStrike({ commit, state, rootState, dispatch }) {
    const name = state.name;
    if (state.rage < 15) return;
    const damage = specialAttackPower1(state.level);
    handleMonsterDamage({ commit, rootState, dispatch }, damage);
    commit("subtractRage", 15);
    commit("incrementRound");
    dispatch(
      "log/addLog",
      {
        actor: name,
        action: "Special1",
        target: "Monster",
        targetName: rootState.monster.name,
        value: damage,
        type: "special",
      },
      { root: true }
    );
  },

  specialAttackDeepStrike({ commit, state, rootState, dispatch }) {
    const name = state.name;
    if (state.rage < 25) return;
    const damage = specialAttackPower2(state.level);
    handleMonsterDamage({ commit, rootState, dispatch }, damage);
    commit("subtractRage", 25);
    commit("incrementRound");
    dispatch(
      "log/addLog",
      {
        actor: name,
        action: "Special2",
        target: "Monster",
        targetName: rootState.monster.name,
        value: damage,
        type: "special",
      },
      { root: true }
    );
  },

  specialAttackThunderStrike({ commit, state, rootState, dispatch }) {
    const name = state.name;
    if (state.rage < 30) return;
    const damage = specialAttackPower3(state.level);
    handleMonsterDamage({ commit, rootState, dispatch }, damage);
    commit("subtractRage", 30);
    commit("incrementRound");
    dispatch(
      "log/addLog",
      {
        actor: name,
        action: "Special3",
        target: "Monster",
        targetName: rootState.monster.name,
        value: damage,
        type: "special",
      },
      { root: true }
    );
  },

  // heal
  restoreHealth({ commit, state, dispatch }) {
    const name = state.name;
    if (state.round < state.nextHealRound) return;
    const heal = healPower(state.level, state.maxHp);
    const newHp = Math.min(state.hp + heal, state.maxHp);
    commit("setHp", newHp);
    commit("incrementRound");
    commit("setNextHealRound", state.round + 3);
    dispatch(
      "log/addLog",
      {
        actor: name,
        action: "heals",
        target: "himself",
        value: heal,
        type: "heal",
      },
      { root: true }
    );
  },

  // reset
  reset({ commit, dispatch }) {
    commit("reset");
    dispatch("log/clearLogs", null, { root: true });
  },

  // save to firestore
  async saveStatsToFirestore({ state }) {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userRef, {
        player: {
          maxHp: state.maxHp,
          hp: state.hp,
          rage: state.rage,
          exp: state.exp,
          level: state.level,
          leveledUp: state.leveledUp,
          wonLastBattle: state.wonLastBattle,
          monstersSlain: state.monstersSlain,
          playerDeaths: state.playerDeaths,
          round: state.round,
          nextHealRound: state.nextHealRound,
          name: state.name,
        },
      });
    } catch (err) {
      console.error("Failed to save player stats:", err);
    }
  },
};
