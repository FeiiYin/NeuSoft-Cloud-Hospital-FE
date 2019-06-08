import request from '@/utils/request'

export function fetchConstantMap(query) {
  console.log('fetchConstantMap: ')
  console.log(query)
  return request({
    url: '/department/const',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 获取部门列表
 * @param query
 * @returns {*}
 */
export function fetchDepartmentList() {
  console.log('fetchDepartmentList: ')
  // console.log(query)
  return request({
    url: '/department/list',
    method: 'get',
    // params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
