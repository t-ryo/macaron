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
  return bits32(bs25,px.inputs[px.pos++]) && or1(px,(p241) => bits32(bs26,p241.inputs[p241.pos++]),(p242) => true) && bits32(bs13,px.inputs[px.pos++]) && many1(px,(p243) => manychar(p243,bs16) && bits32(bs13,p243.inputs[p243.pos++]));
}

function e78(px){
  return or1(px,(p238) => !(p238.inputs[p238.pos] == 95) && many1(p238,(p236) => manychar(p236,bs16) && bits32(bs13,p236.inputs[p236.pos++])) && p238.inputs[p238.pos++] == 46 && bits32(bs13,p238.inputs[p238.pos++]) && many1(p238,(p237) => manychar(p237,bs16) && bits32(bs13,p237.inputs[p237.pos++])),(p240) => bits32(bs13,p240.inputs[p240.pos++]) && many1(p240,(p239) => manychar(p239,bs16) && bits32(bs13,p239.inputs[p239.pos++])) && p240.inputs[p240.pos++] == 46 && !(p240.inputs[p240.pos] == 46));
}

function e73(px){
  return or1(px,(p221) => e78(p221) && or1(p221,e79,(p220) => true),(p222) => bits32(bs13,p222.inputs[p222.pos++]) && manychar(p222,bs13) && e79(p222));
}

function e77(px){
  return or1(px,(p228) => p228.inputs[p228.pos++] == 92 && bits32(bs21,p228.inputs[p228.pos++]),(p235) => or1(p235,(p229) => p229.inputs[p229.pos++] == 92 && bits32(bs22,p229.inputs[p229.pos++]) && bits32(bs23,p229.inputs[p229.pos++]) && bits32(bs23,p229.inputs[p229.pos++]),(p234) => or1(p234,(p230) => p230.inputs[p230.pos++] == 92 && bits32(bs23,p230.inputs[p230.pos++]) && bits32(bs23,p230.inputs[p230.pos++]),(p233) => or1(p233,(p231) => p231.inputs[p231.pos++] == 92 && bits32(bs23,p231.inputs[p231.pos++]),(p232) => p232.inputs[p232.pos++] == 92 && p232.inputs[p232.pos++] == 117 && manychar(p232,bs24) && bits32(bs18,p232.inputs[p232.pos++]) && bits32(bs18,p232.inputs[p232.pos++]) && bits32(bs18,p232.inputs[p232.pos++]) && bits32(bs18,p232.inputs[p232.pos++])))));
}

function e72(px){
  return or1(px,e77,(p219) => bits32(bs12,p219.inputs[p219.pos++]));
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
  return many1(px,(p39) => or1(p39,(p37) => bits32(bs3,p37.inputs[p37.pos++]),(p38) => or1(p38,e4,e5)));
}

function e35(px){
  return newtree(px,0,(p90) => or1(p90,(p84) => p84.inputs[p84.pos++] == 45,(p89) => or1(p89,(p85) => p85.inputs[p85.pos++] == 33,(p88) => or1(p88,(p86) => p86.inputs[p86.pos++] == 110 && p86.inputs[p86.pos++] == 111 && p86.inputs[p86.pos++] == 116 && bits32(bs3,p86.inputs[p86.pos++]),(p87) => bits32(bs6,p87.inputs[p87.pos++])))),EmptyTag,0) && e16(px);
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
  return newtree(px,0,(p60) => or1(p60,(p58) => p58.inputs[p58.pos++] == 97 && p58.inputs[p58.pos++] == 110 && p58.inputs[p58.pos++] == 100 && !(bits32(bs5,p58.inputs[p58.pos])),(p59) => p59.inputs[p59.pos++] == 38 && p59.inputs[p59.pos++] == 38 && !(p59.inputs[p59.pos] == 38)) && tagtree(p60,"Name"),EmptyTag,0) && e16(px);
}

