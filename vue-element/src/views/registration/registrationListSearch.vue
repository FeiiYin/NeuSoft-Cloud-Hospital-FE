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
      <el-table v-loading="registrationListLoading" :data="registrationList" style="width: 100%">
        <el-table-column prop="registrationDate" label="挂号日期" sortable />
        <el-table-column prop="medicalRecordId" label="病历号" />
        <el-table-column prop="patientName" label="姓名" />
        <el-table-column prop="gender" label="性别" />
        <el-table-column prop="identityCardNo" label="身份证号" width="200" />
        <el-table-column prop="departmentId" label="科室" />
        <el-table-column prop="doctorId" label="医生" />
        <el-table-column prop="isVisited" label="是否已诊" />
        <el-table-column prop="totalCharge" label="实收费用" />
        <el-table-column
          prop="valid"
          label="状态"
          fixed
          :filters="[{ text: '正常', value: '正常' }, { text: '已退号', value: '已退号' }]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.valid === '已退号' ? 'primary' : 'success'"
              close-transition
            >{{ scope.row.valid }}
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
    formatter(row, column) {
      return row.address
    },
    filterTag(value, row) {
      return row.valid === value
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
          this.registrationList[i].medicalRecordId = response.data.list[i].registrationId
        }
        // for (var i = 0; i < response.data.length; ++i) {
        //   this.registrationList.registrationDate = response.data[i].registrationDate
        //   this.registrationList.medicalRecordId = response.data[i].medicalRecordId
        //   this.registrationList.patientName = response.data[i].patientName
        //   this.registrationList.identityCardNo = response.data[i].identityCardNo
        //   this.registrationList.isVisited = response.data[i].isVisited
        //   this.registrationList.totalCharge = response.data[i].totalCharge
        //   this.registrationList.valid = response.data[i].valid
        // }
        this.registrationListLoading = false
      }).catch(error => {
        console.log('fetchRegistrationList error: ')
        console.log(error)
      })
    }
  }
}
</script>
