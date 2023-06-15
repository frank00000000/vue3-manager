import { createStore } from 'vuex'
import { getInfo, login } from '@/api/manager'
import { setToken, removeToken } from '@/utils/token'

const store = createStore({
  state() {
    return {
      // 用户信息
      user: {},
      //侧边宽度
      asideWidth: '250px',
      //菜单
      menus: [],
      //权限菜单
      ruleNames: [],
    }
  },

  actions: {
    /**
     * @description: 用户登录
     * @param {*} commit
     * @param {*} userfrom
     * @return {*}
     */
    async login({ commit }, userfrom) {
      try {
        const result = await login(userfrom)
        // 获取用户token
        const token = result.token
        // 存入token
        setToken(token)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    /**
     * @description:获取用户信息
     * @param {*} commit
     * @return {*}
     */
    async getinfo({ commit }) {
      try {
        const data = await getInfo()
        commit('SET_USERINFO', data)
        commit('SET_MENUS', data.menus)
        commit('SET_RULENAMES', data.ruleNames)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    /**
     * @description: 退出登录
     * @param {*} commit
     * @return {*}
     */
    logout({ commit }) {
      // 移除token
      removeToken()
      // 清除当前状态
      commit('SET_USERINFO', {})
    },
  },
  mutations: {
    /**
     * @description: 修改 user
     * @param {*} state
     * @param {*} user
     * @return {*}
     */
    SET_USERINFO(state, user) {
      state.user = user
    },

    /**
     * @description: 展开/缩起 侧边栏
     * @param {*} state
     * @return {*}
     */
    handleAsideWidth(state) {
      state.asideWidth = state.asideWidth == '250px' ? '64px' : '250px'
    },
    /**
     * @description: 修改菜单
     * @param {*} state
     * @param {*} menus
     * @return {*}
     */
    SET_MENUS(state, menus) {
      state.menus = menus
    },

    /**
     * @description: 修改权限菜单
     * @param {*} state
     * @param {*} ruleNames
     * @return {*}
     */
    SET_RULENAMES(state, ruleNames) {
      state.ruleNames = ruleNames
    },
  },
  getters: {},
})

export default store
