import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

export const monsterStoragePlugin = (store) => {
  async function loadData() {
    const user = auth.currentUser;

    if (user) {
      try {
        // load monster data from Firestore
        const docRef = doc(db, "users", user.uid, "gameData", "monster");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          store.commit("monster/restoreFromStorage", data);
          // ensure monster list is populated after restore
          await store.dispatch("monster/selectNextMonsters");
          return;
        }
      } catch (err) {
        console.error("Error loading monster data from Firestore:", err);
      }
    }

    // fallback to localStorage (dual-save)
    const savedState = localStorage.getItem("monster");
    if (savedState) {
      store.commit("monster/restoreFromStorage", JSON.parse(savedState));
      // populate nextMonsters so dialog isn't empty
      await store.dispatch("monster/selectNextMonsters");
    } else {
      // no saved data, still populate nextMonsters initially
      await store.dispatch("monster/selectNextMonsters");
    }
  }

  // load monster data on store init
  loadData();

  
  store.subscribe(async (mutation, state) => {
    if (mutation.type.startsWith("monster/")) {
      // save to localStorage immediately
      localStorage.setItem("monster", JSON.stringify(state.monster));

      const user = auth.currentUser;
      if (user) {
        try {
          // save to Firestore asynchronously
          const docRef = doc(db, "users", user.uid, "gameData", "monster");
          await setDoc(docRef, state.monster);
        } catch (err) {
          console.error("Error saving monster data to Firestore:", err);
        }
      }
    }
  });
};
