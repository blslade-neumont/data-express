// get canvas things we need
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// size 'constants'
var CANVAS_WIDTH = 500;
var CANVAS_HEIGHT = 500;
var BAR_WIDTH = 50;
var FULL_BAR_HEIGHT = 350;
var OFFSET = 25;

// colors
var LIGHT_GREY = {r:224, g:224, b:224};
var RED = {r:255, g:0, b:0};
var GREEN = {r:0, g:255, b:0};
var BLUE = {r:0, g:0, b:255};
var BLACK = {r:0, g:0, b:0};

// makes the canvas the size we want
function sizeCanvas(width, height){
    ctx.canvas.width  = width;
    ctx.canvas.height  = height;
}

// returns a string to set the color from rgb obj
function colorStr(color){
    return 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';
}

// draws a rectangle the color we say
function drawRect(x, y, w, h, color){
    ctx.fillStyle = colorStr(color);
    ctx.fillRect(x, y, w, h);
}

// draws text the color we say
function drawText(str, x, y, color, horiz, vert){
    ctx.font="30px Verdana";
    ctx.textAlign = horiz;
    ctx.textBaseline = vert;
    ctx.fillStyle = colorStr(color);
    ctx.fillText(str, x, y);
}

// draws the title for the chart
function drawTitle(title){
    drawText(title, CANVAS_WIDTH / 2, OFFSET, BLACK, "center", "middle");
}

// draws the background for the chart
function drawBackground(color){
    drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, color);
}

// draws a bar
function drawBar(xPosCenter, percent, color, name){
    var h = percent * FULL_BAR_HEIGHT;
    drawRect(xPosCenter - BAR_WIDTH / 2, CANVAS_HEIGHT - h, BAR_WIDTH, h, color);
    drawText(name, xPosCenter, CANVAS_HEIGHT - h - OFFSET, BLACK, "center", "center");
}

// draws the chart
function drawChart(bgColor, title, bar1, bar2, bar3){
    drawBackground(bgColor);
    drawTitle(title);
    drawBar(Math.floor(1 * CANVAS_WIDTH / 4), bar1.percent, bar1.color, bar1.name);
    drawBar(Math.floor(2 * CANVAS_WIDTH / 4), bar2.percent, bar2.color, bar2.name);
    drawBar(Math.floor(3 * CANVAS_WIDTH / 4), bar3.percent, bar3.color, bar3.name);
}

// maths for testing
function fmod(a, b) {
    return +(a - (Math.floor(a / b) * b)).toPrecision(8);
}

(function(){
    sizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    var a = fmod(window.Q1Stat, 1.0);
    var b = fmod(window.Q2Stat, 1.0);
    var c = fmod(window.Q3Stat, 1.0);
    drawChart(LIGHT_GREY, "Chart Title", {percent: a, color: RED, name:"Q1"}, {percent: b, color:GREEN, name:"Q2"}, {percent: c, color:BLUE, name:"Q3"});
})();
