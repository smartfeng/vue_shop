<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span class="title_logo">电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse == true ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">&lt;&gt;</div>
        <el-menu :default-active="activePath" router :collapse="isCollapse" :collapse-transition="false" unique-opened background-color="#333744" text-color="#fff" active-text-color="#409eff">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item @click="saveNavState('/' + items.path)" :index="'/' + items.path + ''" v-for="items in item.children" :key="items.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{items.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    // 初始化菜单
    this.getMenuList()
    // 储存当前路径的状态，显示高亮
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      // 菜单列表
      menuList: [],
      // 菜单的图标项
      iconObj: {
        '125': 'iconfont icon-certified-supplier',
        '103': 'iconfont icon-online-tracking',
        '101': 'iconfont icon-product',
        '102': 'iconfont icon-tool',
        '145': 'iconfont icon-CurrencyConverter'
      },
      // 折叠菜单
      isCollapse: false,
      // 当前菜单高亮
      activePath: ''
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 请求菜单接口
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 给侧边栏数据赋值
      this.menuList = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存菜单高亮的当前的状态
    saveNavState(activePath) {
      // 保存到本地
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang='less' scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
      border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
    margin-right: 10px;
}
.toggle-button {
    background-color: #333;
    text-align: center;
    line-height: 24px;
    color: #fff;
    cursor: pointer;
    letter-spacing: 0.15em;
}
.title_logo{
    font-size: 18px;
}
</style>
