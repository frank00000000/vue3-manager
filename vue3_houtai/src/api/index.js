import axios from '@/axios'


/**
 * @description: 首页数据1 
 * @return {*}
 */
export function getStatistics1() {
  return axios.get('admin/statistics1')
}



/**
 * @description: 首页数据2
 * @return {*}
 */
 export function getStatistics2() {
  return axios.get('admin/statistics2')
}




/**
 * @description: 首页数据3
 * @param {*} type
 * @return {*}
 */
export function getStatistics3(type) {
  return axios.get('admin/statistics3?type='+type)
}
