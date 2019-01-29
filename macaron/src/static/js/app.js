const cvswOrg = 1440; /* MacBookAirのSafariのwindowサイズ */
const cvshOrg = 837;  /* MacBookAirのSafariのwindowサイズ */
var cvsw = 1440;      /* リサイズ後のcanvas幅 */
var cvsh = 837;       /* リサイズ後のcanvas高さ */
var ratew = cvsw/cvswOrg;
var rateh = cvsh/cvshOrg;
var result;           /* macaronコードのパース結果の木 */

// 旧Macaron
ctree.prototype.getLength = function(){
    return this.child.calcLength();
}

ctree.prototype.getChild = function(index){
    try{
        var length = this.getLength();
        var i = length - index;
        if(i > length || i <= 0) throw new RangeError('IndexError in tree.getChild');
        return this.child.passChild(i);
    }catch(e){
        console.error("RangeError:", e.message);
    }
}

ctree.prototype.getValue = function(){
    var inputs = this.inputs.slice(this.spos,this.epos);
    return (new TextDecoder).decode(inputs);
}

ctree.prototype.getLabeledChild = function(label){
    // TODO 動作チェック
    try{
        return this.child.passLabeledChild(label);
    }catch(e){
        return false;
    }
}

/* infoは条件分岐に使用

   廃止予定
   info.inFlow == true 実行中
   info.inFlow == false 前処理中
   (mainloop()を廃止したので、廃止することは確定)

   info.isKey == true valueを文字列として扱う */

ctree.prototype.visit = function(info){
    return eval("eval" + this.tag + "(this,info)");
}

/* 木を表示 デバッグ用 */
var showFlipper = false; /* ctree と clink の判定 */
ctree.prototype.show = function(depth){
    var indent = showFlipper ? "=".repeat(depth) : "-".repeat(depth);
    showFlipper = !showFlipper;
    console.log(indent + this.tag);
    var length = this.getLength();
    for(var i = 0;i<length;i++){
        this.getChild(i).show(depth+1);
    }
}

clink.prototype.calcLength = function(){
    if(this.prev == null){
        return 0;
    }else{
        return this.prev.calcLength() + 1;
    }
}

clink.prototype.passChild = function(index){
    if(index === 0){
        return this.child;
    }
    return this.prev.passChild(index - 1);
}

clink.prototype.passLabeledChild = function(label){
    if(this.tag === label){
        return this.child;
    }else if(this.prev !== null){
        return this.prev.passLabeledChild(label);
    }
    return null;
}


/* ctreeの走査用ビジターパターン */
function evalSource(tree,info){
    var length = tree.getLength();
    for(var i = 0;i<length;i++){
        tree.getChild(i).visit(info);
    }
    return null;
}

function evalString(tree,info){
    // FIXME
    return tree.getValue();
    // return "\"" + tree.getValue() + "\"";
}

function evalInteger(tree,info){
    return parseInt(tree.getValue());
}

// function evalDouble(tree,info){
//     return parseFloat(tree.getValue());
// }

function evalFloat(tree,info){
    return parseFloat(tree.getValue());
}

function evalTrue(tree,info){
    return true;
}

function evalFalse(tree,info){
    return false;
}

function evalNull(tree,info){
    return null;
}

/* matter.js */
var Engine = Matter.Engine,
	World = Matter.World,
	Body = Matter.Body,
	Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Composite = Matter.Composite,
	Composites = Matter.Composites,
	Common = Matter.Common,
    Vertices = Matter.Vertices,
    Runner = Matter.Runner,
    Render = Matter.Render,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

var engine;
var runner;
var render;

const optionName = [
    "isStatic",
    "isSensor",
    "density",
    "friction",
    "frictionStatic",
    "frictionAir",
    "restitution",
    "angle"
]

const objectTypeList = [
    "circle",
    "rectangle",
    "polygon",
    "trapezoid",
    "car",
    "stack",
    "pyramid",
    "chain",
    "pendulum",
    "cloth",
    "softbody",
    "cross",
    "slingshot",
    "text",
    "constraint"
]

var objectParamMap = {};
var objectMap = {};
var textMap = {};

var matterCanvas = document.getElementById('matter-canvas');
var textCanvas = document.getElementById('text-canvas');
var textContext = textCanvas.getContext('2d');

