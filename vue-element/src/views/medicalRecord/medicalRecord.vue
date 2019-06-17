<template>
  <div class="app-container">
    <el-container>
      <transition name="el-zoom-in-left">
        <div v-show="model_panel_show" width="width:500px;padding:0;background:#eef1f6">
          <el-collapse v-model="CollapseAccordionActiveName" accordion style="width:500px;">
            <el-collapse-item title="病历模板" name="1">
              <div>
                <el-aside style="background:#eef1f6;width:500px">
                  病历模板
                  <el-button type="primary" plain style="float:right;" @click="invokeSaveCurrentIntoTemplate">保存当前</el-button>
                </el-aside>
                <el-tree
                  :data="medicalRecordTemplateTreeData"
                  :props="defaultProps"
                  accordion
                  @node-click="handleNodeClick"
                />
              </div>
            </el-collapse-item>
            <el-collapse-item title="历史病历" name="2">
              <div> 控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；
                <!-- <el-table :data="">
                  <el-table-column label=""></el-table-column>
                </el-table> -->
              </div>
            </el-collapse-item>
            <el-collapse-item title="效率 Efficiency" name="3">
              <div>简化流程：设计简洁直观的操作流程；</div>

            </el-collapse-item>
            <el-collapse-item title="可控 Controllability" name="4">
              <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>

            </el-collapse-item>
          </el-collapse>
        </div>
      </transition>
      <el-main>
        <aside>
          <el-button id="show_button" type="primary" @click="openModelPanel()">
            <i v-show="model_panel_show" class="el-icon-caret-left"/>
            <i v-show="!model_panel_show" class="el-icon-caret-right"/>
          </el-button>
          <span style="margin-left:30px;">门诊病历消息</span>
        </aside>
        <el-container>
          <el-main id="subOutputRank-print">
            <span>当前患者病历号</span>
            <el-input
              v-model="medicalRecordForm.registrationId"
              :disabled="true"
              style="width:350px;margin-left:20px;"
              prefix-icon="el-icon-document"
            />
            <h3>
              病史内容
            </h3>
            <el-form ref="medicalRecordForm" :model="medicalRecordForm" :rules="rules" label-width="100px">
              <el-form-item label="主诉" prop="mainInfo">
                <el-input v-model="medicalRecordForm.mainInfo"/>
              </el-form-item>
              <el-form-item label="现病史" prop="currentDisease">
                <el-input v-model="medicalRecordForm.currentDisease"/>
              </el-form-item>
              <el-form-item label="既往史" prop="pastDisease">
                <el-input v-model="medicalRecordForm.pastDisease" type="textarea" :rows="4"/>
              </el-form-item>
              <el-form-item label="体格检查" prop="physicalExam">
                <el-input v-model="medicalRecordForm.physicalExam" type="textarea" :rows="4"/>
              </el-form-item>
              <el-form-item label="辅助检查" prop="auxiliaryExam">
                <el-input v-model="medicalRecordForm.auxiliaryExam" type="textarea" :rows="4"/>
              </el-form-item>
              <el-form-item label="处理意见" prop="opinion">
                <el-input v-model="medicalRecordForm.opinion"/>
              </el-form-item>
            </el-form>
            <!-- 诊断疾病列表，可动态新增和删除 -->
            <div style="margin-top:60px">
              <el-button @click="diseaseDialogVisible = true">新增</el-button>
              <el-button @click="$refs.diseaseEditableTable.removeSelecteds()">删除选中</el-button>
              <el-button @click="$refs.diseaseEditableTable.clear()">清空</el-button>

              <elx-editable ref="diseaseEditableTable" :data.sync="diseaseEditableTableData">
                <elx-editable-column type="selection" width="55"/>
                <elx-editable-column type="index" width="55"/>

                <elx-editable-column prop="disease.diseaseName" label="疾病名称"/>
                <elx-editable-column prop="disease.diseaseIcd" label="疾病ICD编码"/>
                <!-- 需求太难，放弃主诊 -->
                <!-- <elx-editable-column prop="mainDisease" label="主诊" :edit-render="{name: 'ElSelect', options: yesOrNoList}"></elx-editable-column> -->
                <!-- <elx-editable-column prop="suspect" label="疑似" :edit-render="{name: 'ElSelect', options: yesOrNoList}"></elx-editable-column> -->
                <elx-editable-column prop="suspect" label="疑似" :edit-render="{name: 'ElSwitch', type: 'visible'}"/>
                <elx-editable-column prop="incidenceDate" label="发病日期"
                                     :edit-render="{name: 'ElDatePicker', props: {type: 'date', format: 'yyyy/MM/dd'}}"/>
              </elx-editable>
            </div>
            <!-- 全局按钮 -->
            <div style="text-align:center;margin-top:40px;">
              <el-button type="primary" @click="submitMedicalRecordForm('medicalRecordForm', 1)">提交</el-button>
              <el-button @click="resetForm('medicalRecordForm')">重置</el-button>
              <el-button @click="submitMedicalRecordForm('medicalRecordForm', 0)">暂存</el-button>
              <el-button @click="doPrint('medicalRecordForm')">预览</el-button>
            </div>
          </el-main>
        </el-container>
      </el-main>

      <!--模板的对话框-->
      <el-dialog title="模板预览" :visible.sync="modelDialogVisible" width="30%">
        <el-form ref="modelForm" :model="modelForm" :rules="templateRules">
          <el-form-item label="模板名称" prop="templateName">
            <el-input v-model="modelForm.templateName" :disabled="modelDialogEditable"/>
          </el-form-item>
          <el-form-item label="主诉" prop="mainInfo">
            <el-input v-model="modelForm.mainInfo" :disabled="modelDialogEditable"/>
          </el-form-item>
          <el-form-item label="现病史" prop="currentDisease">
            <el-input v-model="modelForm.currentDisease" :disabled="modelDialogEditable"/>
          </el-form-item>
          <el-form-item label="既往史" prop="pastDisease">
            <el-input v-model="modelForm.pastDisease" type="textarea" :rows="2" :disabled="modelDialogEditable"/>
          </el-form-item>
          <el-form-item label="体格检查" prop="physicalExam">
            <el-input v-model="modelForm.physicalExam" type="textarea" :rows="2" :disabled="modelDialogEditable"/>
          </el-form-item>
          <el-form-item label="辅助检查" prop="auxiliaryExam">
            <el-input v-model="modelForm.auxiliaryExam" type="textarea" :rows="2" :disabled="modelDialogEditable"/>
          </el-form-item>
          <el-form-item label="处理意见" prop="opinion">
            <el-input v-model="modelForm.opinion" :disabled="modelDialogEditable"/>
          </el-form-item>
          <el-form-item label="模板类别" prop="saveState">
            <el-select v-model="modelForm.saveState" placeholder="请选择" :disabled="modelDialogEditable">
              <el-option
                v-for="item in templateCategory"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modelDialogVisible = false">取 消</el-button>
          <el-button v-show="modelDialogEditable" type="primary" @click="useTemplate()">应用模板</el-button>
          <el-button v-show="!modelDialogEditable" type="primary" @click="saveCurrentIntoTemplate()">保存模板</el-button>
        </span>
      </el-dialog>

      <!-- 诊断疾病的dialog -->
      <el-dialog title="新建疾病诊断条目" :visible.sync="diseaseDialogVisible" width="30%">
        <el-form ref="diseaseForm" :model="diseaseForm">
          <el-form-item label="疾病种类" prop="diseaseCategory">
            <template>
              <el-select
                v-model="diseaseForm.diseaseCategory"
                filterable
                placeholder="请选择"
                width="100%"
                @change="forceChange"
              >
                <el-option
                  v-for="item in diseaseCategoryList"
                  :key="item.diseaseCategoryId"
                  :label="item.diseaseName"
                  :value="item.diseaseCategoryId"
                />
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="疾病名称" prop="disease.diseaseId">
            <template>
              <el-select
                v-model="diseaseForm.disease.diseaseId"
                filterable
                placeholder="请选择"
                width="100%"
                :disabled="diseaseFormDisableBool"
                @change="forceChange2"
              >
                <el-option
                  v-for="item in diseaseList"
                  :key="item.diseaseId"
                  :label="item.diseaseName"
                  :value="item.diseaseId"
                />
              </el-select>
            </template>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="diseaseDialogVisible = false">取 消</el-button>
          <el-button @click="resetForm('diseaseForm')">重置</el-button>
          <el-button type="primary" @click="insertDiseaseTable()">确 定</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>

