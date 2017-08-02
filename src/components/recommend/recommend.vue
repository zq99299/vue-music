<template>
  <div class="recommend">
    <Scroll ref="scroll" class="recommend-content" :data="songList">
      <div>
        <!-- 轮播图-->
        <div class="slider-wrapper" v-if="recommends.length">
          <!-- todo 这里需要注意渲染时机，只能让轮播图有数据的时候再显示轮播图，因为图片数据是异步获取的
            会造成插槽内无内容，插件内部的js对插槽内容获取失败，处理失败
          -->
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <!--
                  scroll的点击事件覆盖了这里的点击跳转事件，增加 class="needsclick" 来解决
                  class="needsclick" ： 是  fastclick 提供的，也可以作用在任意元素上
                -->
                <img class="needsclick" @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <!--推荐列表-->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in songList" class="item">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl"/>
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!songList.length">
        <loading></loading>
      </div>
    </Scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getRecommend, getSongList } from 'api/recommend.js'
  import { ERR_OK } from 'api/config.js'
  import Slider from 'base/slider/slider'
  import Scroll from 'base/scroll/Scroll'
  import Loading from 'base/loading/Loading'

  export default {
    components: {Slider, Scroll, Loading},
    data () {
      return {
        recommends: [],  // 轮播图数据
        songList: [],  // 歌单数据
        checkLoaded: false  // 图片是否已经加载过至少一次，用于scroll高度的刷新
      }
    },
    created () {
      this._getRecommend()
      this._getSongList()
    },
    mounted () {
    },
    methods: {
      _getRecommend () {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
//            this.songList = res.data.songList
          }
        })
      },
      _getSongList () {
        getSongList().then((res) => {
          if (res.code === ERR_OK) {
            this.songList = res.data.list
          }
        })
      },
      loadImage () {
        // 因为几张图片高宽都是一样的，所以指需要一张图片被加载就ok了
        if (!this.checkLoaded) {
          console.log('图片被加载了')
          this.$refs.scroll.refresh()
          this.checkLoaded = true
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .recommend
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height 65px
          line-height 65px
          text-align center
          font-size $font-size-medium
          color: $color-theme
        .item
          display flex
          box-sizing border-box
          align-items center // 垂直居中
          padding 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            flex-direction: column // 垂直布局，默认是横向布局
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d

  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
