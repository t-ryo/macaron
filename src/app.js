/* 廃止予定 */
const images = {
    "<sakura>":"image/sakura.png",
    "<fish>":"image/fish.png",
    "<star>":"image/star.png",
    "<arrow>":"image/arrow.png",
    "<triangle>":"image/triangle.png",
    "<rocket>":"image/rocket.png",
    "<circle>":"image/circle.png",
    "<block>":"image/block.png"
};
/* 廃止予定 */
/* MObjectのtype */
const motype = {
    IMAGE: 1,
    NUMBER: 2,
    STRING: 3
};

const ttag = {
    Source: "Source",
    Rule: "Rule",
    Context: "Context",
    TimingPremise: "TimingPremise",
    Premise: "Premise",
    PeriodicSome: "PeriodicSome",
    Periodic: "Periodic",
    Event: "Event",
    Body: "Body",
    Let: "Let",
    Assign: "Assign",
    Return: "Return",
    Name: "Name",
    Infix: "Infix",
    Cast: "Cast",
    Unary: "Unary",
    Norm: "Norm",
    Method: "Method",
    Get: "Get",
    Apply: "Apply",
    Index: "Index",
    CastExpr: "CastExpr",
    Tuple: "Tuple",
    Empty: "Empty",
    List: "List",
    RangeUntilExpr: "RangeUntilExpr",
    RangeExpr: "RangeExpr",
    Dict: "Dict",
    Data: "Data",
    Template: "Template",
    String: "String",
    Char: "Char",
    Image: "Image",
    Rational: "Rational",
    Unit: "Unit",
    Int: "Int",
    Double: "Double",
    True: "True",
    False: "False",
    Null: "Null",
    Pictogram: "Pictogram"
};

/* 廃止予定 */
/* オブジェクトのデフォルトサイズ */
const objh = 64;
const objw = 64;

/* 廃止予定 */
/* オブジェクトの初期位置を制御する */
class Cursor{
    constructor(){
        this.x = 0;
        this.y = 0;
    }

    next(){
        if(this.x + objw <= cvsw){
            this.x = this.x + objw;
        }else{
            this.x = 0;
            this.y = this.y + objh;
        }
    }
    
    reset(){
        this.x = 0;
        this.y = 0;
    }
}

/* MObject及び子クラス 廃止予定 */
/* Matter.Bodyが代わりになる */
class MObject {
    constructor(value) {
        this.value = value;
    }
}
class MImage extends MObject {
    constructor(value) {
        super(value);
        this.img = new Image();
        this.img.src = "image/" + value + ".png";
        this.visible = true;
        this.type = motype.IMAGE;

        this.x = cursor.x;
        this.y = cursor.y;
        cursor.next();
        this.h = objh;
        this.w = objw;
        this.a = 0;
        this.ix = this.x;
        this.iy = this.y;
        this.ih = this.h;
        this.iw = this.w;
        this.ia = this.a;
    }

    init(){
        this.x = this.ix;
        this.y = this.iy;
        this.h = this.ih;
        this.w = this.iw;
        this.a = this.ia;
    }
}
class MPictogram extends MObject {
    constructor(value) {
        super(value);
        this.img = new Image();
        this.visible = true;
        this.type = motype.IMAGE;

        this.x = cursor.x;
        this.y = cursor.y;
        cursor.next();
        this.h = objh;
        this.w = objw;
        this.a = 0;
        this.ix = this.x;
        this.iy = this.y;
        this.ih = this.h;
        this.iw = this.w;
        this.ia = this.a;
    }

    init(){
        this.x = this.ix;
        this.y = this.iy;
        this.h = this.ih;
        this.w = this.iw;
        this.a = this.ia;
    }
}
class MCircle extends MPictogram{
    constructor(value) {
        super (value);
        this.img.src = "image/circle.png";
    }
}
class MNumber extends MObject {
    constructor(value) {
        super(value);
        this.value = value;
        this.type = motype.NUMBER;
    }
}
class MString extends MObject {
    constructor(value) {
        super(value);
        this.value = value;
        this.type = motype.STRING;
    }
}
class MEmpty extends MObject {
    constructor(value){
        super(value);
    }
}

/* 廃止するかは未定 新しい仕様次第 */
/* macaron言語の関数はパターンマッチで記述される。
   その際同じ名前の関数が複数記述される。
   2回目以降はすでに定義されている関数を更新する必要がある。
   よって、更新に必要な情報を保持しておく */
class MFunc{
    constructor(func, params, body) {
        this.func = func; /* 関数全体 eval()で評価するためString */
        this.params = params; /* 関数の引数 */
        this.body = body; /* 関数の中身 funcを更新する際に使用 */
    }
}

var cvsw = 900; /* canvas幅 */
var cvsh = 900; /* canvas高さ */
var cos = 0;
var sin = 0;
var rad = Math.PI / 180;
var timeCounter = 0; /* macaronシミュレータの実行時間 */
var timer; // TODO 確認
var result; /* macaronコードのパース結果の木 */
/* 未定 */
var Mouse = {
    x:0,
    y:0
};

var globalField = {}; 
var currentField = globalField; /* スコープ管理のため */
var svariableCount = 0; // TODO 確認
var showFlipper = false;
var cursor = new Cursor(); /* 廃止予定 */
var events = []; /* removeの際、event情報が必要なため */

/* 廃止予定 */
function createImage(input) {
    return new MImage(input);
}

/* パース結果の木はctree(ノード)をclinkで繋いでいるので、
   現在のctreeから次のctreeを参照するために一手間かかる。
   以下は、ctreeを楽に操作するためのメソッドを挿している。 */
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

/* 木を表示 主にデバッグ用 */
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


