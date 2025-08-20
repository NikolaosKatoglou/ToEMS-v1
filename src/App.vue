<template>
  <div class="app-container">
    <TheHeader />
    <transition name="fade">
      <TeleportSpinner v-if="isLoading" />
    </transition>

    <main class="content">
      <router-view />
    </main>

    <TheFooter />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import TheHeader from "./components/layout/TheHeader.vue";
import TheFooter from "./components/ui/TheFooter.vue";
import TeleportSpinner from "./components/layout/TeleportSpinner.vue";

export default {
  name: "App",
  components: {
    TheHeader,
    TheFooter,
    TeleportSpinner,
  },
  setup() {
    const isLoading = ref(false);
    const router = useRouter();

    onMounted(() => {
      router.beforeEach((to, from, next) => {
        isLoading.value = true;  
        next();
      });

      router.afterEach(() => {
        setTimeout(() => {
          isLoading.value = false;  
        }, 1000);
      });
    });

    return {
      isLoading,
    };
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Metamorphous&display=swap');

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

body {
  background-color: transparent;
}

* {
  box-sizing: border-box;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: "Metamorphous", serif;
  font-weight: 400;
  background-image: url(../src/assets/images/reforged-pergament-scaled.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  background-attachment: fixed;
}

html {
  font-size: 15px;
}

.content {
  flex: 1;
  padding: 1rem;
  max-width: 100%;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
</style>
