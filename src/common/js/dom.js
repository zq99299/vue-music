/**
 * Created by mrcode on 2017/6/25.
 */

export function addClass (el, className) {
  /**
   * 1. 先判断是否已经包含该class
   * 2. 没有则拿到className，并分割成数组，再把当前的className插入
   * 3. 最后赋值成新的className
   */
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass (el, className) {
  // 通过正则判断是否包含该class
  // className 开头 或则 空白字符开头；结尾无则空白字符结尾
  // 开头结尾是边界，正则还是不太熟悉
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

/**
 * 获取dom 元素上的属性，data开头的属性，
 * @param el
 * @param name
 * @param val 有值就设置，没有值就获取
 * @returns {*}
 */
export function getData (el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

// 能力检测
let elementStyle = document.createElement('div').style
// 供应商,一个立即执行函数
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    ms: 'msTransform',
    standard: 'transform'  // 标准
  }

  // 查看dom的style里面是否包含这个属性，包含则返回
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  // 所有的前缀都不支持的话，就有问题了
  return false
})()

export function prefixStyle (style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  // 加上前缀，首字母大写，比如：transform 加工之后返回 webkitTransform
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
