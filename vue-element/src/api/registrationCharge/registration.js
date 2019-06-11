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

/**
 * 提交注册信息
 * @param registration 注册表单
 */
export function register(registration) {
  console.log('register')
  console.log(registration)
  return request({
    url: '/registration/register',
    method: 'post',
    params: registration,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