function e33(px){
  return newtree(px,0,(p82) => or1(p82,(p68) => p68.inputs[p68.pos++] == 61 && p68.inputs[p68.pos++] == 61 && p68.inputs[p68.pos++] == 61,(p81) => or1(p81,(p69) => p69.inputs[p69.pos++] == 61 && p69.inputs[p69.pos++] == 61,(p80) => or1(p80,(p70) => p70.inputs[p70.pos++] == 33 && p70.inputs[p70.pos++] == 61,(p79) => or1(p79,(p71) => p71.inputs[p71.pos++] == 60 && p71.inputs[p71.pos++] == 61,(p78) => or1(p78,(p72) => p72.inputs[p72.pos++] == 62 && p72.inputs[p72.pos++] == 61,(p77) => or1(p77,(p73) => p73.inputs[p73.pos++] == 60,(p76) => or1(p76,(p74) => p74.inputs[p74.pos++] == 62,(p75) => p75.inputs[p75.pos++] == 105 && p75.inputs[p75.pos++] == 110 && !(bits32(bs5,p75.inputs[p75.pos]))))))))) && tagtree(p82,"Name"),EmptyTag,0) && e16(px);
}

function e43(px){
  return newtree(px,0,(p131) => or1(p131,(p115) => p115.inputs[p115.pos++] == 94,(p130) => or1(p130,(p116) => p116.inputs[p116.pos++] == 42 && p116.inputs[p116.pos++] == 42 && !(p116.inputs[p116.pos] == 42),(p129) => or1(p129,(p117) => p117.inputs[p117.pos++] == 60 && p117.inputs[p117.pos++] == 60,(p128) => or1(p128,(p118) => p118.inputs[p118.pos++] == 62 && p118.inputs[p118.pos++] == 62,(p127) => or1(p127,(p119) => p119.inputs[p119.pos++] == 38 && !(p119.inputs[p119.pos] == 38),(p126) => or1(p126,(p120) => p120.inputs[p120.pos++] == 47,(p125) => or1(p125,(p121) => p121.inputs[p121.pos++] == 42,(p124) => or1(p124,(p122) => p122.inputs[p122.pos++] == 37,(p123) => p123.inputs[p123.pos++] == 109 && p123.inputs[p123.pos++] == 111 && p123.inputs[p123.pos++] == 100 && !(bits32(bs5,p123.inputs[p123.pos])))))))))) && tagtree(p131,"Name"),EmptyTag,0) && e16(px);
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
  return not1(px,e20) && newtree(px,0,(p34) => e21(p34) && manychar(p34,bs2) && or1(p34,(p32) => p32.inputs[p32.pos++] == 63,(p33) => true) && tagtree(p34,"Name"),EmptyTag,0) && e16(px);
}

function e36(px){
  return or3(px,(p92) => newtree(p92,0,(p91) => e41(p91) && linktree(p91,"type",e12) && e42(p91) && linktree(p91,"recv",e36) && tagtree(p91,"Cast"),EmptyTag,0),e31);
}

function e37(px){
  return e36(px) && many3(px,(p94) => foldtree(p94,0,"left",(p93) => linktree(p93,"op",e43) && linktree(p93,"right",e36) && tagtree(p93,"Infix"),EmptyTag,0));
}

function e38(px){
  return newtree(px,0,(p101) => or1(p101,(p95) => p95.inputs[p95.pos++] == 43 && p95.inputs[p95.pos++] == 43,(p100) => or1(p100,(p96) => p96.inputs[p96.pos++] == 43,(p99) => or1(p99,(p97) => p97.inputs[p97.pos++] == 45,(p98) => p98.inputs[p98.pos++] == 124 && !(p98.inputs[p98.pos] == 124)))) && tagtree(p101,"Name"),EmptyTag,0) && e16(px);
}

function e32(px){
  return e37(px) && many3(px,(p67) => foldtree(p67,0,"left",(p66) => linktree(p66,"op",e38) && linktree(p66,"right",e37) && tagtree(p66,"Infix"),EmptyTag,0));
}

function e29(px){
  return e32(px) && many3(px,(p57) => foldtree(p57,0,"left",(p56) => linktree(p56,"op",e33) && linktree(p56,"right",e32) && tagtree(p56,"Infix"),EmptyTag,0));
}

function e22(px){
  return e29(px) && many3(px,(p50) => foldtree(p50,0,"left",(p49) => linktree(p49,"op",e30) && linktree(p49,"right",e29) && tagtree(p49,"Infix"),EmptyTag,0));
}

