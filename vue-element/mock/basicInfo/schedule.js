// import request from '@/utils/request'

const scheduleList = [
  {
    scheduleName: '科室1',
    scheduleId: '1',
    category: 'DIV'
  },
  {
    scheduleName: '科室2',
    scheduleId: '2',
    category: 'DIVA'
  }
]

export default [
  // user login
  {
    url: '/schedule/list',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: scheduleList
      }
    }
  },

  // get user info
  {
    url: '/schedule/update',
    type: 'get',
    response: config => {
      if (config.schedule_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      for (var i = 0; i < scheduleList.length; ++i) {
        if (scheduleList[i].scheduleId === config.scheduleId) {
          scheduleList[i] = config
        }
      }
      return {
        code: 20000,
        data: {
          scheduleList
        }
      }
    }
  },

  // add
  {
    url: '/schedule/add',
    type: 'post',
    response: config => {
      if (config.schedule_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      scheduleList.push(config)
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
    url: '/schedule/delete',
    type: 'post',
    response: config => {
      var tempList = []
      for (var i = 0; i < scheduleList.length; ++i) {
        if (scheduleList[i].scheduleId !== config.scheduleId) {
          tempList.push(scheduleList[i])
        }
      }
      if (scheduleList.length === tempList.length) {
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

