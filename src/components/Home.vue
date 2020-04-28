<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商平台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse == true ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
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
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      menuList: [],
      iconObj: {
        '101': 'iconfont icon-certified-supplier',
        '104': 'iconfont icon-online-tracking',
        '106': 'iconfont icon-product',
        '108': 'iconfont icon-tool',
        '110': 'iconfont icon-CurrencyConverter'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getMenuList() {
      this.menuList = [
        {
          id: 101,
          authName: '用户管理',
          path: null,
          children: [
            {
              id: 102,
              authName: '用户列表',
              path: 'users',
              children: []
            }
          ]
        },
        {
          id: 104,
          authName: '权限管理',
          path: null,
          children: [
            {
              id: 105,
              authName: '角色列表',
              path: 'roles',
              children: []
            },
            {
              id: 103,
              authName: '权限列表',
              path: 'rights',
              children: []
            }
          ]
        },
        {
          id: 106,
          authName: '商品管理',
          path: null,
          children: [
            {
              id: 107,
              authName: '商品列表1',
              path: null,
              children: []
            }
          ]
        },
        {
          id: 108,
          authName: '订单管理',
          path: null,
          children: [
            {
              id: 109,
              authName: '订单列表1',
              path: null,
              children: []
            }
          ]
        },
        {
          id: 110,
          authName: '数据统计',
          path: null,
          children: [
            {
              id: 111,
              authName: '统计列表1',
              path: null,
              children: []
            }
          ]
        }
      ]
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath) {
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
    letter-spacing: 0.2em;
}
</style>
