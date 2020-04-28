<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索和添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="query" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="queryInfo.users" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="rolename" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="shouEditDialog()"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryInfo.total"
      ></el-pagination>
      <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
           <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
           <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
           <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    // 校验邮箱
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 校验手机号
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[12356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      //   queryInfo: {
      //     query: '',
      //     pagenum: 1,
      //     pagesize: 2
      //   }
      pagesize: 2,
      query: '',
      addDialogVisible: false,
      // 添加表单
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加验证
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      queryInfo: {
        pagenum: 1,
        total: 4,
        users: [
          {
            id: 500,
            rolename: '超级管理员',
            username: 'admin',
            create_time: 148720211,
            mobile: '18110393333',
            type: 1,
            email: 'smartfeng@163.com',
            mg_state: true
          },
          {
            id: 502,
            rolename: 'c测试角色',
            username: 'linken',
            create_time: 148720255,
            mobile: '18210393357',
            type: 1,
            email: 'smartfwb@163.com',
            mg_state: false
          }
        ]
      }
    }
  },
  created() {
    // this.getUserList()
  },
  methods: {
    // async getUserList() {
    //   const { data: res } = await this.$http.get('users', {
    //     params: this.queryInfo
    //   })
    //   if(res.meta.status !== 200) return this.$message.error('获取用户列表失败')
    //   this.userlist = res.data.users
    //   this.total = res.data.total
    // }
    handleSizeChange(newsize) {
      console.log(newsize)
      this.pagesize = newsize
      // this.getUserList()
    },
    handleCurrentChange(newpage) {
      console.log(newpage)
      this.queryInfo.pagenum = newpage
      // this.getUserList()
    },
    addDialogClosed() {
    //   this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        // const { data: res } = await this.$http.post('users', this.addForm)
        // if (res.meta.status !== 201) {
        //   this.$message.error('添加用户失败')
        // }
        // this.$message.success('添加用户成功')
        // this.addDialogVisible = false
        // this.getUserList()
        this.queryInfo.users.push(this.addForm)
        // this.addDialogVisible = false
      })
    }
    // 监听switch开关状态的改变
    // async userStateChange(userinfo) {
    //   const {data: res} =  await this.$http.put(
    //       `users/${userinfo.id}/state/${userinfo.mg_state}`
    //   )
    //   if(res.meta.status !== 200) {
    //       userinfo.mg_state = !userinfo.mg_state
    //       return this.$message.error('更新用户状态失败')
    //   }
    //   this.$message.success('更新用户状态成功')
    // }
  }
}
</script>

<style lang='less' scoped>
</style>
