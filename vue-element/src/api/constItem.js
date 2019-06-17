import request from '@/utils/request'

export function fetchConstantDepartmentMap(query) {
  console.log('fetchConstantDepartmentMap: ')
  console.log(query)
  return request({
    url: '/department/const',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

export function fetchConstantAccountMap(query) {
  console.log('fetchConstantAccountMap: ')
  console.log(query)
  return request({
    url: '/account/const',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
