<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class='box-card'>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
              <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                  <el-col :span="5">
                    <el-tag closable @close="removeRightById(scope.row, item1.id)">
                      {{item1.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <el-row :class="['bdtop', i2 === 0 ? 'bdtop': '', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                      <el-col :span="6">
                        <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">
                            {{item2.authName}}
                        </el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="18">
                        <el-tag closable type="warning" v-for="item3 in item2.children" :key="item3.id" @close="removeRightById(scope.row, item3.id)">
                            {{item3.authName}}
                        </el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
              </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRole(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限 -->
    <el-dialog
    title="分配权限"
    :visible.sync="showSetDialogVisible"
    width="50%"
    @close="setRightDialogClosed">
    <el-tree :data="rightList" :props="treeProps" show-checkbox node-key="id" default-expand-all ref="treeRef" :default-checked-keys="defKeys"></el-tree>
    <span slot="footer" class="dialog-footer">
        <el-button @click="showSetDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights" >确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showSetDialogVisible: false,
      // 树形控件的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 当前即将分配权限的角色id
      roleId: '',
      defKeys: [],
      // 获取所有权限的数据
      rightList: [],
      rolelist: []
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolelist = res.data
    },
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm('是否删除该y用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //   用户确认删除，返回confirm，取消删除，返回cancel
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      console.log(role.id, rightId)
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$$message.error('删除权限失败')
      }
      //   this.getRolesList()  不要调取这个函数，会刷新列表，删除的接口有返回删除后的数据
      role.children = res.data// 给数据赋值
    },
    // 分配权限
    async showSetRightDialog(role) {
      // 给当前即将分配角色权限用的id
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限失败')
      }
      this.rightList = res.data
      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.showSetDialogVisible = true
    },
    // 获取三级节点的所有id,通过递归
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听对话框的关闭，清空数组
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 为角色分配角色
    async allotRights() {
      // 展开运算符合并到一个数组
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      // 数组转为逗号拼接的字符串
      const idStr = keys.join(',')
      // 角色分配的请求, 从打开对话框那里拿到权限id，roleId
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      // 重新刷新列表
      this.getRolesList()
      this.showSetDialogVisible = false
    }
  }
}
</script>

<style lang='less' scoped>
.el-tag{
    margin: 7px;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>
