var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postRouter = require("./routes/posts");
const uploadRouter = require("./routes/uploads");

var app = express();
// 程式出現重大錯誤時
process.on("uncaughtException", err=> {
    // 記錄錯誤下來，等到服務都處理完後，停掉該 process
    console.error("Uncaughted Exception！");
    console.error(err);
    process.exit(1);
});
require("./connections");

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/", postRouter);
app.use("/upload", uploadRouter);

// 404 錯誤
app.use(function(req, res, next) {
    res.status(404).json({
      status: 'error',
      message: "無此路由資訊",
    });
  });
  
  // express 錯誤處理
  // 自己設定的 err 錯誤 
  const resErrorProd = (err, res) => {
    if (err.isOperational) {
      res.status(err.statusCode).send({
        message: err.message
      });
    } else {
      // log 紀錄
      console.error('出現重大錯誤', err);
      // 送出罐頭預設訊息
      res.status(500).send({
        status: 'error',
        message: '系統錯誤，請恰系統管理員'
      });
    }
  };
  // 開發環境錯誤
  const resErrorDev = (err, res) => {
    res.status(err.statusCode).send({
      message: err.message,
      error: err,
      stack: err.stack
    });
  };
  // 錯誤處理
  app.use(function(err, req, res, next) {
    // dev
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === 'dev') {
      err.statusCode = 400;
      err.isOperational = true;
      return resErrorDev(err, res);
    } 
    // production
    if (err.name === 'ValidationError'){
      err.statusCode = 400;
      err.message = "資料欄位未填寫正確，請重新輸入！";
      err.isOperational = true;
      return resErrorProd(err, res)
    }
    // JSON format error
    if(err instanceof SyntaxError && err.statusCode === 400 && 'body' in err) {
      err.message = '資料格式有誤:' + err.message;
      err.isOperational = true;
      return resErrorProd(err, res);
    }
    resErrorProd(err, res)
  });
  
  // 未捕捉到的 catch 
  process.on('unhandledRejection', (err, promise) => {
    console.error('未捕捉到的 rejection：', promise, '原因：', err);
  });

module.exports = app;
