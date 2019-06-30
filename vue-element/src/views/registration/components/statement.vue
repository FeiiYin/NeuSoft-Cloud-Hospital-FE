<template>
  <div>
    <!-- <el-button @click="doPrint('medicalRecordForm')">预览</el-button> -->
    <div id="subOutputRank-print">
      <el-row style="margin-bottom: 0px">
        <el-col :span="24"><h2 style="text-align: center">医院门诊收费日结单</h2></el-col>
      </el-row>
      <el-row style="margin-bottom: 0px">
        <el-col :span="4" class="src_b"><span>{{ '日结时间范围' }}</span></el-col>
        <el-col :span="20" class="src_c" style="padding-left: 10px"><span>{{ document.previousDailySettlementDate+'--'+document.endDatetime }}</span></el-col>
      </el-row>
      <el-row style="margin-bottom: 0px">
        <el-col :span="4" class="src_b"><span>{{ '制表人' }}</span></el-col>
        <el-col :span="3" class="src_c" style="padding-left: 10px"><span>{{ document.collectorName }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ '收款员' }}</span></el-col>
        <el-col :span="9" class="src_c" style="padding-left: 10px"><span>{{ document.collectorName }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ '制表时间' }}</span></el-col>
        <el-col :span="4" class="src_c" style="padding-left: 10px"><span>{{ document.tabulationTime }}</span></el-col>
      </el-row>
      <el-row style="margin-bottom: 0px">
        <el-col :span="4" class="src_b"><span>{{ '起始发票号' }}</span></el-col>
        <el-col :span="14" class="src_c" style="padding-left: 10px"><span>{{ receiptNumber }}</span></el-col>
        <el-col :span="6" class="src_c" style="padding-left: 10px"><span>{{ '共计'+document.invoiceNums+'张' }}</span></el-col>
      </el-row>
      <el-row style="margin-bottom: 0px">
        <el-col :span="4" class="src_b"><span>{{ '发票汇总' }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ '总金额' }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ (document.invoiceTotalAmount).toFixed(2) }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ '自费金额' }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ (document.selfPay).toFixed(2) }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ '医保金额' }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ (document.accountPay).toFixed(2) }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ '报销金额' }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ (document.reimbursementPay).toFixed(2) }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ '优惠金额' }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ (document.discounted).toFixed(2) }}</span></el-col>
      </el-row>
      <el-row style="margin-bottom: 0px">
        <el-col :span="4" class="src_b"><span>{{ '药费' }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ '总金额' }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ (document.invoiceTotalAmount / 2.0).toFixed(2) }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ '西药费' }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ '/' }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ '中草药费' }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ '/' }}</span></el-col>
        <el-col :span="8" class="src_b"><span>{{ '/' }}</span></el-col>
      </el-row>
      <el-row style="margin-bottom: 0px">
        <el-col :span="4" class="src_b"><span>{{ '检查费' }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ '总金额' }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ (document.invoiceTotalAmount / 6.0).toFixed(2) }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ '验血费' }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ '/' }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ '验尿费' }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ '/' }}</span></el-col>
        <el-col :span="8" class="src_b"><span>{{ '/' }}</span></el-col>
      </el-row>
      <el-row style="margin-bottom: 0px">
        <el-col :span="4" class="src_b"><span>{{ '医疗费用' }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ '总金额' }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ (document.invoiceTotalAmount / 3.0).toFixed(2) }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ '挂号费' }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ (document.invoiceNums * 5).toFixed(2) }}</span></el-col>
        <el-col :span="12" class="src_b"><span>{{ '/' }}</span></el-col>
      </el-row>
      <el-row style="margin-bottom: 0px">
        <el-col :span="4" class="src_b"><span>{{ '共计金额' }}</span></el-col>
        <el-col :span="2" class="src_b"><span>{{ '大写' }}</span></el-col>
        <el-col :span="8" class="src_b"><span>{{ document.invoiceTotalAmountCapital }}</span></el-col>
        <el-col :span="10" class="src_b"><span>{{ '/' }}</span></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    document: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      beforeDate: '2019-01-01 09:15:49',
      afterDate: '2019-02-02 09:15:49',
      receiptNumber: '123456789',
      paperNumber: '1',
      lister: '印飞',
      cashier: '印飞',
      sumMoney: '120.97',
      personalPay: '41.76',
      selfPay: '0.00',
      Reimbursement: '0.00',
      discountedPrice: '79.21',
      medicineSumMoney: '30.74',
      westernMedicineFee: '22.02',
      chineseHerbalMedicineFee: '8.72',
      retain1: '0.00',
      retain2: '0.00',
      checkSumMoney: '49.21',
      bloodTestFee: '19.74',
      urineTestFee: '29.47',
      medicalSumMoney: '3.00',
      registrationFee: '3.00',
      chineseMoney: '捌拾贰点玖伍元',
      lowerCase: '82.95'
    }
  },
  created() {
    const temp = new Date()
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
  .src_b{
    border: 1px solid;
    padding: 10px;
    text-align: center;
  }
  .src_c{
    border: 1px solid;
    padding: 10px;
  }
</style>