</template>

<script>
  import 'element-ui/lib/theme-chalk/base.css'
  // collapse 展开折叠
  import Vue from 'vue'
  import ThemePicker from '@/components/ThemePicker'
  // 可编辑table使用
  // table used
  import {Editable, EditableColumn} from 'vue-element-extends'
  import 'vue-element-extends/lib/index.css'
  import {fetchDiseaseCategory, fetchDiseaseList} from '../../api/basicInfo/diagnosis'

  import {
    saveMedicalRecord,
    saveMedicalRecordAsTemplate,
    selectMedicalRecordsTemplateList,
    selectPatientHistoryMedicalRecords
  } from '../../api/medicalRecord/medicalRecord'

Vue.use(Editable)
Vue.use(EditableColumn)
Vue.component('ElxEditable', Editable)
Vue.component('ElxEditableColumn', EditableColumn)

  export default {
  components: { ThemePicker },
  data() {
    return {
      // 当前医生Id
      doctorId: 1,
      registrationId: 1,
      // 模板左侧是否显示
      model_panel_show: false,
      // 提交表单
      medicalRecordForm: {
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
        mainInfo: [
          {required: true, message: '请输入', trigger: 'blur'}
        ]
      },
      templateRules: {
        templateName: [
          {required: true, message: '请输入', trigger: 'blur'}
        ],
        saveState: [
          {required: true, message: '请选择', trigger: 'blur'}
        ],
      },
      // 疾病 列表
      diseaseEditableTableData: [],
      yesOrNoList: [{
        'label': '是',
        'value': '1'
      }, {
        'label': '否',
        'value': '0'
      }],
      // 疾病 对话框
      diseaseDialogVisible: false,
      diseaseForm: {
        disease: {
          diseaseId: '',
          diseaseIcd: '',
          diseaseName: '',
          diseaseCode: '',
          diseaseCategory: '',
          valid: ''
        },
        diseaseCategory: '',
        mainDisease: '',
        suspect: '',
        incidenceDate: ''
      },
      formLabelWidth: '120px',
      diseaseFormDisableBool: true,
      diseaseCategoryList: [],
      diseaseList: [],
      // 左侧手风琴激活状态
      CollapseAccordionActiveName: 1,
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
    this.invokeFetchDiseaseCategory()
    this.invokeSelectMedicalRecordsTemplateList()
    this.invokeSelectPatientHistoryMedicalRecords()
  },
  methods: {
    openModelPanel() {
      this.model_panel_show = !this.model_panel_show
    },
    submitMedicalRecordForm(formName, choose) {
      // choose 1 提交 0 暂存
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.medicalRecordForm)
          this.medicalRecordForm.saveState = choose
          this.medicalRecordForm.doctorId = this.doctorId
          // console.log(this.diseaseEditableTableData)
          this.medicalRecordForm.disease = []
          for (var i = 0; i < this.diseaseEditableTableData.length; ++i) {
            this.medicalRecordForm.disease.push({
              'diseaseId': this.diseaseEditableTableData[i].disease.diseaseId,
              'mainDisease': 0,
              'suspect': this.diseaseEditableTableData[i].suspect == true ? 1 : 0,
              'incidenceDate': this.diseaseEditableTableData[i].incidenceDate
            })
          }
          console.log(this.medicalRecordForm)
          saveMedicalRecord({'medicalRecordJson': this.medicalRecordForm}).then(response => {
            if (choose == 1) {
              this.$message({
                message: '提交数据成功！',
                type: 'success'
              })
              // 跳转
            } else {
              this.$message({
                message: '暂存数据成功！',
                type: 'success'
              })
            }
          }).catch(error => {
            console.log('saveMedicalRecord error: ')
            console.log(error)
          })
        } else {
          console.log('error submitMedicalRecordForm!!')
          return false
        }
      })
    },
    // 疾病对话框处理
    insertDiseaseTable() {
      this.$refs.diseaseEditableTable.insert(this.diseaseForm)
      this.diseaseList = []
      this.$message({
        message: '插入数据成功！',
        type: 'success'
      })
      this.diseaseDialogVisible = false
    },
    // 树形目录检测
    handleNodeClick(data) {
      console.log(data)
      if (data.label == '全院') {
        this.medicalRecordTemplateTreeDirectory = 0
        return
      }
      if (data.label == '科室') {
        this.medicalRecordTemplateTreeDirectory = 1
        return
      }
      if (data.label == '个人') {
        this.medicalRecordTemplateTreeDirectory = 2
        return
      }
      var now = this.medicalRecordTemplateTreeDirectory
      // console.log(this.medicalRecordTemplateTreeDirectory)
      // console.log(data.label)
      for (var i = 0; i < this.medicalRecordTemplateData[now].length; ++i) {
        // console.log(this.medicalRecordTemplateData[now][i].templateName)
        if (this.medicalRecordTemplateData[now][i].templateName == data.label) {
          this.modelDialogVisible = true
          this.modelDialogEditable = true
          this.modelForm = this.medicalRecordTemplateData[now][i]
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
          this.medicalRecordTemplateTreeData[0].children.push({'label': response.data[i].templateName})
        }
        // 科室
        query.templateScope = 3
        selectMedicalRecordsTemplateList(query).then(response => {
          // console.log(response)
          this.medicalRecordTemplateData.push(response.data)
          for (var i = 0; i < response.data.length; ++i) {
            this.medicalRecordTemplateTreeData[1].children.push({'label': response.data[i].templateName})
          }
          // 个人
          query.templateScope = 4
          selectMedicalRecordsTemplateList(query).then(response => {
            console.log(response)
            this.medicalRecordTemplateData.push(response.data)
            for (var i = 0; i < response.data.length; ++i) {
              this.medicalRecordTemplateTreeData[2].children.push({'label': response.data[i].templateName})
            }
          })
        })
      })
    },
    // 将当前打开的模板追加到当前的病历上
    useTemplate() {
      // console.log('TODO')
      // console.log(this.modelForm)
      this.medicalRecordForm.auxiliaryExam = this.modelForm.auxiliaryExam
      this.medicalRecordForm.currentDisease = this.modelForm.currentDisease
      this.medicalRecordForm.mainInfo = this.modelForm.mainInfo
      this.medicalRecordForm.opinion = this.modelForm.opinion
      this.medicalRecordForm.pastDisease = this.modelForm.pastDisease
      this.medicalRecordForm.physicalExam = this.modelForm.physicalExam
      this.modelDialogVisible = false
    },
    // 将当前的病历存储为模板
    invokeSaveCurrentIntoTemplate() {
      this.modelDialogVisible = true
      this.modelDialogEditable = false
      this.modelForm.doctorId = this.doctorId
      this.modelForm.mainInfo = this.medicalRecordForm.mainInfo
      this.modelForm.currentDisease = this.medicalRecordForm.currentDisease
      this.modelForm.pastDisease = this.medicalRecordForm.pastDisease
      this.modelForm.physicalExam = this.medicalRecordForm.physicalExam
      this.modelForm.auxiliaryExam = this.medicalRecordForm.auxiliaryExam
      this.modelForm.opinion = this.medicalRecordForm.opinion
      this.modelForm.saveState = ''
      this.modelForm.templateName = ''
      this.modelForm.medicalRecordsId = ''
      // saveMedicalRecordAsTemplate()
    },
    saveCurrentIntoTemplate() {
      var query = this.modelForm
      // console.log(query)
      this.modelDialogVisible = false
      saveMedicalRecordAsTemplate(query).then(response => {
        this.invokeSelectMedicalRecordsTemplateList()
      }).catch(error => {
        console.log('saveMedicalRecordAsTemplate error: ')
        console.log(error)
      })
    },
    // 疾病列表和种类的获取
    invokeFetchDiseaseCategory() {
      fetchDiseaseCategory().then(response => {
        this.diseaseCategoryList = response.data
      }).catch(error => {
        console.log('fetchDiseaseCategory error: ')
        console.log(error)
      })
    },
    invokeFetchDiseaseList() {
      var query = {
        'currentPage': 1,
        'pageSize': 400,
        'diseaseCategoryId': this.diseaseForm.diseaseCategory
      }
      fetchDiseaseList(query).then(response => {
        console.log('fetchDiseaseList')
        console.log(response)
        this.diseaseList = response.data.list
      }).catch(error => {
        console.log('fetchDiseaseList error: ')
        console.log(error)
      })
    },
    // 获取历史病历
    invokeSelectPatientHistoryMedicalRecords() {
      var query = {
        'registrationId': this.registrationId,
      }
      selectPatientHistoryMedicalRecords(query).then(response => {
        console.log('selectPatientHistoryMedicalRecords')
        console.log(response)
      }).catch(error => {
        console.log('selectPatientHistoryMedicalRecords error: ')
        console.log(error)
      })
    },
    // 疾病对话框的第一个选择后触发
    forceChange() {
      this.diseaseFormDisableBool = false
      this.invokeFetchDiseaseList()
    },
    // 疾病对话框的第一个选择后触发
    forceChange2() {
      if (this.diseaseForm.disease.diseaseId === '' || this.diseaseForm.disease.diseaseId == null) {
        return
      }
      this.diseaseForm.suspect = true
      this.diseaseForm.incidenceDate = new Date()
      for (var i = 0; i < this.diseaseList.length; ++i) {
        if (this.diseaseList[i].diseaseId === this.diseaseForm.disease.diseaseId) {
          this.diseaseForm.disease = this.diseaseList[i]
          break
        }
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
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
