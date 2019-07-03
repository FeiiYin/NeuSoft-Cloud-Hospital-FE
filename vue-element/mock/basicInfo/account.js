// import request from '@/utils/request'

const accountList = [
  {
    accountName: '科室1',
    accountId: '1',
    category: 'DIV'
  },
  {
    accountName: '科室2',
    accountId: '2',
    category: 'DIVA'
  }
]

export default [
  // user login
  {
    url: '/account/list',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: accountList
      }
    }
  },

  // get user info
  {
    url: '/account/update',
    type: 'get',
    response: config => {
      if (config.account_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      for (var i = 0; i < accountList.length; ++i) {
        if (accountList[i].accountId === config.accountId) {
          accountList[i] = config
        }
      }
      return {
        code: 20000,
        data: {
          accountList
        }
      }
    }
  },

  // add
  {
    url: '/account/add',
    type: 'post',
    response: config => {
      if (config.account_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      accountList.push(config)
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
    url: '/account/delete',
    type: 'post',
    response: config => {
      var tempList = []
      for (var i = 0; i < accountList.length; ++i) {
        if (accountList[i].accountId !== config.accountId) {
          tempList.push(accountList[i])
        }
      }
      if (accountList.length === tempList.length) {
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

