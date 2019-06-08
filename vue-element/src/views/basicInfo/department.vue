<template>
  <div style="padding:1%;" class="app-container">
    <aside>科室管理</aside>

    <el-row>
      <el-col :span="2">
        <div class="grid-content bg-purple">
          <el-checkbox v-model="clinical_department_checked">临床科室</el-checkbox>
          <el-checkbox v-model="technology_department_checked">医技科室</el-checkbox>
        </div>
      </el-col>

      <el-col :span="22">
        <div class="grid-content bg-purple-light">
          <el-table
            v-loading="listLoading"
            :data="departmentTableData"
            height="250"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="departmentCode"
              label="科室编码"
            />
            <el-table-column
              prop="departmentName"
              label="科室名称"
            />
            <el-table-column
              prop="category"
              label="科室分类"
            />
            <!--            <el-table-column-->
            <!--              prop="type"-->
            <!--              label="科室类别"-->
            <!--            />-->
          </el-table>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>

import { fetchConstantMap, fetchDepartmentList } from '../../api/basicInfo/department'

export default {
  data() {
    return {
      clinical_department_checked: true, // 临床科室多选框
      technology_department_checked: true, // 医技科室多选框
      departmentTableData: [], // 科室表格数据
      departmentConstant: [], // 科室数据常量
      listLoading: false
    }
  },

  created() {
    this.getDepartmentList()
  },

  methods: {
    getDepartmentList() {
      this.query = { 'constant_type_code': 'DeptCategory' }
      fetchConstantMap(this.query).then(response => {
        console.log('fetchConstantMap response: ')
        console.log(response)
        this.departmentConstant = response.data
        this.listLoading = true
        fetchDepartmentList().then(response => {
          console.log('fetchDepartmentList response: ')
          console.log(response)
          this.departmentTableData = response.data

          let i = 0
          const len = this.departmentTableData.length
          for (; i < len; i++) {
            this.departmentTableData[i].category = this.departmentConstant[this.departmentTableData[i].category]
          }
          this.listLoading = false // 列表加载完成
        }).catch(error => {
          console.log('fetchDepartmentList error: ')
          console.log(error)
        })
      }
      ).catch(error => {
        console.log('fetchConstantMap error: ')
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
</style>
