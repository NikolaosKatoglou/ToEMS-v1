export default {
  getMonsterHp(state) {
    return state.hp;
  },
  getMonsterMaxHp(state) {
    return state.maxHp;
  },
  getMonsterLevel(state) {
    return state.level;
  },
  getMonsterName(state) {
    return state.name;
  },
  getNextMonsters(state) {
    return state.nextMonsters;
  },
};