var indexRegExp = new RegExp('\[[0-9]*\]', 'g');

const fontSize = 40;
// FIXME
const rockSize = 20;

var bgm;

// ctreeで書いてるけど、jsのjsonに寄せる？
// jsonにすると重複禁止なので保留
function initJSON(tree){

    /* 要検討 */
    /* マウスイベント用 */
    var enableMouse = false;
    var mouseConstraint = null;

    /* slingshot用 */
    var enableSlingshot = false;
    var elastic = null;
    var slingshotName = "";

    /* sleeping 動作が軽くなる */
    var enableSleeping = false;

    var renderOption = {
        wireframes: false, /* trueにするとオブジェクトが枠線のみになる */
        width: cvsw,
        height: cvsh,
        background: 'rgba(0, 0, 0, 0)'
    }
    var gravityVal = 1;

    var objectNum = tree.getLength();

    for(var i = 0; i < objectNum; i++){
        var object = tree.getChild(i);
        var objectType = object.getLabeledChild("key").getValue();
        var member = object.getLabeledChild("value");
        var memberNum = member.getLength();

        if(objectType == "world"){
            for(var j = 0; j < memberNum; j++){
                /* getValue()は()->String */
                var key = member.getChild(j).getLabeledChild("key").getValue();
                var value = member.getChild(j).getLabeledChild("value").visit();

                if(key == "gravity"){
                    gravityVal = value;
                }else if(key == "background"){
                    $('#text-canvas').css("background-color", value);
                }else if(key in renderOption){
                    renderOption[key] = value;
                }else if(key == "mouse"){
                    enableMouse = value;
                }else if(key == "sleeping"){
                    enableSleeping = value;
                }else if(key == "gyro"){
                    if(value){
                        window.addEventListener('deviceorientation', updateGravity);
                    }
                    // else{
                    // TODO removeイベント
                    // }
                }else if(key == "wall"){
                    if(value == true){
                        objectMap['_wall0'] = Bodies.rectangle(0, 420, 20, 840, { isStatic: true });
                        objectMap['_wall1'] = Bodies.rectangle(1440, 420, 20, 840, { isStatic: true });
                        objectMap['_wall2'] = Bodies.rectangle(720, 10, 1420, 20, { isStatic: true });
                        objectMap['_wall3'] = Bodies.rectangle(720, 830, 1420, 20, { isStatic: true });
                    }
                }else if(key == "bgm"){
                    bgm = new Audio('./static/audio/' + value);
                    bgm.loop = true;
                }else{
                    return key;
                }
            }
        }else{
            var objectName = null;
            var newObject;

            if(objectType in objectParamMap){
                /* パラメータ引き継ぎ(値渡し) */
                newObject = JSON.parse(JSON.stringify(objectParamMap[objectType]));
            }else if(objectTypeList.indexOf(objectType) > -1){

                var newObject = {
                    type:objectType,
                    x: 0,                  /* x座標 */
                    y: 0,                  /* y座標 */
                    radius: 0,
                    width: 0,
                    height: 0,
                    /* polygon */
                    sides: 0,              /* 多角形の辺の数 */
                    /* trapezoid */
                    slope: 0,              /* 台形の傾斜 */
                    /* car */
                    wheelSize: 0,          /* 車輪の大きさ */
                    /* stack, pyramid */
                    columns: 0,            /* 行 */
                    rows: 0,               /* 列 */
                    // columnGap: 0,          /* 行の間隔 */
                    // rowGap: 0,             /* 列の間隔 */
                    elementType: null,     /* 生成するオブジェクトの種類 */
                    /* chain */
                    length:0,              /* 長さ */
                    size: 0,               /* 大きさ */
                    /* text */
                    textColor: "white",
                    font:'ＭＳ ゴシック',
                    value: null,
                    /* constraint */
                    targetObject: null,
                    /* 速度 */
                    velocityX: 0,
                    velocityY: 0,
                    options: {
                        isStatic: false,   /* 静的オブジェクトかどうか */
                        isSensor: false,   /* コライダーとして扱うか（他のオブジェクトに干渉するか） */
                        density: 0.001,    /* 密度 */
                        friction: 0.1,     /* 摩擦係数 */
                        frictionStatic: 0.5,/* 静摩擦係数 */
                        frictionAir: 0.01, /* 空気抵抗 */
                        restitution: 0,    /* 反発係数 */
                        // 度数にする？
                        angle: 0,          /* 角度 */
                        render: {
                            sprite: {
                                texture: null, /* テクスチャ */
                                // lookAt入れないとダメ？
                                // xScale:5,
                                // yScale:5
                            }
                        },
                        chamfer:{
                            radius:0
                        }
                    }
                };
            }else/* エラー */{
                return objectType;
            }

            for(var j = 0; j < memberNum; j++){
                var key = member.getChild(j).getLabeledChild("key").getValue();
                var value = member.getChild(j).getLabeledChild("value").visit();

                // FIXME こっちで条件分岐した方がいいか？
                if(key == "name"){
                    objectName = value;
                }else if(key == "image"){
                    if(value.indexOf('https://') > -1){
                        // TODO 確認
                        newObject.options.render.sprite.texture = value;
                    }else{
                        // FIXME 拡張子
                        newObject.options.render.sprite.texture = './static/image/' + value;
                    }
                }else if(optionName.indexOf(key) > -1){
                    newObject.options[key] = value;
                }else if(key == "color"){
                    newObject.options.render.fillStyle = value;
                }else if(key == "chamfer"){
                    newObject.options.chamfer = { radius:value };
                }else{
                    if(key in newObject){
                        newObject[key] = value;
                    }else{
                        /* keyがnewObjectにない場合はエラー */
                        return key;
                    }
                }
            }

            if(objectName){
                /* {名前:パラメータ} */
                objectParamMap[objectName] = newObject;
            }

            if(newObject.type == "circle"/* 円 */){
                objectMap[objectName] = Bodies.circle(newObject.x, newObject.y , newObject.radius, newObject.options);
            }else if(newObject.type == "rectangle"/* 四角形 */){
                objectMap[objectName] = Bodies.rectangle(newObject.x, newObject.y, newObject.width, newObject.height, newObject.options);
            }else if(newObject.type == "polygon" /* 正多角形 */){
                objectMap[objectName] = Bodies.polygon(newObject.x, newObject.y, newObject.sides, newObject.radius, newObject.options);
            }else if(newObject.type == "trapezoid" /* 台形 */){
                objectMap[objectName] = Bodies.trapezoid(newObject.x, newObject.y, newObject.width, newObject.height, newObject.slope, newObject.options);
            }else if(newObject.type == "car" /* 車 */){
                objectMap[objectName] = Composites.car(newObject.x, newObject.y, newObject.width, newObject.height, newObject.wheelSize);
            }else if(newObject.type == "stack" /* 積み重ね */){
                // fieldに追加するかどうするか engine生成がこの後なので、World.add()のためにとりあえずpushしておく
                // objectMap[objectName] = Composites.stack(newObject.x, newObject.y, newObject.columns, newObject.rows, newObject.columnGap, newObject.rowGap, getCallBack(newObject.elementType));
                objectMap[objectName] = Composites.stack(newObject.x, newObject.y, newObject.columns, newObject.rows, 0, 0, getCallBack(newObject));
            }else if(newObject.type == "pyramid" /* 山なりに積む */){
                // Gapをパラメータで設定したい？
                // objectMap[objectName] = Composites.pyramid(newObject.x, newObject.y, newObject.columns, newObject.rows, newObject.columnGap, newObject.rowGap, getCallBack(newObject.elementType));
                objectMap[objectName] = Composites.pyramid(newObject.x, newObject.y, newObject.columns, newObject.rows, 0, 0, getCallBack(newObject));
            }else if(newObject.type == "chain" /* 鎖 */){
                var group = Body.nextGroup(true); /* chain内のオブジェクト同士は衝突しないようにcollisionFilterでグループ化する */
                var chain = Composites.stack(newObject.x, newObject.y, newObject.length, 1, 0, 0, getGroupedCallBack(newObject, group));
                objectMap[objectName] = Composites.chain(chain, 0.3, 0, -0.3, 0, {
                    stiffness: 1,
                    length: 0,
                    render: {
                        visible: false
                    }
                });
            }else if(newObject.type == "pendulum" /* 振り子 */){
                objectMap[objectName] = Composites.newtonsCradle(newObject.x, newObject.y, newObject.columns, newObject.radius, newObject.length);
            }else if(newObject.type == "cloth" /* 布 */){
                var group = Body.nextGroup(true);
                objectMap[objectName] = Composites.softBody(newObject.x, newObject.y, newObject.width, newObject.height, 5, 5, false, 8, {
                    friction: 0.00001,
                    collisionFilter: { group: group }
                    , render: { visible: false }
                    }, {
                        stiffness: 0.06
                    }
                );
            }else if(newObject.type == "softbody" /* */){
                var group = Body.nextGroup(true);
                objectMap[objectName] = Composites.softBody(newObject.x, newObject.y, newObject.width, newObject.height, 0, 0, true, 18, {
                    friction: 0.05,
                    frictionStatic: 0.1,
                    render: { visible: false }
                    }
                );
            }else if(newObject.type == "cross"){
                var partA = Bodies.rectangle(newObject.x, newObject.y, newObject.size, newObject.size / 10, newObject.options)
                var partB = Bodies.rectangle(newObject.x, newObject.y, newObject.size / 10, newObject.size, { render: partA.render })
                objectMap[objectName] = Body.create({ parts: [ partA, partB ]});
            }else if(newObject.type == "slingshot" /* カタパルト */){
                var rock = Bodies.polygon(newObject.x, newObject.y, 8, rockSize * ratew, {
                    density: 0.004,
                    render: {
                        sprite: {
                            texture: newObject.options.render.sprite.texture
                        }
                    }
                });
                elastic = Constraint.create({
                    pointA: { x: newObject.x, y:newObject.y },
                    bodyB: rock,
                    stiffness: 0.05
                });
                objectMap[objectName] = elastic;
                objectMap['_rock'] = rock;
                enableSlingshot = true;
                slingshotName = objectName;
            }else if(newObject.type == "text" /* 文字列 */){
                textMap[objectName] = newObject;
            }else if(newObject.type = "constraint" /* 制約 */){
                var index = indexRegExp.exec(newObject.targetObject);
                if(index/* targetObjectが配列の場合 */){
                    /* オブジェクトが配列の場合、object.bodies[index]でアクセスする必要があるため */
                    newObject.targetObject = newObject.targetObject.replace(indexRegExp, '');
                    objectMap[objectName] = Constraint.create({
                        pointA: { x: newObject.x, y: newObject.y },
                        bodyB: objectMap[newObject.targetObject].bodies[parseInt(index[0].slice(1, -1), 10)],
                        // pointB: { x: 25, y: 0 },
                        // length: 2,
                        stiffness: 0.9
                    })
                }else{
                    objectMap[objectName] = Constraint.create({
                        pointA: { x: newObject.x, y: newObject.y },
                        bodyB: objectMap[newObject.targetObject],
                        // pointB: { x: 25, y: 0 },
                        // length: 2,
                        stiffness: 0.9
                    })
                }
            }

            if(!(newObject.velocityX == 0 && newObject.velocityY == 0)){
                if(objectMap[objectName].bodies){
                    for(var obj of objectMap[objectName].bodies){
                        Body.setVelocity(obj, {
                            x:newObject.velocityX,
                            y:newObject.velocityY
                        });
                    }
                }else{
                    Body.setVelocity(objectMap[objectName], {
                        x:newObject.velocityX,
                        y:newObject.velocityY
                    });
                }
            }

        }
    }

    engine = Engine.create({
        enableSleeping: enableSleeping
    })

    /* 重力 */
    engine.world.gravity.y = gravityVal;

    /* engineのアクティブ、非アクティブの制御を行う */
    runner = Runner.create();

    /* worldに追加 */
    World.add(engine.world, Object.values(objectMap));

    /* レンダリング設定 */
    render = Render.create({
        canvas: matterCanvas,/* あらかじめ作成したcanvasに描画するために必須 */
        engine: engine,
        options: renderOption
    });

    /* リサイズ */
    writeAllText();

    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: cvswOrg, y: cvshOrg }
    });

    /* マウスドラッグ */
    if(enableMouse){
        mouseConstraint = mouseDrag(render, engine);
    }

    /* slingshot */
    if(enableSlingshot){
        switchSlingshot(engine, elastic, slingshotName, mouseConstraint);
    }

    Runner.run(runner, engine); /* 物理エンジンを動かす */
    Render.run(render); /* 描画開始 */

    runner.enabled = false; /* 初期位置を描画したら一度止める */

    return false;
}

