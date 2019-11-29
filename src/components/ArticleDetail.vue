<template>
    <div class="articleDetail">
        <div class="detail-header">
            <img :src="contents.image" style="width:100%;height:100%">
            <div class="header-title-container">
                <div class="header-article-title">{{contents.title}}</div>
                <div class="header-article-source"><span>{{contents.image_source}}</span></div>
            </div>
        </div>
        <div v-html="contents.body" class="article-content-class"></div>
        <div class="detail-bottom-bar">
            <div class="bottom-bar-item bottom-bar-item-fixed" @click="goBack">
                <img src="../assets/left.png">
            </div>
            <div class="bottom-bar-item" @click="goToComment">
                <img src="../assets/pinglun.png">
                <div class="item-extra-info">{{extraInfo.comments}}</div>
            </div>
            <div class="bottom-bar-item">
                <img src="../assets/dianzan.png">
                <div class="item-extra-info">{{extraInfo.popularity}}</div>
            </div>
            <div class="bottom-bar-item">
                <img src="../assets/shoucang.png">
            </div>
            <div class="bottom-bar-item">
                <img src="../assets/fenxiang.png">
            </div>
        </div>
        <transition name="fade">
            <loading v-if="isLoading"></loading>
        </transition>
    </div>
</template>
<script>
import $ from '../util.js';
import Loading from '@/components/loading';
export default {
    name:'ArticleDetail',
    components:{
        Loading
    },
    data () {
        return {
            isLoading:false,
            contents:{
                body:'',
                image_source:'',
                title:'',
                image:'',
                share_url:'',
                js:[],
                ga_prefix:'',
                images:[],
                type:0,
                id:'',
                css:[]
            },
            extraInfo:{
                long_comments:0,
                popularity:0,
                short_comments:0,
                comments:0
            }
        }
    },
    mounted (){
        var _this=this;
        this.isLoading=true;
        this.getArticleExtra(function(extraInfo){
            _this.getArticleContents(function(contents){
                for(var i=0;i<contents.css.length;i++){
                    const link = document.createElement('link')
                    link.type = 'text/css';
                    link.rel = 'stylesheet';
                    link.href = contents.css[i];
                    document.head.appendChild(link);
                }

                for(var i=0;i<contents.js.length;i++){
                    const script = document.createElement('script')
                    script.type = 'text/javascript';
                    script.src = contents.js[i];
                    document.body.appendChild(script);
                }
                document.getElementsByClassName('headline')[0].style="display:none";
                _this.isLoading=false;
            });
        })
        
    },
    methods: {
        getArticleContents:function (callback) {
            var _this=this;
            var art_contents=JSON.parse(localStorage.getItem('art_contents'));
            if(art_contents){
                _this.contents=art_contents;
                _this.$nextTick(()=>{
                    if(callback)callback(art_contents);
                })
            }else{
                $.ajax.get('news/'+_this.$route.params.id).then(res=>{
                    _this.contents=res;
                    localStorage.setItem('art_contents',JSON.stringify(res));
                    _this.$nextTick(()=>{
                        if(callback)callback(res);
                    })
                })
            }
            
        },
        getArticleExtra:function(callback){
            var _this=this;
            var art_extraInfo=JSON.parse(localStorage.getItem('art_extraInfo'));
            if(art_extraInfo){
                _this.extraInfo=art_extraInfo;
                _this.$nextTick(()=>{
                    if(callback)callback(art_extraInfo);
                })
            }else{
                $.ajax.get('story-extra/'+_this.$route.params.id).then(res=>{
                    _this.extraInfo=res;
                    localStorage.setItem('art_extraInfo',JSON.stringify(res));
                    _this.$nextTick(()=>{
                        if(callback)callback(res);
                    })
                })
            }
            
        },
        goBack (){
            this.$router.go(-1);
        },
        goToComment () {
            var articleId=this.$route.params.id;
            this.$router.push('/comment/'+articleId);
        }
    }
}
</script>

<style scoped>
@import '../styles/ArticleDetail.css'
</style>
