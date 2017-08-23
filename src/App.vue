<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  // 组件首字母大写，因为组件以css命名的
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'

  import Player from 'components/player/player'

  export default {
    name: 'app',
    components: {MHeader, Tab, Player},
    data () {
      return {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
