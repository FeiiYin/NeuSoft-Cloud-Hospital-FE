<template>
  <div>
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @row-dblclick="toPatientDetail"
      :default-sort = "{prop: 'registrationId', order: 'descending'}"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="患者名称">
              <span>{{ props.row.patientName }}</span>
            </el-form-item>
            <el-form-item label="患者性别">
              <span>{{ props.row.gender }}</span>
            </el-form-item>
            <el-form-item label="患者住址">
              <span>{{ props.row.familyAddress }}</span>
            </el-form-item>
            <el-form-item label="身份证号">
              <span>{{ props.row.identityCardNo }}</span>
            </el-form-item>
            <el-form-item label="患者生日">
              <span>{{ props.row.birthday.substring(0, 10) }}</span>
            </el-form-item>
            <el-form-item label="挂号日期">
              <span>{{ props.row.registrationDate.substring(0, 10) }}</span>
            </el-form-item>
            <el-form-item label="挂号科室">
              <span>{{ props.row.reserve1 }}</span>
            </el-form-item>
            <el-form-item label="菜    单">
              <el-dropdown @command="handleMenuCommand" @visible-change="handleRow(props.row)">
                <span class="el-dropdown-link">
                  <el-tag type="text">
                    请选择<i class="el-icon-arrow-down el-icon--right" />
                  </el-tag>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a">病历诊断</el-dropdown-item>
                  <el-dropdown-item command="b">检查申请</el-dropdown-item>
                  <el-dropdown-item command="c">确诊</el-dropdown-item>
                  <el-dropdown-item command="d">处方申请</el-dropdown-item>
                  <el-dropdown-item command="e">处置申请</el-dropdown-item>
                  <el-dropdown-item command="f" divided>诊断完毕</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        v-loading="loading"
        align="center"
        label="ID"
        width="65"
        sortable
        prop="registrationId"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.registrationId }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.patientName }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="身份证号">
        <template slot-scope="scope">
          <span>{{ scope.row.identityCardNo }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.gender }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" label="挂号科室">
        <template slot-scope="scope">
          <span>{{ scope.row.reserve1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="挂号医生" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.reserve2 }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.registrationCategoryId === 1 ? 'primary' : (row.registrationCategoryId === 2 ? 'danger' : 'success')">
            {{ row.registrationCategoryId === 1 ? '普通号' : (row.registrationCategoryId === 2 ? '急诊号' : (row.registrationCategoryId === 3 ? '专家号' : '其他')) }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  <!-- <div style="background: #d3dce6;">
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[20, 50, 100, 200]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNumber"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div> -->
  </div>
</template>

<script>
import {
  waitingRegistrationList,
  visitedRegistrationList
} from '../../../api/medicalRecord/medicalRecord'

import {
  selectAllRegistrationCategory
} from '../../../api/basicInfo/registration_category'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    type: {
      type: String,
      default: '1'
    },
    refreshListener: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: null,
      listQuery: {
        page: 1,
        type: this.type
      },
      loading: false,
      doctorId: 1,

      // 分页
      currentPage: 1, // 当前页码
      pageSize: 50, // 页码大小
      totalNumber: 0,

      tapRefreshListener: this.refreshListener,
      currentRow: null,

      registrationCategoryList: []
    }
  },
  watch: {
    // 这个方法并不行，只是测试一下
    tapRefreshListener(val) {
      if (val) {
        this.tapRefreshListener = false
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    invokeSelectAllRegistrationCategory() {
      selectAllRegistrationCategory().then(response => {
        console.log('selectAllRegistrationCategory response')
        console.log(response)
        this.registrationCategoryList = response.data
      })
    },
    toPatientDetail(row) {
      this.$router.push({
        path: '/medicalRecord/patientDetail', // 这个path是在router/index.js里边配置的路径
        query: {
          registrationId: row.registrationId,
          disease: ''
        }
      })
    },
    handleRow(row) {
      console.log(row)
      this.currentRow = row
    },
    // 下拉菜单
    handleMenuCommand(command) {
      // this.$message('click on item ' + command)
      console.log(this.currentRow)
      if (command === 'a') {
        // 病历
        this.$router.push({
          path: '/medicalRecord/medicalRecord', // 这个path是在router/index.js里边配置的路径
          query: {
            registrationId: this.currentRow.registrationId
          }
        })
      } else if (command === 'b') {
        // 检查
        this.$router.push({
          path: '/medicalRecord/examination', // 这个path是在router/index.js里边配置的路径
          query: {
            registrationId: this.currentRow.registrationId,
            disease: ''
          }
        })
      } else if (command === 'c') {
        // 确诊
        this.$router.push({
          path: '/medicalRecord/confirmMedicalRecord', // 这个path是在router/index.js里边配置的路径
          query: {
            registrationId: this.currentRow.registrationId,
            disease: ''
          }
        })
      } else if (command === 'd') {
        // 处方
        this.$router.push({
          path: '/medicalRecord/medicinePrescription', // 这个path是在router/index.js里边配置的路径
          query: {
            registrationId: this.currentRow.registrationId,
            disease: ''
          }
        })
      } else if (command === 'e') {
        // 处置
        this.$router.push({
          path: '/medicalRecord/disposalApplication', // 这个path是在router/index.js里边配置的路径
          query: {
            registrationId: this.currentRow.registrationId,
            disease: ''
          }
        })
      } else if (command === 'f') {
        // 诊断完毕
        this.$router.push({
          path: '/medicalRecord/patientDetail', // 这个path是在router/index.js里边配置的路径
          query: {
            registrationId: this.currentRow.registrationId,
            disease: ''
          }
        })
      }
    },
    getList() {
      this.loading = true
      console.log('refreshListener: ' + this.refreshListener)
      console.log('tapRefreshListener: ' + this.tapRefreshListener)
      // console.log(this.type)
      // console.log(this.listQuery)
      var query = {
        'registrationScope': this.type, // 患者搜索范围：所有患者 0，本医生患者 1，本科室患者 2
        'doctorId': this.doctorId
      }
      if (this.type === '3') {
        visitedRegistrationList(query).then(response => {
          console.log(response)
          this.list = response.data
          this.loading = false
        }).catch(error => {
          console.log('visitedRegistrationList error: ')
          console.log(error)
        })
        return
      }
      waitingRegistrationList(query).then(response => {
        console.log(response)
        this.list = response.data
        this.loading = false
      }).catch(error => {
        console.log('waitingRegistrationList error: ')
        console.log(error)
      })
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.queryRegistrationListWithPage()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.queryRegistrationListWithPage()
    }
  }
}
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
