<template>
  <div class="app-container">
    <el-container>
        <transition name="el-zoom-in-left">
            <el-aside width="350px" style="padding:0" v-show="model_panel_show">
                <el-collapse v-model="activeName" accordion>
                <el-collapse-item title="一致性 Consistency" name="1">
                    <div @click="show_medical_record(1)">与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                </el-collapse-item>
                <el-collapse-item title="反馈 Feedback" name="2">
                    <div @click="show_medical_record(2)">控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                    <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
                </el-collapse-item>
                </el-collapse>
            </el-aside>
        </transition>
        <el-main>
            <aside>
              <el-button type="primary" id="show_button" v-on:click="openModelPanel()">
                  <i class="el-icon-caret-left" v-show="model_panel_show"/>
                  <i class="el-icon-caret-right" v-show="!model_panel_show"/>
              </el-button>
              <span style="margin-left:30px;">门诊病历消息</span>

              <el-button type="primary" id="show_button" v-on:click="right_model_panel_show=!right_model_panel_show"
                  style="float:right">
                  <i class="el-icon-caret-left" v-show="!right_model_panel_show"/>
                  <i class="el-icon-caret-right" v-show="right_model_panel_show"/>
              </el-button>
            </aside>
            <!-- model div 1 -->
            <!-- <el-container v-show="model_array[0]"> -->
            <el-container v-show="model_array==1" >
              <el-header>Header</el-header>
              <el-main id="subOutputRank-print">
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <h3>
                      病史内容
                    </h3>
                    <el-form-item label="主诉" prop="name">
                      <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="现病史" prop="name">
                      <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="既往史" prop="name">
                      <el-input v-model="ruleForm.name" type="textarea" :rows="4"></el-input>
                    </el-form-item>
                    <el-form-item label="个人史" prop="name">
                      <el-input v-model="ruleForm.name" type="textarea" :rows="4"></el-input>
                    </el-form-item>

                    <el-form-item label="活动区域" prop="region">
                      <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="活动时间" required>
                      <el-col :span="11">
                        <el-form-item prop="date1">
                          <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="11">
                        
                      </el-col>
                    </el-form-item>
                    <el-form-item label="即时配送" prop="delivery">
                      <el-switch v-model="ruleForm.delivery"></el-switch>
                    </el-form-item>
                    <el-form-item label="活动性质" prop="type">
                      <el-checkbox-group v-model="ruleForm.type">
                        <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                        <el-checkbox label="地推活动" name="type"></el-checkbox>
                        <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                        <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="特殊资源" prop="resource">
                      <el-radio-group v-model="ruleForm.resource">
                        <el-radio label="线上品牌商赞助"></el-radio>
                        <el-radio label="线下场地免费"></el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="活动形式" prop="desc">
                      <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                      <el-button @click="resetForm('ruleForm')">重置</el-button>
                      <el-button @click="resetForm('ruleForm')">存储</el-button>
                      <el-button @click="doPrint('ruleForm')">预览</el-button>
                    </el-form-item>
                  </el-form>
              </el-main>
              <el-footer>Footer</el-footer>
            </el-container>
            <!-- model div 2 -->
            <!-- <el-container v-show="model_array[1]"> -->
            <el-container v-show="model_array==2">
              <el-header>Header</el-header>
              <el-main>Main 2222</el-main>
              <el-footer>Footer</el-footer>
            </el-container>
        </el-main>

        <transition name="el-zoom-in-left">
        <el-aside width="350px" style="padding:0" v-show="right_model_panel_show">
            <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="一致性 Consistency" name="1">
                <div >与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
            </el-collapse-item>
            <el-collapse-item title="反馈 Feedback" name="2">
                <div >控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
            </el-collapse-item>
            </el-collapse>
        </el-aside>
        </transition>
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
        model_panel_show: false,
        right_model_panel_show: false,
        activeName: '1',
        model_array: 1,

        ruleForm: {
          name: '',
          region: '',
          date1: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        }
    }
  },
  methods: {
    openModelPanel() {
        this.model_panel_show = ! this.model_panel_show;
    },
    show_medical_record (num) {
        this.model_array = num;
        this.$notify({
          title: '切换成功',
          message: '切换面板成功',
          type: 'success'
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    doPrint(e){
        let subOutputRankPrint = document.getElementById('subOutputRank-print');
        console.log(subOutputRankPrint.innerHTML);
        let newContent =subOutputRankPrint.innerHTML;
        let oldContent = document.body.innerHTML;
        document.body.innerHTML = newContent;
        window.print();
        window.location.reload();
        document.body.innerHTML = oldContent;
        return false;
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
