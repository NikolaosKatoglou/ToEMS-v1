import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";  

export const playerStoragePlugin = (store) => {
  // load data on init
  const loadData = async () => {
    const user = auth.currentUser;
    if (user) {
      // try Firestore first
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          store.commit("player/restoreFromStorage", docSnap.data().player);
          return;
        }
      } catch (e) {
        console.error("Failed to load player data from Firestore:", e);
      }
    }

    // fallback to localStorage
    const saved = localStorage.getItem("playerData");
    if (saved) {
      store.commit("player/restoreFromStorage", JSON.parse(saved));
    }
  };

  loadData();

  
  store.subscribe(async (mutation, state) => {
    if (mutation.type.startsWith("player/")) {
      localStorage.setItem("playerData", JSON.stringify(state.player));

      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          await setDoc(docRef, { player: state.player }, { merge: true });
        } catch (e) {
          console.error("Failed to save player data to Firestore:", e);
        }
      }
    }
  });
};
