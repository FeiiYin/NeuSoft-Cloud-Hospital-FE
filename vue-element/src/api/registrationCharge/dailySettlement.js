import request from '@/utils/request'

/**
 * 获取所有日结信息列表
 *
 * @param currentPage 当前页码
 * @param pageSize    页面大小
 * @return 分页的日结信息
 */
export function selectAllDailySettlementList(query) {
  console.log('selectAllDailySettlementList')
  console.log(query)
  return request({
    url: '/daily_settlement/select_all_daily_settlement',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 获取指定起止时间和收费员的日结记录列表
 * 时间格式 yyyy-MM-dd HH:mm:ss
 *
 * @param startDatetime 统计的开始时间
 * @param endDatetime   统计的结束时间
 * @param collectorId   收费员编号
 * @param currentPage   当前页码
 * @param pageSize      页面大小
 * @return 日结记录列表
 */
export function selectDailySettlementList(query) {
  console.log('selectDailySettlementList')
  console.log(query)
  return request({
    url: '/daily_settlement/select_daily_settlement',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 生成收费员的日结记录
 * 时间格式 yyyy-MM-dd HH:mm:ss
 *
 * @param collectorId 收费员编号
 * @param endDatetime 日结的截止时间（选填，默认为当前时间）
 * @return 操作结果
 */
export function generateDailySettlement(query) {
  console.log('generateDailySettlement')
  console.log(query)
  return request({
    url: '/daily_settlement/generate',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 按日结记录获取日结明细
 *
 * @param dailySettlementId 日结记录编号
 * @param currentPage       当前页码
 * @param pageSize          页面大小
 * @return 分页的日结明细
 */
export function selectDailySettlementDetail(query) {
  console.log('selectDailySettlementDetail')
  console.log(query)
  return request({
    url: '/daily_settlement/select_daily_settlement_detail',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 获取日结单信息
 *
 * @param dailySettlementId 日结记录编号
 * @return 日结单信息，json 字符串
 */
export function dailySettlementDocument(query) {
  console.log('dailySettlementDocument')
  console.log(query)
  return request({
    url: '/daily_settlement/daily_settlement_document',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 门诊日结核对
 * 财务核对挂号收费员的报账
 *
 * @param dailySettlementId 日结记录编号
 * @return 操作结果
 */
export function checkDailySettlement(query) {
  console.log('checkDailySettlement')
  console.log(query)
  return request({
    url: '/daily_settlement/check',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

