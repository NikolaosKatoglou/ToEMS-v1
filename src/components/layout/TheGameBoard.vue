<template>
  <section class="player-monster-card">
    <TheMonster />
    <ThePlayer />
  </section>

  <section class="controls-card" v-if="!winner">
    <TheControls
      :round="round"
      :playerLevel="playerLevel"
      :canUseSpecialAttack="canUseSpecialAttack"
      :canUseHeal="canUseHeal"
      @attack="$emit('attack')"
      @double-attack="$emit('double-attack')"
      @special-attack="$emit('special-attack')"
      @heal="$emit('heal')"
      @visit-village="$emit('visit-village')"
    />
  </section>
</template>

<script>
import TheMonster from "./TheMonster.vue";
import ThePlayer from "./ThePlayer.vue";
import TheControls from "../ui/TheControls.vue";

export default {
  name: "TheGameBoard",
  components: { TheMonster, ThePlayer, TheControls },
  props: {
    canUseSpecialAttack: Boolean,
    winner: String,
    monsterHp: Number,
    playerLevel: Number,
    canUseHeal: Boolean,
    round: Number,
  },
  emits: ["attack", "special-attack", "heal", "visit-village", "double-attack"],
};
</script>
<style scoped>
.player-monster-card {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  border-radius: 100px;
  padding: 5.5rem;
  width: 580px;
  height: 520px;
  box-sizing: border-box;
  background-image: url(../../assets/images/orc-human-background.png);
  background-size: 90% 90%;
  background-repeat: no-repeat;
  background-position: center;
  overflow: hidden;
}

.controls-card {
  padding: 2rem;
  border-radius: 83px;
  box-sizing: border-box;
  background-image: url(../../assets/images/orc-vs-dwarf.png);
  background-size: 90% 90%;
  background-repeat: no-repeat;
  background-position: center;
  margin-top: -2.6rem;
}

@media (max-width: 480px) {
  .player-monster-card,
  .controls-card {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .player-monster-card {
    width: 100%;
    height: auto;
    padding: 1.5rem;
    gap: 2rem;
    border-radius: 40px;
    background-size: contain;
    transform: translateY(10%);
  }

  .controls-card {
    padding: 1rem;
    border-radius: 40px;
    margin-top: 0;
    background-size: contain;
    transform: translateY(-45%);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .player-monster-card {
    width: 90%;
    height: auto;
    padding: 3rem;
    gap: 3rem;
    border-radius: 70px;
    background-size: contain;
  }

  .controls-card {
    padding: 1.5rem 2rem;
    border-radius: 70px;
    margin-top: -1rem;
    background-size: contain;
  }
}
</style>
