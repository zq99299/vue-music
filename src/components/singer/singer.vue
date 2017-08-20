<template>
  <div class="singer">
    <list-view :data="singerList" @select="selectSinger"></list-view>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getSinger } from 'api/singer.js'
  import { ERR_OK } from 'api/config.js'
  import ListView from 'base/listview/ListView'
  import Singer from 'common/js/singer'
  // 语法糖，对mutations做了一层封装，减少代码量
  import { mapMutations } from 'vuex'

  // 每个分组都有一个名称
  const HOT_NAME = '热门'
  // 热门数据定义取前多少条数据为热门
  const HOT_SINGER_LEN = '10'

  export default {
    components: {ListView},
    data () {
      return {
        singerList: []
      }
    },
    created () {
      this._getSingerList()
    },
    methods: {
      selectSinger (singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      _getSingerList () {
        getSinger().then((res) => {
          if (res.code === ERR_OK) {
            this.singerList = this._normalizeSinger(res.data.list)
          }
        })
      },
      /**
       * 规范化歌手数据；
       * 原因：
       * api直接获取到的不符合我们的页面逻辑的数据
       * 我们的列表是一个按字母列表分组的数据
       * 所以要按字母分组聚合
       * @param list
       * @private
       */
      _normalizeSinger (list) {
        let map = {
          // 热门数据取前10
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_id,
              name: item.Fsinger_name,
              mid: item.Fsinger_mid
            }))
          }
          // 按 index的字母聚合数据
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_id,
            name: item.Fsinger_name,
            mid: item.Fsinger_mid
          }))
        })
        // 为了得到有序列表，我们需要处理 map
        let hot = []
        let ret = []
        for (let key in map) {
          let val = map[key]
          // 如果是字母的话就提取出来，因为还看到map中还有数字的index，这个数据是不需要的
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        // 升序排序
        ret.sort((a, b) => {
          // 得到字母的charcode 然后对比
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        // 再把两个数组链接起来,合并成一个
        return hot.concat(ret)
      },
      // 映射，把mutations.js中定义的SET_SINGER映射成一个setSinger方法
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%

  .slide-enter-active, .slide-leave-active
    transition all 0.3s

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
