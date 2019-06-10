import request from '@/utils/request'

/**
 * 获取科室列表
 * @param query 当前页码，页面大小，选择的科室类别等
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

/**
 * 添加科室信息
 * @param query 科室信息
 */
export function addDepartment(query) {
  console.log('addDepartment: ')
  console.log(query)
  return request(
    {
      url: '/department/add',
      method: 'post',
      params: query,
      baseURL: 'http://localhost:8081/cloud-hospital/',
      contentType: 'application/x-wwww-form-urlencoded'
    }
  )
}
