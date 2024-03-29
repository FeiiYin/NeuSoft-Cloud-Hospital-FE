<template>
  <div class="app-container">
    <aside>
      <span>当前挂号信息列表</span>
      <el-button type="info" style="float:right" @click="queryRegistrationListWithPage()">
        <i class="el-icon-refresh" />
        刷新
      </el-button>
    </aside>
    <div>
      <el-table
        v-loading="registrationListLoading"
        :data="registrationList"
        style="width: 100%"
        :default-sort="{prop: 'registrationDate', order: 'descending'}"
      >
        <el-table-column prop="registrationDate" label="挂号日期" sortable />
        <el-table-column prop="registrationId" label="病历号" />
        <el-table-column prop="patientName" label="姓名" />
        <el-table-column prop="gender" label="性别" />
        <!-- <el-table-column prop="identityCardNo" label="身份证号" width="200" /> -->
        <el-table-column prop="departmentId" label="科室" />
        <el-table-column prop="doctorId" label="医生" />
        <el-table-column prop="isVisited" label="是否已诊">
          <template slot-scope="scope">
            {{ scope.row.isVisited === '0' ? '未诊' : '已诊' }}
          </template>
        </el-table-column>
        <el-table-column prop="withdraw" label="执行" width="260px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="withdraw(scope.$index, scope.row)"
            >
              退号
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="toCharge(scope.$index, scope.row)"
            >
              收费
            </el-button>
            <el-button
              size="mini"
              type="info"
              @click="print(scope.$index, scope.row)"
            >
              打印
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="registrationStatus"
          label="状态"
          fixed
          :filters="[{ text: '待诊', value: '1' }, { text: '已退号', value: '2' }, { text: '诊毕', value: '0' }]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.registrationStatus === '2' ? 'danger' : (scope.row.registrationStatus === '1' ? 'primary' : 'success')"
              close-transition
            >{{ scope.row.registrationStatus === '2' ? '已退号' : (scope.row.registrationStatus === '1' ? '待诊' : '诊毕') }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div style="background: #d3dce6;">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[20, 50, 100, 200]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNumber"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>

import {
  fetchRegistrationList
} from '../../api/registrationCharge/registrationListSearch'

import {
  withdrawRegistration
} from '../../api/registrationCharge/charge'

export default {
  data() {
    return {
      // 表格
      registrationList: [
        {
          registrationDate: '2016-05-02',
          medicalRecordId: '',
          patientName: '王小虎',
          identityCardNo: '1111',
          isVisited: '1',
          totalCharge: '1',
          valid: '正常',
          gender: ''

        },
        {
          registrationDate: '2016-05-02',
          medicalRecordId: '',
          patientName: '王小虎',
          identityCardNo: '1111',
          isVisited: '1',
          totalCharge: '1',
          valid: '已退号'
        }
      ],
      registrationListLoading: false,
      // 分页
      currentPage: 1, // 当前页码
      pageSize: 50, // 页码大小
      totalNumber: 0
    }
  },
  created() {
    this.queryRegistrationListWithPage()
  },
  methods: {
    print(index, row) {
      var query = '?registrationId=' + row.registrationId +
        '&age=' + row.age +
        '&birthday=' + row.birthday.substring(0, 10) +
        '&collectorId=' + row.collectorId +
        '&departmentName=' + row.departmentId +
        '&doctorName=' + row.doctorId +
        '&familyAddress=' + row.familyAddress +
        '&gender=' + row.gender +
        '&identityCardNo=' + row.identityCardNo +
        '&patientName=' + row.patientName +
        '&registrationDate=' + row.registrationDate +
        '&departmentName=' + row.departmentName
      window.open('#/registered_receipt' + query)
    },
    // 跳转
    toCharge(index, row) {
      this.$router.push({
        path: '/registration/registrationCharge', // 这个path是在router/index.js里边配置的路径
        query: {
          registrationId: row.registrationId
        }
      })
    },
    // 退号
    withdraw(index, row) {
      if (row.isVisited === '1') {
        this.$message.error('医生已经诊断，不能退号，错误！')
        return
      }
      if (row.registrationStatus === '2') {
        this.$message.error('已经退号，错误！')
        return
      }
      if (row.registrationStatus === '0') {
        this.$message.error('已经诊断完毕，错误！')
        return
      }
      this.$confirm('退号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        withdrawRegistration({ 'registrationId': row.registrationId }).then(response => {
          this.$message({
            type: 'success',
            message: '挂号' + row.registrationId + '号退号成功!'
          })
          this.queryRegistrationListWithPage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    formatter(row, column) {
      return row.address
    },
    filterTag(value, row) {
      return row.registrationStatus === value
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
    },
    queryRegistrationListWithPage() {
      this.registrationListLoading = true
      var query = { 'currentPage': this.currentPage, 'pageSize': this.pageSize }
      console.log(query)
      fetchRegistrationList(query).then(response => { // 然后获取科室信息列表
        console.log('fetchRegistrationList response: ')
        console.log(response)
        this.registrationList = response.data.list
        this.totalNumber = response.data.total
        for (var i = 0; i < this.registrationList.length; ++i) {
          this.registrationList[i].registrationDate = this.registrationList[i].registrationDate.substring(0, 10)
          this.registrationList[i].valid = this.registrationList[i].valid === 1 ? '正常' : '已退号'
          this.registrationList[i].departmentId = response.data.list[i].reserve1
          this.registrationList[i].doctorId = response.data.list[i].reserve2
          this.registrationList[i].registrationId = response.data.list[i].registrationId
        }
        this.registrationListLoading = false
      }).catch(error => {
        console.log('fetchRegistrationList error: ')
        console.log(error)
      })
    }
  }
}
</script>
