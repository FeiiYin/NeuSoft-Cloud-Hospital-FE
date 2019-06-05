<template>
  <div class="app-container">
    <el-container>
        <el-main>
            <aside>
              <span style="margin-left:30px;">门诊诊断</span>
              <span style="margin-left:30px;">这里是前面传过来的</span>
            </aside>
            <!-- model div 1 -->
            <!-- <el-container v-show="model_array[0]"> -->
            <el-container >
              <el-header>
                    <span style="margin-left:30px;">处方类型</span>
                    <el-select v-model="value8" filterable placeholder="从上面传过来" style="margin-left:30px;">
                        <el-option  v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <span style="margin-left:30px;">处方金额</span>
                    <el-input placeholder="请输入内容" v-model="input1" :disabled="true" style="width:30%;margin-left:30px;">
                    </el-input>
              </el-header>
              <el-main id="subOutputRank-print">
                  
              </el-main>
              <el-footer>Footer</el-footer>
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
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value8: '',
        input1: 1300
    }
  },
  methods: {
        handleCommand(command) {
            this.$message('click on item ' + command);
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
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
