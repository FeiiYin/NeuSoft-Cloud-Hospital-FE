import request from '@/utils/request'

/**
  * @Description: 分页获取指定科室的收费项目信息
  * @Param:
  * @Return:
  * Author: Shuhao Xu
  * Date:
  * Time:
  */

export function selectChargeItem(query) {
  return request({
    url: '/charge_item/select',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
  * @Description: 保存收费项目信息-新增或更新
  * @Param:
  * @Return:
  * Author: Shuhao Xu
  * Date:
  * Time:
  */
export function saveChargeItem(param) {
  console.log('hou tai canshu ', param)
  return request({
    url: '/charge_item/save',
    method: 'post',
    params: param,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
  * @Description:  删除收费项目信息
  * @Param:
  * @Return:
  * Author: Shuhao Xu
  * Date:
  * Time:
  */
export function deleteChargeItem(param) {
  return request({
    url: '/charge_item/delete',
    method: 'delete',
    params: param,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
