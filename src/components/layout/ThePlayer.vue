<template>
  <div id="player" class="container centered">
    <div class="player-level-image"></div>
    <img src="../../assets/images/chains-player3.png" class="chains"></img>
    
    <div class="bar-label-name">
      {{ name }}
    </div>
    <div class="level-badge">{{ level }}</div>

    <div class="healthbar">
      <div
        class="healthbar__value"
        :style="{ width: healthBarWidth + '%' }"
      ></div>
      <div class="bar-label">{{ hp }} / {{ maxHp }}</div>
    </div>

    <div class="bar-label-title">Rage</div>
    <div class="ragebar">
      <div class="ragebar__value" :style="{ width: rage + '%' }"></div>
      <div class="bar-label">{{ rage }}/100</div>
    </div>

    <div class="bar-label-title">XP</div>
    <div class="xpbar">
      <div class="xpbar__value" :style="{ width: xpBarWidth + '%' }"></div>
      <div class="bar-label">{{ xp }}/ {{ requiredExp }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const hp = computed(() => store.getters["player/getPlayerHp"]); // getting hp
const maxHp = computed(() => store.getters["player/getPlayerMaxHp"]); // getting maxHp
const rage = computed(() => store.getters["player/getPlayerRage"]); // getting rage
const xp = computed(() => store.getters["player/getPlayerExp"]); // getting exp
const requiredExp = computed(() => store.getters["player/getExpRequired"]);
const level = computed(() => store.getters["player/getPlayerLevel"]); // getting level
const name = computed(() => store.getters["player/getPlayerName"]); // getting name

// calculate the health bar width as a percentage of hp/maxHp
const healthBarWidth = computed(() => {
  return (hp.value / maxHp.value) * 100;
});
const xpBarWidth = computed(() => {
  return (xp.value / requiredExp.value) * 100;
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
  z-index: 5;
  transform: translateY(-2950%);
  text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black,
    1px 1px 0 black;
}

.bar-label-name {
  font-weight: bold;
  color: goldenrod;
  font-size: 1rem;
  margin-bottom: 0.1rem;
  user-select: none;
  text-align: center;
  width: 100%;
  z-index: 5;
  transform: translateY(-2790%) translateX(-18%);
}

.player-level-image {
  width: 101%;
  height: 65px;
  background-image: url("../../assets/images/player-name-level-chains.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  transform: translateY(-403%);
}

.chains {
  width: 95%;
  height: 200px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  transform: translateX(-2px) translateY(-144%) ;
}

.healthbar {
  width: 80%;
  height: 35px;
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  transform: translateY(-1510%);
  z-index: 1;

  /* image if I need it */
  /* background-image: url("../../assets/images/healthbar-empty3.png");
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

.ragebar__value {
  height: 100%;
  width: 100%;
  background-image: url("../../assets/images/ragebar-v1c.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  transition: width 0.3s ease;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}

.ragebar::after {
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

.xpbar__value {
  height: 94%;
  width: 100%;
  background-image: url("../../assets/images/xpbar1d.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  transition: width 0.3s ease;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}

.xpbar::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-image: url("../../assets/images/healthbar-empty.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  z-index: 2;
  pointer-events: none;
}

.ragebar,
.xpbar {
  width: 75%;
  height: 25px;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  /* background-color: #575757; */
  margin-bottom: 0.5rem;
  transform: translateY(-2150%);
}

.bar-label {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
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
  transform: translateX(287%) translateY(-2106%);
  text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black,
    1px 1px 0 black;
}
@media (max-width: 480px) {
  .player-level-image {
    height: 60px;
    background-size: 100% 100%;
    transform: translateY(20%);
  }

  .chains {
  width: 95%;
  height: 150px;
  transform: translateX(-2px) translateY(-5.5%) ;
}

  .bar-label-name {
    font-size: 0.85rem;
    transform: translateY(-1080%) translateX(-18%);
  }

  .bar-label-title {
    font-size: 0.85rem;
    transform: translateY(-1285%);
  }

  .level-badge {
    width: 20px;
    height: 20px;
    font-size: 0.9rem;
    transform: translateX(325%) translateY(-1080%);
  }

  .healthbar {
    height: 24px;
    width: 75%;
    transform: translateY(-810%);
  }

  .ragebar,
  .xpbar {
    height: 20px;
    width: 70%;
    transform: translateY(-1050%);
  }

  .bar-label {
    font-size: 0.8rem;
  }
}

</style>
