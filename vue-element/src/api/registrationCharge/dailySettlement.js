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

