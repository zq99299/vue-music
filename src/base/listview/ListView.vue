<template>
  <scroll class="list-view"
          ref="listview"
          :data="data"
          :listen-scroll="true"
          :probe-type="2"
          @scroll="listScroll">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item">
            <img v-lazy="item.avtar" class="avtar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li class="item"
            v-for="(item,index) in shortcutList"
            :class="{'current':currentIndex == index}"
            :data-index="index">{{ item }}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/Scroll'
  import { getData } from 'common/js/dom'

  const ANCHOR_HEIGHT = 18  // 每个 list-shortcut 中 item的高度，18=item的字体12 + pading上下3*2

  export default {
    created () {
      // 为什么不在 data里面定义touch？
      // 因为在props中和data中定义的都会被vue监听用于数据的双向绑定
      // 这个并不需要这些监听服务，只需要在当前vue实例中共享数据
      this.touch = {}

      // 配合_calculateHeight方法 存储计算的高度
      this.listHeight = []
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    components: {
      Scroll
    },
    computed: {
      // 快速入口列表集合
      shortcutList () {
        return this.data.map((group) => {
          return group.title.substring(0, 1)  // 热门有两个字，所以要截取掉
        })
      }
    },
    methods: {
      // H5 的触摸开始事件
      onShortcutTouchStart (el) {
        let firstTouch = el.touches[0]
        this.touch.y1 = firstTouch.pageY

        // 拿到dom元素在列表中的索引
        let anchorIndex = getData(el.target, 'index')
        if (anchorIndex) {
          this.touch.anchorIndex = anchorIndex
          this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex])
          // 高亮元素
          this.currentIndex = anchorIndex
          console.log(anchorIndex)
        }
      },
      onShortcutTouchMove (e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        // y 轴上的偏移像素
        let delta = this.touch.y2 - this.touch.y1
        // 得到有几个元素
        delta = delta / ANCHOR_HEIGHT
        // 取整
        delta = delta | 0
        let anchorIndex = (parseInt(this.touch.anchorIndex) + delta)
        let length = this.$refs.listGroup.length
        if (anchorIndex >= length) {
          // 由于触摸和scroll事件不同，触摸是按照第一次触摸的点为起点，
          // 这个计算就会超过实际的索引大小
          anchorIndex = length - 1
        }
        this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex])  // 滚动速度，0 是没有滚动动画

        // 高亮元素
        this.currentIndex = anchorIndex
        console.log(delta, anchorIndex)
      },
      listScroll (pos) {
        this.scrollY = pos.y
        console.log(pos)
      },
      // 计算每个group的高度（数据结构是按组进行聚合的）
      _calculateHeight () {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight  // 计算每一个group所在的高度区域，从0开始
          this.listHeight.push(height)
        }
      }
    },
    data () {
      return {
        // 监控y轴的位置
        scrollY: -1,
        // 当前索引
        currentIndex: 0
      }
    },
    watch: {
      data () {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      // 根据滚动的高度计算当前滚动到的索引，然后利用索引就能得到右侧的索引元素
      scrollY (newY) {
        // 滚动是从起始点顶点开始，而触摸滚动是从第一次触点算做起始点
        if (newY >= 0) {
          this.currentIndex = 0
          return
        }
        let listHeight = this.listHeight
        for (let i = 0; i < listHeight.length; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          let y = -newY // 滚动的话，向下滚动都是负数，从0开始
          // 1. height2 有可能下标越界，获得undefined
          // 2. 在一个区间内
          if (!height2 || (y > height1 && y < height2)) {
            this.currentIndex = i
            console.log(i)
            return
          }
        }
        this.currentIndex = 0
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .list-view {
    width: 100%
    height: 100%
    overflow hidden //这个应该写在父级里面限制这个listview的把。没有明白为什么写在这里也有效果
    background $color-background
    .list-group {
      padding-bottom 30px
      .list-group-title {
        font-size $font-size-small
        line-height 30px
        padding-left 20px
        color $color-text-l
        background $color-highlight-background
      }
      .list-group-item {
        display flex
        align-items center
        padding 20px 0 0 30px
        .avtar {
          width: 50px
          height: 50px
          border-radius: 50%
        }
        .name {
          margin-left 20px
          color $color-text-l
          font-size $font-size-medium
        }
      }
    }
    .list-shortcut {
      position absolute
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding 20px 0
      background: $color-background-d
      border-radius: 10px
      text-align: center
      font-family: Helvetica
      .item {
        padding 3px
        color: $color-text-l
        font-size: $font-size-small
        line-height 1
        &.current {
          color: $color-theme
        }
      }
    }
  }
</style>
