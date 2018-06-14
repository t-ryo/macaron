const EmptyTag = "";
const EmptyTree = null;
const EmptyState = null;

class clink {
  constructor(tag,child,prev) {
    this.tag = tag;
    this.child = child;
    this.prev = prev;
  }
  toString() {
    if(this.child != null && this.tag != null){
      return '$' + this.tag + '=' + this.child.toString();
    }
    return '';
  }
  getTag() {
     for (var cur = this; cur != null; cur = cur.prev) {
        if (cur.child == null) {
           return cur.tag;
        }
     }
     return EmptyTag;
  }
}

class ctree {
  constructor(tag,inputs,spos,epos,child) {
    this.tag = (tag == EmptyTag && child != null) ? child.getTag() : tag;
    this.inputs = inputs;
    this.spos = spos;
    this.epos = epos;
    this.child = child;
  }
  toString() {
    var s = "[#" + this.tag;
    var cur = this.child;
    var cnt = 0;
    while(cur != null){
      s = s + " " + cur.toString();
      cur = cur.prev;
      cnt++;
    }
    if(cnt == 1){
      s = s + " '" + this.inputs.slice(this.spos, this.epos).toString() + "'";
    }
    return s + "]";
  }
}

class cmemo {
  constructor() {
    this.key = 0;
    this.matched = false;
    this.mpos = 0;
    this.mtree = null;
    this.mstate = null;
  }
}

class cstate {
  constructor(ns, spos, epos, sprev) {
    this.ns = ns;
    this.spos = spos;
    this.slen = epos - spos;
    this.sprev = sprev;
  }
}

class ParserContext {
  constructor(inputs, length, memolen) {
    this.inputs = inputs;
    this.length = length;
    this.pos = 0;
    this.headpos = 0;
    this.tree = null;
    this.state = null;
    this.memos = [...Array(memolen).keys()].map(function(){return new cmemo()});
  }
}

function bits32(bits, b){
  var n = b & 0xff;
  return (bits[n / 32 | 0] & (1 << (n % 32))) != 0;
}

function mbackpos(px, pos){
  if(px.headpos < px.pos){
    px.headpos = px.pos;
  }
  return pos;
}

const memosize = 0
const memolen = 1
const bs0 = [9728,1,0,0,0,0,0,0]
const bs1 = [0,8192,0,0,0,0,0,0]
const bs2 = [0,128,0,0,0,0,0,0]
const bs3 = [512,1,0,0,0,0,0,0]
const bs4 = [0,0,-2013265922,134217726,-1,-1,-1,16777215]
const bs5 = [0,67043328,-2013265922,134217726,-1,-1,-1,16777215]
const bs6 = [0,2048,0,1073741824,0,0,0,0]
const bs7 = [0,0,1048576,1048576,0,0,0,0]
const bs8 = [0,0,64,64,0,0,0,0]
const bs9 = [0,0,16384,16384,0,0,0,0]
const bs10 = [-1025,-5,-268435457,-1,-1,-1,-1,-1]
const bs11 = [-1025,-129,-268435457,-1,-1,-1,-1,-1]
const bs12 = [-1025,-1342177281,-268435457,-1,-1,-1,-1,-1]
const bs13 = [0,67043328,0,0,0,0,0,0]
const bs14 = [0,67043328,-2130706428,16777220,0,0,0,0]
const bs15 = [0,66977792,0,0,0,0,0,0]
const bs16 = [0,0,-2147483648,0,0,0,0,0]
const bs17 = [0,0,16777216,16777216,0,0,0,0]
const bs18 = [0,67043328,126,126,0,0,0,0]
const bs19 = [0,0,4,4,0,0,0,0]
const bs20 = [0,196608,0,0,0,0,0,0]
const bs21 = [0,132,268435456,1327172,0,0,0,0]
const bs22 = [0,983040,0,0,0,0,0,0]
const bs23 = [0,16711680,0,0,0,0,0,0]
const bs24 = [0,0,0,2097152,0,0,0,0]
const bs25 = [0,0,32,32,0,0,0,0]
const bs26 = [0,10240,0,0,0,0,0,0]
function mnext1(px){
  px.pos = px.pos + 1;
  return true;
}

function mback1(px,pos){
  px.pos = mbackpos(px, pos);
  return true;
}

function mback3(px,pos,tree){
  px.pos = mbackpos(px, pos);
  px.tree = tree;
  return true;
}

function or1(px,pe,pe2){
  var pos = px.pos;
  return pe(px) || mback1(px,pos) && pe2(px);
}

function or3(px,pe,pe2){
  var pos = px.pos;
  var tree = px.tree;
  return pe(px) || mback3(px,pos,tree) && pe2(px);
}

