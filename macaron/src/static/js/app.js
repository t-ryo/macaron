// const ttag = {
//     Source: "Source",
//     Rule: "Rule",
//     Context: "Context",
//     TimingPremise: "TimingPremise",
//     Premise: "Premise",
//     PeriodicSome: "PeriodicSome",
//     Periodic: "Periodic",
//     Event: "Event",
//     Body: "Body",
//     Let: "Let",
//     Assign: "Assign",
//     Return: "Return",
//     Name: "Name",
//     Infix: "Infix",
//     Cast: "Cast",
//     Unary: "Unary",
//     Norm: "Norm",
//     Method: "Method",
//     Get: "Get",
//     Apply: "Apply",
//     Index: "Index",
//     CastExpr: "CastExpr",
//     Tuple: "Tuple",
//     Empty: "Empty",
//     List: "List",
//     RangeUntilExpr: "RangeUntilExpr",
//     RangeExpr: "RangeExpr",
//     Dict: "Dict",
//     Data: "Data",
//     Template: "Template",
//     String: "String",
//     Char: "Char",
//     Image: "Image",
//     Rational: "Rational",
//     Unit: "Unit",
//     Int: "Int",
//     Double: "Double",
//     True: "True",
//     False: "False",
//     Null: "Null",
//     Pictogram: "Pictogram"
// };

/* 廃止するかは未定 新しい仕様次第 */
/* macaron言語の関数はパターンマッチで記述される。
   その際同じ名前の関数が複数記述される。
   2回目以降はすでに定義されている関数を更新する必要がある。
   よって、更新に必要な情報を保持しておく */
// class MFunc{
//     constructor(func, params, body) {
//         this.func = func; /* 関数全体 eval()で評価するためString */
//         this.params = params; /* 関数の引数 */
//         this.body = body; /* 関数の中身 funcを更新する際に使用 */
//     }
// }

const cvswOrg = 1440; /* MacBookAirのSafariのwindowサイズ */
const cvshOrg = 837;  /* MacBookAirのSafariのwindowサイズ */
var cvswBase = 1440;  /* 現在のcanvas幅 */
var cvshBase = 837;   /* 現在のcanvas高さ */
var cvsw = 1440;      /* リサイズ後のcanvas幅 */
var cvsh = 837;       /* リサイズ後のcanvas高さ */
var result;           /* macaronコードのパース結果の木 */

// 旧Macaron
// var globalField = {}; 
// var currentField = globalField; /* スコープ管理のため */
// var timeCounter = 0; /* macaronシミュレータの実行時間 */


/* ctree走査用メソッド */

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

