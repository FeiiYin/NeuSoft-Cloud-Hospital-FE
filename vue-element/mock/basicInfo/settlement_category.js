// import request from '@/utils/request'

const settlementCategoryList = [
  {
    settlementCategoryName: '科室1',
    settlementCategoryId: '1',
    category: 'DIV'
  },
  {
    settlementCategoryName: '科室2',
    settlementCategoryId: '2',
    category: 'DIVA'
  }
]

export default [
  // user login
  {
    url: '/settlementCategory/list',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: settlementCategoryList
      }
    }
  },

  // get user info
  {
    url: '/settlementCategory/update',
    type: 'get',
    response: config => {
      if (config.settlementCategory_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      for (var i = 0; i < settlementCategoryList.length; ++i) {
        if (settlementCategoryList[i].settlementCategoryId === config.settlementCategoryId) {
          settlementCategoryList[i] = config
        }
      }
      return {
        code: 20000,
        data: {
          settlementCategoryList
        }
      }
    }
  },

  // add
  {
    url: '/settlementCategory/add',
    type: 'post',
    response: config => {
      if (config.settlementCategory_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      settlementCategoryList.push(config)
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
    url: '/settlementCategory/delete',
    type: 'post',
    response: config => {
      var tempList = []
      for (var i = 0; i < settlementCategoryList.length; ++i) {
        if (settlementCategoryList[i].settlementCategoryId !== config.settlementCategoryId) {
          tempList.push(settlementCategoryList[i])
        }
      }
      if (settlementCategoryList.length === tempList.length) {
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

