<template>
  <div id="game">
    <div class="layout-grid">
      <div class="left-column">
        <TheGameBoard
          :round="round"
          :monsterHp="monsterHp"
          :canUseSpecialAttack="canUseSpecialAttack"
          :canUseHeal="canUseHeal"
          :winner="winner"
          :playerLevel="playerLevel"
          @attack="attackMonster"
          @double-attack="doubleAttackMonster"
          @special-attack="specialAttack"
          @heal="restoreHealth"
          @visit-village="onVisitVillage"
        />
      </div>
      <div class="right-column">
        <TheLog />
      </div>
    </div>
  </div>
  <transition name="dialog-status">
    <TheGameStatus
      v-if="winner && winner !== 'Player'"
      :winner="winner"
      @restart="onVisitVillage"
    />
  </transition>
  <transition name="dialog">
    <TheMonsterSelectDialog
      v-if="showMonsterDialog"
      @close="showMonsterDialog = false"
      @selected="onMonsterSelected"
      @visit-village="onVisitVillage"
    />
  </transition>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import TheHeader from "./TheHeader.vue";
import TheLog from "../ui/TheLog.vue";
import TheGameBoard from "./TheGameBoard.vue";
import TheGameStatus from "../ui/TheGameStatus.vue";
import TheMonsterSelectDialog from "./TheMonsterSelectDialog.vue";
import battleWin from "../../assets/audio/battle-win.wav";
import battleLoss from "../../assets/audio/battle-loss.wav";
import battleTheme from "../../assets/audio/battle-theme.mp3";
import attackSound from "../../assets/audio/attacks/medium-attack-2.wav";
import attackSound2 from "../../assets/audio/attacks/medium-attack-3.wav";
import specialAttackSound from "../../assets/audio/attacks/heavy-attack-3.wav";
import healSound from "../../assets/audio/attacks/heal.wav";
import escapeSound from "../../assets/audio/attacks/escape.wav";

