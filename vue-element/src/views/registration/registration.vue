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
          <el-button style="float:right">
            预约
          </el-button>
          <el-button type="primary" icon="document" style="float:right;margin-right:20px">
            <svg-icon icon-class="documentation" />
            挂号
          </el-button>          
        </el-col>
      </el-row>
      <svg-icon style="display:inline-block;margin-right:20px;margin-top:20px;" icon-class="peoples" />
      个人信息
      <hr>
      <el-form ref="registrationForm" :model="registrationForm" :rules="rules">
        <el-form-item label="" required prop="identityCardNo">
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
            <el-form-item required prop="patientName">
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
            <el-form-item prop="age">
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
            <el-form-item prop="registrationCategory">
              <el-select
                v-model="registrationForm.registrationCategory"
                filterable
                placeholder="请选择"
                style="width:100%;"
              >
                <el-option label="普通挂号" value="普通挂号" />
                <el-option label="急诊挂号" value="急诊挂号" />
                <el-option label="专家挂号" value="专家挂号" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 普通或者城镇职工 -->
            <h4 style="margin-bottom:2px;">医疗类别</h4>
            <el-form-item prop="medicalCategory">
              <el-select
                v-model="registrationForm.medicalCategory"
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
            <el-form-item >
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
            <el-form-item prop="registrationDate">
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
            <el-form-item prop="registrationSource">
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
            <el-form-item prop="departmentId">
              <el-select
                v-model="registrationForm.departmentId"
                filterable
                placeholder="请选择"
                style="width:100%;"
                @change="departmentSelectionChange"
              >
                <el-option
                  v-for="item in departmentListOptions"
                  :key="item.departmentId"
                  :label="item.departmentName"
                  :value="item.departmentId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <h4 style="margin-bottom:2px;">看诊医生</h4>
            <el-form-item prop="doctorId">
              <!-- TODO -->
              <el-select
                v-model="registrationForm.doctorId"
                filterable
                placeholder="请选择"
                style="width:100%;"
                :disabled="boolDepartmentSelectionChange"
              >
                <el-option
                  v-for="item in doctorListOptions"
                  :key="item.doctorId"
                  :label="item.doctorName"
                  :value="item.doctorId"
                />
              </el-select>
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
              <el-input v-model="registrationForm.totalCharge" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="margin-top:80px;margin-bottom:40px;text-align:center">
          <el-button type="primary" @click="submitRegisterForm()">提交</el-button>
          <el-button type="info" @click="resetForm()">清空</el-button>
        </div>
      </el-form>
    </div>
  </div>

</template>

