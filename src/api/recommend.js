import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

// 编写第一个推荐页面的数据接口获取
// 通过经验抓去qq音乐的接口数据的提交参数有很多固定的，所以需要提取成配置参数的形式
// 我们把配置的参数写到config.js中
export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  // Object.assign 是es6的语法，把默认参数和新参数合并成一个对象
  // 这些具体的参数，需要通过去分析，找到发送的请求然后拿过来，一般的请求的参数都不会很复杂
  const data = Object.assign({}, commonParams, {
    uin: 0,  // 登录后将是qq号，否则是0
    platform: 'h5',
    needNewCode: 1
  })

  return jsonp(url, data, options)
}
/**
 * 歌单列表：在上面的推荐数据中，其实已经包含推荐的歌单列表了
 * 这里拿pc端的全部歌单列表中的部分数据，是为了讲解axios请求器的代理功能
 */
export function getSongList () {
  const url = '/api/getDiscList'   // 该地址访问的是dev-server.js中的代理
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)  // 难道是直接返回一个Promise？ 不用固定new Promise的写法了?
    // return res.data  // 这里没有看出来有什么
  })
}
