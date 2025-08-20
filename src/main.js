import { createApp } from "vue";
import App from "./App.vue";
import store from "./store/index";
import router from "./router/index";
import { auth } from "./firebase"; 
import { onAuthStateChanged } from "firebase/auth";

let appInitialized = false;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    store.commit("user/setUser", user);

    if (router.currentRoute.value.path === "/") {
      // router.push("/village");
    }
  } else {
    store.commit("user/clearUser");
    store.commit("player/reset");
    store.commit("monster/reset");
  }

  if (!appInitialized) {
    const app = createApp(App);
    app.use(store);
    app.use(router);
    app.mount("#app");
    appInitialized = true;
  }
});