/* 端末の向きに応じた重力を設定 */
var updateGravity = function(event) {
    var orientation = typeof window.orientation !== 'undefined' ? window.orientation : 0,
        gravity = engine.world.gravity;

    if (orientation === 0) {
        gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
        gravity.y = Common.clamp(event.beta, -90, 90) / 90;
    } else if (orientation === 180) {
        gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
        gravity.y = Common.clamp(-event.beta, -90, 90) / 90;
    } else if (orientation === 90) {
        gravity.x = Common.clamp(event.beta, -90, 90) / 90;
        gravity.y = Common.clamp(-event.gamma, -90, 90) / 90;
    } else if (orientation === -90) {
        gravity.x = Common.clamp(-event.beta, -90, 90) / 90;
        gravity.y = Common.clamp(event.gamma, -90, 90) / 90;
    }
};

function getCallBack(newObject){
    var type = newObject.elementType;
    if(type == "circle"){
        return function(x, y) {
            // return Bodies.circle(x, y, 20);
            return Bodies.circle(x, y, newObject.size, newObject.options);
        };
    }else if(type == "rectangle"){
        return function(x, y) {
            // return Bodies.rectangle(x, y, 25, 40);
            return Bodies.rectangle(x, y, newObject.size, newObject.size, newObject.options);
        };
    }else if(type == "cross"){
        return function(x, y) {
            var partA = Bodies.rectangle(x, y, newObject.size, newObject.size / 10, newObject.options)
            var partB = Bodies.rectangle(x, y, newObject.size / 10, newObject.size, { render: partA.render })
            return Body.create({
                parts: [
                    partA, 
                    partB
                ]
            });
        };
    }else if(type == "random"){
        return function(x, y) {
            switch (Math.round(Common.random(0, 1))) {
    
            case 0:
                if (Common.random() < 0.8) {
                    return Bodies.rectangle(x, y, Common.random(newObject.size / 2, newObject.size), Common.random(newObject.size / 2, newObject.size), newObject.options);
                } else {
                    return Bodies.rectangle(x, y, Common.random(newObject.size, newObject.size * 2), Common.random(newObject.size, newObject.size * 2), newObject.options);
                }
            case 1:
                return Bodies.polygon(x, y, Math.round(Common.random(1, 8)), Common.random(newObject.size / 2, newObject.size), newObject.options);
    
            }
        }
    }
}