/* evalTag名()関数はビジターパターンで呼ばれる */
function evalSource(tree,info){
    var length = tree.getLength();
    for(var i = 0;i<length;i++){
        tree.getChild(i).visit(info);
    }
    return null;
}

// FIXME 新しい仕様次第
function evalRule(tree,info){
    var before = currentField;
    currentField = {};
    var contextTree = tree.getLabeledChild("context");
    var inContext = contextTree != null ? contextTree.visit(info) : null;
    info.counter = 0;
    if(info.inFlow){
        if(tree.getLabeledChild("cond").tag === ttag.TimingPremise){/* foreach or event */
            if(!(tree.getLabeledChild("cond").getLabeledChild("timing").tag === ttag.Event)){
                /* eventは前処理のみ */
                /* foreachの処理 */
                while(true){
                    var bool = tree.getLabeledChild("cond").visit(info);
                    if(bool){
                        info.isKey = false;
                        tree.getLabeledChild("body").visit(info);
                    }else{
                        break;
                    }
                }
            }
        }else{
            if(tree.getLabeledChild("cond").getChild(0).tag === ttag.Name){
                info.isKey = false;
                tree.getLabeledChild("body").visit(info);/* Premiseへ */
            }
        }
    }else{
        if(tree.getLabeledChild("cond").tag === ttag.TimingPremise){
            if(tree.getLabeledChild("cond").getLabeledChild("timing").tag === ttag.Event){/* event処理 */
                var eventInfo = tree.getLabeledChild("cond").visit(info);
                var event = eventInfo["event"];
                var targets = eventInfo["target"];
                var conds = eventInfo["conds"];
                // if(event == "Click"){
                //     var clickFunc = function(evt){
                //         var before = currentField;
                //         currentField = {};
                //         if(onDown/* 廃止済み */(overlayCanvas/* 廃止済み */, evt, targets, conds)){
                //             info.isKey =false;
                //             tree.getLabeledChild("body").visit(info);
                //         }
                //         currentField = before;
                //     };
                //     overlayCanvas.addEventListener("mousedown",clickFunc,false);
                //     events.push(["mousedown",clickFunc]);
                // }
            }
        }else{
            if(tree.getLabeledChild("cond").getChild(0).tag === ttag.Apply){/* 関数定義 */
                info.isKey = true;
                var funcInfo = tree.getLabeledChild("cond").visit(info);
                /* 関数はパターンマッチで記述されるので、同じ名前の関数が来た際に前の関数を更新する必要がある */
                if(funcInfo.name in globalField){/* すでに同じ名前の関数が存在する場合 */
                    var mfunc = globalField[funcInfo.name];
                    if(mfunc.params.length == funcInfo.params.length){/* 関数の引数の数が同じか確認 */
                        /* 新しい関数の引数名をすでにある関数の引数名と一致させるために、(新変数名)=(旧変数名)として環境に登録 */
                        for(var i = 0; i < mfunc.params.length; i++){
                            currentField[funcInfo.params[i]] = mfunc.params[i];
                        }
                        info.inFuncDecl = true;
                        var conds = funcInfo.conds;
                        /* 新しい関数のパターンマッチの条件を取得 */
                        for(var i=0; i<conds.length; i++){
                            if(ctree.prototype.isPrototypeOf(conds[i])){
                                conds[i] = conds[i].visit(info);
                            }
                        }
                        var body = "if(" + conds.join(' && ') + "){" + tree.getLabeledChild("body").visit(info) + "}"
                        info.inFuncDecl = false;
                        /* 関数の中身を更新 */
                        body = mfunc.body + body;
                        mfunc.body = body;
                        mfunc.func = "(function(" + mfunc.params.join(',') + "){" + body + "})";
                        globalField[funcInfo.name] = mfunc;
                    }else{/* 関数の引数の数が違う場合はエラー */
                        throw new Error('wrong number of arguments');
                        // return false;
                    }
                }else{/* 同じ名前の関数が存在しない場合 */
                    var conds = funcInfo.conds;
                    /* パターンマッチの条件を取得 */
                    for(var i=0; i<conds.length; i++){
                        if(ctree.prototype.isPrototypeOf(conds[i])){
                            conds[i] = conds[i].visit(info);
                        }
                    }
                    /* 更新用に関数の中身を保持しておく */
                    var body = "if(" + conds.join(' && ') + "){" + tree.getLabeledChild("body").visit(info) + "}"
                    /* eval用に関数を完成 */
                    var func = "(function(" + funcInfo.params.join(',') + "){" + body + "})";
                    globalField[funcInfo.name] = new MFunc(func,funcInfo.params,body);
                }
            }
        }
    }
    currentField = before;
    return null;
}

/* 未実装 */
function evalContext(tree,info){
    var length = tree.getLength();
    var inContext = true;
    for(var i = 0;i<length;i++){
        inContext = inContext && tree.getChild(i).visit(info); // TODO 子ノードのeval結果はbool?
    }
    return inContext;
}

function evalTimingPremise(tree,info){
    var length = tree.getLength();
    if(tree.getLabeledChild("timing").tag === ttag.Event){/* eventの処理 */
        var target = tree.getChild(0).visit(info);
        var targets = target["target"];
        if(length > 1){
            var conds = [];
            for(var i = 1; i < length; i++){
                conds.push(tree.getChild(i))
            }
        }else{
            var conds = true;
        }
        target["conds"] = conds;
        return target;
    }else{/* foreachの処理 */
        var targets = tree.getChild(0).visit(info);
        while(targetsSetter(targets,info.counter,[],{index:0})){
            var isContinue = false;
            for(var i = 1;i<length;i++){
                if(!(tree.getChild(i).visit(info))){
                    isContinue = true;
                    break;
                }
            }
            info.counter++;
            if(isContinue){
                continue;
            }else{
                return true;
            }
        }
    }
    return false;
}

