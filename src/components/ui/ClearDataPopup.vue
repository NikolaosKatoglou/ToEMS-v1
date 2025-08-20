<template>
  <div
    v-if="show"
    class="dialog"
    @click="tryClose"
    :class="['backdrop', { hidden: !show }]"
  >
    <div v-if="show" class="clear-dialog">
      <header>
        <h2>Clear All Stats?</h2>
      </header>

      <section class="clear-dialog-content">
        <p>Are you sure you want to clear all your stats?</p>
        <div class="actions">
          <button @click="confirmClear">Yes, clear data</button>
          <button @click="$emit('close')">Cancel</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  fixed: { type: Boolean, default: false },
  onButtonClick: Function,
});

const emit = defineEmits(["close", "confirm"]);

function tryClose(event) {
  if (props.fixed) return;
  if (event.target.classList.contains("backdrop")) {
    emit("close");
  }
}

function confirmClear() {
  emit("confirm");
}
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease-in-out;
}

.clear-dialog {
  position: relative;
  width: 300px;
  min-height: 180px;
  background-image: url("../../assets/images/GlueScreen-Button1-MultiplayerBorder.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  padding: 2rem 1rem 4rem;
  box-sizing: border-box;
  color: goldenrod;
  font-family: inherit;
  font-size: 1rem;
  text-align: center;
  text-shadow: 1px 1px 2px black;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.clear-dialog header h2 {
  font-size: 1.4rem;
  margin: 0;
  transform: translateX(15px) translateY(1px);
}

.clear-dialog-content {
  width: 100%;
}

.clear-dialog-content p {
  margin: 2rem;
  font-size: 1.2rem;
  transform: translateX(13px) translateY(2px);
}

.actions {
  position: absolute;
  bottom: -15px;
  left: 54.5%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 2;
}

.actions button {
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../../assets/images/GlueScreen-Button1-LargeBorderSingle.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 155px;
  height: 50px;
  color: goldenrod;
  font-family: inherit;
  font-size: 1rem;
  text-align: center;
  text-shadow: 1px 1px 2px black;
  cursor: pointer;
  transition: filter 0.2s ease;
}

.actions button:hover {
  filter: brightness(1.2);
}

@media (max-width: 480px) {
  .clear-dialog {
    width: 340px;
    padding: 1.5rem 1rem 3rem;
  }
  .clear-dialog header h2 {
    font-size: 1.5rem;
    transform: translateX(11px) translateY(3px);
  }
  .clear-dialog-content p {
    font-size: 1.2rem;
    margin: 3rem;
    transform: translateX(15px) translateY(-5px);
  }
  .actions button {
    width: 140px;
    height: 45px;
    font-size: 1rem;
  }
}

@media (min-width: 481px) and (max-width: 767px) {
  .clear-dialog {
    width: 320px;
    padding: 2rem 1rem 3.5rem;
  }
  .clear-dialog header h2 {
    font-size: 1.1rem;
    transform: translateX(15px) translateY(-6px);
  }
  .clear-dialog-content p {
    font-size: 0.9rem;
    margin: 1.2rem 0 2.2rem;
    transform: translateX(8px) translateY(12px);
  }
  .actions button {
    width: 135px;
    height: 48px;
    font-size: 0.78rem;
  }
}
</style>
