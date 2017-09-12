function getRandomInt (min, max) {
  // random() 返回 0 -0.9999 之间的小数，
  // 假设 min=0,max=20, 0.99 * (20-0 +1) = 20.79 + 0 ,再向下取整 就得到了最大值20
  // 最小值也是一样。不错这个
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 洗牌：这里现在的实现 我觉得有问题，在原有基础上洗牌的，
 * 根据功能来说，是完全没有毛病的；在是在外面使用的场景中，外面把原始列表传递进来了。原始列表的顺序都被改变了
 * @param arr
 */
export function shuffle (arr) {
  let _arr = arr.slice() // 返回一个新的数组，包含从 start 到 end （不包括该元素）的 arrayObject 中的元素。
  let length = _arr.length
  for (let i = 0; i < length; i++) {
    let j = getRandomInt(0, i)
    let a1 = _arr[j]
    _arr[j] = _arr[i]
    _arr[i] = a1
  }
  return _arr
}
