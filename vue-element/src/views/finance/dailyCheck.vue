<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <aside>
          <span style="margin-left:30px;">门诊日结消息</span>
        </aside>

        <el-container>
          <el-header>
            <el-row :gutter="10">
              <el-col :sm="5" :md="3" :lg="3" :xl="1"><div style="padding:10px">
                <span>统计时间从</span>
              </div></el-col>
              <el-col :sm="5" :md="7" :lg="8" :xl="11"><div class="grid-content bg-purple-light">
                <el-date-picker v-model="startDate" type="date" placeholder="选择日期" style="width: 100%;" :disabled="true" />
              </div></el-col>
              <el-col :sm="5" :md="3" :lg="2" :xl="1"><div style="padding:10px;">
                <span>到</span>
              </div></el-col>
              <el-col :sm="5" :md="7" :lg="8" :xl="10"><div class="grid-content bg-purple">
                <el-date-picker v-model="startDate" type="date" placeholder="选择日期" style="width: 100%;" />
              </div></el-col>
              <el-col :sm="3" :md="4" :lg="3" :xl="1"><div>
                <el-button type="primary" style="float:right;" @click="true">
                  <svg-icon icon-class="component" />
                  日结
                </el-button>
              </div></el-col>
            </el-row>
          </el-header>
          <el-main>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 前置
      collectorId: 1,
      // 当前人员的起始日期与结束日期
      startDate: '',
      endDate: ''
    }
  },
  methods: {
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
