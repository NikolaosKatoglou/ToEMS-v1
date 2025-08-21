<template>
  <div class="dialog">
    <h2 v-if="wonLastBattle">You won the battle!</h2>
    <p v-if="wonLastBattle" class="exp-message">
      You gained {{ expReward }} Exp.
    </p>
    <h3 v-if="leveledUp && wonLastBattle" class="congrats">
      Congratulations !
    </h3>
    <h3 v-if="leveledUp && wonLastBattle" class="congrats">You leveled Up!</h3>
    <h3>- Select the next target -</h3>
    <ul class="monster-list">
      <li v-for="(monster, i) in nextMonsters" :key="i" class="monster-item">
        <div class="monster-level">Level: {{ monster.level }}</div>
        <button
          class="select-button"
          @click="
            buttonClick();
            selectMonster(monster);
          "
        >
          <span class="monster-name"> {{ monster.name }}</span>
        </button>
      </li>
    </ul>
    <div v-if="!isInVillage">- Or go back to village -</div>
    <button
      v-if="!isInVillage"
      class="visit-village-button"
      @click="
        {
          visitVillage();
          buttonClick();
        }
      "
    >
      <span class="visit-village-text"> Visit Village</span>
    </button>
  </div>
</template>

<script setup>
import { computed, defineProps, ref, onMounted} from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { calcFinalExp } from "../../store/modules/helpers/playerHelpers";
import buttonAudio from "../../assets/audio/button-click.wav";


defineProps({ showExp: Boolean });

const store = useStore();
const route = useRoute();

const clickAudio = ref(null);


const nextMonsters = computed(() => store.getters["monster/getNextMonsters"]);
const leveledUp = computed(() => store.getters["player/getPlayerLeveledUp"]);
const emit = defineEmits(["selected", "visit-village"]);
const wonLastBattle = computed(() => store.state.player.wonLastBattle);
const isInVillage = computed(() => route.path === "/village");
const monsterName = computed(() => store.getters["monster/getMonsterName"]);
const monsterLevel = computed(() => store.getters["monster/getMonsterLevel"]);
const expReward = computed(() => {
  return calcFinalExp(monsterLevel.value, monsterName.value);
});

onMounted(() => {
  clickAudio.value = new Audio(buttonAudio);
  clickAudio.value.volume = 0.08;
});



function buttonClick() {
  if (clickAudio.value) clickAudio.value.currentTime = 0;
  clickAudio.value.play();
}

function selectMonster(monster) {
  store.commit("monster/setName", monster.name);
  store.commit("monster/setHp", monster.hp);
  store.commit("monster/setMaxHp", monster.hp);
  store.commit("monster/setLevel", monster.level);
  store.commit("player/setRage", 0);
  emit("selected", monster);
  store.commit("player/resetPlayerLeveledUp");
  store.commit("player/setWonLastBattle", false);
}

function visitVillage() {
  store.commit("player/setWonLastBattle", false);
  emit("visit-village");
}
</script>

<style scoped>
.congrats {
  color: goldenrod;
}

.monster-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.monster-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.monster-level {
  font-weight: bold;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  color: #000000;
}

.select-button {
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(../../assets/images/GlueScreen-Button1-Border3right.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  padding: 0 0.5rem;
  min-width: 250px;
  max-width: 400px;
  width: auto;
  min-height: 45px;
  height: auto;
  color: goldenrod;
  font-family: inherit;
  font-size: 1rem;
  text-align: center;
  cursor: pointer;
  text-shadow: 1px 1px 2px black;
  transition: filter 0.2s ease;
  transform: translateX(3px);
  white-space: normal;
}

.monster-name {
  margin-left: -17px;
  text-align: center;
  word-break: break-word;
  overflow: visible;
  text-overflow: unset;
  white-space: normal;
}

.visit-village-button {
  all: unset;
  justify-content: center;
  align-items: center;
  background-image: url(../../assets/images/GlueScreen-Button1-Border3.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  width: 160px;
  height: 55px;
  color: goldenrod;
  font-family: inherit;
  font-size: 1rem;
  text-align: center;
  cursor: pointer;
  text-shadow: 1px 1px 2px black;
  transition: filter 0.2s ease;
  transform: translateX(-13px);
}

.visit-village-text {
  margin-left: 18px;
}

.select-button:hover,
.select-button:focus,
.visit-village-button:hover,
.visit-village-button:focus {
  filter: brightness(1.2);
}

.exp-message {
  font-size: 1rem;
  color: #3a00d8;
  margin-bottom: 0.5rem;
}
</style>
