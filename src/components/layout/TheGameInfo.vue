<template>
  <div class="dialog-content">
    <h2>Game Info</h2>
    <p>
      <strong>Tales of Endless Monster Slaying</strong><br /><br />
      Embark on an endless quest battling foes from tiny rats to mighty giants.
      Return to your village to rest, track your stats, and reset if you dare.
      Level up to unlock powerful new abilities and face ever-stronger monsters
      in a thrilling, never-ending loop of action and strategy.
    </p>
  </div>
</template>

<script>
export default {
  name: "TheGameInfo",
};
</script>

<style scoped>
.dialog-content {
  color: #000000;
  padding: 1.5rem;
  width: 100%;
  max-width: 365px;
  text-align: center;
  box-sizing: border-box;
  margin: 0 auto;
}

.dialog-content h2 {
  background-image: url(../../assets/images/Loading-NameBackground.png);
  background-size: 300px 55px;
  background-repeat: no-repeat;
  background-position: center;
  color: goldenrod;
  line-height: 55px;
  text-align: center;
  margin: 0 auto 1rem;
}

@media (max-width: 400px) {
  .dialog-content {
    padding: 1rem;
  }
}
</style>
