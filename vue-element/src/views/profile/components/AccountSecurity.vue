<template>
  <el-form>
    <el-form-item>
      <el-input v-model="user.newPassword" placeholder="新密码" show-password />
    </el-form-item>
  </el-form>

</template>

<script>
export default {
  data() {
    return {
      value1: true,
      value2: true
    }
  }
}
</script>

<style scoped>

</style>
