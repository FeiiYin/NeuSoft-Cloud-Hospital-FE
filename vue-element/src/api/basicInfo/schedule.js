import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/doctor_scheduling/list',
    method: 'get',
    params: query
  })
}
