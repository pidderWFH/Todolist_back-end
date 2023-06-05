var express = require('express');
var router = express.Router();

const handleErrorAsync = require("../service/handleErrorAsync");
const PostsControllers = require("../controllers/posts");
const { isAuth } = require("../service/auth");


router.get('/posts', isAuth, handleErrorAsync(PostsControllers.getAllPosts));

router.post('/post', isAuth, handleErrorAsync(PostsControllers.createdPosts));

router.delete('/posts', isAuth, handleErrorAsync(PostsControllers.deleteAllPosts));

router.delete('/post/:post_id',isAuth, handleErrorAsync(PostsControllers.deleteOnePosts));

router.patch('/post/:post_id', isAuth, handleErrorAsync(PostsControllers.patchPosts));

module.exports = router;
