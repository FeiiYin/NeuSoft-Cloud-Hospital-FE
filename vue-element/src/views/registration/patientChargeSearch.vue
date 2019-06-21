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
                <el-date-picker type="date" placeholder="选择日期" v-model="endDate" style="width: 100%;"></el-date-picker>
            </el-col>
            <!-- <el-col :span="4.5" style="padding:5px;">
                <el-time-picker type="fixed-time" placeholder="选择时间" v-model="startTime" style="width: 100%;"></el-time-picker>
            </el-col> -->
            <el-col :span="3" style="padding-left:30px;padding-top:5px;">
                <el-button type="primary" style="float:right;" @click="invokeFetchChargeItemListWithRegistrationId">
                    <svg-icon icon-class="component" />
                    确认
                </el-button>
            </el-col>
            </el-row>
          </el-header>
          <el-main style="margin-top:60px;">
            <el-table :data="chargeFormTableList" style="width: 100%" v-loading="chargeFormTableLoading">
              <el-table-column  prop="chargeItemId" label="消费项目" sortable>
              </el-table-column>
              <el-table-column  prop="reserve1" label="规格" >
              </el-table-column>
              <el-table-column  prop="reserve2" label="单价" >
              </el-table-column>
              <el-table-column  prop="itemCount" label="数量" >
              </el-table-column>
              <el-table-column  prop="reserve1" label="单位" >
              </el-table-column>
              <el-table-column  prop="totalMoney" label="金额" >
              </el-table-column>
              <el-table-column  prop="departmentName" label="执行科室">
              </el-table-column>
              <el-table-column prop="valid" label="状态" fixed
                :filters="[{ text: '已缴费', value: '已缴费' }, { text: '未缴费', value: '未缴费' }]"
                :filter-method="filterTag"
                filter-placement="bottom-end">
                <template slot-scope="scope">
                  <el-tag
                    :type="scope.row.valid === '未缴费' ? 'primary' : 'success'"
                    close-transition>{{scope.row.valid}}
                  </el-tag>
                </template>
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
import {
  selectChargeForm,
} from '../../api/registrationCharge/chargeEntry'

import {
  fetchDepartmentList,
} from '../../api/basicInfo/department'

export default {
  data() {
    return {
      registrationId: '',
      chargeFormTableList: [],
      chargeFormTableLoading: false,
      departmentList: [],
      // 当前人员的起始日期与结束日期
      startDate: '',
      endDate: '',
      // 分页
      currentPage: 1,
      pageSize: 50,
      totalNumber: 0,
    }
  },
  created() {
    this.getDepartmentList()
  },
  methods: {
    // 根据 病历号 获取当前所有对应条目
    invokeFetchChargeItemListWithRegistrationId() {
      if (this.registrationId == '') {
        this.$message.error('未输入病历号，错误！')
        return
      }
      if (this.endDate < this.startDate) {
        this.$message.error('结束日期应当大于开始日期，错误！')
        return
      }
      this.chargeFormTableLoading = true;
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
      var query
      if (this.startDate == '' || this.endDate == '') {
        query = {
          'currentPage': this.currentPage, 
          'pageSize': this.pageSize,
          'registrationId' : this.registrationId, 
          'chargeFormCategory': 2
        }
      } else {
        query = {
          'currentPage': this.currentPage, 
          'pageSize': this.pageSize,
          'registrationId' : this.registrationId, 
          'startDate': this.startDate.Format("yyyy-MM-dd"),
          'endDate': this.endDate.Format("yyyy-MM-dd"),
          'chargeFormCategory': 2 // 全部支付
        }
      }      
      selectChargeForm(query).then(response => {
        this.chargeFormTableList = response.data.list
        for (var i = 0; i < this.chargeFormTableList.length; ++i) {
          this.chargeFormTableList[i].totalMoney = this.chargeFormTableList[i].itemCount * this.chargeFormTableList[i].reserve2
          this.chargeFormTableList[i].chargeItemId = this.chargeFormTableList[i].reserve3
          if (this.chargeFormTableList[i].unchargedNums == 0) {
            this.chargeFormTableList[i].valid = '已缴费'
          } else {
            this.chargeFormTableList[i].valid = '未缴费'
          }
          for (var j = 0; j < this.departmentList.length; ++j) {
            if (this.departmentList[j].departmentId == this.chargeFormTableList[i].departmentId)
              this.chargeFormTableList[i].departmentName = this.departmentList[j].departmentName
          }
        }
        this.totalNumber = response.data.total
        this.chargeFormTableLoading = false        
      }).catch(error => {
        console.log('selectChargeForm error: ')
        console.log(error)
      })
    },
    getDepartmentList() {
      var query = { 'currentPage': 1, 'pageSize': 400 }
      fetchDepartmentList(query).then(response => {
        console.log('fetchDepartmentList response: ')
        console.log(response)
        this.departmentList = response.data.list
      }).catch(error => {
        console.log('fetchDepartmentList error: ')
        console.log(error)
      })
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.invokeFetchChargeItemListWithRegistrationId()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.invokeFetchChargeItemListWithRegistrationId()
    },
    filterTag(value, row) {
      return row.valid === value;
    },
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
