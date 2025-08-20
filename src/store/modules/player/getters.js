function getExpRequired(level) {
  const baseExp = 100;
  const multiplier = 1.3; // tweak this for difficulty curve
  return Math.floor(baseExp * Math.pow(multiplier, level - 1));
}

export default {
  getPlayerHp(state) {
    return state.hp;
  },
  getPlayerMaxHp(state) {
    return state.maxHp;
  },
  getPlayerRage(state) {
    return state.rage;
  },
  getPlayerExp(state) {
    return state.exp;
  },
  getPlayerLevel(state) {
    return state.level;
  },
  getPlayerLeveledUp(state) {
    return state.leveledUp;
  },
  getExpRequired(state) {
    return getExpRequired(state.level);
  },
  getMonstersSlain(state) {
    return state.monstersSlain;
  },
  getPlayerDeaths(state) {
    return state.playerDeaths;
  },
  canUseHeal(state) {
    return state.round >= state.nextHealRound;
  },
  getRound(state) {
    return state.round;
  },
  getPlayerName(state){
    return state.name
  }
};
