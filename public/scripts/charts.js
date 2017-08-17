// get canvas things we need
var canvas1 = document.getElementById('q1Canvas');
var canvas2 = document.getElementById('q2Canvas');
var canvas3 = document.getElementById('q3Canvas');

var ctx1 = canvas1.getContext('2d');
var ctx2 = canvas2.getContext('2d');
var ctx3 = canvas3.getContext('2d');

// size 'constants'
var CANVAS_WIDTH = 500;
var CANVAS_HEIGHT = 500;
var BAR_WIDTH = 50;
var FULL_BAR_HEIGHT = 350;
var OFFSET = 25;
var NUM_BARS = 4;

// colors
var LIGHT_GREY = {r:224, g:224, b:224};
var RED = {r:255, g:0, b:0};
var GREEN = {r:0, g:255, b:0};
var BLUE = {r:0, g:0, b:255};
var BLACK = {r:0, g:0, b:0};
var YELLOW = {r:255, g:255, b:0};

var currentContext;

// makes the canvas the size we want
function sizeCanvas(width, height){
    currentContext.canvas.width  = width;
    currentContext.canvas.height  = height;
}

// returns a string to set the color from rgb obj
function colorStr(color){
    return 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';
}

// draws a rectangle the color we say
function drawRect(x, y, w, h, color){
    currentContext.fillStyle = colorStr(color);
    currentContext.fillRect(x, y, w, h);
}

// draws text the color we say
function drawText(str, x, y, color, horiz, vert){
    currentContext.font="30px Verdana";
    currentContext.textAlign = horiz;
    currentContext.textBaseline = vert;
    currentContext.fillStyle = colorStr(color);
    currentContext.fillText(str, x, y);
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
function drawChart(bgColor, title, bars){
    drawBackground(bgColor);
    drawTitle(title);
    for (let i = 0; i < NUM_BARS; ++i) {
        drawBar(Math.floor((i+1) * CANVAS_WIDTH / (NUM_BARS+1)), bars[i].percent, bars[i].color, bars[i].name);
    }
}

// maths for testing
function fmod(a, b) {
    return +(a - (Math.floor(a / b) * b)).toPrecision(8);
}

(function(){
    var q1a1 = fmod(window.Q1Stats[0], 1.0);
    var q1a2 = fmod(window.Q1Stats[1], 1.0);
    var q1a3 = fmod(window.Q1Stats[2], 1.0);
    var q1a4 = fmod(window.Q1Stats[3], 1.0);
    var q2a1 = fmod(window.Q2Stats[0], 1.0);
    var q2a2 = fmod(window.Q2Stats[1], 1.0);
    var q2a3 = fmod(window.Q2Stats[2], 1.0);
    var q2a4 = fmod(window.Q2Stats[3], 1.0);
    var q3a1 = fmod(window.Q3Stats[0], 1.0);
    var q3a2 = fmod(window.Q3Stats[1], 1.0);
    var q3a3 = fmod(window.Q3Stats[2], 1.0);
    var q3a4 = fmod(window.Q3Stats[3], 1.0);

    currentContext = ctx1;
    sizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    drawChart(LIGHT_GREY, "Question 1", [{percent: q1a1, color: RED, name:"A1"},
                                          {percent: q1a2, color: GREEN, name:"A2"},
                                          {percent: q1a3, color: BLUE, name:"A3"},
                                          {percent: q1a4, color: YELLOW, name:"A4"}]);

    currentContext = ctx2;
    sizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    drawChart(LIGHT_GREY, "Question 2", [{percent: q2a1, color: RED, name:"A1"},
                                          {percent: q2a2, color: GREEN, name:"A2"},
                                          {percent: q2a3, color: BLUE, name:"A3"},
                                          {percent: q2a4, color: YELLOW, name:"A4"}]);

    currentContext = ctx3;
    sizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    drawChart(LIGHT_GREY, "Question 3", [{percent: q3a1, color: RED, name:"A1"},
                                          {percent: q3a2, color: GREEN, name:"A2"},
                                          {percent: q3a3, color: BLUE, name:"A3"},
                                          {percent: q3a4, color: YELLOW, name:"A4"}]);
})();