// FIXME 新しい仕様次第
// function evalRule(tree,info){
//     var before = currentField;
//     currentField = {};
//     var contextTree = tree.getLabeledChild("context");
//     var inContext = contextTree != null ? contextTree.visit(info) : null;
//     info.counter = 0;
//     if(info.inFlow){
//         if(tree.getLabeledChild("cond").tag === ttag.TimingPremise){/* foreach or event */
//             if(!(tree.getLabeledChild("cond").getLabeledChild("timing").tag === ttag.Event)){
//                 /* eventは前処理のみ */
//                 /* foreachの処理 */
//                 while(true){
//                     var bool = tree.getLabeledChild("cond").visit(info);
//                     if(bool){
//                         info.isKey = false;
//                         tree.getLabeledChild("body").visit(info);
//                     }else{
//                         break;
//                     }
//                 }
//             }
//         }else{
//             if(tree.getLabeledChild("cond").getChild(0).tag === ttag.Name){
//                 info.isKey = false;
//                 tree.getLabeledChild("body").visit(info);/* Premiseへ */
//             }
//         }
//     }else{
//         if(tree.getLabeledChild("cond").tag === ttag.TimingPremise){
//             if(tree.getLabeledChild("cond").getLabeledChild("timing").tag === ttag.Event){/* event処理 */
//                 var eventInfo = tree.getLabeledChild("cond").visit(info);
//                 var event = eventInfo["event"];
//                 var targets = eventInfo["target"];
//                 var conds = eventInfo["conds"];
//                 // if(event == "Click"){
//                 //     var clickFunc = function(evt){
//                 //         var before = currentField;
//                 //         currentField = {};
//                 //         if(onDown/* 廃止済み */(overlayCanvas/* 廃止済み */, evt, targets, conds)){
//                 //             info.isKey =false;
//                 //             tree.getLabeledChild("body").visit(info);
//                 //         }
//                 //         currentField = before;
//                 //     };
//                 //     overlayCanvas.addEventListener("mousedown",clickFunc,false);
//                 //     events.push(["mousedown",clickFunc]);
//                 // }
//             }
//         }else{
//             if(tree.getLabeledChild("cond").getChild(0).tag === ttag.Apply){/* 関数定義 */
//                 info.isKey = true;
//                 var funcInfo = tree.getLabeledChild("cond").visit(info);
//                 /* 関数はパターンマッチで記述されるので、同じ名前の関数が来た際に前の関数を更新する必要がある */
//                 if(funcInfo.name in globalField){/* すでに同じ名前の関数が存在する場合 */
//                     var mfunc = globalField[funcInfo.name];
//                     if(mfunc.params.length == funcInfo.params.length){/* 関数の引数の数が同じか確認 */
//                         /* 新しい関数の引数名をすでにある関数の引数名と一致させるために、(新変数名)=(旧変数名)として環境に登録 */
//                         for(var i = 0; i < mfunc.params.length; i++){
//                             currentField[funcInfo.params[i]] = mfunc.params[i];
//                         }
//                         info.inFuncDecl = true;
//                         var conds = funcInfo.conds;
//                         /* 新しい関数のパターンマッチの条件を取得 */
//                         for(var i=0; i<conds.length; i++){
//                             if(ctree.prototype.isPrototypeOf(conds[i])){
//                                 conds[i] = conds[i].visit(info);
//                             }
//                         }
//                         var body = "if(" + conds.join(' && ') + "){" + tree.getLabeledChild("body").visit(info) + "}"
//                         info.inFuncDecl = false;
//                         /* 関数の中身を更新 */
//                         body = mfunc.body + body;
//                         mfunc.body = body;
//                         mfunc.func = "(function(" + mfunc.params.join(',') + "){" + body + "})";
//                         globalField[funcInfo.name] = mfunc;
//                     }else{/* 関数の引数の数が違う場合はエラー */
//                         throw new Error('wrong number of arguments');
//                         // return false;
//                     }
//                 }else{/* 同じ名前の関数が存在しない場合 */
//                     var conds = funcInfo.conds;
//                     /* パターンマッチの条件を取得 */
//                     for(var i=0; i<conds.length; i++){
//                         if(ctree.prototype.isPrototypeOf(conds[i])){
//                             conds[i] = conds[i].visit(info);
//                         }
//                     }
//                     /* 更新用に関数の中身を保持しておく */
//                     var body = "if(" + conds.join(' && ') + "){" + tree.getLabeledChild("body").visit(info) + "}"
//                     /* eval用に関数を完成 */
//                     var func = "(function(" + funcInfo.params.join(',') + "){" + body + "})";
//                     globalField[funcInfo.name] = new MFunc(func,funcInfo.params,body);
//                 }
//             }
//         }
//     }
//     currentField = before;
//     return null;
// }

// /* 未実装 */
// function evalContext(tree,info){
//     var length = tree.getLength();
//     var inContext = true;
//     for(var i = 0;i<length;i++){
//         inContext = inContext && tree.getChild(i).visit(info); // TODO 子ノードのeval結果はbool?
//     }
//     return inContext;
// }

// function evalTimingPremise(tree,info){
//     var length = tree.getLength();
//     if(tree.getLabeledChild("timing").tag === ttag.Event){/* eventの処理 */
//         var target = tree.getChild(0).visit(info);
//         var targets = target["target"];
//         if(length > 1){
//             var conds = [];
//             for(var i = 1; i < length; i++){
//                 conds.push(tree.getChild(i))
//             }
//         }else{
//             var conds = true;
//         }
//         target["conds"] = conds;
//         return target;
//     }else{/* foreachの処理 */
//         var targets = tree.getChild(0).visit(info);
//         while(targetsSetter(targets,info.counter,[],{index:0})){
//             var isContinue = false;
//             for(var i = 1;i<length;i++){
//                 if(!(tree.getChild(i).visit(info))){
//                     isContinue = true;
//                     break;
//                 }
//             }
//             info.counter++;
//             if(isContinue){
//                 continue;
//             }else{
//                 return true;
//             }
//         }
//     }
//     return false;
// }

// function evalPremise(tree,info){
//     var funcInfo = {};
//     var length = tree.getLength();
//     var funcTree = tree.getChild(0);
//     funcInfo.name = funcTree.getLabeledChild("recv").visit(info);
//     var funcParams = funcTree.getLabeledChild("param").visit(info);
//     var conds = [];
//     if(length == 1){
//         if(funcParams.length == 0){
//             params = funcParams;
//             conds = ["true"];
//         }else{
//             var paramLen = funcParams.length;
//             var params = [];
//             for(var i = 0;i<paramLen;i++){
//                 if(typeof funcParams[0] == "number" || funcParams[0].match("\"") != null){
//                     params.push("p" + i); 
//                     conds.push("p" + i + " == " + funcParams[i]); 
//                 }else{
//                     params.push(funcParams[i]);
//                     conds.push("true");
//                 }
//             }
//         }
//         funcInfo.params = params;
//         funcInfo.conds = conds;
//     }else{
//         funcInfo.params = funcParams;
//         for(var i = 1;i<length;i++){
//             conds.push(tree.getChild(i));
//         }
//         funcInfo.conds = conds;
//     }
//     return funcInfo;
// }

