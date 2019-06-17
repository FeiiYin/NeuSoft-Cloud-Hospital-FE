import request from '@/utils/request'
/**
 * 分页、分类查找帐号信息
 *
 * @param currentPage  当前页码
 * @param pageSize     页面大小
 * @param accountScope 查找的帐号范围，字符串数组
 *                     门诊医生 00
 *                     医技医生 01
 *                     医院收费员 10
 *                     药房操作员 11
 *                     财务管理员 12
 *                     挂号管理员 13
 * @return 指定范围的帐号信息
 */
export function selectAccountList(query) {
  console.log('selectAccountList: ')
  console.log(query)
  return request({
    url: '/account/select_account',
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
