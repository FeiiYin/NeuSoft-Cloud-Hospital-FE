import request from '@/utils/request'

/**
 * 获取科室列表
 * @param query
 * @returns {*}
 */
export function fetchDepartmentList(query) {
  console.log('fetchDepartmentList: ')
  // console.log(query)
  return request({
    url: '/department/list',
    method: 'get',
    params: query, // 当前页码，页面大小，选择的科室类别等
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
