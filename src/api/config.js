/**
 * Created by mrcode on 2017/6/25.
 */
export const commonParams = {
  g_tk: 5381,
  format: 'jsonp',
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0
}

// json 库的配置，腾讯的callback的参数名为 jsonpCallback
export const options = {
  param: 'jsonpCallback'
}

// 返回成功的code都是0
export const ERR_OK = 0
