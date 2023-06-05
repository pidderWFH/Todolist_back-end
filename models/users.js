const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, '請輸入您的名字']
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true,
      select: false
    },
    sex: {
      type: String,
      enum: [ "male", "female" ],
      required: [true, "請填寫性別"],
    },
    password: {
      type: String,
      required: [true, "請輸入密碼"],
      minlength: 8,
      select: false
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    },
    photo: String, 
  },
  {
    versionKey: false
  }
);
// User
const User = mongoose.model('user', userSchema);

module.exports = User;