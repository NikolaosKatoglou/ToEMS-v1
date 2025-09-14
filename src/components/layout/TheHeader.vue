<template>
  <div>
    <header class="main-header">
      <h1>Tales of Endless Monster Slaying</h1>
    </header>

    <div v-if="isLoggedIn">
      <button
        @click="
          logout();
          buttonClick();
        "
        class="logout-btn"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";
import buttonAudio from "../../assets/audio/button-click.wav";

const router = useRouter();
const store = useStore();
const isLoggedIn = computed(() => store.getters["user/isLoggedIn"]);
const clickAudio = ref(null);

onMounted(() => ((clickAudio.value = new Audio(buttonAudio)).volume = 0.02));

const logout = async () => {
  try {
    await signOut(auth);
    store.commit("player/reset");
    store.commit("monster/reset");
    localStorage.removeItem("playerData");
    localStorage.removeItem("monster");
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

function buttonClick() {
  if (clickAudio.value) clickAudio.value.currentTime = 0;
  clickAudio.value.play();
}
</script>

<style scoped>
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(../../assets/images/bnet-userlist-mod-back.png);
  background-size: 78% 100%;
  background-repeat: no-repeat;
  background-position: center;
  height: 5rem;
  color: goldenrod;
  font-family: inherit;
  text-align: center;
  text-shadow: 1px 1px 2px black;
  transition: filter 0.2s ease;
  max-width: 100%;
  z-index: 5;
}

h1 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  margin: 0;
  padding: 0 1rem;
}

.logout-btn {
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(../../assets/images/GlueScreen-Button1-Border3.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 150px;
  height: 45px;
  color: goldenrod;
  font-family: inherit;
  font-size: 1rem;
  text-align: center;
  cursor: pointer;
  text-shadow: 1px 1px 2px black;
  transition: filter 0.2s ease;
  transform: translateX(35%) translateY(50%);
  position: relative;
  z-index: 10;
}

.logout-btn:hover {
  filter: brightness(1.2);
}

@media (max-width: 768px) {
  .main-header {
    background-size: 85% 100%;
    height: 4.2rem;
  }

  h1 {
    font-size: 1.6rem;
    padding: 0 0.5rem;
  }

  .logout-btn {
    width: 120px;
    height: 42px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .main-header {
    width: 100%;
    background-size: 100% 100%;
    height: 4rem;
  }

  h1 {
    font-size: 1.3rem;
    padding: 0 0.5rem;
  }

  .logout-btn {
    width: 110px;
    height: 40px;
    font-size: 0.8rem;
    margin-top: 2.5rem;
  }
}
</style>
