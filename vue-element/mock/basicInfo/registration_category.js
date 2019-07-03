// import request from '@/utils/request'

const registrationCategoryList = [
  {
    registrationCategoryName: '科室1',
    registrationCategoryId: '1',
    category: 'DIV'
  },
  {
    registrationCategoryName: '科室2',
    registrationCategoryId: '2',
    category: 'DIVA'
  }
]

export default [
  // user login
  {
    url: '/registrationCategory/list',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: registrationCategoryList
      }
    }
  },

  // get user info
  {
    url: '/registrationCategory/update',
    type: 'get',
    response: config => {
      if (config.registrationCategory_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      for (var i = 0; i < registrationCategoryList.length; ++i) {
        if (registrationCategoryList[i].registrationCategoryId === config.registrationCategoryId) {
          registrationCategoryList[i] = config
        }
      }
      return {
        code: 20000,
        data: {
          registrationCategoryList
        }
      }
    }
  },

  // add
  {
    url: '/registrationCategory/add',
    type: 'post',
    response: config => {
      if (config.registrationCategory_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      registrationCategoryList.push(config)
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
    url: '/registrationCategory/delete',
    type: 'post',
    response: config => {
      var tempList = []
      for (var i = 0; i < registrationCategoryList.length; ++i) {
        if (registrationCategoryList[i].registrationCategoryId !== config.registrationCategoryId) {
          tempList.push(registrationCategoryList[i])
        }
      }
      if (registrationCategoryList.length === tempList.length) {
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

