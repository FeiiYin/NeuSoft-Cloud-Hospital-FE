<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <aside>
          <span>患者费用查询</span>
        </aside>            
        <el-container>
          <el-header>
            <el-row>
              <el-col :span="2" style="padding:10px;">
                病历号
              </el-col>
              <el-col :span="22">                
                <el-input
                  placeholder="请输入" suffix-icon="el-icon-search" v-model="registrationId"  >
                </el-input>
              </el-col>
            </el-row>
            <el-row>
            <el-col :span="2.2" style="padding:10px;">
              统计时间从
            </el-col>
            <el-col :span="9" style="padding:5px;">
                <el-date-picker type="date" placeholder="选择日期" v-model="startDate" style="width: 100%;" ></el-date-picker>
            </el-col>
            <!-- <el-col :span="4.5" style="padding:5px;">
                <el-time-picker type="fixed-time" placeholder="选择时间" v-model="startTime" style="width: 100%;" ></el-time-picker>
            </el-col> -->
            <el-col :span="0.8" style="padding:10px;">
                <span>到</span>                        
            </el-col>
            <el-col :span="9" style="padding:5px;">
                <el-date-picker type="date" placeholder="选择日期" v-model="startDate" style="width: 100%;"></el-date-picker>
            </el-col>
            <!-- <el-col :span="4.5" style="padding:5px;">
                <el-time-picker type="fixed-time" placeholder="选择时间" v-model="startTime" style="width: 100%;"></el-time-picker>
            </el-col> -->
            <el-col :span="3" style="padding-left:30px;padding-top:5px;">
                <el-button type="primary" v-on:click="true" style="float:right;">
                    <svg-icon icon-class="component" />
                    确认
                </el-button>
            </el-col>
            </el-row>
          </el-header>
          <el-main style="margin-top:60px;">
            <el-table :data="chargeForm" style="width: 100%" 
              @selection-change="handleSelectionChange" v-loading="chargeFormTableLoading">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column  prop="chargeItemId" label="消费项目" sortable>
              </el-table-column>
              <el-table-column  prop="chargeItemId" label="规格" >
              </el-table-column>
              <el-table-column  prop="chargeItemId" label="单价" >
              </el-table-column>
              <el-table-column  prop="chargeItemId" label="数量" >
              </el-table-column>
              <el-table-column  prop="chargeItemId" label="单位" >
              </el-table-column>
              <el-table-column  prop="chargeItemId" label="金额" >
              </el-table-column>
              <el-table-column  prop="chargeItemId" label="执行科室">
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div style="background: #d3dce6;">
              <el-pagination
                :current-page="currentPage"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalNumber"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/base.css';
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import Vue from 'vue'
import ThemePicker from '@/components/ThemePicker'

export default {
  components: { ThemePicker },
  data() {
    return {
      registrationId: '',
      // 病历号查询消费项目列表
      chargeForm: {
        chargeFormId: '',
        registrationId: '',
        chargeItemId: '',
        itemCount: '',
        unchargedNums: '',
        madeTime: '',
        valid: '',
        departmentId: '',
        doctorId: '',
        collectorId: '',
        notGivenNums: '',
      },  
      multipleSelectionChargeFormTable: [],
      chargeFormTableLoading: false,
      // 当前人员的起始日期与结束日期
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      // 分页
      currentPage: 1,
      pageSize: 50,
      totalNumber: 0,
    }
  },
  methods: {
    // 根据 病历号 获取当前所有对应条目
    // TODO
    invokeFetchChargeItemListWithRegistrationId() {
      this.chargeFormTableLoading = true;
      var query = {
        'currentPage': this.currentPage, 
        'pageSize': this.pageSize,
        'registrationId' : this.registrationForm.registrationId, 
        'startDate': this.startDate,
        'endDate': this.endDate,
      }
      selectChargeForm(query).then(response => {
        console.log('selectChargeForm response: ')
        console.log(response)
        this.registrationList = response.data.list
        this.totalNumber = response.data.total     
        this.chargeFormTableLoading = false
      }).catch(error => {
        console.log('selectChargeForm error: ')
        console.log(error)
      })
    },
    openModelPanel() {
        this.model_panel_show = ! this.model_panel_show;
    },
    setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row);
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      // this.invokeFetchChargeItemListWithRegistrationId()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      // this.invokeFetchChargeItemListWithRegistrationId()
    },
    // 表的多级选择
    handleSelectionChange(val) {
      this.multipleSelectionChargeFormTable = val
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }
}
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
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
</style>
