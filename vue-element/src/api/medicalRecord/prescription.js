import request from '@/utils/request'

/**
 * 获取所有药品列表
 * 药品数量较多，可能增加网络和浏览器的负担
 *
 * @return 包含所有药品信息的列表
 */
export function selectMedicine() {
  console.log('selectMedicine: ')
  return request({
    url: '/prescription/list_medicine',
    method: 'get',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 通过中文名称或拼音搜索药品信息
 *
 * @param resultNumber 最大结果数量
 * @param query        搜索关键词
 * @return
 */
export function searchMedicine(query) {
  console.log('searchMedicine query: ')
  console.log(query)
  return request({
    url: '/prescription/search_medicine',
    method: 'get',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 保存处方（三种保存状态：暂存、提交、存为模板）
 *
 * @param prescriptionJson 表示处方信息的 json 字符串
 * @return 操作结果
 * 该 json 字符串包含的属性：
 * - prescriptionId 处方编号（新增时填 -1，更新时填被更新的编号）
 * - prescriptionName 处方名称
 * - registrationId 挂号编号（暂存或正式提交 必填，模板 可空）
 * - doctorId 创建模板的医生编号（暂存或正式提交 可空，模板 必填）
 * - saveState 保存状态（暂存 0；正式提交 1；全院模板 2；科室模板 3；医生个人模板 4）
 * - medicine 处方中包含的药物清单，json 数组
 * <p>
 * - medicine 数组中每个元素包含的属性：
 * - medicineId 处方药品编号
 * - unitPrice 药品单价
 * - nums 药品数量
 * - medicineUsage 药品用途
 * - medicineDosage 药品用量
 * - medicineFrequency 药品使用频率
 * - medicineNumberDay 药品使用天数
 * - skinTest 皮试
 * - skinTestResult 皮试结果
 * - doctorAdvice 医嘱
 */
export function savePrescription(query) {
  console.log('savePrescription query: ')
  console.log(query)
  return request({
    url: '/prescription/save_prescription',
    method: 'post',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 获取常用药品
 *
 * @param medicineNumber 常用药品的数量
 * @return 常用药品信息列表
 */
export function commonMedicine(query) {
  console.log('commonMedicine query: ')
  console.log(query)
  return request({
    url: '/prescription/common_medicine',
    method: 'get',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 查询处方模板
 *
 * @param prescriptionScope 查询的处方模板的范围（全院模板 2；科室模板 3；医生个人模板 4）
 * @param doctorId          医生编号
 * @return 处方模板列表
 */
export function selectPrescriptionTemplate(query) {
  console.log('selectPrescriptionTemplate query: ')
  console.log(query)
  return request({
    url: '/prescription/prescription_template',
    method: 'get',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 获取历史处方（暂存 或 正式提交）
 *
 * @param registrationId 挂号编号
 * @return 历史处方列表，json 字符串列表
 */
export function selectHistoryPrescription(query) {
  console.log('selectHistoryPrescription query: ')
  console.log(query)
  return request({
    url: '/prescription/history_prescription',
    method: 'get',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 删除处方记录
 *
 * @param prescriptionIdList 处方编号列表
 * @return 操作结果
 */
export function deletePrescription(query) {
  console.log('deletePrescription query: ')
  console.log(query)
  return request({
    url: '/prescription/delete_prescription',
    method: 'delete',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