// function evalPeriodicSome(tree,info){ // FIXME
//     var targets = [];
//     targets.push(tree.getChild(0).visit({inFlow:true,isKey:true}));
//     targets.push(tree.getChild(1).visit({inFlow:true,isKey:true}));
//     return targets;
// }

// function evalPeriodic(tree,info){
//     var length = tree.getLength();
//     var targets = []
//     for(var i = 0;i<length;i++){
//         targets.push(tree.getChild(i).visit({inFlow:true,isKey:true}));
//     }
//     return targets;
// }

// function evalEvent(tree,info){
//     try{
//         var event = {"event":tree.getChild(0).getLabeledChild("recv").visit({inFlow:false,isKey:true})};
//         var target = tree.getChild(0).getLabeledChild("param").visit({inFlow:false,isKey:true});
//         if(!(target instanceof Array)){
//             target = [target];
//         }
//         event["target"] = target;
//     }catch(e){
//         console.error("EventError:", e.message);
//     }
//     return event;
// }

// function evalBody(tree,info){
//     var length = tree.getLength();
//     if(info.isKey){
//         var body = "";
//         for(var i = 0;i<length;i++){
//             body = body + tree.getChild(i).visit(info);
//         }
//         return body;
//     }

//     for(var i = 0;i<length;i++){
//         tree.getChild(i).visit(info);
//     }
//     return null;
// }

// function evalAssign(tree,info){
//     if(info.isKey){
//         return tree.getLabeledChild("left").visit(info) + "=" + tree.getLabeledChild("right").visit(info) + ";";
//     }

//     var right = tree.getLabeledChild("right").visit(info);
//     info.isKey = true;
//     var left = tree.getLabeledChild("left").visit(info);
//     var leftName = left;
//     if(leftName.indexOf(".") > 0){
//         leftName = leftName.slice(0, leftName.indexOf("."));
//     }
//     if(leftName.indexOf("[") > 0){
//         leftName = leftName.slice(0, leftName.indexOf("["));
//     }
    
//     if(MEmpty.prototype.isPrototypeOf(right)){
//         try{
//             currentField[leftName].img.src = "image/" + right.value + ".png";
//             currentField[leftName].value = right.value;
//         }catch(e){
//             globalField[leftName].img.src = "image/" + right.value + ".png";
//             globalField[leftName].value = right.value;
//         }
//         return null;
//     }
//     var val = null;
    
//     if(leftName in currentField){
//         val = eval("currentField." + left + " = " + right);
//     }else if(leftName in globalField){
//         val = eval("globalField." + left + " = " + right);
//     }else{
//         val = eval(left + " = " + right);
//     }
//     // try{
//     //     val = eval("currentField." + tree.getLabeledChild("left").visit(info) + " = " + right);
//     // }catch(e){
//     //     try{
//     //         val = eval("globalField." + tree.getLabeledChild("left").visit(info) + " = " + right);
//     //     }catch(e){
//     //         val = eval(tree.getLabeledChild("left").visit(info) + " = " + right);
//     //     }
//     // }
//     info.isKey = false;
//     return null;
// }

// function evalReturn(tree,info){
//     if(info.isKey){
//         var returnExp = "return ";
//         returnExp = returnExp + tree.getLabeledChild("expr").visit(info) + ";";
//         return returnExp;
//     }
//     return tree.getLabeledChild("expr").visit(info);
// }

// function evalLet(tree,info){
//     if(info.isKey){
//         return tree.getLabeledChild("left").visit(info) + "=" + tree.getLabeledChild("right").visit(info) + ";";
//     }
//     // FIXME?
//     if(!(info.inFlow)){
//         currentField[tree.getLabeledChild("left").visit({inFlow:false,isKey:true})] = tree.getLabeledChild("right").visit({inFlow:false,createNew:true});
//     }
//     return null;
// }

// function evalPosition(tree,info){
//     if(!(info.inFlow)){
//         tree.getChild(0).visit({inFlow:false});
//     }
//     return null;
// }

// function evalName(tree,info){
//     var val = tree.getValue();
//     if(info.inFuncDecl){
//         if(val in currentField){
//             return currentField[val];
//         }
//     }
//     if(info.isKey){
//         return val;
//     }
//     if(val in currentField){
//         return currentField[val];
//     }
//     if(val in globalField){
//         return globalField[val];
//     }
//     throw new Error("Can't find variable: " + val); // FIXME
//     // return val;
// }

