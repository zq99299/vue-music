<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll :data="songs" class="list" ref="list"
            :listen-scroll="listenScroll"
            :probe-type="probeType"
            @scroll="listScroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import SongList from 'base/song-list/song-list'
  import Scroll from 'base/scroll/Scroll'

  // 顶部留出多高的距离不能滚动
  const RESERVED_HEIGHT = 40

  export default {
    components: {
      Scroll, SongList
    },
    props: {
      // 背景图
      bgImage: {
        type: String,
        default: ''
      },
      // 歌曲列表
      songs: {
        type: Array,
        default: []
      },
      // 歌手名称
      title: {
        type: String,
        default: ''
      }
    },
    created () {
      this.listenScroll = true  // 监听滚动事件
      this.probeType = 3  // 滚动事件派发方式
    },
    mounted () {
      // 因为这是一个scroll组件，所以要拿到el（dom元素）
      // 为什么要动态计算高度呢？是因为背景图的高度是自适应的
      let clientHeight = this.$refs.bgImage.clientHeight
      this.$refs.list.$el.style.top = `${clientHeight}px`

      // 记录两个值，背景图部分的高度
      this.bgImageHeight = clientHeight
      // 交互列表能偏移的最小高度是
      this.minTranslateY = -(clientHeight - RESERVED_HEIGHT)
    },
    data () {
      return {
        scrollY: 0
      }
    },
    computed: {
      bgStyle () {
        return `background-image:url(${this.bgImage})`
      }
    },
    methods: {
      listScroll (pos) {
        this.scrollY = pos.y
      }
    },
    watch: {
      scrollY (newY) {
        let translateY = Math.max(this.minTranslateY, newY)
        let zindex = 0
        if (translateY === this.minTranslateY) {
          let bgImageStyle = this.$refs.bgImage.style
          bgImageStyle['padding-top'] = 0
          bgImageStyle['height'] = `${RESERVED_HEIGHT}px`
          zindex = 10
          console.log(`  --- translateY:`, translateY, `newY:`, newY)
        } else {
          // 让背景层跟着网上移动
          this.$refs.bgLayer.style['transform'] = `translate3d(0,${translateY}px,0)`
          let bgImageStyle = this.$refs.bgImage.style
          bgImageStyle['padding-top'] = `70%`
          bgImageStyle['height'] = 0
          zindex = 0
          console.log(`translateY:`, translateY, `newY:`, newY, 'this.minTranslateY:', this.minTranslateY)
        }

        let percent = Math.abs(newY / this.bgImageHeight)
        // 通过缩放来控制图片的大小
        let scale = 1
        let blur = 0
        if (newY > 0) {
          scale = 1 + percent
          zindex = 10  // 解决在下拉的时候，图片虽然有放大缩小的效果，但是由于后来居上，覆盖了放大的显示部分
        } else {
          // 往上拉的时候，不能使用缩放了，因为图片可以放大，但是缩小的话，背景肯定铺不满容器了，很丑陋
          // 那么实现一个高斯模糊的效果，越到顶部越模糊
          blur = Math.min(20 * percent, 20) // 最大限制到20
        }
        // backdrop-filter 可能只有ios才能看到的高斯模糊效果
        this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
        this.$refs.filter.style['webkitBackdrop-filter'] = `blur(${blur}px)`

        let bgImageStyle = this.$refs.bgImage.style
        bgImageStyle['z-index'] = zindex
        bgImageStyle['transform'] = `scale(${scale})`
        bgImageStyle['webkitTransform'] = `scale(${scale})`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list {
    position fixed
    z-index 100
    top 0
    left 0
    bottom 0
    right 0
    background $color-background
    .back {
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back {
        display block
        padding 10px
        font-size $font-size-large-x
        color: $color-theme
      }
    }
    .title {
      position absolute
      top 0
      left 10% // 宽度百分之80，左边10，右边10也就居中了
      width 80%
      z-index 40
      no-wrap()
      text-align center
      line-height 40px
      font-size $font-size-large
      color $color-text
    }
    .bg-image {
      position relative
      width 100%
      height 0
      padding-top 70%
      transform-origin top
      background-size cover
    // 滤镜效果，图片用背景做
    // 滤镜用div定位做
      .filter {
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        background rgba(7, 17, 27, 0.4)
      }
    }
    .bg-layer {
      position: relative
      height: 100%
      background: $color-background
    }
    .list {
      position: fixed
      top: 0 // 该top被js动态修改
      bottom: 0
      width: 100%
      background: $color-background
      /*overflow hidden*/ //  去掉这个是为了让列表能滚动到容器外面，实现我们的滚动挤压效果
      .song-list-wrapper {
        padding: 20px 30px
      }
      .loading-container {
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
      }
    }
  }
</style>
