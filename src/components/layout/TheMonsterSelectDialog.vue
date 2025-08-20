<template>
  <div class="dialog-overlay" @click="handleOverlayClick">
    <TheMonsterContent
      @selected="selectMonster"
      @visit-village="visitVillage"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
// import { useRoute } from "vue-router";
import TheMonsterContent from "./TheMonsterContent.vue";

const store = useStore();
// const route = useRoute();

const emit = defineEmits(["selected", "visit-village", "close"]);
const wonLastBattle = computed(() => store.state.player.wonLastBattle);

function handleOverlayClick() {
  if (!wonLastBattle.value) {
    emit("close");
  }
}

// function for monster selection
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

// function to go back to the village
function visitVillage() {
  store.commit("player/setWonLastBattle", false);
  emit("visit-village");
}
</script>

<style scoped>.congrats {
  color: goldenrod;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog {
  padding: 5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  max-width: 450px;
  height: 75%;
  width: 55%;
  text-align: center;
  background-image: url(../../assets/images/dialog.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}


@media (max-width: 480px) {
  .dialog {
    padding: 2.5rem;
    width: 90%;
    height: 65%;
    max-width: none;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .dialog {
    padding: 3rem;
    width: 70%;
    height: 80%;
    max-width: 400px;
  }
}

</style>
