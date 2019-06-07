<template>
  <div class="app-container">
    <aside>
      <span>当前挂号信息列表</span>
      <el-button type="info" style="float:right">
        <i class="el-icon-refresh" />
        刷新
      </el-button>
    </aside>

    <div style="padding:1%" class="bg-purple-light">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6"><div class="grid-content bg-purple-light">
            <el-form-item label="病历号">
              <el-input v-model="form.ID" clearable />
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input v-model="form.peopleID" :disabled="true" />
            </el-form-item>
          </div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light">
            <el-form-item label="姓名">
              <el-input v-model="form.name" :disabled="true" />
            </el-form-item>
            <el-form-item label="结算类别">
              <el-input v-model="form.type" :disabled="true" />
            </el-form-item>
          </div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light">
            <el-form-item label="性别">
              <el-input v-model="form.sex" :disabled="true" />
            </el-form-item>
            <el-form-item label="医疗科室">
              <el-input v-model="form.room" :disabled="true" />
            </el-form-item>
          </div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light">
            <el-form-item label="年龄">
              <el-input v-model="form.ege" :disabled="true" />
            </el-form-item>
            <el-form-item label="开单医生">
              <el-input v-model="form.doctor" :disabled="true" />
            </el-form-item>
          </div></el-col>
        </el-row>
      </el-form>
    </div>

    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="date"
        label="日期"
        sortable
        width="180"
      />
      <el-table-column
        prop="name"
        label="姓名"
        width="180"
      />
      <el-table-column
        prop="address"
        label="地址"
        :formatter="formatter"
      />
      <el-table-column
        prop="tag"
        label="标签"
        width="100"
        :filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.tag === '家' ? 'primary' : 'success'"
            close-transition
          >{{ scope.row.tag }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <aside style="height:60px;">
      <span>总共金额： </span>
      <el-input v-model="total_money" :disabled="true" style="width:20%" />

      <el-button type="info" style="float:right">
        <i class="el-icon-printer" />
        打印发票
      </el-button>
      <el-button
        type="info"
        style="float:right;margin-right:20px;"
        @click="dialogFormVisible=true"
      >
        <svg-icon icon-class="money" />
        交费
      </el-button>
    </aside>
    <!-- 缴费对话框 -->
    <el-dialog title="缴费" :visible.sync="dialogFormVisible">
      <el-form :model="charge_form">
        <el-form-item label="应收金额">
          <el-input v-model="charge_form.should_charge" :disabled="true" />
        </el-form-item>
        <el-form-item label="实收金额">
          <el-input v-model="charge_form.actual_charge" />
        </el-form-item>
        <el-form-item label="实际找零">
          <el-input v-model="charge_form.actual_exchange" :disabled="true" />
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="charge()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 提交病历号，查询其他字段
      form: {
        id: '',
        name: '',
        sex: '',
        age: '',
        peopleID: '',
        doctor: '',
        type: '',
        room: ''
      },
      // 总共金额
      total_money: '600.00',
      // 充值金额
      charge_form: {
        should_charge: '',
        actual_charge: '',
        actual_exchange: ''
      },
      // 选择支付方式
      options: [{
        value: '选项1',
        label: '支付宝'
      }, {
        value: '选项2',
        label: '微信'
      }, {
        value: '选项3',
        label: '银行卡'
      }, {
        value: '选项4',
        label: '现金'
      }, {
        value: '选项5',
        label: '医保'
      }],
      value: '',
      // 弹出框
      dialogFormVisible: false,
      // 临时表数据
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        tag: '家'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        tag: '公司'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        tag: '家'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
        tag: '公司'
      }]
    }
  },
  methods: {
    formatter(row, column) {
      return row.address
    },
    filterTag(value, row) {
      return row.tag === value
    },
    charge() {
      this.dialogFormVisible = false
      this.$notify({
        title: '成功',
        message: '支付成功',
        type: 'success'
      })
    }
  }
}
</script>

<style>
  .el-row {
    margin-bottom: 20px;
    /* &:last-child {
      margin-bottom: 0;
    } */
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .half-height {
    height: 50%;
  }
</style>
