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
        v-model="searchVal"
        placeholder="请输入内容"
        class="searchInput">
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="checkUser()">
        </el-button>
      </el-input>
      <el-button
        type="success"
        @click="showAddUserDia()"
        >添加用户</el-button>
    </el-col>
  </el-row>
  <!-- 添加用户对话框 -->
  <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdduser">
    <el-form :model="formData">
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input v-model="formData.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input type="password" v-model="formData.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth">
        <el-input v-model="formData.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="电话" :label-width="formLabelWidth">
        <el-input v-model="formData.mobile" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser()">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 表格 -->
  <el-table
    v-loading="loading"
    :data="list"
    style="width: 100%">
    <el-table-column
      type="index"
      label="#"
      width="80">
    </el-table-column>
    <el-table-column
      prop="username"
      label="姓名"
      width="120">
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱"
      width="180">
    </el-table-column>
    <el-table-column
      prop="mobile"
      label="电话"
      width="160">
    </el-table-column>
    <el-table-column
      label="创建日期"
      width="180">
      <template slot-scope="scope">
        {{scope.row.create_time | fmtDate}}
      </template>
    </el-table-column>
    <el-table-column
      label="用户状态"
      width="120">
      <template slot-scope="scope">
        <el-switch
          @change="changeSwitchMgstate(scope.row)"
          v-model="scope.row.mg_state"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      width="140">
      <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini" plain circle @click="showEditBox()"></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" plain circle @click="showDeleBox(scope.row.id)"></el-button>
        <el-button type="success" icon="el-icon-check" size="mini" plain circle></el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[2, 4, 6, 8]"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>
</el-card>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      loading: false,
      currentPage: 1,
      total: 0,
      pagesize: 2,
      pagenum: 1,
      searchVal: '',
      dialogFormVisibleAdduser: false,
      formData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      formLabelWidth: '100px',
      dialogFormVisibleEdituser: false
    }
  },
  created () {
    this.loadTableData()
  },
  methods: {
    async loadTableData () {
      this.loading = true
      const AUTH_TOKEN = sessionStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchVal}`)
      const {meta: {status}, data: {users}} = res.data
      if (status === 200) {
        this.loading = false
        this.list = users
        this.pagenum = 1
        this.pagesize = 2
        this.currentPage = 1
      }
      this.total = res.data.data.total
    },
    // 分页相关
    handleSizeChange (val) {
      this.pagesize = val
      this.loadTableData()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.loadTableData()
    },
    // 查询用户
    checkUser () {
      this.loadTableData()
    },
    // 改变用户状态
    async changeSwitchMgstate (user) {
      // users/:uId/state/:type
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      const {meta: {status, msg}} = res.data
      if (status === 200) {
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    },
    // 删除提示框
    showDeleBox (userId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`users/${userId}`)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.loadTableData()
          this.$message({
            type: 'success',
            message: msg
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加用户的方法(显示添加的对话框)
    showAddUserDia () {
      this.dialogFormVisibleAdduser = true
    },
    // 添加用户
    async addUser () {
      this.dialogFormVisibleAdduser = false
      const res = await this.$http.post('users', this.formData)
      const {meta: {status, msg}} = res.data
      if (status === 201) {
        this.$message.success(msg)
        this.formData = {
          username: '',
          password: '',
          email: '',
          mobile: ''
        }
        this.loadTableData()
      }
    },
    // 编辑用户(显示对话框)
    showEditBox () {
      this.dialogFormVisibleEdituser = true
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
