<template>
  <section id="controls" class="controls-grid">
    <div class="round-display">Round: {{ round }}</div>
    <button @click="$emit(playerLevel >= 12 ? 'double-attack' : 'attack')">
      <span class="attack-text">{{
        playerLevel >= 12 ? "Double Attack" : "Attack"
      }}</span>
    </button>
    <button @click="$emit('special-attack')" :disabled="!canUseSpecialAttack">
      <span class="special-attack-text">{{ specialAttackName }}</span>

      <div
        :style="{ color: canUseSpecialAttack ? 'goldenrod' : 'black' }"
        class="special-ready-text"
      >
        {{ rageCost }} Rage
      </div>
    </button>
    <button @click="$emit('heal')" :disabled="!canUseHeal">
      <span class="heal-text">Heal</span>

      <div
        :style="{ color: canUseHeal ? 'goldenrod' : 'snow' }"
        class="heal-ready-text"
      >
        {{ canUseHeal ? "Ready" : "Charging..." }}
      </div>
    </button>
    <button @click="$emit('visit-village')">
      <span class="village-text-esc"> Escape </span>
      <span class="village-text-to">to</span>
      <span class="village-text"> Village</span>
    </button>
  </section>
</template>

<script>
export default {
  emits: ["heal", "visit-village", "attack", "special-attack", "double-attack"],
  name: "TheControls",
  props: {
    canUseSpecialAttack: {
      type: Boolean,
      required: true,
    },
    canUseHeal: {
      type: Boolean,
      required: true,
    },
    playerLevel: {
      type: Number,
      required: true,
    },
    round: {
      type: Number,
      required: true,
    },
  },
  computed: {
    specialAttackName() {
      if (this.playerLevel >= 25) return "Thunder Strike";
      if (this.playerLevel >= 15) return "Deep Strike";
      return "Rage Strike";
    },
    rageCost() {
      if (this.playerLevel >= 25) return 30;
      if (this.playerLevel >= 15) return 25;
      return 15;
    },
  },
};
</script>
<style scoped>
.round-display {
  grid-column: span 2;
  font-weight: bold;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  text-align: center;
  width: 100%;
  transform: translateY(80%);
  color: goldenrod;
  text-shadow:
    -1px -1px 0 black,
     1px -1px 0 black,
    -1px  1px 0 black,
     1px  1px 0 black;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  justify-items: center;
  padding: 1rem;
  max-width: 400px;
  margin: 0 auto;
  box-sizing: border-box;
}

button {
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(../../assets/images/button2.png);
  background-size: 90% 90%;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height:100px;
  color: goldenrod;
  font-family: inherit;
  font-size: 1rem;
  text-align: center;
  cursor: pointer;
  text-shadow: 1px 1px 2px black;
  transition: filter 0.2s ease;
}

button:focus {
  outline: none;
}

button:hover:not(:disabled),
button:active:not(:disabled) {
  filter: brightness(1.2);
}

button:disabled {
  box-shadow: none;
  color: #3f3f3f;
  cursor: not-allowed;
}
.attack-text {
  position: absolute;
}
.special-attack-text {
  position: absolute;
  margin-top: -20px;
}
.heal-text {
  position: absolute;
  margin-top: -20px;
}
.village-text-esc {
  position: absolute;
  margin-top: -40px;
}
.village-text {
  position: absolute;
  margin-top: 40px;
}
.village-text-to {
  position: absolute;
}
.heal-ready-text {
  position: absolute;
  margin-top: 40px;
}
.special-ready-text {
  position: absolute;
  margin-top: 40px;
}

@media (max-width: 480px) {
  .controls-grid {
    gap: 0.75rem;
    padding: 0.75rem;
    max-width: 320px;
  }

  .round-display {
    font-size: 1rem;
  }

  button {
    width: 140px;
    height: 80px;
    font-size: 0.85rem;
  }

  .attack-text,
  .special-attack-text,
  .heal-text,
  .village-text-esc,
  .village-text,
  .village-text-to,
  .heal-ready-text,
  .special-ready-text {
    margin-left: -5px;
  }

  .village-text-esc {
    margin-bottom: -5px;
  }

  .village-text {
    margin-top: 40px;
  }

  .heal-ready-text,
  .special-ready-text {
    margin-top: 30px;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .controls-grid {
    gap: 0.9rem;
    padding: 1rem;
    max-width: 380px;
  }

  .round-display {
    font-size: 1.1rem;
  }

  button {
    width: 160px;
    height: 90px;
    font-size: 0.95rem;
  }

  .attack-text,
  .special-attack-text,
  .heal-text,
  .village-text-esc,
  .village-text,
  .village-text-to,
  .heal-ready-text,
  .special-ready-text {
    margin-left: -15px;
  }

  .village-text-esc {
    margin-bottom: 48px;
  }

  .village-text {
    margin-top: 48px;
  }

  .heal-ready-text,
  .special-ready-text {
    margin-top: 48px;
  }
}
</style>
