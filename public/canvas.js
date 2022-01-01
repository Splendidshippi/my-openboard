// const { Socket } = require("engine.io");

let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");


let penColor = "red";
let eraserColor = "white";
let penWidth = pencilWidthElem.nodeValue;
let eraserWidth = eraserWidthElem.nodeValue;

let undoRedoTracker = []; //data
let track = 0;//represent krega konsa action perform hoga from trackerarray

let mousedown = false;
let tool = canvas.getContext("2d");
tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

canvas.addEventListener("mousedown", (e) => {
    mousedown = true;
    let data = { //obj jiske ander data pda h x & y
        x: e.clientX,
        y: e.clientY
    }
    socket.emit("beginPath", data);//data server k pass jayegi
})
canvas.addEventListener("mousemove", (e) => {

    if(mousedown) {
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : penColor, //agr eraser true h to eraser color aayegi wrns pencolor
            width: eraserFlag ? eraserWidth : penWidth  //agr eraser active h to eraser width else pen ki
        }
        socket.emit("drawStroke", data);
    }
})
canvas.addEventListener("mouseup", (e) => {
    mousedown = false;

    let url = canvas.toDataURL();// url lega current state
    undoRedoTracker.push(url);//push krega url ko 
    track = undoRedoTracker.length - 1;//to track change hoga last element ko represent krega
})
undo.addEventListener("click", (e) => {
    if (track > 0) //previous action p jana jb action 0 is grter h
        track--;
    //track action
    let data = {
        trackValue: track, 
        undoRedoTracker
    }
    socket.emit("redoUndo", data);
    // undoRedoCanvas(trackObj);

})
redo.addEventListener("click", (e) => {
    if (track < undoRedoTracker.length - 1) //current track less honi chahiye 2 .. 3
        track++;
    //track action
    let data = {
        trackValue: track, 
        undoRedoTracker
    }
    socket.emit("redoUndo", data);

    // undoRedoCanvas(trackObj);
})
function undoRedoCanvas(trackObj) {//initialize
    track = trackObj.trackValue;// track data aajayegi
    undoRedoTracker = trackObj.undoRedoTracker;//undoredutracker ki value aa jayegi
    let url = undoRedoTracker[track];//previous data
    let img = new Image();// element for new image
    img.src = url;//img me store 
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

function beginPath(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}
function drawStroke(strokeObj) {
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}
pencilColor.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
})
pencilWidthElem.addEventListener("change", (e) => {
    penWidth = pencilWidthElem.value;
    tool.lineWidth = penWidth;
})
eraserWidthElem.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
})
eraser.addEventListener("click", (e) => {
    if (eraserFlag) { //eraser flag agr true h to color ar width chage hona
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    } else {
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})
//download krne k lye
download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

socket.on("beginPath", (data) => {//data from server
    beginPath(data);
}) 
socket.on("drawStroke", (data) => {//listener kb data aayaga
    drawStroke(data); //drawStroke ko call kiya data k sath 
})
socket.on("redoUndo", (data) => {//listener kb data aayaga
    undoRedoCanvas(data); //undoRedoCanvas ko call kiya data k sath 
})