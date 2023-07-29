export default function (query) {
  let que = []
  for (const key in query) {
    if (query[key]) {
      // 将对象数据转化为 URI（统一资源标识符）进行编码
      que.push(`${key}=${encodeURIComponent(query[key])}`)
    }
  }
  let url = que.join('&')
  url = url ? '?' + url : ''
  return url
}