function evalPremise(tree,info){
    var funcInfo = {};
    var length = tree.getLength();
    var funcTree = tree.getChild(0);
    funcInfo.name = funcTree.getLabeledChild("recv").visit(info);
    var funcParams = funcTree.getLabeledChild("param").visit(info);
    var conds = [];
    if(length == 1){
        if(funcParams.length == 0){
            params = funcParams;
            conds = ["true"];
        }else{
            var paramLen = funcParams.length;
            var params = [];
            for(var i = 0;i<paramLen;i++){
                if(typeof funcParams[0] == "number" || funcParams[0].match("\"") != null){
                    params.push("p" + i); 
                    conds.push("p" + i + " == " + funcParams[i]); 
                }else{
                    params.push(funcParams[i]);
                    conds.push("true");
                }
            }
        }
        funcInfo.params = params;
        funcInfo.conds = conds;
    }else{
        funcInfo.params = funcParams;
        for(var i = 1;i<length;i++){
            conds.push(tree.getChild(i));
        }
        funcInfo.conds = conds;
    }
    return funcInfo;
}

function evalPeriodicSome(tree,info){ // FIXME
    var targets = [];
    targets.push(tree.getChild(0).visit({inFlow:true,isKey:true}));
    targets.push(tree.getChild(1).visit({inFlow:true,isKey:true}));
    return targets;
}

function evalPeriodic(tree,info){
    var length = tree.getLength();
    var targets = []
    for(var i = 0;i<length;i++){
        targets.push(tree.getChild(i).visit({inFlow:true,isKey:true}));
    }
    return targets;
}

function evalEvent(tree,info){
    try{
        var event = {"event":tree.getChild(0).getLabeledChild("recv").visit({inFlow:false,isKey:true})};
        var target = tree.getChild(0).getLabeledChild("param").visit({inFlow:false,isKey:true});
        if(!(target instanceof Array)){
            target = [target];
        }
        event["target"] = target;
    }catch(e){
        console.error("EventError:", e.message);
    }
    return event;
}

function evalBody(tree,info){
    var length = tree.getLength();
    if(info.isKey){
        var body = "";
        for(var i = 0;i<length;i++){
            body = body + tree.getChild(i).visit(info);
        }
        return body;
    }

    for(var i = 0;i<length;i++){
        tree.getChild(i).visit(info);
    }
    return null;
}

function evalAssign(tree,info){
    if(info.isKey){
        return tree.getLabeledChild("left").visit(info) + "=" + tree.getLabeledChild("right").visit(info) + ";";
    }

    var right = tree.getLabeledChild("right").visit(info);
    info.isKey = true;
    var left = tree.getLabeledChild("left").visit(info);
    var leftName = left;
    if(leftName.indexOf(".") > 0){
        leftName = leftName.slice(0, leftName.indexOf("."));
    }
    if(leftName.indexOf("[") > 0){
        leftName = leftName.slice(0, leftName.indexOf("["));
    }
    
    if(MEmpty.prototype.isPrototypeOf(right)){
        try{
            currentField[leftName].img.src = "image/" + right.value + ".png";
            currentField[leftName].value = right.value;
        }catch(e){
            globalField[leftName].img.src = "image/" + right.value + ".png";
            globalField[leftName].value = right.value;
        }
        return null;
    }
    var val = null;
    
    if(leftName in currentField){
        val = eval("currentField." + left + " = " + right);
    }else if(leftName in globalField){
        val = eval("globalField." + left + " = " + right);
    }else{
        val = eval(left + " = " + right);
    }
    // try{
    //     val = eval("currentField." + tree.getLabeledChild("left").visit(info) + " = " + right);
    // }catch(e){
    //     try{
    //         val = eval("globalField." + tree.getLabeledChild("left").visit(info) + " = " + right);
    //     }catch(e){
    //         val = eval(tree.getLabeledChild("left").visit(info) + " = " + right);
    //     }
    // }
    info.isKey = false;
    return null;
}

function evalReturn(tree,info){
    if(info.isKey){
        var returnExp = "return ";
        returnExp = returnExp + tree.getLabeledChild("expr").visit(info) + ";";
        return returnExp;
    }
    return tree.getLabeledChild("expr").visit(info);
}

function evalLet(tree,info){
    if(info.isKey){
        return tree.getLabeledChild("left").visit(info) + "=" + tree.getLabeledChild("right").visit(info) + ";";
    }
    // FIXME?
    if(!(info.inFlow)){
        currentField[tree.getLabeledChild("left").visit({inFlow:false,isKey:true})] = tree.getLabeledChild("right").visit({inFlow:false,createNew:true});
    }
    return null;
}

function evalPosition(tree,info){
    if(!(info.inFlow)){
        tree.getChild(0).visit({inFlow:false});
    }
    return null;
}

function evalName(tree,info){
    var val = tree.getValue();
    if(info.inFuncDecl){
        if(val in currentField){
            return currentField[val];
        }
    }
    if(info.isKey){
        return val;
    }
    if(val in currentField){
        return currentField[val];
    }
    if(val in globalField){
        return globalField[val];
    }
    throw new Error("Can't find variable: " + val); // FIXME
    // return val;
}

function evalInfix(tree,info){
    if(info.isKey){
        return tree.getLabeledChild("left").visit(info) + tree.getLabeledChild("op").visit(info) + tree.getLabeledChild("right").visit(info);
    }
    var left = tree.getLabeledChild("left").visit(info);
    var right = tree.getLabeledChild("right").visit(info);
    if(MObject.prototype.isPrototypeOf(left)){
        left = left.value;
    }
    if(MObject.prototype.isPrototypeOf(right)){
        right = right.value;
    }
    return eval("left" + tree.getLabeledChild("op").visit({isKey:true}) + "right");
}

