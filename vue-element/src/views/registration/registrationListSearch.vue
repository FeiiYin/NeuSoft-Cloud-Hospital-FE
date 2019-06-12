<template>
  <div class="app-container">
    <aside>
      <span>当前挂号信息列表</span>
      <el-button type="info" style="float:right">
        <i class="el-icon-refresh" />
        刷新
      </el-button>
    </aside>
    <div>
      <el-table :data="registrationList" style="width: 100%">
        <el-table-column prop="registrationDate" label="挂号日期" sortable>
        </el-table-column>
        <el-table-column prop="medicalRecordId" label="病历号">
        </el-table-column>
        <el-table-column prop="patientName" label="姓名">
        </el-table-column>
        <el-table-column prop="identityCardNo" label="身份证号">
        </el-table-column>
        <el-table-column prop="isVisited" label="是否已诊">
        </el-table-column>
        <el-table-column prop="totalCharge" label="实收费用">
        </el-table-column>
        <el-table-column prop="valid" label="状态"
          :filters="[{ text: '正常', value: '正常' }, { text: '已退号', value: '已退号' }]"
          :filter-method="filterTag"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.valid === '已退号' ? 'primary' : 'success'"
              close-transition>{{scope.row.valid}}
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
  fetchRegistrationList,
} from '../../api/registrationCharge/registrationListSearch'

export default {
  data() {
    return {
      registrationList: [
        {
          registrationDate: '2016-05-02',
          medicalRecordId: '',
          patientName: '王小虎',
          identityCardNo: '1111',
          isVisited: '1',
          totalCharge: '1',
          valid: '正常'
        },
        {
          registrationDate: '2016-05-02',
          medicalRecordId: '',
          patientName: '王小虎',
          identityCardNo: '1111',
          isVisited: '1',
          totalCharge: '1',
          valid: '已退号'
        },
      ],
      // 分页
      currentPage: 1, // 当前页码
      pageSize: 50, // 页码大小
      totalNumber: 0,
    }
  },
  methods: {
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.valid === value;
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
      var query = { 'currentPage': this.currentPage, 'pageSize': this.pageSize }
      fetchRegistrationList()(query).then(response => { // 然后获取科室信息列表
        console.log('fetchPatientInfoByIdentityCardNo response: ')
        console.log(response)
        if (response.message === 'not found') {
          return
        } else {
          this.registrationForm.patientName = response.data.patientName
          this.registrationForm.gender = response.data.gender
          this.registrationForm.age = response.data.age
          this.registrationForm.birthday = response.data.birthDate
          this.registrationForm.familyAddress = response.data.familyAddress
        }
      }).catch(error => {
        console.log('fetchPatientInfoByIdentityCardNo error: ')
        console.log(error)
      })
    },
  }
}
</script>