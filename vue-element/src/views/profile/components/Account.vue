<template>
  <el-form>
    <el-form-item label="姓名">
      <el-input v-model.trim="user.name" :disabled="true" />
    </el-form-item>
    <el-form-item label="身份">
      <el-input v-model.trim="user.jobTitle" :disabled="true" />
    </el-form-item>
    <el-form-item label="科室">
      <el-input v-model.trim="user.departmentName" :disabled="true" />
    </el-form-item>

    <el-form-item label="参与排班">
      <el-switch
        v-model.trim="user.doctorScheduling"
        style="display: block"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="是"
        inactive-text="否"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  user: {
    name: '',
    jobTitle: '',
    departmentName: '',
    doctorScheduling: true
  },
  methods: {
    submit() {
      this.$message({
        message: 'User information has been updated successfully',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>
