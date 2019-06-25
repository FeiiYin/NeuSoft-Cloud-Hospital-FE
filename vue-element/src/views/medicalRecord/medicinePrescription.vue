<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <aside>
          <span style="margin-left:30px;">成药处方消息</span>
          <el-dropdown style="float:right" @command="handleMenuCommand">
            <span class="el-dropdown-link">
              <el-tag type="text">
                请选择<i class="el-icon-arrow-down el-icon--right" />
              </el-tag>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">病历诊断</el-dropdown-item>
              <el-dropdown-item command="b">检查申请</el-dropdown-item>
              <el-dropdown-item command="c">确诊</el-dropdown-item>
              <el-dropdown-item command="d" disabled>处方申请</el-dropdown-item>
              <el-dropdown-item command="e">处置申请</el-dropdown-item>
              <el-dropdown-item command="f" divided>诊断完毕</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </aside>
        <el-container>
          <el-main>
            <el-row :gutter="10">
              <el-col :span="12">
                <span>当前患者病历号</span>
                <el-input
                  v-model="registrationId"
                  style="width:350px;margin-left:20px;"
                  prefix-icon="el-icon-document"
                  :disabled="true"
                />
              </el-col>
              <el-col :span="12">
                <span>当前处方名称</span>
                <el-input
                  v-model="prescriptionName"
                  style="width:350px;margin-left:20px;"
                  prefix-icon="el-icon-document"
                />
              </el-col>
            </el-row>

            <!-- 药品列表，可动态新增和删除 -->
            <div style="margin-top:60px">
              <el-button @click="medicineDialogVisible = true">新增</el-button>
              <el-button @click="commonMedicineDialogVisible = true">常用药</el-button>

              <el-button @click="$refs.prescriptionItemEditableTableData.removeSelecteds()">删除选中</el-button>
              <el-button @click="$refs.prescriptionItemEditableTableData.clear()">清空</el-button>

              <elx-editable ref="prescriptionItemEditableTableData" :data.sync="prescriptionItemEditableTableData">
                <elx-editable-column type="selection" width="55" />
                <elx-editable-column type="index" width="55" />
                <elx-editable-column prop="nameZh" label="药品名称" />
                <elx-editable-column prop="medicineSpecification" label="药品规格" />
                <elx-editable-column prop="medicinePrice" label="单价" />
                <elx-editable-column prop="medicineUsage" label="药品用法" :edit-render="{name: 'ElInput'}" />
                <elx-editable-column prop="medicineDosage" label="剂量" :edit-render="{name: 'ElInputNumber'}" />
                <elx-editable-column prop="medicineFrequency" label="频次" :edit-render="{name: 'ElSelect', options: frequencyList}" />
                <elx-editable-column prop="medicineNumberDay" label="天数" :edit-render="{name: 'ElInputNumber'}" />
                <elx-editable-column prop="medicineQuantity" label="购买数量" :edit-render="{name: 'ElInputNumber'}" />
                <elx-editable-column prop="medicineUnit" label="单位" />
              </elx-editable>
            </div>
            <aside style="height:60px;">
              <span>处方类型</span>
              <el-select v-model="prescriptionType" clearable placeholder="请选择" style="margin-left:20px;margin-right:20px;">
                <el-option
                  v-for="item in prescriptionTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <span>总计金额：
                <svg-icon icon-class="money" />
              </span>
              <el-input v-model="totalListMoney" :disabled="true" style="width:20%" />
            </aside>

            <!-- 全局按钮 -->
            <div style="text-align:center;margin-top:40px;">
              <el-button type="primary" @click="submitPrescriptionItemList(-1, 1)">提交</el-button>
              <el-button type="info" @click="doPrint"><i class="el-icon-printer" />打印预览</el-button>
            </div>
          </el-main>
        </el-container>
      </el-main>

      <!-- 诊断药品的dialog -->
      <el-dialog title="新建药品条目" :visible.sync="medicineDialogVisible" width="30%">
        <el-form ref="medicineForm" :model="medicineForm">
          <el-form-item label="药品名称或拼音码">
            <el-select
              v-model="medicineForm.medicineId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteInvokeSearchMedicine"
              :loading="medicineListSelectLoading"
            >
              <el-option
                v-for="item in medicineList"
                :key="item.medicineId"
                :label="item.nameZh + '  ' + item.namePinyin"
                :value="item.medicineId"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="medicineDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="insertMedicineTable()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 常用药dialog -->
      <el-dialog title="常用药" :visible.sync="commonMedicineDialogVisible">
        <div style="margin-left:13%">
          <!-- 选中 穿梭框 -->
          <el-transfer
            v-model="commonMedicineListValue"
            filterable
            :filter-method="transferFilterMethod"
            filter-placeholder="请输入"
            :data="commonMedicineListData"
            :titles="['常用药列表', '选中列表']"
            style=""
          />
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="commonMedicineDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="insertCommonMedicine()">确 定</el-button>
        </div>
      </el-dialog>
      <!--模板的对话框-->
      <el-dialog title="模板" :visible.sync="templateDialogVisible" width="30%">
        <span>模板保存类别</span>
        <el-select v-model="saveState" placeholder="请选择" value="">
          <el-option
            v-for="item in templateCategory"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="templateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveCurrentIntoTemplate()">保存模板</el-button>
        </span>
      </el-dialog>
    </el-container>

    <el-row :gutter="20" style="margin:20px">
      <el-col :span="10"><div>
        <el-aside style="background:#eef1f6;width:500px">
          处方模板
          <el-button type="primary" plain style="float:right;" @click="templateDialogVisible=true">保存为模板</el-button>
          <el-button plain style="float:right;margin-right:10px" @click="applyTemplate">应用</el-button>
        </el-aside>
        <el-tree
          :data="prescriptionTemplateTreeData"
          :props="defaultProps"
          accordion
          @node-click="handleNodeClick"
        />
      </div></el-col>
      <el-col :span="14"><div>
        <el-table :data="prescriptionTemplateMedicineExample" style="width: 100%">
          <el-table-column prop="medicine.nameZh" label="药品名称" />
          <el-table-column prop="medicine.medicineSpecification" label="规格" />
          <el-table-column prop="medicine.medicinePrice" label="单价" />
        </el-table>
      </div></el-col>
    </el-row>

    <!-- 暂存 -->
    <el-row :gutter="20" style="margin:20px">
      <el-col :span="10"><div>
        <el-aside style="background:#eef1f6;width:500px">
          处方暂存记录
          <el-button type="primary" plain style="float:right;" @click="submitPrescriptionItemList(-1, 0)">暂存</el-button>
          <el-button plain style="float:right;margin-right:10px;" @click="invokeDeletePrescription">删除</el-button>
        </el-aside>
        <el-table
          ref="tempsavePrescriptionTable"
          :data="tempsavePrescriptionTable"
          border
          @selection-change="handleTempSaveTableSelectionChange"
          @row-click="showTempsavePrescriptionMedicineExample"
        >
          <el-table-column type="selection" />
          <el-table-column prop="prescriptionName" label="处方名称" />
        </el-table>
      </div></el-col>
      <el-col :span="14"><div>
        <el-table :data="tempsavePrescriptionMedicineExample" style="width: 100%">
          <el-table-column prop="medicine.nameZh" label="药品名称" />
          <el-table-column prop="medicine.medicineSpecification" label="规格" />
          <el-table-column prop="medicine.medicinePrice" label="单价" />
        </el-table>
      </div></el-col>
    </el-row>

    <!-- 历史 -->
    <el-row :gutter="20" style="margin:20px">
      <el-col :span="10"><div>
        <el-aside style="background:#eef1f6;width:500px">
          患者历史处方记录
        </el-aside>
        <el-table
          ref="historyPrescriptionTable"
          :data="historyPrescriptionTable"
          border
          @row-click="showHistoryPrescriptionMedicineExample"
        >
          <el-table-column prop="prescriptionName" label="处方名称" />
        </el-table>
      </div></el-col>
      <el-col :span="14"><div>
        <el-table :data="historyPrescriptionMedicineExample" style="width: 100%">
          <el-table-column prop="medicine.nameZh" label="药品名称" />
          <el-table-column prop="medicine.medicineSpecification" label="规格" />
          <el-table-column prop="medicine.medicinePrice" label="单价" />
        </el-table>
      </div></el-col>
    </el-row>
    <div v-show="false" id="subOutputRank-print">
      <strong>处方列表</strong>
      <br>
      <hr>
      <span
        v-for="item in prescriptionItemEditableTableData"
        :key="item.medicineId"
        :label="item.nameZh"
        :value="item.medicineId"
      >
        <p>
          <span>{{ item.nameZh }}</span>
          <span>{{ item.medicineSpecification }}</span>
          <span>{{ item.medicineUnit }}</span>
          <span>{{ item.medicineManufacturer }}</span>
          <span>{{ item.medicineDosageId }}</span>
          <span>{{ item.medicinePrice }}</span>
          *
          <span>{{ item.medicineQuantity }}</span>
          共
          <span>{{ item.medicineQuantity*item.medicinePrice }}</span>
          元
        </p>
      </span>
      <hr>
      <strong>合计 {{ totalListMoney }} 元</strong>
    </div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/base.css'