function e23(px){
  return newtree(px,0,(p53) => or1(p53,(p51) => p51.inputs[p51.pos++] == 111 && p51.inputs[p51.pos++] == 114 && !(bits32(bs5,p51.inputs[p51.pos])),(p52) => p52.inputs[p52.pos++] == 124 && p52.inputs[p52.pos++] == 124 && !(p52.inputs[p52.pos] == 124)) && tagtree(p53,"Name"),EmptyTag,0) && px.inputs[px.pos++] == 95 && px.inputs[px.pos++] == 227 && px.inputs[px.pos++] == 128 && px.inputs[px.pos++] == 128;
}

function e14(px){
  return e22(px) && many3(px,(p36) => foldtree(p36,0,"left",(p35) => linktree(p35,"op",e23) && linktree(p35,"right",e22) && tagtree(p35,"Infix"),EmptyTag,0));
}

function e50(px){
  return newtree(px,0,(p159) => or3(p159,(p156) => linktree(p156,"",e14),(p157) => true) && many3(p159,(p158) => e15(p158) && linktree(p158,"",e14)),EmptyTag,0);
}

function e24(px){
  return !(bits32(bs5,px.inputs[px.pos])) && e16(px);
}

function e53(px){
  return or1(px,(p160) => p160.inputs[p160.pos++] == 116 && p160.inputs[p160.pos++] == 111 && e24(p160),(p163) => or1(p163,(p161) => p161.inputs[p161.pos++] == 97 && p161.inputs[p161.pos++] == 115 && e24(p161),(p162) => p162.inputs[p162.pos++] == 61 && p162.inputs[p162.pos++] == 62 && e16(p162)));
}

function e52(px){
  return px.inputs[px.pos++] == 93 && e16(px);
}

function e40(px){
  return or3(px,(p109) => p109.inputs[p109.pos++] == 46 && e16(p109) && linktree(p109,"name",e12) && or3(p109,(p107) => e41(p107) && linktree(p107,"param",e50) && e42(p107) && tagtree(p107,"Method"),(p108) => tagtree(p108,"Get")),(p114) => or3(p114,(p110) => e41(p110) && linktree(p110,"param",e50) && e42(p110) && tagtree(p110,"Apply"),(p113) => or3(p113,(p111) => e51(p111) && linktree(p111,"param",e50) && e52(p111) && tagtree(p111,"Index"),(p112) => e53(p112) && linktree(p112,"type",e12) && tagtree(p112,"CastExpr"))));
}

function e44(px){
  return e41(px) && e14(px) && or3(px,(p134) => foldtree(p134,0,"",(p133) => e15(p133) && linktree(p133,"",e14) && many3(p133,(p132) => e15(p132) && linktree(p132,"",e14)) && tagtree(p133,"Tuple"),EmptyTag,0),(p135) => true) && e42(px);
}

function e46(px){
  return newtree(px,0,(p140) => e51(p140) && or3(p140,(p137) => linktree(p137,"",e14),(p138) => true) && many3(p140,(p139) => e15(p139) && many1(p139,e15) && linktree(p139,"",e14)) && many1(p140,e15) && e52(p140) && tagtree(p140,"List"),EmptyTag,0);
}

function e45(px){
  return newtree(px,0,(p136) => e41(p136) && e42(p136) && tagtree(p136,"Empty"),EmptyTag,0) && e16(px);
}

function e54(px){
  return px.inputs[px.pos++] == 123 && e16(px);
}

function e57(px){
  return px.inputs[px.pos++] == 125 && e16(px);
}

function e71(px){
  return or1(px,e77,(p218) => bits32(bs11,p218.inputs[p218.pos++]));
}

function e61(px){
  return px.inputs[px.pos++] == 39 && newtree(px,0,(p179) => many1(p179,e71) && tagtree(p179,"Char"),EmptyTag,0) && px.inputs[px.pos++] == 39 && e16(px);
}

function e70(px){
  return or1(px,e77,(p217) => bits32(bs10,p217.inputs[p217.pos++]));
}