export default {
  name: "TheGameLayout",
  components: {
    TheHeader,
    TheLog,
    TheGameBoard,
    TheGameStatus,
    TheMonsterSelectDialog,
  },
  data() {
    return {
      winner: null,
      showMonsterDialog: false,
      winAudio: new Audio(battleWin),
      lossAudio: new Audio(battleLoss),
      battleAudio: new Audio(battleTheme),
      attackAudio: new Audio(attackSound),
      attackAudio2: new Audio(attackSound2),
      specialAttackAudio: new Audio(specialAttackSound),
      healAudio: new Audio(healSound),
      escapeAudio: new Audio(escapeSound),
    };
  },
  computed: {
    ...mapState({
      playerHp: (state) => state.player.hp,
      monsterHp: (state) => state.monster.hp,
      playerRage: (state) => state.player.rage,
      playerLevel: (state) => state.player.level,
      playerMaxHp: (state) => state.player.maxHp,
    }),
    ...mapGetters({
      round: "player/getRound",
      canUseHeal: "player/canUseHeal",
    }),
    canUseSpecialAttack() {
      let cost;
      if (this.playerLevel >= 25) cost = 30;
      else if (this.playerLevel >= 15) cost = 25;
      else cost = 15;

      return this.playerRage >= cost;
    },
  },
  methods: {
    // sounds
    playWinAudio() {
      this.winAudio.currentTime = 0;
      this.winAudio.volume = 0.07;
      this.winAudio.play();
    },
    playLossAudio() {
      this.lossAudio.currentTime = 0;
      this.lossAudio.volume = 0.07;
      this.lossAudio.play();
    },

    unlockAudio() {
      this.playBattleTheme();
      window.removeEventListener("click", this.unlockAudio);
      window.removeEventListener("keydown", this.unlockAudio);
      window.removeEventListener("touchstart", this.unlockAudio);
    },

    playBattleTheme() {
      if (this.battleAudio.paused) {
        this.battleAudio.play();
      }
      this.battleAudio.currentTime = 0;
      this.battleAudio.loop = true;
      this.battleAudio.volume = 0;

      const targetVolume = 0.1;
      const step = 0.002;
      const interval = 200;

      const fadeIn = setInterval(() => {
        if (this.battleAudio.volume < targetVolume) {
          this.battleAudio.volume = Math.min(
            this.battleAudio.volume + step,
            targetVolume
          );
        } else {
          clearInterval(fadeIn);
        }
      }, interval);
    },

    playAttackSound() {
      this.attackAudio.currentTime = 0;
      this.attackAudio.volume = 0.05;
      this.attackAudio.play();
    },
    playDoubleAttackSound() {
      this.attackAudio.currentTime = 0;
      this.attackAudio.volume = 0.05;
      this.attackAudio.play();
      setTimeout(() => {
        this.attackAudio2.currentTime = 0;
        this.attackAudio2.volume = 0.05;
        this.attackAudio2.play();
      }, 100);
    },

    playSpecialAttackSound() {
      this.specialAttackAudio.currentTime = 0;
      this.specialAttackAudio.volume = 0.05;
      this.specialAttackAudio.play();
    },

    playHealSound() {
      this.healAudio.currentTime = 0;
      this.healAudio.volume = 0.07;
      this.healAudio.play();
    },

    playEscapeSound() {
      this.escapeAudio.currentTime = 0;
      this.escapeAudio.volume = 0.05;
      this.escapeAudio.play();
    },

    attackMonster() {
      this.playAttackSound();
      this.$store.dispatch("player/attackMonster");
      this.checkWinner();
      this.$store.dispatch("player/saveStatsToFirestore");

      if (!this.winner) {
        this.$store.dispatch("monster/attackPlayer");
        this.checkWinner();
      }
    },

    doubleAttackMonster() {
      this.playDoubleAttackSound();
      this.playAttackSound();
      this.$store.dispatch("player/doubleAttackMonster");
      this.checkWinner();
      this.$store.dispatch("player/saveStatsToFirestore");

      if (!this.winner) {
        this.$store.dispatch("monster/attackPlayer");
        this.checkWinner();
      }
    },

    specialAttack() {
      this.playSpecialAttackSound();
      if (this.playerLevel >= 25) {
        this.$store.dispatch("player/specialAttackThunderStrike");
      } else if (this.playerLevel >= 15) {
        this.$store.dispatch("player/specialAttackDeepStrike");
      } else {
        this.$store.dispatch("player/specialAttackRageStrike");
      }
      this.checkWinner();
      this.$store.dispatch("player/saveStatsToFirestore");

      if (!this.winner) {
        this.$store.dispatch("monster/attackPlayer");
        this.checkWinner();
      }
    },

    restoreHealth() {
      this.playHealSound();
      this.$store.dispatch("player/restoreHealth");
      this.checkWinner();
      this.$store.dispatch("player/saveStatsToFirestore");

      if (!this.winner) {
        this.$store.dispatch("monster/attackPlayer");
        this.checkWinner();
      }
    },

    surrender() {
      this.winner = this.$store.getters["monster/getMonsterName"];
      this.$store.commit("player/setHp", 100);
    },

    async checkWinner() {
      if (this.playerHp <= 0 && this.monsterHp <= 0) {
        this.winner = "Draw";
        this.$store.commit("player/resetRound");
        this.showMonsterDialog = false;
        await this.$store.dispatch("player/saveStatsToFirestore");
      } else if (this.playerHp <= 0) {
        this.winner = this.$store.getters["monster/getMonsterName"];
        this.$store.commit("player/resetRound");
        this.showMonsterDialog = false;
        this.$store.commit("player/incrementPlayerDeaths");
        this.$store.commit("player/setHp", 0);
        this.playLossAudio();
        await this.$store.dispatch("player/saveStatsToFirestore");
      } else if (this.monsterHp <= 0) {
        this.winner = "Player";
        this.$store.commit("player/resetRound");
        this.$store.commit("monster/setHp", 0);
        this.$store.commit("player/setWonLastBattle", true);
        this.$store.commit("player/incrementMonstersSlain");
        this.playWinAudio();
        await this.$store.dispatch("player/saveStatsToFirestore");
        this.openMonsterDialog();
      }
    },

    openMonsterDialog() {
      this.showMonsterDialog = true;
      this.$store.commit(
        "player/setHp",
        this.$store.getters["player/getPlayerMaxHp"]
      );
      this.$store.dispatch("monster/selectNextMonsters");
    },

    onVisitVillage() {
      this.playEscapeSound();
      this.showMonsterDialog = false;
      this.winner = null;
      this.$store.commit("player/setWonLastBattle", false);
      this.$store.commit("player/resetRound");
      this.$router.push("/village");
    },

    onMonsterSelected(monster) {
      this.$store.commit("monster/setName", monster.name);
      this.$store.commit("monster/setHp", monster.hp);
      this.showMonsterDialog = false;
      this.winner = null;
    },
  },

  mounted() {
    // monster setup
    const monsterName = this.$store.getters["monster/getMonsterName"];
    const monsterHp = this.$store.getters["monster/getMonsterHp"];

    if (!monsterName || monsterHp <= 0) {
      this.showMonsterDialog = true;

      if (
        !this.$store.getters["monster/getNextMonsters"] ||
        this.$store.getters["monster/getNextMonsters"].length === 0
      ) {
        this.$store.dispatch("monster/selectNextMonsters");
      }
    }

    // try to autoplay muted
    this.battleAudio.currentTime = 0;
    this.battleAudio.loop = true;
    this.battleAudio.volume = 0;
    this.battleAudio.play().catch(() => {
      console.log("Autoplay blocked");
    });

    // attach unlock listener
    window.addEventListener("click", this.unlockAudio);
  },

  unmounted() {
    this.battleAudio.pause();
    window.removeEventListener("click", this.unlockAudio);
  },
};
</script>