// function evalInfix(tree,info){
//     if(info.isKey){
//         return tree.getLabeledChild("left").visit(info) + tree.getLabeledChild("op").visit(info) + tree.getLabeledChild("right").visit(info);
//     }
//     var left = tree.getLabeledChild("left").visit(info);
//     var right = tree.getLabeledChild("right").visit(info);
//     if(MObject.prototype.isPrototypeOf(left)){
//         left = left.value;
//     }
//     if(MObject.prototype.isPrototypeOf(right)){
//         right = right.value;
//     }
//     return eval("left" + tree.getLabeledChild("op").visit({isKey:true}) + "right");
// }

// function evalCast(tree,info){
//     if(info.isKey){
//         return "(" + tree.getLabeledChild("type").visit(info) + ")" + tree.getLabeledChild("recv").visit(info);
//     }
//     return eval("(" + tree.getLabeledChild("type").visit(info) + ")" + tree.getLabeledChild("recv").visit(info));
// }

// function evalUnary(tree,info){
//     if(info.isKey){
//         return tree.getLabeledChild("op").visit(info) + tree.getLabeledChild("expr").visit(info);
//     }
//     return eval(tree.getLabeledChild("op").visit(info) + tree.getLabeledChild("expr").visit(info));
// }

// function evalNorm(tree,info){
//     if(info.isKey){
//         return "|" + tree.getLabeledChild("expr").visit(info) + "|";
//     }
//     return eval("|" + tree.getLabeledChild("expr").visit(info) + "|");
// }

// function evalMethod(tree,info){
//     if(info.isKey){
//         return tree.getLabeledChild("recv").visit(info) + "." + tree.getLabeledChild("name").visit(info) + "(" + tree.getLabeledChild("param").visit(info) + ")";
//     }
//     info.isKey = true;
//     var val = null;

//     var recv = tree.getLabeledChild("recv").visit(info);
//     var name = tree.getLabeledChild("name").visit(info);
//     var params = tree.getLabeledChild("param").visit(info);
//     var paramStr = "";

//     if(Array.isArray(params)){
//         var length = params.length;
//         for(var i = 0;i<length;i++){
//             if(params[i] in currentField){
//                 params[i] = currentField[params[i]];
//             }
//             if(params[i] in globalField){
//                 params[i] = globalField[params[i]];
//             }
//             paramStr = i == 0 ? paramStr + "params[" + i + "]" : paramStr + ",params[" + i + "]";
//         }
//     }else{
//         if(params in currentField){
//             params = currentField[params];
//         }
//         if(params in globalField){
//             params = globalField[params];
//         }
//         paramStr = "params"
//     }

//     try{
//         val = eval("currentField." + recv + "." + name + "(" + paramStr + ")");
//     }catch(e){
//         try{
//             val = eval("globalField." + recv + "." + name + "(" + paramStr + ")");
//         }catch(e){
//             val = eval(recv + "." + name + "(" + paramStr + ")");
//         }
//     }
//     info.isKey = false;
//     return val;
// }

// function evalGet(tree,info){
//     if(info.isKey){
//         return tree.getLabeledChild("recv").visit(info) + "." + tree.getLabeledChild("name").visit(info);
//     }
//     info.isKey = true;
//     var val = null;
//     try{
//         val = eval("currentField." + tree.getLabeledChild("recv").visit(info) + "." + tree.getLabeledChild("name").visit(info));
//     }catch(e){
//         try{
//             val = eval("globalField." + tree.getLabeledChild("recv").visit(info) + "." + tree.getLabeledChild("name").visit(info));
//         }catch(e){
//             val = eval(tree.getLabeledChild("recv").visit(info) + "." + tree.getLabeledChild("name").visit(info));
//         }
//     }
//     info.isKey = false;
//     return val;
// }

// function evalApply(tree,info){
//     if(info.isKey){
//         return "callFunc(\"" + tree.getLabeledChild("recv").visit(info) + "\")(" + tree.getLabeledChild("param").visit(info) + ")";
        
//     }

