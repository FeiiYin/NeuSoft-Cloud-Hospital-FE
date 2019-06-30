import request from '@/utils/request'

/**
 * 按挂号单编号获取患者信息
 *
 * @param registrationId 挂号单编号
 * @return 患者信息
 */
export function selectPatient(query) {
  console.log('selectPatient query')
  console.log(query)
  return request({
    url: '/medical_tech/patient_info',
    method: 'get',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 按挂号单编号获取收费项目列表
 *
 * @param registrationId 挂号单编号
 * @return 收费项目列表，json 字符串
 */
export function selectChargeEntryList(query) {
  console.log('selectChargeEntryList query')
  console.log(query)
  return request({
    url: '/medical_tech/list_medicine',
    method: 'get',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 应用收费项目
 *
 * @param chargeEntryListJson 收费项目信息，json 数组
 * @return 操作结果
 * chargeEntryListJson 数组中每个元素包含的属性：
 * - chargeEntryId 收费项目编号
 * - executionNums 此次消耗的项目数
 */
export function chargeEntryListApply(query) {
  console.log('chargeEntryListApply query')
  console.log(query)
  return request({
    url: '/medical_tech/apply',
    method: 'get',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 收费项目退费
 * 收费项目只有在执行前可退，执行后的收费项目无法退费
 *
 * @param chargeEntryListRefundJson 退费信息，json 字符串
 * @return 操作结果
 * <p>
 * 退费信息 json 字符串是 json 数组，该数组中的每项元素包含如下属性：
 * - chargeId 收费项目的编号，int 型
 * - returnNums   退费数量，int 型
 */
export function chargeEntryListRefund(query) {
  console.log('chargeEntryListRefund query')
  console.log(query)
  return request({
    url: '/medical_tech/return',
    method: 'get',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
