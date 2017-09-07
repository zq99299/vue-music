<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtnWrapper"
           @touchstart="onTouchStart"
           @touchmove="onTouchMove"
           @touchend="onTouchEnd"
      >
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
    created() {
      // 先创建属性，否则 在后面的操作中很有可能不确定先后顺序，造成未定义空指针异常
      this.touch = {
        isMoving: false,
        startX: 0,
        left: 0
      }
    },
    data() {
      return {}
    },
    watch: {
      percent(newPercent) {
        // 1. 获取背景进度条的宽度
        // 2. 百分比 * 背景进度条的宽度就是进度条现在的宽度
        // 3. 设置进度条的宽度
        // 4. 由于增加了 滚动条 拖动的功能，这里要判断，在滚动的时候，对外部的百分比变化拒绝接受处理

        if (newPercent < 0 || this.touch.isMoving) {
          return
        }
        const progressBarWidth = this._getProgressBarWidth()
        const progressWidth = newPercent * progressBarWidth
        this._setProgressWidth(progressWidth)
      }
    },
    methods: {
      _getProgressBarWidth() {
        // 进度条该滚动的宽度：进度条 + 圆形按钮 在视觉上刚好等于 背景进度条的宽度，但是圆形按钮移动的位置要减去半径（中心点移动）
        return this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH / 2
      },
      _setProgressWidth(progressWidth) {
        this.$refs.progress.style.width = `${progressWidth}px`
        // 圆形按钮移动
        this.$refs.progressBtnWrapper.style.transform = `translateX(${progressWidth}px)`
      },
      onTouchStart(e) {
        this.touch.isMoving = true // 标识在移动中
        this.touch.startX = e.touches[0].pageX // 记录移动的起始点
        this.touch.left = this.$refs.progress.clientWidth // 记录移动开始时的进度条当前的宽度
      },
      onTouchMove(e) {
        if (!this.touch.isMoving) {
          return
        }

        let deltaX = e.touches[0].pageX - this.touch.startX  // 移动的距离
        // 由于我们的进度条是有固定宽度的，而移动的宽度很有可能超过了这个宽度，所以需要处理边界值
        let progressWidth = this.touch.left + deltaX
        progressWidth = Math.max(0, progressWidth) // 有可能为负数，所以最小为0
        progressWidth = Math.min(this._getProgressBarWidth(), progressWidth) // 有可能超过了 进度条的宽度，所以最大为进度条的宽度
        this._setProgressWidth(progressWidth)
      },
      onTouchEnd() {
        this.touch.isMoving = false // 标识移动结束
        // 并告诉外部当前滚动条新的百分比位置
        this._triggerPercent()
      },
      _triggerPercent() {
        let percent = this.$refs.progress.clientWidth / this._getProgressBarWidth()
        this.$emit('percentChange', percent)
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
