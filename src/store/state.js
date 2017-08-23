import { playMode } from '../common/js/config'

const state = {
  /* 歌手页面跳转到歌手详情页面传递的参数 */
  singer: {},
  /* 播放器播放状态：播放？暂停 */
  playing: false,
  /* 全屏模式 ？ 迷你模式 */
  fullScreen: false,
  /* 原始播放列表数据 */
  playlist: [],
  /* 顺序列表:支持2种：1. 顺序播放(和playlist顺序一致)，2. 随机播放  */
  sequenceList: [],
  /* 播放模式：支持三种：1. 随机 2.顺序 3.单曲循环  */
  mode: playMode.sequence,
  /* 当前正常播放的歌曲索引 */
  currentIndex: -1
}

export default state