function evalCast(tree,info){
    if(info.isKey){
        return "(" + tree.getLabeledChild("type").visit(info) + ")" + tree.getLabeledChild("recv").visit(info);
    }
    return eval("(" + tree.getLabeledChild("type").visit(info) + ")" + tree.getLabeledChild("recv").visit(info));
}

function evalUnary(tree,info){
    if(info.isKey){
        return tree.getLabeledChild("op").visit(info) + tree.getLabeledChild("expr").visit(info);
    }
    return eval(tree.getLabeledChild("op").visit(info) + tree.getLabeledChild("expr").visit(info));
}

function evalNorm(tree,info){
    if(info.isKey){
        return "|" + tree.getLabeledChild("expr").visit(info) + "|";
    }
    return eval("|" + tree.getLabeledChild("expr").visit(info) + "|");
}

function evalMethod(tree,info){
    if(info.isKey){
        return tree.getLabeledChild("recv").visit(info) + "." + tree.getLabeledChild("name").visit(info) + "(" + tree.getLabeledChild("param").visit(info) + ")";
    }
    info.isKey = true;
    var val = null;

    var recv = tree.getLabeledChild("recv").visit(info);
    var name = tree.getLabeledChild("name").visit(info);
    var params = tree.getLabeledChild("param").visit(info);
    var paramStr = "";

    if(Array.isArray(params)){
        var length = params.length;
        for(var i = 0;i<length;i++){
            if(params[i] in currentField){
                params[i] = currentField[params[i]];
            }
            if(params[i] in globalField){
                params[i] = globalField[params[i]];
            }
            paramStr = i == 0 ? paramStr + "params[" + i + "]" : paramStr + ",params[" + i + "]";
        }
    }else{
        if(params in currentField){
            params = currentField[params];
        }
        if(params in globalField){
            params = globalField[params];
        }
        paramStr = "params"
    }

    try{
        val = eval("currentField." + recv + "." + name + "(" + paramStr + ")");
    }catch(e){
        try{
            val = eval("globalField." + recv + "." + name + "(" + paramStr + ")");
        }catch(e){
            val = eval(recv + "." + name + "(" + paramStr + ")");
        }
    }
    info.isKey = false;
    return val;
}

function evalGet(tree,info){
    if(info.isKey){
        return tree.getLabeledChild("recv").visit(info) + "." + tree.getLabeledChild("name").visit(info);
    }
    info.isKey = true;
    var val = null;
    try{
        val = eval("currentField." + tree.getLabeledChild("recv").visit(info) + "." + tree.getLabeledChild("name").visit(info));
    }catch(e){
        try{
            val = eval("globalField." + tree.getLabeledChild("recv").visit(info) + "." + tree.getLabeledChild("name").visit(info));
        }catch(e){
            val = eval(tree.getLabeledChild("recv").visit(info) + "." + tree.getLabeledChild("name").visit(info));
        }
    }
    info.isKey = false;
    return val;
}

function evalApply(tree,info){
    if(info.isKey){
        return "callFunc(\"" + tree.getLabeledChild("recv").visit(info) + "\")(" + tree.getLabeledChild("param").visit(info) + ")";
        
    }

    info.isKey = true;
    var val = null;
    var recv = tree.getLabeledChild("recv").visit(info);
    var params = tree.getLabeledChild("param").visit(info);
    var paramStr = "";
    if(Array.isArray(params)){
        var length = params.length;
        for(var i = 0;i<length;i++){
            if(params[i] in currentField){
                params[i] = currentField[params[i]];
            }
            if(params[i] in globalField){
                params[i] = globalField[params[i]];
            }
            if(MObject.prototype.isPrototypeOf(params[i]) || params[i].type == "body"){
                // MObject以外のオブジェクトもこちら
                // .type のため、undefinedは今とれない
                paramStr = i == 0 ? paramStr + "params[" + i + "]" : paramStr + ",params[" + i + "]";
            }else{
                if(Array.isArray(params[i])){
                    paramStr = i == 0 ? paramStr + "[" + params[i] + "]" : paramStr + "," + "[" + params[i] + "]";
                }else{
                    paramStr = i == 0 ? paramStr + params[i] : paramStr + "," + params[i];
                }
            }
        }
    }else{
        if(params in currentField){
            params = currentField[params];
        }
        if(params in globalField){
            params = globalField[params];
        }
        paramStr = "params"
    }

    try{
        var mfunc = eval("currentField." + recv)
        val = eval(mfunc.func + "(" + paramStr + ")");
    }catch(e){
        try{
            var mfunc = eval("globalField." + recv)
            val = eval(mfunc.func + "(" + paramStr + ")");
        }catch(e){
            val = eval(recv + "(" + paramStr + ")");
        }
    }
    info.isKey = false;
    return val;
}

function evalIndex(tree,info){
    if(info.isKey){
        return tree.getLabeledChild("recv").visit(info) + "[" + tree.getLabeledChild("param").visit(info) + "]";
    }
    info.isKey = true;
    var val = null;
    try{
        val = eval("currentField." + tree.getLabeledChild("recv").visit(info) + "[" + tree.getLabeledChild("param").visit(info) + "]");
    }catch(e){
        try{
            val = eval("globalField." + tree.getLabeledChild("recv").visit(info) + "[" + tree.getLabeledChild("param").visit(info) + "]");
        }catch(e){
            val = eval(tree.getLabeledChild("recv").visit(info) + "[" + tree.getLabeledChild("param").visit(info) + "]");
        }
    }
    info.isKey = false;
    return val;
}