function getGroupedCallBack(newObject, group){
    var type = newObject.elementType;
    newObject.options.collisionFilter = { group: group };
    if(type == "circle"){
        return function(x, y) {
            return Bodies.circle(x - newObject.size, y, newObject.size, 
                newObject.options
                // { collisionFilter: { group: group } }
            );
        };
    }else if(type == "rectangle"){
        return function(x, y) {
            return Bodies.rectangle(x - newObject.size, y, newObject.size, newObject.size / 4, 
                // { collisionFilter: { group: group } }
                newObject.options
            );
        };
    }else if(type == "ellipse"){
        // newObject.options.chamfer = 5;
        return function(x, y) {
            return Bodies.rectangle(x - newObject.size, y, newObject.size, newObject.size / 4, 
                { collisionFilter: { group: group }, chamfer: 5 /* 角取り */ }
                // FIXME newObject.options
            );
        };
    }
}

function mouseDrag(render, engine){
    // FIXME engineの扱い
    var mouse = Mouse.create(render.canvas);
    var mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

    World.add(engine.world, mouseConstraint);

    render.mouse = mouse;

    return mouseConstraint;
}

function switchSlingshot(engine, elastic, slingshotName, mouseConstraint){
    // FIXME engineの扱い
    Matter.Events.on(engine, 'afterUpdate', function() {
        if (mouseConstraint.mouse.button === -1 && (Math.abs(objectMap['_rock'].velocity.x) > 20 || Math.abs(objectMap['_rock'].velocity.y) > 20)) {
            objectMap['_rock'] = Bodies.polygon(objectMap[slingshotName].pointA.x, objectMap[slingshotName].pointA.y, 7, rockSize * ratew, {
                density: 0.004,
                render: {
                    sprite: {
                        texture: objectParamMap[slingshotName].options.render.sprite.texture
                    }
                }
            });
            World.add(engine.world, objectMap['_rock']);
            elastic.bodyB = objectMap['_rock'];
        }
    });
}

