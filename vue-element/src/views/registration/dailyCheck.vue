<template>
  <div class="app-container">
    <el-container>
      <transition name="el-zoom-in-left">
        <el-aside v-show="model_panel_show" width="350px" style="padding:0">
          <aside>
            日结信息列表
          </aside>
          <!-- 单选表格 -->
          <el-table
            ref="singleTable"
            :data="tableData"
            highlight-current-row
            style="width: 100%"
            @current-change="handleCurrentChange"
          >
            <el-table-column type="index" />
            <el-table-column property="date" label="日期" />
            <el-table-column property="name" label="收款员" />
          </el-table>
          <div style="margin-top:20px;margin-bottom:20px;float:right;padding:1%;">
            <el-button @click="setCurrent()">取消选择</el-button>
            <el-button @click="true">
              <svg-icon icon-class="eye-open" />
              浏览
            </el-button>
          </div>
        </el-aside>
      </transition>

      <el-main>
        <aside>
          <el-button id="show_button" type="primary" @click="openModelPanel()">
            <i v-show="model_panel_show" class="el-icon-caret-left" />
            <i v-show="!model_panel_show" class="el-icon-caret-right" />
          </el-button>
          <span style="margin-left:30px;">门诊病历消息</span>

        </aside>

        <el-container>
          <el-header>
            <el-row>
              <el-col :span="2.2" style="padding:10px;">
                统计时间从
              </el-col>
              <el-col :span="4.5" style="padding:5px;">
                <el-date-picker v-model="startDate" type="date" placeholder="选择日期" style="width: 100%;" :disabled="true" />
              </el-col>
              <el-col :span="4.5" style="padding:5px;">
                <el-time-picker v-model="startTime" type="fixed-time" placeholder="选择时间" style="width: 100%;" :disabled="true" />
              </el-col>
              <el-col :span="0.8" style="padding:10px;">
                <span>到</span>
              </el-col>
              <el-col :span="4.5" style="padding:5px;">
                <el-date-picker v-model="startDate" type="date" placeholder="选择日期" style="width: 100%;" />
              </el-col>
              <el-col :span="4.5" style="padding:5px;">
                <el-time-picker v-model="startTime" type="fixed-time" placeholder="选择时间" style="width: 100%;" />
              </el-col>
              <el-col :span="3" style="padding-left:30px;padding-top:5px;">
                <el-button type="primary" style="float:right;" @click="true">
                  <svg-icon icon-class="component" />
                  确认
                </el-button>
              </el-col>
            </el-row>
          </el-header>

          <el-main id="subOutputRank-print" />

          <el-footer>Footer</el-footer>
        </el-container>
      </el-main>

    </el-container>
  </div>

</template>

<script>
import 'element-ui/lib/theme-chalk/base.css'

export default {
  data() {
    return {
      // 左侧面板显示标识
      model_panel_show: false,
      // 左边表格内容，名称再改下吧
      tableData: [{
        date: '2016-05-02',
        name: '王小虎'
      }, {
        date: '2016-05-04',
        name: '王小虎'
      }, {
        date: '2016-05-01',
        name: '王小虎'
      }, {
        date: '2016-05-03',
        name: '王小虎'
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
      this.model_panel_show = !this.model_panel_show
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row)
    },
    handleCurrentChange(val) {
      this.currentRow = val
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
