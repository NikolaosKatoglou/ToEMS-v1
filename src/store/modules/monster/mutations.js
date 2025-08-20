export default {
  setHp(state, hp) {
    if (state.hp !== undefined) {
      state.hp = hp;
    } else {
      const baseHP = state.hp; // base HP value (adjust as needed)
      const levelFactor = 20; // factor for each level (adjust as needed)
      state.hp = baseHP + state.level * levelFactor;
    }
  },
  setMaxHp(state, maxHp) {
    state.maxHp = maxHp;
  },
  reset(state) {
    state.name = "Lizard";
    state.level = 1;
    state.maxHp = 50;
    state.hp = 50;
  },
  setName(state, name) {
    state.name = name;
  },
  setNextMonsters(state, monsters) {
    state.nextMonsters = monsters;
  },
  setLevel(state, level) {
    state.level = level;
  },
  restoreFromStorage(state, payload) {
    Object.assign(state, payload);
  },
};
