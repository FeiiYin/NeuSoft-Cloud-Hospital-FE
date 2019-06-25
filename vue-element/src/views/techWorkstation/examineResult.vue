<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <aside>
          <span>患者费用查询</span>
        </aside>
        <el-container>
          <el-header>
            <el-row>
              <el-col :span="2" style="padding:10px;">
                病历号
              </el-col>
              <el-col :span="18">
                <el-input
                  v-model="registrationId"
                  placeholder="请输入"
                  suffix-icon="el-icon-search"
                />
              </el-col>
              <el-col :span="4">
                <el-button type="primary" style="float:right;" @click="invokeSelectHistoryExam">
                  <svg-icon icon-class="component" />
                  确认
                </el-button>
              </el-col>
            </el-row>
          </el-header>
          <el-main style="margin-top:60px;">
            <el-table
              ref="historyExamTable"
              :data="historyExamTable"
              border
              @row-click="showHistoryExamItemExample"
            >
              <el-table-column type="index" />
              <el-table-column prop="examName" label="检查名称" />
              <el-table-column prop="departmentName" label="挂号科室" />
            </el-table>
            <div style="margin-top:40px">
              <el-form ref="examForm" :model="examForm" label-width="100px">
                <el-form-item label="检查申请名称" prop="examinationName">
                  <el-input v-model="examForm.examName" prefix-icon="el-icon-document" :disabled="true" />
                </el-form-item>
                <el-form-item label="检查要求" prop="requirement">
                  <el-input v-model="examForm.requirement" prefix-icon="el-icon-document" type="textarea" :rows="2" />
                </el-form-item>
                <el-form-item label="临床印象" prop="clinicalImpression">
                  <el-input v-model="examForm.clinicalImpression" prefix-icon="el-icon-document" type="textarea" :rows="2" />
                </el-form-item>
                <el-form-item label="检查结果" prop="examResult">
                  <el-input v-model="examForm.examResult" prefix-icon="el-icon-document" type="textarea" :rows="2" />
                </el-form-item>
              </el-form>
            </div>
            <div class="editor-container">
              <dropzone id="myVueDropzone" url="https://httpbin.org/post" @dropzone-removedFile="dropzoneR" @dropzone-success="dropzoneS" />
            </div>
            <div>
              历史图片 TODO！！
            </div>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  fetchDepartmentList
} from '../../api/basicInfo/department'

import {
  selectHistoryExam
} from '../../api/medicalRecord/examination'

import Dropzone from '@/components/Dropzone'

export default {
  components: { Dropzone },
  data() {
    return {
      registrationId: '',
      // 歷史
      historyExamTable: [],
      examForm: {},
      historyExamItemExample: [],

      chargeFormTableList: [],
      chargeFormTableLoading: false,
      departmentList: [],
      // 分页
      currentPage: 1,
      pageSize: 50,
      totalNumber: 0,
      // 退费
      excuteDialogVisible: false,
      excuteForm: {
        excuteNumber: 1,
        excuteEntryId: 0,
        excuteEntryName: '',
        prescriptionBool: 0,
        notGivenNums: 0
      },
      // 临时新增
      chooseBool: false,
      chargeItemList: [],
      chargeItemFormVisible: false,
      chargeItemFormDisable: true,
      chargeItemForm: {
        chargeItemId: '',
        departmentId: '',
        nums: 1
      },
      // 常用药对话框
      commonExamDialogVisible: false,
      commonExamListData: [],
      commonExamListValue: [],
      transferFilterMethod(query, item) {
        return item.nameZh.indexOf(query) > -1
      }
    }
  },
  created() {
    this.invokeFetchDepartmentList()
  },
  methods: {
    // 上传图片
    dropzoneS(file) {
      console.log(file)
      this.$message({ message: 'Upload success', type: 'success' })
    },
    dropzoneR(file) {
      console.log(file)
      this.$message({ message: 'Delete success', type: 'success' })
    },
    invokeFetchDepartmentList() {
      var query = { 'currentPage': 1, 'pageSize': 400 }
      fetchDepartmentList(query).then(response => {
        console.log('fetchDepartmentList response: ')
        console.log(response)
        this.departmentList = response.data.list
      })
    },
    invokeSelectHistoryExam() {
      if (this.registrationId === '') {
        this.$message.error('未输入病历号，错误！')
        return
      }
      selectHistoryExam({ 'registrationId': this.registrationId }).then(response => {
        console.log('selectHistoryExam response')
        var tempList = JSON.parse(response.data)
        var i
        this.historyExamTable = []
        for (i = 0; i < tempList.length; ++i) {
          if (tempList[i].saveState === 1) {
            this.historyExamTable.push(tempList[i])
          }
        }
        for (i = 0; i < this.historyExamTable.length; ++i) {
          this.historyExamTable[i].departmentName = this.departmentList[this.historyExamTable[i].departmentId - 1].departmentName
        }
        console.log(this.historyExamTable)
      }).catch(error => {
        console.log('selectHistoryExam error: ')
        console.log(error)
      })
    },
    showHistoryExamItemExample(row, event) {
      this.chooseBool = true
      console.log(row)
      this.examForm = row
      this.historyExamItemExample = row.chargeEntryList
      for (var i = 0; i < this.historyExamItemExample.length; ++i) {
        this.historyExamItemExample[i].chargeItem.departmentName = this.departmentList[this.historyExamItemExample[i].chargeItem.departmentId - 1].departmentName
      }
    },
    invokeExcute() {
      if (this.excuteForm.excuteNumber === 0) {
        this.$message.error('登记数量为0，错误！')
        return
      }
      alert('TODO!')
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.invokeSelectHistoryExam()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.invokeSelectHistoryExam()
    },
    filterTag(value, row) {
      return row.valid === value
    },
    filterPayState(value, row) {
      return row.payState === value
    },
    filterDepartment(value, row) {
      if (value === '药房') {
        return row.departmentName === '药房'
      } else {
        return row.departmentName !== '药房'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .drawer-container {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;

    .drawer-title {
      margin-bottom: 12px;
      color: rgba(0, 0, 0, .85);
      font-size: 14px;
      line-height: 22px;
    }

    .drawer-item {
      color: rgba(0, 0, 0, .65);
      font-size: 14px;
      padding: 12px 0;
    }

    .drawer-switch {
      float: right
    }
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
