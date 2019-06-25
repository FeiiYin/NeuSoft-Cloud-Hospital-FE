import request from '@/utils/request'

/**
* 保存药品信息
*
* @param medicineJson 药品信息 json 字符串
* @return 操作结果
  * medicineJson 字符串中包含的属性：
* - medicineId            药品编号（新增时不填，更新时必填）
* - medicineCode          药品代码
* - nameZh                中文名称
* - medicineSpecification 规格
* - medicineUnit          包装单位
* - medicineManufacturer  制造商
* - medicineDosageId      剂型编号
* - medicineTypeId        类型编号
* - medicinePrice         单价
* - namePinyin            药品名称拼音
* - nums                  库存数目
* - nameEn                英文名称
*/
export function saveMedicine(query) {
  console.log('saveMedicine query: ')
  console.log(query)
  return request({
    url: '/medicine_catalog/save',
    method: 'post',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 删除药品信息
 *
 * @param medicineIdList 药品编号列表
 * @return 操作结果
 */
export function deleteMedicine(query) {
  console.log('deleteMedicine query: ')
  console.log(query)
  return request({
    url: '/medicine_catalog/delete',
    method: 'delete',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