//     info.isKey = true;
//     var val = null;
//     var recv = tree.getLabeledChild("recv").visit(info);
//     var params = tree.getLabeledChild("param").visit(info);
//     var paramStr = "";
//     if(Array.isArray(params)){
//         var length = params.length;
//         for(var i = 0;i<length;i++){
//             if(params[i] in currentField){
//                 params[i] = currentField[params[i]];
//             }
//             if(params[i] in globalField){
//                 params[i] = globalField[params[i]];
//             }
//             if(MObject.prototype.isPrototypeOf(params[i]) || params[i].type == "body"){
//                 // MObject以外のオブジェクトもこちら
//                 // .type のため、undefinedは今とれない
//                 paramStr = i == 0 ? paramStr + "params[" + i + "]" : paramStr + ",params[" + i + "]";
//             }else{
//                 if(Array.isArray(params[i])){
//                     paramStr = i == 0 ? paramStr + "[" + params[i] + "]" : paramStr + "," + "[" + params[i] + "]";
//                 }else{
//                     paramStr = i == 0 ? paramStr + params[i] : paramStr + "," + params[i];
//                 }
//             }
//         }
//     }else{
//         if(params in currentField){
//             params = currentField[params];
//         }
//         if(params in globalField){
//             params = globalField[params];
//         }
//         paramStr = "params"
//     }

//     try{
//         var mfunc = eval("currentField." + recv)
//         val = eval(mfunc.func + "(" + paramStr + ")");
//     }catch(e){
//         try{
//             var mfunc = eval("globalField." + recv)
//             val = eval(mfunc.func + "(" + paramStr + ")");
//         }catch(e){
//             val = eval(recv + "(" + paramStr + ")");
//         }
//     }
//     info.isKey = false;
//     return val;
// }

// function evalIndex(tree,info){
//     if(info.isKey){
//         return tree.getLabeledChild("recv").visit(info) + "[" + tree.getLabeledChild("param").visit(info) + "]";
//     }
//     info.isKey = true;
//     var val = null;
//     try{
//         val = eval("currentField." + tree.getLabeledChild("recv").visit(info) + "[" + tree.getLabeledChild("param").visit(info) + "]");
//     }catch(e){
//         try{
//             val = eval("globalField." + tree.getLabeledChild("recv").visit(info) + "[" + tree.getLabeledChild("param").visit(info) + "]");
//         }catch(e){
//             val = eval(tree.getLabeledChild("recv").visit(info) + "[" + tree.getLabeledChild("param").visit(info) + "]");
//         }
//     }
//     info.isKey = false;
//     return val;
// }

// function evalArguments(tree,info){
//     var length = tree.getLength();
//     var list = [];
//     for(var i = 0;i<length;i++){
//         list.push(tree.getChild(i).visit(info));
//     }
//     return list;
// }

// function evalCastExpr(tree,info){
//     if(info.isKey){
//         return tree.getLabeledChild("recv").visit(info) + "=>" + tree.getLabeledChild("type").visit(info);
//     }
//     info.isKey = true;
//     var val = null;
//     try{
//         val = eval("currentField." + tree.getLabeledChild("recv").visit(info) + "=>" + tree.getLabeledChild("type").visit(info));
//     }catch(e){
//         try{
//             val = eval("globalField." + tree.getLabeledChild("recv").visit(info) + "=>" + tree.getLabeledChild("type").visit(info));
//         }catch(e){
//             val = eval(tree.getLabeledChild("recv").visit(info) + "=>" + tree.getLabeledChild("type").visit(info));
//         }
//     }
//     info.isKey = false;
//     return val;
// }

// function evalTuple(tree,info){
//     var length = tree.getLength();
//     var tuple = [];
//     for(var i = 0;i<length;i++){
//         tuple.push(tree.getChild(i).visit(info));
//     }
//     return tuple;
// }

// function evalEmpty(tree,info){
//     return null;
// }

// function evalList(tree,info){
//     var length = tree.getLength();
//     var list = [];
//     for(var i = 0;i<length;i++){
//         list.push(tree.getChild(i).visit(info));
//     }
//     return list;
// }

// function evalRangeUntilExpr(tree,info){
//     var list = [];
//     var start = tree.getLabeledChild("left").visit(info);
//     var end = tree.getLabeledChild("right").visit(info);
//     if(typeof start == "number" && typeof end == "number"){
//         for(var i = start; i < end; i++){
//             list.push(i);
//         }
//     }else if(typeof start == "string" && typeof end == "string"){
//         var startByte = start.charCodeAt(0);
//         var endByte = end.charCodeAt(0);
//         for(var i = startByte; i < endByte; i++) {
//             list.push(String.fromCodePoint(i));
//         }
//     }
//     return list;
// }

// function evalRangeExpr(tree,info){
//     var list = [];
//     var start = tree.getLabeledChild("left").visit(info);
//     var end = tree.getLabeledChild("right").visit(info);
//     if(typeof start == "number" && typeof end == "number"){
//         for(var i = start; i <= end; i++){
//             list.push(i);
//         }
//     }else if(typeof start == "string" && typeof end == "string"){
//         var startByte = start.charCodeAt(0);
//         var endByte = end.charCodeAt(0);
//         for(var i = startByte; i <= endByte; i++) {
//             list.push(String.fromCodePoint(i));
//         }
//     }
//     return list;
// }

