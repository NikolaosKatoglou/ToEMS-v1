<template>
  <section>
    <div class="content">
      <h2 class="not-found">You've wandered too far!</h2>
      <p>
        Head back to the
        <span
          @click="
            goToVillage();
            buttonClick();
          "
          class="village-button"
        >
          <span class="visit-village-text">Village</span>
        </span>
      </p>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted, onBeforeUnmount } from "vue";
import lostTheme from "../../assets/audio/lost-audio.mp3";
import buttonAudio from "../../assets/audio/button-click.wav";

const router = useRouter();
const lostAudio = ref(null);
const clickAudio = ref(null);

const startLostAudio = () => {
  if (!lostAudio.value) return;

  const targetVolume = 0.02;
  const duration = 2000; // fade over 2s
  const step = targetVolume / (duration / 50);

  lostAudio.value.volume = 0;

  return lostAudio.value.play().then(() => {
    const fadeIn = setInterval(() => {
      if (lostAudio.value) {
        if (lostAudio.value.volume < targetVolume) {
          lostAudio.value.volume = Math.min(
            lostAudio.value.volume + step,
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
  startLostAudio();
  window.removeEventListener("click", enableAudio);
};

onMounted(() => {
  lostAudio.value = new Audio(lostTheme);
  lostAudio.value.loop = true;

  clickAudio.value = new Audio(buttonAudio);
  clickAudio.value.volume = 0.02;

  // try autoplay first
  startLostAudio().catch(() => {
    // attach listener if autoplay was blocked
    window.addEventListener("click", enableAudio);
  });
});

onBeforeUnmount(() => {
  if (lostAudio.value) {
    lostAudio.value.pause();
    lostAudio.value = null;
  }
  window.removeEventListener("click", enableAudio);
});

function buttonClick() {
  if (clickAudio.value) clickAudio.value.currentTime = 0;
  clickAudio.value.play();
}

const goToVillage = () => {
  router.push("/village");
};
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  text-align: center;
}

.not-found {
  padding: 1rem;
  font-size: 1.5rem;
  line-height: 1.3;
}

h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.1rem;
  margin: 0;
}

.village-button {
  all: unset;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 50px;
  margin-left: 1rem;
  background-image: url(../../assets/images/GlueScreen-Button1-Border3.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  color: goldenrod;
  font-family: inherit;
  font-size: 1.1rem;
  text-align: center;
  cursor: pointer;
  text-shadow: 1px 1px 2px black;
  transition: filter 0.2s ease;
  transform: translateX(-13px);
}

.visit-village-text {
  margin-left: 18px;
}

.village-button:hover,
.village-button:active {
  filter: brightness(1.2);
}

@media (max-width: 600px) {
  h2 {
    font-size: 1.5rem;
  }

  .village-button {
    width: 100%;
    max-width: 200px;
  }
}
</style>
