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
/**
 * 增加疾病信息
 */

export function addDisease(addDiseaseInfo) {
  console.log('js 打印的增加', addDiseaseInfo)
  return request(
    {
      url: '/diagnostic_catalog/add',
      method: 'post',
      params: addDiseaseInfo,
      baseURL: 'http://localhost:8081/cloud-hospital/',
      contentType: 'application/x-wwww-form-urlencoded'
    }
  )
}

/**
  * @Description: 更新疾病信息
  * @Param:
  * @Return:
  * Author: Shuhao Xu
  * Date:
  * Time:
  */
export function updateDisease(updateDiseaseInfo) {
  console.log('js update disease', updateDiseaseInfo)
  return request({
    url: '/diagnostic_catalog/update',
    method: 'put',
    params: updateDiseaseInfo,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-www-form-urlencoded'
  })
}

/**
  * @Description: 删除
  * @Param:
  * @Return:
  * Author: Shuhao Xu
  * Date:
  * Time:
  */
export function deleteDiseaseByPrimaryKey(diseaseInfo) {
  console.log('js delete disease', diseaseInfo)
  return request({
    url: '/diagnostic_catalog/delete',
    method: 'delete',
    params: diseaseInfo,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-www-form-urlencoded'
  })
}