// function evalDict(tree,info){
//     var length = tree.getLength();
//     var dict = {};
//     for(var i = 0;i<length;i++){
//         var target = tree.getChild(i);
//         dict[target.getLabeledChild("name").visit(info)] = target.getLabeledChild("value").visit(info);
//     }
//     return dict;
// }

// function evalData(tree,info){
//     return null; // TODO
// }

// function evalTemplate(tree,info){
//     var length = tree.getLength();
//     var template = "\`";
//     for(var i = 0;i<length;i++){
//         template = template + tree.getChild(i).getValue(); // TODO 確認
//     }
//     template = template +  "\`";
//     return template;
// }

function evalString(tree,info){
    // FIXME
    return tree.getValue();
    // return "\"" + tree.getValue() + "\"";
}

// function evalChar(tree,info){
//     return "\'" + tree.getValue() + "\'";
// }

// /* 廃止予定 */
// function evalImage(tree,info){
//     if(info.createNew){
//         return createImage(tree.getValue());
//     }
//     return new MEmpty(tree.getValue());
// }

// function evalRational(tree,info){
//     return eval(tree.getValue());
// }

// function evalUnit(tree,info){
//     return null; // TODO
// }

// function evalInt(tree,info){
//     return parseInt(tree.getValue());
// }

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

// /* 廃止予定 */
// function evalPictogram(tree,info){
//     if(info.createNew){
//         return new MCircle("circle");
//     }
//     return new MEmpty("circle");
// }

// /* foreachの対象を見つける 廃止するかは仕様次第 */
// function targetsSetter(targets,index,setted,counter){
//     for(obj in globalField){
//         if(setted.indexOf(obj) === -1){
//             currentField[targets[0]] = globalField[obj];
//             setted.push(obj);
//             if(targets.length !== 1){
//                 if(targetsSetter(targets.slice(1),index,setted.slice(0),counter)){
//                     return true;
//                 }else{
//                     continue;
//                 }
//             }else if(counter.index == index){
//                 return true;
//             }else{
//                 counter.index++;
//             }
//         }
//     }
//     return false;
// }

// /* Mfuncをeval()で評価するための関数 */
// function callFunc(funcName){
//     if(funcName in currentField){
//         return eval(currentField[funcName].func);
//     }else if(funcName in globalField){
//         return eval(globalField[funcName].func);
//     }
//     return eval(funcName);
// }

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
    "density",
    "friction",
    "frictionAir",
    "restitution",
    "angle"
]

var objectParamMap = {};
var objectMap = {};
var textMap = {};

var matterCanvas = document.getElementById('matter-canvas');
var textCanvas = document.getElementById('text-canvas');
var textContext = textCanvas.getContext('2d');

var indexRegExp = new RegExp('\[[0-9]*\]', 'g');

