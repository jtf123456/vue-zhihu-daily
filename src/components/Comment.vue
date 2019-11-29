<template>
    <div class="comment">
        <div class="comment-top-bar">
            <div class="top-bar-icon" @click="goBackToArtcleDetail"><img src="../assets/left.png"></div>
            <div class="top-bar-info">{{commentsTotal}}条评论</div>
        </div>
        <div style="height:50px;"></div>
        <div class="long-comments-content" v-if="longComments.length>0">
            <div class="comments-title">{{longComments.length}}条长评</div>
            <div class="item-comment" v-for="item in longComments" :key="item.id">
                <div class="item-comment-left">
                    <img :src="item.avatar">
                </div>
                <div class="item-comment-right">
                    <div class="comment-right-header">
                        <div class="right-header-author">{{item.author}}</div>
                        <div class="right-header-buttons"><img src="../assets/buttons.png"></div>
                    </div>
                    <div class="comment-right-body">
                        <p v-for="(item1,index1) in item.content" :key="index1">{{item1}}</p>
                    </div>
                    <div class="comment-right-footer">
                        <span v-time="item.time*1000"></span>
                        <div class="right-footer-likes">
                            <div class="footer-likes-num">{{item.likes}}</div>
                            <img src="../assets/dianzan.png">
                        </div>
                        <div class="right-footer-reply">
                            <img src="../assets/pinglun.png">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="short-comments-content" v-if="shortComments.length>0">
            <div class="comments-title">{{shortComments.length}}条短评</div>
            <div class="item-comment" v-for="item in shortComments" :key="item.id">
                <div class="item-comment-left">
                    <img :src="item.avatar">
                </div>
                <div class="item-comment-right">
                    <div class="comment-right-header">
                        <div class="right-header-author">{{item.author}}</div>
                        <div class="right-header-buttons"><img src="../assets/buttons.png"></div>
                    </div>
                    <div class="comment-right-body">
                        <p v-for="(item1,index1) in item.content" :key="index1">{{item1}}</p>
                    </div>
                    <div class="comment-right-footer">
                        <span v-time="item.time*1000"></span>
                        <div class="right-footer-likes">
                            <div class="footer-likes-num">{{item.likes}}</div>
                            <img src="../assets/dianzan.png">
                        </div>
                        <div class="right-footer-reply">
                            <img src="../assets/pinglun.png">
                        </div>
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
import $ from '../util';
import Loading from '@/components/loading';
import Time from '../time';
export default {
    name:'Comment',
    directives:{Time},
    components:{Loading},
    data(){
        return {
            isLoading:false,
            longComments:[
                {
                    author:'',
                    content:'',
                    avatar:'',
                    time:'',
                    id:'',
                    likes:0
                }
            ],
            shortComments:[
                {
                    author:'',
                    content:'',
                    avatar:'',
                    time:'',
                    id:'',
                    likes:0
                }
            ],
        }
    },
    computed:{
        commentsTotal:function(){
            return this.shortComments.length+this.longComments.length;
        }
    },
    methods:{
        getArticleLongComments:function(callback){
            var _this=this;
            $.ajax.get('story/'+_this.$route.params.id+'/long-comments').then(res=>{
                var longComments=res.comments;
                longComments.forEach(element => {
                    element.content=element.content.split('\n');
                });
                _this.longComments=longComments;
                _this.$nextTick(()=>{
                    if(callback)callback(longComments);
                })
            })
        },
        getArticleShortComments:function(callback){
            var _this=this;
            $.ajax.get('story/'+_this.$route.params.id+'/short-comments').then(res=>{
                var shortComments=res.comments;
                shortComments.forEach(element => {
                    element.content=element.content.split('\n');
                });
                _this.shortComments=shortComments;
                _this.$nextTick(()=>{
                    if(callback)callback(shortComments);
                })
            })
        },
        goBackToArtcleDetail:function(){
            this.$router.go(-1);
        }
    },
    mounted:function(){
        var _this=this;
        this.isLoading=true;
        this.getArticleLongComments(function(){
            _this.getArticleShortComments(function(){
                _this.isLoading=false;
            });
        });
    }
}
</script>
<style  scoped>
@import '../styles/Comment.css'
</style>