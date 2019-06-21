<template>
  <div style="padding:1%;" class="app-container">
    <aside>医生排班规则维护</aside>

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      highlight-current-row
      :data="diseaseTable"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >

      <el-table-column type="selection" width="55" />

      <el-table-column prop="diseaseCode" label="疾病编码" width="120">
        <template slot-scope="scope">{{ scope.row.diseaseCode }}</template>
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
      v-loading="listLoading"
      highlight-current-row
      :data="diseaseTable"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >

      <el-table-column type="selection" width="55" />

      <el-table-column prop="diseaseCode" label="疾病编码" width="120">
        <template slot-scope="scope">{{ scope.row.diseaseCode }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import { fetchList } from '@/api/basicInfo/schedule.js'

export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },

  created() {
    this.getList()
  },

  methods: {
    // getList() { // 获取列表
    //   this.listLoading = true // 列表正在加载
    //   fetchList(this.listQuery).then(response => {
    //     // todo
    //     this.listLoading = false // 列表加载完成
    //   })
    // }
  }
}
</script>

<style scoped>
</style>