function many1(px,pe){
  var pos = px.pos;
  while(pe(px)) {
    pos = px.pos;
  }
  return mback1(px,pos);
}

function many3(px,pe){
  var pos = px.pos;
  var tree = px.tree;
  while(pe(px)) {
    pos = px.pos;
    tree = px.tree;
  }
  return mback3(px,pos,tree);
}

function manychar(px,bm){
  while(bits32(bm,px.inputs[px.pos])) {
    px.pos = px.pos + 1;
  }
  return true;
}

function not1(px,pe){
  var pos = px.pos;
  return !(pe(px)) && mback1(px,pos);
}

function mtree(px,tag,spos,epos){
  px.tree = new ctree(tag,px.inputs,spos,epos,px.tree);
  return true;
}

function mlink(px,tag,child,prev){
  px.tree = new clink(tag,child,prev);
  return true;
}

function newtree(px,spos,pe,tag,epos){
  var pos = px.pos;
  px.tree = EmptyTree;
  return pe(px) && mtree(px,tag,pos + spos,px.pos + epos);
}

function foldtree(px,spos,label,pe,tag,epos){
  var pos = px.pos;
  return mlink(px,label,px.tree,EmptyTree) && pe(px) && mtree(px,tag,pos + spos,px.pos + epos);
}

function linktree(px,tag,pe){
  var tree = px.tree;
  return pe(px) && mlink(px,tag,px.tree,tree);
}

function tagtree(px,tag){
  return mlink(px,tag,EmptyTree,px.tree);
}

function e79(px){
  return or1(px,(p240) => p240.inputs[p240.pos++] == 92 && bits32(bs21,p240.inputs[p240.pos++]),(p247) => or1(p247,(p241) => p241.inputs[p241.pos++] == 92 && bits32(bs22,p241.inputs[p241.pos++]) && bits32(bs23,p241.inputs[p241.pos++]) && bits32(bs23,p241.inputs[p241.pos++]),(p246) => or1(p246,(p242) => p242.inputs[p242.pos++] == 92 && bits32(bs23,p242.inputs[p242.pos++]) && bits32(bs23,p242.inputs[p242.pos++]),(p245) => or1(p245,(p243) => p243.inputs[p243.pos++] == 92 && bits32(bs23,p243.inputs[p243.pos++]),(p244) => p244.inputs[p244.pos++] == 92 && p244.inputs[p244.pos++] == 117 && manychar(p244,bs24) && bits32(bs18,p244.inputs[p244.pos++]) && bits32(bs18,p244.inputs[p244.pos++]) && bits32(bs18,p244.inputs[p244.pos++]) && bits32(bs18,p244.inputs[p244.pos++])))));
}

function e73(px){
  return or1(px,e79,(p230) => bits32(bs11,p230.inputs[p230.pos++]));
}

function e72(px){
  return or1(px,e79,(p229) => bits32(bs10,p229.inputs[p229.pos++]));
}

function e3(px){
  return !(px.pos < px.length);
}

function e8(px){
  return or1(px,(p21) => or1(p21,(p19) => p19.inputs[p19.pos++] == 13,(p20) => true) && p21.inputs[p21.pos++] == 10,e3);
}

function e5(px){
  return px.inputs[px.pos++] == 47 && px.inputs[px.pos++] == 47 && many1(px,(p13) => not1(p13,e8) && p13.pos < p13.length && mnext1(p13)) && e8(px);
}

function e4(px){
  return or1(px,(p9) => p9.inputs[p9.pos++] == 47 && p9.inputs[p9.pos++] == 42 && many1(p9,(p8) => not1(p8,(p7) => p7.inputs[p7.pos++] == 42 && p7.inputs[p7.pos++] == 47) && p8.pos < p8.length && mnext1(p8)) && p9.inputs[p9.pos++] == 42 && p9.inputs[p9.pos++] == 47,(p12) => p12.inputs[p12.pos++] == 40 && p12.inputs[p12.pos++] == 42 && many1(p12,(p11) => not1(p11,(p10) => p10.inputs[p10.pos++] == 42 && p10.inputs[p10.pos++] == 41) && p11.pos < p11.length && mnext1(p11)) && p12.inputs[p12.pos++] == 42 && p12.inputs[p12.pos++] == 41);
}

function e16(px){
  return many1(px,(p43) => or1(p43,(p41) => bits32(bs3,p41.inputs[p41.pos++]),(p42) => or1(p42,e4,e5)));
}