function writeAllText(){
    textContext.clearRect(0, 0, cvsw, cvsh);

    for(var textParam of Object.values(textMap)){
        textContext.fillStyle = textParam.textColor;
        textContext.font = fontSize * ratew + "px " + textParam.font;
        textContext.fillText(textParam.value, textParam.x * ratew, textParam.y * rateh);
    }
}

// TODO 画面外に出たオブジェクトの扱い

// 削除する
// World.remove(engine.world, object);

/* 反対の画面端から出現させる */
// function wrap(body) {
//     if (body.position.x < 0) {
//         Body.translate(body, {x: cvsw - 1,y: 0});
//     }
//     if (body.position.x > cvsw) {
//         Body.translate(body, {x: 1 - cvsw,y: 0});
//     }
//     if (body.position.y < 0) {
//         Body.translate(body, {x: 0,y: cvsh - 1});
//     }
//     if (body.position.y > cvsh) {
//         Body.translate(body, {x: 0,y: 1 - cvsh});
//     }
// }

// メモ plugin
// stack.bodies[i].plugin.wrap = {
//     min: { x: render.bounds.min.x, y: render.bounds.min.y },
//     max: { x: render.bounds.max.x, y: render.bounds.max.y }
// };

$(window).on('load', function(){
    resizeWindow();
});

