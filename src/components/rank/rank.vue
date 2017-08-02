<template>
  <div class="slider-wrapper" v-if="recommends.length">
    <!-- todo 这里需要注意渲染时机，只能让轮播图有数据的时候再显示轮播图，因为图片数据是异步获取的
      会造成插槽内无内容，插件内部的js对插槽内容获取失败，处理失败
    -->
    <slider>
      <div v-for="item in recommends">
        <a :href="item.linkUrl">
          <img :src="item.picUrl">
        </a>
      </div>
    </slider>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getRecommend } from 'api/recommend.js'
  import { ERR_OK } from 'api/config.js'
  import Slider from 'base/slider/slider'
  export default {
    components: {Slider},
    data () {
      return {
        recommends: []  // 轮播图数据
      }
    },
    created () {
      this._getRecommend()
    },
    methods: {
      _getRecommend () {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
