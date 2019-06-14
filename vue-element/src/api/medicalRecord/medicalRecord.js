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