/* リサイズイベント */
$(window).on('resize', function(){
    resizeWindow();
});

function resizeWindow(){
    /* 現在の canvas area サイズ */
    cvsw = $('#canvas-area').width();
    cvsh = $('#canvas-area').height();

    resizeCanvasSize();

    ratew = cvsw / cvswOrg;
    rateh = cvsh / cvshOrg;

    /* canvasサイズ更新 */
    $('#matter-canvas').get(0).width = cvsw;
    $('#matter-canvas').get(0).height = cvsh;
    $('#text-canvas').get(0).width = cvsw;
    $('#text-canvas').get(0).height = cvsh;

    centeringCanvas();

    /* objectサイズ更新 */
    writeAllText();
    if(render){
        render.options.width = cvsw;
        render.options.height = cvsh;
    }

}

/* canvasを 16:9 に合わせる */
function resizeCanvasSize(){
    var wBase = cvsw / 16.0;
    var hBase = cvsh / 9.0;
    if(wBase > hBase){
      cvsw = hBase * 16;
    }else{
      cvsh = wBase * 9;
    }
}

function centeringCanvas(){
    var top = ($('#canvas-area').height() - cvsh)/2;
    var left = ($('#canvas-area').width() - cvsw)/2;

    $("#matter-canvas").css({
        "position": "absolute",
        "top": top,
        "left": left
    });
    $("#text-canvas").css({
        "position": "absolute",
        "top": top,
        "left": left
    });
}

/* 各種イベント */

var macaronEditor;

