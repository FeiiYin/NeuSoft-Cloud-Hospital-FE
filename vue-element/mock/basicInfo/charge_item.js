// import request from '@/utils/request'

const chargeItemList = [
  {
    chargeItemName: '科室1',
    chargeItemId: '1',
    category: 'DIV'
  },
  {
    chargeItemName: '科室2',
    chargeItemId: '2',
    category: 'DIVA'
  }
]

export default [
  // user login
  {
    url: '/chargeItem/list',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: chargeItemList
      }
    }
  },

  // get user info
  {
    url: '/chargeItem/update',
    type: 'get',
    response: config => {
      if (config.chargeItem_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      for (var i = 0; i < chargeItemList.length; ++i) {
        if (chargeItemList[i].chargeItemId === config.chargeItemId) {
          chargeItemList[i] = config
        }
      }
      return {
        code: 20000,
        data: {
          chargeItemList
        }
      }
    }
  },

  // add
  {
    url: '/chargeItem/add',
    type: 'post',
    response: config => {
      if (config.chargeItem_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      chargeItemList.push(config)
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
    url: '/chargeItem/delete',
    type: 'post',
    response: config => {
      var tempList = []
      for (var i = 0; i < chargeItemList.length; ++i) {
        if (chargeItemList[i].chargeItemId !== config.chargeItemId) {
          tempList.push(chargeItemList[i])
        }
      }
      if (chargeItemList.length === tempList.length) {
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

