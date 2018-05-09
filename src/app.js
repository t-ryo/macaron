class ImageSymbol {
    constructor(name, posx, posy, sizew, sizeh, angle, id) {
        this.img = new Image();
        this.name = name;
        this.id = id;
        
        this.fPosx = posx;
        this.fPosy = posy;
        this.fSizew = sizew;
        this.fSizeh = sizeh;
        this.fAngle = angle;
        this.posx = posx;
        this.posy = posy;
        this.sizew = sizew;
        this.sizeh = sizeh;
        this.angle = angle;

        switch (name) {
            case "SAKURA":
                this.img.src = "image/sakura.png";
                break;
            case "FISH":
                this.img.src = "image/fish.png";
                break;
            case "STAR":
                this.img.src = "image/star.png";
                break;
            case "ARROW":
                this.img.src = "image/arrow.png";
                break;
            case "TRIANGLE":
                this.img.src = "image/triangle.png";
                break;
            default:
                break;
        }
    }

    init(){
        this.posx = this.fPosx;
        this.posy = this.fPosy;
        this.sizew = this.fSizew;
        this.sizeh = this.fSizeh;
        this.angle = this.fAngle;
    }
}
class Transition {
    constructor(target, dx, dy, dsizew, dsizeh, dangle) {
        this.target = target;
        this.dx = dx;
        this.dy = dy;
        this.dsizew = dsizew;
        this.dsizeh = dsizeh;
        this.dangle = dangle;
    }
}
var imageSymbols = [];
var symbolCount = 0;
var transitions = [];
var transitionCount = 0;
function createImageSymbol(input) {
    var inputs = input.split("(");
    var name = inputs[0];
    var imageData = [];
    inputs = inputs[1].split(",");
    for (var i = 0; i < inputs.length; i++) {
        imageData.push(parseInt(inputs[i]));
    }
    imageSymbols.push(new ImageSymbol(name, imageData[0], imageData[1], imageData[2], imageData[3], imageData[4], symbolCount));
    symbolCount++;
}
function createTransition(input) {
    var inputs = input.split("->(");
    var target = inputs[0];
    var transitionData = [];
    inputs = inputs[1].split(",");
    for (var i = 0; i < inputs.length; i++) {
        transitionData.push(parseInt(inputs[i]));
    }
    transitions.push(new Transition(target, transitionData[0], transitionData[1], transitionData[2], transitionData[3], transitionData[4]));
    transitionCount++;
}
function exec(input) {

}
var canvas = document.getElementById("cvs");
var ctx = canvas.getContext("2d");
var cvsw = 900;
var cvsh = 900;
var cos = 0;
var sin = 0;
var rad = Math.PI / 180;
var timeCounter = 0;
var timer;
function plot() {
    ctx.clearRect(0, 0, cvsw, cvsh);
    for (var i = 0; i < symbolCount; i++) {
        cos = Math.cos(imageSymbols[i].angle * rad);
        sin = Math.sin(imageSymbols[i].angle * rad);
        ctx.setTransform(cos, sin, -1 * sin, cos, imageSymbols[i].posx, imageSymbols[i].posy);
        ctx.drawImage(imageSymbols[i].img, 0, 0, imageSymbols[i].sizew, imageSymbols[i].sizeh);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}
function flow() {
    for (var i = 0; i < transitionCount; i++) {
        for (var j = 0; j < symbolCount; j++) {
            if (transitions[i].target === imageSymbols[j].name) {
                imageSymbols[j].posx += transitions[i].dx;
                if (imageSymbols[j].posx > 1000)
                    imageSymbols[j].posx -= 1000;
                if (imageSymbols[j].posx < 0)
                    imageSymbols[j].posx += 1000;
                imageSymbols[j].posy += transitions[i].dy;
                if (imageSymbols[j].posy > 1000)
                    imageSymbols[j].posy -= 1000;
                if (imageSymbols[j].posy < 0)
                    imageSymbols[j].posy += 1000;
                imageSymbols[j].sizew *= transitions[i].dsizew;
                imageSymbols[j].sizeh *= transitions[i].dsizeh;
                imageSymbols[j].angle += transitions[i].dangle;
                if (imageSymbols[j].angle > 360)
                    imageSymbols[j].angle -= 360;
                if (imageSymbols[j].angle < 360)
                    imageSymbols[j].angle += 360;
            }
        }
    }
    plot();
    $(function(){
        $("#time-counter").text(++timeCounter);
    });
}
function flowStart() {
    timer = setInterval(flow, 10);
}
function flowPause() {
    clearInterval(timer);
}
function incrementFrame() {
    flow();
}
function init() {
    for (var i = 0; i < symbolCount; i++) {
        imageSymbols[i].init();
    }
    plot();
    timeCounter = 0;
    $(function(){
        $("#time-counter").text(timeCounter);
    });
}

$(function () {
    cvsw = $('#mapping-area').width();
    cvsh = $('#mapping-area').height();
    $('#cvs').attr('width', cvsw);
    $('#cvs').attr('height', cvsh);
    var timer = false;
    $(window).resize(function() {
        if (timer !== false) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            console.log('resized');
            cvsw = $('#mapping-area').width();
            cvsh = $('#mapping-area').height();
            $('#cvs').attr('width', cvsw);
            $('#cvs').attr('height', cvsh);
        }, 200);
    });

    $('select.makeMeFancy').tzSelect({
        render : function(option){
            return $('<li>',{
                html:   '<img src="'+option.data('icon')+'" /><span>'+
                        option.data('html-text')+'</span>'
            });
        },
        className : 'hasDetails'
    });
    $('#apply-start').click(function () {
        var start = $('#start-text').val().toString();
        console.log(start);
        createImageSymbol(start);
        plot();
    });
    $('#apply-rule').click(function () {
        var rule = $('#rule-text').val().toString();
        console.log(rule);
        createTransition(rule);
        plot();
    });
    $('#apply-source').click(function() {
        var source = $('#source-text').val().toString();
        console.log(source);

    });
    $('#start-plot').click(function () {
        console.log("start");
        $(this).removeClass("active");
        $($(this).attr("switch-link")).addClass("active");
        flowStart();
    });
    $('#pause-plot').click(function (){
        console.log("pause");
        $(this).removeClass("active");
        $($(this).attr("switch-link")).addClass("active");
        flowPause();
    });
    $('#increment-frame').click(function () {
        console.log("increment-frame");
        incrementFrame();
    });
    $('#reset').click(function () {
        console.log("reset");
        init();
    });
    $('.btn').click(function() {

    });
});

