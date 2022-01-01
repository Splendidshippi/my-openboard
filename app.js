// const { Server } = require("engine.io");
const express = require("express");//access
const socket = require("socket.io");

const app = express(); //app initialize and server ready

app.use(express.static("public"));//public folder me jake index.html ko display krega

let port = 5500; //dataflow ka to&fro motion kuch bhi ho skta h
let server = app.listen(port, () => { //listen krna start 
    console.log("Listening to port " + port);
})
       
//connection to server
let io = socket(server);


io.on("connection", (socket) => {
    console.log("Made Connection");

    //identify krne k lye data bheja ya nhi(receive)
    socket.on("beginPath", (data) => { //data from frontend
        //transfer hoga all connected computers me
        io.sockets.emit("beginPath", data);
    })

    socket.on("drawStroke", (data) => { //drawstroke k koi bhi event aayega to
        io.sockets.emit("drawStroke", data);//jitne bhi connected comp h usko emit kr dena h
    })
    socket.on("redoUndo", (data) => { //redoUndo k koi bhi event aayega to
        io.sockets.emit("redoUndo", data);//jitne bhi connected comp h usko emit kr dena h
    })
}) 







