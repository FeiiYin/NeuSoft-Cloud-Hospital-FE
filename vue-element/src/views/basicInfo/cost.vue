<template>
  <div>
    <el-button @click="doPrint('medicalRecordForm')">预览</el-button>
    <div id="subOutputRank-print">
      <el-row>
        <el-col :span="24"><h2 style="text-align: center">医院收据</h2></el-col>
      </el-row>
      <el-row :gutter="40" style="margin-top: 10px">
        <el-col :span="10"><div class="block"><span>{{ '日期：'+todayDate }}</span></div></el-col>
        <el-col :span="10"><span>{{ '编号：' + query.registrationId }}</span></el-col>
      </el-row>
      <el-row :gutter="50" style="margin-top: 10px" class="grid">
        <el-col :span="6"><span>{{ '项目名称' }}</span></el-col>
        <el-col :span="6"><span>{{ '单价金额(元)' }}</span></el-col>
        <el-col :span="6"><span>{{ '项目数量' }}</span></el-col>
        <el-col :span="6"><span>{{ '总金额(元)' }}</span></el-col>
      </el-row>
      <el-row v-for="(item, i) in query.namelist" :key="i" :gutter="50" style="margin-top: 10px" class="grid_b">
        <el-col :span="6"><span>{{ item }}</span></el-col>
        <el-col :span="6"><span>{{ query.pricelist[i] }}</span></el-col>
        <el-col :span="6"><span>{{ query.numlist[i] }}</span></el-col>
        <el-col :span="6"><span>{{ (query.numlist[i] * query.pricelist[i]).toFixed(2) }}</span></el-col>
      </el-row>
      <el-row :gutter="40" class="grid_d">
        <el-col :span="10"><span>{{ '合计人民币（大写）：'+ sumMoney }}</span></el-col>
        <el-col :span="10"><span>{{ '个人缴费金额：'+personalPay }}</span></el-col>
      </el-row>
      <el-row :gutter="50" class="grid_d">
        <el-col :span="12"><span>{{ '收费单位盖章' }}</span></el-col>
        <el-col :span="12"><span>{{ '医生签字：'+doctor }}</span></el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <h3 style="text-align: center">温馨提示</h3>
        </el-col>
      </el-row>
      <el-row>
        <el-col><span>{{ '1、用药前请仔细阅读药品说明书，并严格按医嘱用药。' }}</span></el-col>
        <el-col style="margin-top: 5px"><span>{{ '2、为保证您及其他患者的用药安全，国家卫生部《医疗机构药事管理暂行规定》要求，药品一经发出，不得退换。' }}</span></el-col>
        <el-col style="margin-top: 5px"><span>{{ '3、请严格按照药品说明书规定的贮存条件保持药品，发现变质或过期，不可使用。' }}</span></el-col>
        <el-col style="margin-top: 5px"><span>{{ '4、临床药师：024-88888888，门诊药房：024-77777777，总机：024-11111111' }}</span></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '印飞',
      costType: '支付宝',
      westernMedicine: '10',
      medicalExaminationFee: '10',
      treatmentCosts: '10',
      chinesePatentMedicine: '10',
      emergencyTemporaryBedFee: '10',
      anesthesiaFee: '10',
      chineseHerbalMedicine: '10',
      checkFee: '10',
      oxygenDeliveryFee: '10',
      materialFee: '10',
      CT: '10',
      bloodTransfusionFee: '10',
      injectionFee: '10',
      MRI: '10',
      surgeryFee: '10',
      physiotherapyFee: '10',
      inspectionFee: '10',
      sumMoney: '壹佰柒拾元整',
      personalPay: '伍拾元整',
      doctor: '',
      auditor: '富润峰',
      tollCollector: '苗华林',
      query: {}
    }
  },
  created() {
    var temp = new Date()
    this.todayDate = temp.getFullYear() + '-' + (temp.getMonth() + 1) + '-' + temp.getDate()
    this.query = this.$route.query
    console.log(this.query)
    this.sumMoney = 0
    for (var i = 0; i < this.query.numlist.length; ++i) {
      this.sumMoney += this.query.numlist[i] * this.query.pricelist[i]
    }
    this.sumMoney = this.sumMoney.toFixed(2)
    this.personalPay = this.sumMoney
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
    border: 1px solid;
    text-align: center;
    padding: 10px;
    height: 40px;
  }
  .grid_b {
    text-align: center;
    padding: 10px;
    height: 40px;
  }
  .grid_c {
    text-align: center;
    padding: 10px;
    height: 40px;
    border-bottom: 1px solid;
  }
  .grid_d {
    padding: 10px;
    height: 40px;
  }
</style>
