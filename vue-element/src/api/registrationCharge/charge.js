import request from '@/utils/request'

/**
 * 收费（包括检查检验项目、处置项目、药品等收费项目）
 *
 * @param checkoutJson 收费信息，json 数组
 * @return 操作结果
 * checkoutJson 是一个 json 字符串，其属性包括：
 * - invoiceTitle 支付者
 * - collectorId 收银员编号
 * - invoiceAmount 找零后的实际入账金额
 * - selfPay 自费支付金额
 * - accountPay 账户支付金额
 * - reimbursementPay 报销支付金额
 * - discounted 优惠金额
 * - invoiceState 发票状态（有效 1）
 * - entryList 收费项目的列表，json 数组
 * <p>
 * 其中，entryList 数组中每个元素包含的属性：
 * - entryType: charge_entry: 0, prescription_entry: 1
 * - entryId    收费条目或处方条目的编号
 */
export function checkout(query) {
  console.log('checkout')
  console.log(query)
  return request({
    url: '/charge/checkout',
    method: 'get',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 退费（包括检查检验项目、处置项目、药品等收费项目）
 *
 * @param refundJson 退费信息，json 字符串
 * @return 操作结果
 * refundJson 字符串中的属性包括：
 * - entryType: charge_entry: 0, prescription_entry: 1
 * - entryId    收费条目或处方条目的编号
 * - refundNums 退费数量
 */
export function refund(query) {
  console.log('refund')
  console.log(query)
  return request({
    url: '/charge/refund',
    method: 'get',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 退号
 *
 * @param Integer registrationId
 * @return
 */
export function withdrawRegistration(query) {
  console.log('withdrawRegistration')
  console.log(query)
  return request({
    url: '/charge/withdraw_registration',
    method: 'get',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 按挂号单编号获取待支付处置项目
 *
 * @param registrationId 挂号单编号
 * @return 待支付处置项目，json 数组
 */
export function selectUnpaidDisposal(query) {
  console.log('selectUnpaidDisposal')
  console.log(query)
  return request({
    url: '/charge/unpaid_disposal',
    method: 'get',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 按挂号单编号获取待支付检查项目
 *
 * @param registrationId 挂号单编号
 * @return 待支付检查项目，json 数组
 */
export function selectUnpaidExam(query) {
  console.log('selectUnpaidExam')
  console.log(query)
  return request({
    url: '/charge/unpaid_exam',
    method: 'get',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 获取待支付处方
 * 不包含已退费的处方
 *
 * @param registrationId 挂号单编号
 * @return 待支付处方列表，json 字符串
 */
export function selectUnpaidPrescription(query) {
  console.log('selectUnpaidPrescription')
  console.log(query)
  return request({
    url: '/charge/unpaid_prescription',
    method: 'get',
    params: query,
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

