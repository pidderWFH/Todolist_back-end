const mongoose = require("mongoose");

// schema 開始 
const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      //必填加入required
      trim: true,
      required: [true, '內文未填寫']
    },
    image: {
      type:String,
      default:""
    },
    createdAt: {
      type: Date,
      default: Date.now,
      //db.posts.find() 不會顯示此資料
      select: false
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, '貼文ID未填寫']
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        default:0
      }
    ],
    tags: {
      type: String,
      required: [true, "貼文標籤未填寫"]
    },
    type: {
      type: String,
      enum: [ "group", "person"],
      required: [true, "貼文類型未填寫"]    
    }
  },
  {
    versionKey : false
  }
);
//model collection 會自動將第一個字母小寫並且會變成複數(+s)
//postSchema 規範資料格式
const Post = mongoose.model('post', postSchema);
// const init = async()=>{
//     await減少巢狀結構
//         const AllPost =  await Post.find();
//         console.log(AllPost)
//     }
// init();

// schema 結束

module.exports = Post;