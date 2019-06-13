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
              <el-col :span="12">
                病历号
                <el-input
                  placeholder="请输入" suffix-icon="el-icon-search" v-model="registrationId">
                </el-input>
              </el-col>
            </el-row>
            <el-row>
            <el-col :span="2.2" style="padding:10px;">
                统计时间从
            </el-col>
            <el-col :span="4.5" style="padding:5px;">
                <el-date-picker type="date" placeholder="选择日期" v-model="startDate" style="width: 100%;" ></el-date-picker>
            </el-col>
            <el-col :span="4.5" style="padding:5px;">
                <el-time-picker type="fixed-time" placeholder="选择时间" v-model="startTime" style="width: 100%;" ></el-time-picker>
            </el-col>
            <el-col :span="0.8" style="padding:10px;">
                <span>到</span>                        
            </el-col>
            <el-col :span="4.5" style="padding:5px;">
                <el-date-picker type="date" placeholder="选择日期" v-model="startDate" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col :span="4.5" style="padding:5px;">
                <el-time-picker type="fixed-time" placeholder="选择时间" v-model="startTime" style="width: 100%;"></el-time-picker>
            </el-col>
            <el-col :span="3" style="padding-left:30px;padding-top:5px;">
                <el-button type="primary" v-on:click="true" style="float:right;">
                    <svg-icon icon-class="component" />
                    确认
                </el-button>
            </el-col>
            </el-row>
          </el-header>

          <el-main id="subOutputRank-print">
              
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
        // 左侧面板显示标识
        model_panel_show: false,
        // 左边表格内容，名称再改下吧
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
        }, {
          date: '2016-05-04',
          name: '王小虎',
        }, {
          date: '2016-05-01',
          name: '王小虎',
        }, {
          date: '2016-05-03',
          name: '王小虎',
        }],
        currentRow: null,
        // 当前人员的起始日期与结束日期
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: ''
    }
  },
  methods: {
    openModelPanel() {
        this.model_panel_show = ! this.model_panel_show;
    },
    setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
        this.currentRow = val;
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
