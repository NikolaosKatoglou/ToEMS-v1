<template>
  <div class="dialog-status-overlay">
    <section class="gameover-card">
      <h2 v-if="winner.toLowerCase() === 'draw'">It's a Draw!</h2>
      <h2 v-else-if="winner.toLowerCase() === 'player'">You won!</h2>
      <h2 v-else>{{ winner }} Wins!</h2>
      <button
        @click="
          $emit('restart');
          buttonClick();
        "
      >
        <span class="visit-village-text"> Visit Village</span>
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import buttonAudio from "../../assets/audio/button-click.wav";
defineProps({
  winner: String,
});
const emit = defineEmits(["restart"]);
const clickAudio = ref(null);

onMounted(() => {
  clickAudio.value = new Audio(buttonAudio);
  clickAudio.value.volume = 0.02;
});

function buttonClick() {
  if (clickAudio.value) clickAudio.value.currentTime = 0;
  clickAudio.value.play();
}
</script>

<style scoped>
.dialog-status-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 12;
}

.gameover-card {
  padding: 4rem;
  border-radius: 8px;
  max-width: 100%;
  width: 30%;
  text-align: center;
  background-image: url(../../assets/images/dialog-defeat.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  overflow: hidden;
}

button {
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

button:hover,
button:focus {
  filter: brightness(1.2);
}

.visit-village-text {
  margin-left: 18px;
}

.gameover-card h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: black;
}

@media (max-width: 768px) {
  .gameover-card {
    padding: 3rem;
    width: 90%;
  }

  button {
    width: 140px;
    height: 45px;
  }
}
</style>