function e60(px){
  return px.inputs[px.pos++] == 34 && newtree(px,0,(p178) => many1(p178,e70) && tagtree(p178,"String"),EmptyTag,0) && px.inputs[px.pos++] == 34 && e16(px);
}

function e58(px){
  return newtree(px,0,(p175) => linktree(p175,"name",(p170) => or3(p170,e60,e61)) && or1(p175,(p171) => p171.inputs[p171.pos++] == 58,(p174) => or1(p174,(p172) => p172.inputs[p172.pos++] == 61,(p173) => p173.inputs[p173.pos++] == 61 && p173.inputs[p173.pos++] == 62)) && e16(p175) && linktree(p175,"value",e14),EmptyTag,0);
}

function e48(px){
  return newtree(px,0,(p147) => e54(p147) && linktree(p147,"",e58) && many3(p147,(p146) => e15(p146) && linktree(p146,"",e58)) && tagtree(p147,"Dict") && e57(p147),EmptyTag,0);
}

function e55(px){
  return newtree(px,0,(p164) => p164.inputs[p164.pos++] == 35 && linktree(p164,"name",e12),EmptyTag,0);
}

function e56(px){
  return newtree(px,0,(p169) => linktree(p169,"name",e12) && or1(p169,(p165) => p165.inputs[p165.pos++] == 58,(p168) => or1(p168,(p166) => p166.inputs[p166.pos++] == 61,(p167) => p167.inputs[p167.pos++] == 61 && p167.inputs[p167.pos++] == 62)) && e16(p169) && linktree(p169,"value",e14),EmptyTag,0);
}

function e47(px){
  return newtree(px,0,(p145) => e54(p145) && many3(p145,(p143) => linktree(p143,"",(p142) => e55(p142) && or1(p142,e15,(p141) => true))) && linktree(p145,"",e56) && many3(p145,(p144) => e15(p144) && linktree(p144,"",e56)) && tagtree(p145,"Data") && e57(p145),EmptyTag,0);
}

function e62(px){
  return px.inputs[px.pos++] == 60 && newtree(px,0,(p180) => many1(p180,e72) && tagtree(p180,"Image"),EmptyTag,0) && px.inputs[px.pos++] == 62 && e16(px);
}

function e74(px){
  return or1(px,(p223) => p223.inputs[p223.pos++] == 48 && !(bits32(bs14,p223.inputs[p223.pos])),(p225) => bits32(bs15,p225.inputs[p225.pos++]) && many1(p225,(p224) => manychar(p224,bs16) && bits32(bs13,p224.inputs[p224.pos++])));
}

function e64(px){
  return newtree(px,0,(p185) => e74(p185) && p185.inputs[p185.pos++] == 47 && e74(p185) && tagtree(p185,"Rational"),EmptyTag,0) && e16(px) && or3(px,(p187) => foldtree(p187,0,"",(p186) => linktree(p186,"",e12) && tagtree(p186,"Unit"),EmptyTag,0),(p188) => true);
}

function e63(px){
  return newtree(px,0,(p181) => e73(p181) && tagtree(p181,"Double"),EmptyTag,0) && e16(px) && or3(px,(p183) => foldtree(p183,0,"",(p182) => linktree(p182,"",e12) && tagtree(p182,"Unit"),EmptyTag,0),(p184) => true);
}

function e66(px){
  return newtree(px,0,(p196) => bits32(bs7,p196.inputs[p196.pos++]) && p196.inputs[p196.pos++] == 114 && p196.inputs[p196.pos++] == 117 && p196.inputs[p196.pos++] == 101 && or1(p196,(p194) => bits32(bs5,p194.inputs[p194.pos]) && !(bits32(bs5,p194.inputs[p194.pos])),(p195) => true) && tagtree(p196,"True"),EmptyTag,0) && e16(px);
}

function e75(px){
  return px.inputs[px.pos++] == 48 && bits32(bs17,px.inputs[px.pos++]) && bits32(bs18,px.inputs[px.pos++]) && many1(px,(p226) => manychar(p226,bs16) && bits32(bs18,p226.inputs[p226.pos++]));
}

