<template>
<el-card class="box-card">
  <!-- 面包屑 -->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 搜索框加按钮 -->
  <el-row class="searchArea">
    <el-col :span="24">
      <el-input
        placeholder="请输入内容"
        class="searchInput">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success">添加用户</el-button>
    </el-col>
  </el-row>
  <!-- 表格 -->
  <el-table
    style="width: 100%">
    <el-table-column
      type="index"
      prop="date"
      label="日期"
      width="100">
    </el-table-column>
    <el-table-column
      prop="date"
      label="姓名"
      width="100">
    </el-table-column>
    <el-table-column
      prop="date"
      label="邮箱"
      width="100">
    </el-table-column>
    <el-table-column
      prop="date"
      label="电话"
      width="100">
    </el-table-column>
    <el-table-column
      type="index"
      prop="date"
      label="创建日期"
      width="80">
    </el-table-column>
    <el-table-column
      prop="date"
      label="用户状态"
      width="120">
    </el-table-column>
    <el-table-column
      prop="date"
      label="操作"
      width="140">
    </el-table-column>
  </el-table>
  <!-- 分页 -->
</el-card>
</template>

<script>
export default {
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  created () {
    this.loadTableData()
  },
  methods: {
    async loadTableData () {
      const AUTH_TOKEN = sessionStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get('users?pagenum=1&pagesize=10')
      console.log(res)
    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}
.searchArea {
  margin-top: 10px;
  margin-bottom: 10px;
}
.searchArea .searchInput {
  width: 350px;
}
</style>
