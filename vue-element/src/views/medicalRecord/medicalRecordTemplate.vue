<template>
  <div class="app-container">
    <el-container>
      <transition name="el-zoom-in-left">
        <div v-show="model_panel_show" width="width:500px;padding:0;background:#eef1f6">
          <div style="width:500px;">
            <el-aside style="background:#eef1f6;width:500px">
              病历模板
            </el-aside>
            <el-tree
              :data="medicalRecordTemplateTreeData"
              :props="defaultProps"
              accordion
              @node-click="handleNodeClick"
            />
          </div>
        </div>
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
          <el-main id="subOutputRank-print">
            <h3>
              病历内容模板
            </h3>
            <el-form ref="medicalRecordForm" :model="medicalRecordForm" :rules="rules" label-width="100px">
              <el-form-item label="模板编号" prop="medicalRecordsId">
                <el-input v-model="medicalRecordForm.medicalRecordsId" :disabled="true" style="width:86%" />
                <el-button type="primary" plain style="float:right" @click="medicalRecordForm.medicalRecordsId=''"><i class="el-icon-refresh" /></el-button>
              </el-form-item>
              <el-form-item label="模板名称" prop="templateName">
                <el-input v-model="medicalRecordForm.templateName" />
              </el-form-item>
              <el-form-item label="主诉" prop="mainInfo">
                <el-input v-model="medicalRecordForm.mainInfo" />
              </el-form-item>
              <el-form-item label="现病史" prop="currentDisease">
                <el-input v-model="medicalRecordForm.currentDisease" />
              </el-form-item>
              <el-form-item label="既往史" prop="pastDisease">
                <el-input v-model="medicalRecordForm.pastDisease" type="textarea" :rows="4" />
              </el-form-item>
              <el-form-item label="体格检查" prop="physicalExam">
                <el-input v-model="medicalRecordForm.physicalExam" type="textarea" :rows="4" />
              </el-form-item>
              <el-form-item label="辅助检查" prop="auxiliaryExam">
                <el-input v-model="medicalRecordForm.auxiliaryExam" type="textarea" :rows="4" />
              </el-form-item>
              <el-form-item label="处理意见" prop="opinion">
                <el-input v-model="medicalRecordForm.opinion" />
              </el-form-item>
              <el-form-item label="模板类别" prop="saveState">
                <el-select v-model="medicalRecordForm.saveState" placeholder="请选择">
                  <el-option
                    v-for="item in templateCategory"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-form>

            <!-- 全局按钮 -->
            <div style="text-align:center;margin-top:40px;">
              <el-button type="primary" @click="true">删除模板</el-button>
              <el-button type="primary" plain @click="saveCurrentIntoTemplate">保存当前</el-button>
            </div>
          </el-main>
        </el-container>
      </el-main>

      <!--模板的对话框-->
      <el-dialog title="模板预览" :visible.sync="modelDialogVisible" width="30%">
        <el-form ref="modelForm" :model="modelForm" :rules="templateRules">

          <el-form-item label="模板名称" prop="templateName">
            <el-input v-model="modelForm.templateName" :disabled="modelDialogEditable" />
          </el-form-item>
          <el-form-item label="主诉" prop="mainInfo">
            <el-input v-model="modelForm.mainInfo" :disabled="modelDialogEditable" />
          </el-form-item>
          <el-form-item label="现病史" prop="currentDisease">
            <el-input v-model="modelForm.currentDisease" :disabled="modelDialogEditable" />
          </el-form-item>
          <el-form-item label="既往史" prop="pastDisease">
            <el-input v-model="modelForm.pastDisease" type="textarea" :rows="2" :disabled="modelDialogEditable" />
          </el-form-item>
          <el-form-item label="体格检查" prop="physicalExam">
            <el-input v-model="modelForm.physicalExam" type="textarea" :rows="2" :disabled="modelDialogEditable" />
          </el-form-item>
          <el-form-item label="辅助检查" prop="auxiliaryExam">
            <el-input v-model="modelForm.auxiliaryExam" type="textarea" :rows="2" :disabled="modelDialogEditable" />
          </el-form-item>
          <el-form-item label="处理意见" prop="opinion">
            <el-input v-model="modelForm.opinion" :disabled="modelDialogEditable" />
          </el-form-item>
          <el-form-item label="模板类别" prop="saveState">
            <el-select v-model="modelForm.saveState" placeholder="请选择" :disabled="modelDialogEditable">
              <el-option
                v-for="item in templateCategory"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modelDialogVisible = false">取 消</el-button>
          <el-button v-show="modelDialogEditable" type="primary" @click="useTemplate()">修改模板</el-button>
          <el-button v-show="!modelDialogEditable" type="primary" @click="saveCurrentIntoTemplate()">保存模板</el-button>
        </span>
      </el-dialog>
    </el-container>
  </div>

