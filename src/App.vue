<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  // 组件首字母大写，因为组件以css命名的
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'
  export default {
    name: 'app',
    components: {MHeader, Tab},
    data () {
      return {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
