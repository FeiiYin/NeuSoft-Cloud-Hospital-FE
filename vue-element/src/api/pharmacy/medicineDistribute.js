import request from '@/utils/request'

/**
 * 按挂号单编号获取患者信息
 *
 * @param registrationId 挂号单编号
 * @return 患者信息
 */
export function selectPatient(query) {
  console.log('selectPatient: ')
  return request({
    url: '/medicine_distribute/patient_info',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 按挂号单编号获取药品列表
 *
 * @param registrationId 挂号单编号
 * @return 药品列表，json 字符串
 */
export function selectChargeFormList(query) {
  return request({
    url: '/medicine_distribute/list_medicine',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 发放药品
 *
 * @param chargeFormIdList 被发放药品的编号列表
 * @return 操作结果
 */
export function medicineDistribute(query) {
  return request({
    url: '/medicine_distribute/distribute',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 门诊退药
 * 退药数量不能超过可退数量，如果找出只按可退数量计算
 *
 * @param medicineReturnJson 退药信息，json 字符串
 * @return 操作结果
 * <p>
 * 退药信息 json 字符串是 json 数组，该数组中的每项元素包含如下属性：
 * - chargeFormId 收费项目的编号，int 型
 * - returnNums   退药数量，int 型
 */
export function medicineReturn(query) {
  return request({
    url: '/medicine_distribute/return',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
