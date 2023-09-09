var clearButton = document.getElementById('toolbar');
var canvas = document.getElementById('drawing_board');
var context = canvas.getContext('2d');
var radius = 5;
var dragging = false;

function getMousePosition(e) {
    var mouseX = e.offsetX * canvas.width / canvas.clientWidth | 0;
    var mouseY = e.offsetY * canvas.height / canvas.clientHeight | 0;
    return {x: mouseX, y: mouseY};
}

function getTouchPosition(e) {
    var bcr = e.target.getBoundingClientRect();
    var x_off = e.targetTouches[0].clientX - bcr.x;
    var y_off = e.targetTouches[0].clientY - bcr.y;
    var touchX = x_off * canvas.width / canvas.clientWidth | 0;
    var touchY = y_off * canvas.height / canvas.clientHeight | 0;
    return {x: touchX, y: touchY};
}

context.mozImageSmoothingEnabled = false;
context.imageSmoothingEnabled = false;

canvas.width = $("#drawing_board").width();
canvas.height = $("#drawing_board").height();
canvas.style.width = '100%';
canvas.style.height = '100%';

/* CLEAR CANVAS */
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

clearButton.addEventListener('click', clearCanvas);


var putPoint = function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (dragging) {
        context.lineTo(getMousePosition(e).x, getMousePosition(e).y);
        context.lineWidth = radius * 2;
        context.stroke();
        context.beginPath();
        context.arc(getMousePosition(e).x, getMousePosition(e).y, radius, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.moveTo(getMousePosition(e).x, getMousePosition(e).y);
    }
};

var putPointTouch = function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (dragging) {
        context.lineTo(getTouchPosition(e).x, getTouchPosition(e).y);
        context.lineWidth = radius * 2;
        context.stroke();
        context.beginPath();
        context.arc(getTouchPosition(e).x, getTouchPosition(e).y, radius, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.moveTo(getTouchPosition(e).x, getTouchPosition(e).y);
    }
};

var engage = function (e) {
    e.preventDefault();
    dragging = true;
    putPoint(e);
};
var engageTouch = function (e) {
    e.preventDefault();
    dragging = true;
    putPointTouch(e);
};
var disengage = function () {
    dragging = false;
    context.beginPath();
};

canvas.addEventListener('mousedown', engage);
canvas.addEventListener('mousemove', putPoint);
canvas.addEventListener('mouseup', disengage);
document.addEventListener('mouseup', disengage);
canvas.addEventListener('contextmenu', disengage);

canvas.addEventListener('touchstart', function (e) {
    engageTouch(e);
    canvas.dispatchEvent(e);
}, false);
canvas.addEventListener("touchmove", function (e) {
    putPointTouch(e);
    canvas.dispatchEvent(e);
}, false);
canvas.addEventListener('touchend', function (e) {
    disengage(e);
    canvas.dispatchEvent(e);
}, false);


$(".keep_pressed").on("click", function(){
    $(this).siblings().removeClass("active");
    $(this).addClass("active");
});


$("#custom_payment_amount").on("click", function(){
    $(this).siblings(".keep_pressed").removeClass("active");
});

$("#custom_payment_amount").siblings(".keep_pressed").on("click", function(){
    $("#custom_payment_amount").val("");
});

$("#reset_button").on("click", function(){
    $(".keep_pressed").removeClass("active");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    $("form")[0].reset();
});