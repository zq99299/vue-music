<template>
  <div class="singer-detail">
    <music-list :songs="songs"
                :title="title"
                :bg-image="bgImage"
    ></music-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getDingerDetail } from 'api/singer.js'
  import { ERR_OK } from 'api/config.js'
  import { createSong } from 'common/js/song.js'

  import MusicList from '../music-list/music-list'

  // 语法糖，也可以映射
  import { mapGetters } from 'vuex'

  export default {
    components: {MusicList},
    data () {
      return {
        songs: []
      }
    },
    computed: {
      ...mapGetters([
        'singer'
      ]),
      title () {
        return this.singer.name
      },
      bgImage () {
        return this.singer.avtar
      }
    },
    created () {
      this._getDetail()
      console.log(this.singer)
    },
    methods: {
      _getDetail () {
        // 如果是直接访问这个地址，肯定是从vuex中是获取不到的，
        // 所以：当获取不到的时候，就跳转到歌手列表页

        if (!this.singer.mid) {
          this.$router.push('/singer')
          return
        }
        getDingerDetail(this.singer.mid).then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
            console.log(this.songs)
          }
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          // 这两个参数都是和拼接成的url有关系
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .singer-detail
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    background $color-background
</style>
