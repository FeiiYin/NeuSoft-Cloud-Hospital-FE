import request from '@/utils/request'

/**
 * 获取挂号级别列表
 * @param query 当前页码，页面大小，选择的挂号类别等
 * @returns 分页的挂号级别列表
 */
export function selectRegistration_categoryList(query) {
  console.log('selectRegistration_categoryList: ')
  console.log(query)
  return request({
    url: '/registration_category/list',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 添加挂号级别信息
 * @param newRegistration_category 新增的挂号级别信息
 */
export function addRegistration_category(newRegistration_category) {
  console.log('addRegistration_category: ')
  console.log(newRegistration_category)
  return request(
    {
      url: '/registration_category/add',
      method: 'post',
      params: newRegistration_category,
      baseURL: 'http://localhost:8081/cloud-hospital/',
      contentType: 'application/x-wwww-form-urlencoded'
    }
  )
}

/**
 * 修改挂号级别信息
 * @param query 修改后的挂号级别信息，将根据主键找到原信息进行修改
 */
export function updateRegistration_categoryByPrimaryKey(query) {
  console.log('updateRegistration_categoryByPrimaryKey: ')
  console.log(query)
  return request(
    {
      url: '/registration_category/update',
      method: 'put',
      params: query,
      baseURL: 'http://localhost:8081/cloud-hospital/',
      contentType: 'application/x-wwww-form-urlencoded'
    }
  )
}

/**
 * 删除挂号级别信息
 * @param registration_categoryIdList 删除挂号级别信息的主键列表
 */
export function deleteRegistration_categoryByPrimaryKey(registration_categoryIdList) {
  console.log('deleteRegistration_categoryByPrimaryKey: ')
  console.log(registration_categoryIdList)
  return request(
    {
      url: '/registration_category/delete',
      method: 'delete',
      params: registration_categoryIdList,
      baseURL: 'http://localhost:8081/cloud-hospital/',
      contentType: 'application/json'
    }
  )
}
