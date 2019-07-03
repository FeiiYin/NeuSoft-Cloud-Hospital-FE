// import request from '@/utils/request'

const departmentList = [
  {
    departmentName: '科室1',
    departmentId: '1',
    category: 'DIV'
  },
  {
    departmentName: '科室2',
    departmentId: '2',
    category: 'DIVA'
  }
]

export default [
  // user login
  {
    url: '/department/list',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: departmentList
      }
    }
  },

  // get user info
  {
    url: '/department/update',
    type: 'get',
    response: config => {
      if (config.department_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      for (var i = 0; i < departmentList.length; ++i) {
        if (departmentList[i].departmentId === config.departmentId) {
          departmentList[i] = config
        }
      }
      return {
        code: 20000,
        data: {
          departmentList
        }
      }
    }
  },

  // add
  {
    url: '/department/add',
    type: 'post',
    response: config => {
      if (config.department_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      departmentList.push(config)
      return {
        code: 20000,
        data: {
          'bool': true
        }
      }
    }
  },

  // delete
  {
    url: '/department/delete',
    type: 'post',
    response: config => {
      var tempList = []
      for (var i = 0; i < departmentList.length; ++i) {
        if (departmentList[i].departmentId !== config.departmentId) {
          tempList.push(departmentList[i])
        }
      }
      if (departmentList.length === tempList.length) {
        return {
          code: 50008,
          data: {
            'bool': false
          }
        }
      } else {
        return {
          code: 20000,
          data: {
            'bool': true
          }
        }
      }
    }
  }
]

