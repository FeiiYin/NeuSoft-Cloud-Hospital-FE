// origin cannot use agian
import { logout } from '@/api/user'
// now should use
import {
  signIn,
  permission
} from '../../api/personal/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import Cookies from 'js-cookie'

// 用户的保存信息
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  // ["basic","registration","doctor","tech","pharmacy","financial"]
  accountId: '',
  accountType: '',
  doctorId: 0
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ACCOUNTID: (state, accountId) => {
    state.accountId = accountId
  },
  SET_ACCOUNTTYPE: (state, accountType) => {
    state.accountType = accountType
  },
  SET_DOCTORID: (state, doctorId) => {
    state.doctorId = doctorId
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    console.log(commit)
    console.log('userInfo')
    console.log(userInfo)
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      var query = {
        'userName': username.trim(),
        'userPassword': password
      }
      signIn(query).then(response => {
        // const { data } = response
        const { data } = {
          code: 20000,
          data: {
            token: response.data
          }
        }
        console.log(response)
        commit('SET_TOKEN', data.token)
        // commit('SET_USERNAME', username.trim())
        Cookies.set('username', username.trim())
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
      // login({ username: username.trim(), password:  }).then(response => {
      //   console.log(response)
      //   const { data } = response
      //   commit('SET_TOKEN', data.token)
      //   setToken(data.token)
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      var query = {
        'userName': Cookies.get('username'),
        'token': state.token
      }
      permission(query).then(response => {
      // getInfo(state.token).then(response => {
        console.log('permission response: ')
        // console.log(response)
        // alert('???')
        response = JSON.parse(response.data)
        console.log(response)
        var data = {
          'roles': response.permissionNameList,
          'name': response.userName,
          'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
          'introduction': response.accountDetail.accountTypeName,
          'accountId': response.accountId
        }
        console.log(data)
        if (!data) {
          reject('验证失败，请重新登录.')
        }
        const { roles, name, avatar, introduction, accountId } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        commit('SET_ACCOUNTID', accountId)
        commit('SET_ACCOUNTTYPE', response.accountDetail.accountType)
        commit('SET_DOCTORID', response.accountDetail.doctorId)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()
      resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
