import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Recommend from '../components/recommend/recommend'
import Rank from '../components/rank/rank'
import Search from '../components/search/search'
import Singer from '../components/singer/singer'
import SingerDetail from '../components/singer-detail/Singer-detail'

export default new Router({
  routes: [
    {
      path: '/recommend',
      component: Recommend
    }, {
      path: '/rank',
      component: Rank
    }, {
      path: '/search',
      component: Search
    }, {
      path: '/singer',
      component: Singer,
      children: [{
        path: ':id',
        component: SingerDetail
      }]
    }
  ]
})
