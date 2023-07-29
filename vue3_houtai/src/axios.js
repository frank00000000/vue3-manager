/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-06-05 16:50:50
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-20 22:22:10
 * @FilePath: \vue3_houtai\src\axios.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios'
import { getToken, removeToken } from '@/utils/token'
import { toast } from '@/utils/message'
import store from '@/store'
const Axios = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

/**
 * @description 请求拦截器
 * @date 2023/06/05
 * @param {*}
 * @return { Promise<any> } promise
 */
Axios.interceptors.request.use(
  function (config) {
    const token = getToken()

    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

/**
 * @description 响应拦截器
 * @date 2023/06/05
 * @param {*}
 * @return { Promise<any> } promise
 */
Axios.interceptors.response.use(
  // 请求成功结果返回res.data.data
  function (res) {
    // 
    return res.request.responseType == 'blob' ? res.data : res.data.data
  },
  function (error) {
    const msg = error.response.data.msg || '账号或密码错误'
    if (msg == '非法token，请先登录！') {
      store.dispatch('logout').finally(() => {
        location.reload()
      })
    }

    toast(msg, 'error')
    return Promise.reject(error)
  }
)

export default Axios