function e76(px){
  return px.inputs[px.pos++] == 48 && bits32(bs19,px.inputs[px.pos++]) && bits32(bs20,px.inputs[px.pos++]) && many1(px,(p227) => manychar(p227,bs16) && bits32(bs20,p227.inputs[p227.pos++]));
}

function e65(px){
  return newtree(px,0,(p190) => or1(p190,e74,(p189) => or1(p189,e75,e76)) && tagtree(p190,"Int"),EmptyTag,0) && e16(px) && or3(px,(p192) => foldtree(p192,0,"",(p191) => linktree(p191,"",e12) && tagtree(p191,"Unit"),EmptyTag,0),(p193) => true);
}

function e68(px){
  return newtree(px,0,(p210) => bits32(bs9,p210.inputs[p210.pos++]) && or1(p210,(p200) => p200.inputs[p200.pos++] == 117 && p200.inputs[p200.pos++] == 108 && p200.inputs[p200.pos++] == 108,(p207) => or1(p207,(p201) => p201.inputs[p201.pos++] == 111 && p201.inputs[p201.pos++] == 110 && p201.inputs[p201.pos++] == 101,(p206) => or1(p206,(p202) => p202.inputs[p202.pos++] == 105 && p202.inputs[p202.pos++] == 108,(p205) => or1(p205,(p203) => p203.inputs[p203.pos++] == 85 && p203.inputs[p203.pos++] == 76 && p203.inputs[p203.pos++] == 76,(p204) => p204.inputs[p204.pos++] == 111 && p204.inputs[p204.pos++] == 116 && p204.inputs[p204.pos++] == 104 && p204.inputs[p204.pos++] == 105 && p204.inputs[p204.pos++] == 110 && p204.inputs[p204.pos++] == 103)))) && or1(p210,(p208) => bits32(bs5,p208.inputs[p208.pos]) && !(bits32(bs5,p208.inputs[p208.pos])),(p209) => true) && tagtree(p210,"Null"),EmptyTag,0) && e16(px);
}

function e67(px){
  return newtree(px,0,(p199) => bits32(bs8,p199.inputs[p199.pos++]) && p199.inputs[p199.pos++] == 97 && p199.inputs[p199.pos++] == 108 && p199.inputs[p199.pos++] == 115 && p199.inputs[p199.pos++] == 101 && or1(p199,(p197) => bits32(bs5,p197.inputs[p197.pos]) && !(bits32(bs5,p197.inputs[p197.pos])),(p198) => true) && tagtree(p199,"False"),EmptyTag,0) && e16(px);
}

function e69(px){
  return or3(px,(p211) => p211.inputs[p211.pos++] == 36 && p211.inputs[p211.pos++] == 123 && e14(p211) && p211.inputs[p211.pos++] == 125,(p216) => newtree(p216,0,(p215) => many1(p215,(p214) => not1(p214,(p212) => p212.inputs[p212.pos++] == 39 && p212.inputs[p212.pos++] == 39 && p212.inputs[p212.pos++] == 39) && not1(p214,(p213) => p213.inputs[p213.pos++] == 36 && p213.inputs[p213.pos++] == 123) && p214.pos < p214.length && mnext1(p214)) && tagtree(p215,"String"),EmptyTag,0));
}

function e59(px){
  return px.inputs[px.pos++] == 39 && px.inputs[px.pos++] == 39 && px.inputs[px.pos++] == 39 && newtree(px,0,(p177) => many11(p177,(p176) => linktree(p176,"",e69)) && tagtree(p177,"Template"),EmptyTag,0) && px.inputs[px.pos++] == 39 && px.inputs[px.pos++] == 39 && px.inputs[px.pos++] == 39;
}

function e49(px){
  return or3(px,e59,(p155) => or3(p155,e60,(p154) => or3(p154,e61,(p153) => or3(p153,e62,(p152) => or3(p152,e63,(p151) => or3(p151,e64,(p150) => or3(p150,e65,(p149) => or3(p149,e66,(p148) => or3(p148,e67,e68)))))))));
}

function e39(px){
  return or3(px,e44,(p106) => or3(p106,e45,(p105) => or3(p105,e46,(p104) => or3(p104,e47,(p103) => or3(p103,e48,(p102) => or3(p102,e49,e12))))));
}

