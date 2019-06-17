import request from '@/utils/request'

/**
 * 获取医生的待诊患者列表
 *
 * @param registrationScope 查询的挂号范围：0 所有；1 医生本人；2 医生所在科室
 * @param doctorId          医生编号
 * @return 待诊患者列表
 */
export function waitingRegistrationList(query) {
  console.log('waitingRegistrationList: ')
  console.log(query)
  return request({
    url: '/doctor_work/waiting_registration',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 获取医生的已诊患者列表
 *
 * @param registrationScope 查询的挂号范围：0 所有；1 医生本人；2 医生所在科室
 * @param doctorId          医生编号
 * @return 已诊患者列表
 */
export function visitedRegistrationList(query) {
  console.log('visitedRegistrationList: ')
  console.log(query)
  return request({
    url: '/doctor_work/visited_registration',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 保存门诊病历信息（暂存 或 正式提交）
 * 在正式提交后之后，医生才可以进行检查、检验、处置、开立处方等操作
 * <p>
 * 病历记录包含的元素有：
 * - registrationId 挂号单编号
 * - mainInfo 主诉
 * - currentDisease 现病史
 * - pastDisease 既往史
 * - physicalExam 体格检查
 * - auxiliaryExam 辅助检查
 * - opinion 处理意见
 * - saveState 保存状态（暂存0 正式提交1）
 * - disease 评估/诊断（JSONArray）
 * <p>
 * 其中，disease 数组中的每个元素包含的元素有：
 * - diseaseId 诊断目录中的编号
 * - mainDisease 主诊（是1 否0）
 * - suspect 疑似（是1 否0）
 * - incidenceDate 发病日期
 *
 * @param medicalRecordJson 病历记录 json 字符串
 * @return 保存成功 true；保存失败 false
 */
export function saveMedicalRecord(medicalRecordJson) {
  console.log('saveMedicalRecord: ')
  console.log(medicalRecordJson)
  return request({
    url: '/doctor_work/save_record',
    method: 'get',
    params: medicalRecordJson,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 保存门诊病历模板
 *
 * @param medicalRecordsId 病历编号（可为空）
 * @param mainInfo         主诉
 * @param currentDisease   现病史
 * @param pastDisease      既往史
 * @param physicalExam     体格检查
 * @param auxiliaryExam    辅助检查
 * @param opinion          处理意见
 * @param saveState        保存方式（全院可见 科室可见 或 医生本人可见）
 * @param doctorId         医生编号
 * @return 操作结果
 */
export function saveMedicalRecordAsTemplate(query) {
  console.log('saveMedicalRecordAsTemplate: ')
  console.log(query)
  return request({
    url: '/doctor_work/save_record_template',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 获取病历模板列表
 *
 * @param templateScope 查找的病历模板范围（全院模板2 科室模板3 医生模板4）
 * @param doctorId      医生编号
 * @return 指定范围的病历模板列表
 */
export function selectMedicalRecordsTemplateList(query) {
  console.log('selectMedicalRecordsTemplateList: ')
  console.log(query)
  return request({
    url: '/doctor_work/select_record_template',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 诊断结束
 * 结束看诊之后，针对该患者不能再进行任何检查、检验的申请以及药品的开立、收费等
 *
 * @param registrationId 挂号编号
 * @return 操作结果
 */
export function endRegistration(query) {
  console.log('endRegistration: ')
  console.log(query)
  return request({
    url: '/doctor_work/end_registration',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 获取患者的历史病历列表
 *
 * @param registrationId 患者的挂号单编号
 * @return 患者的包括此次就诊在内的所有历史病历（包含诊断信息），json 字符串
 */
export function selectPatientHistoryMedicalRecords(query) {
  console.log('selectPatientHistoryMedicalRecords: ')
  console.log(query)
  return request({
    url: '/doctor_work/history_record',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