$(function () {

    macaronEditor = ace.edit("macaron-editor");
    macaronEditor.setTheme("ace/theme/xcode");
    macaronEditor.getSession().setMode("ace/mode/macaron");
    macaronEditor.getSession().setUseWrapMode(true);
    macaronEditor.setFontSize(12);

    var GenerateServer = function () {

        resetState();

        compile('json');

        // if($('[name="lang"]').val() == 'json'){
        //     compile('json');
        // }else/* $('[name="lang"]').val() == 'jp' */{
        //     compile('jp');
        // }
    };

    var timer = null;
    macaronEditor.on("change", function (cm, obj) {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(GenerateServer, 400);
    });

    $('#start-plot').click(function () {
        console.log("start");

        /* 一時停止ボタンに切り替え */
        $(this).removeClass("active");
        $($(this).attr("switch-link")).addClass("active");

        /* engineを動かす */
        runner.enabled = true;

        /* audio */
        if(bgm){
            bgm.play();
        }
    });
    $('#pause-plot').click(function (){
        console.log("pause");

        /* 開始ボタンに切り替え */
        $(this).removeClass("active");
        $($(this).attr("switch-link")).addClass("active");

        /* engineを止める */
        runner.enabled = false;

        /* audio */
        if(bgm){
            bgm.pause();
        }
    });
    $('#reset').click(function () {
        console.log("reset");

        if(runner && runner.enabled){
            /* 停止処理 */
            $('#pause-plot').removeClass("active");
            $($('#pause-plot').attr("switch-link")).addClass("active");
            runner.enabled = false;
        }

        resetState();

        compile();
    });
    $('#showMenu').click(function () {
        if($('#macaron-editor').css('display') == 'none'){
            /* エディタ表示 */
            $('#macaron-editor').show();
            $('#sample-menu').show();
            $('#mode-menu').show();
            $('#fontsize-menu').show();
            $('#canvas-area').css('width', '60%');
            resizeWindow();
        }else{
            /* エディタ非表示 */
            $('#macaron-editor').hide();
            $('#sample-menu').hide();
            $('#mode-menu').hide();
            $('#fontsize-menu').hide();
            $('#canvas-area').css('width', '100%');
            resizeWindow();
        }
    });
    /* デモ用 */
    $('[name="samples"]').change(function() {
        var sampleName = $('[name="samples"]').val();
        var url = ''

        if(sampleName == "slingshot"){
            url = '/sample/slingshot';
        }else if(sampleName == "bridge"){
            url = '/sample/bridge';
        }else if(sampleName == "car"){
            url = '/sample/car';
        }else if(sampleName == "pendulum"){
            url = '/sample/pendulum';
        }else if(sampleName == "wreckingball"){
            url = '/sample/wreckingball';
        }else if(sampleName == "japanese"){
            url = '/sample/japanese';
        }else{
            // TODO
        }

        if(url != ''){
            $.ajax({
                url: url,
                type: 'POST',
                timeout: 5000,
            })
            .done(function(data) {
                macaronEditor.setValue(data);
            })
            .fail(function(XMLHttpRequest, textStatus, errorThrown) {
                console.log("ajax通信に失敗しました");
                console.log("XMLHttpRequest : " + XMLHttpRequest.status);
                console.log("textStatus     : " + textStatus);
                console.log("errorThrown    : " + errorThrown.message);
            });
        }else{
            macaronEditor.setValue("");
        }
    });
    /* 文字サイズ */
    $('[name="fontsize"]').change(function() {
        var fontsize = Number($('[name="fontsize"]').val());
        // alert($('[name="fontsize"]').val());
        macaronEditor.setFontSize(fontsize);
    });
    
    /* ファイル読み込み(スタイルシート) */
    // $('#load-json').click(function() {
    //     console.log("load json")
    //     $('#loadfile-json').click();
    //     $('#loadfile-json').change(function(){
    //         var reader = new FileReader();
    //         reader.onload = function () {
    //             jsonEditor.toTextArea();
    //             $('#macaron-text').val(reader.result);
    //             jsonEditor = makeJSONEditor();
    //         }
    //         var file = this.files[0];
    //         // FIXME ファイルチェック
    //         // if (!file.type.match(/json/)){
    //         //     alert("対応ファイル json");
    //         //     return;
    //         // }
    //         reader.readAsText(file);
    //     });
    // });
});

