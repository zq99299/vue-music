<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      /**
       * 1 会截流,只有在滚动结束的时候派发一个 scroll 事件。
       * 2 在手指 move 的时候也会实时派发 scroll 事件，不会截流。
       * 3 除了手指 move 的时候派发scroll事件，在 swipe（手指迅速滑动一小段距离）的情况下，列表会有一个长距离的滚动动画，这个滚动的动画过程中也会实时派发滚动事件
       */
      probeType: {
        type: Number,
        default: 1
      },
      // true 是否派发click事件
      click: {
        type: Boolean,
        default: true
      },
      // 数据是动态的，数据变了就要重新刷新bascroll否则不能滚动
      // 要重新计算dom的高度
      // 这里必须安利下：很多时候scroll包裹的dom元素的高度都是动态数据撑开的
      // 所以需要在数据变化后，进行重新刷新scroll，才能实现滚动
      data: {
        type: Array,
        default: null
      },
      // scroll 是否监听滚动事件
      listenScroll: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      // 为了能正确渲染
      // 浏览器刷新一次是17毫秒，所以设置成20毫秒比较合理
      setTimeout(() => {
        this._initScrool()
      }, 20)
    },
    methods: {
      _initScrool () {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })

        // 监听bscroll的滚动事件
        if (this.listenScroll) {
          console.log(this.scroll)
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos)
          })
        }
      },
      // 下面代理几个比较常用的方法
      enable () {
        this.scroll && this.scroll.enable()
      },
      disable () {
        this.scroll && this.scroll.disable()
      },
      refresh () {
        this.scroll && this.scroll.refresh()
      },
      scrollTo () {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      // 滚动到列表中指定的dom元素位置
      scrollToElement () {
//        this.scroll.scrollToElement(el) 在参数中定义el，和下面的效果一样
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    data () {
      return {}
    },
    watch: {
      data () {
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
