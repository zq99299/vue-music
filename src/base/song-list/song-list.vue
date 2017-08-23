<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for="(song,index) in songs" @click="selectItem(song,index)">
        <div class="content">
          <h2 class="name">{{song.name }}</h2>
          <p class="desc">{{ getDesc(song) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      songs: {
        type: Array,
        default: []
      }
    },
    data () {
      return {}
    },
    methods: {
      //   描述是歌手名和专辑名链接起来的
      //  所以这里可以使用过滤器，也可以使用函数（这样使用还是第一次）
      getDesc (song) {
        return `${song.singer} . ${song.album}`
      },
      selectItem (item, index) {
        this.$emit('select', item, index)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .song-list {
    .item {
      display: flex
      height 64px
      align-items center // 垂直居中（在高度64px中）
      box-sizing border-box
      font-size $font-size-medium
      .content {
        flex 1
        line-height 20px
        overflow hidden
        .name {
          no-wrap()
          color $color-text
        }
        .desc {
          no-wrap()
          margin-top 4px
          color $color-text-d
        }
      }
    }
  }
</style>
