const images = {
    "<sakura>":"image/sakura.png",
    "<fish>":"image/fish.png",
    "<star>":"image/star.png",
    "<arrow>":"image/arrow.png",
    "<triangle>":"image/triangle.png",
    "<rocket>":"image/rocket.png"
};
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

const objh = 64;
const objw = 64;

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

var cursor = new Cursor();

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
class Transition {
    constructor(){

    }
}

class MFunc{
    constructor(func, params, body) {
        this.func = func;
        this.params = params;
        this.body = body;
    }
}

var globalField = {};
var currentField = globalField;
var Transitions = [];
var TransitionCount = 0;
var currentTransition = -1;
var svariableCount = 0;
var showFlipper = false;
function createImage(input) {
    return new MImage(input);
}
function createTransition(){
    var transition;
    transition = new Transition();
    Transitions.push(transition);
    TransitionCount++;
    return transition;
}

ctree.prototype.getLength = function(){
    return this.child.calcLength();
}

ctree.prototype.getChild = function(index){
    try{
        var length = this.getLength();
        var i = length - index;
        if(i > length || i <= 0) throw new RangeError('IndexError in ctree.getChild');
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
    return this.child.passLabeledChild(label);
}

ctree.prototype.visit = function(info){
    return eval("eval" + this.tag + "(this,info)");
}

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

function evalSource(ctree,info){
    var length = ctree.getLength();
    for(var i = 0;i<length;i++){
        ctree.getChild(i).visit(info);
    }
    return null;
}

function evalRule(ctree,info){
    var before = currentField;
    currentField = {};
    var contextTree = ctree.getLabeledChild("context");
    var inContext = contextTree != null ? contextTree.visit(info) : null;
    info.counter = 0;
    var timingTag = inContext == null ? ctree.getChild(0).getLabeledChild("timing").tag : ctree.getChild(1).getLabeledChild("timing").tag;
    if(info.inFlow){
        if(ctree.getLabeledChild("cond").tag === ttag.TimingPremise){
            var timingTag = inContext == null ? ctree.getChild(0).getLabeledChild("timing").tag : ctree.getChild(1).getLabeledChild("timing").tag;
            if(timingTag === ttag.Event){
                for(var obj in globalField){
                    info.currentObject = globalField[obj];
                    var targets = ctree.getLabeledChild("cond").visit(info);
                    var event = targets["event"];
                    var body = ctree.getLabeledChild("body");
                    if(event == "Click"){
                        var clickFunc = function(evt){
                            if(onDown(canvas, evt, currentField[targets["target"]])){
                                body.visit(info);
                            }
                        };
                        canvas.addEventListener("mousedown",clickFunc,false);
                    }
                }
            }else{
                info.counter = 0;
                while(true){
                    var bool = ctree.getLabeledChild("cond").visit(info);
                    if(bool){
                        info.isKey = false;
                        ctree.getLabeledChild("body").visit(info);
                    }else{
                        break;
                    }
                }
            }
        }
    }else{
        if(ctree.getLabeledChild("cond").tag === ttag.TimingPremise){
            if(timingTag === ttag.Event){
                var targets = ctree.getLabeledChild("cond").visit(info);
                var event = targets["event"];
                var targetVal = currentField[targets["target"]].value;
                var body = ctree.getLabeledChild("body");
                var eventField = currentField;
                if(event == "Click"){
                    var clickFunc = function(evt){
                        if(onDown(canvas, evt, targetVal)){
                            currentField = eventField;
                            info.isKey =false;
                            body.visit(info);
                        }
                    };
                    canvas.addEventListener("mousedown",clickFunc,false);
                }
            }
        }else{
            info.isKey = true;
            var funcInfo = ctree.getLabeledChild("cond").visit(info);
            if(funcInfo.name in globalField){
                var mfunc = globalField[funcInfo.name];
                if(mfunc.params.length == funcInfo.params.length){
                    var body = "if(" + funcInfo.conds.join(' && ') + "){" + ctree.getLabeledChild("body").visit(info) + "}";
                    for(var i = 0; i < mfunc.params.length; i++){
                        body = body.replace(new RegExp(funcInfo.params[i], 'g'),mfunc.params[i]); // FIXME 変数だけを置換したい
                    }
                    body = mfunc.body + body;
                    mfunc.body = body;
                    mfunc.func = "(function(" + mfunc.params.join(',') + "){" + body + "})";
                    globalField[funcInfo.name] = mfunc;
                }else{ // TODO 引数の数が異なる時
                    return false;
                }
            }else{
                var body = "if(" + funcInfo.conds.join(' && ') + "){" + ctree.getLabeledChild("body").visit(info) + "}";
                var func = "(function(" + funcInfo.params.join(',') + "){" + body + "})";
                globalField[funcInfo.name] = new MFunc(func,funcInfo.params,body);
            }
        }
    }
    currentField = before;
    return null;
}

function evalContext(ctree,info){
    var length = ctree.getLength();
    var inContext = true;
    for(var i = 0;i<length;i++){
        inContext = inContext && ctree.getChild(i).visit({inFlow:true,isKey:true}); // TODO 子ノードのeval結果はbool?
    }
    return inContext;
}

function evalTimingPremise(ctree,info){
    var inEvent = ctree.getLabeledChild("timing").tag === ttag.Event;
    if(inEvent){
        var target = ctree.getChild(0).visit(info);

        var targets = [target["target"]];
        var length = targets.length;
    }else{
        var length = ctree.getLength();
        var targets = ctree.getChild(0).visit(info);
    }
    while(targetsSetter(targets,info.counter,[],{index:0})){
        var isContinue = false;
        for(var i = 1;i<length;i++){
            if(!(ctree.getChild(i).visit(info))){
                isContinue = true;
                break;
            }
        }
        info.counter++;
        if(isContinue){
            continue;
        }else{
            if(inEvent){
                return target;
            }else{
                return true;
            }
        }
    }
    return false;
}

function evalPremise(ctree,info){
    var funcInfo = {};
    var length = ctree.getLength();
    var funcTree = ctree.getChild(0);
    funcInfo.name = funcTree.getLabeledChild("recv").visit({inFlow:false,isKey:true});
    var funcParams = funcTree.getChild(1).getValue().split(',');
    var conds = [];
    if(length == 1){
        var paramLen = funcParams.length;
        var params = [];
        for(var i = 0;i<paramLen;i++){
            params.push("p" + i); // FIXME funcParams が変数の場合ある？
            conds.push("p" + i + " == " + funcParams[i]); 
        }
        funcInfo.params = params;
        funcInfo.conds = conds;
    }else{
        funcInfo.params = funcParams;
        for(var i = 1;i<length;i++){
            conds.push(ctree.getChild(i).visit({inFlow:false,isKey:true}));
        }
        funcInfo.conds = conds;
    }
    return funcInfo;
}

function evalPeriodicSome(ctree,info){
    var targets = [];
    targets.push(ctree.getChild(0).visit({inFlow:true,isKey:true}));
    targets.push(ctree.getChild(1).visit({inFlow:true,isKey:true}));
    return targets;
}

function evalPeriodic(ctree,info){
    var length = ctree.getLength();
    var targets = []
    for(var i = 0;i<length;i++){
        targets.push(ctree.getChild(i).visit({inFlow:true,isKey:true}));
    }
    return targets;
}

function evalEvent(ctree,info){// FIXME 現状決め打ち
    return {
        "event":ctree.getChild(0).getChild(0).visit({inFlow:true,isKey:true}),
        "target":ctree.getChild(0).getChild(1).getValue()
    };
}

function evalBody(ctree,info){
    var length = ctree.getLength();
    if(info.isKey){
        var body = "";
        for(var i = 0;i<length;i++){
            body = body + ctree.getChild(i).visit({inFlow:true,isKey:true});
        }
        return body;
    }

    for(var i = 0;i<length;i++){
        ctree.getChild(i).visit(info);
    }
    return null;
}

function evalAssign(ctree,info){
    var right = ctree.getLabeledChild("right").visit(info);
    info.isKey = true;
    var val = null;
    try{
        val = eval("currentField." + ctree.getLabeledChild("left").visit(info) + " = " + right);
    }catch(e){
        try{
            val = eval("globalField." + ctree.getLabeledChild("left").visit(info) + " = " + right);
        }catch(e){
            val = eval(ctree.getLabeledChild("left").visit(info) + " = " + right);
        }
    }
    info.isKey = false;
    return null;
}

function evalReturn(ctree,info){
    if(info.isKey){
        var returnExp = "return ";
        returnExp = returnExp + ctree.getValue().replace('=>','') + ";";
        return returnExp;
    }
    return ctree.getLabeledChild("expr").visit(info);// 仮
}

function evalLet(ctree,info){
    if(!(info.inFlow)){
        currentField[ctree.getLabeledChild("left").visit({inFlow:false,isKey:true})] = ctree.getLabeledChild("right").visit({inFlow:false,createNew:true});
    }
    return null;
}

function evalName(ctree,info){
    var val = ctree.getValue();
    if(info.isKey){
        return val;
    }
    if(val in currentField){
        return currentField[val];
    }
    if(val in globalField){
        return globalField[val];
    }
    return val;
}

function evalInfix(ctree,info){
    if(info.isKey){
        return ctree.getLabeledChild("left").visit(info) + ctree.getLabeledChild("op").visit(info) + ctree.getLabeledChild("right").visit(info);
    }
    var left = ctree.getLabeledChild("left").visit(info);
    var right = ctree.getLabeledChild("right").visit(info);
    if(MObject.prototype.isPrototypeOf(left)){
        left = left.value;
    }
    if(MObject.prototype.isPrototypeOf(right)){
        right = right.value;
    }
    return eval("left" + ctree.getLabeledChild("op").visit({isKey:true}) + "right");
}

function evalCast(ctree,info){
    if(info.isKey){
        return "(" + ctree.getLabeledChild("type").visit(info) + ")" + ctree.getLabeledChild("recv").visit(info);
    }
    return eval("(" + ctree.getLabeledChild("type").visit(info) + ")" + ctree.getLabeledChild("recv").visit(info));
}

function evalUnary(ctree,info){
    if(info.isKey){
        return ctree.getLabeledChild("op").visit(info) + ctree.getLabeledChild("expr").visit(info);
    }
    return eval(ctree.getLabeledChild("op").visit(info) + ctree.getLabeledChild("expr").visit(info));
}

function evalNorm(ctree,info){
    if(info.isKey){
        return "|" + ctree.getLabeledChild("expr").visit(info) + "|";
    }
    return eval("|" + ctree.getLabeledChild("expr").visit(info) + "|");
}

function evalMethod(ctree,info){
    if(info.isKey){
        return ctree.getLabeledChild("recv").visit(info) + "." + ctree.getLabeledChild("name").visit(info) + "(" + ctree.getLabeledChild("param").visit(info) + ")";
    }
    info.isKey = true;
    var val = null;

    var recv = ctree.getLabeledChild("recv").visit(info);
    var name = ctree.getLabeledChild("name").visit(info);
    var params = ctree.getLabeledChild("param").visit(info);
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

    try{ // TODO
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

function evalGet(ctree,info){
    if(info.isKey){
        return ctree.getLabeledChild("recv").visit(info) + "." + ctree.getLabeledChild("name").visit(info);
    }
    info.isKey = true;
    var val = null;
    try{
        val = eval("currentField." + ctree.getLabeledChild("recv").visit(info) + "." + ctree.getLabeledChild("name").visit(info));
    }catch(e){
        try{
            val = eval("globalField." + ctree.getLabeledChild("recv").visit(info) + "." + ctree.getLabeledChild("name").visit(info));
        }catch(e){
            val = eval(ctree.getLabeledChild("recv").visit(info) + "." + ctree.getLabeledChild("name").visit(info));
        }
    }
    info.isKey = false;
    return val;
}

function evalApply(ctree,info){
    if(info.isKey){
        return ctree.getLabeledChild("recv").visit(info) + "(" + ctree.getLabeledChild("param").visit(info) + ")";
    }

    info.isKey = true;
    var val = null;
    var recv = ctree.getLabeledChild("recv").visit(info);
    var params = ctree.getLabeledChild("param").visit(info);
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

    try{ // FIXME
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

function evalIndex(ctree,info){
    if(info.isKey){
        return ctree.getLabeledChild("recv").visit(info) + "[" + ctree.getLabeledChild("param").visit(info) + "]";
    }
    info.isKey = true;
    var val = null;
    try{
        val = eval("currentField." + ctree.getLabeledChild("recv").visit(info) + "[" + ctree.getLabeledChild("param").visit(info) + "]");
    }catch(e){
        try{
            val = eval("globalField." + ctree.getLabeledChild("recv").visit(info) + "[" + ctree.getLabeledChild("param").visit(info) + "]");
        }catch(e){
            val = eval(ctree.getLabeledChild("recv").visit(info) + "[" + ctree.getLabeledChild("param").visit(info) + "]");
        }
    }
    info.isKey = false;
    return val;
}

function evalCastExpr(ctree,info){
    if(info.isKey){
        return ctree.getLabeledChild("recv").visit(info) + "=>" + ctree.getLabeledChild("type").visit(info);
    }
    info.isKey = true;
    var val = null;
    try{
        val = eval("currentField." + ctree.getLabeledChild("recv").visit(info) + "=>" + ctree.getLabeledChild("type").visit(info));
    }catch(e){
        try{
            val = eval("globalField." + ctree.getLabeledChild("recv").visit(info) + "=>" + ctree.getLabeledChild("type").visit(info));
        }catch(e){
            val = eval(ctree.getLabeledChild("recv").visit(info) + "=>" + ctree.getLabeledChild("type").visit(info));
        }
    }
    info.isKey = false;
    return val;
}

function evalTuple(ctree,info){
    var length = ctree.getLength();
    var tuple = [];
    for(var i = 0;i<length;i++){
        tuple.push(ctree.getChild(i).visit({inFlow:true,isKey:true}));
    }
    return tuple;
}

function evalEmpty(ctree,info){
    return null;
}

function evalList(ctree,info){
    var length = ctree.getLength();
    var list = [];
    for(var i = 0;i<length;i++){
        list.push(ctree.getChild(i).visit({inFlow:true,isKey:true}));
    }
    return list;
}

function evalRangeUntilExpr(ctree,info){
    var list = [];
    var start = ctree.getLabeledChild("left").visit({inFlow:false,isKey:true});
    var end = ctree.getLabeledChild("right").visit({inFlow:false,createNew:true});
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

function evalRangeExpr(ctree,info){
    var list = [];
    var start = ctree.getLabeledChild("left").visit({inFlow:false,isKey:true});
    var end = ctree.getLabeledChild("right").visit({inFlow:false,createNew:true});
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

function evalDict(ctree,info){
    var length = ctree.getLength();
    var dict = {};
    for(var i = 0;i<length;i++){
        var target = ctree.getChild(i);
        dict[target.getLabeledChild("name").visit({inFlow:false,isKey:true})] = target.getLabeledChild("value").visit({inFlow:false,createNew:true});
    }
    return dict;
}

function evalData(ctree,info){
    return null; // TODO
}

function evalTemplate(ctree,info){
    var length = ctree.getLength();
    var template = "\`";
    for(var i = 0;i<length;i++){
        template = template + ctree.getChild(i).getValue();
    }
    template = template +  "\`";
    return template;
}

function evalString(ctree,info){
    return "\"" + ctree.getValue() + "\"";
}

function evalChar(ctree,info){
    return "\'" + ctree.getValue() + "\'";
}

function evalImage(ctree,info){
    if(info.createNew){
        return createImage(ctree.getValue());
    }
    return new MEmpty(ctree.getValue());
}

function evalRational(ctree,info){
    return eval(ctree.getValue());
}

function evalUnit(ctree,info){
    return null; // TODO
}

function evalInt(ctree,info){
    return parseInt(ctree.getValue());
}

function evalDouble(ctree,info){
    return parseFloat(ctree.getValue());
}

function evalTrue(ctree,info){
    return true;
}

function evalFalse(ctree,info){
    return false;
}

function evalNull(ctree,info){
    return null;
}

function evalPictogram(ctree,info){
    if(info.createNew){
        return new MCircle("circle");
    }
    return new MEmpty("circle");
}

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

var canvas = document.getElementById("cvs");
var ctx = canvas.getContext("2d");
var cvsw = 900;
var cvsh = 900;
var cos = 0;
var sin = 0;
var rad = Math.PI / 180;
var timeCounter = 0;
var timer;
var result;
var Mouse = {
    x:0,
    y:0
};
canvas.addEventListener('mousemove', function (evt) {
    var mousePos = getMousePosition(canvas, evt);
    Mouse.x = mousePos.x;
    Mouse.y = mousePos.y;
}, false);
function getMousePosition(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
// FIXME 個別に指定する場合
function onDown(canvas, evt, target){
    var mousePos = getMousePosition(canvas, evt);
    for(var obj in globalField) {
        if(MImage.prototype.isPrototypeOf(globalField[obj])){
            if(globalField[obj].value == target){
                if (globalField[obj].x < mousePos.x && (globalField[obj].x + globalField[obj].w) > mousePos.x && globalField[obj].y < mousePos.y && (globalField[obj].y + globalField[obj].h) > mousePos.y) {
                    return true;
                }
            }
        }
    }
    return false;
}
function plot() {
    ctx.clearRect(0, 0, cvsw, cvsh);
    for(var obj in globalField) {
        if(MImage.prototype.isPrototypeOf(globalField[obj])){
            cos = Math.cos(globalField[obj].a * rad);
            sin = Math.sin(globalField[obj].a * rad);
            ctx.setTransform(cos, sin, -1 * sin, cos, globalField[obj].x, globalField[obj].y);
            ctx.drawImage(globalField[obj].img, 0, 0, globalField[obj].w, globalField[obj].h);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        if(MPictogram.prototype.isPrototypeOf(globalField[obj])){
            cos = Math.cos(globalField[obj].a * rad);
            sin = Math.sin(globalField[obj].a * rad);
            ctx.setTransform(cos, sin, -1 * sin, cos, globalField[obj].x, globalField[obj].y);
            ctx.drawImage(globalField[obj].img, 0, 0, globalField[obj].w, globalField[obj].h);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
}
function mainloop() {
    if(result !== null){
        result.visit({inFlow:true});
    }
    for(var obj in globalField) {
        if(MImage.prototype.isPrototypeOf(globalField[obj])){
            if(globalField[obj].x > cvsw) globalField[obj].x -= cvsw;
            if(globalField[obj].x < 0) globalField[obj].x += cvsw;
            if(globalField[obj].y > cvsh) globalField[obj].y -= cvsh;
            if(globalField[obj].y < 0) globalField[obj].y += cvsh;
            if(globalField[obj].a > 360) globalField[obj].a -= 360;
            if(globalField[obj].a < 0) globalField[obj].a += 360;
        }
        if(MPictogram.prototype.isPrototypeOf(globalField[obj])){
            if(globalField[obj].x > cvsw) globalField[obj].x -= cvsw;
            if(globalField[obj].x < 0) globalField[obj].x += cvsw;
            if(globalField[obj].y > cvsh) globalField[obj].y -= cvsh;
            if(globalField[obj].y < 0) globalField[obj].y += cvsh;
            if(globalField[obj].a > 360) globalField[obj].a -= 360;
            if(globalField[obj].a < 0) globalField[obj].a += 360;
        }
    }
    plot();
    $(function(){
        $("#time-counter").text(++timeCounter);
    });
}
function start() {
    timer = setInterval(mainloop, 20);
}
function pause() {
    clearInterval(timer);
}
function incrementFrame() {
    mainloop();
}
function init() {
    for(var obj in globalField){
        if(MImage.prototype.isPrototypeOf(globalField[obj])){
            globalField[obj].init();
        }
        if(MPictogram.prototype.isPrototypeOf(globalField[obj])){
            globalField[obj].init();
        }
    }
    plot();
    timeCounter = 0;
    $(function(){
        $("#time-counter").text(timeCounter);
    });
}

$(function () {
    var initCode = "s = <sakura>\nforeach a  a == <sakura>\n-------------------\n    $a.x = a.x + 10\nwhen Click(a)  a == <sakura>\n-------------------\n    $a.img.src = \"image/fish.png\"";
    $('#source-text').val(initCode);
    var jsEditor = makeEditor();
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
    $('#parse').click(function () {
        console.log("parse");
        jsEditor.toTextArea();
        cursor.reset(); // FIXME
        var inputs = (new TextEncoder).encode($('#source-text').val().toString());
        result = parse(inputs,inputs.length-1);
        jsEditor = makeEditor();
    });
    $('#eval').click(function () {
        console.log("eval");
        cursor.reset();
        globalField = {};
        currentField = globalField;
        result.visit({inFlow:false});
        init();
    });
    $('#show').click(function() {
        result.show(0);
    });
    $('#start-plot').click(function () {
        console.log("start");
        $(this).removeClass("active");
        $($(this).attr("switch-link")).addClass("active");
        start();
    });
    $('#pause-plot').click(function (){
        console.log("pause");
        $(this).removeClass("active");
        $($(this).attr("switch-link")).addClass("active");
        pause();
    });
    $('#increment-frame').click(function () {
        console.log("increment-frame");
        incrementFrame();
    });
    $('#reset').click(function () {
        console.log("reset");
        init();
    });
    $('#sakura').click(function (){
        console.log("sakura");
        jsEditor.toTextArea();
        var input = $('#source-text').val().toString();
        input = "_" + svariableCount + " = <sakura>\n" + input;
        svariableCount++;
        $('#source-text').val(input);
        jsEditor = makeEditor();
    });
    $('#fish').click(function (){
        console.log("fish");
        jsEditor.toTextArea();
        var input = $('#source-text').val().toString();
        input = "_" + svariableCount + " = <fish>\n" + input;
        svariableCount++;
        $('#source-text').val(input);
        jsEditor = makeEditor();
    });
    $('#star').click(function (){
        console.log("star");
        jsEditor.toTextArea();
        var input = $('#source-text').val().toString();
        input = "_" + svariableCount + " = <star>\n" + input;
        svariableCount++;
        $('#source-text').val(input);
        jsEditor = makeEditor();
    });
    $('#arrow').click(function (){
        console.log("arrow");
        jsEditor.toTextArea();
        var input = $('#source-text').val().toString();
        input = "_" + svariableCount + " = <arrow>\n" + input;
        svariableCount++;
        $('#source-text').val(input);
        jsEditor = makeEditor();
    });
    $('#rocket').click(function (){
        console.log("rocket");
        jsEditor.toTextArea();
        var input = $('#source-text').val().toString();
        input = "_" + svariableCount + " = <rocket>\n" + input;
        svariableCount++;
        $('#source-text').val(input);
        jsEditor = makeEditor();
    });
});

function makeEditor(){
    return CodeMirror.fromTextArea(document.getElementById("source-text"), {
        mode: "javascript",
        lineNumbers: false,
        indentUnit: 4
    });
}

function POS(posx,posy,obj){
    obj.x = posx;
    obj.y = posy;
    obj.ix = obj.x;
    obj.iy = obj.y;
}

function RAND(){
    for(obj of arguments){
        POS(Math.random()*cvsw, Math.random()*cvsh, obj);
    }
}

function CENTER(){
    var ys = [];
    for(obj of arguments){
        if(ys.indexOf(obj.y) < 0){
            ys.push(obj.y);
        }
    }
    for(posy of ys){
        var sumw = 0;
        for(obj of arguments){
            if(posy == obj.y){
                sumw = sumw + obj.w;
            }
            
        }
        var posx = (cvsw - sumw) / 2;
        for(obj of arguments){
            if(posy == obj.y){
                POS(posx, posy, obj);
                posx = posx + obj.w;
            }
        }
    }
}
