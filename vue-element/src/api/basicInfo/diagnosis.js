import request from '@/utils/request'

/**
 * 获取页面右侧的疾病信息列表
 * @param query 查询
 */
export function fetchDiseaseList(query) {
  console.log('fetchDiseaseList: ')
  console.log(query)
  return request({
    url: '/diagnostic_catalog/list_disease',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 获取疾病目录
 * @param query 查询
 */
export function fetchDiseaseCategory() {
  console.log('fetchDiseaseCategory: ')
  return request({
    url: '/diagnostic_catalog/list_disease_category',
    method: 'get',
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
