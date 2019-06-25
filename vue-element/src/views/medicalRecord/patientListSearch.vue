<template>
  <div class="app-container">
    <aside>
      <span>患者信息列表</span>
      <el-button type="info" style="float:right" @click="refreshTabTable()">
        <i class="el-icon-refresh" />
        刷新
      </el-button>
    </aside>

    <div class="tab-container">
      <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
        <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
          <keep-alive>
            <tabPane v-if="activeName==item.key" ref="tabPane" :type="item.key" />
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import tabPane from './components/TabPane'

export default {
  components: { tabPane },
  data() {
    return {
      tabMapOptions: [
        { label: '全部患者', key: '0' },
        { label: '个人患者', key: '1' },
        { label: '科室患者', key: '2' },
        { label: '个人已诊患者', key: '3' }
      ],
      activeName: '1',
      refreshListener: false
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    // init the default  selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    refreshTabTable() {
      console.log(this.$refs.tabPane)
      this.$refs.tabPane[0].getList()
      // this.refreshListener = true
      // this.$router.push(`${this.$route.path}?tab=${this.activeName}&refreshListener=true`)
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
