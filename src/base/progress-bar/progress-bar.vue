<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtnWrapper">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

  const PROGRESS_BTN_WIDTH = 16

  export default {
    props: {
      /** 进度条百分比 */
      percent: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {}
    },
    watch: {
      percent (newPercent) {
        // 1. 获取背景进度条的宽度
        // 2. 百分比 * 背景进度条的宽度就是进度条现在的宽度
        // 3. 设置进度条的宽度
        const progressBarWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH / 2
        const progressWidth = newPercent * progressBarWidth
        this.$refs.progress.style.width = `${progressWidth}px`

        // 圆形按钮移动
        this.$refs.progressBtnWrapper.style.transform = `translateX(${progressWidth}px)`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar {
    height 30px
    .bar-inner {
      position relative
      background rgba(0, 0, 0, 0.3)
      top 13px // 高30 = top 13 + 4 + 剩下的13 就是该元素垂直居中
      height 4px
      .progress {
        position absolute
        background $color-theme
        width 50px
        height 100%
      }
      .progress-btn-wrapper {
        position absolute
        top -13px // 宽高都是30.中心点不是应该是15么，但是 bar-inner 高度4，那么有4px是重合的，上下13 * 2 + 4 = 30
        left -13px
        width 30px
        height 30px
        .progress-btn {
          position: relative
          box-sizing border-box
          width 16px
          height 16px
          border solid 3px $color-text
          border-radius 50%
          top 7px
          left 7px
          background $color-theme
        }
      }
    }
  }
</style>
