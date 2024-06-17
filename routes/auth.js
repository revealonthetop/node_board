var router = require('express').Router();

let mydb;
const mongoClient = require('mongodb').MongoClient;
const url = process.env.DB_URL;

mongoClient.connect(url).then(client => {
    console.log('몽고DB 접속');
    mydb = client.db('myboard');
})

// 암호화 객체 추가
const sha = require('sha256');

//세션 라이브러리 추가
const session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));


router.get("/login", function(req, res){
    console.log('로그인페이지 접속');
    console.log(req.session);
    if(req.session.user){
        console.log('세션 유지');
        // res.redirect('/index.ejs');
        res.render('/index.ejs', {user: req.session.user});
    }else{
        res.render('login.ejs');
    }
});

app.post("/login", function(req, res){
    console.log(`아이디 : ${req.body.userid}`);
    console.log(`비밀번호 : ${req.body.userpw}`);

    mydb
        .collection("account")
        .findOne({userid: req.body.userid})
        .then((result)=>{
        console.log(result);
        if(result){
            if(result.userpw === sha(req.body.userpw))
                {
                    req.session.user = req.body;
                    console.log('새로운 로그인')
                    res.render('index.ejs', {user: req.session.user});
                }
                else
                {
                    res.render('login.ejs');
                }
        } else{
            console.log('존재하지 않는 사용자 입니다.')
            res.render('login.ejs');
        }
     
        })
});

module.exports = router;