function e35(px){
  return newtree(px,0,(p94) => or1(p94,(p88) => p88.inputs[p88.pos++] == 45,(p93) => or1(p93,(p89) => p89.inputs[p89.pos++] == 33,(p92) => or1(p92,(p90) => p90.inputs[p90.pos++] == 110 && p90.inputs[p90.pos++] == 111 && p90.inputs[p90.pos++] == 116 && bits32(bs3,p90.inputs[p90.pos++]),(p91) => bits32(bs6,p91.inputs[p91.pos++])))),EmptyTag,0) && e16(px);
}

function e1(px){
  return many1(px,(p5) => or1(p5,(p3) => bits32(bs0,p3.inputs[p3.pos++]),(p4) => or1(p4,e4,e5)));
}

function e15(px){
  return px.inputs[px.pos++] == 44 && e1(px);
}

function e30(px){
  return newtree(px,0,(p64) => or1(p64,(p62) => p62.inputs[p62.pos++] == 97 && p62.inputs[p62.pos++] == 110 && p62.inputs[p62.pos++] == 100 && !(bits32(bs5,p62.inputs[p62.pos])),(p63) => p63.inputs[p63.pos++] == 38 && p63.inputs[p63.pos++] == 38 && !(p63.inputs[p63.pos] == 38)) && tagtree(p64,"Name"),EmptyTag,0) && e16(px);
}

function e33(px){
  return newtree(px,0,(p86) => or1(p86,(p72) => p72.inputs[p72.pos++] == 61 && p72.inputs[p72.pos++] == 61 && p72.inputs[p72.pos++] == 61,(p85) => or1(p85,(p73) => p73.inputs[p73.pos++] == 61 && p73.inputs[p73.pos++] == 61,(p84) => or1(p84,(p74) => p74.inputs[p74.pos++] == 33 && p74.inputs[p74.pos++] == 61,(p83) => or1(p83,(p75) => p75.inputs[p75.pos++] == 60 && p75.inputs[p75.pos++] == 61,(p82) => or1(p82,(p76) => p76.inputs[p76.pos++] == 62 && p76.inputs[p76.pos++] == 61,(p81) => or1(p81,(p77) => p77.inputs[p77.pos++] == 60,(p80) => or1(p80,(p78) => p78.inputs[p78.pos++] == 62,(p79) => p79.inputs[p79.pos++] == 105 && p79.inputs[p79.pos++] == 110 && !(bits32(bs5,p79.inputs[p79.pos]))))))))) && tagtree(p86,"Name"),EmptyTag,0) && e16(px);
}

function e43(px){
  return newtree(px,0,(p136) => or1(p136,(p120) => p120.inputs[p120.pos++] == 94,(p135) => or1(p135,(p121) => p121.inputs[p121.pos++] == 42 && p121.inputs[p121.pos++] == 42 && !(p121.inputs[p121.pos] == 42),(p134) => or1(p134,(p122) => p122.inputs[p122.pos++] == 60 && p122.inputs[p122.pos++] == 60,(p133) => or1(p133,(p123) => p123.inputs[p123.pos++] == 62 && p123.inputs[p123.pos++] == 62,(p132) => or1(p132,(p124) => p124.inputs[p124.pos++] == 38 && !(p124.inputs[p124.pos] == 38),(p131) => or1(p131,(p125) => p125.inputs[p125.pos++] == 47,(p130) => or1(p130,(p126) => p126.inputs[p126.pos++] == 42,(p129) => or1(p129,(p127) => p127.inputs[p127.pos++] == 37,(p128) => p128.inputs[p128.pos++] == 109 && p128.inputs[p128.pos++] == 111 && p128.inputs[p128.pos++] == 100 && !(bits32(bs5,p128.inputs[p128.pos])))))))))) && tagtree(p136,"Name"),EmptyTag,0) && e16(px);
}

function e42(px){
  return px.inputs[px.pos++] == 41 && e16(px);
}

function e41(px){
  return px.inputs[px.pos++] == 40 && e16(px);
}

function e28(px){
  return px.inputs[px.pos++] == 119 && px.inputs[px.pos++] == 104 && px.inputs[px.pos++] == 101 && px.inputs[px.pos++] == 110 && !(bits32(bs5,px.inputs[px.pos]));
}

function e27(px){
  return px.inputs[px.pos++] == 102 && px.inputs[px.pos++] == 111 && px.inputs[px.pos++] == 114 && px.inputs[px.pos++] == 101 && px.inputs[px.pos++] == 97 && px.inputs[px.pos++] == 99 && px.inputs[px.pos++] == 104 && !(bits32(bs5,px.inputs[px.pos]));
}

function e20(px){
  return or1(px,e27,e28);
}

function e21(px){
  return bits32(bs4,px.inputs[px.pos++]) && manychar(px,bs5);
}

