// function that increases the exp requirement for each level
function getExpRequired(level) {
  const baseExp = 100;
  const multiplier = 1.3; // tweak this for difficulty curve
  return Math.floor(baseExp * Math.pow(multiplier, level - 1));
}

export default {
  setHp(state, hp) {
    state.hp = Math.min(Math.max(Number(hp) || 0, 0), state.maxHp);
  },
  reset(state) {
    state.level = 1;
    state.exp = 0;
    state.maxHp = Math.floor(100 + (state.level - 1) * 20);
    state.hp = state.maxHp;
    state.rage = 0;
    state.leveledUp = false;
    state.wonLastBattle = false;
    state.monstersSlain = 0;
    state.playerDeaths = 0;
    state.round =1;
    state.nextHealRound=4;
    state.name = 'Nameless Hero'
  },

  //rage
  addRage(state, amount) {
    const gain = Math.floor(amount * 0.6);
    state.rage = Math.min(state.rage + gain, 100);
    // cap 100
  },
  setRage(state) {
    state.rage = 0;
  },

  //exp
  addExp(state, amount) {
    state.leveledUp = false;
    state.exp += amount; // Adding exp
    while (state.exp >= getExpRequired(state.level)) {
      const requiredExp = getExpRequired(state.level);
      // Level-up logic
      state.leveledUp = true;
      state.exp -= requiredExp;
      state.level++;

      // increase maxHp  based on the level
      const previousMaxHp = state.maxHp;
      state.maxHp = Math.floor(100 + (state.level - 1) * 20);

      // hp increase based on previous maxHp
      const hpDifference = state.maxHp - previousMaxHp;
      state.hp = Math.min(
        state.hp + Math.floor(hpDifference * 0.1),
        state.maxHp
      );

      // hp is never greater than maxHp
      state.hp = Math.min(state.hp, state.maxHp);
    }
  },
  resetPlayerLeveledUp(state) {
    state.leveledUp = false;
  },

  subtractRage(state, amount) {
    state.rage = Math.max(state.rage - amount, 0);
  },
  setWonLastBattle(state, status) {
    state.wonLastBattle = status;
  },
  restoreFromStorage(state, savedState) {
    Object.assign(state, savedState);
  },
  incrementMonstersSlain(state) {
    state.monstersSlain++;
  },
  setMonstersSlain(state, value) {
    state.monstersSlain = value;
  },
  incrementPlayerDeaths(state) {
    state.playerDeaths++;
  },
  setPlayerDeaths(state, value) {
    state.playerDeaths = value;
  },
  incrementRound(state) {
    state.round++;
  },
  setNextHealRound(state, round) {
    state.nextHealRound = round;
  },
  resetRound(state) {
    state.round = 1;
    state.nextHealRound = 4;
  },
  setPlayerName(state,name){
    state.name = name
  }
};
