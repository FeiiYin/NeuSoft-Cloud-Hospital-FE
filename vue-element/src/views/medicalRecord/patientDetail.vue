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
        <el-progress :text-inside="true" :stroke-width="18" :percentage="progressPercentage"></el-progress>
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
        <el-form-item >
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
    <div >
      <div style="margin:20px"><span >门诊医生诊断</span></div>
      <!-- 检查，项目，药品 -->
      <el-form ref="medicalRecordForm" :model="medicalRecordForm" label-width="80px">
        <el-form-item label="主诉" prop="mainInfo">
          <el-input v-model="medicalRecordForm.mainInfo"/>
        </el-form-item>
        <el-form-item label="现病史" prop="currentDisease">
          <el-input v-model="medicalRecordForm.currentDisease"/>
        </el-form-item>
        <el-form-item label="既往史" prop="pastDisease">
          <el-input v-model="medicalRecordForm.pastDisease"/>
        </el-form-item>
        <el-form-item label="体格检查" prop="physicalExam">
          <el-input v-model="medicalRecordForm.physicalExam" />
        </el-form-item>
        <el-form-item label="辅助检查" prop="auxiliaryExam">
          <el-input v-model="medicalRecordForm.auxiliaryExam" />
        </el-form-item>
        <el-form-item label="处理意见" prop="opinion">
          <el-input v-model="medicalRecordForm.opinion"/>
        </el-form-item>
      </el-form>
      <el-form ref="registrationForm" :model="registrationForm" label-width="80px">
        
      </el-form>
    </div>
  </div>
</template>

<script>
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
        medicalRecordForm: {}
      }
    },
    methods: {
      // medicalRecordForm
      invokeSelectPatientHistoryMedicalRecords() {
        var query = {
          'registrationId': this.registrationId,
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    },
  }
</script>

<style>

</style>
