<template>
  <TheSlider :show="show">
    <div class="slide" @click.stop>
      <TheMonsterContent
        @selected="$emit('selected', $event)"
        @visit-village="$emit('visit-village')"
      />
    </div>
  </TheSlider>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import TheSlider from "./TheSlider.vue";
import TheMonsterContent from "../layout/TheMonsterContent.vue";

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(["selected", "visit-village"]);
</script>

<style scoped>
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  max-height: 1000px;
  opacity: 1;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}
</style>
