import request from '@/utils/request'

/**
 * 按挂号编号获取受费条目
 * @param query currentPage, pageSize, registrationId, startDate, endDate
 */
export function selectChargeForm(query) {
  console.log('selectChargeForm')
  console.log(query)
  return request({
    url: '/charge_form/list',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 按科室编号 获取 该科室的收费项目
 * @param departmentId 科室编号
 * @return 该科室的收费项目列表
 */
export function selectChargeItemByDepartmentId(departmentId) {
  console.log('selectChargeItemByDepartmentId')
  console.log(departmentId)
  return request({
    url: '/charge_form/list_charge_item',
    method: 'get',
    params: departmentId,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 添加收费项目到收费账单中
 *
 * @param chargeItemId   收费项目编号
 * @param registrationId 挂号编号
 * @param itemCount      收费项目计数
 * @param collectorId    收费员编号
 * @return 添加成功 true；添加失败 false
 */
export function addChargeItemToForm(query) {
  console.log('addChargeItemToForm')
  console.log(query)
  return request({
    url: '/charge_form/add_charge_item_to_form',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 按收费项目编号列表 删除多个收费项目
 *
 * @param chargeItemIdList 收费项目编号
 * @return
 */
export function deleteChargeItemInForm(query) {
  console.log('deleteChargeItemInForm')
  console.log(query)
  return request({
    url: '/charge_form/delete_charge_item_in_form',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}