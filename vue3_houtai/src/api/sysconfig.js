import axios from '@/axios'
// 获取原有系统设置
export function getSysCongfig() {
  return axios.get('/admin/sysconfig')
}

// 修改系统设置
export function setSysCongfig(data) {
  return axios.post('/admin/sysconfig', data)
}

// 上传文件
export const uploadUrl = '/api/admin/sysconfig/upload'