import request from '@/utils/request'

export function fetchConstantDepartmentMap(query) {
  console.log('fetchConstantDepartmentMap: ')
  console.log(query)
  return request({
    url: '/department/const',
    method: 'get',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

