import request from '@/utils/request'

/**
 * 根据身份证号获取患者信息
 * @param identityCardNo 身份证号
 */
export function fetchPatientInfoByIdentityCardNo(identityCardNo) {
  console.log('fetchPatientInfoByIdentityCardNo')
  console.log(identityCardNo)
  return request({
    url: '/registration/patient_info',
    method: 'get',
    params: identityCardNo,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 获取挂号科室列表
 */
export function fetchDepartment() {
  console.log('fetchDepartment')
  return request({
    url: '/registration/list_department',
    method: 'get',
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 获取当前可挂号的医生列表
 */
export function fetchCurrentAvailableDoctor(departmentIdOfDoctor) {
  console.log('fetchCurrentAvailableDoctor')
  console.log(departmentIdOfDoctor)
  return request({
    url: '/registration/list_doctor',
    method: 'get',
    params: departmentIdOfDoctor,
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
    url: '/registration/add_registration',
    method: 'post',
    params: registration,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
