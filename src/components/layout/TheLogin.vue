<template>
  <div class="login-screen">
    <div class="doors-wrapper">
      <div :class="['door left-door', doorsOpen ? 'open' : '']"></div>
      <div :class="['door right-door', doorsOpen ? 'open' : '']"></div>

      <img
        v-if="showEyes"
        src="../../assets/images/GlowStarLeft.png"
        alt="Lion Eyes Glow"
        class="lion-left-eye-glow"
      />
      <img
        v-if="showEyes"
        src="../../assets/images/GlowStarRight.png"
        alt="Lion Eyes Glow"
        class="lion-right-eye-glow"
      />

      <div class="login-container" v-if="showLoginForm">
        <h2>{{ mode === "login" ? "Login" : "Signup" }}</h2>

        <form @submit.prevent="submitForm">
          <div class="form-control">
            <label for="email">Email</label>
            <input
              placeholder="email"
              id="email"
              type="email"
              v-model.trim="email"
              autocomplete="email"
              required
            />
          </div>

          <div v-if="!formIsValid" class="error-msg">
            Please enter a valid email and password (at least 6 characters).
          </div>

          <div class="form-control">
            <label for="password">Password</label>
            <input
              placeholder="password"
              id="password"
              type="password"
              v-model="password"
              autocomplete="current-password"
              required
            />
          </div>

          <button type="submit" :disabled="isLoading" @click="buttonClick">
            {{ mode === "login" ? "Login" : "Signup" }}
          </button>

          <button
            type="button"
            class="toggle-btn"
            @click="
              buttonClick();
              switchAuthMode();
            "
            :disabled="isLoading"
          >
            {{ mode === "login" ? "Signup instead" : "Login instead" }}
          </button>

          <p v-if="error" class="error-msg">{{ error }}</p>
          <p v-if="isLoading" class="loading-msg">Authenticating...</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import audioLogin from "../../assets/audio/audio-intro-elf-1.mp3";
import doorOpen from "../../assets/audio/doors.wav";
import buttonAudio from "../../assets/audio/button-click.wav";

const router = useRouter();
const store = useStore();

const email = ref("");
const password = ref("");
const mode = ref("login");
const isLoading = ref(false);
const error = ref(null);
const formIsValid = ref(true);
const doorsOpen = ref(false);
const showLoginForm = ref(true);
const showEyes = ref(false);
const bgAudio = ref(null);
const doorAudio = ref(null);
const clickAudio = ref(null);

