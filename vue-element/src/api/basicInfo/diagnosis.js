import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/diagnostic_catalog/list',
    method: 'get',
    params: query
  })
}
