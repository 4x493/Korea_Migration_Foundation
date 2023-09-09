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
    context.clearRect(0, 0, canvas.width, canvas.height);
    $("form")[0].reset();
});


$("#submit_button").on("click", function(){
    if(!$("#agreement1").is(":checked") || !$("#agreement2").is(":checked")) {
        alert("결제동의정보를 확인해주세요.");
        return;
    }

    var name = $("input[name*='name']").val();
    var phone_num1 = $("input[name*='phone_num1']").val();
    var phone_num2 = $("input[name*='phone_num2']").val();
    var phone_num3 = $("input[name*='phone_num3']").val();
    var birth_year = $("input[name*='birth_year']").val();
    var birth_month = $("input[name*='birth_month']").val();
    var birth_day = $("input[name*='birth_day']").val();
    var payment_type = $("input[name*='payment_type']").val();
    var payment_info = "";
    if($("#one_time_payment").hasClass("active")) {
        payment_info = "일회성 결제";
    }
    else {
        payment_info = "정기결제";
    }
    var payment_date = $("#payment_date option:selected").text();
    var payment_method = "";
    if($("#payment_method").hasClass("active")) {
        payment_method = "자동이체";
    }
    var bank = $("#bank option:selected").text();
    var account_owner = $("input[name*='account_owner']").val();
    var account_num = $("input[name*='account_num']").val();
    var payment_ammount = "";
    if($("#2k_won").hasClass("active")) {
        payment_ammount = "2000원";
    }
    if($("#10k_won").hasClass("active")) {
        payment_ammount = "10,000원";
    }
    if($("#50k_won").hasClass("active")) {
        payment_ammount = "50,000원";
    }
    if(!$("#2k_won").hasClass("active") && !$("#10k_won").hasClass("active") && !$("#50k_won").hasClass("active")){
        payment_ammount = $("input[name*='custom_won']").val();
    }
    var digital_signiture;

    $("input[name*='name']").remove();
    $("input[name*='phone_num1']").remove();
    $("input[name*='phone_num2']").remove();
    $("input[name*='phone_num3']").remove();
    $("input[name*='birth_year']").remove();
    $("input[name*='birth_month']").remove();
    $("input[name*='birth_day']").remove();
    $("input[name*='payment_type']").remove();
    $("input[name*='account_owner']").remove();
    $("input[name*='account_num']").remove();
    $("input[name*='custom_won']").remove();

    $("form").append("<input name='이름' style='display: none;' value='" + name + "'>");
    $("form").append("<input name='전화번호' style='display: none;' value='" + phone_num1 + " " + phone_num2 + " " + phone_num3 + "'>");
    $("form").append("<input name='생년월일' style='display: none;' value='" + birth_year + "년 " + birth_month + "월 " + birth_day + "일'>");
    $("form").append("<input name='납부유형' style='display: none;' value='" + payment_type + "'>");
    $("form").append("<input name='결제정보' style='display: none;' value='" + payment_info + "'>");
    if(payment_info == "정기결제"){ $("form").append("<input name='정기 결제일' style='display: none;' value='" + payment_date + "'>"); };
    $("form").append("<input name='결제수단' style='display: none;' value='" + payment_method + "'>");
    $("form").append("<input name='은행' style='display: none;' value='" + bank + "'>");
    $("form").append("<input name='예금주명' style='display: none;' value='" + account_owner + "'>");
    $("form").append("<input name='계좌번호' style='display: none;' value='" + account_num + "'>");
    $("form").append("<input name='결제금액' style='display: none;' value='" + payment_ammount + "'>");

    $("form").submit();
});