</template>

<script>
import 'element-ui/lib/theme-chalk/base.css'
// collapse 展开折叠
import Vue from 'vue'
// 可编辑table使用
// table used
import { Editable, EditableColumn } from 'vue-element-extends'
import 'vue-element-extends/lib/index.css'

import {
  selectMedicalRecordsTemplateList
} from '../../api/medicalRecord/medicalRecord'

Vue.use(Editable)
Vue.use(EditableColumn)
Vue.component('ElxEditable', Editable)
Vue.component('ElxEditableColumn', EditableColumn)

export default {
  data() {
    return {
      // 当前医生Id
      doctorId: 1,
      registrationId: 1,
      // 模板左侧是否显示
      model_panel_show: false,
      // 提交表单
      medicalRecordForm: {
        medicalRecordsId: '',
        registrationId: 1, // 挂号单编号
        doctorId: '', // 医生id，应当从 登录用户获取
        mainInfo: '', // 主诉
        currentDisease: '', // 现病史
        pastDisease: '', // 既往史
        physicalExam: '', // 体格检查
        auxiliaryExam: '', // 辅助检查
        opinion: '', // 处理意见
        saveState: '', // 保存状态（暂存0 正式提交1）
        disease: [{
          diseaseId: '', // 诊断目录中的编号
          suspect: '', // 疑似（是1 否0）
          incidenceDate: '' // 发病日期
        }] // 评估/诊断（JSONArray）
      },
      rules: {
        templateName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        mainInfo: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        currentDisease: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        pastDisease: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        physicalExam: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        auxiliaryExam: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        opinion: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        saveState: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      },
      templateRules: {
        templateName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        saveState: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      },

      formLabelWidth: '120px',

      // 模板的树形目录
      medicalRecordTemplateTreeData: [
        {
          label: '全院',
          children: []
        }, {
          label: '科室',
          children: []
        }, {
          label: '个人',
          children: []
        }
      ],
      medicalRecordTemplateTreeDirectory: 0,
      medicalRecordTemplateData: [],
      // 树形列表的类名
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 模板的对话框
      modelDialogVisible: false,
      modelDialogEditable: false,
      modelForm: {
        name: '',
        saveState: ''
      },
      templateCategory: [{
        value: '2',
        label: '全院模板'
      }, {
        value: '3',
        label: '科室模板'
      }, {
        value: '4',
        label: '个人模板'
      }]
    }
  },
  created() {
    this.invokeSelectMedicalRecordsTemplateList()
  },
  methods: {
    openModelPanel() {
      this.model_panel_show = !this.model_panel_show
    },
    // 树形目录检测
    handleNodeClick(data) {
      console.log(data)
      if (data.label === '全院') {
        this.medicalRecordTemplateTreeDirectory = 0
        return
      }
      if (data.label === '科室') {
        this.medicalRecordTemplateTreeDirectory = 1
        return
      }
      if (data.label === '个人') {
        this.medicalRecordTemplateTreeDirectory = 2
        return
      }
      var now = this.medicalRecordTemplateTreeDirectory
      // console.log('this directory'+this.medicalRecordTemplateTreeDirectory)
      // console.log(data.label)
      for (var i = 0; i < this.medicalRecordTemplateData[now].length; ++i) {
        // console.log(this.medicalRecordTemplateData[now][i].templateName)
        if (this.medicalRecordTemplateData[now][i].templateName === data.label) {
          console.log(this.medicalRecordTemplateData[now][i])
          // this.modelDialogVisible = true
          // this.modelDialogEditable = true
          // problem init
          // this.modelForm = this.medicalRecordTemplateData[now][i]
          this.medicalRecordForm.medicalRecordsId = this.medicalRecordTemplateData[now][i].medicalRecordsId
          this.medicalRecordForm.mainInfo = this.medicalRecordTemplateData[now][i].mainInfo
          this.medicalRecordForm.currentDisease = this.medicalRecordTemplateData[now][i].currentDisease
          this.medicalRecordForm.pastDisease = this.medicalRecordTemplateData[now][i].pastDisease
          this.medicalRecordForm.physicalExam = this.medicalRecordTemplateData[now][i].physicalExam
          this.medicalRecordForm.auxiliaryExam = this.medicalRecordTemplateData[now][i].auxiliaryExam
          this.medicalRecordForm.opinion = this.medicalRecordTemplateData[now][i].opinion

          // 双向绑定问题
          // JSON.parse(JSON.stringify(this.temp1));
          this.medicalRecordForm.templateName = this.medicalRecordTemplateData[now][i].templateName
          // this.modelForm.saveState = this.medicalRecordTemplateData[now][i].saveState
          if (this.medicalRecordTemplateTreeDirectory === 0) { this.medicalRecordForm.saveState = '全院模板' } else if (this.medicalRecordTemplateTreeDirectory === 1) { this.medicalRecordForm.saveState = '科室模板' } else { this.medicalRecordForm.saveState = '个人模板' }
          break
        }
      }
    },
    // 获取疾病模板
    invokeSelectMedicalRecordsTemplateList() {
      this.medicalRecordTemplateTreeData = [
        {
          label: '全院',
          children: []
        }, {
          label: '科室',
          children: []
        }, {
          label: '个人',
          children: []
        }]
      var query = {
        'templateScope': 2,
        'doctorId': this.doctorId
      }
      this.medicalRecordTemplateData = []
      // 必须嵌套写，否则是异步调用，可能数组的push顺序不一样，会有很大的问题
      // 全院
      selectMedicalRecordsTemplateList(query).then(response => {
        // console.log(response)
        this.medicalRecordTemplateData.push(response.data)
        for (var i = 0; i < response.data.length; ++i) {
          this.medicalRecordTemplateTreeData[0].children.push({ 'label': response.data[i].templateName })
        }
        // 科室
        query.templateScope = 3
        selectMedicalRecordsTemplateList(query).then(response => {
          // console.log(response)
          this.medicalRecordTemplateData.push(response.data)
          for (var i = 0; i < response.data.length; ++i) {
            this.medicalRecordTemplateTreeData[1].children.push({ 'label': response.data[i].templateName })
          }
          // 个人
          query.templateScope = 4
          selectMedicalRecordsTemplateList(query).then(response => {
            console.log('template response')
            console.log(response)
            this.medicalRecordTemplateData.push(response.data)
            for (var i = 0; i < response.data.length; ++i) {
              this.medicalRecordTemplateTreeData[2].children.push({ 'label': response.data[i].templateName })
            }
          })
        })
      })
    },
    // 将当前的病历存储为模板
    invokeSaveCurrentIntoTemplate() {
      this.$refs['medicalRecordForm'].validate((valid) => {
        if (valid) {
          this.modelDialogVisible = true
          this.modelDialogEditable = false
          this.modelForm = this.medicalRecordForm
          // this.modelForm.doctorId = this.doctorId
          // this.modelForm.mainInfo = this.medicalRecordForm.mainInfo
          // this.modelForm.currentDisease = this.medicalRecordForm.currentDisease
          // this.modelForm.pastDisease = this.medicalRecordForm.pastDisease
          // this.modelForm.physicalExam = this.medicalRecordForm.physicalExam
          // this.modelForm.auxiliaryExam = this.medicalRecordForm.auxiliaryExam
          // this.modelForm.opinion = this.medicalRecordForm.opinion
          // this.modelForm.saveState = ''
          // this.modelForm.templateName = ''
          // this.modelForm.medicalRecordsId = ''
          // saveMedicalRecordAsTemplate()
        }
      })
    },
    saveCurrentIntoTemplate() {
      this.$refs['medicalRecordForm'].validate((valid) => {
        if (valid) {
          this.medicalRecordForm.doctorId = this.doctorId
          if (this.medicalRecordForm.saveState === '全院模板') {
            this.medicalRecordForm.saveState = 2
          } else if (this.medicalRecordForm.saveState === '科室模板') {
            this.medicalRecordForm.saveState = 3
          } else {
            this.medicalRecordForm.saveState = 4
          }
          var query = this.medicalRecordForm

          console.log('template query: ')
          console.log(query)
          // saveMedicalRecordAsTemplate(query).then(response => {
          //   this.medicalRecordForm = {}
          //   this.invokeSelectMedicalRecordsTemplateList()
          // }).catch(error => {
          //   console.log('saveMedicalRecordAsTemplate error: ')
          //   console.log(error)
          // })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