function e12(px){
  return not1(px,e20) && newtree(px,0,(p38) => e21(p38) && manychar(p38,bs2) && or1(p38,(p36) => p36.inputs[p36.pos++] == 63,(p37) => true) && tagtree(p38,"Name"),EmptyTag,0) && e16(px);
}

function e36(px){
  return or3(px,(p96) => newtree(p96,0,(p95) => e41(p95) && linktree(p95,"type",e12) && e42(p95) && linktree(p95,"recv",e36) && tagtree(p95,"Cast"),EmptyTag,0),e31);
}

function e37(px){
  return e36(px) && many3(px,(p98) => foldtree(p98,0,"left",(p97) => linktree(p97,"op",e43) && linktree(p97,"right",e36) && tagtree(p97,"Infix"),EmptyTag,0));
}

function e38(px){
  return newtree(px,0,(p105) => or1(p105,(p99) => p99.inputs[p99.pos++] == 43 && p99.inputs[p99.pos++] == 43,(p104) => or1(p104,(p100) => p100.inputs[p100.pos++] == 43,(p103) => or1(p103,(p101) => p101.inputs[p101.pos++] == 45,(p102) => p102.inputs[p102.pos++] == 124 && !(p102.inputs[p102.pos] == 124)))) && tagtree(p105,"Name"),EmptyTag,0) && e16(px);
}

function e32(px){
  return e37(px) && many3(px,(p71) => foldtree(p71,0,"left",(p70) => linktree(p70,"op",e38) && linktree(p70,"right",e37) && tagtree(p70,"Infix"),EmptyTag,0));
}

function e29(px){
  return e32(px) && many3(px,(p61) => foldtree(p61,0,"left",(p60) => linktree(p60,"op",e33) && linktree(p60,"right",e32) && tagtree(p60,"Infix"),EmptyTag,0));
}

function e22(px){
  return e29(px) && many3(px,(p54) => foldtree(p54,0,"left",(p53) => linktree(p53,"op",e30) && linktree(p53,"right",e29) && tagtree(p53,"Infix"),EmptyTag,0));
}

function e23(px){
  return newtree(px,0,(p57) => or1(p57,(p55) => p55.inputs[p55.pos++] == 111 && p55.inputs[p55.pos++] == 114 && !(bits32(bs5,p55.inputs[p55.pos])),(p56) => p56.inputs[p56.pos++] == 124 && p56.inputs[p56.pos++] == 124 && !(p56.inputs[p56.pos] == 124)) && tagtree(p57,"Name"),EmptyTag,0) && px.inputs[px.pos++] == 95 && px.inputs[px.pos++] == 227 && px.inputs[px.pos++] == 128 && px.inputs[px.pos++] == 128;
}

function e14(px){
  return e22(px) && many3(px,(p40) => foldtree(p40,0,"left",(p39) => linktree(p39,"op",e23) && linktree(p39,"right",e22) && tagtree(p39,"Infix"),EmptyTag,0));
}

function e51(px){
  return newtree(px,0,(p170) => or3(p170,(p167) => linktree(p167,"",e14),(p168) => true) && many3(p170,(p169) => e15(p169) && linktree(p169,"",e14)) && tagtree(p170,"Arguments"),EmptyTag,0);
}

function e53(px){
  return px.inputs[px.pos++] == 93 && e16(px);
}

function e52(px){
  return px.inputs[px.pos++] == 91 && e16(px);
}

function e24(px){
  return !(bits32(bs5,px.inputs[px.pos])) && e16(px);
}

function e54(px){
  return or1(px,(p171) => p171.inputs[p171.pos++] == 116 && p171.inputs[p171.pos++] == 111 && e24(p171),(p174) => or1(p174,(p172) => p172.inputs[p172.pos++] == 97 && p172.inputs[p172.pos++] == 115 && e24(p172),(p173) => p173.inputs[p173.pos++] == 61 && p173.inputs[p173.pos++] == 62 && e16(p173)));
}

function e40(px){
  return or3(px,(p114) => p114.inputs[p114.pos++] == 46 && e16(p114) && linktree(p114,"name",e12) && or3(p114,(p112) => e41(p112) && linktree(p112,"param",e51) && e42(p112) && tagtree(p112,"Method"),(p113) => tagtree(p113,"Get")),(p119) => or3(p119,(p115) => e41(p115) && linktree(p115,"param",e51) && e42(p115) && tagtree(p115,"Apply"),(p118) => or3(p118,(p116) => e52(p116) && linktree(p116,"param",e51) && e53(p116) && tagtree(p116,"Index"),(p117) => e54(p117) && linktree(p117,"type",e12) && tagtree(p117,"CastExpr"))));
}

