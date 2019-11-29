<template>
  <div id="app" v-cloak>
    <keep-alive include="DailyIndex">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#app,html,body{
  width: 100%;
  margin: 0;
}
[v-cloak]{
  display: none;
}
.fade-enter{
  opacity: 1;
}
.fade-leave-active {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
</style>
