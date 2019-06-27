import request from '@/utils/request'

/**
 * 临床医生个人工作量统计
 * 日期格式 yyyy-MM-dd HH:mm:ss
 *
 * @param startDatetime 开始时间
 * @param endDatetime   结束时间
 * @param doctorId      医生编号
 * @return 临床医生个人工作量数据
 */
export function doctorWorkloadFinancialStatistics(query) {
  console.log('doctorWorkloadFinancialStatistics query: ')
  console.log(query)
  return request({
    url: '/workload_statistics/outpatient_doctor',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 医技医生个人工作量统计
 * 日期格式 yyyy-MM-dd HH:mm:ss
 *
 * @param startDatetime 开始时间
 * @param endDatetime   结束时间
 * @param doctorId      医生编号
 * @return 医技医生个人工作量数据
 */
export function techDoctorWorkloadStatistics(query) {
  console.log('techDoctorWorkloadStatistics query: ')
  console.log(query)
  return request({
    url: '/workload_statistics/tech_doctor',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 门诊科室工作量统计
 * 日期格式 yyyy-MM-dd HH:mm:ss
 *
 * @param startDatetime 开始时间
 * @param endDatetime   结束时间
 * @return 各科室工作量统计数据
 */
export function departmentWorkloadFinancialStatistics(query) {
  console.log('departmentWorkloadFinancialStatistics query: ')
  console.log(query)
  return request({
    url: '/workload_statistics/department',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 门诊医生工作量统计
 *
 * @param startDatetime 开始时间
 * @param endDatetime   结束时间
 * @return 各医生工作量统计数据
 */
export function doctorWorkloadFinancialStatistics_menzhen(query) {
  console.log('doctorWorkloadFinancialStatistics_menzhen query: ')
  console.log(query)
  return request({
    url: '/workload_statistics/doctor',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}
