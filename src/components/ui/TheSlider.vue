<template>
  <transition name="slide">
    <div v-if="show" class="slider">
      <slot></slot>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: Boolean,
});

</script>

<style scoped>
.slider {
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0px;
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  max-height: 340px;
  opacity: 1;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.8s ease-in-out;
}
</style>
