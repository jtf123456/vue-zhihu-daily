import Vue from 'vue'
import Router from 'vue-router'
import DailyIndex from '@/components/DailyIndex'
import ArticleDetail from '@/components/ArticleDetail'
import Comment from '@/components/Comment'
Vue.use(Router)
const router= new Router({
  routes: [
    {
      path: '/',
      name: 'DailyIndex',
      component: DailyIndex,
    },
    {
      path:'/ArticleDetail/:id',
      name:'ArticleDetail',
      component:ArticleDetail
    },
    {
      path:'/Comment/:id',
      name:'Comment',
      component:Comment
    }
  ]
})
router.afterEach((to,from) => {
  if(from.name=='ArticleDetail'&&to.name!='Comment'){
      localStorage.removeItem('art_contents');
      localStorage.removeItem('art_extraInfo');
  }
})
export default router
