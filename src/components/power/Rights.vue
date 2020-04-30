<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class='box-card'>
      <el-table :data="rightsList" border >
          <el-table-column type="index"></el-table-column>
          <el-table-column label="权限名称" prop="authName"></el-table-column>
          <el-table-column label="路径" prop="path"></el-table-column>
          <el-table-column label="权限等级" prop="level">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level === '0'">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
              <el-tag type="warning" v-else>三级</el-tag>
            </template>
          </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      //  权限列表
      rightsList: [
        {
          'id': 101,
          'authName': '商品管理',
          'level': '0',
          'pid': 0,
          'path': 'goods'
        },
        {
          'id': 102,
          'authName': '订单管理',
          'level': '1',
          'pid': 0,
          'path': 'bill'
        },
        {
          'id': 103,
          'authName': '权限管理',
          'level': '0',
          'pid': 0,
          'path': 'right'
        },
        {
          'id': 104,
          'authName': '商品列表',
          'level': '1',
          'pid': 0,
          'path': 'goods'
        }
      ]
    }
  },
  created() {
    //   this.getRightsList()
  },
  methods: {
    //  获取用户列表
    async gegetRightsListt() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$messges.error('获取权限列表失败')
      }
      this.rightsList = res.data
    }
  }
}
</script>

<style lang='less' scoped>

</style>
