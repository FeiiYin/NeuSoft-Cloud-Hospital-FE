import request from '@/utils/request'

/**
 * 新增检查检验项目
 *
 * @param examinationJson 检查检验项目信息，json 字符串
 * @return 操作结果
 * examinationJson 中包含的属性如下：
 * - registrationId 挂号单编号
 * - saveState 保存状态（暂存 0；正式提交 1；全院模板 2；科室模板 3；医生个人模板 4）
 * - examName 检查名称
 * - clinicalImpression 临床印象
 * - requirement 目的和要求
 * - examResult 检验报告
 * - chargeEntryList 收费项目列表，以 json 数组表示
 * chargeEntryList 数组中的每项元素包含的属性如下：
 * - chargeItemId 收费项目编号
 * - nums 收费项目计数
 * - collectorId 收费员编号
 * - doctorAdvice 医嘱
 */
export function addExamination(query) {
  console.log('addExamination query: ')
  console.log(query)
  return request({
    url: '/exam/add',
    method: 'get',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

export function selectExaminationItemListInChargeItemByDepartmentId(query) {
  console.log('selectExaminationItemListInChargeItemByDepartmentId query: ')
  console.log(query)
  return request({
    url: '/exam/select_exam_list',
    method: 'get',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 按挂号单编号获取历史检查项目（所有检查状态）
 *
 * @param registrationId 挂号单编号
 * @return 历史检查项目，json 数组
 */
export function selectHistoryExam(query) {
  console.log('selectHistoryExam query: ')
  console.log(query)
  return request({
    url: '/exam/history_exam',
    method: 'get',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 删除检查项目
 * 由医生执行
 * 只有未支付的项目可删除
 *
 * @param chargeEntryIdList 删除的检查项目编号列表
 * @return 操作结果
 */
export function deleteUnpaidChargeEntry(query) {
  console.log('deleteUnpaidChargeEntry query: ')
  console.log(query)
  return request({
    url: '/exam/delete_exam_entry',
    method: 'delete',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 删除检查单
 * 这将删除检查单上的所有检查项目
 *
 * @param examinationIdList 检查单编号列表
 * @return 操作结果
 */
export function deleteExam(query) {
  console.log('deleteExam query: ')
  console.log(query)
  return request({
    url: '/exam/delete_exam',
    method: 'delete',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