function evalArguments(tree,info){
    var length = tree.getLength();
    var list = [];
    for(var i = 0;i<length;i++){
        list.push(tree.getChild(i).visit(info));
    }
    return list;
}

function evalCastExpr(tree,info){
    if(info.isKey){
        return tree.getLabeledChild("recv").visit(info) + "=>" + tree.getLabeledChild("type").visit(info);
    }
    info.isKey = true;
    var val = null;
    try{
        val = eval("currentField." + tree.getLabeledChild("recv").visit(info) + "=>" + tree.getLabeledChild("type").visit(info));
    }catch(e){
        try{
            val = eval("globalField." + tree.getLabeledChild("recv").visit(info) + "=>" + tree.getLabeledChild("type").visit(info));
        }catch(e){
            val = eval(tree.getLabeledChild("recv").visit(info) + "=>" + tree.getLabeledChild("type").visit(info));
        }
    }
    info.isKey = false;
    return val;
}

function evalTuple(tree,info){
    var length = tree.getLength();
    var tuple = [];
    for(var i = 0;i<length;i++){
        tuple.push(tree.getChild(i).visit(info));
    }
    return tuple;
}

function evalEmpty(tree,info){
    return null;
}

function evalList(tree,info){
    var length = tree.getLength();
    var list = [];
    for(var i = 0;i<length;i++){
        list.push(tree.getChild(i).visit(info));
    }
    return list;
}

function evalRangeUntilExpr(tree,info){
    var list = [];
    var start = tree.getLabeledChild("left").visit(info);
    var end = tree.getLabeledChild("right").visit(info);
    if(typeof start == "number" && typeof end == "number"){
        for(var i = start; i < end; i++){
            list.push(i);
        }
    }else if(typeof start == "string" && typeof end == "string"){
        var startByte = start.charCodeAt(0);
        var endByte = end.charCodeAt(0);
        for(var i = startByte; i < endByte; i++) {
            list.push(String.fromCodePoint(i));
        }
    }
    return list;
}

function evalRangeExpr(tree,info){
    var list = [];
    var start = tree.getLabeledChild("left").visit(info);
    var end = tree.getLabeledChild("right").visit(info);
    if(typeof start == "number" && typeof end == "number"){
        for(var i = start; i <= end; i++){
            list.push(i);
        }
    }else if(typeof start == "string" && typeof end == "string"){
        var startByte = start.charCodeAt(0);
        var endByte = end.charCodeAt(0);
        for(var i = startByte; i <= endByte; i++) {
            list.push(String.fromCodePoint(i));
        }
    }
    return list;
}

function evalDict(tree,info){
    var length = tree.getLength();
    var dict = {};
    for(var i = 0;i<length;i++){
        var target = tree.getChild(i);
        dict[target.getLabeledChild("name").visit(info)] = target.getLabeledChild("value").visit(info);
    }
    return dict;
}

function evalData(tree,info){
    return null; // TODO
}

function evalTemplate(tree,info){
    var length = tree.getLength();
    var template = "\`";
    for(var i = 0;i<length;i++){
        template = template + tree.getChild(i).getValue(); // TODO 確認
    }
    template = template +  "\`";
    return template;
}

function evalString(tree,info){
    return "\"" + tree.getValue() + "\"";
}

function evalChar(tree,info){
    return "\'" + tree.getValue() + "\'";
}

/* 廃止予定 */
function evalImage(tree,info){
    if(info.createNew){
        return createImage(tree.getValue());
    }
    return new MEmpty(tree.getValue());
}

function evalRational(tree,info){
    return eval(tree.getValue());
}

function evalUnit(tree,info){
    return null; // TODO
}

function evalInt(tree,info){
    return parseInt(tree.getValue());
}

