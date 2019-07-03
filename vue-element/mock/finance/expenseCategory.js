// import request from '@/utils/request'

const expenseCategoryList = [
  {
    expenseCategoryName: '科室1',
    expenseCategoryId: '1',
    category: 'DIV'
  },
  {
    expenseCategoryName: '科室2',
    expenseCategoryId: '2',
    category: 'DIVA'
  }
]

export default [
  // user login
  {
    url: '/expenseCategory/list',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: expenseCategoryList
      }
    }
  },

  // get user info
  {
    url: '/expenseCategory/update',
    type: 'get',
    response: config => {
      if (config.expenseCategory_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      for (var i = 0; i < expenseCategoryList.length; ++i) {
        if (expenseCategoryList[i].expenseCategoryId === config.expenseCategoryId) {
          expenseCategoryList[i] = config
        }
      }
      return {
        code: 20000,
        data: {
          expenseCategoryList
        }
      }
    }
  },

  // add
  {
    url: '/expenseCategory/add',
    type: 'post',
    response: config => {
      if (config.expenseCategory_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      expenseCategoryList.push(config)
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
    url: '/expenseCategory/delete',
    type: 'post',
    response: config => {
      var tempList = []
      for (var i = 0; i < expenseCategoryList.length; ++i) {
        if (expenseCategoryList[i].expenseCategoryId !== config.expenseCategoryId) {
          tempList.push(expenseCategoryList[i])
        }
      }
      if (expenseCategoryList.length === tempList.length) {
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

