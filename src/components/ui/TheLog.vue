<template>
  <section class="log-container">
    <ul>
      <li v-for="(log, i) in logs" :key="i">
        <span :class="['actor', getActorType(log.actor)]">
          {{ log.actorName || log.actor }}
        </span>
        <span :class="['log-action', 'log--' + log.type]">
          {{ getDisplayAction(log.action) }}
        </span>
        <span :class="['target', getTargetType(log.target)]">
          {{ log.targetName || log.target }}
        </span>
        <span>for</span>
        <span :class="'log--' + log.type">{{ log.value }}</span>
        <span>
          {{ log.type === "heal" ? "health points." : "damage." }}
        </span>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const logs = computed(() => store.getters["log/logs"]);

function getDisplayAction(action) {
  switch (action) {
    case "heals":
      return "heals";
    case "Special1":
      return "Rage Strikes";
    case "Special2":
      return "Deep Strikes";
    case "Special3":
      return "Thunder Strikes";
    case "attacks":
      return "attacks";
    default:
      return action;
  }
}

function getActorType(actor) {
  const playerName = store.state.player.name?.toLowerCase() || "";
  if (actor.toLowerCase().trim() === playerName) return "player";
  return "monster";
}

function getTargetType(target) {
  const playerName = store.state.player.name?.toLowerCase() || "";
  if (target.toLowerCase().trim() === playerName) return "player";
  return "monster";
}
</script>
<style scoped>
.log-container {
  font-size: 0.95rem;
  max-height: 591px;
  overflow-y: auto;
  padding-right: 2.5rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.5) transparent;
  overflow: hidden;
}

.log-container ul {
  text-align: center;
  margin-top: 5rem;
  list-style: none;
}

.log-container li {
  margin-bottom: 1rem;
  line-height: 1.1rem;
  padding-bottom: 0.25rem;
  border-bottom: transparent;
  text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black,
    1px 1px 0 black;
}

.log-container li span:not(:last-child) {
  margin-right: 0.60rem;
}

.log-container li span:not(.actor):not(.target):not([class*="log--"]) {
  color: rgb(235, 248, 177);
}

.actor.player,
.target.player {
  color: rgb(255, 208, 0);
  font-weight: bold;
}

.actor.monster,
.target.monster {
  color: rgb(231, 170, 56);
  font-weight: bold;
}

.log--damage {
  color: rgb(219, 219, 219);
  font-weight: bold;
}
.log--heal {
  color: rgb(2, 218, 2);
  font-weight: bold;
}
.log--special {
  color: rgb(245, 191, 56);
  font-weight: bold;
}


@media (max-width: 480px) {
  .log-container {
    font-size: 0.80rem; 
    padding-right: 1.5rem;
  }

  .log-container ul {
    margin-top: 2rem; 
  }

  .log-container li {
    margin-bottom: 0.3rem; 
    line-height: 1.3; 
    padding-bottom: 0.15rem;
  }

  .log-container li span:not(:last-child) {
    margin-right: 0.4rem;
  }
}


@media (min-width: 481px) and (max-width: 768px) {
  .log-container {
    font-size: 0.88rem; 
    padding-right: 2rem;
  }

  .log-container ul {
    margin-top: 2.5rem;
  }

  .log-container li {
    margin-bottom: 0.6rem;
    line-height: 1.2;
    padding-bottom: 0.2rem;
  }

  .log-container li span:not(:last-child) {
    margin-right: 0.5rem;
  }
}
</style>
