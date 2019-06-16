import request from '@/utils/request'

/**
 * 获取科室列表
 * @param query 当前页码，页面大小，选择的科室类别等
 * @returns 分页的科室列表
 */
export function fetchDepartmentList(query) {
  console.log('fetchDepartmentList: ')
  console.log(query)
  return request({
    url: '/department/list',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/cloud-hospital/',
    contentType: 'application/x-wwww-form-urlencoded'
  })
}

/**
 * 添加科室信息
 * @param newDepartment 新增的科室信息
 */
export function addDepartment(newDepartment) {
  console.log('addDepartment: ')
  console.log(newDepartment)
  return request(
    {
      url: '/department/add',
      method: 'post',
      params: newDepartment,
      baseURL: 'http://localhost:8081/cloud-hospital/',
      contentType: 'application/x-wwww-form-urlencoded'
    }
  )
}

/**
 * 修改科室信息
 * @param query 修改后的科室信息，将根据主键找到原信息进行修改
 */
export function updateDepartmentByPrimaryKey(query) {
  console.log('updateDepartmentByPrimaryKey: ')
  console.log(query)
  return request(
    {
      url: '/department/update',
      method: 'put',
      params: query,
      baseURL: 'http://localhost:8081/cloud-hospital/',
      contentType: 'application/x-wwww-form-urlencoded'
    }
  )
}

/**
 * 删除科室信息
 * @param departmentIdList 删除科室信息的主键列表
 */
export function deleteDepartmentByPrimaryKey(departmentIdList) {
  console.log('deleteDepartmentByPrimaryKey: ')
  console.log(departmentIdList)
  return request(
    {
      url: '/department/delete',
      method: 'delete',
      params: departmentIdList,
      baseURL: 'http://localhost:8081/cloud-hospital/',
      contentType: 'application/json'
    }
  )
}
