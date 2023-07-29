/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-20 23:22:58
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-23 23:40:10
 * @FilePath: \vue3_houtai\src\utils\sort.js
 * @Description:数组排序
 */

// 上移
export function useArrayMoveUp(arr, index) {
  if (index == 0) {
    return
  }

  swapArray(arr, index, index - 1)
}

// 下移
export function useArrayMoveDown(arr, index) {
  if (index == arr.length - 1) {
    return
  }
  swapArray(arr, index, index + 1)
}

// 位置调换
function swapArray(arr, index1, index2) {
  // splice的返回值是截取的那个数字
  arr[index2] = arr.splice(index1, 1, arr[index2])[0]
}

// sku排序算法
export function cartesianProductOf() {
  return Array.prototype.reduce.call(arguments, function (a, b) {
    var ret = []
    a.forEach(function (i) {
      b.forEach(function (j) {
        ret.push([i].concat([j]))
      })
    })
    return ret
  })
}
