<template>
<div class="auth-user-list">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>XXXXX</el-breadcrumb-item>
        <el-breadcrumb-item>编辑XXX</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
        <div class="content-title">编辑XXXX</div>
        <p style="text-align: center; margin: 0 0 20px"></p>
        <div style="text-align: center">
            <el-transfer
            style="text-align: left; display: inline-block;height: 500px;"
            v-model="value3"
            filterable
             filter-placeholder="请输入用户名称"
            :left-default-checked="[2, 3]"
            :right-default-checked="[1]"
            :render-content="renderFunc"
            :titles="['用户列表', '用户列表']"
            :button-texts="['到左边', '到右边']"
            @change="handleChange"
            :data="data">
            <el-button class="transfer-footer" slot="right-footer" size="small" @click="savaUser">保存</el-button>
            </el-transfer>
            <p style="text-align: center; margin: 0 0 20px"></p>
        </div>
    </div>
</div>
</template>
<style >
.auth-user-list {
.block-header {
    font-size: 12px !important;
    margin-top: 5px;
}
.transfer-footer {
    margin-left: 20px;
    padding: 6px 5px;
}
.el-transfer-panel {
    width: 300px;
}
}
</style>
<style scoped>
.search {
margin-left: 10px;
}
.page-block {
text-align: right;
margin-top: 10px;
}
</style>
<script>
export default {
data() {
    const generateData = _ => {
    const data = [];
    for (let i = 1; i <= 4; i++) {
        data.push({
        key: i,
        label: `备选项 ${i}`,
        disabled: i % 4 === 0
        });
    }
    return data;
    };
    return {
    realName: "",
    groupId: $.trim(this.$route.params.groupId),
    data: generateData(),
    pinyin: [],
    value3: [],
    filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1;
    },
    renderFunc(h, option) {
        return (
        <span>
            {option.label}   //页面展示的数据
        </span>
        );
    }
    };
},
watch: {},
computed: {},
methods: {
    handleChange(value, direction, movedKeys) {
    // console.log(value);
    },
    /**
    * 获取列表数据
    **/
    getUserInfo: function() {
    let me = this;
    //清空数据
    me.data = [];
    me.value3 = [];
    me.$ajax
        .getUserInfoPage(
        {},
        {
            type: "POST"
        }
        )
        .then(users => {
        if (users) {
            users.res.forEach(function(c, index) {
            me.pinyin.push(c.realname);
            me.data.push({
                key: c.rightUserId,
                label: c.realname,
                // disabled: i % 4 === 0
                pinyin: me.pinyin[index]     //添加数据时设置pinyin的索引
            });
            });
        }
        });

    me.$ajax
        .getUserInfoPageByGroupId(
        {
            realName: $.trim(this.realName),
            groupId: $.trim(this.$route.params.groupId)
        },
        {
            type: "POST"
        }
        )
        .then(users => {
        if (users) {
            users.res.forEach(function(c) {
            me.value3.push(c.rightUserId);
            });
        }
        });
    },
    //保存用户关系
    savaUser() {
    this.$ajax
        .savaUser(
        {
            userIdList: this.value3,
            groupId: $.trim(this.$route.params.groupId)
        },
        {
            type: "POST"
        }
        )
        .then(res => {
        this.getUserInfo();
        this.$message({
            type: "success",
            message: "保存成功"
        });
        });
    },
},
mounted() {
    //加载用户信息
    this.getUserInfo();
}
};
</script>