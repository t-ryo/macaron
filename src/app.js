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

    // back(){
    //     if(this.x - objw >= 0){
    //         this.x = this.x - objw;
    //     }else{
    //         this.x = cvsw - cvsw%objw - objw;
    //         this.y = this.y - objh;
    //     }
    // }

    reset(){
        this.x = 0;
        this.y = 0;
    }
}

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

class Bubble {
    constructor(r, x, y, vx, vy, stroke) {
        this.r = r;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = 100;
        this.stroke = stroke;
    }
}

var canvas = document.getElementById("cvs");
var ctx = canvas.getContext("2d");
var overlayCanvas = document.getElementById("overlay");
var overlayCtx = overlayCanvas.getContext("2d");
var afterimageCanvas = document.getElementById("afterimage");
var afterimageCtx = afterimageCanvas.getContext("2d");
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

var globalField = {};
var currentField = globalField;
var Transitions = [];
var TransitionCount = 0;
var currentTransition = -1;
var svariableCount = 0;
var showFlipper = false;
var cursor = new Cursor();
var events = [];
var afterimage = false;
var colorGrad = false;
var color = ['#000000','#000000'];
var colorPos = [0,0,cvsw,cvsh];
var dinamicgrad = false;
var hue = 0;
var lightness = 40;
var spotlight = [];
var bubble = false;
var bubbles = [];
var bmax = 1000;
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

function evalSource(tree,info){
    var length = tree.getLength();
    for(var i = 0;i<length;i++){
        tree.getChild(i).visit(info);
    }
    return null;
}