function e62(px){
  return px.inputs[px.pos++] == 39 && newtree(px,0,(p190) => many1(p190,e73) && tagtree(p190,"Char"),EmptyTag,0) && px.inputs[px.pos++] == 39 && e16(px);
}

function e61(px){
  return px.inputs[px.pos++] == 34 && newtree(px,0,(p189) => many1(p189,e72) && tagtree(p189,"String"),EmptyTag,0) && px.inputs[px.pos++] == 34 && e16(px);
}

function e80(px){
  return or1(px,(p250) => !(p250.inputs[p250.pos] == 95) && many1(p250,(p248) => manychar(p248,bs16) && bits32(bs13,p248.inputs[p248.pos++])) && p250.inputs[p250.pos++] == 46 && bits32(bs13,p250.inputs[p250.pos++]) && many1(p250,(p249) => manychar(p249,bs16) && bits32(bs13,p249.inputs[p249.pos++])),(p252) => bits32(bs13,p252.inputs[p252.pos++]) && many1(p252,(p251) => manychar(p251,bs16) && bits32(bs13,p251.inputs[p251.pos++])) && p252.inputs[p252.pos++] == 46 && !(p252.inputs[p252.pos] == 46));
}

function e81(px){
  return bits32(bs25,px.inputs[px.pos++]) && or1(px,(p253) => bits32(bs26,p253.inputs[p253.pos++]),(p254) => true) && bits32(bs13,px.inputs[px.pos++]) && many1(px,(p255) => manychar(p255,bs16) && bits32(bs13,p255.inputs[p255.pos++]));
}

function e75(px){
  return or1(px,(p233) => e80(p233) && or1(p233,e81,(p232) => true),(p234) => bits32(bs13,p234.inputs[p234.pos++]) && manychar(p234,bs13) && e81(p234));
}

function e64(px){
  return newtree(px,0,(p192) => e75(p192) && tagtree(p192,"Double"),EmptyTag,0) && e16(px) && or3(px,(p194) => foldtree(p194,0,"",(p193) => linktree(p193,"",e12) && tagtree(p193,"Unit"),EmptyTag,0),(p195) => true);
}

function e74(px){
  return or1(px,e79,(p231) => bits32(bs12,p231.inputs[p231.pos++]));
}

function e63(px){
  return px.inputs[px.pos++] == 60 && newtree(px,0,(p191) => many1(p191,e74) && tagtree(p191,"Image"),EmptyTag,0) && px.inputs[px.pos++] == 62 && e16(px);
}

function e77(px){
  return px.inputs[px.pos++] == 48 && bits32(bs17,px.inputs[px.pos++]) && bits32(bs18,px.inputs[px.pos++]) && many1(px,(p238) => manychar(p238,bs16) && bits32(bs18,p238.inputs[p238.pos++]));
}

function e76(px){
  return or1(px,(p235) => p235.inputs[p235.pos++] == 48 && !(bits32(bs14,p235.inputs[p235.pos])),(p237) => bits32(bs15,p237.inputs[p237.pos++]) && many1(p237,(p236) => manychar(p236,bs16) && bits32(bs13,p236.inputs[p236.pos++])));
}

function e78(px){
  return px.inputs[px.pos++] == 48 && bits32(bs19,px.inputs[px.pos++]) && bits32(bs20,px.inputs[px.pos++]) && many1(px,(p239) => manychar(p239,bs16) && bits32(bs20,p239.inputs[p239.pos++]));
}

function e66(px){
  return newtree(px,0,(p201) => or1(p201,e76,(p200) => or1(p200,e77,e78)) && tagtree(p201,"Int"),EmptyTag,0) && e16(px) && or3(px,(p203) => foldtree(p203,0,"",(p202) => linktree(p202,"",e12) && tagtree(p202,"Unit"),EmptyTag,0),(p204) => true);
}

function e65(px){
  return newtree(px,0,(p196) => e76(p196) && p196.inputs[p196.pos++] == 47 && e76(p196) && tagtree(p196,"Rational"),EmptyTag,0) && e16(px) && or3(px,(p198) => foldtree(p198,0,"",(p197) => linktree(p197,"",e12) && tagtree(p197,"Unit"),EmptyTag,0),(p199) => true);
}

function e68(px){
  return newtree(px,0,(p210) => bits32(bs8,p210.inputs[p210.pos++]) && p210.inputs[p210.pos++] == 97 && p210.inputs[p210.pos++] == 108 && p210.inputs[p210.pos++] == 115 && p210.inputs[p210.pos++] == 101 && or1(p210,(p208) => bits32(bs5,p208.inputs[p208.pos]) && !(bits32(bs5,p208.inputs[p208.pos])),(p209) => true) && tagtree(p210,"False"),EmptyTag,0) && e16(px);
}

