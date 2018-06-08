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

function e78(px){
  return or1(px,(p234) => p234.inputs[p234.pos++] == 92 && bits32(bs21,p234.inputs[p234.pos++]),(p241) => or1(p241,(p235) => p235.inputs[p235.pos++] == 92 && bits32(bs22,p235.inputs[p235.pos++]) && bits32(bs23,p235.inputs[p235.pos++]) && bits32(bs23,p235.inputs[p235.pos++]),(p240) => or1(p240,(p236) => p236.inputs[p236.pos++] == 92 && bits32(bs23,p236.inputs[p236.pos++]) && bits32(bs23,p236.inputs[p236.pos++]),(p239) => or1(p239,(p237) => p237.inputs[p237.pos++] == 92 && bits32(bs23,p237.inputs[p237.pos++]),(p238) => p238.inputs[p238.pos++] == 92 && p238.inputs[p238.pos++] == 117 && manychar(p238,bs24) && bits32(bs18,p238.inputs[p238.pos++]) && bits32(bs18,p238.inputs[p238.pos++]) && bits32(bs18,p238.inputs[p238.pos++]) && bits32(bs18,p238.inputs[p238.pos++])))));
}

function e73(px){
  return or1(px,e78,(p225) => bits32(bs12,p225.inputs[p225.pos++]));
}