// bg audio
const startBgAudio = () => {
  if (!bgAudio.value) return;

  const targetVolume = 0.02;
  const duration = 2000; // fade over 2s
  const step = targetVolume / (duration / 50);

  bgAudio.value.volume = 0;

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
  bgAudio.value = new Audio(audioLogin);
  bgAudio.value.loop = true;

  clickAudio.value = new Audio(buttonAudio);
  clickAudio.value.volume = 0.02;

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

function buttonClick() {
  if (clickAudio.value) clickAudio.value.currentTime = 0;
  clickAudio.value.play();
}

function switchAuthMode() {
  mode.value = mode.value === "login" ? "signup" : "login";
  error.value = null;
  formIsValid.value = true;
  email.value = "";
  password.value = "";
}

async function submitForm() {
  formIsValid.value = true;
  error.value = null;

  if (!email.value.includes("@") || password.value.length < 6) {
    formIsValid.value = false;
    return;
  }

  isLoading.value = true;

  try {
    let userCredential;

    if (mode.value === "signup") {
      userCredential = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );

      const playerState = store.state.player;
      const monsterState = store.state.monster;

      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email.value,
        player: { ...playerState },
        monster: { ...monsterState },
        createdAt: new Date(),
      });
    } else {
      userCredential = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
    }

    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      store.commit("player/restoreFromStorage", userData.player);
      if (userData.monster) {
        store.commit("monster/restoreFromStorage", userData.monster);
      }
      await store.dispatch("monster/selectNextMonsters");
    }

    email.value = "";
    password.value = "";
    showLoginForm.value = false;

    showEyes.value = true;
    setTimeout(() => {
      showEyes.value = false;
    }, 500);

    setTimeout(() => {
      doorAudio.value = new Audio(doorOpen);
      doorAudio.value.play();
      doorAudio.value.volume = 0.04;
      doorsOpen.value = true;
      setTimeout(() => {
        router.push("/village");
      }, 1200); // match door animation duration
    }, 600); // small delay so form vanishes first
  } catch (err) {
    error.value = "Failed to authenticate, try again later.";
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.login-screen {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: calc(100dvh - 20rem);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.doors-wrapper {
  position: relative;
  width: 100vw;
  max-width: 650px;
  height: 340px;
  margin: 0 auto;
}

.door {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: auto 100%;
  transition: transform 1.2s ease-in-out;
  transform: translate(-27%);
}

.left-door {
  left: 5.7%;
  background-image: url("../../assets/images/door left1.png");
  z-index: 1;
}

.right-door {
  left: 41.2%;
  background-image: url("../../assets/images/door right1.png");
  z-index: 2;
}

.left-door.open {
  transform: scale(1.9) translateX(-150%);
}

.right-door.open {
  transform: scale(1.9) translateX(150%);
}

.login-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  width: 80%;
  max-width: 400px;
  padding: 1.5rem 1rem;
  font-family: inherit;
}

.lion-left-eye-glow {
  position: absolute;
  top: 46.5%;
  left: 45.5%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: auto;
  pointer-events: none;
  z-index: 4;
}

.lion-right-eye-glow {
  position: absolute;
  top: 46.5%;
  left: 51.5%;
  transform: translate(-50%, -50%);
  width: 32.5px;
  height: auto;
  pointer-events: none;
  z-index: 4;
}

h2 {
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(../../assets/images/bnet-userlist-mod-back.png);
  background-size: 80% 100%;
  background-repeat: no-repeat;
  background-position: center;
  height: 2.5rem;
  margin: 0.5rem auto;
  color: goldenrod;
  font-family: inherit;
  text-align: center;
  text-shadow: 1px 1px 2px black;
  transition: filter 0.2s ease;
  max-width: 100%;
  transform: translateX(-10px);
}

.form-control {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: bold;
  color: goldenrod;
  transform: translateX(5px);
}

input {
  width: 100%;
  padding: 0.3rem;
  font-size: 1rem;
  transform: translateX(-10px);
  border: 1px solid #000000;
  border-radius: 12px;
  box-sizing: border-box;
  background-color: rgb(218, 193, 157);
}

input:focus {
  outline: none;
  border-color: #000000;
  box-shadow: 0 0 5px #000000;
}

button[type="submit"],
.toggle-btn {
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(../../assets/images/GlueScreen-Button1-LargeBorderSingle.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 205px;
  height: 45px;
  transform: translateX(35%);
  color: goldenrod;
  font-family: inherit;
  font-size: 1rem;
  text-align: center;
  cursor: pointer;
  text-shadow: 1px 1px 2px black;
  transition: filter 0.2s ease;
}

button[type="submit"]:hover:not(:disabled),
.toggle-btn:hover:not(:disabled) {
  filter: brightness(1.3);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-btn {
  background-color: transparent;
  color: goldenrod;
  text-decoration: underline;
  padding: 0;
  margin-top: 0;
}

.toggle-btn:hover:not(:disabled) {
  background-color: transparent;
  text-decoration: underline;
}

.error-msg {
  color: red;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
  transform: translateX(-13px) translateY(-20px);
}

.loading-msg {
  color: goldenrod;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
  transform: translateX(-13px) translateY(-20px);
}

@media (max-width: 480px) {
  .doors-wrapper {
    max-width: 100vw;
    height: 280px;
    margin: 0 auto;
  }

  .door {
    width: 100%;
    height: 100%;
    transform-origin: bottom center;
    transform: scale(0.8) translateX(-30%);
    transition: transform 1.2s ease-in-out;
  }

  .left-door {
    left: 3.2%;
  }
  .left-door.open {
    transform: scale(1.4) translateX(-110%);
  }

  .right-door {
    left: 41.2%;
  }
  .right-door.open {
    transform: scale(1.4) translateX(90%);
  }

  .login-container {
    width: 50%;
    max-width: 320px;
    padding: 1rem 0.5rem;
    top: 55%;
    left: 50%;
    transform: translate(-53%, -50%);
    font-size: 0.9rem;
  }

  .lion-left-eye-glow {
    top: 57.5%;
    left: 48.5%;
    width: 26px;
  }

  .lion-right-eye-glow {
    top: 57.5%;
    left: 53%;
    width: 26px;
  }

  h2 {
    font-size: 1.2rem;
    height: 2rem;
    background-size: 70% 100%;
    transform: translateX(10px) translateY(5px);
  }

  label {
    font-size: 0.9rem;
    transform: translateX(3px);
  }

  input {
    font-size: 0.9rem;
    transform: translateX(5px);
    padding: 0.25rem;
  }

  button[type="submit"],
  .toggle-btn {
    width: 170px;
    height: 38px;
    font-size: 0.9rem;
    transform: translateX(5%) translateY(-30%);
  }

  .error-msg,
  .loading-msg {
    font-size: 0.85rem;
    transform: translateX(2px) translateY(-16px);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .doors-wrapper {
    max-width: 90vw;
    height: 310px;
    margin: 0 auto;
  }

  .door {
    width: 100%;
    height: 100%;
    background-size: auto 100%;
    transform-origin: bottom center;
    transform: scale(0.9) translateX(-27%);
    transition: transform 1.2s ease-in-out;
  }

  .left-door {
    left: 5.7%;
  }
  .left-door.open {
    transform: scale(1.4) translateX(-10%);
  }

  .right-door {
    left: 41.2%;
  }
  .right-door.open {
    transform: scale(1.4) translateX(90%);
  }

  .login-container {
    width: 85%;
    max-width: 360px;
    padding: 1.2rem 1rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1rem;
  }

  .lion-left-eye-glow {
    top: 46.5%;
    left: 45.5%;
    width: 27px;
  }

  .lion-right-eye-glow {
    top: 46.5%;
    left: 52%;
    width: 29px;
  }

  h2 {
    font-size: 1.4rem;
    height: 2.3rem;
    background-size: 75% 100%;
    transform: translateX(-9px);
  }

  label {
    font-size: 1rem;
    transform: translateX(4px);
  }

  input {
    font-size: 1rem;
    transform: translateX(-9px);
    padding: 0.3rem;
  }

  button[type="submit"],
  .toggle-btn {
    width: 190px;
    height: 42px;
    font-size: 1rem;
    transform: translateX(32%);
  }

  .error-msg,
  .loading-msg {
    font-size: 0.9rem;
    transform: translateX(-11px) translateY(-18px);
  }
}
</style>
