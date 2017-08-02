import originJSONP from 'jsonp'

export default function jsonp (url, data, option) {
  // 需要判断url后面是否有问号
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function param (data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent((value))}`
  }
  // 如果url有值，则将第一个 & 符号去掉
  return url ? url.substring(1) : ''
}
