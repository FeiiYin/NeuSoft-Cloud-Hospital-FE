import request from '@/utils/request'

/**
 * 帐户登录验证
 *
 * @param userName     用户名
 * @param userPassword 密码
 * @return 操作结果
 */
export function signIn(query) {
  console.log('signIn query: ')
  console.log(query)
  return request({
    url: '/login/sign_in',
    method: 'post',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 获取权限
 *
 * @param userName 用户名
 * @param token    登录验证成功后获得的 token
 * @return 用户权限
 */
export function permission(query) {
  console.log('permission query: ')
  console.log(query)
  return request({
    url: '/login/permission',
    method: 'post',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
