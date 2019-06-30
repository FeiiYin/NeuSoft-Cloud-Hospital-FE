import request from '@/utils/request'

/**
 * 根据挂号编号查找患者信息
 * @param registrationId 挂号编号
 * @param patientScope   患者搜索范围：所有患者 0，本医生患者 1，本科室患者 2
 * @param doctorId       医生编号
 * @return 患者信息
 */
export function selectPatient(query) {
  console.log('selectPatient: ')
  console.log(query)
  return request({
    url: '/doctor_work/select_patient_by_registration',
    method: 'get',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