function e72(px){
  return or1(px,e78,(p224) => bits32(bs11,p224.inputs[p224.pos++]));
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

function e51(px){
  return px.inputs[px.pos++] == 91 && e16(px);
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
  return newtree(px,0,(p135) => or1(p135,(p119) => p119.inputs[p119.pos++] == 94,(p134) => or1(p134,(p120) => p120.inputs[p120.pos++] == 42 && p120.inputs[p120.pos++] == 42 && !(p120.inputs[p120.pos] == 42),(p133) => or1(p133,(p121) => p121.inputs[p121.pos++] == 60 && p121.inputs[p121.pos++] == 60,(p132) => or1(p132,(p122) => p122.inputs[p122.pos++] == 62 && p122.inputs[p122.pos++] == 62,(p131) => or1(p131,(p123) => p123.inputs[p123.pos++] == 38 && !(p123.inputs[p123.pos] == 38),(p130) => or1(p130,(p124) => p124.inputs[p124.pos++] == 47,(p129) => or1(p129,(p125) => p125.inputs[p125.pos++] == 42,(p128) => or1(p128,(p126) => p126.inputs[p126.pos++] == 37,(p127) => p127.inputs[p127.pos++] == 109 && p127.inputs[p127.pos++] == 111 && p127.inputs[p127.pos++] == 100 && !(bits32(bs5,p127.inputs[p127.pos])))))))))) && tagtree(p135,"Name"),EmptyTag,0) && e16(px);
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

function e50(px){
  return newtree(px,0,(p164) => or3(p164,(p161) => linktree(p161,"",e14),(p162) => true) && many3(p164,(p163) => e15(p163) && linktree(p163,"",e14)),EmptyTag,0);
}

function e24(px){
  return !(bits32(bs5,px.inputs[px.pos])) && e16(px);
}

function e53(px){
  return or1(px,(p165) => p165.inputs[p165.pos++] == 116 && p165.inputs[p165.pos++] == 111 && e24(p165),(p168) => or1(p168,(p166) => p166.inputs[p166.pos++] == 97 && p166.inputs[p166.pos++] == 115 && e24(p166),(p167) => p167.inputs[p167.pos++] == 61 && p167.inputs[p167.pos++] == 62 && e16(p167)));
}

function e52(px){
  return px.inputs[px.pos++] == 93 && e16(px);
}

function e40(px){
  return or3(px,(p113) => p113.inputs[p113.pos++] == 46 && e16(p113) && linktree(p113,"name",e12) && or3(p113,(p111) => e41(p111) && linktree(p111,"param",e50) && e42(p111) && tagtree(p111,"Method"),(p112) => tagtree(p112,"Get")),(p118) => or3(p118,(p114) => e41(p114) && linktree(p114,"param",e50) && e42(p114) && tagtree(p114,"Apply"),(p117) => or3(p117,(p115) => e51(p115) && linktree(p115,"param",e50) && e52(p115) && tagtree(p115,"Index"),(p116) => e53(p116) && linktree(p116,"type",e12) && tagtree(p116,"CastExpr"))));
}

function e44(px){
  return e41(px) && e14(px) && or3(px,(p138) => foldtree(p138,0,"",(p137) => e15(p137) && linktree(p137,"",e14) && many3(p137,(p136) => e15(p136) && linktree(p136,"",e14)) && tagtree(p137,"Tuple"),EmptyTag,0),(p139) => true) && e42(px);
}

function e46(px){
  return newtree(px,0,(p144) => e51(p144) && or3(p144,(p141) => linktree(p141,"",e14),(p142) => true) && many3(p144,(p143) => e15(p143) && many1(p143,e15) && linktree(p143,"",e14)) && many1(p144,e15) && e52(p144) && tagtree(p144,"List"),EmptyTag,0);
}

function e45(px){
  return newtree(px,0,(p140) => e41(p140) && e42(p140) && tagtree(p140,"Empty"),EmptyTag,0) && e16(px);
}

function e54(px){
  return px.inputs[px.pos++] == 123 && e16(px);
}

function e57(px){
  return px.inputs[px.pos++] == 125 && e16(px);
}

function e61(px){
  return px.inputs[px.pos++] == 39 && newtree(px,0,(p184) => many1(p184,e72) && tagtree(p184,"Char"),EmptyTag,0) && px.inputs[px.pos++] == 39 && e16(px);
}

function e71(px){
  return or1(px,e78,(p223) => bits32(bs10,p223.inputs[p223.pos++]));
}

function e60(px){
  return px.inputs[px.pos++] == 34 && newtree(px,0,(p183) => many1(p183,e71) && tagtree(p183,"String"),EmptyTag,0) && px.inputs[px.pos++] == 34 && e16(px);
}

function e58(px){
  return newtree(px,0,(p180) => linktree(p180,"name",(p175) => or3(p175,e60,e61)) && or1(p180,(p176) => p176.inputs[p176.pos++] == 58,(p179) => or1(p179,(p177) => p177.inputs[p177.pos++] == 61,(p178) => p178.inputs[p178.pos++] == 61 && p178.inputs[p178.pos++] == 62)) && e16(p180) && linktree(p180,"value",e14),EmptyTag,0);
}

function e48(px){
  return newtree(px,0,(p151) => e54(p151) && linktree(p151,"",e58) && many3(p151,(p150) => e15(p150) && linktree(p150,"",e58)) && tagtree(p151,"Dict") && e57(p151),EmptyTag,0);
}

function e55(px){
  return newtree(px,0,(p169) => p169.inputs[p169.pos++] == 35 && linktree(p169,"name",e12),EmptyTag,0);
}

function e56(px){
  return newtree(px,0,(p174) => linktree(p174,"name",e12) && or1(p174,(p170) => p170.inputs[p170.pos++] == 58,(p173) => or1(p173,(p171) => p171.inputs[p171.pos++] == 61,(p172) => p172.inputs[p172.pos++] == 61 && p172.inputs[p172.pos++] == 62)) && e16(p174) && linktree(p174,"value",e14),EmptyTag,0);
}

function e47(px){
  return newtree(px,0,(p149) => e54(p149) && many3(p149,(p147) => linktree(p147,"",(p146) => e55(p146) && or1(p146,e15,(p145) => true))) && linktree(p149,"",e56) && many3(p149,(p148) => e15(p148) && linktree(p148,"",e56)) && tagtree(p149,"Data") && e57(p149),EmptyTag,0);
}

function e62(px){
  return px.inputs[px.pos++] == 60 && newtree(px,0,(p185) => many1(p185,e73) && tagtree(p185,"Image"),EmptyTag,0) && px.inputs[px.pos++] == 62 && e16(px);
}

function e75(px){
  return or1(px,(p229) => p229.inputs[p229.pos++] == 48 && !(bits32(bs14,p229.inputs[p229.pos])),(p231) => bits32(bs15,p231.inputs[p231.pos++]) && many1(p231,(p230) => manychar(p230,bs16) && bits32(bs13,p230.inputs[p230.pos++])));
}

function e64(px){
  return newtree(px,0,(p190) => e75(p190) && p190.inputs[p190.pos++] == 47 && e75(p190) && tagtree(p190,"Rational"),EmptyTag,0) && e16(px) && or3(px,(p192) => foldtree(p192,0,"",(p191) => linktree(p191,"",e12) && tagtree(p191,"Unit"),EmptyTag,0),(p193) => true);
}

function e79(px){
  return or1(px,(p244) => !(p244.inputs[p244.pos] == 95) && many1(p244,(p242) => manychar(p242,bs16) && bits32(bs13,p242.inputs[p242.pos++])) && p244.inputs[p244.pos++] == 46 && bits32(bs13,p244.inputs[p244.pos++]) && many1(p244,(p243) => manychar(p243,bs16) && bits32(bs13,p243.inputs[p243.pos++])),(p246) => bits32(bs13,p246.inputs[p246.pos++]) && many1(p246,(p245) => manychar(p245,bs16) && bits32(bs13,p245.inputs[p245.pos++])) && p246.inputs[p246.pos++] == 46 && !(p246.inputs[p246.pos] == 46));
}

function e80(px){
  return bits32(bs25,px.inputs[px.pos++]) && or1(px,(p247) => bits32(bs26,p247.inputs[p247.pos++]),(p248) => true) && bits32(bs13,px.inputs[px.pos++]) && many1(px,(p249) => manychar(p249,bs16) && bits32(bs13,p249.inputs[p249.pos++]));
}

function e74(px){
  return or1(px,(p227) => e79(p227) && or1(p227,e80,(p226) => true),(p228) => bits32(bs13,p228.inputs[p228.pos++]) && manychar(p228,bs13) && e80(p228));
}

function e63(px){
  return newtree(px,0,(p186) => e74(p186) && tagtree(p186,"Double"),EmptyTag,0) && e16(px) && or3(px,(p188) => foldtree(p188,0,"",(p187) => linktree(p187,"",e12) && tagtree(p187,"Unit"),EmptyTag,0),(p189) => true);
}

function e66(px){
  return newtree(px,0,(p201) => bits32(bs7,p201.inputs[p201.pos++]) && p201.inputs[p201.pos++] == 114 && p201.inputs[p201.pos++] == 117 && p201.inputs[p201.pos++] == 101 && or1(p201,(p199) => bits32(bs5,p199.inputs[p199.pos]) && !(bits32(bs5,p199.inputs[p199.pos])),(p200) => true) && tagtree(p201,"True"),EmptyTag,0) && e16(px);
}

function e77(px){
  return px.inputs[px.pos++] == 48 && bits32(bs19,px.inputs[px.pos++]) && bits32(bs20,px.inputs[px.pos++]) && many1(px,(p233) => manychar(p233,bs16) && bits32(bs20,p233.inputs[p233.pos++]));
}

function e76(px){
  return px.inputs[px.pos++] == 48 && bits32(bs17,px.inputs[px.pos++]) && bits32(bs18,px.inputs[px.pos++]) && many1(px,(p232) => manychar(p232,bs16) && bits32(bs18,p232.inputs[p232.pos++]));
}

function e65(px){
  return newtree(px,0,(p195) => or1(p195,e75,(p194) => or1(p194,e76,e77)) && tagtree(p195,"Int"),EmptyTag,0) && e16(px) && or3(px,(p197) => foldtree(p197,0,"",(p196) => linktree(p196,"",e12) && tagtree(p196,"Unit"),EmptyTag,0),(p198) => true);
}

function e68(px){
  return newtree(px,0,(p215) => bits32(bs9,p215.inputs[p215.pos++]) && or1(p215,(p205) => p205.inputs[p205.pos++] == 117 && p205.inputs[p205.pos++] == 108 && p205.inputs[p205.pos++] == 108,(p212) => or1(p212,(p206) => p206.inputs[p206.pos++] == 111 && p206.inputs[p206.pos++] == 110 && p206.inputs[p206.pos++] == 101,(p211) => or1(p211,(p207) => p207.inputs[p207.pos++] == 105 && p207.inputs[p207.pos++] == 108,(p210) => or1(p210,(p208) => p208.inputs[p208.pos++] == 85 && p208.inputs[p208.pos++] == 76 && p208.inputs[p208.pos++] == 76,(p209) => p209.inputs[p209.pos++] == 111 && p209.inputs[p209.pos++] == 116 && p209.inputs[p209.pos++] == 104 && p209.inputs[p209.pos++] == 105 && p209.inputs[p209.pos++] == 110 && p209.inputs[p209.pos++] == 103)))) && or1(p215,(p213) => bits32(bs5,p213.inputs[p213.pos]) && !(bits32(bs5,p213.inputs[p213.pos])),(p214) => true) && tagtree(p215,"Null"),EmptyTag,0) && e16(px);
}

function e67(px){
  return newtree(px,0,(p204) => bits32(bs8,p204.inputs[p204.pos++]) && p204.inputs[p204.pos++] == 97 && p204.inputs[p204.pos++] == 108 && p204.inputs[p204.pos++] == 115 && p204.inputs[p204.pos++] == 101 && or1(p204,(p202) => bits32(bs5,p202.inputs[p202.pos]) && !(bits32(bs5,p202.inputs[p202.pos])),(p203) => true) && tagtree(p204,"False"),EmptyTag,0) && e16(px);
}

function e70(px){
  return or3(px,(p217) => p217.inputs[p217.pos++] == 36 && p217.inputs[p217.pos++] == 123 && e14(p217) && p217.inputs[p217.pos++] == 125,(p222) => newtree(p222,0,(p221) => many1(p221,(p220) => not1(p220,(p218) => p218.inputs[p218.pos++] == 39 && p218.inputs[p218.pos++] == 39 && p218.inputs[p218.pos++] == 39) && not1(p220,(p219) => p219.inputs[p219.pos++] == 36 && p219.inputs[p219.pos++] == 123) && p220.pos < p220.length && mnext1(p220)) && tagtree(p221,"String"),EmptyTag,0));
}

function e59(px){
  return px.inputs[px.pos++] == 39 && px.inputs[px.pos++] == 39 && px.inputs[px.pos++] == 39 && newtree(px,0,(p182) => many11(p182,(p181) => linktree(p181,"",e70)) && tagtree(p182,"Template"),EmptyTag,0) && px.inputs[px.pos++] == 39 && px.inputs[px.pos++] == 39 && px.inputs[px.pos++] == 39;
}

function e69(px){
  return newtree(px,0,(p216) => p216.inputs[p216.pos++] == 226 && p216.inputs[p216.pos++] == 151 && p216.inputs[p216.pos++] == 143 && tagtree(p216,"Pictogram"),EmptyTag,0) && e16(px);
}

function e49(px){
  return or3(px,e59,(p160) => or3(p160,e60,(p159) => or3(p159,e61,(p158) => or3(p158,e62,(p157) => or3(p157,e63,(p156) => or3(p156,e64,(p155) => or3(p155,e65,(p154) => or3(p154,e66,(p153) => or3(p153,e67,(p152) => or3(p152,e68,e69))))))))));
}

function e39(px){
  return or3(px,e44,(p110) => or3(p110,e45,(p109) => or3(p109,e46,(p108) => or3(p108,e47,(p107) => or3(p107,e48,(p106) => or3(p106,e49,e12))))));
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
// 
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
    