function evalRule(tree,info){
    var before = currentField;
    currentField = {};
    var contextTree = tree.getLabeledChild("context");
    var inContext = contextTree != null ? contextTree.visit(info) : null;
    info.counter = 0;
    if(info.inFlow){
        if(tree.getLabeledChild("cond").tag === ttag.TimingPremise){
            if(!(tree.getLabeledChild("cond").getLabeledChild("timing").tag === ttag.Event)){
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
                tree.getLabeledChild("body").visit(info);
            }
        }
    }else{
        if(tree.getLabeledChild("cond").tag === ttag.TimingPremise){
            if(tree.getLabeledChild("cond").getLabeledChild("timing").tag === ttag.Event){
                var eventInfo = tree.getLabeledChild("cond").visit(info);
                var event = eventInfo["event"];
                var targets = eventInfo["target"];
                var conds = eventInfo["conds"];
                if(event == "Click"){
                    var clickFunc = function(evt){
                        var before = currentField;
                        currentField = {};
                        if(onDown(overlayCanvas, evt, targets, conds)){
                            info.isKey =false;
                            tree.getLabeledChild("body").visit(info);
                        }
                        currentField = before;
                    };
                    overlayCanvas.addEventListener("mousedown",clickFunc,false);
                    events.push(["mousedown",clickFunc]);
                }
            }
        }else{
            if(tree.getLabeledChild("cond").getChild(0).tag === ttag.Apply){
                info.isKey = true;
                var funcInfo = tree.getLabeledChild("cond").visit(info);
                if(funcInfo.name in globalField){
                    var mfunc = globalField[funcInfo.name];
                    if(mfunc.params.length == funcInfo.params.length){
                        for(var i = 0; i < mfunc.params.length; i++){
                            currentField[funcInfo.params[i]] = mfunc.params[i];
                        }
                        info.inFuncDecl = true;
                        var conds = funcInfo.conds;
                        for(var i=0; i<conds.length; i++){
                            if(ctree.prototype.isPrototypeOf(conds[i])){
                                conds[i] = conds[i].visit(info);
                            }
                        }
                        var body = "if(" + conds.join(' && ') + "){" + tree.getLabeledChild("body").visit(info) + "}"
                        info.inFuncDecl = false;
                        body = mfunc.body + body;
                        mfunc.body = body;
                        mfunc.func = "(function(" + mfunc.params.join(',') + "){" + body + "})";
                        globalField[funcInfo.name] = mfunc;
                    }else{
                        throw new Error('wrong number of arguments');
                        // return false;
                    }
                }else{
                    var conds = funcInfo.conds;
                    for(var i=0; i<conds.length; i++){
                        if(ctree.prototype.isPrototypeOf(conds[i])){
                            conds[i] = conds[i].visit(info);
                        }
                    }
                    var body = "if(" + conds.join(' && ') + "){" + tree.getLabeledChild("body").visit(info) + "}"
                    var func = "(function(" + funcInfo.params.join(',') + "){" + body + "})";
                    globalField[funcInfo.name] = new MFunc(func,funcInfo.params,body);
                }
            }
        }
    }
    currentField = before;
    return null;
}

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
    if(tree.getLabeledChild("timing").tag === ttag.Event){
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
    }else{
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
    var right = tree.getLabeledChild("right").visit(info);
    info.isKey = true;
    var left = tree.getLabeledChild("left").visit(info);
    if(MEmpty.prototype.isPrototypeOf(right)){
        try{
            currentField[left].img.src = "image/" + right.value + ".png";
            currentField[left].value = right.value;
        }catch(e){
            globalField[left].img.src = "image/" + right.value + ".png";
            globalField[left].value = right.value;
        }
        return null;
    }
    var val = null;
    try{
        val = eval("currentField." + tree.getLabeledChild("left").visit(info) + " = " + right);
    }catch(e){
        try{
            val = eval("globalField." + tree.getLabeledChild("left").visit(info) + " = " + right);
        }catch(e){
            val = eval(tree.getLabeledChild("left").visit(info) + " = " + right);
        }
    }
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
            if(MObject.prototype.isPrototypeOf(params[i])){
                paramStr = i == 0 ? paramStr + "params[" + i + "]" : paramStr + ",params[" + i + "]";
            }else{
                paramStr = i == 0 ? paramStr + params[i] : paramStr + "," + params[i];
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

function evalPictogram(tree,info){
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

function callFunc(funcName){
    if(funcName in currentField){
        return eval(currentField[funcName].func);
    }else if(funcName in globalField){
        return eval(globalField[funcName].func);
    }
    return eval(funcName);
}

overlayCanvas.addEventListener('mousemove', function (evt) {
    var mousePos = getMousePosition(overlayCanvas, evt);
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

function onDown(canvas, evt, targets, conds){
    var mousePos = getMousePosition(canvas, evt);
    var i = 0;
    var ondown = false;
    if(conds instanceof Array){
        for(var obj in globalField) {
            if(MImage.prototype.isPrototypeOf(globalField[obj])){
                if (globalField[obj].x < mousePos.x && (globalField[obj].x + globalField[obj].w) > mousePos.x && globalField[obj].y < mousePos.y && (globalField[obj].y + globalField[obj].h) > mousePos.y) {
                    currentField[targets[i]] = globalField[obj];
                    ondown = true;
                    i++;
                    for(var condTree of conds){
                        if(!(condTree.visit({inFlow:false,isKey:false}))){
                            delete currentField[targets[i]];
                            ondown = false;
                            i--;
                            break;
                        }
                    }
                }
            }
        }
    }else{
        for(var obj of targets) {
            if(obj in globalField){
                if(MImage.prototype.isPrototypeOf(globalField[obj])){
                    if (globalField[obj].x < mousePos.x && (globalField[obj].x + globalField[obj].w) > mousePos.x && globalField[obj].y < mousePos.y && (globalField[obj].y + globalField[obj].h) > mousePos.y) {
                        currentField = globalField;
                        ondown = true;
                        break;
                    }
                }
            }
        }
    }
    return ondown;
}
function plot() {

    plotBackGround();
    
    for(var target of spotlight){
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.3;
        var x = target.x;
        var y = target.y;
        if(MImage.prototype.isPrototypeOf(target)){
            x = x + target.w / 2;
            y = y + target.h / 2;
            // TODO aの反映
            // cos = Math.cos(target.a * rad);
            // sin = Math.sin(target.a * rad);
            // ctx.setTransform(cos, sin, -1 * sin, cos, x, y);
        }
        var grad  = ctx.createRadialGradient(x,y,20,x,y,70);
        grad.addColorStop(0,"hsl(0,0%,100%)");
        grad.addColorStop(1,"hsl(0,0%,0%)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cvsw, cvsh);
        // ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
    }

    if(bubble){
        emitBubbles();
        updatetBubbles();
    }

    if(afterimage){
        afterimageCtx.clearRect(0, 0, cvsw, cvsh);
        afterimageCtx.globalAlpha = 0.8;
        afterimageCtx.drawImage(overlayCanvas, 0, 0);
        overlayCtx.clearRect(0, 0, cvsw, cvsh);
        overlayCtx.drawImage(afterimageCanvas, 0, 0);
    }else{
        overlayCtx.clearRect(0, 0, cvsw, cvsh);
    }

    for(var obj in globalField) {
        if(MImage.prototype.isPrototypeOf(globalField[obj])){
            cos = Math.cos(globalField[obj].a * rad);
            sin = Math.sin(globalField[obj].a * rad);
            overlayCtx.setTransform(cos, sin, -1 * sin, cos, globalField[obj].x, globalField[obj].y);
            overlayCtx.drawImage(globalField[obj].img, 0, 0, globalField[obj].w, globalField[obj].h);
            overlayCtx.setTransform(1, 0, 0, 1, 0, 0);
        }
        if(MPictogram.prototype.isPrototypeOf(globalField[obj])){
            cos = Math.cos(globalField[obj].a * rad);
            sin = Math.sin(globalField[obj].a * rad);
            overlayCtx.setTransform(cos, sin, -1 * sin, cos, globalField[obj].x, globalField[obj].y);
            overlayCtx.drawImage(globalField[obj].img, 0, 0, globalField[obj].w, globalField[obj].h);
            overlayCtx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
}

function plotBackGround(){
    ctx.clearRect(0, 0, cvsw, cvsh);
    if(colorGrad){
        var grad = ctx.createLinearGradient(colorPos[0], colorPos[1], colorPos[2], colorPos[3]);
        if(dinamicgrad){
            var newColor = dinamicColor();
            color[0] = newColor[0];
            color[1] = newColor[1];
        }
        grad.addColorStop(0, color[0]);
        grad.addColorStop(1, color[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cvsw, cvsh);
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
    ctx.clearRect(0, 0, cvsw, cvsh);
    overlayCtx.clearRect(0, 0, cvsw, cvsh);
    afterimageCtx.clearRect(0, 0, cvsw, cvsh);
    plot();
    timeCounter = 0;
    $(function(){
        $("#time-counter").text(timeCounter);
    });
}

$(function () {
    var initCode = "s = <sakura>\nforeach a  a == <sakura>\n-------------------\n    $a.x = a.x + 10\nwhen Click(a)  a == <sakura>\n-------------------\n    $a = <fish>";
    $('#source-text').val(initCode);
    var jsEditor = makeEditor();
    var imageEditor = makeImageEditor();
    cvsw = $('#mapping-area').width();
    cvsh = $('#mapping-area').height();
    $('#cvs').attr('width', cvsw);
    $('#cvs').attr('height', cvsh);
    $('#overlay').attr('width', cvsw);
    $('#overlay').attr('height', cvsh);
    $('#afterimage').attr('width', cvsw);
    $('#afterimage').attr('height', cvsh);
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
            $('#overlay').attr('width', cvsw);
            $('#overlay').attr('height', cvsh);
            $('#afterimage').attr('width', cvsw);
            $('#afterimage').attr('height', cvsh);
        }, 200);
    });
    $('#parse').click(function () {
        console.log("parse");
        resetState();
        jsEditor.toTextArea();
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
    // $('#show').click(function() {
    //     result.show(0);
    // });
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
            if (!file.type.match(/text/)){
                alert("対応ファイル macaron|txt");
            }
            reader.readAsText(file);
        });
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
    // $('#sakura').click(function (){
    //     console.log("sakura");
    //     jsEditor.toTextArea();
    //     var input = $('#source-text').val().toString();
    //     input = "_" + svariableCount + " = <sakura>\n" + input;
    //     svariableCount++;
    //     $('#source-text').val(input);
    //     jsEditor = makeEditor();
    // });
    // $('#fish').click(function (){
    //     console.log("fish");
    //     jsEditor.toTextArea();
    //     var input = $('#source-text').val().toString();
    //     input = "_" + svariableCount + " = <fish>\n" + input;
    //     svariableCount++;
    //     $('#source-text').val(input);
    //     jsEditor = makeEditor();
    // });
    // $('#star').click(function (){
    //     console.log("star");
    //     jsEditor.toTextArea();
    //     var input = $('#source-text').val().toString();
    //     input = "_" + svariableCount + " = <star>\n" + input;
    //     svariableCount++;
    //     $('#source-text').val(input);
    //     jsEditor = makeEditor();
    // });
    // $('#arrow').click(function (){
    //     console.log("arrow");
    //     jsEditor.toTextArea();
    //     var input = $('#source-text').val().toString();
    //     input = "_" + svariableCount + " = <arrow>\n" + input;
    //     svariableCount++;
    //     $('#source-text').val(input);
    //     jsEditor = makeEditor();
    // });
    // $('#rocket').click(function (){
    //     console.log("rocket");
    //     jsEditor.toTextArea();
    //     var input = $('#source-text').val().toString();
    //     input = "_" + svariableCount + " = <rocket>\n" + input;
    //     svariableCount++;
    //     $('#source-text').val(input);
    //     jsEditor = makeEditor();
    // });
    $('#add').click(function (){
        console.log("add");
        jsEditor.toTextArea();
        imageEditor.toTextArea();
        var input = $('#source-text').val().toString();
        var inputImage = $('#image-text').val().toString().trim();
        inputImage = "<" + inputImage + ">";
        if (!(inputImage in images)){
            alert(inputImage + "は存在しません");
        }else{
            input = "_" + svariableCount + " = " + inputImage + "\n" + input;
            svariableCount++;
            $('#source-text').val(input);
        }
        jsEditor = makeEditor();
        imageEditor = makeImageEditor();
    });
    $('#clear').click(function (){
        console.log("clear");
        imageEditor.toTextArea();
        $('#image-text').val("");
        imageEditor = makeImageEditor();
    });
});

function makeEditor(){
    return CodeMirror.fromTextArea(document.getElementById("source-text"), {
        mode: "javascript",
        lineNumbers: false,
        indentUnit: 4
    });
}

let imageList = ['arrow', 'circle', 'fish', 'rocket', 'sakura', 'star', 'triangle']

let imageComplete = function(cm) {
  CodeMirror.showHint(cm, function() {
    let cur = cm.getCursor(); 
    let token = cm.getTokenAt(cur);
    var ch = cur.ch;
    let line = cur.line;
    let start = token.start;
    let end = ch;

    var inputReg = new RegExp('^' + token.string);
    let filteredList = imageList.filter((item) => {
        return item.slice(0, item.length - 1).match(inputReg) ? true : false
    });
    if (filteredList.length >= 1) {
        ch = 0;
        return {
            list: filteredList,
            from: CodeMirror.Pos(line, ch),
            to: CodeMirror.Pos(line, end)
        }
    }

  }, { completeSingle: false })
}

function makeImageEditor(){
    var imageEditor = CodeMirror.fromTextArea(document.getElementById("image-text"), {
        mode: "javascript", // FIXME
        lineNumbers: false,
        indentUnit: 4
        // ,extraKeys: {"Ctrl-Space": "autocomplete"}
    });
    imageEditor.setSize(250, 50);
    imageEditor.on('change', imageComplete);
    return imageEditor;
}

function resetState(){
    // afterimage = false;
    // colorGrad = false;
    // color = ['#000000','#000000'];
    colorPos = [0,0,cvsw,cvsh];
    // dinamicgrad = false;
    hue = 0;
    lightness = 40;
    // $('#cvs').css("background-color", "#000000");
    spotlight = [];
    // bubble = false;
    bmax = 1000;
    cursor.reset();
    for(event of events){
        overlayCanvas.removeEventListener(event[0], event[1]);
    }
    events = [];
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

function LOG(arg){
    console.log(arg);
}

function AFTERIMAGE(){
    afterimage = true;
}

function BACKCOLOR(color){
    $('#cvs').css("background-color", color);
}

function GRADCOLOR(startColor, endColor){
    color[0] = startColor;
    color[1] = endColor;
    colorGrad = true;
}

function GRADPOS(startx, starty, endx, endy){
    colorPos[0] = startx;
    colorPos[1] = starty;
    colorPos[2] = endx;
    colorPos[3] = endy;
    colorGrad = true;
}

function DINAMICGRAD(){
    colorGrad = true;
    dinamicgrad = true;
}

function dinamicColor(){
    hue = (hue + 1) % 360;
    return ["hsl(" + ((hue + 40) % 360) + ",80%," + (lightness + 10) + "%)", "hsl(" + hue + ",80%," + lightness + "%)"];
}

function LIGHTNESS(l){
    if(l < 0 || 100 < l){
        throw new error("lightness must be 0-100");
    }
    if(90 < l){
        lightness = l - 10;
    }else{
        lightness = l;
    }
}

function SPOTLIGHT(){
    for(target of arguments){
        spotlight.push(target);
    }
}

function BUBBLE(){
    if(arguments.length > 0){
        bmax = arguments[0];
    }
    bubble = true;
}

function emitBubbles() {
    if(bubbles.length < bmax){
        for (var i = 0; i < 2; i++) {
            var p = new Bubble(30 * Math.random(), cvsw * Math.random(), 100 * Math.random() + 650, 10 * (Math.random() - 0.5), 10 * (Math.random() - 0.5), Math.random() < 0.5 ? true : false);
            bubbles.push(p);
          }
    }
}

function updatetBubbles() {
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = "hsl(0,0%,50%)";
    ctx.fillStyle = "hsl(0,0%,50%)";
    for(var i = 0; i < bubbles.length; i++){
      var b = bubbles[i];
      b.vy -= 0.15;
      b.vx *= 0.98;
      b.vy *= 0.98;
      b.x += b.vx;
      b.y += b.vy;
      if(b.y < 0){
        b.life = 0;
      }
      b.life -= 1;
      if(b.life < 1){
        bubbles.splice(i, 1);
      }else{
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI*2, false);
        if(b.stroke){
            ctx.stroke();
        }else{
            ctx.fill();
        }
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  }

$('input[name="effect-afterimage"]').change(function() {
    console.log("afterimage");
    if($('[name=effect-afterimage]:checked').val()){
        AFTERIMAGE();
    }else{
        afterimage = false;
    }
})

$('[name="bg"]').change(function() {
    console.log("bg");
    var bg = $('[name=bg]').val();
    if(bg == "bg_anime"){
        $('[name="bg_color_1"]').prop("disabled", true);
        $('[name="bg_color_2"]').prop("disabled", true);
        $('.select-disabled').css('border', "2px solid gray");
        colorGrad = true;
        dinamicgrad = true;
        plotBackGround();
    }else if(bg == "bg_simple"){
        $('[name="bg_color_1"]').prop("disabled", false);
        $('[name="bg_color_2"]').prop("disabled", true);
        $('.bg-color-01').css('border', "2px solid #C299FF");
        $('.bg-color-02').css('border', "2px solid gray");
        BACKCOLOR($('[name="bg_color_1"]').val());
        colorGrad = false;
        dinamicgrad = false;
        plotBackGround();
    }else{
        $('[name="bg_color_1"]').prop("disabled", false);
        $('[name="bg_color_2"]').prop("disabled", false);
        $('.select-disabled').css('border', "2px solid #C299FF");
        color[0] = $('[name="bg_color_1"]').val();
        color[1] = $('[name="bg_color_2"]').val();
        colorGrad = true;
        dinamicgrad = false;
        plotBackGround();
    }
})

$('[name="bg_color_1"]').change(function() {
    if(colorGrad == false){
        BACKCOLOR($('[name="bg_color_1"]').val());
    }
    color[0] = $('[name="bg_color_1"]').val();
    plotBackGround();
})

$('[name="bg_color_2"]').change(function() {
    color[1] = $('[name="bg_color_2"]').val();
    plotBackGround();
})

$('input[name="effect-particle"]').change(function() {
    console.log("particle");
    if($('[name=effect-particle]:checked').val()){
        $('[name="particle"]').prop("disabled", false);
        $('.particle-01').css('border', "2px solid #C299FF");
        bubble = true;
    }else{
        $('[name="particle"]').prop("disabled", true);
        $('.particle-01').css('border', "2px solid gray");
        bubble = false;
    }
})

// $('[name="particle"]').change(function() {
//     var particle = $('[name="particle"]').val();
//     if(particle == "bubble"){
//         bubble = true;
//     }else{

//     }
// })