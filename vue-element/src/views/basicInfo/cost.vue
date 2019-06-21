<template>
  <div>
    <el-button @click="doPrint('medicalRecordForm')">预览</el-button>
    <div id="subOutputRank-print">
      <el-row>
        <el-col :span="24"><h2 style="text-align: center">医院收据</h2></el-col>
      </el-row>
      <el-row :gutter="40" style="margin-top: 10px">
        <el-col :span="10"><div class="block"><span>{{ '日期：'+todayDate }}</span></div></el-col>
        <el-col :span="10"><span>{{ '编号：xxxxxxxxx' }}</span></el-col>
      </el-row>
      <el-row :gutter="40" style="margin-top: 10px">
        <el-col :span="10"><span>{{ '姓名：'+name }}</span></el-col>
        <el-col :span="10"><span>{{ '结算方式：'+costType }}</span></el-col>
      </el-row>
      <el-row :gutter="50" style="margin-top: 10px" class="grid">
        <el-col :span="4"><span>{{ '药品项目' }}</span></el-col>
        <el-col :span="4"><span>{{ '金额(元)' }}</span></el-col>
        <el-col :span="4"><span>{{ '医疗项目' }}</span></el-col>
        <el-col :span="4"><span>{{ '金额(元)' }}</span></el-col>
        <el-col :span="4"><span>{{ '医疗项目' }}</span></el-col>
        <el-col :span="4"><span>{{ '金额(元)' }}</span></el-col>
      </el-row>
      <el-row :gutter="50" style="margin-top: 10px" class="grid_b">
        <el-col :span="4"><span>{{ '西药' }}</span></el-col>
        <el-col :span="4"><span>{{ westernMedicine }}</span></el-col>
        <el-col :span="4"><span>{{ '诊察费' }}</span></el-col>
        <el-col :span="4"><span>{{ medicalExaminationFee }}</span></el-col>
        <el-col :span="4"><span>{{ '治疗费' }}</span></el-col>
        <el-col :span="4"><span>{{ treatmentCosts }}</span></el-col>
      </el-row>
      <el-row :gutter="50" style="margin-top: 10px" class="grid_b">
        <el-col :span="4"><span>{{ '中成药' }}</span></el-col>
        <el-col :span="4"><span>{{ chinesePatentMedicine }}</span></el-col>
        <el-col :span="4"><span>{{ '急诊临时床位费' }}</span></el-col>
        <el-col :span="4"><span>{{ emergencyTemporaryBedFee }}</span></el-col>
        <el-col :span="4"><span>{{ '麻醉费' }}</span></el-col>
        <el-col :span="4"><span>{{ anesthesiaFee }}</span></el-col>
      </el-row>
      <el-row :gutter="50" style="margin-top: 10px" class="grid_b">
        <el-col :span="4"><span>{{ '中草药' }}</span></el-col>
        <el-col :span="4"><span>{{ chineseHerbalMedicine }}</span></el-col>
        <el-col :span="4"><span>{{ '检查费' }}</span></el-col>
        <el-col :span="4"><span>{{ checkFee }}</span></el-col>
        <el-col :span="4"><span>{{ '输氧费' }}</span></el-col>
        <el-col :span="4"><span>{{ oxygenDeliveryFee }}</span></el-col>
      </el-row>
      <el-row :gutter="50" style="margin-top: 10px" class="grid_b">
        <el-col :span="4"><span>{{ '材料费' }}</span></el-col>
        <el-col :span="4"><span>{{ materialFee }}</span></el-col>
        <el-col :span="4"><span>{{ 'CT' }}</span></el-col>
        <el-col :span="4"><span>{{ CT }}</span></el-col>
        <el-col :span="4"><span>{{ '输血费' }}</span></el-col>
        <el-col :span="4"><span>{{ bloodTransfusionFee }}</span></el-col>
      </el-row>
      <el-row :gutter="50" style="margin-top: 10px" class="grid_b">
        <el-col :span="4"><span>{{ '注射费' }}</span></el-col>
        <el-col :span="4"><span>{{ injectionFee }}</span></el-col>
        <el-col :span="4"><span>{{ 'MRI' }}</span></el-col>
        <el-col :span="4"><span>{{ MRI }}</span></el-col>
        <el-col :span="4"><span>{{ '手术费' }}</span></el-col>
        <el-col :span="4"><span>{{ surgeryFee }}</span></el-col>
      </el-row>
      <el-row :gutter="50" style="margin-top: 10px" class="grid_c">
        <el-col :span="4"><span>{{ '理疗费' }}</span></el-col>
        <el-col :span="4"><span>{{ physiotherapyFee }}</span></el-col>
        <el-col :span="4"><span>{{ '检验费' }}</span></el-col>
        <el-col :span="4"><span>{{ inspectionFee }}</span></el-col>
      </el-row>
      <el-row :gutter="40" class="grid_d">
        <el-col :span="10"><span>{{ '合计人民币（大写）：'+sumMoney }}</span></el-col>
        <el-col :span="10"><span>{{ '个人缴费金额：'+personalPay }}</span></el-col>
      </el-row>
      <el-row :gutter="50" class="grid_d">
        <el-col :span="7"><span>{{ '收费单位盖章' }}</span></el-col>
        <el-col :span="6"><span>{{ '医生：'+doctor }}</span></el-col>
        <el-col :span="6"><span>{{ '审核员：'+auditor }}</span></el-col>
        <el-col :span="5"><span>{{ '收费员：'+tollCollector }}</span></el-col>
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
      doctor: '叶毓鑫',
      auditor: '富润峰',
      tollCollector: '苗华林'
    }
  },
  created() {
    var temp = new Date()
    this.todayDate = temp.getFullYear() + '-' + (temp.getMonth() + 1) + '-' + temp.getDate()
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