function e34(px){
  return e39(px) && many3(px,(p83) => foldtree(p83,0,"recv",e40,EmptyTag,0));
}

function e31(px){
  return or3(px,e34,(p65) => or3(p65,(p62) => newtree(p62,0,(p61) => linktree(p61,"op",e35) && linktree(p61,"expr",e36) && tagtree(p61,"Unary"),EmptyTag,0),(p64) => newtree(p64,0,(p63) => p63.inputs[p63.pos++] == 124 && e16(p63) && linktree(p63,"expr",e14) && p63.inputs[p63.pos++] == 124 && tagtree(p63,"Norm"),EmptyTag,0) && e16(p64)));
}

function e13(px){
  return px.inputs[px.pos++] == 61 && e16(px);
}

function e7(px){
  return newtree(px,0,(p18) => linktree(p18,"left",e12) && e13(p18) && linktree(p18,"right",e14) && tagtree(p18,"Let"),EmptyTag,0);
}

function e26(px){
  return newtree(px,0,(p55) => p55.inputs[p55.pos++] == 36 && linktree(p55,"left",e31) && e13(p55) && linktree(p55,"right",e14) && tagtree(p55,"Assign"),EmptyTag,0);
}

function e25(px){
  return newtree(px,0,(p54) => p54.inputs[p54.pos++] == 61 && p54.inputs[p54.pos++] == 62 && e16(p54) && linktree(p54,"expr",e14) && tagtree(p54,"Return"),EmptyTag,0);
}

function e19(px){
  return or3(px,e25,(p48) => or3(p48,e26,e7));
}

function e18(px){
  return bits32(bs3,px.inputs[px.pos++]) && manychar(px,bs3);
}

function e11(px){
  return newtree(px,0,(p31) => linktree(p31,"",(p28) => e18(p28) && e19(p28) && e8(p28)) && many3(p31,(p30) => linktree(p30,"",(p29) => e18(p29) && e19(p29) && e8(p29))) && tagtree(p31,"Body"),EmptyTag,0);
}

function e17(px){
  return or3(px,(p41) => newtree(p41,0,(p40) => p40.inputs[p40.pos++] == 102 && p40.inputs[p40.pos++] == 111 && p40.inputs[p40.pos++] == 114 && p40.inputs[p40.pos++] == 101 && p40.inputs[p40.pos++] == 97 && p40.inputs[p40.pos++] == 99 && p40.inputs[p40.pos++] == 104 && e24(p40) && linktree(p40,"",e12) && p40.inputs[p40.pos++] == 115 && p40.inputs[p40.pos++] == 111 && p40.inputs[p40.pos++] == 109 && p40.inputs[p40.pos++] == 101 && linktree(p40,"",e12) && tagtree(p40,"PeriodicSome"),EmptyTag,0),(p47) => or3(p47,(p44) => newtree(p44,0,(p43) => p43.inputs[p43.pos++] == 102 && p43.inputs[p43.pos++] == 111 && p43.inputs[p43.pos++] == 114 && p43.inputs[p43.pos++] == 101 && p43.inputs[p43.pos++] == 97 && p43.inputs[p43.pos++] == 99 && p43.inputs[p43.pos++] == 104 && e24(p43) && linktree(p43,"",e12) && many3(p43,(p42) => e15(p42) && linktree(p42,"",e12)) && tagtree(p43,"Periodic"),EmptyTag,0),(p46) => newtree(p46,0,(p45) => p45.inputs[p45.pos++] == 119 && p45.inputs[p45.pos++] == 104 && p45.inputs[p45.pos++] == 101 && p45.inputs[p45.pos++] == 110 && e24(p45) && linktree(p45,"",e14) && tagtree(p45,"Event"),EmptyTag,0)));
}

function e10(px){
  return newtree(px,0,(p27) => linktree(p27,"",(p24) => or3(p24,e17,e14)) && many3(p27,(p26) => e16(p26) && or1(p26,e15,(p25) => true) && linktree(p26,"",e14)) && tagtree(p27,"Premise"),EmptyTag,0);
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
    