function e67(px){
  return newtree(px,0,(p207) => bits32(bs7,p207.inputs[p207.pos++]) && p207.inputs[p207.pos++] == 114 && p207.inputs[p207.pos++] == 117 && p207.inputs[p207.pos++] == 101 && or1(p207,(p205) => bits32(bs5,p205.inputs[p205.pos]) && !(bits32(bs5,p205.inputs[p205.pos])),(p206) => true) && tagtree(p207,"True"),EmptyTag,0) && e16(px);
}

function e69(px){
  return newtree(px,0,(p221) => bits32(bs9,p221.inputs[p221.pos++]) && or1(p221,(p211) => p211.inputs[p211.pos++] == 117 && p211.inputs[p211.pos++] == 108 && p211.inputs[p211.pos++] == 108,(p218) => or1(p218,(p212) => p212.inputs[p212.pos++] == 111 && p212.inputs[p212.pos++] == 110 && p212.inputs[p212.pos++] == 101,(p217) => or1(p217,(p213) => p213.inputs[p213.pos++] == 105 && p213.inputs[p213.pos++] == 108,(p216) => or1(p216,(p214) => p214.inputs[p214.pos++] == 85 && p214.inputs[p214.pos++] == 76 && p214.inputs[p214.pos++] == 76,(p215) => p215.inputs[p215.pos++] == 111 && p215.inputs[p215.pos++] == 116 && p215.inputs[p215.pos++] == 104 && p215.inputs[p215.pos++] == 105 && p215.inputs[p215.pos++] == 110 && p215.inputs[p215.pos++] == 103)))) && or1(p221,(p219) => bits32(bs5,p219.inputs[p219.pos]) && !(bits32(bs5,p219.inputs[p219.pos])),(p220) => true) && tagtree(p221,"Null"),EmptyTag,0) && e16(px);
}

function e71(px){
  return or3(px,(p223) => p223.inputs[p223.pos++] == 36 && p223.inputs[p223.pos++] == 123 && e14(p223) && p223.inputs[p223.pos++] == 125,(p228) => newtree(p228,0,(p227) => many1(p227,(p226) => not1(p226,(p224) => p224.inputs[p224.pos++] == 39 && p224.inputs[p224.pos++] == 39 && p224.inputs[p224.pos++] == 39) && not1(p226,(p225) => p225.inputs[p225.pos++] == 36 && p225.inputs[p225.pos++] == 123) && p226.pos < p226.length && mnext1(p226)) && tagtree(p227,"String"),EmptyTag,0));
}

function e60(px){
  return px.inputs[px.pos++] == 39 && px.inputs[px.pos++] == 39 && px.inputs[px.pos++] == 39 && newtree(px,0,(p188) => many11(p188,(p187) => linktree(p187,"",e71)) && tagtree(p188,"Template"),EmptyTag,0) && px.inputs[px.pos++] == 39 && px.inputs[px.pos++] == 39 && px.inputs[px.pos++] == 39;
}

function e70(px){
  return newtree(px,0,(p222) => p222.inputs[p222.pos++] == 226 && p222.inputs[p222.pos++] == 151 && p222.inputs[p222.pos++] == 143 && tagtree(p222,"Pictogram"),EmptyTag,0) && e16(px);
}

function e50(px){
  return or3(px,e60,(p166) => or3(p166,e61,(p165) => or3(p165,e62,(p164) => or3(p164,e63,(p163) => or3(p163,e64,(p162) => or3(p162,e65,(p161) => or3(p161,e66,(p160) => or3(p160,e67,(p159) => or3(p159,e68,(p158) => or3(p158,e69,e70))))))))));
}

function e44(px){
  return e41(px) && e14(px) && or3(px,(p139) => foldtree(p139,0,"",(p138) => e15(p138) && linktree(p138,"",e14) && many3(p138,(p137) => e15(p137) && linktree(p137,"",e14)) && tagtree(p138,"Tuple"),EmptyTag,0),(p140) => true) && e42(px);
}

function e46(px){
  return newtree(px,0,(p145) => e52(p145) && or3(p145,(p142) => linktree(p142,"",e14),(p143) => true) && many3(p145,(p144) => e15(p144) && many1(p144,e15) && linktree(p144,"",e14)) && many1(p145,e15) && e53(p145) && tagtree(p145,"List"),EmptyTag,0);
}

function e45(px){
  return newtree(px,0,(p141) => e41(p141) && e42(p141) && tagtree(p141,"Empty"),EmptyTag,0) && e16(px);
}