// FIXME
var fontSize = 40;
var rockSize = 20;

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
                }else if(key == "gyro"){
                    if(value){
                        window.addEventListener('deviceorientation', updateGravity);
                    }
                    // else{
                    // TODO removeイベント
                    // }
                }
                // else if(){
                // TODO その他
                // }
            }
        }else{
            var objectName = null;
            var newObject;

            if(objectType in objectParamMap){
                /* パラメータ引き継ぎ(値渡し) */
                newObject = JSON.parse(JSON.stringify(objectParamMap[objectType]));
            }else{
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
                    /* text */
                    color: "white",
                    font:'ＭＳ ゴシック',
                    value: null,
                    /* constraint */
                    targetObject: null,
                    options: {
                        isStatic: false,   /* 静的オブジェクトかどうか */
                        density: 0.001,    /* 密度 */
                        friction: 0.1,     /* 摩擦係数 */
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
                    }
                };
            }

            for(var j = 0; j < memberNum; j++){
                var key = member.getChild(j).getLabeledChild("key").getValue();
                var value = member.getChild(j).getLabeledChild("value").visit();
                
                // FIXME こっちで条件分岐した方がいいか？
                if(key == "name"){
                    objectName = value;
                }else if(key == "image"){
                    // FIXME 拡張子
                    // httpでもとれるように
                    newObject.options.render.sprite.texture = './static/image/' + value;
                }else if(optionName.indexOf(key) > -1){
                    newObject.options[key] = value;
                }else{
                    newObject[key] = value;
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
                objectMap[objectName] = Composites.stack(newObject.x, newObject.y, newObject.columns, newObject.rows, 0, 0, getCallBack(newObject.elementType));
            }else if(newObject.type == "pyramid" /* 山なりに積む */){
                // Gapをパラメータで設定したい？
                // objectMap[objectName] = Composites.pyramid(newObject.x, newObject.y, newObject.columns, newObject.rows, newObject.columnGap, newObject.rowGap, getCallBack(newObject.elementType));
                objectMap[objectName] = Composites.pyramid(newObject.x, newObject.y, newObject.columns, newObject.rows, 0, 0, getCallBack(newObject.elementType));
            }else if(newObject.type == "chain" /* 鎖 */){
                var group = Body.nextGroup(true); /* chain内のオブジェクト同士は衝突しないようにcollisionFilterでグループ化する */
                var chain = Composites.stack(newObject.x, newObject.y, newObject.length, 1, 0, 0, getGroupedCallBack(newObject.elementType, group));
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
            }else if(newObject.type == "slingshot" /* カタパルト */){
                var rock = Bodies.polygon(newObject.x, newObject.y, 8, rockSize, { 
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

        }
    }

    engine = Engine.create();

    /* 重力 */
    engine.world.gravity.y = gravityVal;

    /* time counter を更新イベントに設定 */
    // Matter.Events.on(engine, 'afterUpdate', function() {
    //     $("#time-counter").text(++timeCounter);
    // });

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
    resizeWorldObjects(cvswBase/cvswOrg, cvshBase/cvshOrg);

    // Render.lookAt(render, {
    //     min: { x: 0, y: 0 },
    //     max: { x: cvsw, y: cvsh }
    // });

    /* マウスドラッグ */
    if(enableMouse){
        mouseConstraint = mouseDrag(render, engine, mouseConstraint);
    }

    /* slingshot */
    if(enableSlingshot){
        switchSlingshot(engine, elastic, slingshotName, mouseConstraint);
    }

    /* スタイルシートを読み込んだ段階で
       オブジェクトを描画するために
       runの後、engineを非アクティブにする。 */
    
    Runner.run(runner, engine);
    Render.run(render);

    runner.enabled = false;

    /* メモ */
    /* timeScaleはengine自体は止まらないのでupdateは止まらない */
    // engine.timing.timeScale = 0;
    /* sleepingは更新をしなくなる。
       (描画精度は落ちるが、安定性とパフォーマンス向上)
       アクティブなオブジェクトに接触すると再び起きる。 */
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

function getCallBack(type){
    if(type == "circle"){
        return function(x, y) {
            return Bodies.circle(x, y, 20);
        };
    }else if(type == "rectangle"){
        return function(x, y) {
            return Bodies.rectangle(x, y, 25, 40);
        };
    }
}

function getGroupedCallBack(type, group){
    if(type == "circle"){
        return function(x, y) {
            return Bodies.circle(x - 20, y, 20, { 
                collisionFilter: { group: group }
                // TODO option
                // density: 0.005,
                // frictionAir: 0.05,
                // render: {
                //     fillStyle: '#575375'
                // }
            });
        };
    }else if(type == "rectangle"){
        return function(x, y) {
            return Bodies.rectangle(x - 20, y, 53, 20, { 
                collisionFilter: { group: group }
                // TODO option
            });
        };
    }else if(type == "ellipse"){
        return function(x, y) {
            return Bodies.rectangle(x - 20, y, 53, 20, { 
                collisionFilter: { group: group },
                // TODO option
                chamfer: 5 /* 角取り */
            });
        };
    }
}

function mouseDrag(render, engine, mouseConstraint){
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
            objectMap['_rock'] = Bodies.polygon(objectMap[slingshotName].pointA.x, objectMap[slingshotName].pointA.y, 7, rockSize, { 
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

    fontSize = fontSize * cvsw/cvswBase;

    for(var textParam of Object.values(textMap)){
        textContext.fillStyle = textParam.color;
        textContext.font = fontSize + "px " + textParam.font;
        textParam.x = textParam.x * cvsw/cvswBase;
        textParam.y = textParam.y * cvsh/cvshBase;
        textContext.fillText(textParam.value, textParam.x, textParam.y);
    }
}

// TODO
function collision(targetA, targetB, action){
    // ラベル判定だと、同じ種類のオブジェクトを区別できない
    // idで頑張る？ stackは id[0] < pair < id[0] + length ?
    Matter.Events.on(engine, 'collisionEnd', function(event) {
        pairs = event.pairs;
        for (i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            if (pair.bodyA.label === targetA.label && pair.bodyB.label === targetB.label) {
                // TODO action 記述した中身をここで仕込む
                // eval(action)

                // World.remove(engine.world, pair.bodyA);
                // World.remove(engine.world, pair.bodyB);
            }
        }
    });
}

// TODO 画面外に出たオブジェクトを削除する
// World.remove(engine.world, object);

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

$(window).on('load', function(){
    cvswBase = $( window ).width();
    cvshBase = $( window ).height();
    resizeWindow();
});

/* リサイズイベント */
$(window).on('resize', function(){
    resizeWindow();
});

function resizeWindow(){
    /* 現在のwindowサイズ */
    cvsw = $( window ).width();
    cvsh = $( window ).height();

    resizeEditorSize();
    /* canvasサイズ更新 */
    $('#matter-canvas').get(0).width = cvsw;
    $('#matter-canvas').get(0).height = cvsh;
    $('#text-canvas').get(0).width = cvsw;
    $('#text-canvas').get(0).height = cvsh;
    /* objectサイズ更新 */
    writeAllText();
    resizeWorldObjects(cvsw/cvswBase, cvsh/cvshBase);
    /* 定数？ */
    rockSize = rockSize * cvsw/cvswBase;
    /* 変更前のwindowサイズを更新 */
    cvswBase = cvsw;
    cvshBase = cvsh;
}

function resizeWorldObjects(ratew, rateh){
    if(engine){
        /* body */
        resizeBodies(engine.world.bodies, ratew, rateh);
        /* composite */
        for(var compositesObj of engine.world.composites){
            childs = Composite.allBodies(compositesObj);
            resizeBodies(childs, ratew, rateh);
        }
        /* constraint */
        for(var constraint of engine.world.constraints){
            constraint.pointA = {
                x:constraint.pointA.x * ratew,
                y:constraint.pointA.y * rateh
            };
        }
    }
}

function resizeBodies(objs, ratew, rateh){
    for(var obj of objs){
        Body.scale(obj, ratew, rateh);
        Body.setPosition(obj, {
            x : obj.position.x * ratew,
            y : obj.position.y * rateh
        });
    }
}

/* 各種イベント */

// FIXME
var jsonEditor;
var initCode = "";

$(function () {
    
    $('#macaron-text').val(initCode);
    // var jsEditor = makeEditor();
    jsonEditor = makeJSONEditor();

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
    // $('#increment-frame').click(function () {
    //     console.log("increment-frame");
    //     runner.enabled = true;
    //     /* 1フレーム後にrunnerを再び非アクティブにする */
    //     // FIXME timeCounterが増えない場合がある
    //     setTimeout(function(){
    //         runner.enabled = false;
    //     }, 1);
    // });
    // $('#reset').click(function () {
    //     console.log("reset");
    //     resetState();
    //     // engineとrunnerを消去
    //     // スタイルシート読み込み
    //     // macaronコード処理
    // });
    // TODO 画面を戻した時、発火するように変更
    $('#apply').click(function (){
        console.log("apply")

        // $.ajax({
        //     url: '/write',
        //     type: 'POST',
        //     timeout: 5000
        // }).done(function(data) {
        //     console.log(data);
        //     myRule();
        //     // document.write(response); 
        // })

        resetState();

        jsonEditor.toTextArea();
        var inputs = $('#macaron-text').val().toString();
        jsonEditor = makeJSONEditor();

        /* サーバーにinputsを投げる */
        $.ajax({
            url: '/stylesheet',
            type: 'POST',
            // dataType: 'json',
            data: {
                [$('#macaron-text').attr('name')]:inputs
            },
            timeout: 5000,
        })
        .done(function(data) {
            
            /* スタイルシートの処理 */
            var inputsJSON = (new TextEncoder).encode(stylesheet);
            var jsonResult = parseJSON(inputsJSON,inputsJSON.length-1);
            initJSON(jsonResult);

            /* ルールの処理 */
            /* 衝突判定? */
            myRule();
            // eval(data.rule);
        })
        .fail(function() {
            console.log('fail')
        });
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
                jsonEditor.toTextArea();
                $('#macaron-text').val(data);
                jsonEditor = makeJSONEditor();
            })
            .fail(function() {
                console.log('fail')
            });
        }else{
            jsonEditor.toTextArea();
            $('#macaron-text').val("");
            jsonEditor = makeJSONEditor();
        }
    })
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

/* スタイルシート用エディタ */
var editorW = 550;
var editorH = 550;
function makeJSONEditor(){
    var jsonEditor = CodeMirror.fromTextArea(document.getElementById("macaron-text"), {
        mode: "javascript", // FIXME 
        lineNumbers: false,
        indentUnit: 4
        // ,extraKeys: {"Ctrl-Space": "autocomplete"}
    });

    jsonEditor.setSize(editorW, editorH);
    // jsonEditor.on('change', imageComplete);
    return jsonEditor;
}

function resizeEditorSize(){
    editorW = editorW * cvsw/cvswBase;
    editorH = editorH * cvsh/cvshBase;
    jsonEditor.setSize(editorW, editorH);
}

function resetState(){
    // timeCounter = 0;
    // $("#time-counter").text(timeCounter);

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