/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-05 22:08:07
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-06-26 19:04:52
 * @FilePath: \vue3_houtai\finally_project\src\utils\message.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ElNotification, ElMessageBox } from 'element-plus'
import nprogress from 'nprogress'

// 消息提示封装
export function toast(
  message,
  type = 'success',
  dangerouslyUseHTMLString = true,
  duration = 3000
) {
  ElNotification({
    message,
    type,
    duration,
    dangerouslyUseHTMLString,
  })
}
/**
 * @description: 消息弹出框
 * @return {*} Promise
 */
export function messageBox(title = '', content = '提示内容', type = 'Warning') {
  return ElMessageBox.confirm(content, title, {
    cancelButtonText: '取消',
    confirmButtonText: '确认',
    type,
  })
}

/**
 * @description: input 消息弹出框
 * @param {*} tip
 * @param {*} value
 * @return {*}
 */
export function showPrompt(tip, value = '') {
  return ElMessageBox.prompt(tip, '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputValue: value,
  })
}

/**
 * @description: 页面跳转的 loading 效果
 * @return {*}
 */
export function showLoading() {
  nprogress.start()
}

/**
 * @description: 隐藏 loading
 * @return {*}
 */
export function closeLoading() {
  nprogress.done()
}