function e55(px){
  return px.inputs[px.pos++] == 123 && e16(px);
}

function e57(px){
  return newtree(px,0,(p180) => linktree(p180,"name",e12) && or1(p180,(p176) => p176.inputs[p176.pos++] == 58,(p179) => or1(p179,(p177) => p177.inputs[p177.pos++] == 61,(p178) => p178.inputs[p178.pos++] == 61 && p178.inputs[p178.pos++] == 62)) && e16(p180) && linktree(p180,"value",e14),EmptyTag,0);
}

function e56(px){
  return newtree(px,0,(p175) => p175.inputs[p175.pos++] == 35 && linktree(p175,"name",e12),EmptyTag,0);
}

function e58(px){
  return px.inputs[px.pos++] == 125 && e16(px);
}

function e48(px){
  return newtree(px,0,(p155) => e55(p155) && many3(p155,(p153) => linktree(p153,"",(p152) => e56(p152) && or1(p152,e15,(p151) => true))) && linktree(p155,"",e57) && many3(p155,(p154) => e15(p154) && linktree(p154,"",e57)) && tagtree(p155,"Data") && e58(p155),EmptyTag,0);
}

function e47(px){
  return newtree(px,0,(p150) => e52(p150) && linktree(p150,"left",e14) && or1(p150,(p146) => p146.inputs[p146.pos++] == 116 && p146.inputs[p146.pos++] == 111 && !(bits32(bs5,p146.inputs[p146.pos])),(p147) => p147.inputs[p147.pos++] == 46 && p147.inputs[p147.pos++] == 46) && or3(p150,(p148) => p148.inputs[p148.pos++] == 60 && tagtree(p148,"RangeUntilExpr"),(p149) => tagtree(p149,"RangeExpr")) && linktree(p150,"right",e14) && e53(p150),EmptyTag,0);
}

function e59(px){
  return newtree(px,0,(p186) => linktree(p186,"name",(p181) => or3(p181,e61,e62)) && or1(p186,(p182) => p182.inputs[p182.pos++] == 58,(p185) => or1(p185,(p183) => p183.inputs[p183.pos++] == 61,(p184) => p184.inputs[p184.pos++] == 61 && p184.inputs[p184.pos++] == 62)) && e16(p186) && linktree(p186,"value",e14),EmptyTag,0);
}

function e49(px){
  return newtree(px,0,(p157) => e55(p157) && linktree(p157,"",e59) && many3(p157,(p156) => e15(p156) && linktree(p156,"",e59)) && tagtree(p157,"Dict") && e58(p157),EmptyTag,0);
}

function e39(px){
  return or3(px,e44,(p111) => or3(p111,e45,(p110) => or3(p110,e46,(p109) => or3(p109,e47,(p108) => or3(p108,e48,(p107) => or3(p107,e49,(p106) => or3(p106,e50,e12)))))));
}

function e34(px){
  return e39(px) && many3(px,(p87) => foldtree(p87,0,"recv",e40,EmptyTag,0));
}

function e31(px){
  return or3(px,e34,(p69) => or3(p69,(p66) => newtree(p66,0,(p65) => linktree(p65,"op",e35) && linktree(p65,"expr",e36) && tagtree(p65,"Unary"),EmptyTag,0),(p68) => newtree(p68,0,(p67) => p67.inputs[p67.pos++] == 124 && e16(p67) && linktree(p67,"expr",e14) && p67.inputs[p67.pos++] == 124 && tagtree(p67,"Norm"),EmptyTag,0) && e16(p68)));
}

function e13(px){
  return px.inputs[px.pos++] == 61 && e16(px);
}

function e7(px){
  return newtree(px,0,(p18) => linktree(p18,"left",e12) && e13(p18) && linktree(p18,"right",e14) && tagtree(p18,"Let"),EmptyTag,0);
}

function e26(px){
  return newtree(px,0,(p59) => p59.inputs[p59.pos++] == 36 && linktree(p59,"left",e31) && e13(p59) && linktree(p59,"right",e14) && tagtree(p59,"Assign"),EmptyTag,0);
}

function e25(px){
  return newtree(px,0,(p58) => p58.inputs[p58.pos++] == 61 && p58.inputs[p58.pos++] == 62 && e16(p58) && linktree(p58,"expr",e14) && tagtree(p58,"Return"),EmptyTag,0);
}

function e19(px){
  return or3(px,e25,(p52) => or3(p52,e26,e7));
}

function e18(px){
  return bits32(bs3,px.inputs[px.pos++]) && manychar(px,bs3);
}