function evalDouble(tree,info){
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

/* 廃止予定 */
function evalPictogram(tree,info){
    if(info.createNew){
        return new MCircle("circle");
    }
    return new MEmpty("circle");
}

/* foreachの対象を見つける 廃止するかは仕様次第 */
function targetsSetter(targets,index,setted,counter){
    for(obj in globalField){
        if(setted.indexOf(obj) === -1){
            currentField[targets[0]] = globalField[obj];
            setted.push(obj);
            if(targets.length !== 1){
                if(targetsSetter(targets.slice(1),index,setted.slice(0),counter)){
                    return true;
                }else{
                    continue;
                }
            }else if(counter.index == index){
                return true;
            }else{
                counter.index++;
            }
        }
    }
    return false;
}

/* Mfuncをeval()で評価するための関数 */
function callFunc(funcName){
    if(funcName in currentField){
        return eval(currentField[funcName].func);
    }else if(funcName in globalField){
        return eval(globalField[funcName].func);
    }
    return eval(funcName);
}

function init() {

    // for(var obj in globalField){
    //     if(MImage.prototype.isPrototypeOf(globalField[obj])){
    //         globalField[obj].init();
    //     }
    //     if(MPictogram.prototype.isPrototypeOf(globalField[obj])){
    //         globalField[obj].init();
    //     }
    // }

    // plot();
    // timeCounter = 0;
    // $(function(){
    //     $("#time-counter").text(timeCounter);
    // });
}

/* matter.js */
var Engine = Matter.Engine,
	World = Matter.World,
	Body = Matter.Body,
	Bodies = Matter.Bodies,
	Constraint = Matter.Constraint,
	Composites = Matter.Composites,
	Common = Matter.Common,
    Vertices = Matter.Vertices,
    Runner = Matter.Runner,
    MouseConstraint = Matter.MouseConstraint;
    
var engine;
var runner;

function initMSS(tree){

    /* 生成したオブジェクトを格納しておき、最後にworldに追加する */
    // FIXME grobalfield に追加？ grobalfield を残すか未定なので保留
    var objects = [];
    var objNum = tree.getLength();

    var wireframesVal = false;
    var backgroundVal = 'black';
    var gravityVal = 1;

    for(var i = 0; i < objNum; i++){

        var object = tree.getChild(i);
        
        if(object.tag == "World"){
            for(var j = 0; j < object.getLength(); j++){
                if(object.getChild(j).tag == "WireFrames"){
                    wireframesVal = object.getChild(j).getChild(0).visit({inFlow:false, isKey:true});
                }else if(object.getChild(j).tag == "Background"){
                    backgroundVal = object.getChild(j).getChild(0).visit({inFlow:false, isKey:true});
                }else if(object.getChild(j).tag == "Gravity"){
                    gravityVal = object.getChild(j).getChild(0).visit({inFlow:false, isKey:true});
                }
            }
        }else/* obejct */{

            /* 木の形決まっているので決め打ち */
            // grobalfieldに追加する際はlabel名で
            var objLabel = object.getChild(0).visit({inFlow:false, isKey:true});

            var paramVal = [];
            var paramNode = object.getChild(1);
            for(var j = 0; j < paramNode.getLength(); j++){
                paramVal.push(paramNode.getChild(j).visit({inFlow:false, isKey:true}));
            }

            /* matter.jsの初期値と同じ */
            /* optionの数は任意なので、先に宣言しておく */
            var isStaticVal = false; /* 静的オブジェクトかどうか */
            var densityVal = 0.001; /* 密度 */
            var frictionVal = 0.1; /* 摩擦係数 */
            var frictionAirVal = 0.01; /* 空気抵抗 */
            var restitutionVal = 0; /* 反発係数 */
            var image = null; /* テクスチャ */

            // image のリサイズ

            /* option 処理 */
            if(object.getLength() > 2){
                for(var j = 2; j < object.getLength(); j++){
                    if(object.getChild(j).tag == "IsStatic"){
                        isStaticVal = object.getChild(j).getChild(0).visit({inFlow:false, isKey:true});
                    }else if(object.getChild(j).tag == "Density"){
                        densityVal = object.getChild(j).getChild(0).visit({inFlow:false, isKey:true});
                    }else if(object.getChild(j).tag == "Friction"){
                        frictionVal = object.getChild(j).getChild(0).visit({inFlow:false, isKey:true});
                    }else if(object.getChild(j).tag == "FrictionAir"){
                        frictionAirVal = object.getChild(j).getChild(0).visit({inFlow:false, isKey:true});
                    }else if(object.getChild(j).tag == "Restitution"){
                        restitutionVal = object.getChild(j).getChild(0).visit({inFlow:false, isKey:true});
                    }else if(object.getChild(j).tag == "Image"){
                        /* とりあえず、imageディレクトリ内の画像を扱う */
                        image = object.getChild(j).getChild(0).getValue();
                        image = "image/" + image;
                        // TODO
                        // リセットイベント
                    }
                }
            }
            
            if(paramNode.tag == "Circle"/* 円 */){
                objects.push(Bodies.circle(paramVal[0], paramVal[1], paramVal[2], {
                    isStatic: isStaticVal,
                    density: densityVal,
                    friction: frictionVal,
                    frictionAir: frictionAirVal,
                    restitution: restitutionVal,
                    render: {
                        sprite: {
                            texture:image
                        }
                    },
                }))
            }else if(paramNode.tag == "Polygon"/* 正多角形 */){
                objects.push(Bodies.circle(paramVal[0], paramVal[1], paramVal[2], paramVal[3], {
                    isStatic: isStaticVal,
                    density: densityVal,
                    friction: frictionVal,
                    frictionAir: frictionAirVal,
                    restitution: restitutionVal,
                    render: {
                        sprite: {
                            texture: image
                        }
                    },
                }))
            }else if(paramNode.tag == "Rectangle" /* 四角形 */){
                objects.push(Bodies.rectangle(paramVal[0], paramVal[1], paramVal[2], paramVal[3], {
                    isStatic: isStaticVal,
                    density: densityVal,
                    friction: frictionVal,
                    frictionAir: frictionAirVal,
                    restitution: restitutionVal,
                    render: {
                        sprite: {
                            texture: image
                        }
                    },
                }))
            }else if(paramNode.tag == "Trapezoid" /* 台形 */){
                objects.push(Bodies.circle(paramVal[0], paramVal[1], paramVal[2], paramVal[3], paramVal[4], {
                    isStatic: isStaticVal,
                    density: densityVal,
                    friction: frictionVal,
                    frictionAir: frictionAirVal,
                    restitution: restitutionVal,
                    render: {
                        sprite: {
                            texture: image
                        }
                    },
                }))
            }
        }
    }

    engine = Engine.create(mattercanvas, {
        render: {
            options: {
                wireframes: wireframesVal, /* trueにするとオブジェクトが枠線のみになる */
                width: cvsw,
                height: cvsh,
                background: backgroundVal
            }
        }
    });

    /* 重力 */
    engine.world.gravity.y = gravityVal;

    /* time counter を更新イベントに設定 */
    Matter.Events.on(engine, 'afterUpdate', function() {
        $("#time-counter").text(++timeCounter);
    });

    /* engineのアクティブ、非アクティブの制御を行う */
    runner = Runner.create();

    /* worldに追加 */
    World.add(engine.world, objects);

    /* スタイルシートを読み込んだ段階で
       オブジェクトを描画するために
       runの後、engineを非アクティブにする。 */
    Runner.run(runner, engine);
    
    //TODO フレーム待機 描画されないのはなぜ？
    // setTimeout(function(){
    //     runner.enabled = false;
    // }, 1);

    runner.enabled = false;

    /* メモ
       sleepingは更新をしなくなる。
       (描画精度は落ちるが、安定性とパフォーマンス向上)
       アクティブなオブジェクトに接触すると再び起きる。 */
}

$(function () {
    var initCode = "";
    // var initCode = "s = <sakura>\nforeach a  a == <sakura>\n-------------------\n    $a.x = a.x + 10\nwhen Click(a)  a == <sakura>\n-------------------\n    $a = <fish>";
    $('#source-text').val(initCode);
    var jsEditor = makeEditor();
    var mssEditor = makeMSSEditor();
    cvsw = $('#mapping-area').width();
    cvsh = $('#mapping-area').height();
    var timer = false; /* maimloopに使用されていた 要確認 */
    // FIXME
    $(window).resize(function() {
        if (timer !== false) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            console.log('resized');
            cvsw = $('#mapping-area').width();
            cvsh = $('#mapping-area').height();
        }, 200);
    });
    $('#eval').click(function () {
        console.log("eval");

        // TODO macaronの仕様次第

        /* parse */
        // resetState();
        // jsEditor.toTextArea();
        // var inputs = (new TextEncoder).encode($('#source-text').val().toString());
        // result = parse(inputs,inputs.length-1);
        // jsEditor = makeEditor();

        /* eval */
        // cursor.reset();
        // globalField = {};
        // currentField = globalField;
        // result.visit({inFlow:false});
        // init();
    });
    /* ファイル読み込み(macaronコード) */
    $('#load').click(function() {
        console.log("load")
        $('#loadfile').click();
        $('#loadfile').change(function(){
            var reader = new FileReader();
            reader.onload = function () {
                jsEditor.toTextArea();
                $('#source-text').val(reader.result);
                jsEditor = makeEditor();
            }
            var file = this.files[0];
            // FIXME macaronファイルに対応
            if (!file.type.match(/text/)){
                alert("対応ファイル macaron|txt");
            }
            reader.readAsText(file);
        });
    });
    $('#start-plot').click(function () {
        console.log("start");

        /* 一時停止ボタンに切り替え */
        $(this).removeClass("active");
        $($(this).attr("switch-link")).addClass("active");
        
        /* engineを動かす */
        runner.enabled = true;    
    });
    $('#pause-plot').click(function (){
        console.log("pause");

        /* 開始ボタンに切り替え */
        $(this).removeClass("active");
        $($(this).attr("switch-link")).addClass("active");

        /* engineを止める */
        runner.enabled = false;
    });
    $('#increment-frame').click(function () {
        console.log("increment-frame");
        
        runner.enabled = true;
        /* 1フレーム後にrunnerを再び非アクティブにする */
        // FIXME timeCounterが増えない場合がある
        setTimeout(function(){
            runner.enabled = false;
        }, 1);

    });
    $('#reset').click(function () {
        console.log("reset");

        resetState();

        // TODO
        // engineとrunnerを消去
        // スタイルシート読み込み
        // macaronコード処理

        /* 旧macaronバージョン */
        // init();
    });
    $('#apply').click(function (){
        console.log("apply")

        resetState();

        /* パース */
        mssEditor.toTextArea();
        var inputs = (new TextEncoder).encode($('#mss-text').val().toString());
        var mssResult = parseMSS(inputs,inputs.length-1); /* macaron.jsとmss.jsで定数が名前衝突するので、要変更 */
        mssEditor = makeMSSEditor();

        globalField = {};
        currentField = globalField;

        initMSS(mssResult);

    });
    /* ファイル読み込み(スタイルシート) */
    $('#load-mss').click(function() {
        console.log("load mss")
        $('#loadfile-mss').click();
        $('#loadfile-mss').change(function(){
            var reader = new FileReader();
            reader.onload = function () {
                mssEditor.toTextArea();
                $('#mss-text').val(reader.result);
                mssEditor = makeMSSEditor();
            }
            var file = this.files[0];
            // FIXME mssファイルに対応
            if (!file.type.match(/text/)){
                alert("対応ファイル mss|txt");
            }
            reader.readAsText(file);
        });
    });
});

