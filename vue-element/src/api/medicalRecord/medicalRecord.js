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
