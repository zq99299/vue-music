import * as types from './mutations-types'

// 官方语法 https://vuex.vuejs.org/zh-cn/actions.html
export const selectPlay = function ({commit, state}, {list, index}) {
  // 先暂时播放列表和排序列表一致
  // 且 打开全屏播放器模式，并且设置为播放状态
  console.log(list)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
}

