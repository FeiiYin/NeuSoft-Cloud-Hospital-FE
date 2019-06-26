## 这里记录了我在编码过程中遇到的问题

+ TypeError: handler.apply is not a function
  Error in v-on handler: "TypeError: handler.apply is not a function"

  .vue单文件中 data里面的属性和methods里面的方法重名了

+ vue.runtime.esm.js:619 [Vue warn]: Error in render: "RangeError: Invalid array length"
  vue.runtime.esm.js:1888 RangeError: Invalid array length

  无效的数组错误长度
  
  https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Errors/Invalid_array_length

+ 父组件异步调用子组件

  https://segmentfault.com/q/1010000016643069

  https://www.cnblogs.com/mophy/p/8590291.html  采用该方法

  tabPane 调用是个数组，tabPane[0]

+ 赋值出现无限递归爆栈

  this.diseaseEditableTableData[j].disease = this.diseaseEditableTableData[j]

  [Vue warn]: Error in callback for watcher "data": "RangeError: Maximum call stack size exceeded"

  RangeError: Maximum call stack size exceeded
  
+ 测试遇到的问题
 
  小数显示金额 too hard
  挂号未保定应付金额 done
  成功改完成 done
  按时间倒叙显示  done
  patientListSearch 状态显示错误 done
  数量非正数的检测 done
  registrationCharge 挂号类别不能正常显示 done
  检查项目插入出现更多的 done
  checkOut少传参数 done
 
  选择挂号类型 快速计算金额 done ? 
  添加时去除重复元素 done
  实际找零错误 done
  可以坐回车 done
  处方设置初始值  done
  钱的快速计算 done
  
  当前进度 done
  诊断完毕 删除成功提示错误 done
  诊断完毕跳转错误 done
  挂号列表不显示总共金额 done
  诊断完毕，查询，列表显示 错误 不应该在前面还出现 done
  
  挂号新类型列表的渲染
  药房显示的错误 
  模板类别错误 做模板时再做 