<style scoped>
.layout-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 2rem;
  max-width: 1000px;
  margin-left: 23%;
  box-sizing: border-box;
}

.left-column {
  display: flex;
  flex-direction: column;
}

.right-column {
  all: unset;
  display: flex;
  justify-content: center;
  background-image: url(../../assets/images/background-log.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 12px;
  padding: 1rem;
  max-height: 790px;
  width: 460px;
  overflow-y: auto;
  box-sizing: border-box;
  margin-top: 1.5rem;
}

#game {
  margin-top: -70px;
}

@media (max-width: 768px) {
  .layout-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
    gap: 1rem;
  }

  .right-column {
    max-height: none;
    padding: 1rem;
  }
}

.dialog-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.dialog-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.dialog-enter-active {
  transition: all 0.3s ease-out;
}
.dialog-leave-active {
  transition: all 0.3s ease-in;
}
.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.dialog-status-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.dialog-status-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.dialog-status-enter-active {
  transition: all 0.5s ease-out;
}
.dialog-status-leave-active {
  transition: all 0.5s ease-in;
}
.dialog-status-enter-to,
.dialog-status-leave-from {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 480px) {
  .layout-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
    margin-left: 0;
  }

  .left-column {
    width: 100%;
    transform: translateY(-23%);
  }

  .right-column {
    padding: 0.5rem;
    max-width: 340px;
    max-height: 198px;
    overflow-y: auto;
    font-size: 0.85rem;
    background-size: 100% 100%;
    margin-left: 1rem;
    border-image-source: url("../../assets/images/background-log.png");
    border-image-slice: 0 0 0 0 fill;
    margin-top: -24rem;
    position: flex;
    z-index: 3;
  }

  #game {
    margin-top: -2rem;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .layout-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    margin-left: 0;
  }

  .left-column,
  .right-column {
    width: 100%;
  }

  .right-column {
    max-height: 300px;
    padding: 1rem;
    font-size: 0.9rem;
    margin-top: 1rem;
    border-image-source: url("../../assets/images/background-log.png");
    border-image-slice: 5 0 5 0 fill;
    transform: translateY(10%);
  }

  #game {
    margin-top: -60px;
  }
}
</style>
