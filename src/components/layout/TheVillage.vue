<template>
  <div class="village-name">
    <h2>Welcome to the Village!</h2>

    <div class="village-buttons">
      <button
        @click="
          buttonClick();
          toggleMonsterSelect();
        "
      >
        Go Slaying
      </button>
      <button
        @click="
          buttonClick();
          toggleStats();
        "
      >
        View Stats
      </button>
      <button
        @click="
          buttonClick();
          toggleGameInfo();
        "
      >
        Game Info
      </button>
    </div>
  </div>

  <transition name="fade-slide">
    <section v-if="showCard" class="village-card">
      <TheSlider :show="showStats">
        <div class="player-stats">
          <h3>{{ name }} Stats</h3>
          <ul>
            <li><strong>🥇 Level: </strong> {{ level }}</li>
            <li><strong>❤️ Max HP: </strong> {{ maxHp }}</li>
            <li><strong>❤️ Current HP: </strong> {{ hp }}</li>
            <li><strong>🌟 EXP: </strong> {{ exp }}/{{ expRequired }}</li>
            <li>
              <strong>⚔️ Special Attacks: </strong>
              {{ specialAttacks[0] }}
            </li>
            <li><strong>🗡️ Monsters Slain: </strong>{{ monstersSlain }}</li>
            <li><strong>💀 Deaths: </strong>{{ playerDeaths }}</li>
          </ul>
          <div class="button-row">
            <button
              @click="
                buttonClick();
                showNamePopup = true;
              "
              class="change-name"
            >
              Change Name
            </button>
            <button
              @click="
                buttonClick();
                showClearPopup = true;
              "
              class="clear-button"
            >
              Clear all Stats
            </button>
          </div>
        </div>
      </TheSlider>

      <TheSlider :show="showGameInfo">
        <TheGameInfo class="game-info" />
      </TheSlider>

      <TheSlider :show="showMonsterDialog">
        <TheMonsterContent @selected="onMonsterSelected" />
      </TheSlider>

      <transition name="dialog">
        <teleport to="body">
          <ClearDataPopup
            :show="showClearPopup"
            @confirm="clearStorage"
            @close="showClearPopup = false"
            :onButtonClick="buttonClick()"
        /></teleport>
      </transition>

      <transition name="dialog">
        <teleport to="body">
          <NameChangePopup
            :show="showNamePopup"
            @close="showNamePopup = false"
            :onButtonClick="buttonClick()"
          />
        </teleport>
      </transition>
    </section>
  </transition>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, computed, onMounted, watch, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import TheGameInfo from "./TheGameInfo.vue";
import ClearDataPopup from "../ui/ClearDataPopup.vue";
import TheSlider from "../ui/TheSlider.vue";
import TheMonsterContent from "./TheMonsterContent.vue";
import { doc, updateDoc, deleteField } from "firebase/firestore";
import { auth, db } from "../../firebase";
import NameChangePopup from "../ui/NameChangePopup.vue";
import questAudio from "../../assets/audio/quest-audio.wav";
import villageAudio from "../../assets/audio/audio-village2.mp3";
import popDownAudio from "../../assets/audio/dialog-pop-down.wav";
import buttonAudio from "../../assets/audio/button-click.wav";

const showClearPopup = ref(false);
const showGameInfo = ref(false);
const showStats = ref(false);
const showMonsterDialog = ref(false);
const showNamePopup = ref(false);
const questLog = ref(null);
const bgAudio = ref(null);
const downAudio = ref(null);
const clickAudio = ref(null);

function getExpRequired(level) {
  const baseExp = 100;
  const multiplier = 1.3;
  return Math.floor(baseExp * Math.pow(multiplier, level - 1));
}

const store = useStore();
const route = useRouter();

// bg audio
const startBgAudio = () => {
  if (!bgAudio.value) return;

  const targetVolume = 0.1;
  const duration = 2000; // fade over 2s
  const step = targetVolume / (duration / 50);

  bgAudio.value.volume = 0; // start at 0

  return bgAudio.value.play().then(() => {
    const fadeIn = setInterval(() => {
      if (bgAudio.value) {
        if (bgAudio.value.volume < targetVolume) {
          bgAudio.value.volume = Math.min(
            bgAudio.value.volume + step,
            targetVolume
          );
        } else {
          clearInterval(fadeIn);
        }
      }
    }, 50);
  });
};

const enableAudio = () => {
  startBgAudio();
  window.removeEventListener("click", enableAudio);
};

onMounted(() => {
  const maxHp = store.getters["player/getPlayerMaxHp"];
  store.commit("player/setHp", maxHp);
  bgAudio.value = new Audio(villageAudio);
  bgAudio.value.loop = true;

  clickAudio.value = new Audio(buttonAudio);
  clickAudio.value.volume = 0.06;
  downAudio.value = new Audio(popDownAudio);
  downAudio.value.volume = 0.06;

  // try autoplay first
  startBgAudio().catch(() => {
    // attach listener if autoplay was blocked
    window.addEventListener("click", enableAudio);
  });
});

onBeforeUnmount(() => {
  if (bgAudio.value) {
    bgAudio.value.pause();
    bgAudio.value = null;
  }
  window.removeEventListener("click", enableAudio);
});

