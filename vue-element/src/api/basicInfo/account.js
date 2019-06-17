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

// /**
//  * 添加用户信息
//  * @param newAccount 新增的用户信息
//  */
// export function addAccount(newAccount) {
//   console.log('addAccount: ')
//   console.log(newAccount)
//   return request(
//     {
//       url: '/department/add',
//       method: 'post',
//       params: newAccount,
//       baseURL: 'http://localhost:8081/cloud-hospital/',
//       contentType: 'application/x-wwww-form-urlencoded'
//     }
//   )
// }
