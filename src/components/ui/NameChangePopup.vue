<template>
  <div v-if="show" class="backdrop">
    <div class="modal">
      <h3>Change Name</h3>
      <form @submit.prevent="submit">
        <input
          v-model="newName"
          placeholder="Enter new name"
          required
          maxlength="12"
        />
        <div class="buttons">
          <button type="submit">Save</button>
          <button type="button" @click="close">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  show: Boolean,
  onButtonClick: Function,
});
const emit = defineEmits(["close"]);

const store = useStore();
const newName = ref(store.getters["player/getPlayerName"]);

function close() {
  emit("close");
}

function submit() {
  store.commit("player/setPlayerName", newName.value);
  newName.value = "";
  close();
}
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-image: url("../../assets/images/GlueScreen-Button1-MultiplayerBorder.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  width: 300px;
  min-height: 180px;
  padding: 2rem 1rem 4rem;
  box-sizing: border-box;
  color: goldenrod;
  font-family: inherit;
  font-size: 1rem;
  text-align: center;
  text-shadow: 1px 1px 2px black;
  border-radius: 8px;
}

h3 {
  transform: translateX(10px) translateY(-7px);
  margin: 0;
  font-size: 1.2rem;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

input {
  width: 70%;
  padding: 0.4rem 0.5rem;
  background: wheat;
  border-radius: 5px;
  border: 1px solid wheat;
  font-family: inherit;
  font-size: 0.95rem;
  transform: translateX(10px) translateY(18px);
}

.buttons {
  position: absolute;
  bottom: -15px;
  left: 54.5%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 2;
}

button {
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(../../assets/images/GlueScreen-Button1-LargeBorderSingle.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 145px;
  height: 50px;
  color: goldenrod;
  font-family: inherit;
  cursor: pointer;
  font-size: 0.8rem;
  text-align: center;
  text-shadow: 1px 1px 2px black;
  transition: filter 0.2s ease;
}

button:hover {
  filter: brightness(1.2);
}

@media (max-width: 768px) {
  .modal {
    width: 90%;
    min-height: 160px;
    padding: 1.5rem 1rem 3rem;
    font-size: 0.95rem;
  }

  input {
    width: 80%;
    font-size: 0.9rem;
    transform: translateX(0) translateY(16px);
  }

  h3 {
    font-size: 1.1rem;
    transform: translateX(0) translateY(-5px);
  }

  .buttons {
    bottom: -10px;
    gap: 0.4rem;
  }

  button {
    width: 120px;
    height: 45px;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .modal {
    width: 75%;
    min-height: 150px;
    padding: 1rem 0.5rem 2.5rem;
    font-size: 0.9rem;
  }

  input {
    width: 60%;
    font-size: 0.85rem;
    transform: translateX(18px) translateY(28px);
  }

  h3 {
    font-size: 1rem;
    transform: translateX(8px) translateY(7px);
  }

  .buttons {
    bottom: -13px;
    flex-direction: row;
    gap: 0.6rem;
  }

  button {
    width: 130px;
    font-size: 0.95rem;
  }
}
</style>