/* Macaronコード用エディタ */
function makeEditor(){
    return CodeMirror.fromTextArea(document.getElementById("source-text"), {
        mode: "javascript",
        lineNumbers: false,
        indentUnit: 4
    });
}

/* スタイルシート用エディタ */
function makeMSSEditor(){
    var mssEditor = CodeMirror.fromTextArea(document.getElementById("mss-text"), {
        mode: "javascript", // FIXME
        lineNumbers: false,
        indentUnit: 4
        // ,extraKeys: {"Ctrl-Space": "autocomplete"}
    });

    mssEditor.setSize(550, 250);
    // mssEditor.on('change', imageComplete);
    return mssEditor;
}

// FIXME
function resetState(){
    // cursor.reset();
    // events = [];
    timeCounter = 0;
    $("#time-counter").text(timeCounter);
}

/* 補完機能(参考) */
// let imageList = ['arrow', 'circle', 'fish', 'rocket', 'sakura', 'star', 'triangle']

// window.onload = function(){
//     var folderRef = new Folder("/image/");
//     var fileList = folderRef.getFiles();
//     var imageList1 = [];
//     for (i=0; i<fileList.length; i++){
//         imageList1 = push(fileList[i].fullName);
//     }
//     console.log(imageList1);
// }

// let imageComplete = function(cm) {
//   CodeMirror.showHint(cm, function() {
//     let cur = cm.getCursor(); 
//     let token = cm.getTokenAt(cur);
//     var ch = cur.ch;
//     let line = cur.line;
//     let start = token.start;
//     let end = ch;

