<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <aside>
          <span style="margin-left:30px;">检查项目申请</span>
        </aside>
        <div>
          <el-form :model="examForm" ref="examForm" label-width="100px">
            <el-row :gutter="10" style="margin-bottom:0px">
              <el-col :span="12">
                <el-form-item label="患者病历号" prop="registrationId">
                  <el-input v-model="examForm.registrationId" :disabled="true" prefix-icon="el-icon-document"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="医生诊断疾病" prop="disease">
                  <el-input v-model="examForm.disease" :disabled="true" prefix-icon="el-icon-document"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="检查申请名称" prop="examinationName">
              <el-input v-model="examForm.examinationName" prefix-icon="el-icon-document"></el-input>
            </el-form-item>
            <el-form-item label="检查要求" prop="requirement">
              <el-input v-model="examForm.requirement" prefix-icon="el-icon-document" type="textarea" :rows="3"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <!-- 检查列表，可动态新增和删除 -->
        <div style="margin-top:60px">
          <el-button @click="chargeItemFormVisible = true">新增</el-button>          
          <el-button @click="commonMedicineDialogVisible = true">常用项目</el-button>

          <el-button @click="$refs.chargeItemEditableTableData.removeSelecteds()">删除选中</el-button>
          <el-button @click="$refs.chargeItemEditableTableData.clear()">清空</el-button>

          <elx-editable ref="chargeItemEditableTableData" :data.sync="chargeItemEditableTableData">
            <elx-editable-column type="selection" width="55"/>
            <elx-editable-column type="index" width="55"/>
            <elx-editable-column prop="nameZh" label="项目名称"/>
            <elx-editable-column prop="specification" label="规格"/>
            <elx-editable-column prop="price" label="单价"/>
            <elx-editable-column prop="departmentId" label="科室名称"/>
            <elx-editable-column prop="nums" label="数量" :edit-render="{name: 'ElInputNumber'}"></elx-editable-column>
            <elx-editable-column prop="doctorAdvice" label="医嘱" :edit-render="{name: 'ElInput'}"></elx-editable-column>
          </elx-editable>
        </div>

        <aside style="height:60px;">
          <span>合计金额：
            <svg-icon icon-class="money" />
          </span>
          <el-input v-model="totalListMoney" :disabled="true" style="width:20%" />
        </aside>

        <!-- 全局按钮 -->
        <div style="text-align:center;margin-top:40px;">
          <el-button type="primary" @click="submitExamination(1)">提交</el-button>
          <el-button type="info" @click="doPrint"><i class="el-icon-printer" />打印预览</el-button>
        </div>
      </el-main>
    </el-container>
     
    <!--新增条目的对话框-->
    <el-dialog title="新增检查项目" :visible.sync="chargeItemFormVisible" width="30%">
      <el-form ref="chargeItemForm" :model="chargeItemForm" label-width="120px">
        <el-form-item label="科室名称" prop="departmentId">
          <el-select v-model="chargeItemForm.departmentId" filterable
            placeholder="请选择" width="100%" @change="forceChange">
            <el-option
              v-for="item in departmentList"
              :key="item.departmentId"
              :label="item.departmentName"
              :value="item.departmentId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="检查项目名称" prop="chargeItemId">
          <el-select v-model="chargeItemForm.chargeItemId" filterable placeholder="请选择" 
            :disabled="chargeItemFormDisable" >
            <el-option
              v-for="item in chargeItemList"
              :key="item.chargeItemId"
              :label="item.nameZh"
              :value="item.chargeItemId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chargeItemFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertChargeItemTable">确 定</el-button>
      </span>
    </el-dialog>  
    
      <!-- 常用药dialog -->
      <el-dialog title="常用药" :visible.sync="commonMedicineDialogVisible" >
        <div style="margin-left:13%">
          <!-- 选中 穿梭框 -->
          <el-transfer
            filterable
            :filter-method="transferFilterMethod"
            filter-placeholder="请输入"
            v-model="commonMedicineListValue"
            :data="commonMedicineListData"
            :titles="['常用药列表', '选中列表']"
            style="">
          </el-transfer>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="commonMedicineDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="insertCommonMedicine()">确 定</el-button>
        </div>
      </el-dialog>
      <!--模板的对话框-->
      <el-dialog title="模板" :visible.sync="templateDialogVisible" width="30%">
        <span>模板保存类别</span>
        <el-select v-model="saveState" placeholder="请选择" >
          <el-option
            v-for="item in templateCategory"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="templateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveCurrentIntoTemplate()">保存模板</el-button>
        </span>
      </el-dialog>
    
    <el-row :gutter="20" style="margin:20px">
      <el-col :span="10"><div >
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
        <el-table-column prop="nameZh" label="药品名称"></el-table-column>
        <el-table-column prop="medicineSpecification" label="规格"></el-table-column>
        <el-table-column prop="medicinePrice" label="单价"></el-table-column>
      </el-table>
      </div></el-col>
    </el-row>
    
    <!-- 暂存 -->
    <el-row :gutter="20" style="margin:20px">
      <el-col :span="10"><div >
        <el-aside style="background:#eef1f6;width:500px">
          处方暂存记录
          <el-button type="primary" plain style="float:right;" @click="submitExamination(0)">暂存</el-button>
          <el-button plain style="float:right;margin-right:10px;" @click="invokeDeletePrescription">删除</el-button>
        </el-aside>
        <el-table ref="tempsavePrescriptionTable"  :data="tempsavePrescriptionTable" border
          @selection-change="handleTempSaveTableSelectionChange"
          @row-click="showTempsavePrescriptionMedicineExample">
          <el-table-column type="selection" />
          <el-table-column prop="prescriptionName" label="处方名称" />
        </el-table>
      </div></el-col>
      <el-col :span="14"><div>
        <el-table :data="tempsavePrescriptionMedicineExample" style="width: 100%">
        <el-table-column prop="nameZh" label="药品名称"></el-table-column>
        <el-table-column prop="medicineSpecification" label="规格"></el-table-column>
        <el-table-column prop="medicinePrice" label="单价"></el-table-column>
      </el-table>
      </div></el-col>
    </el-row>

    <!-- 历史 -->
    <el-row :gutter="20" style="margin:20px">
      <el-col :span="10"><div >
        <el-aside style="background:#eef1f6;width:500px">
          患者历史处方记录
        </el-aside>
        <el-table ref="historyPrescriptionTable"  :data="historyPrescriptionTable" border
          @row-click="showHistoryPrescriptionMedicineExample">
          <el-table-column prop="prescriptionName" label="处方名称" />
        </el-table>
      </div></el-col>
      <el-col :span="14"><div>
        <el-table :data="historyPrescriptionMedicineExample" style="width: 100%">
        <el-table-column prop="nameZh" label="药品名称"></el-table-column>
        <el-table-column prop="medicineSpecification" label="规格"></el-table-column>
        <el-table-column prop="medicinePrice" label="单价"></el-table-column>
      </el-table>
      </div></el-col>
    </el-row>
    <div v-show="false" id="subOutputRank-print">
      <strong>处方列表</strong>
      <br />
      <hr>
      <span
        v-for="item in chargeItemEditableTableData"
        :key="item.medicineId"
        :label="item.nameZh"
        :value="item.medicineId">
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
  import ThemePicker from '@/components/ThemePicker'
  // 可编辑table使用
  // table used
  import {Editable, EditableColumn} from 'vue-element-extends'
  import 'vue-element-extends/lib/index.css'
  import { deepClone } from '@/utils'

  import {
    fetchDepartmentList,
  } from '../../api/basicInfo/department'

  import {
    selectExaminationItemListInChargeItemByDepartmentId,
    addExamination
  } from '../../api/medicalRecord/examination'

  // pre 
  import {fetchDiseaseCategory, fetchDiseaseList} from '../../api/basicInfo/diagnosis'

  import {
    selectMedicine,
    searchMedicine,
    savePrescription,
    commonMedicine,
    deletePrescription,
    selectHistoryPrescription,
    selectPrescriptionTemplate,
  } from '../../api/medicalRecord/prescription'

  Vue.use(Editable)
  Vue.use(EditableColumn)
  Vue.component('ElxEditable', Editable)
  Vue.component('ElxEditableColumn', EditableColumn)

  export default {
  components: { ThemePicker },
  data() {
    return {
      // 基础前置信息
      doctorId: 1,      
      totalListMoney: 0,      
      prescriptionId: '',
      // 检查表单
      examForm: {
        registrationId: 1,
        disease: '',
        examinationName: '',
        requirement: '无'
      },
      // 项目表单
      chargeItemForm: {
        chargeItemId: '',
      },
      chargeItemFormVisible: false,
      chargeItemFormDisable: true,
      departmentList: [],
      chargeItemList: [],
      // 项目列表
      chargeItemEditableTableData: [],
      
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
        skinTestResult: '',
      },
      
      
      // 药品远程选择
      medicineListSelectLoading: false,
      medicineTotalList: [],
      medicineList: [],
      // 常用药对话框
      commonMedicineDialogVisible: false,
      commonMedicineListData: [],
      commonMedicineListValue: [],
      transferFilterMethod(query, item) {
        return item.nameZh.indexOf(query) > -1;
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
      historyPrescriptionMedicineExample: [],
    }
  },
  created() {
    this.invokeFetchDepartmentList()
    // pre
    this.invokeCommonMedicine()
    this.invokeSelectPrescriptionTemplate()
    // this.invokeSelectHistoryPrescription()
  },
  methods: {
    // 获取
    invokeFetchDepartmentList() {
      var query = { 'currentPage': 1, 'pageSize': 400 }
      fetchDepartmentList(query).then(response => {
        console.log('fetchDepartmentList response: ')
        console.log(response)
        this.departmentList = response.data.list
      })
    },
    forceChange() {
      this.chargeItemFormDisable = false
      this.invokeSelectExaminationItemListInChargeItemByDepartmentId()
    },
    invokeSelectExaminationItemListInChargeItemByDepartmentId() {
      var query = { 'departmentId': this.chargeItemForm.departmentId }
      selectExaminationItemListInChargeItemByDepartmentId(query).then(response => {
        console.log('selectExaminationItemListInChargeItemByDepartmentId response: ')
        console.log(response)
        this.chargeItemList = []
        this.chargeItemList = response.data
      })
    },
    insertChargeItemTable() {
      var id = this.chargeItemForm.chargeItemId
      for (var i = 0; i < this.chargeItemList.length; ++i) {
        if (this.chargeItemList[i].chargeItemId === id) {
          this.chargeItemForm = this.chargeItemList[i]
          break
        }
      }
      this.chargeItemForm.nums = 1
      this.chargeItemForm.doctorAdvice = '无'
      this.$refs.chargeItemEditableTableData.insert(this.chargeItemForm)
      this.$message({
        message: '插入数据成功！',
        type: 'success'
      })
      this.chargeItemFormVisible = false
      this.chargeItemFormDisable = true
      this.chargeItemForm = {}
    },
    submitCheck() {
      if (this.examForm.examinationName === '' || this.examForm.requirement === '') {
        this.$message.error('当前检查名称信息缺失，错误！');
        return false
      }
      if (this.chargeItemEditableTableData.length == 0 || this.chargeItemEditableTableData.length == null) {
        this.$message.error('未选中任何项目，错误！');
        return false
      }
      for (var i = 0; i < this.chargeItemEditableTableData.length; ++i) {
        if (this.chargeItemEditableTableData[i].nums == null
          || this.chargeItemEditableTableData[i].nums == ''
          || this.chargeItemEditableTableData[i].nums < 0
          ) {
          this.$message.error('项目信息缺失或错误，错误！');
          return false
        }
      }
      return true
    },
    submitExamination(saveState) {
      if (this.submitCheck() == false)
        return
      this.calculateTotalMoney()
      this.$confirm('分发药品, 合计' + this.totalListMoney + '元，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.invokeAddExamination(saveState)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });      
    },
    calculateTotalMoney() {
      this.totalListMoney = 0
      for (var i = 0; i < this.chargeItemEditableTableData.length; ++i) {
        this.totalListMoney += this.chargeItemEditableTableData[i].nums
          * this.chargeItemEditableTableData[i].price
      }
    },
    invokeAddExamination(saveState) {
      var tempList = []
      for (var i = 0; i < this.chargeItemEditableTableData.length; ++i) {
        tempList.push({
          'chargeItemId': this.chargeItemEditableTableData[i].chargeItemId,
          'nums': this.chargeItemEditableTableData[i].nums,
          'collectorId': -1, // 新增
          'doctorAdvice': this.chargeItemEditableTableData[i].doctorAdvice
        })
      }
      var examinationJson = {
        'examinationJson': {
          'registrationId': this.examForm.registrationId,
          'saveState': saveState, // 暂存 0；正式提交 1；全院模板 2；科室模板 3；医生个人模板 4
          'examName': this.examForm.examName,
          'requirement': this.examForm.requirement,
          'clinicalImpression': '',
          'examResult': '',
          'chargeEntryList': tempList
        }
      }
      console.log(examinationJson)
      addExamination(examinationJson).then(response => {
        console.log('addExamination response: ')
        console.log(response)
        this.$message({
          type: 'success',
          message: '提交成功!'
        });
        // 历史时调用
        // if (saveState === 0) {
        //   this.invokeSelectHistoryPrescription()
        // }
      })
    },
       
    
    // 常用药
    invokeCommonMedicine() {
      commonMedicine({'medicineNumber': 7}).then(response => {
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
      if (this.commonMedicineListValue.length == 0) {
        this.$message('未插入常用药')
        this.commonMedicineDialogVisible = false
        return
      }
      for (var i = 0; i < this.commonMedicineListValue.length; ++i) {
        var id = this.commonMedicineListValue[i] - 1
        this.prescriptionItem = this.medicineTotalList[id]
        this.$refs.chargeItemEditableTableData.insert(this.prescriptionItem)
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
        this.$refs.chargeItemEditableTableData.insert(this.prescriptionItem)
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
        'doctorId': this.doctorId,
      }
      selectPrescriptionTemplate(query).then(response => {
        console.log('selectPrescriptionTemplate response:')
        console.log(response)
        this.prescriptionTemplateData.push(JSON.parse(response.data))
        // this.medicineTotalList = response.data
        query.prescriptionScope = 3;
        selectPrescriptionTemplate(query).then(response => {
          this.prescriptionTemplateData.push(JSON.parse(response.data))
          query.prescriptionScope = 4;
          selectPrescriptionTemplate(query).then(response => {
            this.prescriptionTemplateData.push(JSON.parse(response.data))
            console.log(this.prescriptionTemplateData)
            
            this.prescriptionTemplateTreeData = [
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
            // 加到树形列表中
            for (var i = 0; i < 3; ++i) {
              for (var j = 0; j < this.prescriptionTemplateData[i].length; ++j) {
                this.prescriptionTemplateTreeData[i].children.push({'label': this.prescriptionTemplateData[i][j].prescriptionName})
              }
            }
          })
        })
      })
    },
    
    // 树形目录检测
    handleNodeClick(data) {
      console.log(data)
      if (data.label == '全院') {
        this.prescriptionTemplateTreeDirectory = 0
        return
      }
      if (data.label == '科室') {
        this.prescriptionTemplateTreeDirectory = 1
        return
      }
      if (data.label == '个人') {
        this.prescriptionTemplateTreeDirectory = 2
        return
      }
      var now = this.prescriptionTemplateTreeDirectory
      for (var i = 0; i < this.prescriptionTemplateData[now].length; ++i) {
        // console.log(this.medicalRecordTemplateData[now][i].templateName)
        if (this.prescriptionTemplateData[now][i].prescriptionName == data.label) {
          // console.log(this.prescriptionTemplateData[now][i])
          var tempList = JSON.parse(this.prescriptionTemplateData[now][i].medicine)
          // console.log('tempList')
          // console.log(tempList)
          this.prescriptionTemplateMedicineExample = []
          for (var j = 0; j < tempList.length; ++j) {
            this.prescriptionTemplateMedicineExample.push(this.medicineTotalList[tempList[j].medicineId-1])
          }          
          console.log(this.prescriptionTemplateMedicineExample)
          break
        }
      }
    },
    saveCurrentIntoTemplate() {
      if (this.submitCheck() == false)
        return
      if (this.saveState == '') {
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
      selectHistoryPrescription({'registrationId': this.registrationId}).then(response => {
        var tempList = JSON.parse(response.data)
        this.tempsavePrescriptionTable = []
        this.historyPrescriptionTable = []
        // console.log('selectHistoryPrescription response:')
        // console.log(tempList)
        for (var i = 0; i < tempList.length; ++i) {
          if (tempList[i].saveState === 1) {
            this.historyPrescriptionTable.push(tempList[i])
          } else if (tempList[i].saveState === 0) {
            this.tempsavePrescriptionTable.push(tempList[i])
          }
        }        
        // 0 提交 1 暂存
      }).catch(error => {
        console.log('selectHistoryPrescription error: ')
        console.log(error)
      })
    },
    handleTempSaveTableSelectionChange(val) {
      this.tempsavePrescriptionTableMultipleSelection = val
    },
    showTempsavePrescriptionMedicineExample(row, event, column) {
      var tempList = JSON.parse(row.medicine)
      this.tempsavePrescriptionMedicineExample = []
      for (var i = 0; i < tempList.length; ++i) {
        this.tempsavePrescriptionMedicineExample.push(this.medicineTotalList[tempList[i].medicineId-1])
      }
    },
    // 删除暂存的处方
    invokeDeletePrescription() {
      var tempList = []
      // console.log(this.tempsavePrescriptionTableMultipleSelection)
      for (var i = 0; i < this.tempsavePrescriptionTableMultipleSelection.length; ++i)
        tempList.push(this.tempsavePrescriptionTableMultipleSelection[i].prescriptionId)
      deletePrescription({'prescriptionIdList': tempList}).then(response => {
        this.invokeSelectHistoryPrescription()
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
      })
    },
    // 历史
    showHistoryPrescriptionMedicineExample(row, event, column) {
      var tempList = JSON.parse(row.medicine)
      this.historyPrescriptionMedicineExample = []
      for (var i = 0; i < tempList.length; ++i) {
        this.historyPrescriptionMedicineExample.push(this.medicineTotalList[tempList[i].medicineId-1])
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