// collapse 展开折叠
import Vue from 'vue'
// 可编辑table使用
// table used
import {
  Editable,
  EditableColumn
} from 'vue-element-extends'
import 'vue-element-extends/lib/index.css'

import {
  selectMedicine,
  savePrescription,
  commonMedicine,
  deletePrescription,
  selectHistoryPrescription,
  selectPrescriptionTemplate
} from '../../api/medicalRecord/prescription'

Vue.use(Editable)
Vue.use(EditableColumn)
Vue.component('ElxEditable', Editable)
Vue.component('ElxEditableColumn', EditableColumn)

export default {
  data() {
    return {
      // 基础前置信息
      doctorId: 1,
      registrationId: 1,
      disease: '',
      prescriptionType: '普通门诊',
      totalListMoney: 0,
      prescriptionName: '',
      prescriptionId: '',
      // 药品 列表
      prescriptionItemEditableTableData: [],
      // 药品 对话框
      medicineDialogVisible: false,
      medicineForm: {
        medicineId: '',
        medicineCode: '',
        nameZh: '',
        medicineSpecification: '',
        medicineUnit: '',
        medicineManufacturer: '', // 生产商
        medicineDosageId: '', // 剂量
        medicineTypeId: '',
        medicinePrice: '',
        namePinyin: '',
        creationTime: '',
        nums: '',
        nameEn: '',
        valid: ''
      },
      // 处方物品-药品
      prescriptionItem: {
        prescriptionItemId: '',
        medicineId: '',
        medicineUsage: '',
        medicineDosage: '',
        medicineFrequency: '',
        medicineNumberDay: '',
        medicineQuantity: '',
        skinTest: '',
        skinTestResult: ''
      },
      formLabelWidth: '120px',
      // 选择 处方类型
      prescriptionTypeList: [{
        value: '普通门诊',
        label: '普通门诊'
      }, {
        value: '急诊',
        label: '急诊'
      }],
      // 频次
      frequencyList: [{
        label: '一天一次',
        value: '一天一次'
      }, {
        label: '一天两次',
        value: '一天两次'
      }, {
        label: '一天三次',
        value: '一天三次'
      }],
      // 药品远程选择
      medicineListSelectLoading: false,
      medicineTotalList: [],
      medicineList: [],
      // 常用药对话框
      commonMedicineDialogVisible: false,
      commonMedicineListData: [],
      commonMedicineListValue: [],
      transferFilterMethod(query, item) {
        return item.nameZh.indexOf(query) > -1
      },
      // 树形目录参数
      // 树形列表的类名
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      prescriptionTemplateTreeData: [
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
      // 模板
      templateDialogVisible: false,
      prescriptionTemplateTreeDirectory: 0,
      // 模板的完整数据 二维的
      prescriptionTemplateData: [],
      // 一个具体模板的数据
      prescriptionTemplateMedicineExample: [],
      saveState: '',
      templateCategory: [{
        value: '2',
        label: '全院模板'
      }, {
        value: '3',
        label: '科室模板'
      }, {
        value: '4',
        label: '个人模板'
      }],
      // 暂存
      tempsavePrescriptionData: [],
      tempsavePrescriptionTable: [],
      tempsavePrescriptionTableMultipleSelection: [],
      tempsavePrescriptionMedicineExample: [],
      // 历史
      historyPrescriptionData: [],
      historyPrescriptionTable: [],
      historyPrescriptionMedicineExample: []
    }
  },
  created() {
    this.registrationId = this.$route.query.registrationId
    this.disease = this.$route.query.disease
    this.invokeSelectMedicine()
    this.invokeCommonMedicine()
    this.invokeSelectPrescriptionTemplate()
    this.invokeSelectHistoryPrescription()
  },
  methods: {
    // 疾病对话框处理
    insertMedicineTable() {
      // console.log(this.medicineForm)
      var id = this.medicineForm.medicineId - 1
      this.prescriptionItem = this.medicineTotalList[id]
      this.$refs.prescriptionItemEditableTableData.insert(this.prescriptionItem)
      this.$message({
        message: '插入数据成功！',
        type: 'success'
      })
      this.medicineDialogVisible = false
    },
    // 获取药品列表
    invokeSelectMedicine() {
      selectMedicine().then(response => {
        // console.log(response)
        this.medicineTotalList = response.data
      }).catch(error => {
        console.log('selectMedicine error: ')
        console.log(error)
      })
    },
    // 远程搜索获取药品列表
    remoteInvokeSearchMedicine(query) {
      if (query !== '') {
        this.medicineListSelectLoading = true
        setTimeout(() => {
          this.medicineListSelectLoading = false
          this.medicineList = this.medicineTotalList.filter(item => {
            return (item.nameZh.toLowerCase()
              .indexOf(query.toLowerCase()) > -1 ||
              item.namePinyin.toLowerCase().indexOf(query.toLowerCase()) > -1)
          })
        }, 200)
      } else {
        this.medicineList = []
      }
    },
    submitCheck() {
      if (this.prescriptionName === '') {
        this.$message.error('未输入当前处方名称，错误！')
        return false
      }
      if (this.prescriptionItemEditableTableData.length === 0 || this.prescriptionItemEditableTableData.length == null) {
        this.$message.error('未选中任何药品，错误！')
        return false
      }
      for (var i = 0; i < this.prescriptionItemEditableTableData.length; ++i) {
        if (this.prescriptionItemEditableTableData[i].medicineUsage === '' ||
          this.prescriptionItemEditableTableData[i].medicineDosage === '' ||
          this.prescriptionItemEditableTableData[i].medicineFrequency === '' ||
          this.prescriptionItemEditableTableData[i].medicineNumberDay === '' ||
          this.prescriptionItemEditableTableData[i].medicineQuantity === '' ||
          this.prescriptionItemEditableTableData[i].medicineUsage == null ||
          this.prescriptionItemEditableTableData[i].medicineDosage == null ||
          this.prescriptionItemEditableTableData[i].medicineFrequency == null ||
          this.prescriptionItemEditableTableData[i].medicineNumberDay == null ||
          this.prescriptionItemEditableTableData[i].medicineQuantity == null ||
          this.prescriptionItemEditableTableData[i].medicineQuantity <= 0 ||
          this.prescriptionItemEditableTableData[i].medicineDosage <= 0 ||
          this.prescriptionItemEditableTableData[i].medicineNumberDay <= 0) {
          this.$message.error('药品信息缺失或错误，错误！')
          return false
        }
      }
      return true
    },
    invokekSavePrescription(prescriptionId, saveState) {
      for (var i = 0; i < this.prescriptionItemEditableTableData.length; ++i) {
        this.prescriptionItemEditableTableData[i].skinTest = ''
        this.prescriptionItemEditableTableData[i].skinTestResult = ''
        this.prescriptionItemEditableTableData[i].doctorAdvice = '医嘱'
        this.prescriptionItemEditableTableData[i].nums = this.prescriptionItemEditableTableData[i].medicineQuantity
        this.prescriptionItemEditableTableData[i].unitPrice = this.prescriptionItemEditableTableData[i].medicinePrice
      }
      var query = {
        'prescriptionJson': {
          'prescriptionId': prescriptionId, // 新增时填-1
          'prescriptionName': this.prescriptionName,
          'registrationId': this.registrationId,
          'saveState': saveState, // 保存状态（暂存 0；正式提交 1；模板 2,3,4）
          'doctorId': this.doctorId,
          'medicine': this.prescriptionItemEditableTableData
        }
      }
      console.log(query)
      savePrescription(query).then(response => {
        console.log('savePrescription response: ')
        console.log(response)
        this.$message({
          type: 'success',
          message: '提交成功!'
        })
        this.invokeSelectHistoryPrescription()
      }).catch(error => {
        console.log('savePrescription error: ')
        console.log(error)
      })
    },
    submitPrescriptionItemList(prescriptionId, saveState) {
      if (this.submitCheck() === false) {
        return
      }
      this.calculateTotalMoney()
      this.$confirm('分发药品, 合计' + this.totalListMoney + '元，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.invokekSavePrescription(prescriptionId, saveState)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    calculateTotalMoney() {
      this.totalListMoney = 0
      for (var i = 0; i < this.prescriptionItemEditableTableData.length; ++i) {
        this.totalListMoney += this.prescriptionItemEditableTableData[i].medicineQuantity * this.prescriptionItemEditableTableData[i].medicinePrice
      }
    },
    // 常用药
    invokeCommonMedicine() {
      commonMedicine({ 'medicineNumber': 7 }).then(response => {
        console.log('commonMedicine response: ')
        console.log(response)
        for (var i = 0; i < response.data.length; ++i) {
          this.commonMedicineListData.push({
            label: response.data[i].nameZh,
            key: response.data[i].medicineId,
            nameZh: response.data[i].nameZh
          })
        }
      }).catch(error => {
        console.log('commonMedicine error: ')
        console.log(error)
      })
    },
    insertCommonMedicine() {
      if (this.commonMedicineListValue.length === 0) {
        this.$message('未插入常用药')
        this.commonMedicineDialogVisible = false
        return
      }
      for (var i = 0; i < this.commonMedicineListValue.length; ++i) {
        var id = this.commonMedicineListValue[i] - 1
        this.prescriptionItem = this.medicineTotalList[id]
        this.$refs.prescriptionItemEditableTableData.insert(this.prescriptionItem)
      }
      this.commonMedicineListValue = []
      this.$message({
        message: '插入数据成功！',
        type: 'success'
      })
      this.commonMedicineDialogVisible = false
    },
    // 模板
    applyTemplate() {
      if (this.prescriptionTemplateMedicineExample.length === 0 || this.prescriptionTemplateMedicineExample.length == null) {
        this.$message.error('当前未选中模板，错误！')
        return
      }
      for (var i = 0; i < this.prescriptionTemplateMedicineExample.length; ++i) {
        var id = this.prescriptionTemplateMedicineExample[i].medicineId - 1
        this.prescriptionItem = this.medicineTotalList[id]
        this.$refs.prescriptionItemEditableTableData.insert(this.prescriptionItem)
      }
      this.$message({
        message: '应用模板成功！',
        type: 'success'
      })
    },
    invokeSelectPrescriptionTemplate() {
      this.prescriptionTemplateData = []
      var query = {
        'prescriptionScope': 2,
        'doctorId': this.doctorId
      }
      selectPrescriptionTemplate(query).then(response => {
        console.log('selectPrescriptionTemplate response:')
        console.log(response)
        this.prescriptionTemplateData.push(JSON.parse(response.data))
        // this.medicineTotalList = response.data
        query.prescriptionScope = 3
        selectPrescriptionTemplate(query).then(response => {
          this.prescriptionTemplateData.push(JSON.parse(response.data))
          query.prescriptionScope = 4
          selectPrescriptionTemplate(query).then(response => {
            this.prescriptionTemplateData.push(JSON.parse(response.data))
            console.log(this.prescriptionTemplateData)
            this.prescriptionTemplateTreeData = [{
              label: '全院',
              children: []
            }, {
              label: '科室',
              children: []
            }, {
              label: '个人',
              children: []
            }]
            // 加到树形列表中
            for (var i = 0; i < 3; ++i) {
              for (var j = 0; j < this.prescriptionTemplateData[i].length; ++j) {
                this.prescriptionTemplateTreeData[i].children.push({ 'label': this.prescriptionTemplateData[i][j].prescriptionName })
              }
            }
          })
        })
      })
    },

    // 树形目录检测
    handleNodeClick(data) {
      console.log(data)
      if (data.label === '全院') {
        this.prescriptionTemplateTreeDirectory = 0
        return
      }
      if (data.label === '科室') {
        this.prescriptionTemplateTreeDirectory = 1
        return
      }
      if (data.label === '个人') {
        this.prescriptionTemplateTreeDirectory = 2
        return
      }
      var now = this.prescriptionTemplateTreeDirectory
      for (var i = 0; i < this.prescriptionTemplateData[now].length; ++i) {
        // console.log(this.medicalRecordTemplateData[now][i].templateName)
        if (this.prescriptionTemplateData[now][i].prescriptionName === data.label) {
          // console.log(this.prescriptionTemplateData[now][i])
          var tempList = JSON.parse(this.prescriptionTemplateData[now][i].medicine)
          // console.log('tempList')
          // console.log(tempList)
          this.prescriptionTemplateMedicineExample = []
          for (var j = 0; j < tempList.length; ++j) {
            this.prescriptionTemplateMedicineExample.push(this.medicineTotalList[tempList[j].medicineId - 1])
          }
          console.log(this.prescriptionTemplateMedicineExample)
          break
        }
      }
    },
    saveCurrentIntoTemplate() {
      if (this.submitCheck() === false) {
        return
      }
      if (this.saveState === '') {
        this.$message.error('未选择保存模板类型，错误！')
        return
      }
      this.templateDialogVisible = false
      this.invokekSavePrescription(-1, this.saveState)
      this.invokeSelectPrescriptionTemplate()
      // console.log('now here ' + this.saveState)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 暂存
    invokeSelectHistoryPrescription() {
      selectHistoryPrescription({ 'registrationId': this.registrationId }).then(response => {
        var tempList = JSON.parse(response.data)
        // console.log('selectHistoryPrescription response: ')
        // console.log(tempList)
        this.tempsavePrescriptionTable = []
        this.historyPrescriptionTable = []
        var i
        for (i = 0; i < tempList.length; ++i) {
          if (tempList[i].saveState === 1) {
            this.historyPrescriptionTable.push(tempList[i])
          } else if (tempList[i].saveState === 0) {
            this.tempsavePrescriptionTable.push(tempList[i])
          }
        }
        console.log('selectHistoryPrescription response:')
        console.log(this.historyPrescriptionTable)
      }).catch(error => {
        console.log('selectHistoryPrescription error: ')
        console.log(error)
      })
    },
    handleTempSaveTableSelectionChange(val) {
      this.tempsavePrescriptionTableMultipleSelection = val
    },
    showTempsavePrescriptionMedicineExample(row, event, column) {
      this.tempsavePrescriptionMedicineExample = row.prescriptionEntryList
    },
    // 删除暂存的处方
    invokeDeletePrescription() {
      var tempList = []
      // console.log(this.tempsavePrescriptionTableMultipleSelection)
      for (var i = 0; i < this.tempsavePrescriptionTableMultipleSelection.length; ++i) {
        tempList.push(this.tempsavePrescriptionTableMultipleSelection[i].prescriptionId)
      }
      deletePrescription({ 'prescriptionIdList': tempList }).then(response => {
        this.invokeSelectHistoryPrescription()
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
      })
    },
    // 历史
    showHistoryPrescriptionMedicineExample(row, event, column) {
      this.historyPrescriptionMedicineExample = row.prescriptionEntryList
    },
    // 下拉菜单
    handleMenuCommand(command) {
      // this.$message('click on item ' + command)
      if (command === 'a') {
        // 病历
        this.$router.push({
          path: '/medicalRecord/medicalRecord', // 这个path是在router/index.js里边配置的路径
          query: {
            registrationId: this.registrationId
          }
        })
      } else if (command === 'b') {
        // 检查
        this.$router.push({
          path: '/medicalRecord/examination', // 这个path是在router/index.js里边配置的路径
          query: {
            registrationId: this.registrationId,
            disease: this.disease
          }
        })
      } else if (command === 'c') {
        // 确诊
        this.$router.push({
          path: '/medicalRecord/confirmMedicalRecord', // 这个path是在router/index.js里边配置的路径
          query: {
            registrationId: this.registrationId,
            disease: this.disease
          }
        })
      } else if (command === 'd') {
        // 处方
        this.$router.push({
          path: '/medicalRecord/medicinePrescription', // 这个path是在router/index.js里边配置的路径
          query: {
            registrationId: this.registrationId,
            disease: this.disease
          }
        })
      } else if (command === 'e') {
        // 处置
        this.$router.push({
          path: '/medicalRecord/disposalApplication', // 这个path是在router/index.js里边配置的路径
          query: {
            registrationId: this.registrationId,
            disease: this.disease
          }
        })
      } else if (command === 'f') {
        // 诊断完毕
        this.$router.push({
          path: '/medicalRecord/patientDetail', // 这个path是在router/index.js里边配置的路径
          query: {
            registrationId: this.registrationId,
            disease: this.disease
          }
        })
      }
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
