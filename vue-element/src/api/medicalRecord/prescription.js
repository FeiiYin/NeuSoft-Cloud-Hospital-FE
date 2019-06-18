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
    baseURL: 'http://localhost:8081/cloud-hospital/',
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
  console.log('searchMedicine response: ')
  console.log(query)
  return request({
    url: '/prescription/search_medicine',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
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
 * - registrationId 挂号编号
 * - saveState 保存状态（暂存 0；正式提交 1；全院模板 2；科室模板 3；医生个人模板 4）
 * - medicine 处方中包含的药物清单，json 数组
 * <p>
 * - medicine 数组中每个元素包含的属性：
 * - medicineId 处方药品编号
 * - medicineUsage 药品用途
 * - medicineDosage 药品用量
 * - medicineFrequency 药品使用频率
 * - medicineNumberDay 药品使用天数
 * - medicineQuantity 药品数量
 * - skinTest 皮试
 * - skinTestResult 皮试结果
 */
export function savePrescription(query) {
  console.log('savePrescription response: ')
  console.log(query)
  return request({
    url: '/prescription/save_prescription',
    method: 'post',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 返回常用药
 * medicineNumber 数量
 */
export function commonMedicine(query) {
  console.log('commonMedicine response: ')
  console.log(query)
  return request({
    url: '/prescription/common_medicine',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
