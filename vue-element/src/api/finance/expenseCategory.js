import request from '@/utils/request'

/**
 * 获取分页的费用科目列表
 *
 * @param currentPage 当前页码
 * @param pageSize    页面大小
 * @return 分页的费用科目列表
 */
export function selectExpenseCategory(query) {
  console.log('selectExpenseCategory query: ')
  console.log(query)
  return request({
    url: '/expense_category/select',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 保存费用科目
 *
 * @param expenseCategoryJson 费用科目信息，json 字符串
 * @return 操作结果
 * expenseCategoryJson 中的属性包括：
 * - expenseCategoryId 费用科目编号（新增时不填，更新时必填）
 * - expenseCode 费用代码
 * - expenseName 费用名称
 */
export function saveExpenseCategory(query) {
  console.log('saveExpenseCategory query: ')
  console.log(query)
  return request({
    url: '/expense_category/save',
    method: 'post',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 删除费用科目信息
 *
 * @param expenseCategoryIdList 费用科目编号列表
 * @return 操作结果
 */
export function deleteExpenseCategory(query) {
  console.log('deleteExpenseCategory query: ')
  console.log(query)
  return request({
    url: '/expense_category/delete',
    method: 'delete',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