function e11(px){
  return newtree(px,0,(p35) => linktree(p35,"",(p32) => e18(p32) && e19(p32) && e8(p32)) && many3(p35,(p34) => linktree(p34,"",(p33) => e18(p33) && e19(p33) && e8(p33))) && tagtree(p35,"Body"),EmptyTag,0);
}

function e17(px){
  return or3(px,(p45) => newtree(p45,0,(p44) => p44.inputs[p44.pos++] == 102 && p44.inputs[p44.pos++] == 111 && p44.inputs[p44.pos++] == 114 && p44.inputs[p44.pos++] == 101 && p44.inputs[p44.pos++] == 97 && p44.inputs[p44.pos++] == 99 && p44.inputs[p44.pos++] == 104 && e24(p44) && linktree(p44,"",e12) && p44.inputs[p44.pos++] == 115 && p44.inputs[p44.pos++] == 111 && p44.inputs[p44.pos++] == 109 && p44.inputs[p44.pos++] == 101 && linktree(p44,"",e12) && tagtree(p44,"PeriodicSome"),EmptyTag,0),(p51) => or3(p51,(p48) => newtree(p48,0,(p47) => p47.inputs[p47.pos++] == 102 && p47.inputs[p47.pos++] == 111 && p47.inputs[p47.pos++] == 114 && p47.inputs[p47.pos++] == 101 && p47.inputs[p47.pos++] == 97 && p47.inputs[p47.pos++] == 99 && p47.inputs[p47.pos++] == 104 && e24(p47) && linktree(p47,"",e12) && many3(p47,(p46) => e15(p46) && linktree(p46,"",e12)) && tagtree(p47,"Periodic"),EmptyTag,0),(p50) => newtree(p50,0,(p49) => p49.inputs[p49.pos++] == 119 && p49.inputs[p49.pos++] == 104 && p49.inputs[p49.pos++] == 101 && p49.inputs[p49.pos++] == 110 && e24(p49) && linktree(p49,"",e14) && tagtree(p49,"Event"),EmptyTag,0)));
}

function e10(px){
  return or3(px,(p27) => newtree(p27,0,(p26) => linktree(p26,"timing",e17) && many3(p26,(p25) => e16(p25) && or1(p25,e15,(p24) => true) && linktree(p25,"",e14)) && tagtree(p26,"TimingPremise"),EmptyTag,0),(p31) => newtree(p31,0,(p30) => linktree(p30,"",e14) && many3(p30,(p29) => e16(p29) && or1(p29,e15,(p28) => true) && linktree(p29,"",e14)) && tagtree(p30,"Premise"),EmptyTag,0));
}

function e9(px){
  return newtree(px,0,(p23) => linktree(p23,"",e12) && many3(p23,(p22) => e15(p22) && linktree(p22,"",e12)) && p23.inputs[p23.pos++] == 124 && p23.inputs[p23.pos++] == 62 && e16(p23) && tagtree(p23,"Context"),EmptyTag,0);
}

function e6(px){
  return newtree(px,0,(p17) => or3(p17,(p14) => linktree(p14,"context",e9),(p15) => true) && linktree(p17,"cond",e10) && e8(p17) && p17.inputs[p17.pos++] == 45 && p17.inputs[p17.pos++] == 45 && p17.inputs[p17.pos++] == 45 && manychar(p17,bs1) && many1(p17,(p16) => not1(p16,e8) && p16.pos < p16.length && mnext1(p16)) && e8(p17) && linktree(p17,"body",e11) && tagtree(p17,"Rule"),EmptyTag,0);
}

function e2(px){
  return or3(px,e6,(p6) => e7(p6) && e8(p6));
}

function e0(px){
  return e1(px) && newtree(px,0,(p2) => many3(p2,(p1) => linktree(p1,"",(p0) => e2(p0) && e1(p0))) && tagtree(p2,"Source"),EmptyTag,0) && e1(px) && e3(px);
}

function parse(inputs,length){
  var px = new ParserContext(inputs,length,memolen);
  if(e0(px)){
    if(px.tree == null){
      return new ctree(EmptyTag, inputs, 0, px.pos, null);
    }
    return px.tree;
  }
  return new ctree("[error]", inputs, 0, px.headpos, null);
}

// var fs = require('fs');

// (function main(){
//     for(var i = 2;i < process.argv.length;i++){
//       var inputs = fs.readFileSync('./' + process.argv[i]);
//       console.time('timer1');
//       var result = parse(inputs,inputs.length-1);
//       console.timeEnd('timer1');
//       console.log(result.toString());
//       //以下の関数を使うとObjectの中身まで見れますがxmark10.xmlみたいな大きなファイルの場合にコンソールが凍ります。
//       //console.dir(JSON.stringify(result));
//     }
// })();
    
