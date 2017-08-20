export default class Song {
  /**
   *
   * @param id
   * @param mid
   * @param singer 歌手
   * @param name
   * @param album 专辑名称
   * @param duration 歌曲长度
   * @param image 图片
   * @param url 歌曲的真实请求路径
   */
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

/**
 * 这个方法是一个公用方法，怎么得出来的呢？
 * 在写其他模块的时候，发现其他模块获取到的数据结构都是一样的
 * <pre>
 * "singer": [
 * {
 * "id": 5062,
 * "mid": "002J4UUk29y8BY",
 * "name": "薛之谦"
 * }
 * ],
 * </pre>
 * @param musicData
 * @returns {Song}
 */
export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,  // 歌曲长度多少秒
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // url: `https://thirdparty.gtimg.com/${musicData.songId}.m4a?fromtag=80`
    url: `http://dl.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=38`
  })
}

function filterSinger (singer) {
  let ret = []
  if (!singer) {
    return ret
  }
  singer.forEach(item => {
    ret.push(item.name)
  })
  return ret.join('/')
}
