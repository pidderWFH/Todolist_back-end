const appError = require("../service/appError");
const Post = require("../models/posts");
const User = require("../models/users");
const mongoose = require("mongoose");

const posts = {
   
    async getAllPosts(req, res, next){
        const timeSort = req.query.timeSort === "asc" ? "createdAt":"-createdAt"
        const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
        const allPost = await Post.find(q).populate({
            path: 'user',
            select: 'name photo '
        }).sort(timeSort);
        // asc 遞增(由小到大，由舊到新) createdAt ; 
        // desc 遞減(由大到小、由新到舊) "-createdAt"
        // handle.handleSucess(res, allPost);
        res.status(200).send({ status: "success", data: allPost });
    },
    async createdPosts(req, res, next){
        
        const { body } = req;
        
        if( !body.content || !body.tags || !body.type ){
            // return next(appError(400, "未填必填欄位", next));
            return appError(400, "未填必填欄位", next);
        }

        if( !body.content.trim() || !body.tags.trim() || !body.type.trim() ){
  
            // return next(appError(400, "欄位不能為空白", next));
            return appError(400, "欄位不能為空白", next);
        }
        const newPost = await Post.create(
            {
                user: req.userID,
                content: body.content,
                image: body.image,
                tags: body.tags,
                type: body.type
            }
        );

        res.status(200).send({ status: "success", data: newPost });
    },
    async deleteAllPosts(req, res, next){
        
        if(req.originalUrl === "/posts/") return appError(404, "無此路由", next);

        const posts = await Post.deleteMany({});
        res.status(200).send({ status: "success", data: posts });
    },
    async deleteOnePosts(req, res, next){
        
        const id = req.params.post_id;
        //判斷id是否有正確格式  
        if( ! mongoose.isObjectIdOrHexString(id)) {
            return appError(400, "刪除貼文id格式錯誤", next);
        }
        
        deleteOne = await Post.findByIdAndDelete(id);
        if (deleteOne){
            res.status(200).send({ stutus: "success", data: deleteOne });
        }else{
            // return next(appError(400, "無此貼文", next));
            return appError(400, "無此貼文", next);
        }
        
    },
    async patchPosts(req, res, next){

        const id = req.params.post_id;
        const { body } = req;

        //判斷id是否有正確格式  
        if( ! mongoose.isObjectIdOrHexString(id)) {
            return appError(400, "修改貼文id格式錯誤", next);
        }
        // let { name, content, tags, type, likes } = body;
        if( !body.content ){
            return appError(400, "未填必填欄位", next);
        }

        if( !body.content.trim() ){
  
            // serviceHandle.handleError(res, errCode=401, "欄位不能空白");
            return appError(400, "欄位不能為空白", next);
        }

        const patchPost = await Post.findByIdAndUpdate
        (
            id,
            { 
                
                content: body.content,
                tags: body.tags,
                type: body.type,
            
            },
            { 
                runValidators: true, returnDocument: 'after' 
            } 
        );

        if (patchPost){
            // handle.handleSucess(res, post);
            res.status(200).send({ status: "success", data: patchPost });
        }else {
            // return next(appError(400, "修改貼文失敗，無此貼文", next));
            return appError(400, "修改貼文失敗，無此貼文", next);
        } 
    },
}

module.exports = posts;