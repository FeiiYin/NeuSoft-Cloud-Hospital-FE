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
/**
 * 增加用户信息
 * @param query 增加用户信息
 */
export function addAccount(newAccount) {
  console.log('addAccount: ')
  console.log(newAccount)
  return request(
    {
      url: '/account/add_account',
      method: 'post',
      params: newAccount,
      baseURL: 'http://localhost:8081/cloud-hospital/',
      contentType: 'application/x-wwww-form-urlencoded'
    }
  )
}

/**
 * 修改用户信息
 * @param query 修改后的用户信息，将根据主键找到原信息进行修改
 */
export function updateAccount(query) {
  console.log('updateAccount:')
  console.log(query)
  return request(
    {
      url: '/account/update_account',
      method: 'put',
      params: query,
      baseURL: 'http://localhost:8081/cloud-hospital/',
      contentType: 'application/x-wwww-form-urlencoded'
    }
  )
}

