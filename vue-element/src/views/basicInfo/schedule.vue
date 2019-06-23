<template>
  <div style="padding:1%;" class="app-container">
    <aside>医生排班规则维护</aside>
<!-- todo 做排班表-->
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      highlight-current-row
      :data="schedulingTable"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >

      <el-table-column type="selection" width="55" />

      <el-table-column prop="schedulingCode" label="排班编码" width="120">
        <template slot-scope="scope">{{ scope.row.schedulingCode }}</template>
      </el-table-column>
    </el-table>
    <aside>
      医生排班信息
    </aside>

    <div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="活动时间">
          <el-col :span="11">
            <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 80%;" />
          </el-col>
          <el-col class="line" :span="2"><b>结束时间</b></el-col>
          <el-col :span="11">
            <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 80%;" />
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      ref="multipleTable"
      v-loading="listLoading2"
      highlight-current-row
      :data="schedulingTable"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >

      <el-table-column type="selection" width="55" />

      <el-table-column prop="schedulingCode" label="疾病编码" width="120">
        <template slot-scope="scope">{{ scope.row.schedulingCode }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchList, saveSchedulingRule, deleteSchedulingRule, generateSchedulingInfo, selectSchedulingInfo, saveSchedulingInfo, deleteSchedulingInfo} from '../../api/basicInfo/schedule.js'

export default {
  data() {
    return {
      listLoading: false, // 加载表格
      listLoading2: false, // 医生排班信息表
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      schedulingTable: {},
      currentPage: 1,
      pageSize: 20,
      // js 方法的组成  的参数
      listQuery: {
        currentPage: -1,
        pageSize: -1
      },
      saveSchedulingRuleParam: {
        schedulingRuleId: -1, // 排班计划编号；新增时不填，修改时必填
        weekday: -1, // 排班星期：星期日 0，星期六 6
        departmentId: -1, // 排班医生所在科室的编号
        doctorId: -1, // 排班医生的编号
        registrationCategoryId: -1, // 挂号类别，详见 registration_category 表
        noon: -1, // 午别：全天 0；上午 1；下午 2
        limitation: -1, // 排班限额
        accountId: -1 // 操作员的帐号
      },
      deleteSchedulingRuleParam: {
        schedulingRuleIdList: []
      },
      generateSchedulingInfoParam: {
        startDate: '1999-12-31',
        endDate: '2000-01-01'
      },
      selectSchedulingInfoParam: {
        currentPage: -1,
        pageSize: -1
      },
      saveSchedulingInfoParam: {
        schedulingInfoId: -1,
        schedulingTime: '',
        departmentId: -1,
        doctorId: -1,
        registrationCategoryId: -1,
        valid: -1,
        noon: -1,
        limitation: -1,
        remainNums: -1
      },
      deleteSchedulingInfoParam: {
        schedulingInfoIdList: []
      },
      rules: {

      }
    }
  },

  created() {
    this.getList()
  },

  methods: {
    // 更新表格的 变量 匹配 方法
    // 删除表格的 选择框方法
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('handle de 值是', val)
    },
    // 和 js 相匹配的方法
    getList() { // 获取列表
      this.listLoading = true // 列表正在加载
      this.listQuery.currentPage = this.currentPage
      this.listQuery.pageSize = this.pageSize
      console.log('查询传过去的参数', this.listQuery)
      fetchList(this.listQuery).then(response => {
        this.schedulingTable = response.data.list
        console.log('查询成功后的response', response)
        this.listLoading = false // 列表加载完成
      }).catch(error => {
        console.log('在返回之后出现的问题', error)
      })
    },
    saveSchedulingRuleV() {

    },
    deleteSchedulingRuleV() {

    },
    generateSchedulingInfoV() {

    },
    selectSchedulingInfoV() {

    },
    saveSchedulingInfoV() {

    },
    deleteSchedulingInfoV() {

    }
  }
}
</script>

<style scoped>
</style>
