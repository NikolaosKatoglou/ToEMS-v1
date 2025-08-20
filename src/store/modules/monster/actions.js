import { monsterList } from "../../../data/monsterList";
import { monsterHpBonuses } from "../../../data/monsterHpBonuses";
import { monsterDamageMultipliers } from "../../../data/monsterDamageMultipliers";

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateMonsterHp(level, monsterType) {
  let baseHp = 50 + level * 5;
  // adding bonusHp
  const bonusHp = monsterHpBonuses[monsterType] || 0;

  return baseHp + bonusHp;
}

function getMonsterDamageRange(level, monsterType) {
  const baseDamage = 10 + level * 0.8;
  const typeMultiplier = monsterDamageMultipliers[monsterType] || 1;
  const minDamage = Math.floor(baseDamage * typeMultiplier);
  const maxDamage = Math.floor((baseDamage + level * 0.5) * typeMultiplier);

  return {
    min: minDamage,
    max: maxDamage,
  };
}

export default {
  attackPlayer({ commit, rootState, dispatch }) {
    const playerName = rootState.player.name
    const level = rootState.monster.level;
    const monsterType = rootState.monster.name;
    const { min, max } = getMonsterDamageRange(level, monsterType);
    const damage = getRandomValue(min, max);
    const playerHp = rootState.player.hp - damage;
    const rageGain = Math.floor(damage * 0.5);

    commit("player/addRage", rageGain, { root: true });
    commit("player/setHp", playerHp, { root: true });

    dispatch(
      "log/addLog",
      {
        actor: "Monster",
        actorName: rootState.monster.name,
        action: "attacks",
        target: playerName,
        value: damage,
        type: "damage",
      },
      { root: true }
    );
  },

  selectNextMonsters({ commit, rootState, dispatch }) {
    const playerLevel = rootState.player.level;

    const monstersForLevel = (lvl) =>
      monsterList.filter((m) => lvl >= m.minLevel && lvl <= m.maxLevel);

    const pickMonsters = () => {
      const monsters = [];

      for (let i = 0; i <= 2; i++) {
        const level = playerLevel + i;
        const availableMonsters = monstersForLevel(level);

        if (availableMonsters.length > 0) {
          const selectedMonster =
            availableMonsters[
              Math.floor(Math.random() * availableMonsters.length)
            ];

          const monsterHp = calculateMonsterHp(level, selectedMonster.name);

          monsters.push({
            ...selectedMonster,
            level,
            hp: monsterHp,
          });
        }
      }

      return monsters;
    };
    const monsterOptions = pickMonsters();

    dispatch("log/clearLogs", null, { root: true });
    commit("setNextMonsters", monsterOptions);
  },

  reset({ commit, dispatch }) {
    commit("reset");
    dispatch("log/clearLogs", null, { root: true });
  },
};
