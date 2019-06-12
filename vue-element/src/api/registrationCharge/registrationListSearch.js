import request from '@/utils/request'

/**
 * 获取所有挂号列表
 * @param query 当前页码，页面大小
 */
export function fetchRegistrationList(query) {
  console.log('fetchRegistrationList')
  console.log(query)
  return request({
    url: '/registration/list_registration',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

