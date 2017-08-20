import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'

export function getSinger () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return jsonp(url, data, options)
}

/**
 * 查询歌手详情列表
 * @param singerId
 */
export function getDingerDetail (singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, commonParams, {
    'loginUin': 0,
    'hostUin': 0,
    'platform': 'yqq',
    'needNewCode': 0,
    'singermid': singerId, // '002J4UUk29y8BY',
    'order': 'listen',
    'begin': 0,
    'num': 30,
    'songstatus': 1
  })
  return jsonp(url, data, options)
}
