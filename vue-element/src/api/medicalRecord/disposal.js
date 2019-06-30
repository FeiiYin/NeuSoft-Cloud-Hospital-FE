import request from '@/utils/request'

/**
 * 新增处置申请
 *
 * @param disposalJson 处置项目信息，json 字符串
 * @return 操作结果
 * disposalJson 包含的属性：
 * - registrationId 挂号单编号
 * - chargeEntryList 处置项目列表，json 数组
 * 在 chargeEntryList 数组中，每个元素的属性：
 * - chargeItemId 处置项目作为收费项目的编号
 * - nums 处置项目的数量
 */
export function saveDisposal(query) {
  console.log('saveDisposal query: ')
  console.log(query)
  return request({
    url: '/disposal/save',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 根据科室编号获取收费项目中的处置项目
 *
 * @param departmentId 科室编号
 * @return 指定科室的收费项目中的处置项目列表
 */
export function selectDisposalItemListInChargeItemByDepartmentId(query) {
  console.log('selectDisposalItemListInChargeItemByDepartmentId query: ')
  console.log(query)
  return request({
    url: '/disposal/select_disposal_list',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 按挂号单编号获取历史处置项目（所有处置状态）
 *
 * @param registrationId 挂号单编号
 * @return 历史处置项目，json 数组
 */
export function selectHistoryDisposal(query) {
  console.log('selectHistoryDisposal query: ')
  console.log(query)
  return request({
    url: '/disposal/history_disposal',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 执行处置
 * 更改处置状态，修改收费项目的尚未交付数量
 * 处置项目被全部执行完，修改 charge_form 的执行状态
 *
 * @param disposalJson 处置信息，json 字符串
 * @return 操作结果
 * <p>
 * disposalJson 包含的属性：
 * - chargeFormId 处置项目单编号
 * - chargeEntryList 处置项目列表，json 数组
 * chargeEntryList 数组包含的属性：
 * - chargeEntryId 处置项目作为收费项目的编号
 * - not_given_nums 在执行处置后，尚未交付的项目数量，（不修改填-1）
 */
export function updateDisposal(query) {
  console.log('updateDisposal query: ')
  console.log(query)
  return request({
    url: '/disposal/update',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 删除处置项目
 * 由医生执行
 * 只有尚未交付的项目可删除
 *
 * @param chargeFormIdList 删除的处置项目编号列表
 * @return 操作结果
 */
export function deleteDisposal(query) {
  console.log('deleteDisposal query: ')
  console.log(query)
  return request({
    url: '/disposal/delete_disposal',
    method: 'delete',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 删除处置项目
 * 由医生执行
 * 只有未支付的项目可删除
 *
 * @param chargeEntryIdList 删除的处置项目编号列表
 * @return 操作结果
 */
export function deleteDisposalEntry(query) {
  console.log('deleteDisposalEntry query: ')
  console.log(query)
  return request({
    url: '/disposal/delete_disposal_entry',
    method: 'delete',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 查询处置项目模板
 *
 * @param disposalScope 查询的处置项目模板范围（全院模板 2；科室模板 3；医生个人模板 4）
 * @param doctorId      医生编号
 * @return 处置项目模板列表，json 字符串
 */
export function selectDisposalTemplate(query) {
  console.log('selectDisposalTemplate query: ')
  console.log(query)
  return request({
    url: '/disposal/disposal_template',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
