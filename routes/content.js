const express = require('express');
const router = express.Router();
const BoardContents = require('../models/board');
const path = require('path');
const VIEWS = path.join(__dirname, '../views');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const multiparty = require('multiparty');

router.use(express.static('public'));

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
//router.use(multer());

var Storage = multer.diskStorage({
  destination:function(req,file, cb){
    cb(null, './public/uploadimage')
  },
  /*
  filename: function(req,file,cb){
    cb(null, file.fieldname+'_'+Date.now() + '_'+ file.originalname);
  }
  */
  filename: function(req, file, cb){
    cb(null, Date.now() + '_' + file.originalname);
  }

});

var upload = multer({
  storage: Storage
});



router.get('/', function(req, res){

  BoardContents.find({}).exec((err,rawContents) =>{
    if(err) throw err;
    //console.log(rawContents);
    res.render('main', {Data : rawContents});

  })

});

router.get('/dataGet', function(req,res){
  console.log('ajax 요청 받음(dataget)');
  BoardContents.find({}).exec((err,results) => {
    if(err) throw err;
    res.send(results);
  })

});


router.get('/read/:_id', function(req, res){
  BoardContents.find({_id:req.params._id}).exec((err,result) =>{
    console.log('체크'+result);
    if(err) throw err;

    res.render('readejs2',{ Data : result });
  });
});


router.get('/write', function(req, res){
  res.sendFile('write.html', {root : VIEWS });
});

router.post('/write', (req,res) =>{
  console.log(req.body);
  const board = new BoardContents({
    title: req.body.addContentSubject,
    contents: req.body.addContents,
    author: req.body.addContentWriter,
    //image: req.body.addImage,
  });
  board.save((err,results) =>{
    if(err){
      console.error(err);
      return res.status(500).json({ message : ' board Create error - ${err.message}'});
    }
    return res.redirect('/boards');
  });
});

/*
router.route('/ajax').get(function(req, res){
  console.log('/boards/ajax 패스 요청됨.');

  // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
  console.log('req.user 객체의 값');
  console.dir(req.user);

  // 인증 안된 경우
  if (!req.user) {
    console.log('사용자 인증 안된 상태임.');
    res.redirect('/');
    return;
  }

  // 인증된 경우
  console.log('사용자 인증된 상태임.');
  res.render('index2.html');
});
*/
router.get('/ajax/contentGet', function(req,res){
  console.log('contentGet 요청받음');
  BoardContents.find({}).exec((err,results) => {
    if(err) throw err;
    //console.log(results);
    res.json(results);
  })
});

router.post('/ajax/read/:_id', function(req, res){
  console.log('ajax 글읽기 요청');
  BoardContents.find({_id:req.params._id}).exec((err,result) =>{
    console.log('체크'+result);
    if(err) throw err;

    res.json(result);
  });
});

router.post('/ajax/write', function(req, res){
  console.log('ajax 글쓰기 요청');
  //console.log(req.body);
  let newtext = new BoardContents({
    title : req.body.title,
    author : req.body.author,
    contents : req.body.content,
    //image : req.body.image,
  });
  newtext.save((err, result) => {
    if(err){
      console.error(err);
      return res.status(500).json({ message : '글쓰기오류'});
    }
    return res.json(req.body);
  });
});

router.post('/ajax/imageUpload', upload.single('img'), function(req, res){
  /*
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files){
    console.log(fields);
    console.log(files);
  });
  */
  //console.log('바디첵');
  let newtext = new BoardContents({
    title : req.body.title,
    author : req.body.author,
    contents : req.body.conte,
    image : req.file.filename,
  });

  newtext.save((err,result) => {
    if(err){
      console.error(err);
      return res.status(500).json({message:'글쓰기오류'});
    }
    console.log(result);
    return res.redirect('/boards/ajax');
  })
  //return res.redirect('/boards/ajax');


});


module.exports = router;