// show stats
const name = computed(() => store.getters["player/getPlayerName"]);
const level = computed(() => store.getters["player/getPlayerLevel"]);
const hp = computed(() => store.getters["player/getPlayerHp"]);
const maxHp = computed(() => store.getters["player/getPlayerMaxHp"]);
const exp = computed(() => store.getters["player/getPlayerExp"]);
const expRequired = computed(() => getExpRequired(level.value));
const monstersSlain = computed(() => store.getters["player/getMonstersSlain"]);
const playerDeaths = computed(() => store.getters["player/getPlayerDeaths"]);
const specialAttacks = computed(() => {
  const levelVal = level.value;
  if (levelVal >= 25) {
    return ["⚡ Thunder Strike (30 Rage)"];
  } else if (levelVal >= 15) {
    return ["💥 Deep Strike (25 Rage)"];
  } else {
    return ["🔥 Rage Strike (15 Rage)"];
  }
});
const showCard = computed(
  () => showStats.value || showGameInfo.value || showMonsterDialog.value
);

watch(
  [showStats, showGameInfo, showMonsterDialog],
  ([stats, gameInfo, monsterDialog]) => {
    if (stats || gameInfo || monsterDialog) {
      setTimeout(() => {
        questLog.value = new Audio(questAudio);
        questLog.value.volume = 0.06;
        questLog.value.play();
      }, 100);
    }
  }
);

function buttonClick() {
  if (clickAudio.value) clickAudio.value.currentTime = 0;
  clickAudio.value.play();
}

function toggleStats() {
  if (!showStats.value) {
    showMonsterDialog.value = false;
    showGameInfo.value = false;
  }

  showStats.value = !showStats.value;
}

function toggleGameInfo() {
  if (!showGameInfo.value) {
    showStats.value = false;
    showMonsterDialog.value = false;
  }

  showGameInfo.value = !showGameInfo.value;
}

function toggleMonsterSelect() {
  if (!showMonsterDialog.value) {
    showStats.value = false;
    showGameInfo.value = false;

    store.dispatch("monster/selectNextMonsters");
  }

  showMonsterDialog.value = !showMonsterDialog.value;
}

async function clearStorage() {
  try {
    localStorage.removeItem("playerData");
    localStorage.removeItem("monster");

    store.commit("player/reset");
    store.commit("monster/reset");

    const userId = auth.currentUser.uid;
    const userDocRef = doc(db, "users", userId);

    await updateDoc(userDocRef, {
      player: deleteField(),
      monster: deleteField(),
    });
  } catch (error) {
    console.error("Failed to delete player stats in Firestore:", error);
  } finally {
    showClearPopup.value = false;
  }
}

function onMonsterSelected(monster) {
  store.commit("monster/setName", monster.name);
  store.commit("monster/setHp", monster.hp);
  store.commit("monster/setMaxHp", monster.hp);
  store.commit("monster/setLevel", monster.level);
  store.commit("player/setRage", 0);
  showMonsterDialog.value = false;
  route.push("/battle");
}
</script>

<style scoped>
.village-name {
  margin-top: 1rem;
  padding: 2rem;
  background-image: url(../../assets/images/village-name-border.png);
  background-size: 35% 70%;
  background-repeat: no-repeat;
  background-position: center;
  text-align: center;
}

.village-card {
  border-width: 50px 0;
  border-style: solid;
  border-image-source: url("../../assets/images/village-border-chains.png");
  border-image-slice: 100 0 100 0 fill;
  border-image-repeat: stretch;
  padding: 1.5rem 1rem;
  border-radius: 9px;
  text-align: center;
  max-width: 50%;
  margin: -1rem auto;
  box-sizing: border-box;
  max-height: 450px;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  /* opacity: 0; */
  max-height: 0;
  transition: all ease;
}

.fade-slide-enter-active {
  transition: all 1s ease;
  overflow: hidden;
}
.fade-slide-leave-active {
  transition: all 1s ease;
  opacity: 0;
  overflow: hidden;
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  max-height: 450px;
}

.village-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

button {
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(../../assets/images/GlueScreen-Button1-LargeBorderSingle.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 175px;
  height: 50px;
  color: goldenrod;
  font-family: inherit;
  font-size: 1rem;
  text-align: center;
  cursor: pointer;
  text-shadow: 1px 1px 2px black;
  transition: filter 0.2s ease;
}

button:hover {
  filter: brightness(1.2);
}

button:active {
  filter: brightness(0.8);
}

.button-row {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 0.3rem;
  gap: 20rem;
}

.change-name,
.clear-button {
  font-size: 0.8rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

.clear-stats {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.player-stats {
  margin-left: 8rem;
  text-align: left;
  font-size: 0.9rem;
  line-height: 2;
  overflow: hidden;
}

.player-stats ul {
  list-style: none;
  padding: 0;
}

@media (max-width: 480px) {
  .village-name {
    margin-top: -2rem;
    padding: 3rem;
    background-size: 85% 70%;
    background-repeat: no-repeat;
    background-position: center;
    text-align: center;
  }

  .village-card {
    padding: 1rem 0.75rem;
    max-width: 100%;
    max-height: 600px;
    border-width: 40px 0;
    border-image-slice: 130 0 130 0 fill;
    margin-bottom: 5rem;
  }

  .village-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.2rem;
  }

  .button-row {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 0.3rem;
    gap: 1rem;
  }

  button {
    padding: 0.5rem 0.5rem;
    font-size: 0.75rem;
    min-width: 100px;
    max-width: 120px;
  }

  .player-stats {
    margin-left: 3rem;
    text-align: left;
    font-size: 0.8rem;
    line-height: 2;
    overflow: hidden;
  }

  .game-info {
    padding: 2rem;
  }

  .clear-stats {
    justify-content: center;
  }

  .fade-slide-enter-from,
  .fade-slide-leave-to {
    opacity: 0;
    max-height: 0;
  }

  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 1s ease;
    overflow: hidden;
  }

  .fade-slide-enter-to,
  .fade-slide-leave-from {
    opacity: 1;
    max-height: 420px;
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
  transition: all 0.2s ease-out;
}
.dialog-leave-active {
  transition: all 0.2s ease-in;
}
.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
