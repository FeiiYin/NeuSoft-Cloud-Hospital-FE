<template>
  <div>
  <el-table :data="list" border fit highlight-current-row style="width: 100%">
    <el-table-column
      v-loading="loading" align="center" label="ID" width="65"
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
        <span>{{ scope.row.gender  }}</span>
      </template>
    </el-table-column>

    <el-table-column width="120px" label="挂号科室">
      <template slot-scope="scope">
        <span>{{ scope.row.reserve1  }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="挂号医生" width="95">
      <template slot-scope="scope">
        <span>{{ scope.row.reserve2 }}</span>
      </template>
    </el-table-column>

    <el-table-column class-name="status-col" label="状态" width="110">
      <template slot-scope="{row}">
        <el-tag :type="row.registrationCategory == '急诊挂号' ? 'danger' : 'primary'">
          {{ row.registrationCategory }}
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
import { fetchList } from '@/api/article'
import tabPane from './TabPane'

import {
  waitingRegistrationList,
  visitedRegistrationList,
} from '../../../api/medicalRecord/medicalRecord'

export default {
  components: { tabPane },
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
        type: this.type,
      },
      loading: false,
      doctorId: 1,
      
      // 分页
      currentPage: 1, // 当前页码
      pageSize: 50, // 页码大小
      totalNumber: 0,

      tapRefreshListener: this.refreshListener,
    }
  },
  created() {
    this.getList()
  },
  watch: {
    // 这个方法并不行，只是测试一下
    tapRefreshListener(val) {
      if (val) {
        this.tapRefreshListener = false;
      }
    }
  },
  methods: {
    getList() {
      this.loading = true
      console.log("refreshListener: " + this.refreshListener)
      console.log("tapRefreshListener: " + this.tapRefreshListener)
      // console.log(this.type)
      // console.log(this.listQuery)
      var query = {
        'registrationScope': this.type, // 患者搜索范围：所有患者 0，本医生患者 1，本科室患者 2
        'doctorId': this.doctorId,
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
    },
  }
}
</script>

