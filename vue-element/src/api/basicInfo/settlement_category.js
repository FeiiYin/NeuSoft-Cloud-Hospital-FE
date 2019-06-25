import request from '@/utils/request'

/**
  * @Description:  结算类别管理
  * @Param: query 查询
  * @Return: request
  * Author: Shuhao Xu
  * Date:
  * Time:
  */

export function fecthSettlementCategory(query) {
  console.log('js 得到结算类别query', query)
  return request({
    url: '/settlement_category/list',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 增加结算类别
 */

export function addSettlementCategory(addSettlementCategoryInfo) {
  console.log('js 打印的增加', addSettlementCategoryInfo)
  return request(
    {
      url: '/settlement_category/save',
      method: 'post',
      params: addSettlementCategoryInfo,
      baseURL: 'http://localhost:8081/cloud-hospital/',
      contentType: 'application/x-wwww-form-urlencoded'
    }
  )
}

/**
 * @Description: 更新结算类别信息
 * @Param:
 * @Return:
 * Author: Shuhao Xu
 * Date:
 * Time:
 */
export function updateSettlementCategory(updateSettlementCategoryInfo) {
  console.log('js update settlementCategory', updateSettlementCategoryInfo)
  return request({
    url: '/settlement_category/save',
    method: 'post',
    params: updateSettlementCategoryInfo,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-www-form-urlencoded'
  })
}

/**
 * @Description: 删除
 * @Param:
 * @Return:
 * Author: Shuhao Xu
 * Date:
 * Time:
 */
export function deleteSettlementCategoryByPrimaryKey(settlementCategoryInfo) {
  console.log('js delete settlementCategory', settlementCategoryInfo)
  return request({
    url: '/settlement_category/delete',
    method: 'delete',
    params: settlementCategoryInfo,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-www-form-urlencoded'
  })
}