function compile(lang){

    var inputs = macaronEditor.getValue();

    var postURL = '/stylesheet';

    if(lang == "jp"){
        postURL = '/jp';
    }

    /* サーバーにinputsを投げる */
    $.ajax({
        url: postURL,
        type: 'POST',
        // dataType: 'json',
        data: {
            source:inputs
        },
        timeout: 5000,
    })
    .done(function(data) {

        var annotations = [];

        /* スタイルシートの処理 */
        var inputsJSON = (new TextEncoder).encode(stylesheet);
        var jsonResult = parseJSON(inputsJSON,inputsJSON.length-1);

        // if(lang == "jp"){
        //     // エラーの返し方による
        // }

        if(jsonResult.tag == "[error]"){
            var errorStr = stylesheet.substr(jsonResult.pos, jsonResult.epos);
            var errorLine = errorStr.split("\n").length - 1;

            /* 行の先頭でパースエラーが発生した場合 */
            if(errorStr.split("\n")[errorLine].replace(/^\s+/g, "").length <= 1){
                /* 間違っている構文は一つ前の行 */
                errorLine = errorLine - 1;
            }

            annotations = [
                {
                    row: errorLine, // FIXME
                    type: "error",
                    text: "Syntax Error"
                }
            ];

        }else{
            var errorKey = initJSON(jsonResult);

            if(errorKey){
                var errorPos = stylesheet.indexOf(errorKey);
                var errorStr = stylesheet.substr(0, errorPos + errorKey.length);
                var errorLine = errorStr.split("\n").length - 1;

                annotations = [
                    {
                        row: errorLine,
                        type: "error",
                        text: "Can't find parameter: " + errorKey
                    }
                ];

            }else{
                /* ルールの処理 */
                myRule();
            }
        }

        macaronEditor.getSession().setAnnotations(annotations);

    })
    .fail(function(XMLHttpRequest, textStatus, errorThrown) {
        /* textStatus == "parseerror" の時、rule.jsでシンタックスエラー */
        console.log("ajax通信に失敗しました");
        console.log("XMLHttpRequest : " + XMLHttpRequest.status);
        console.log("textStatus     : " + textStatus);
        console.log("errorThrown    : " + errorThrown.message);
        // TODO うざい
        // alert(textStatus.name + ': ' + errorThrown.message);
    });
}

function resetState(){

    textContext.clearRect(0, 0, cvsw, cvsh);

    $('#text-canvas').css("background-color", 'black');

    objectParamMap = {};
    objectMap = {};
    textMap = {};

    if(render){
        Render.stop(render);
        // render.canvas.remove();
        render.canvas = null;
        render.context = null;
        render.textures = {};
    }
    if(runner){
        Runner.stop(runner);
        runner = null;
    }
    if(engine){
        World.clear(engine.world);
        Engine.clear(engine);
        engine = null;
    }

    // TODO 他のaudioの扱い
    if(bgm){
        bgm.pause();
        bgm.currentTime = 0;
    }
}

/* マウス位置表示 */
function simple_tooltip(target_items, name){
    $(target_items).each(function(i){
        $("body").append("<div class='"+name+"' id='"+name+i+"'><p></p></div>");
        var my_tooltip = $("#"+name+i);
        var tooltipDoc =  document.getElementById(name+i);

        if($(this).attr("title") != "" && $(this).attr("title") != "undefined" ){
            $(this).removeAttr("title").mouseover(function(){
                my_tooltip.css({opacity:0.8, display:"none"}).fadeIn(400);
            }).mousemove(function(kmouse){
                var border_top = $(window).scrollTop();
                var border_right = $('#canvas-area').width();
                var left_pos;
                var top_pos;
                var offset = 5;  // 場所

                if(border_right - (offset *2) >= my_tooltip.width() + kmouse.pageX){
                    left_pos = kmouse.pageX+offset;
                } else{
                    left_pos = border_right-my_tooltip.width()-offset;
                }

                if(border_top + (offset *2)>= kmouse.pageY - my_tooltip.height()){
                    top_pos = border_top +offset;
                } else{
                    top_pos = kmouse.pageY-my_tooltip.height()-offset;
                }

                my_tooltip.css({left:left_pos, top:top_pos});

                tooltipDoc.innerHTML = '<p>'+ getMousePosition(matterCanvas, kmouse) +'</p>'

            }).mouseout(function(){
                my_tooltip.css({left:"-9999px"});
            });
        }
    });
}

$(document).ready(function(){  
    simple_tooltip("#matter-canvas","tooltip");  
});

function getMousePosition(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return "(" + (evt.clientX - rect.left) + "," + (evt.clientY - rect.top) + ")"
}

/* Matter.js(参考) */

/* キー入力 */
// var RIGHT = 0;
// var LEFT = 0;
// var UP = 0;
// var SPACE = 0;

// document.onkeydown = function(event){
//         if (event.keyCode == 39) {RIGHT = 1};
//         if (event.keyCode == 37) {LEFT = 1};
//         if (event.keyCode == 38) {UP = 1};
//         if (event.keyCode == 32) {SPACE = 1};
// };
// document.onkeyup = function(event){
//         if (event.keyCode == 39) {RIGHT = 0};
//         if (event.keyCode == 37) {LEFT = 0};
//         if (event.keyCode == 38) {UP = 0};
//         if (event.keyCode == 32) {SPACE = 0};
// };