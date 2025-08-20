import { monsterExpMultipliers } from "../../../data/monsterExpMultiplier";

// generate random integer between min and max (inclusive)
export function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// normal attacks
export function normalAttackPower(level) {
  const baseDamage = getRandomValue(8, 13) + level * 0.5;
  return Math.floor(baseDamage);
}

export function doubleAttackPower(level) {
  const baseDamage = getRandomValue(7, 10) + level * 0.5;
  return Math.floor(baseDamage);
}

// special attacks
export function specialAttackPower1(level) {
  const baseDamage = getRandomValue(14, 27) + level * 1.2;
  return Math.floor(baseDamage);
}

export function specialAttackPower2(level) {
  const baseDamage = getRandomValue(20, 32) + level * 1.4;
  return Math.floor(baseDamage);
}

export function specialAttackPower3(level) {
  const baseDamage = getRandomValue(27, 45) + level * 1.6;
  return Math.floor(baseDamage);
}

// heal power
export function healPower(level, maxHp) {
  const percentHeal = getRandomValue(15, 25); // heal 15–25% of max HP
  return Math.floor((percentHeal / 100) * maxHp);
}

// exp reward
function calcExpReward(monsterLevel) {
  return Math.floor(5 + (monsterLevel - 1) * 3);
}

export function calcFinalExp(monsterLevel, monsterName) {
  const baseExp = calcExpReward(monsterLevel);
  const multiplier = monsterExpMultipliers[monsterName] || 1.0;
  return Math.floor(baseExp * multiplier);
}

// damage handling helper (optional export if you want to keep logic in actions)
export function handleMonsterDamage({ commit, rootState, dispatch }, damage) {
  const monsterHp = rootState.monster.hp - damage;
  commit("monster/setHp", monsterHp, { root: true });

  if (monsterHp <= 0) {
    const monsterLevel = rootState.monster.level;
    const monsterName = rootState.monster.name;
    commit("addExp", calcFinalExp(monsterLevel, monsterName));
  }
}

export function calculateRageGain(damage) {
  return Math.floor(5 + Math.log10(damage + 1) * 3);
}