//     var inputReg = new RegExp('^' + token.string);
//     let filteredList = imageList.filter((item) => {
//         return item.slice(0, item.length - 1).match(inputReg) ? true : false
//     });
//     if (filteredList.length >= 1) {
//         ch = 0;
//         return {
//             list: filteredList,
//             from: CodeMirror.Pos(line, ch),
//             to: CodeMirror.Pos(line, end)
//         }
//     }

//   }, { completeSingle: false })
// }

/* 位置設定関数(参考) */
// function POS(posx,posy,obj){
//     obj.x = posx;
//     obj.y = posy;
//     obj.ix = obj.x;
//     obj.iy = obj.y;
// }

// function RAND(){
//     for(obj of arguments){
//         POS(Math.random()*cvsw, Math.random()*cvsh, obj);
//     }
// }

// function CENTER(){
//     var ys = [];
//     for(obj of arguments){
//         if(ys.indexOf(obj.y) < 0){
//             ys.push(obj.y);
//         }
//     }
//     for(posy of ys){
//         var sumw = 0;
//         for(obj of arguments){
//             if(posy == obj.y){
//                 sumw = sumw + obj.w;
//             }
            
//         }
//         var posx = (cvsw - sumw) / 2;
//         for(obj of arguments){
//             if(posy == obj.y){
//                 POS(posx, posy, obj);
//                 posx = posx + obj.w;
//             }
//         }
//     }
// }

/* 主にデバッグ用 */
function LOG(arg){
    console.log(arg);
}

/* Matter.js(参考) */

/* マウスドラッグ */
// function enableMouse(){
//     var mouseConstraint = MouseConstraint.create(engine);
//     World.add(engine.world, mouseConstraint);
//     var mouse = Mouse.create(render.canvas),
//     mouseConstraint = MouseConstraint.create(engine, {
//         mouse: mouse,
//         constraint: {
//             stiffness: 0.2,
//             render: {
//                 visible: false
//             }
//         }
//     });
//     World.add(world, mouseConstraint);
//     render.mouse = mouse;
// }

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

// var OLD_X = 0;
// var OLD_Y = 0;

// function setController(target){
//     Matter.Events.on(engine, 'beforeUpdate', function() {
//          if (RIGHT == 1) {
//            Matter.Body.setAngularVelocity(target, Math.PI / 180);
//          };
//          if (LEFT == 1) {
//            Matter.Body.setAngularVelocity(target, -Math.PI / 180);
//          };
         
//          // 移動
//          speedx = Math.abs(target.position.x - OLD_X);
//          speedy = Math.abs(target.position.y - OLD_Y);
//          if (UP == 1 && speedx * speedx + speedy * speedy < 10) {
//              Matter.Body.applyForce(target, {
//                  x: target.position.x,
//                  y: target.position.y
//              }, {
//                  x: Math.cos(target.angle-Math.PI/2) * 0.003,
//                  y: Math.sin(target.angle-Math.PI/2) * 0.003
//              });
//          }
//          wrap(target);
//          OLD_X = target.position.x;
//          OLD_Y = target.position.y;   
//     });
// }


/* 画面外に出たオブジェクトを反対の画面端から出現させる */
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

/* 動的オブジェクト生成 */
// var RELOAD_TIME = 0;
// var bullet = [];
// var bulletNo = 0;

// function setBullet(target){
//     Matter.Events.on(engine, 'beforeUpdate', function() {
//          if (SPACE == 1 && RELOAD_TIME > 12) {
//             RELOAD_TIME = 0;

//             bullet[bulletNo] = Bodies.circle(target.position.x + Math.cos(target.angle-Math.PI/2) * 60, target.position.y + Math.sin(target.angle-Math.PI/2) * 60, 10, {
//                 density: 0.002,
//                 frictionAir: 0,
//                 friction: 0,
//                 label: 'bullet',
//                 render: {sprite: {
//                   //texture: 'bullet.png'
//                 }}
//             });

//             Matter.Body.applyForce(bullet[bulletNo], {
//                 x: bullet[bulletNo].position.x,
//                 y: bullet[bulletNo].position.y
//             }, {
//                 x: Math.cos(target.angle-Math.PI/2) * 0.014,
//                 y: Math.sin(target.angle-Math.PI/2) * 0.014
//             });

//             World.add(engine.world, [bullet[bulletNo]]);
//             bulletNo++;
//         }

//         var removeIndex = [];
//         var newBullet = [];
//         for (i = 0; i < bullet.length; i++) {
//               if (bullet[i].position.x < 0 || bullet[i].position.x > cvsw) {
//                    World.remove(engine.world, [bullet[i]]);
//                    removeIndex.push(i);
//               }
//               else if (bullet[i].position.y < 0 || bullet[i].position.y > cvsh) {
//                    World.remove(engine.world, [bullet[i]]);
//                    removeIndex.push(i);
//               }
//         }
//         for (i = 0; i < bullet.length; i++) {
//           if(-1 * removeIndex.indexOf(i)){
//             newBullet.push(bullet[i]);
//           }
//         }
//         bullet = newBullet;
//         bulletNo = bulletNo - removeIndex.length;
//         newBullet = [];
//         removeIndex = [];
        
//         RELOAD_TIME = RELOAD_TIME + 1; 
//     });

//     return {type:"body", label:"bullet"};
// }

/* 衝突判定 */
// function collision(targetA, targetB, action){
//     // TODO action
//     Matter.Events.on(engine, 'collisionEnd', function(event) {
//         pairs = event.pairs;
//         for (i = 0; i < pairs.length; i++) {
//             var pair = pairs[i];
//             if (pair.bodyA.label === targetA.label && pair.bodyB.label === targetB.label) {
//                 World.remove(engine.world, pair.bodyA);
//                 World.remove(engine.world, pair.bodyB);
//             }
//         }
//     });
// }