import * as types from './mutations-types'
import { shuffle } from '../common/js/util'
import { playMode } from '../common/js/config'

// 官方语法 https://vuex.vuejs.org/zh-cn/actions.html
export const selectPlay = function ({commit, state}, {list, index}) {
  // 先暂时播放列表和排序列表一致
  // 且 打开全屏播放器模式，并且设置为播放状态
  commit(types.SET_SEQUENCE_LIST, list)

  let playList = null
  let _index = index
  if (state.mode === playMode.random) {
    playList = shuffle(list)
    _index = findIndex(playList, list[index]) // 获取点击的歌曲信息，所在新的播放列表中的索引
  } else {
    playList = list
  }
  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_CURRENT_INDEX, _index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
}

function findIndex (list, currentSong) {
  let songId = currentSong.id
  let index = list.findIndex((item) => {
    return item.id === songId
  })
  return index
}

/**
 * 随机播放歌曲
 * @param commit
 * @param state
 * @param list
 */
export const randomPlay = function ({commit, state}, list) {
  // 与顺序播放不同的是，播放模式 和 播放列表不同
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, shuffle(list))
  commit(types.SET_CURRENT_INDEX, 0)  // 播放列表打乱之后，直接播放列表中的第一首歌曲就是
  commit(types.SET_MODE, playMode.random)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
}
