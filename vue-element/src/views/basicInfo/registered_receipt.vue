<template>
  <div>
    <el-button @click="doPrint('medicalRecordForm')">打印</el-button>
    <div id="subOutputRank-print">
      <el-row>
        <el-col :span="24"><h2 style="text-align: center">医疗单位挂号票据</h2></el-col>
      </el-row>
      <el-row>
        <el-col :span="18"><span>{{ '病历号：'+ registrationForm.registrationId }}</span></el-col>
        <el-col :span="6"><span>{{ '日期：'+ todayDate }}</span></el-col>
      </el-row>
      <hr>
      <el-row class="grid" style="margin-top: 10px">
        <el-col :span="6"><span>{{ '姓名：'+ registrationForm.patientName }}</span></el-col>
        <el-col :span="6"><span>{{ '性别：'+ registrationForm.gender }}</span></el-col>
        <el-col :span="6"><span>{{ '出生日期：'+ registrationForm.birthday }}</span></el-col>
        <el-col :span="6"><span>{{ '年龄：'+ registrationForm.age }}</span></el-col>
      </el-row>
      <el-row class="grid" style="margin-top: 10px">
        <el-col :span="6"><span>{{ '结算类别：'+ costType }}</span></el-col>
        <el-col :span="10"><span>{{ '身份证号：'+ registrationForm.identityCardNo }}</span></el-col>
      </el-row>
      <el-row class="grid" style="margin-top: 10px">
        <el-col><span>{{ '家庭住址：'+ registrationForm.familyAddress }}</span></el-col>
      </el-row>
      <el-row class="grid" style="margin-top: 10px">
        <el-col :span="6"><span>{{ '挂号级别：'+ registrationCategory }}</span></el-col>
        <el-col :span="6"><span>{{ '挂号科室：'+ registrationForm.departmentName }}</span></el-col>
        <el-col :span="6"><span>{{ '看诊医生：'+ registrationForm.doctorName }}</span></el-col>
        <el-col :span="6"><span>{{ '否要病历本：'+ ifMedicalHistory }}</span></el-col>
      </el-row>
      <hr>
      <el-row>
        <el-col :span="6"><span>{{ '应收金额：'+ 11 + '元' }}</span></el-col>
        <el-col :span="6"><span>{{ '合计大写：'+ chineseMoney }}</span></el-col>
        <el-col :span="6"><span>{{ '收费员编号：'+ registrationForm.collectorId }}</span></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sex: '男', // 必填
      name: '印飞', // 必填
      birthday: '1998-01-01',
      age: '21', // 出生日期和年龄二选一填
      costType: '自费', // 必填
      idNumber: '123456789987654321',
      address: '辽宁省沈阳市东北大学浑南校区',
      registrationCategory: '专家号', // 必填
      registrationDepartment: '外科', // 必填
      doctor: '蔡徐坤',
      ifMedicalHistory: '是', // 是否要病历本，要的话加一元，不要就不加钱
      money: '31', // 必填，自动计算
      chineseMoney: '拾壹元整', // 中文金额必填
      tollCollector: '苗华林', // 收费员
      registrationNumber: '00001', // 自动生成,
      registrationForm: {}
    }
  },
  created() {
    var temp = new Date()
    this.todayDate = temp.getFullYear() + '-' + (temp.getMonth() + 1) + '-' + temp.getDate()
    this.registrationForm = this.$route.query
    console.log(this.registrationForm)
    if (this.registrationForm.departmentName instanceof Array) {
      this.registrationForm.departmentName = this.registrationForm.departmentName[0]
    }
  },
  methods: {
    doPrint(e) {
      const subOutputRankPrint = document.getElementById('subOutputRank-print')
      console.log(subOutputRankPrint.innerHTML)
      const newContent = subOutputRankPrint.innerHTML
      const oldContent = document.body.innerHTML
      document.body.innerHTML = newContent
      window.print()
      window.location.reload()
      document.body.innerHTML = oldContent
      return false
    }
  }
}
</script>
<style>
  .grid {
    padding: 10px;
    height: 40px;
  }
</style>
