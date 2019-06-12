<template>
  <div>
    <el-button type="" @click="test()"></el-button>
  </div>
</template>

<script>
import hljs from 'highlight.js'
import XLSX from 'xlsx'
export default {
  data () {
    return {
      
    }
  },   
  methods: {
    test() {
      const { fullPath } = this.$route
      this.$router.replace({
        path: '/redirect' + "/registration/registration"
      })
    },
    
  }
}
</script>