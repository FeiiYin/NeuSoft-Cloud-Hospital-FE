import request from '@/utils/request'

/**
 * 获取部门列表
 * @param query
 * @returns {*}
 */
export function fetchDepartmentList(query) {
  console.log('fetchDepartmentList: ')
  console.log(query)
  return request({
    url: '/department/list',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
