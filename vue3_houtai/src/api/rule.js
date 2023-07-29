
/*
 * @Author: 陆小杭 924169430@qq.com
 * @Date: 2023-07-02 17:59:04
 * @LastEditors: 陆小杭 924169430@qq.com
 * @LastEditTime: 2023-07-05 14:47:22
 * @FilePath: \vue3_houtai\src\api\rule.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from '@/axios'

/*
    请求Body参数
    参数名	示例值	参数类型	是否必填	参数描述
    rule_id	0	Number	是	上级菜单ID
    menu	0	Number	是	是否是菜单，0否1是
    name	商品列表分页	Text	是	菜单/权限名称
    condition	getGoodsList	Text	是	后端规则，由后端提供的接口别名（menu为0时必填）
    method	GET	Text	是	请求方式：GET/POST/PUT/DELETE（menu为0时必填）
    status	1	Number	是	是否启用
    order	20	Number	是	排序
    icon	shopping-cart-full	Text	是	element-plus图标（menu为1必填）
    frontpath	/goods/list	Text	是	对应前端路由路径（menu为1且rule_id>0时必填）
*/

// 权限列表
export function getRuleList(page) {
  return axios.get(`/admin/rule/${page}`)
}
// 添加权限
export function createRule(data) {
  return axios.post(`/admin/rule`, data)
}
// 更新权限
export function updateRule(id, data) {
  return axios.post(`/admin/rule/${id}`, data)
}
// 删除权限
export function deleteRule(id) {
  return axios.post(`/admin/rule/${id}/delete`)
}

// 修改菜单权限状态
export function updateRuleStatus(id, status) {
  return axios.post(`/admin/rule/${id}/update_status`, {
    status,
  })
}
