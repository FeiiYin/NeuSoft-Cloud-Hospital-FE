<template>
  <div class="app-container">
    <aside>
      <h2>门诊挂号管理</h2>
    </aside>
    <div class="wordbox">      
      <el-form ref="registrationForm" :model="registrationForm" >
      <el-row>
        <el-col :span="17">
          <el-form-item label="门诊挂号登记号">
            <el-input v-model="registrationForm.registrationId" :disabled="true"
              style="width:350px;margin-left:20px;" prefix-icon="el-icon-document">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" icon="document" @click="true">
            <svg-icon icon-class="documentation" />挂号
          </el-button>
          <el-button @click="true">
            预约选择
          </el-button>
          <el-button icon="document" @click="true">
            补收挂号费
          </el-button>
        </el-col>
      </el-row>       
      <svg-icon style="display:inline-block;margin-right:20px;margin-top:20px;" icon-class="peoples" /> 个人信息
      <hr>
      <el-row :gutter="20">
        <el-col :span="12">
          <h4 style="margin-bottom:2px;">身份证号</h4>
          <el-form-item >
            <el-input v-model="registrationForm.identityCardNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <h4 style="margin-bottom:2px;">家庭住址</h4>
          <el-form-item >
            <el-input v-model="registrationForm.familyAddress"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <h4 style="margin-bottom:2px;">姓名</h4>
          <el-form-item >
            <el-input v-model="registrationForm.patientName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <h4 style="margin-bottom:2px;">性别</h4>
          <el-form-item >
            <el-select v-model="registrationForm.gender" placeholder="请选择性别"
              style="width:100%">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <h4 style="margin-bottom:2px;">年龄</h4>
          <el-form-item >
            <el-input v-model="registrationForm.age"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <h4 style="margin-bottom:2px;">出生日期</h4>
          <el-form-item >
            <el-date-picker type="date" placeholder="选择日期" v-model="registrationForm.birthday" 
              style="width: 100%;">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <svg-icon style="margin-right:20px;margin-top:40px;" icon-class="tab" /> 病历信息
      <hr>  
      <el-row :gutter="20">
        <el-col :span="6">
          <h4 style="margin-bottom:2px;">挂号类型</h4>
          <el-form-item >
            <el-input v-model="registrationForm.registrationCategory"></el-input>
          </el-form-item>          
        </el-col>
        <el-col :span="6">
          <!-- 普通或者城镇职工 -->
          <h4 style="margin-bottom:2px;">医疗类别</h4>
          <el-form-item >
            <el-input v-model="registrationForm.medicalCategory"></el-input>
          </el-form-item>          
        </el-col>
        <el-col :span="6">
          <h4 style="margin-bottom:2px;">医疗证号</h4>
          <el-input ></el-input>
        </el-col>
        <el-col :span="6">
          <h4 style="margin-bottom:2px;">医疗类别</h4>
          <el-input ></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <h4 style="margin-bottom:2px;">挂号日期</h4>
          <el-form-item >
            <el-input v-model="registrationForm.registrationDate"></el-input>
          </el-form-item>  
        </el-col>
        <el-col :span="6">
          <h4 style="margin-bottom:2px;">挂号来源</h4>
          <el-form-item >
            <el-select v-model="registrationForm.registrationSource" placeholder="请选择挂号来源"
              style="width:100%">
              <el-option label="医院就诊" value="医院就诊"></el-option>
              <el-option label="网上挂号" value="网上挂号"></el-option>
            </el-select>

          </el-form-item>
        </el-col>
        <el-col :span="6">
          <h4 style="margin-bottom:2px;">挂号科室</h4>
          <el-form-item >
            <el-input v-model="registrationForm.departmentId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <h4 style="margin-bottom:2px;">看诊医生</h4>
          <el-form-item >
            <el-input v-model="registrationForm.doctorId"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <h4 style="margin-bottom:2px;">当前收费员Id</h4>
          <el-form-item >
            <el-input v-model="registrationForm.collectorId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <h4 style="margin-bottom:2px;">结算类别</h4>
          <el-form-item>
            <el-input v-model="registrationForm.settleAccountsCategory"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <h4 style="margin-bottom:2px;">病历本</h4>
          <el-radio v-model="medicalRecordRadio" label="1">是</el-radio>
          <el-radio v-model="medicalRecordRadio" label="2">否</el-radio>
        </el-col>
        <el-col :span="6">
          <h4 style="margin-bottom:2px;">应收金额</h4>
          <el-form-item >
            <el-input v-model="registrationForm.totalCharge"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="margin-top:80px;margin-bottom:40px;text-align:center">
        <el-button type="primary">提交</el-button>
        <el-button type="info">清空</el-button>
      </div>
      </el-form>
    </div>
  </div>

</template>

<script>
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
        collectorId: '',
        totalCharge: '',
      }
    }
  }
}
</script>

<style  scoped>
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
