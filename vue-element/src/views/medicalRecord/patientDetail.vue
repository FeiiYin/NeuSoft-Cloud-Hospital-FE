<template>
  <div class="app-container">
    <aside>
      患者挂号信息明细
    </aside>
    <div style="height:50px">
      <el-col :span="3" style="margin-left:20px">
        当前进度
      </el-col>
      <el-col :span="20">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="progressPercentage" />
      </el-col>
    </div>
    <div>
      <el-form ref="registrationForm" :model="registrationForm" label-width="80px">
        <el-form-item label="患者信息">
          <el-col :span="6">
            <el-form-item label="病历号" prop="registrationId">
              <el-input v-model="registrationForm.registrationId" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份证号" prop="identityCardNo">
              <el-input v-model="registrationForm.identityCardNo" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="姓名" prop="patientName">
              <el-input v-model="registrationForm.patientName" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="挂号类别" prop="registrationCategory">
              <el-input v-model="registrationForm.registrationCategory" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="6">
            <el-form-item label="性别" prop="gender">
              <el-input v-model="registrationForm.gender" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="医疗科室" prop="departmentId">
              <el-input v-model="registrationForm.departmentId" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="年龄" prop="age">
              <el-input v-model="registrationForm.age" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开单医生" prop="doctorId">
              <el-input v-model="registrationForm.doctorId" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <div style="margin:20px"><span>门诊医生诊断疾病</span></div>
      <!-- 检查，项目，药品 -->
      <el-form ref="medicalRecordForm" :model="medicalRecordForm" label-width="80px">
        <el-form-item label="主诉" prop="mainInfo">
          <el-input v-model="medicalRecordForm.mainInfo" />
        </el-form-item>
        <el-form-item label="现病史" prop="currentDisease">
          <el-input v-model="medicalRecordForm.currentDisease" />
        </el-form-item>
        <el-form-item label="既往史" prop="pastDisease">
          <el-input v-model="medicalRecordForm.pastDisease" />
        </el-form-item>
        <el-form-item label="体格检查" prop="physicalExam">
          <el-input v-model="medicalRecordForm.physicalExam" />
        </el-form-item>
        <el-form-item label="辅助检查" prop="auxiliaryExam">
          <el-input v-model="medicalRecordForm.auxiliaryExam" />
        </el-form-item>
        <el-form-item label="处理意见" prop="opinion">
          <el-input v-model="medicalRecordForm.opinion" />
        </el-form-item>
      </el-form>
    </div>
    <div>
      <div style="margin:20px"><span>门诊医生诊断</span></div>
      <el-table ref="diseaseTableData" :data="diseaseTableData">
        <el-table-column label="疾病Icd" prop="diseaseIcd" />
        <el-table-column label="疾病名称" prop="diseaseName" />
        <el-table-column label="发病日期" prop="incidenceDate" />
      </el-table>
    </div>
    <!-- 检查 -->
    <div>
      <div style="margin:20px"><span>检查申请记录</span></div>
      <el-table ref="examineTableData" :data="examineTableData">
        <el-table-column type="index" width="55" />
        <el-table-column prop="chargeItem.nameZh" label="项目名称" />
        <el-table-column prop="chargeItem.specification" label="规格" />
        <el-table-column prop="chargeItem.price" label="单价" />
        <el-table-column prop="chargeItem.departmentName" label="科室名称" />
        <el-table-column prop="nums" label="数量" />
        <el-table-column
          prop="payState"
          label="是否缴费"
          :filters="[{ text: '未付款', value: 0 }, { text: '已付款', value: 1 }]"
          :filter-method="filterPayState"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.payState === 0 ? 'primary' : 'success'" close-transition>
              {{ scope.row.payState === 0 ? '未付款' : '已付款' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="notGivenNums"
          label="是否执行"
          :filters="[{ text: '未执行', value: 0 }, { text: '已执行', value: 1 }]"
          :filter-method="filterExcute"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.notGivenNums === 0 ? 'success' : 'primary'" close-transition>
              {{ scope.row.notGivenNums === 0 ? '已执行' : '未执行' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <aside style="height:60px;">
        <span>未缴费金额：
          <svg-icon icon-class="money" />
        </span>
        <el-input v-model="examineMoney" :disabled="true" style="width:20%" />
      </aside>
    </div>
    <!-- 处置 -->
    <div>
      <div style="margin:20px"><span>处置申请记录</span></div>
      <el-table ref="disposalTableData" :data="disposalTableData">
        <el-table-column type="index" width="55" />
        <el-table-column prop="chargeItem.nameZh" label="项目名称" />
        <el-table-column prop="chargeItem.specification" label="规格" />
        <el-table-column prop="chargeItem.price" label="单价" />
        <el-table-column prop="chargeItem.departmentName" label="科室名称" />
        <el-table-column prop="nums" label="数量" />
        <el-table-column
          prop="payState"
          label="是否缴费"
          :filters="[{ text: '未付款', value: 0 }, { text: '已付款', value: 1 }]"
          :filter-method="filterPayState"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.payState === 0 ? 'primary' : 'success'" close-transition>
              {{ scope.row.payState === 0 ? '未付款' : '已付款' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="notGivenNums"
          label="是否执行"
          :filters="[{ text: '未执行', value: 0 }, { text: '已执行', value: 1 }]"
          :filter-method="filterExcute"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.notGivenNums === 0 ? 'success' : 'primary'" close-transition>
              {{ scope.row.notGivenNums === 0 ? '已执行' : '未执行' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <aside style="height:60px;">
        <span>未缴费金额：
          <svg-icon icon-class="money" />
        </span>
        <el-input v-model="disposalMoney" :disabled="true" style="width:20%" />
      </aside>
    </div>
    <!-- 处方 -->
    <div>
      <div style="margin:20px"><span>处方申请记录</span></div>
      <el-table ref="prescriptionTableData" :data="prescriptionTableData">
        <el-table-column type="index" width="55" />
        <el-table-column prop="medicine.nameZh" label="药品名称" />
        <el-table-column prop="medicine.medicineSpecification" label="规格" />
        <el-table-column prop="medicine.medicinePrice" label="单价" />
        <el-table-column prop="medicineUsage" label="使用" />
        <el-table-column prop="nums" label="数量" />
        <el-table-column
          prop="payState"
          label="是否缴费"
          :filters="[{ text: '未付款', value: 0 }, { text: '已付款', value: 1 }]"
          :filter-method="filterPayState"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.payState === 0 ? 'primary' : 'success'" close-transition>
              {{ scope.row.payState === 0 ? '未付款' : '已付款' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="notGivenNums"
          label="是否执行"
          :filters="[{ text: '未执行', value: 0 }, { text: '已执行', value: 1 }]"
          :filter-method="filterExcute"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.notGivenNums === 0 ? 'success' : 'primary'" close-transition>
              {{ scope.row.notGivenNums === 0 ? '已执行' : '未执行' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <aside style="height:60px;">
        <span>未缴费金额：
          <svg-icon icon-class="money" />
        </span>
        <el-input v-model="prescriptionMoney" :disabled="true" style="width:20%" />
      </aside>
    </div>
    <aside style="height:60px;">
      <span>合计未缴费金额：
        <svg-icon icon-class="money" />
      </span>
      <el-input v-model="totalMoney" :disabled="true" style="width:20%" />
    </aside>
    <div style="text-align:center">
      <el-button type="primary" @click="invokeEndRegistration">诊断结束</el-button>
    </div>
  </div>
</template>

<script>
import {
  selectPatientHistoryMedicalRecords,
  endRegistration
} from '../../api/medicalRecord/medicalRecord'

import {
  fetchDepartmentList
} from '../../api/basicInfo/department'

import {
  selectHistoryDisposal
} from '../../api/medicalRecord/disposal'

import {
  selectHistoryExam
} from '../../api/medicalRecord/examination'

import {
  selectHistoryPrescription
} from '../../api/medicalRecord/prescription'

export default {
  data() {
    return {
      // 基础信息
      registrationId: 1,
      // 进度条
      progressPercentage: 10,
      // 患者信息
      registrationForm: {
        registrationId: '',
        patientName: '',
        patientId: '',
        gender: '',
        age: '',
        birthday: '',
        registrationCategory: '',
        medicalCategory: '',
        identityCardNo: '',
        registrationStatus: '',
        visitDate: '',
        registrationDate: '',
        departmentId: '',
        doctorId: '',
        registrationSource: '',
        settleAccountsCategory: '',
        isVisited: '',
        valid: '',
        familyAddress: '',
        collectorId: 1001,
        totalCharge: ''
      },
      medicalRecordForm: {},
      diseaseTableData: [],

      departmentList: [],

      examineTableData: [],
      examineMoney: 0,

      disposalTableData: [],
      disposalMoney: 0,

      prescriptionTableData: [],
      prescriptionMoney: 0

      // below has problem, should use computed
      // totalMoney: examineMoney + disposalMoney + prescriptionMoney,
    }
  },
  computed: {
    totalMoney: function() {
      return this.examineMoney + this.disposalMoney + this.prescriptionMoney
    }
  },
  created() {
    // this.registrationId = this.$route.query.registrationId
    this.registrationId = 1
    this.invokeSelectPatientHistoryMedicalRecords()
    this.invokeFetchDepartmentList()
    this.invokeSelectHistoryPrescription()
  },
  methods: {
    // department
    invokeFetchDepartmentList() {
      var query = { 'currentPage': 1, 'pageSize': 400 }
      fetchDepartmentList(query).then(response => {
        console.log('fetchDepartmentList response: ')
        console.log(response)
        this.departmentList = response.data.list
        // problem?
        this.invokeSelectHistoryDisposal()
        this.invokeSelectHistoryExam()
      })
    },
    invokeSelectHistoryDisposal() {
      selectHistoryDisposal({ 'registrationId': this.registrationId }).then(response => {
        console.log('selectHistoryDisposal response')
        var tempList = JSON.parse(response.data)
        this.disposalMoney = 0
        var i
        for (i = 0; i < tempList.length; ++i) {
          if (tempList[i].saveState === 1) {
            for (var j = 0; j < tempList[i].chargeEntryList.length; ++j) {
              this.disposalTableData.push(tempList[i].chargeEntryList[j])
            }
          }
        }
        for (i = 0; i < this.disposalTableData.length; ++i) {
          this.disposalTableData[i].chargeItem.departmentName = this.departmentList[this.disposalTableData[i].chargeItem.departmentId - 1].departmentName
          if (this.disposalTableData[i].payState === 0) {
            this.disposalMoney += this.disposalTableData[i].totalPrice
          }
        }
        console.log(this.disposalTableData)
      }).catch(error => {
        console.log('selectHistoryDisposal error: ')
        console.log(error)
      })
    },
    invokeSelectHistoryExam() {
      selectHistoryExam({ 'registrationId': this.registrationId }).then(response => {
        console.log('selectHistoryExam response')
        var tempList = JSON.parse(response.data)
        this.examineMoney = 0
        var i
        for (i = 0; i < tempList.length; ++i) {
          if (tempList[i].saveState === 1) {
            for (var j = 0; j < tempList[i].chargeEntryList.length; ++j) {
              this.examineTableData.push(tempList[i].chargeEntryList[j])
            }
          }
        }
        for (i = 0; i < this.examineTableData.length; ++i) {
          this.examineTableData[i].chargeItem.departmentName = this.departmentList[this.examineTableData[i].chargeItem.departmentId - 1].departmentName
          if (this.examineTableData[i].payState === 0) {
            this.examineMoney += this.examineTableData[i].totalPrice
          }
        }
        console.log(this.examineTableData)
      }).catch(error => {
        console.log('selectHistoryExam error: ')
        console.log(error)
      })
    },
    filterPayState(value, row) {
      return row.payState === value
    },
    filterExcute(value, row) {
      if (value === 1) {
        return row.notGivenNums === 0
      } else {
        return row.notGivenNums !== 0
      }
    },
    // medicalRecordForm
    invokeSelectPatientHistoryMedicalRecords() {
      var query = {
        'registrationId': this.registrationId
      }
      selectPatientHistoryMedicalRecords(query).then(response => {
        var tempList = JSON.parse(response.data)
        for (var i = 0; i < tempList.length; ++i) {
          if (tempList[i].registrationId === this.registrationId) {
            this.medicalRecordForm = tempList[i]
            break
          }
        }
        this.diseaseTableData = JSON.parse(this.medicalRecordForm.disease)
        console.log('selectPatientHistoryMedicalRecords response:')
        console.log(this.diseaseTableData)
      })
    },

    invokeSelectHistoryPrescription() {
      selectHistoryPrescription({ 'registrationId': this.registrationId }).then(response => {
        var tempList = JSON.parse(response.data)
        // console.log('selectHistoryPrescription response: ')
        // console.log(tempList)
        var i
        for (i = 0; i < tempList.length; ++i) {
          if (tempList[i].saveState === 1) {
            for (var j = 0; j < tempList[i].prescriptionEntryList.length; ++j) {
              this.prescriptionTableData.push(tempList[i].prescriptionEntryList[j])
            }
          }
        }
        this.prescriptionMoney = 0
        for (i = 0; i < this.prescriptionTableData.length; ++i) {
          if (this.prescriptionTableData[i].payState === 0) {
            this.prescriptionMoney += this.prescriptionTableData[i].totalPrice
          }
        }
        console.log('selectHistoryPrescription response:')
        console.log(this.prescriptionTableData)
      }).catch(error => {
        console.log('selectHistoryPrescription error: ')
        console.log(error)
      })
    },
    // 一切的结束，又是一切的开始
    invokeEndRegistration() {
      this.$confirm('将要结束该次挂号诊断吗，结束后无法撤销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        endRegistration({ 'registrationId': this.registrationId }).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // eslint-disable-next-line handle-callback-err
        }).catch(error => {
          this.$message.error('出现未知错误！')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>

</style>
