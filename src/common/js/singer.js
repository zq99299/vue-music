// 由于在处理中出现了多次为歌手信息赋值的操作，可以抽象成一个歌手信息类

export default class Singer {
  constructor ({id, name, mid}) {
    this.id = id
    this.name = name
    this.avtar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${mid}.jpg?max_age=2592000`
    this.mid = mid
  }
}

