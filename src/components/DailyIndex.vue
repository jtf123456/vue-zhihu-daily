<template>
  <div class="daily-index">
    <div class="zhihu-top-bar">
      <div class="top-bar-date">
        <div class="p1">{{nowDate}}</div>
        <div class="p2">{{nowMonth}}</div>
      </div>
      <div class="top-bar-title">知乎日报</div>
      <div class="top-bar-avatar">
        <img class="zhihu-user-avatar" src="../assets/avatar.jpg" alt="用户头像">
      </div>
    </div>
    <div class="index-swiper-container">
      <swiper :options="swiperOption" ref="mySwiper">
        <!-- slides -->
        <swiper-slide v-for="item in topStories" :key="item.id">
          <img referrer="no-referrer|origin|unsafe-url" class="swiper-img" :src="item.image">
          <div class="swiper-title-container">
            <div class="swiper-article-title">{{item.title}}</div>
            <div class="swiper-article-author">{{item.hint}}</div>
          </div>
        </swiper-slide>
        <!-- Optional controls -->
        <div class="swiper-pagination"  slot="pagination"></div>
      </swiper>
    </div>
    <div class="index-last-stories">
      <div class="story-item" v-for="item in lastStories" :key="item.id" @click="pathToDetail(item)">
        <div class="story-item-left">
          <div :class="['item-story-title',item.isRead?'item-story-title-read':'']">{{item.title}}</div>
          <div class="item-story-author">{{item.hint}}</div>
        </div>
        <div class="story-item-right">
          <img class="item-story-img" :src="item.images[0]" alt="文章缩略图">
        </div>
      </div>
    </div>
    <div class="index-before-stories">
      <div class="item-day-stories" v-for="(item,index) in beforeStories" :key="index">
        <div class="day-stories-bar">
          <div class="stories-bar-date">
              <span v-if="item.date.substr(0,4)!=new Date().getFullYear()">{{item.date.substr(0,4)}}年</span>
              <span>{{item.date.substr(4,2)}}月</span>
              <span>{{item.date.substr(6,2)}}日</span>
          </div>
          <div class="stories-bar-line"></div>
        </div>
        <div class="story-item" v-for="item1 in item.stories" :key="item1.id" @click="pathToDetail(item1)">
          <div class="story-item-left">
            <div :class="['item-story-title',item1.isRead?'item-story-title-read':'']">{{item1.title}}</div>
            <div class="item-story-author">{{item1.hint}}</div>
          </div>
          <div class="story-item-right">
            <img class="item-story-img" :src="item1.images[0]" alt="文章缩略图">
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <loading v-if="isLoading"></loading>
    </transition>
  </div>
</template>

<script>
import $ from '../util.js';
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

import Loading from '@/components/loading';

export default {
  name: 'DailyIndex',
  components: {
    swiper,
    swiperSlide,
    Loading
  },
  data () {
    return {
      endDate:{
        year:new Date().getFullYear(),
        month:new Date().getMonth(),
        date:new Date().getDate()
      },
      lastStories:[],
      topStories:[],
      isLoading:false,
      beforeStories:[],
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
        },
        autoplay:{
          delay:5000
        },
        loop:true
      }
    }
  },
  computed:{
    swiper() {
      return this.$refs.mySwiper.swiper
    },
    nowMonth:function(){
      var today=new Date();
      var month_index=today.getMonth();
      var months_zh=['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月']
      return months_zh[month_index];
    },
    nowDate:function(){
      var today=new Date();
      var date=today.getDate();
      return date;
    }
  },
  methods:{
    getLastStories (callback) {
      var _this=this;
      $.ajax.get('news/latest').then(res=>{
        res.stories.forEach(element => {
          element.isRead=false;
        });
        _this.lastStories=res.stories;
        _this.topStories=res.top_stories;
        _this.$nextTick(()=> {
          if(callback){
            callback();
          }
        })
      })
    },
    getBeforeStories (callback) {
      var _this=this;
      var _ajaxMonth=(_this.endDate.month+1)<10?'0'+(_this.endDate.month+1):(_this.endDate.month+1);
      var _ajaxDate=_this.endDate.date<10?'0'+_this.endDate.date:_this.endDate.date;
      $.ajax.get('news/before/'+_this.endDate.year+_ajaxMonth+_ajaxDate).then(res=>{
        res.stories.forEach(element => {
          element.isRead=false;
        });
        _this.beforeStories.push(res);
        var endTimeObj=new Date(Date.parse(this.endDate.year+'/'+_ajaxMonth+'/'+_ajaxDate));
        var beforeEndTime=new Date(endTimeObj.getTime()-24*60*60*1000);
        _this.endDate={
          year:beforeEndTime.getFullYear(),
          month:beforeEndTime.getMonth(),
          date:beforeEndTime.getDate()
        }
        _this.$nextTick(()=> {
          if(callback){
            callback();
          }
        })
      })
    },
    pathToDetail (item){
      item.isRead=true;
      this.$router.push('/ArticleDetail/'+item.id);
    }
  },
  mounted () {
    var _this=this;
    _this.isLoading = true;
    this.getLastStories(function(){
      _this.getBeforeStories(function(){
        _this.isLoading = false;
      });
    });
    
    this.swiper.on('click', function () {
      var clickId=_this.topStories[this.clickedIndex].id;
      _this.$router.push('/ArticleDetail/'+clickId);
    })
    window.onscroll = () => {
        // 距离底部200px时加载一次
      let bottomOfWindow = document.documentElement.offsetHeight - document.documentElement.scrollTop - window.innerHeight <= 200;
      if (bottomOfWindow && _this.isLoading == false) {
          _this.isLoading = true;
          _this.getBeforeStories(function(){
            _this.isLoading = false;
          });
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../styles/DailyIndex.css';
</style>
