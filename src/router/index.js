import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Layout from '@/views/Layout' // 首页和我的, 外框布局
import Home from '@/views/Home'
import My from '@/views/My'
import Search from '@/views/Search'
import SearchResult from '@/views/Search/SearchResult'
import Article from '@/views/Article'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/layout',
    component: Layout,
    name: 'Layout',
    redirect: '/layout/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home
      },
      {
        path: 'my',
        name: 'My',
        component: My
      }
    ]
  },
  {
    path: '/search',
    name: 'Search', // 以后改了path也不影响name的跳转方式
    component: Search
  },
  {
    path: '/search_result/:kw',
    name: 'SearchResult',
    component: SearchResult
  },
  {
    path: '/detail/:a_id',
    name: 'ArticleDetail',
    component: Article
  }
]

const router = new VueRouter({
  routes
})

export default router
