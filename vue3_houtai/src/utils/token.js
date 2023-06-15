import { useCookies } from '@vueuse/integrations/useCookies'
const TokenKey = 'admin-token'
const cookie = useCookies()

/**
 * @description: 获取token
 * @date: 2023/06/05
 * @return {*}
 */
export function getToken() {
  return cookie.get(TokenKey)
}
/**
 * @description: 设置token
 * @date: 2023/06/05
 * @return {*}
 */
export function setToken(data) {
  return cookie.set(TokenKey, data)
}
/**
 * @description: 删除token
 * @date: 2023/06/05
 * @return {*}
 */
export function removeToken() {
  return cookie.remove(TokenKey)
}
