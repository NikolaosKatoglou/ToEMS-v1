import { createRouter, createWebHistory } from "vue-router";
import { auth } from "../firebase";
import TheLogin from "../components/layout/TheLogin.vue";
import TheVillage from "../components/layout/TheVillage.vue";
import TheGameLayout from "../components/layout/TheGameLayout.vue";
import NotFound from "../components/layout/NotFound.vue";


let isAuthResolved = false;

const routes = [
  {
    path: "/",
    redirect: "/login", // default landing page
  },
  {
    path: "/login",
    component: TheLogin,
  },
  {
    path: "/village",
    name: "Village",
    component: TheVillage,
    meta:{requiresAuth:true}
  },
  {
    path: "/battle",
    name: "Battle",
    component: TheGameLayout,
    meta: { requiresAuth: true }
  },
  { path: "/:notFound(.*)", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function waitForAuthReady() {
  return new Promise((resolve) => {
    if (auth.currentUser || isAuthResolved) {
      resolve();
    } else {
      const unsubscribe = auth.onAuthStateChanged(() => {
        isAuthResolved = true;
        unsubscribe(); 
        resolve();
      });
    }
  });
}

router.beforeEach(async (to, from, next) => {
  await waitForAuthReady();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = auth.currentUser;

  if (requiresAuth && !currentUser) {
    // not logged in, redirect to login
    next({ path: "/login" });
  } else if (to.path === "/login" && currentUser) {
    // already logged in, redirect away to village
    next({ path: "/village" });
  } else {
    next();
  }
});

export default router;
