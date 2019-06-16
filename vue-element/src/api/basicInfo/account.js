import request from '@/utils/request'

export function selectAccountList(query) {
  console.log('selectAccountList: ')
  console.log(query)
  return request({
    url: '/select_account',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

export function selectDoctorList(query) {
  console.log('selectDoctorList: ')
  console.log(query)
  return request({
    url: '/select_doctor',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
