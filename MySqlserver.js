// MYSQL + Node.js 접속 
let mysql = require('mysql');
let conn = mysql.createConnection({
    host: "localhost",
    user : "root",
    password: "123456",
    database: "myboard", // 스키마 이름을 의미하는 것.
});

// conn을 연결하는 메서드
conn.connect();

const express = require('express');
const app = express(); // 얘는 함수 포인터라는 소리지
const port = 8080;

app.listen(port, () => {
    console.log(`서버 동작중 at http://localhost:${port}/`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.get('/book', function (req, res) {
    res.send('도서 목록 관련 페이지 입니다.')
})

app.get('/list', function(req,res){
    res.send('<h1>데이터베이스를 조회합니다.</h1>');
    conn.query("select id,title from post", function (err, rows, fields) {
        if (err) throw err;
        console.log(rows);
    });    
});