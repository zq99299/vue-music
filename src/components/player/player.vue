<template>
  <!--主要分为两大块内容：1. 全屏播放器 2， 迷你播放器-->
  <div class="player" v-show="playlist.length >0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <!--背景图-->
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <!--顶部信息-->
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <!--唱片转动效果-->
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdClass">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
          </div>
          <div class="middle-r">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current' : currentLineNum == index}"
                   v-for="(line,index) in currentLyric.lines">
                  {{line.txt}}</p>
              </div>
            </div>
          </div>
        </div>
        <!--底部操作区-->
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="progressPercent" @percentChange="onPercentChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="playModeIcon" @click="playModelChange"></i>
            </div>
            <div class="icon i-left" :class="disableClass">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableClass">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableClass">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" :class="cdClass">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc">{{currentSong.singer}}</p>
        </div>
        <div class="control">
          <progress-circle :radius="32" :percent="progressPercent">
            <i :class="miniIcon" class="icon-mini" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSong.url"
           @canplay="ready" @error="error"
           @timeupdate="timeupdate"
           @ended="onended"
    ></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapMutations } from 'vuex'
  import animations from 'create-keyframe-animation'
  import { prefixStyle } from '@/common/js/dom.js'
  import { playMode } from '@/common/js/config'
  import { shuffle } from '@/common/js/util'

  import ProgressBar from '@/base/progress-bar/progress-bar'
  import ProgressCircle from '@/base/progress-circle/progress-circle'

  import Lyric from 'lyric-parser'

  const transform = prefixStyle('transform')
  export default {
    components: {
      ProgressBar, ProgressCircle
    },
    data () {
      return {
        songReady: false, // 歌曲是否已经准备好，可以播放了？
        currentTime: 0,
        currentLyric: null, // 当前歌词
        currentLineNum: 0// 当前歌词行数
      }
    },
    computed: {
      ...mapGetters([
        'fullScreen',
        'playlist',
        'sequenceList',
        'currentSong',
        'playing',
        'currentIndex',
        'mode'
      ]),
      playIcon () {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon () {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      cdClass () {
        return this.playing ? 'play' : 'pause'  // 播放的时候 让cd旋转
      },
      disableClass () {
        return this.songReady ? '' : 'disable'
      },
      progressPercent () {
        // 进度条百分比 = 当前时间/总时间
        const percent = this.currentTime / this.currentSong.duration
//        console.log(percent)
        return percent
      },
      playModeIcon () {
        return playMode.sequence === this.mode ? 'icon-sequence' : (playMode.loop === this.mode ? 'icon-loop' : 'icon-random')
      }
    },
    methods: {
      // 这里也可以像上面那样简写
      // 但是 我们一般的习惯是 方法名驼峰写法，所以要映射
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlaying: 'SET_PLAYING',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayModel: 'SET_MODE',
        setPlayList: 'SET_PLAYLIST'
      }),
      back () {
        this.setFullScreen(false)
      },
      open () {
        this.setFullScreen(true)
      },
      enter (el, done) {
        // 进入的时候，让小cd飞入大cd位置，过程了先慢慢放大最后再缩小成大cd效果
        const {x, y, scale} = this._getPosAndScale()
        let animation = {
          0: {
            // 动画开始，让大cd缩小成小cd一致，且把自己移动到小cd位置处
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            // 移动回大cd原来的位置，且cd放大一点点
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            // 最后大cd还原成原来的大小
            transform: `translate3d(0,0,0) scale(1)`
          }
        }
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })

        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter () {
        this.$refs.cdWrapper.style.animation = ''
      },
      leave (el, done) {
        // 离开的收，让大cd缩小移动到小cd处
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        // 动画执行完成的时候调用
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave () {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      // 获取大cd圆心点移动和缩放到小cd圆心点的位置和缩小比例
      _getPosAndScale () {
        let miniLeftPadding = 40 / 2 + 20  // 迷你播放器的图形40px，paddingLeft=20,小图片中心点距离左边就是40
        let miniBottomPadding = 60 / 2  // mini-player 元素高60，图片是居中的，所以中心点距离底部30
        let normalTopPadding = 80 // middle 元素距离顶部80
        let normalWidth = window.innerWidth * 0.8 // cd-wrapper 的宽是容器的百分之80,容器是圆形（正方形）所以宽高一致
        let miniWidth = 40 // 迷你播放器图形宽度（因为是圆形所以宽高一致）
        let scale = miniWidth / normalWidth  // 小图形占比大图形的比例

        let x = -(window.innerWidth / 2 - miniLeftPadding)
        let y = window.innerHeight - normalTopPadding - miniBottomPadding - normalWidth / 2
        return {
          x, y, scale
        }
      },
      /* 切换播放状态  */
      togglePlaying () {
        // 更改vuex中的playing值,还要编写控制Audio停止播放的代码，所以在watch中去监听这个播放状态
        this.setPlaying(!this.playing)
      },
      prev () {
        // 在快速点击 上/下一首的时候，也会出现 Uncaught (in promise) DOMException: The play() request was interrupted by a new load request. 错误
        // 这个错误可能也是因为dom刷新不及时造成的。
        // 那么就要在歌曲可以播放后，才能点击上/下一首的功能
        if (!this.songReady) {
          return
        }
        this.setCurrentIndex(this.currentIndex - 1)
        // 处理边界
        // 在顺序播放模式下才有这样的边界首尾相链接的处理
        if (this.currentIndex === -1) {
          this.setCurrentIndex(this.playlist.length - 1)
        }
        this.songReady = false
        // 还要处理一种情况，如果 歌曲现在是暂停状态，上/下一首之后也需要切换到播放状态
        if (!this.playing) {
          this.togglePlaying()
        }
      },
      next () {
        if (!this.songReady) {
          return
        }
        this.songReady = false
        this.setCurrentIndex(this.currentIndex + 1)
        if (this.currentIndex === this.playlist.length) {
          this.setCurrentIndex(0)
        }
        if (!this.playing) {
          this.togglePlaying()
        }
      },
      ready () {
        this.songReady = true
      },
      error () {
        this.songReady = true
      },
      timeupdate (e) {
        this.currentTime = e.target.currentTime
      },
      /** 格式化时间,单位秒,返回 00:59  这样的 分:秒 字符串 */
      format (interval) {
        interval = interval | 0  // 向下取整,同函数Math.floor(7/2)相同功能
        const minute = interval / 60 | 0
        const second = interval % 60
        // 这里有一个问题，返回的秒小于10的时候没有补0填充，需要编写一个工具方法补0
        return `${minute}:${this._pad(second)}`
      },
      /*  pad 有填充的意思
       *  num : 数字
       *  n : 要填充的位数
       */
      _pad (num, n = 2) {
        // 这里针对秒做补零操作
        let len = num.toString().length
        let result = num
        while (len < n) {
          result = '0' + result
          len++
        }
        return result
      },
      // 进度条被拖动改变的时候
      onPercentChange (percent) {
        // 控制audio的播放器歌曲时间
        let currentTime = this.currentSong.duration * percent
        console.log(currentTime, ' total:', this.currentSong.duration)
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {  // 暂停状态，在拖动后直接开始播放
          this.togglePlaying()
        }

        // 在这里还有一个现象，待后面的功能解决：拖动到最后，则发现歌曲不播放了，在其他的播放器中拖动进度条在最后，就应该是切下一首歌曲了
      },
      playModelChange () {
        let mode = (this.mode + 1) % 3  // 循环3次切换
        this.setPlayModel(mode)
        let list = null
        if (mode === playMode.random) {
          // 获得原始列表，打乱顺序后，再赋值给播放列表
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }
        this._resetCurrentIndex(list)
        this.setPlayList(list)
      },
      _resetCurrentIndex (list) {
        let songId = this.currentSong.id
        let index = list.findIndex((item) => {
          return item.id === songId
        })
        // 在getters中 currentSong 是根据索引获取到歌曲属性对象的
        // 这里索引改变了，currentSong 也改变了，但是对象一样的，
        // 因为在shuffle中现在的实现是在原来的列表中打乱顺序的，他们的内存地址一样
        // 所以 为什么 还会触发watch中的currentSong事件呢？没有搞明白
        // 但是现象就是这样的
        console.log('CurrentIndex:', this.currentIndex, ' :findIndex:', index)
        this.setCurrentIndex(index)
      },
      // 歌曲播放结束
      onended () {
        if (this.mode === playMode.loop) {
          // 如果是循环播放，则歌曲单曲循环 -- 尼玛，原来是单曲循环
          this.loop()
        } else {
          this.next()
        }
      },
      loop () {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
      },
      getLyric () {
        this.currentSong.getLyric().then(lyric => {
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        })
      },
      handleLyric ({lineNum, txt}) {
        console.log(lineNum, '=========', txt)
        this.currentLineNum = lineNum
      }
    },
    watch: {
      // 当前歌曲变化的时候 播放歌曲
      currentSong (newSong, oldSong) {
        console.log('对比结果:', oldSong === newSong, ' oldSong:', oldSong, ' newSong:', newSong)
        // 解决切换播放模式后，该事件就算歌曲 对比结果是相同的情况下还是会触发watch事件
        // 如果这时 在暂停状态，那么如果没有这里的判断，就会触发下面的 play操作
        if (newSong.id === oldSong.id) {
          return
        }
        // 在dom没有变化之前调用play会出错，所以使用vue提供的dom更新后调用
        this.$nextTick(() => {
          this.$refs.audio.play()
          this.getLyric()
        })
      },
      playing (staus) {
        // 这里暂时没有发现 有报错，可能和浏览器版本有关吧
        // console.log(staus)  // 通过增加日志定位异常
        this.$nextTick(() => {
          staus ? this.$refs.audio.play() : this.$refs.audio.pause()
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player {
  // 这里并必须要分开写，不然就会影响迷你播放器下的样式。
    .normal-player {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background $color-background
      .background {
        position absolute
        left 0
        top 0
        right 0
        bottom 0
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      }
      .top {
        position relative
        margin-bottom 25px
        .back {
          position absolute
          top 0
          left 6px
          .icon-back {
            display block
            padding 9px
            font-size $font-size-large-x
            color $color-theme
            transform rotate(-90deg)
          }
        }
        .title {
          width 70%
          margin 0 auto
          text-align center
          line-height 40px
          no-wrap()
          font-size $font-size-large
          color $color-text
        }
        .subtitle {
          text-align center
          line-height 20px
          font-size $font-size-medium
          color $color-text
        }
      }
      .middle {
        position absolute
        top 80px
        bottom 170px
        width 100%
        font-size 0
        white-space nowrap
        .middle-l {
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
        // padding 的百分比始终参考的是 宽度值，而这里宽度是100%
        // 而 内部的cd-wrapper 的宽度是百分之 80%，高为100%
        // 所以 middle-l 的高是 宽度的 80%，而 cd-wrapper的高为100%也就是和 middle-l的高一致
        // 而 cd-wrapper de 宽为80%,那么就和middle-l的高度一致，正方形
          padding-top: 80%
          height 0
          .cd-wrapper {
            position: absolute
            left: 10% // 左右10% + 宽80% 刚好让这个容器居中
            top: 0
            width: 80%
            height: 100%
            .cd {
              width 100%
              height 100%
              box-sizing border-box // 任何内边距和边框都将在已设定的宽度和高度内进行绘制。让绘制的圆形始终在限制的高度内
              border 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play, &.pause {
                animation: rotate 20s linear infinite
              }
              &.pause {
                animation-play-state: paused // css3属性 动画是否暂停 或则运行
              }
              .image {
                position absolute
                left 0
                top 0
                width 100%
                height 100%
                border-radius 50%
              }
            }
          }
        }
        .middle-r {
          display inline-block
          vertical-align top
          width 100%
          height 100%
          overflow hidden
          .lyric-wrapper {
            width 80%
            margin 0 auto
            overflow hidden
            text-align center
            .text {
              line-height 32px
              color $color-text-l
              font-size $font-size-medium
              &.current {
                color $color-text
              }
            }
          }
        }
      }
      .bottom {
        position absolute
        bottom 50px
        width 100%
        .operators {
          display flex
          align-items center // 当高度不一致的时候，能让他们垂直居中
          .icon {
            flex 1
            color $color-theme
            &.disable {
              color $color-theme-d
            }
            i {
              font-size 30px
            }
          }
          .i-left {
            text-align right
          }
          .i-center {
            text-align center
            padding 0 20px
            i {
              font-size 40px
            }
          }
          .i-right {
            text-align left
          }
          .icon-favorite {
            color: $color-sub-theme
          }
        }
        .progress-wrapper {
          display flex
          align-items: center
          width 80%
          margin 0 auto
          padding 10px 0
          .time {
            flex 0 0 30px
            color $color-text
            font-size $font-size-small
            line-height 30px
            &.time-l {
              text-align left
            }
            &.time-r {
              text-align right
            }
          }
          .progress-bar-wrapper {
            flex 1
          }
        }
      }
    // 定义进入和离开过度状态，这个类中可以定义过程时间，延迟和曲线函数。
      &.normal-enter-active, &.normal-leave-active {
        transition all 0.4s
        .top, .bottom {
          /*transition all 0.4s*/ // 基础效果
          transition all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32) // 贝塞尔曲线，有一种回弹的效果，看不懂这些数值标识啥意思
        }
      }
      &.normal-enter, &.normal-leave-to {
        opacity 0
        .top {
          transform: translate3d(0, -100px, 0)
        }
        .bottom {
          transform: translate3d(0, 100px, 0)
        }
      }
    }

    .mini-player {
      position fixed
      bottom 0
      right 0
      left 0
      height 60px
      background $color-highlight-background
      display flex
      align-items center // 所有元素垂直居中
      .icon {
        display 0 0 40px
        padding: 0 10px 0 20px
        img {
          border-radius 50%
          &.play, &.pause {
            animation: rotate 10s linear infinite
          }
          &.pause {
            animation-play-state: paused
          }
        }
      }
      .text {
        flex 1
        display flex
        flex-direction column // 垂直布局
        justify-content center
        line-height 20px
        overflow hidden
        .name {
          no-wrap()
          font-size $font-size-medium
          color $color-text
          margin-bottom 2px
        }
        .desc {
          no-wrap()
          font-size $font-size-small
          color $color-text-d
        }
      }
      .control {
        flex 0 0 30px
        width 30px
        padding 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist {
          font-size: 30px
          color: $color-theme-d
        }
        .icon-mini {
          font-size: 32px
          position: absolute
          left: 0
          top: 0
        }
      }
      &.mini-enter-active, &.mini-leave-active {
        transition all 0.4s
      }
      &.mini-enter, &.mini-leave-to {
        opacity 0
      }
    }
    @keyframes rotate {
      0% {
        transform: rotate(0)
      }
      100% {
        transform: rotate(360deg)
      }
    }
  }
</style>
