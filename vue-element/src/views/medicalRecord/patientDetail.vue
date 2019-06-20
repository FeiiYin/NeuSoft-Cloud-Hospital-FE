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
        <el-progress :text-inside="true" :stroke-width="18" :percentage="progressPercentage" status="progressStatus"></el-progress>
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
    <div>
      <!-- 检查，项目，药品 -->
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
        progressStatus: 'exception',
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
        
      }
    },
    methods: {
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    },
  }
</script>

<style>

</style>
