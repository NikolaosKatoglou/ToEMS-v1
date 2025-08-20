<template>
  <footer class="footer">
    <div class="container">
      <p>© 2025 Nikolaos Katoglou. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "TheFooter",
};
</script>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #222222a2;
  color: #dddddd;
  text-align: center;
  font-size: 0.75rem;
  line-height: 0.5rem;

  border-top: 1px solid #222222a2;
  z-index: 1000;
}
.footer a {
  color: #88c0d0;
  text-decoration: none;
  margin: 0 0.5rem;
}
.footer a:hover {
  text-decoration: underline;
}
.footer p {
  margin: 0.5rem;
}
</style>