<script>
  import {
    fetchCurrentAvailableDoctor,
    fetchDepartment,
    fetchPatientInfoByIdentityCardNo,
    register
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
        departmentName: ''
      }],
      // 远程搜索的医生列表
      boolDepartmentSelectionChange: true,
      doctorListOptions: [{
        doctorId: '',
        doctorName: '',
      }],
      // 表单限制条件
      rules: {
        identityCardNo: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { min: 18, max: 18, message: '长度应为 18 个字符', trigger: 'blur' }
        ],
        patientName: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },
        ],
        registrationCategory: [
          { required: true, message: '请输入挂号类型', trigger: 'blur' },
        ],
        medicalCategory: [
          { required: true, message: '请输入医疗类别', trigger: 'blur' },
        ],
        settleAccountsCategory: [
          { required: true, message: '请输入结算类别', trigger: 'blur' },
        ],
        registrationDate: [
          { required: true, message: '请输入挂号日期', trigger: 'blur' },
        ],
        registrationSource: [
          { required: true, message: '请输入挂号来源', trigger: 'blur' },
        ],
        departmentId: [
          { required: true, message: '请输入挂号科室', trigger: 'blur' },
        ],
        doctorId: [
          { required: true, message: '请输入看诊医生', trigger: 'blur' },
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' },
        ],
      }
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
    this.invokeFetchDepartment()
  },
  methods: {
    // 根据身份证号搜索个人信息
    invokeFetchPatientInfoByIdentityCardNo(identityCardNo) {
      this.query = { 'identityCardNo': identityCardNo }
      // alert(identityCardNo)
      fetchPatientInfoByIdentityCardNo(this.query).then(response => { // 然后获取科室信息列表
        console.log('fetchPatientInfoByIdentityCardNo response: ')
        console.log(response)
        if (response.message === 'not found') {
          return
        } else {
          this.registrationForm.patientName = response.data.patientName
          this.registrationForm.gender = response.data.gender
          this.registrationForm.age = response.data.age
          this.registrationForm.birthday = new Date(response.data.birthDate.substring(0, 10))
          this.registrationForm.familyAddress = response.data.familyAddress
        }
      }).catch(error => {
        console.log('fetchPatientInfoByIdentityCardNo error: ')
        console.log(error)
      })
    },
    invokeFetchDepartment() {
      fetchDepartment().then(response => { // 然后获取科室信息列表
        console.log('fetchDepartment response: ')
        console.log(response)
        this.departmentListOptions = response.data
      }).catch(error => {
        console.log('fetchDepartment error: ')
        console.log(error)
      })
    },
    // 科室选择改变，医生列表改变，可以选择
    departmentSelectionChange(departmentIdOfDoctor) {
      this.boolDepartmentSelectionChange = false
      this.query = {'departmentId': departmentIdOfDoctor}
      fetchCurrentAvailableDoctor(this.query).then(response => { // 然后获取科室信息列表
        console.log('fetchCurrentAvailableDoctor response: ')
        console.log(response)
        this.doctorListOptions = response.data
      }).catch(error => {
        console.log('fetchCurrentAvailableDoctor error: ')
        console.log(error)
      })
    },
    // 提交挂号表单
    submitRegisterForm() {
      this.$refs['registrationForm'].validate((valid) => {
        if (valid) {
          console.log('register valid passed ')
          // date 格式化
          Date.prototype.Format = function (fmt) { 
              let o = {
                  "M+": this.getMonth() + 1, //月份
                  "d+": this.getDate(), //日
                  "h+": this.getHours(), //小时
                  "m+": this.getMinutes(), //分
                  "s+": this.getSeconds(), //秒
                  "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                  "S": this.getMilliseconds() //毫秒
              };
              if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
              for (let k in o)
                  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
              return fmt;
          };

          var query = {
            'registrationId': this.registrationForm.registrationId,
            'patientName': this.registrationForm.patientName,
            'gender': this.registrationForm.gender,
            'age': this.registrationForm.age,
            // format
            'birthday': this.registrationForm.birthday.Format("yyyy-MM-dd"),
            'registrationCategory': this.registrationForm.registrationCategory,
            'medicalCategory': this.registrationForm.medicalCategory,
            'identityCardNo': this.registrationForm.identityCardNo,
            'registrationStatus': this.registrationForm.registrationStatus,
            // 'visitDate': this.registrationForm.visitDate,
            // 1998-07-29 
            'registrationDate': this.registrationForm.registrationDate.Format("yyyy-MM-dd"),
            'departmentId': this.registrationForm.departmentId,
            'doctorId': this.registrationForm.doctorId,
            'registrationSource': this.registrationForm.registrationSource,
            'settleAccountsCategory': this.registrationForm.settleAccountsCategory,
            'isVisited': this.registrationForm.isVisited,
            'familyAddress': this.registrationForm.familyAddress,
            'collectorId': this.registrationForm.collectorId
          }
          register(query).then(response => {
            console.log('register response: ')
            console.log(response)
            
            this.$notify({
              title: '成功',
              message: '挂号成功',
              type: 'success'
            })
            this.resetForm()
            const { fullPath } = this.$route
            this.$router.replace({
              path: '/redirect' + "/registration/registrationListSearch"
            })
          }).catch(error => {
            console.log('register error: ')
            console.log(error)
            this.$notify.error({
              title: '错误',
              message: '挂号失败！'
            }); 
          })
        } else {
          console.log('error register!!')
          return
        }
      })      
    },
    // 清空表单
    resetForm() {
      this.registrationForm.identityCardNo = ''
      this.registrationForm.registrationId = ''
      this.registrationForm.patientName = ''
      this.registrationForm.gender = ''
      this.registrationForm.age = ''
      this.registrationForm.birthday = ''
      this.registrationForm.registrationCategory = ''
      this.registrationForm.medicalCategory = ''
      this.registrationForm.identityCardNo = ''
      this.registrationForm.registrationStatus = ''
      this.registrationForm.registrationDate = ''
      this.registrationForm.departmentId = ''
      this.registrationForm.doctorId = ''
      this.registrationForm.registrationSource = ''
      this.registrationForm.settleAccountsCategory = ''
      this.registrationForm.familyAddress = ''
      // this.registrationForm.collectorId = ''
      // this.registrationForm.totalCharge = ''
    },
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
