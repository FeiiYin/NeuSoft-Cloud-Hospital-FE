import request from '@/utils/request'

/**
 * 根据身份证号获取患者信息
 * @param identifyCardNo 身份证号
 */
export function fetchPatientInfoByIdentifyCardNo(identifyCardNo) {
  console.log('fetchPatientInfoByIdentifyCardNo')
  console.log(identifyCardNo)
  return request({
    url: '/registration/patient_info',
    method: 'get',
    params: identifyCardNo,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
