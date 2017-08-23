<template>
  <!--主要分为两大块内容：1. 全屏播放器 2， 迷你播放器-->
  <div class="player" v-show="playlist.length >0">
    <div class="normal-player" v-show="fullScreen">
      播放器
    </div>
    <div class="mini-player" v-show="!fullScreen">
      迷你播放器
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {}
    },
    computed: {
      ...mapGetters([
        'fullScreen',
        'playlist'
      ])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background $color-background
    .mini-player {
      position absolute
      bottom 0
      right 0
      left 0
      height 60px
      background $color-highlight-background
    }
  }
</style>
