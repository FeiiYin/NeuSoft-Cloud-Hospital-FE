<template>
  <div class="app-container">
    <aside>
      <span>药品管理</span>
    </aside>
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="2" style="padding:10px;">
            <span style="float:right;">药品名称</span>
          </el-col>
          <el-col :span="5">
            <el-input
              v-model="medicineName"
              placeholder="请输入"
              suffix-icon="el-icon-search"
            />
          </el-col>
          <el-col :span="2" style="padding:10px;">
            <span style="float:right;">制药公司</span>
          </el-col>
          <el-col :span="5">
            <el-input
              v-model="medicineFactory"
              placeholder="请输入"
              suffix-icon="el-icon-search"
            />
          </el-col>
          <el-col :span="2" style="padding:10px;">
            <span style="float:right;">拼音码</span>
          </el-col>
          <el-col :span="5">
            <el-input
              v-model="medicinePinyin"
              placeholder="请输入"
              suffix-icon="el-icon-search"
            />
          </el-col>
          <el-col :span="3" style="padding-left:30px;">
            <el-button type="primary" style="float:right;" @click="searchMedicineWithInfo">
              <svg-icon icon-class="component" />
              确认
            </el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-table
          ref="pageMedicineTableData"
          v-loading="pageMedicineTableLoading"
          :data="pageMedicineTableData"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" />
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="药品名称">
                  <span>{{ props.row.nameZh }}</span>
                </el-form-item>
                <el-form-item label="药品编码">
                  <span>{{ props.row.medicineCode }}</span>
                </el-form-item>
                <el-form-item label="药品规格">
                  <span>{{ props.row.medicineSpecification }}</span>
                </el-form-item>
                <el-form-item label="药品单位">
                  <span>{{ props.row.medicineUnit }}</span>
                </el-form-item>
                <el-form-item label="生产厂商">
                  <span>{{ props.row.medicineManufacturer }}</span>
                </el-form-item>
                <el-form-item label="药品剂量">
                  <span>{{ props.row.medicineDosageId }}</span>
                </el-form-item>
                <el-form-item label="药品单价">
                  <span>{{ props.row.medicinePrice }}</span>
                </el-form-item>
                <el-form-item label="药品拼音">
                  <span>{{ props.row.namePinyin }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="medicineId"
            label="药品编号"
          />
          <el-table-column
            prop="nameZh"
            label="药品名称"
          />
          <el-table-column
            prop="medicineCode"
            label="药品编码"
          />
          <el-table-column
            prop="namePinyin"
            label="拼音码"
          />
        </el-table>
        <div class="block">
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
  </div>
</template>

<script>
import {
  selectMedicine
} from '../../api/medicalRecord/prescription'

export default {
  data() {
    return {
      // 输入框
      medicineFactory: '',
      medicineName: '',
      medicinePinyin: '',
      // 表格
      medicineTotalList: [],
      pageMedicineTableData: [],
      pageMedicineTableLoading: false,
      // 多选
      multipleSelection: [],
      // 分页
      currentPage: 1, // 当前页码
      pageSize: 50, // 页码大小
      totalNumber: 0,
      // medicine 属性
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
      }
    }
  },
  created() {
    this.invokeSelectMedicine()
  },
  methods: {
    // 检索
    searchMedicineWithInfo() {
      if (this.medicineName === '' && this.medicineFactory === '' && this.medicinePinyin === '') {
        this.handleTableDataPageChange()
        return
      }
      var tempList = []
      var path = ''
      if (this.medicineName !== '') {
        path += 'a'
        tempList = this.medicineTotalList.filter(item => {
          return item.nameZh.toLowerCase()
            .indexOf(this.medicineName.toLowerCase()) > -1
        })
      }
      if (path === '') {
        if (this.medicineFactory !== '') {
          path += 'b'
          tempList = this.medicineTotalList.filter(item => {
            return item.medicineManufacturer
              .indexOf(this.medicineFactory) > -1
          })
        }
      } else {
        if (this.medicineFactory !== '') {
          path += 'b'
          tempList = tempList.filter(item => {
            return item.medicineManufacturer
              .indexOf(this.medicineFactory) > -1
          })
        }
      }
      if (path === '') {
        if (this.medicinePinyin !== '') {
          path += 'c'
          tempList = this.medicineTotalList.filter(item => {
            return item.namePinyin.toLowerCase()
              .indexOf(this.medicinePinyin.toLowerCase()) > -1
          })
        }
      } else {
        if (this.medicinePinyin !== '') {
          path += 'c'
          tempList = tempList.filter(item => {
            return item.namePinyin.toLowerCase()
              .indexOf(this.medicinePinyin.toLowerCase()) > -1
          })
        }
      }
      this.pageMedicineTableData = tempList
      console.log('now path ' + path)
    },
    // 获取药品列表
    invokeSelectMedicine() {
      selectMedicine().then(response => {
        this.medicineTotalList = response.data
        this.totalNumber = this.medicineTotalList.length
        for (var i = 0; i < this.totalNumber; ++i) {
          if (this.medicineTotalList[i].medicineManufacturer == null) {
            this.medicineTotalList[i].medicineManufacturer = ''
          }
          // if (this.medicineTotalList[i].namePinyin == null) {
          //   this.medicineTotalList[i].namePinyin = ''
          // }
        }
        this.handleTableDataPageChange()
        console.log(this.medicineTotalList)
      }).catch(error => {
        console.log('selectMedicine error: ')
        console.log(error)
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.handleTableDataPageChange()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.handleTableDataPageChange()
    },
    handleTableDataPageChange() {
      this.pageMedicineTableLoading = true
      var start = this.pageSize * (this.currentPage - 1)
      var end = this.pageSize * this.currentPage
      if (end > this.totalNumber) { end = this.totalNumber }
      this.pageMedicineTableData = []
      for (var i = start; i < end; ++i) {
        this.pageMedicineTableData.push(this.medicineTotalList[i])
      }
      this.pageMedicineTableLoading = false
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
