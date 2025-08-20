<template>
  <div id="monster" class="container centered">
    <div class="monster-level-image"></div>
    <img src="../../assets/images/chains-monster.png" class="chains"></img>

    <div class="bar-label-title">
      {{ name }}
    </div>
    <div class="level-badge">{{ level }}</div>

    <div class="healthbar">
      <div
        class="healthbar__value"
        :style="{ width: healthBarWidth + '%' }"
      ></div>
      <div class="bar-label">{{ hp }}/{{ maxHp }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const hp = computed(() => store.getters["monster/getMonsterHp"]);
const maxHp = computed(() => store.getters["monster/getMonsterMaxHp"]); // getting maxHp
const level = computed(() => store.getters["monster/getMonsterLevel"]);
const name = computed(() => store.getters["monster/getMonsterName"]);

const healthBarWidth = computed(() => {
  return (hp.value / maxHp.value) * 100;
});
</script>

<style scoped>
.container {
  padding: 0.5rem 1rem;
  width: 100%;
  max-width: 360px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

.centered {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  gap: 0.4rem;
}

.bar-label-title {
  font-weight: bold;
  color: goldenrod;
  font-size: 1rem;
  margin-bottom: 0.1rem;
  user-select: none;
  text-align: center;
  width: 100%;
  z-index: 10;
  transform: translateX(-20%) translateY(-1010%);
}

.monster-level-image {
  width: 100%;
  height: 70px;
  background-image: url("../../assets/images/monster-name-level-chains.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  transform: translateY(-20%);
}

.chains {
  width: 100%;
  height: 120px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  transform: translateY(-41.5%);
}

.healthbar {
  width: 80%;
  height: 35px;
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  transform: translateY(-600%);
  z-index: 1;

  /* image if I need it */
  /* background-image: url("../../assets/images/healthbar-empty2.png");
  background-size: 100% 100%;
  background-repeat: no-repeat; */

  /* background-color: #575757; */
}

.healthbar__value {
  height: 100%;
  width: 100%;
  background-image: url("../../assets/images/healthbar1c.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  transition: width 0.3s ease;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}

.healthbar::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url("../../assets/images/healthbar-empty.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  z-index: 2;
  pointer-events: none;
}

.bar-label {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  color: goldenrod;
  pointer-events: none;
  user-select: none;
  text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black,
    1px 1px 0 black;
}

.level-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  color: goldenrod;
  font-weight: bold;
  font-size: 1rem;
  user-select: none;
  transform: translateX(310%) translateY(-870%);
  text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black,
    1px 1px 0 black;
}

@media (max-width: 480px) {
  .monster-level-image {
    height: 60px;
    background-size: 100% 100%;
    transform: translateY(390%);
  }

  .chains {
  width: 100%;
  height: 120px;
  transform: translateY(166%);
}

  .bar-label-title {
    font-size: 0.85rem;
    transform: translateX(-18%) translateY(445%);
  }

  .level-badge {
    width: 20px;
    height: 20px;
    font-size: 0.9rem;
    transform: translateX(360%) translateY(165%);
  }

  .healthbar {
    height: 24px;
    width: 75%;
    transform: translateY(200%);
  }

  .bar-label {
    font-size: 0.8rem;
  }
}
</style>