(function(){

    //要素の取得
    var elements = document.getElementsByClassName("drag-and-drop");

    //要素内のクリックされた位置を取得するグローバル（のような）変数
    var x;
    var y;

    //マウスが要素内で押されたとき、又はタッチされたとき発火
    for(var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("mousedown", mdown, false);
        elements[i].addEventListener("touchstart", mdown, false);
    }

    //マウスが押された際の関数
    function mdown(e) {

        //クラス名に .drag を追加
        this.classList.add("drag");

        //タッチデイベントとマウスのイベントの差異を吸収
        if(e.type === "mousedown") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //要素内の相対座標を取得
        x = event.pageX - this.offsetLeft;
        y = event.pageY - this.offsetTop;

        //ムーブイベントにコールバック
        document.body.addEventListener("mousemove", mmove, false);
        document.body.addEventListener("touchmove", mmove, false);
    }

    //マウスカーソルが動いたときに発火
    function mmove(e) {

        //ドラッグしている要素を取得
        var drag = document.getElementsByClassName("drag")[0];

        //同様にマウスとタッチの差異を吸収
        if(e.type === "mousemove") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //フリックしたときに画面を動かさないようにデフォルト動作を抑制
        e.preventDefault();

        //マウスが動いた場所に要素を動かす
        drag.style.top = event.pageY - y + "px";
        drag.style.left = event.pageX - x + "px";

        //マウスボタンが離されたとき、またはカーソルが外れたとき発火
        drag.addEventListener("mouseup", mup, false);
        document.body.addEventListener("mouseleave", mup, false);
        drag.addEventListener("touchend", mup, false);
        document.body.addEventListener("touchleave", mup, false);

    }

    //マウスボタンが上がったら発火
    function mup(e) {
        var drag = document.getElementsByClassName("drag")[0];

        //ムーブベントハンドラの消去
        document.body.removeEventListener("mousemove", mmove, false);
        drag.removeEventListener("mouseup", mup, false);
        document.body.removeEventListener("touchmove", mmove, false);
        drag.removeEventListener("touchend", mup, false);

        //クラス名 .drag も消す
        drag.classList.remove("drag");
    }

})()

var jsEditor = CodeMirror.fromTextArea(document.getElementById("source-text"), {
    mode: "javascript",
    lineNumbers: false,
    indentUnit: 4
});