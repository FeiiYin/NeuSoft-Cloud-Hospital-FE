<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <aside>
          <span>检查结果确认</span>
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
                  :disabled="true"
                />
              </el-col>
              <el-col :span="4">
                <el-button type="primary" style="float:right;" :disabled="true" @click="invokeSelectHistoryExam">
                  <svg-icon icon-class="component" />
                  确认
                </el-button>
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <div style="margin-top:40px">
              <el-form ref="examForm" :model="examForm" label-width="100px">
                <el-form-item label="检查申请编号" prop="examinationId">
                  <el-input v-model="examForm.examinationId" prefix-icon="el-icon-document" :disabled="true" />
                </el-form-item>
                <el-form-item label="检查申请名称" prop="examName">
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
              <aside>
                检查结果图片上传
              </aside>
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :http-request="handleUpload"
                :limit="3"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-exceed="handleExceed"
              >
                <i class="el-icon-plus" />
              </el-upload>
              <el-dialog :visible.sync="dialogVisible" size="tiny">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </div>
            <div style="text-align:center;margin-top:40px;">
              <el-button type="primary" @click="invokeUpdateExaminationAbstract()">提交</el-button>
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
  selectHistoryExam,
  updateExaminationAbstract,
  selectExaminationAbstract
} from '../../api/medicalRecord/examination'

import moment from 'moment'

export default {
  data() {
    return {
      registrationId: '',
      examinationId: 1,
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
      },
      // 上传
      Bucket: 'neusoft-hospital-1259205273',
      Region: 'ap-beijing',
      SecretId: 'AKIDHQK4h66DvPgiWGF6C2mKdhdMtBFBCPiu',
      SecretKey: '7zhHdqnU2LSPDsPhyf7f3IF5h74mGWbE',
      cos: null,
      dialogImageUrl: '',
      dialogVisible: false,
      mapFilename: []
    }
  },
  created() {
    // this.doctorId = this.$store.getters.doctorId
    this.registrationId = this.$route.query.registrationId
    this.examinationId = this.$route.query.examinationId
    if (typeof (this.examinationId) === 'undefined') {
      return
    }
    // this.examinationId
    this.invokeSelectExaminationAbstract()
    var COS = require('cos-js-sdk-v5')
    this.cos = new COS({
      SecretId: 'AKIDHQK4h66DvPgiWGF6C2mKdhdMtBFBCPiu',
      SecretKey: '7zhHdqnU2LSPDsPhyf7f3IF5h74mGWbE'
    })
  },
  methods: {
    invokeSelectExaminationAbstract() {
      selectExaminationAbstract({ 'examinationId': this.examinationId }).then(response => {
        console.log('selectExaminationAbstract ressponspe :')
        console.log(response)
        this.examForm = response.data
      }).catch(error => {
        console.log(error)
      })
    },
    invokeUpdateExaminationAbstract() {
      // var query = {
      //   examinationId
      //   registrationId = registrationId;
      //   patientName = patientName;
      //   doctorId = doctorId;
      //   departmentId = departmentId;
      //   saveState = saveState;
      //   payState = payState;
      //   executionState = executionState;
      //   examName = examName;
      //   clinicalImpression = clinicalImpression;
      //   requirement = requirement;
      //   examResult = examResult;
      // }
      updateExaminationAbstract({ 'examinationJson': this.examForm }).then(response => {
        console.log('selectExaminationAbstract ressponspe :')
        console.log(response)
        this.$message({
          message: '修改成功！',
          type: 'success'
        })
        this.$router.push({
          path: '/techWorkstation/examineIndex'
        })
      }).catch(error => {
        console.log(error)
      })
    },
    // 日期选择
    // # 编写日期格式化方法
    dateFormat: function(row, column) {
      const date = row[column.property]
      if (date === undefined) {
        return ''
      }
      // # 这里的格式根据需求修改
      return moment(date).format('YYYY-MM-DD')
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      var filename
      for (var i = 0; i < this.mapFilename.length; ++i) {
        if (file.name === this.mapFilename[i].originName) {
          filename = this.mapFilename[i].filename
        }
      }
      this.cos.deleteObject({
        Bucket: this.Bucket,
        Region: this.Region,
        Key: filename
      }, function(err, data) {
        console.log(err || data)
      })
    },
    handleExceed() {
      this.$message.warning({
        message: '不能超过3个图片！'
      })
    },
    generateFilename(filename) {
      const date = new Date()
      const real = ('00000' + this.examinationId).slice(-5) + '_' + moment(date).format('YYYYMMDDHHMMSS')
      this.mapFilename.push({
        'originName': filename,
        'filename': real
      })
      return real
    },
    handleUpload(param) {
      const file = param.file
      if (!file) return
      const originName = file.name
      for (var i = 0; i < this.mapFilename.length; ++i) {
        if (this.mapFilename[i].originName === originName) {
          this.$message.error('当前传输文件名重复，错误！')
          return
        }
      }
      const originSize = file.size
      const originType = file.type
      console.log('fileName ' + originName)
      console.log('fileSize ' + originSize)
      console.log('fileType ' + originType)
      const bucket = this.Bucket
      const region = this.Region
      var filename = this.generateFilename(originName)
      this.cos.putObject({
        Bucket: this.Bucket,
        Region: this.Region,
        Key: filename,
        Body: file
      }, function(err, data) {
        console.log(err || data)
        if (err) {
          this.$message.error({
            message: err.error
          })
        } else {
          const file_path = 'https://' + bucket + '.cos.' + region + '.myqcloud.com/' + filename
          console.log('文件上传成功 ' + file_path) // 得到的file_path 就是上传到腾讯云的路径，将这个URL传给后端即可
        }
      })
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
