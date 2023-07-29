import axios from '@/axios'
// 公告列表
export function getNoticeList(page) {
  return axios.get(`/admin/notice/${page}`)
}

// 添加公告
export function createNotice(data) {
  return axios.post(`/admin/notice`, data)
}
// 修改公告
export function updateNotice(id, data) {
  return axios.post(`/admin/notice/${id}`, data)
}
// 删除公告
export function deleteNotice(id) {
  return axios.post(`/admin/notice/${id}/delete`)
}
