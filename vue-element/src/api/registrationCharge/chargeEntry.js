import request from '@/utils/request'

/**
 * 按挂号编号获取受费条目
 * @param query currentPage, pageSize, registrationId, startDate, endDate
 * chargeFormCategory 收费项目类别（0: 未完成支付； 1: 已完成支付; 2: 所有收费项目）
 */
export function selectChargeForm(query) {
  console.log('selectChargeForm')
  console.log(query)
  return request({
    url: '/charge_entry/list',
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
    url: '/charge_entry/list_charge_item',
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
 * @param unitPrice    收费员编号
 * @param doctorAdvice    收费员编号
 * @return 添加成功 true；添加失败 false
 */
export function addChargeItemToForm(query) {
  console.log('addChargeItemToForm')
  console.log(query)
  return request({
    url: '/charge_entry/add_charge_item_to_form',
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
    url: '/charge_entry/delete_charge_item_in_form',
    method: 'delete',
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
export function payBill(query) {
  console.log('payBill')
  console.log(query)
  return request({
    url: '/charge_entry/pay_bill',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
