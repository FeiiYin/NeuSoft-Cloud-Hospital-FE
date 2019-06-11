<template>
  <div class="app-container">
    <aside>
      <h2>门诊挂号管理</h2>
    </aside>
    <div class="wordbox">
      <el-row>
        <el-col :span="17">
          <span>门诊挂号登记号</span>
          <el-input
            :disabled="true"
            placeholder="自动生成"
            style="width:350px;margin-left:20px;"
            prefix-icon="el-icon-document"
          />
        </el-col>
        <el-col :span="7">
          <el-button type="primary" icon="document" @click="true">
            <svg-icon icon-class="documentation" />
            挂号
          </el-button>
          <el-button @click="true">
            预约选择
          </el-button>
          <el-button icon="document" @click="true">
            补收挂号费
          </el-button>
        </el-col>
      </el-row>
      <svg-icon style="display:inline-block;margin-right:20px;margin-top:20px;" icon-class="peoples" />
      个人信息
      <hr>
      <el-form ref="registrationForm" :model="registrationForm">
        <el-form-item label="">
          <el-row :gutter="20">
            <el-col :span="12">
              <h4 style="margin-bottom:2px;">身份证号</h4>
              <el-input v-model="registrationForm.identityCardNo" />
            </el-col>
            <el-col :span="12">
              <h4 style="margin-bottom:2px;">家庭住址</h4>
              <el-input v-model="registrationForm.familyAddress" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="6">
            <h4 style="margin-bottom:2px;">姓名</h4>
            <el-form-item>
              <el-input v-model="registrationForm.patientName" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <h4 style="margin-bottom:2px;">性别</h4>
            <el-form-item>
              <el-select
                v-model="registrationForm.gender"
                placeholder="请选择性别"
                style="width:100%"
              >
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <h4 style="margin-bottom:2px;">年龄</h4>
            <el-form-item>
              <el-input v-model="registrationForm.age" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <h4 style="margin-bottom:2px;">出生日期</h4>
            <el-form-item>
              <el-date-picker
                v-model="registrationForm.birthday"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <svg-icon style="margin-right:20px;margin-top:40px;" icon-class="tab" />
        病历信息
        <hr>
        <el-row :gutter="20">
          <el-col :span="6">
            <h4 style="margin-bottom:2px;">挂号类型</h4>
            <el-form-item>
              <el-input v-model="registrationForm.registrationCategory" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 普通或者城镇职工 -->
            <h4 style="margin-bottom:2px;">医疗类别</h4>
            <el-form-item>
              <el-select
                v-model="registrationForm.settleAccountsCategory"
                placeholder="请选择医疗类别"
                style="width:100%"
              >
                <el-option label="普通" value="普通" />
                <el-option label="城镇职工医疗保险" value="城镇职工医疗保险" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <h4 style="margin-bottom:2px;">病历本</h4>
            <el-radio v-model="medicalRecordRadio" label="1">是</el-radio>
            <el-radio v-model="medicalRecordRadio" label="2">否</el-radio>
          </el-col>
          <el-col :span="6">
            <h4 style="margin-bottom:2px;">结算类别</h4>
            <el-form-item>
              <el-select
                v-model="registrationForm.settleAccountsCategory"
                placeholder="请选择结算类别"
                style="width:100%"
              >
                <el-option label="自费" value="自费" />
                <el-option label="医保" value="医保" />
                <el-option label="新农合" value="新农合" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <h4 style="margin-bottom:2px;">挂号日期</h4>
            <el-form-item>
              <el-date-picker
                v-model="registrationForm.registrationDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <h4 style="margin-bottom:2px;">挂号来源</h4>
            <el-form-item>
              <el-select
                v-model="registrationForm.registrationSource"
                placeholder="请选择挂号来源"
                style="width:100%"
              >
                <el-option label="医院就诊" value="医院就诊" />
                <el-option label="网上挂号" value="网上挂号" />
              </el-select>

            </el-form-item>
          </el-col>
          <el-col :span="6">
            <h4 style="margin-bottom:2px;">挂号科室</h4>
            <!-- TODO -->
            <el-select v-model="registrationForm.departmentId" filterable placeholder="请选择"
              style="width:100%;">
              <el-option
                v-for="item in departmentListOptions"
                :key="item.departmentId"
                :label="item.departmentName"
                :value="item.departmentId">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <h4 style="margin-bottom:2px;">看诊医生</h4>
            <el-form-item>
              <el-input v-model="registrationForm.doctorId" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <h4 style="margin-bottom:2px;">当前收费员Id</h4>
            <el-form-item>
              <el-input v-model="registrationForm.collectorId" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <h4 style="margin-bottom:2px;">应收金额</h4>
            <el-form-item>
              <el-input v-model="registrationForm.totalCharge" />
            </el-form-item>
          </el-col>
        </el-row>
        <div style="margin-top:80px;margin-bottom:40px;text-align:center">
          <el-button type="primary">提交</el-button>
          <el-button type="info" @click="resetForm()">清空</el-button>
        </div>
      </el-form>
    </div>
  </div>

</template>

<script>
  import {
    fetchPatientInfoByIdentityCardNo,
    fetchDepartment
  } from '../../api/registrationCharge/registration'

  export default {
  data() {
    return {
      // 病历本是否需要
      medicalRecordRadio: '1',
      // 表单
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
      // 远程搜索的科室列表
      departmentListOptions: [{
        departmentId: '',
        departmentName: '',
      }],
    }
  },
  watch: {
    // 如果 身份证输入框 发生改变，这个函数就会运行
    'registrationForm.identityCardNo': function() {
      if (this.registrationForm.identityCardNo.length === 18) {
        this.invokeFetchPatientInfoByIdentityCardNo(this.registrationForm.identityCardNo)
      }
    }
  },
  created() {
    this.invokefetchDepartment()
  },
  methods: {
    // 根据身份证号搜索个人信息
    invokeFetchPatientInfoByIdentityCardNo(identityCardNo) {
      this.query = { 'identityCardNo': identityCardNo }
      // alert(identityCardNo)
      fetchPatientInfoByIdentityCardNo(this.query).then(response => { // 然后获取科室信息列表
        console.log('fetchPatientInfoByIdentityCardNo response: ')
        console.log(response)
        if (response.message === "not found") {
          return;
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
    invokefetchDepartment() {
      fetchDepartment().then(response => { // 然后获取科室信息列表
        console.log('fetchDepartment response: ')
        console.log(response)
        this.departmentListOptions = response.data
      }).catch(error => {
        console.log('fetchDepartment error: ')
        console.log(error)
      })
    },
    // 清空表单
    resetForm() {
      this.registrationForm.identityCardNo = ''
      this.registrationId = ''
      this.patientName = ''
      this.gender = ''
      this.age = ''
      this.birthday = ''
      this.registrationCategory = ''
      this.medicalCategory = ''
      this.identityCardNo = ''
      this.registrationStatus = ''
      this.registrationDate = ''
      this.departmentId = ''
      this.doctorId = ''
      this.registrationSource = ''
      this.settleAccountsCategory = ''
      this.familyAddress = ''
      this.collectorId = ''
      this.totalCharge = ''
    }
  }
}
</script>

<style scoped>
  .wordbox {
    display: inline-block;
    background: #eef1f6;
    padding: 8px 24px;
    padding-top: 20px;
    margin-bottom: 20px;
    border-radius: 2px;
    display: block;
    line-height: 32px;
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
  }
</style>
