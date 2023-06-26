const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express')

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json()); 
app.use(cors());

console.log("독서배틀 express 서버 구동 중...")

//현재 룸 정보 가져오기
app.get('/roomlist', function(req, res) {
    const filePath = path.join(__dirname, 'roomListDB.json');
    const fileData = fs.readFileSync(filePath);     
    const existRooms = JSON.parse(fileData);
    res.send(existRooms);
    console.log(">> get /roomlist 요청됨");

});

//새로 생성된 룸 정보 저장하기
app.post('/roomlist', function(req, res) {
    const newRoomData = req.body;
    const filePath = path.join(__dirname, 'roomListDB.json');
    let fileData = fs.readFileSync(filePath);     
    let existRooms = JSON.parse(fileData);
    for(let i=0; i<newRoomData.length; i++) {
        existRooms.push(newRoomData[i]);
    }
    fs.writeFileSync(filePath, JSON.stringify(existRooms)); 
    fileData = fs.readFileSync(filePath); 
    const result = JSON.parse(fileData);
    res.send(result);
    console.log(">> post /roomlist 요청됨");

});

//게임 스타트
app.post('/gamestart', function(req, res) {
    const startRoomData = req.body;
    const filePath = path.join(__dirname, 'roomListDB.json');
    let fileData = fs.readFileSync(filePath);
    let existRooms = JSON.parse(fileData);
    for(let i=0; i<existRooms.length; i++) {
        if(startRoomData.roomId === existRooms[i].roomId) {
            existRooms[i].active=true;
            console.log(existRooms[i]);
        }
    }
    fs.writeFileSync(filePath, JSON.stringify(existRooms));
    fileData = fs.readFileSync(filePath);
    const result = JSON.parse(fileData);
    res.send(result);
    console.log(">> post /gamestart 요청됨");
});

//게임 끝
app.post('/gameend', function(req, res) {
    const endRoomData = req.body;
    const filePath = path.join(__dirname, 'roomListDB.json');
    let fileData = fs.readFileSync(filePath);
    let existRooms = JSON.parse(fileData);
    for(let i=0; i<existRooms.length; i++) {
        if(endRoomData.roomId === existRooms[i].roomId) {
            existRooms[i].active=false;
            console.log(existRooms[i]);
        }
    }
    fs.writeFileSync(filePath, JSON.stringify(existRooms));
    fileData = fs.readFileSync(filePath);
    const result = JSON.parse(fileData);
    res.send(result);
    console.log(">> post /gameend 요청됨");
});

//룸 정보 삭제하기
app.delete('/roomlist', function(req, res) {
    const deleteRoomData = req.body;
    const filePath = path.join(__dirname, 'roomListDB.json');
    const fileData = fs.readFileSync(filePath);
    let existRooms = JSON.parse(fileData);
    // for(let i=0; i<existRooms.length; i++) {
    //     if(deleteRoomData.roomId === existRooms[i].roomId) {
    //         existRooms.splice(i, 1);
    //         console.log(existRooms);
    //     }
    // }
    // if(deleteRoomData.data.roomId === 'all'){
        existRooms = [];
    // }
    fs.writeFileSync(filePath, JSON.stringify(existRooms)); 
    res.send(existRooms);
    console.log(">> post /roomlist 요청됨");
});

app.listen(3000);