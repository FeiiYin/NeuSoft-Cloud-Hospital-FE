import request from '@/utils/request'
/**
  * @Description: 获取排班规则
  * @Param:
  * @Return:
  * Author: Shuhao Xu
  * Date:
  * Time:
  */
export function fetchList(query) {
  return request({
    url: '/scheduling/select_rule',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
  * @Description: 保留排班规则: 新增及修改
  * @Param:
  * @Return:
  * Author: Shuhao Xu
  * Date:
  * Time:
  */
export function saveSchedulingRule(param) {
  return request({
    url: '/scheduling/save_rule',
    method: 'get',
    params: param,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
  * @Description: 删除排班规则
  * @Param:
  * @Return:
  * Author: Shuhao Xu
  * Date:
  * Time:
  */
export function deleteSchedulingRule(param) {
  return request({
    url: '/scheduling/delete_rule',
    method: 'delete',
    params: param,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
  * @Description: 生成排班计划
  * @Param:
  * @Return:
  * Author: Shuhao Xu
  * Date:
  * Time:
  */
export function generateSchedulingInfo(param) {
  return request({
    url: '/scheduling/generate_info',
    method: 'get',
    params: param,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
  * @Description: 获取排班信息
  * @Param:
  * @Return:
  * Author: Shuhao Xu
  * Date:
  * Time:
  */
export function selectSchedulingInfo(param) {
  return request({
    url: '/scheduling/select_info',
    method: 'get',
    params: param,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
  * @Description: 保留排班信息，update
  * @Param:
  * @Return:
  * Author: Shuhao Xu
  * Date:
  * Time:
  */
export function saveSchedulingInfo(param) {
  return request({
    url: '/scheduling/update_info',
    method: 'put',
    params: param,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
  * @Description: 删除排班信息
  * @Param:
  * @Return:
  * Author: Shuhao Xu
  * Date:
  * Time:
  */
export function deleteSchedulingInfo(param) {
  return request({
    url: '/scheduling/delete_info',
    method: 'delete',
    params: param,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
