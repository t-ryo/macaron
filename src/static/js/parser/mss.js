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
const bs1 = [0,128,0,0,0,0,0,0]
const bs2 = [0,0,1048576,1048576,0,0,0,0]
const bs3 = [0,67043328,-2013265922,134217726,-1,-1,-1,16777215]
const bs4 = [0,0,64,64,0,0,0,0]
const bs5 = [0,0,-2013265922,134217726,-1,-1,-1,16777215]
const bs6 = [512,1,0,0,0,0,0,0]
const bs7 = [-1025,-5,-268435457,-1,-1,-1,-1,-1]
const bs8 = [0,67043328,0,0,0,0,0,0]
const bs9 = [0,132,268435456,1327172,0,0,0,0]
const bs10 = [0,983040,0,0,0,0,0,0]
const bs11 = [0,16711680,0,0,0,0,0,0]
const bs12 = [0,0,0,2097152,0,0,0,0]
const bs13 = [0,67043328,126,126,0,0,0,0]
const bs14 = [0,0,-2147483648,0,0,0,0,0]
const bs15 = [0,0,32,32,0,0,0,0]
const bs16 = [0,10240,0,0,0,0,0,0]
const bs17 = [0,67043328,-2130706428,16777220,0,0,0,0]
const bs18 = [0,66977792,0,0,0,0,0,0]
const bs19 = [0,0,16777216,16777216,0,0,0,0]
const bs20 = [0,0,4,4,0,0,0,0]
const bs21 = [0,196608,0,0,0,0,0,0]
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

function e3(px){
  return !(px.pos < px.length);
}

function e8(px){
  return or1(px,(p19) => or1(p19,(p17) => p17.inputs[p17.pos++] == 13,(p18) => true) && p19.inputs[p19.pos++] == 10,e3);
}

function e5(px){
  return px.inputs[px.pos++] == 47 && px.inputs[px.pos++] == 47 && many1(px,(p12) => not1(p12,e8) && p12.pos < p12.length && mnext1(p12)) && e8(px);
}

function e4(px){
  return or1(px,(p8) => p8.inputs[p8.pos++] == 47 && p8.inputs[p8.pos++] == 42 && many1(p8,(p7) => not1(p7,(p6) => p6.inputs[p6.pos++] == 42 && p6.inputs[p6.pos++] == 47) && p7.pos < p7.length && mnext1(p7)) && p8.inputs[p8.pos++] == 42 && p8.inputs[p8.pos++] == 47,(p11) => p11.inputs[p11.pos++] == 40 && p11.inputs[p11.pos++] == 42 && many1(p11,(p10) => not1(p10,(p9) => p9.inputs[p9.pos++] == 42 && p9.inputs[p9.pos++] == 41) && p10.pos < p10.length && mnext1(p10)) && p11.inputs[p11.pos++] == 42 && p11.inputs[p11.pos++] == 41);
}

function e26(px){
  return many1(px,(p63) => or1(p63,(p61) => bits32(bs6,p61.inputs[p61.pos++]),(p62) => or1(p62,e4,e5)));
}

function e31(px){
  return px.inputs[px.pos++] == 105 && px.inputs[px.pos++] == 115 && px.inputs[px.pos++] == 83 && px.inputs[px.pos++] == 116 && px.inputs[px.pos++] == 97 && px.inputs[px.pos++] == 116 && px.inputs[px.pos++] == 105 && px.inputs[px.pos++] == 99 && e26(px);
}

function e51(px){
  return px.inputs[px.pos++] == 115 && px.inputs[px.pos++] == 108 && px.inputs[px.pos++] == 111 && px.inputs[px.pos++] == 112 && px.inputs[px.pos++] == 101 && e26(px);
}

function e50(px){
  return px.inputs[px.pos++] == 116 && px.inputs[px.pos++] == 114 && px.inputs[px.pos++] == 97 && px.inputs[px.pos++] == 112 && px.inputs[px.pos++] == 101 && px.inputs[px.pos++] == 122 && px.inputs[px.pos++] == 111 && px.inputs[px.pos++] == 105 && px.inputs[px.pos++] == 100 && e26(px);
}

function e55(px){
  return or1(px,(p93) => p93.inputs[p93.pos++] == 48 && !(bits32(bs17,p93.inputs[p93.pos])),(p95) => bits32(bs18,p95.inputs[p95.pos++]) && many1(p95,(p94) => manychar(p94,bs14) && bits32(bs8,p94.inputs[p94.pos++])));
}

function e57(px){
  return px.inputs[px.pos++] == 48 && bits32(bs20,px.inputs[px.pos++]) && bits32(bs21,px.inputs[px.pos++]) && many1(px,(p97) => manychar(p97,bs14) && bits32(bs21,p97.inputs[p97.pos++]));
}

function e56(px){
  return px.inputs[px.pos++] == 48 && bits32(bs19,px.inputs[px.pos++]) && bits32(bs13,px.inputs[px.pos++]) && many1(px,(p96) => manychar(p96,bs14) && bits32(bs13,p96.inputs[p96.pos++]));
}

function e25(px){
  return bits32(bs5,px.inputs[px.pos++]) && manychar(px,bs3);
}

function e14(px){
  return newtree(px,0,(p30) => e25(p30) && manychar(p30,bs1) && or1(p30,(p28) => p28.inputs[p28.pos++] == 63,(p29) => true) && tagtree(p30,"Name"),EmptyTag,0) && e26(px);
}

function e42(px){
  return newtree(px,0,(p73) => or1(p73,e55,(p72) => or1(p72,e56,e57)) && tagtree(p73,"Int"),EmptyTag,0) && e26(px) && or3(px,(p75) => foldtree(p75,0,"",(p74) => linktree(p74,"",e14) && tagtree(p74,"Unit"),EmptyTag,0),(p76) => true);
}

function e41(px){
  return px.inputs[px.pos++] == 120 && px.inputs[px.pos++] == 112 && px.inputs[px.pos++] == 111 && px.inputs[px.pos++] == 115 && e26(px);
}

function e43(px){
  return px.inputs[px.pos++] == 121 && px.inputs[px.pos++] == 112 && px.inputs[px.pos++] == 111 && px.inputs[px.pos++] == 115 && e26(px);
}

function e53(px){
  return or1(px,(p87) => !(p87.inputs[p87.pos] == 95) && many1(p87,(p85) => manychar(p85,bs14) && bits32(bs8,p85.inputs[p85.pos++])) && p87.inputs[p87.pos++] == 46 && bits32(bs8,p87.inputs[p87.pos++]) && many1(p87,(p86) => manychar(p86,bs14) && bits32(bs8,p86.inputs[p86.pos++])),(p89) => bits32(bs8,p89.inputs[p89.pos++]) && many1(p89,(p88) => manychar(p88,bs14) && bits32(bs8,p88.inputs[p88.pos++])) && p89.inputs[p89.pos++] == 46 && !(p89.inputs[p89.pos] == 46));
}

function e54(px){
  return bits32(bs15,px.inputs[px.pos++]) && or1(px,(p90) => bits32(bs16,p90.inputs[p90.pos++]),(p91) => true) && bits32(bs8,px.inputs[px.pos++]) && many1(px,(p92) => manychar(p92,bs14) && bits32(bs8,p92.inputs[p92.pos++]));
}

function e38(px){
  return or1(px,(p70) => e53(p70) && or1(p70,e54,(p69) => true),(p71) => bits32(bs8,p71.inputs[p71.pos++]) && manychar(p71,bs8) && e54(p71));
}

function e24(px){
  return newtree(px,0,(p57) => e38(p57) && tagtree(p57,"Double"),EmptyTag,0) && e26(px) && or3(px,(p59) => foldtree(p59,0,"",(p58) => linktree(p58,"",e14) && tagtree(p58,"Unit"),EmptyTag,0),(p60) => true);
}

function e1(px){
  return many1(px,(p5) => or1(p5,(p3) => bits32(bs0,p3.inputs[p3.pos++]),(p4) => or1(p4,e4,e5)));
}

function e12(px){
  return px.inputs[px.pos++] == 44 && e1(px);
}

function e48(px){
  return px.inputs[px.pos++] == 119 && px.inputs[px.pos++] == 105 && px.inputs[px.pos++] == 100 && px.inputs[px.pos++] == 116 && px.inputs[px.pos++] == 104 && e26(px);
}

function e39(px){
  return px.inputs[px.pos++] == 116 && px.inputs[px.pos++] == 121 && px.inputs[px.pos++] == 112 && px.inputs[px.pos++] == 101 && e26(px);
}

function e49(px){
  return px.inputs[px.pos++] == 104 && px.inputs[px.pos++] == 101 && px.inputs[px.pos++] == 105 && px.inputs[px.pos++] == 103 && px.inputs[px.pos++] == 104 && px.inputs[px.pos++] == 116 && e26(px);
}

function e18(px){
  return px.inputs[px.pos++] == 58 && e26(px);
}

function e30(px){
  return newtree(px,0,(p67) => e39(p67) && e18(p67) && e50(p67) && e26(p67) && e12(p67) && e41(p67) && e18(p67) && linktree(p67,"xpos",e42) && e26(p67) && e12(p67) && e43(p67) && e18(p67) && linktree(p67,"ypos",e42) && e26(p67) && e12(p67) && e48(p67) && e18(p67) && linktree(p67,"width",e42) && e26(p67) && e12(p67) && e49(p67) && e18(p67) && linktree(p67,"height",e42) && e26(p67) && e12(p67) && e51(p67) && e18(p67) && linktree(p67,"slope",e24) && tagtree(p67,"Trapezoid"),EmptyTag,0);
}

function e33(px){
  return px.inputs[px.pos++] == 102 && px.inputs[px.pos++] == 114 && px.inputs[px.pos++] == 105 && px.inputs[px.pos++] == 99 && px.inputs[px.pos++] == 116 && px.inputs[px.pos++] == 105 && px.inputs[px.pos++] == 111 && px.inputs[px.pos++] == 110 && e26(px);
}

function e32(px){
  return px.inputs[px.pos++] == 100 && px.inputs[px.pos++] == 101 && px.inputs[px.pos++] == 110 && px.inputs[px.pos++] == 115 && px.inputs[px.pos++] == 105 && px.inputs[px.pos++] == 116 && px.inputs[px.pos++] == 121 && e26(px);
}

function e35(px){
  return px.inputs[px.pos++] == 114 && px.inputs[px.pos++] == 101 && px.inputs[px.pos++] == 115 && px.inputs[px.pos++] == 116 && px.inputs[px.pos++] == 105 && px.inputs[px.pos++] == 116 && px.inputs[px.pos++] == 117 && px.inputs[px.pos++] == 116 && px.inputs[px.pos++] == 105 && px.inputs[px.pos++] == 111 && px.inputs[px.pos++] == 110 && e26(px);
}

function e34(px){
  return px.inputs[px.pos++] == 102 && px.inputs[px.pos++] == 114 && px.inputs[px.pos++] == 105 && px.inputs[px.pos++] == 99 && px.inputs[px.pos++] == 116 && px.inputs[px.pos++] == 105 && px.inputs[px.pos++] == 111 && px.inputs[px.pos++] == 110 && px.inputs[px.pos++] == 65 && px.inputs[px.pos++] == 105 && px.inputs[px.pos++] == 114 && e26(px);
}

function e52(px){
  return or1(px,(p77) => p77.inputs[p77.pos++] == 92 && bits32(bs9,p77.inputs[p77.pos++]),(p84) => or1(p84,(p78) => p78.inputs[p78.pos++] == 92 && bits32(bs10,p78.inputs[p78.pos++]) && bits32(bs11,p78.inputs[p78.pos++]) && bits32(bs11,p78.inputs[p78.pos++]),(p83) => or1(p83,(p79) => p79.inputs[p79.pos++] == 92 && bits32(bs11,p79.inputs[p79.pos++]) && bits32(bs11,p79.inputs[p79.pos++]),(p82) => or1(p82,(p80) => p80.inputs[p80.pos++] == 92 && bits32(bs11,p80.inputs[p80.pos++]),(p81) => p81.inputs[p81.pos++] == 92 && p81.inputs[p81.pos++] == 117 && manychar(p81,bs12) && bits32(bs13,p81.inputs[p81.pos++]) && bits32(bs13,p81.inputs[p81.pos++]) && bits32(bs13,p81.inputs[p81.pos++]) && bits32(bs13,p81.inputs[p81.pos++])))));
}

function e37(px){
  return or1(px,e52,(p68) => bits32(bs7,p68.inputs[p68.pos++]));
}

function e36(px){
  return px.inputs[px.pos++] == 105 && px.inputs[px.pos++] == 109 && px.inputs[px.pos++] == 97 && px.inputs[px.pos++] == 103 && px.inputs[px.pos++] == 101 && e26(px);
}

function e40(px){
  return px.inputs[px.pos++] == 99 && px.inputs[px.pos++] == 105 && px.inputs[px.pos++] == 114 && px.inputs[px.pos++] == 99 && px.inputs[px.pos++] == 108 && px.inputs[px.pos++] == 101 && e26(px);
}

function e44(px){
  return px.inputs[px.pos++] == 114 && px.inputs[px.pos++] == 97 && px.inputs[px.pos++] == 100 && px.inputs[px.pos++] == 105 && px.inputs[px.pos++] == 117 && px.inputs[px.pos++] == 115 && e26(px);
}

function e46(px){
  return px.inputs[px.pos++] == 115 && px.inputs[px.pos++] == 105 && px.inputs[px.pos++] == 100 && px.inputs[px.pos++] == 101 && px.inputs[px.pos++] == 115 && e26(px);
}

function e45(px){
  return px.inputs[px.pos++] == 112 && px.inputs[px.pos++] == 111 && px.inputs[px.pos++] == 108 && px.inputs[px.pos++] == 121 && px.inputs[px.pos++] == 103 && px.inputs[px.pos++] == 111 && px.inputs[px.pos++] == 110 && e26(px);
}

function e47(px){
  return px.inputs[px.pos++] == 114 && px.inputs[px.pos++] == 101 && px.inputs[px.pos++] == 99 && px.inputs[px.pos++] == 116 && px.inputs[px.pos++] == 97 && px.inputs[px.pos++] == 110 && px.inputs[px.pos++] == 103 && px.inputs[px.pos++] == 108 && px.inputs[px.pos++] == 101 && e26(px);
}

function e20(px){
  return newtree(px,0,(p55) => bits32(bs4,p55.inputs[p55.pos++]) && p55.inputs[p55.pos++] == 97 && p55.inputs[p55.pos++] == 108 && p55.inputs[p55.pos++] == 115 && p55.inputs[p55.pos++] == 101 && or1(p55,(p53) => bits32(bs3,p53.inputs[p53.pos]) && !(bits32(bs3,p53.inputs[p53.pos])),(p54) => true) && tagtree(p55,"False"),EmptyTag,0) && e26(px);
}

function e22(px){
  return px.inputs[px.pos++] == 34 && newtree(px,0,(p56) => many1(p56,e37) && tagtree(p56,"String"),EmptyTag,0) && px.inputs[px.pos++] == 34 && e26(px);
}

function e21(px){
  return px.inputs[px.pos++] == 98 && px.inputs[px.pos++] == 97 && px.inputs[px.pos++] == 99 && px.inputs[px.pos++] == 107 && px.inputs[px.pos++] == 103 && px.inputs[px.pos++] == 114 && px.inputs[px.pos++] == 111 && px.inputs[px.pos++] == 117 && px.inputs[px.pos++] == 110 && px.inputs[px.pos++] == 100 && e26(px);
}

function e23(px){
  return px.inputs[px.pos++] == 103 && px.inputs[px.pos++] == 114 && px.inputs[px.pos++] == 97 && px.inputs[px.pos++] == 118 && px.inputs[px.pos++] == 105 && px.inputs[px.pos++] == 116 && px.inputs[px.pos++] == 121 && e26(px);
}

function e17(px){
  return px.inputs[px.pos++] == 119 && px.inputs[px.pos++] == 105 && px.inputs[px.pos++] == 114 && px.inputs[px.pos++] == 101 && px.inputs[px.pos++] == 102 && px.inputs[px.pos++] == 114 && px.inputs[px.pos++] == 97 && px.inputs[px.pos++] == 109 && px.inputs[px.pos++] == 101 && px.inputs[px.pos++] == 115 && e26(px);
}

function e19(px){
  return newtree(px,0,(p52) => bits32(bs2,p52.inputs[p52.pos++]) && p52.inputs[p52.pos++] == 114 && p52.inputs[p52.pos++] == 117 && p52.inputs[p52.pos++] == 101 && or1(p52,(p50) => bits32(bs3,p50.inputs[p50.pos]) && !(bits32(bs3,p50.inputs[p50.pos])),(p51) => true) && tagtree(p52,"True"),EmptyTag,0) && e26(px);
}

function e11(px){
  return or3(px,(p22) => newtree(p22,0,(p21) => e17(p21) && e18(p21) && linktree(p21,"wireframes",(p20) => or3(p20,e19,e20)) && tagtree(p21,"WireFrames"),EmptyTag,0),(p27) => or3(p27,(p24) => newtree(p24,0,(p23) => e21(p23) && e18(p23) && linktree(p23,"background",e22) && tagtree(p23,"Background"),EmptyTag,0),(p26) => newtree(p26,0,(p25) => e23(p25) && e18(p25) && linktree(p25,"gravity",e24) && tagtree(p25,"Gravity"),EmptyTag,0)));
}

function e10(px){
  return px.inputs[px.pos++] == 123 && e1(px);
}

function e13(px){
  return px.inputs[px.pos++] == 125 && e1(px);
}

function e28(px){
  return newtree(px,0,(p65) => e39(p65) && e18(p65) && e45(p65) && e26(p65) && e12(p65) && e41(p65) && e18(p65) && linktree(p65,"xpos",e42) && e26(p65) && e12(p65) && e43(p65) && e18(p65) && linktree(p65,"ypos",e42) && e26(p65) && e12(p65) && e46(p65) && e18(p65) && linktree(p65,"sides",e42) && e26(p65) && e12(p65) && e44(p65) && e18(p65) && linktree(p65,"radius",e42) && tagtree(p65,"Polygon"),EmptyTag,0);
}

function e27(px){
  return newtree(px,0,(p64) => e39(p64) && e18(p64) && e40(p64) && e26(p64) && e12(p64) && e41(p64) && e18(p64) && linktree(p64,"xpos",e42) && e26(p64) && e12(p64) && e43(p64) && e18(p64) && linktree(p64,"ypos",e42) && e26(p64) && e12(p64) && e44(p64) && e18(p64) && linktree(p64,"radius",e42) && tagtree(p64,"Circle"),EmptyTag,0);
}

function e29(px){
  return newtree(px,0,(p66) => e39(p66) && e18(p66) && e47(p66) && e26(p66) && e12(p66) && e41(p66) && e18(p66) && linktree(p66,"xpos",e42) && e26(p66) && e12(p66) && e43(p66) && e18(p66) && linktree(p66,"ypos",e42) && e26(p66) && e12(p66) && e48(p66) && e18(p66) && linktree(p66,"width",e42) && e26(p66) && e12(p66) && e49(p66) && e18(p66) && linktree(p66,"height",e42) && tagtree(p66,"Rectangle"),EmptyTag,0);
}

function e15(px){
  return or3(px,e27,(p32) => or3(p32,e28,(p31) => or3(p31,e29,e30)));
}

function e16(px){
  return or3(px,(p35) => newtree(p35,0,(p34) => e31(p34) && e18(p34) && linktree(p34,"isStatic",(p33) => or3(p33,e19,e20)) && tagtree(p34,"IsStatic"),EmptyTag,0),(p49) => or3(p49,(p37) => newtree(p37,0,(p36) => e32(p36) && e18(p36) && linktree(p36,"density",e24) && tagtree(p36,"Density"),EmptyTag,0),(p48) => or3(p48,(p39) => newtree(p39,0,(p38) => e33(p38) && e18(p38) && linktree(p38,"friction",e24) && tagtree(p38,"Friction"),EmptyTag,0),(p47) => or3(p47,(p41) => newtree(p41,0,(p40) => e34(p40) && e18(p40) && linktree(p40,"frictionAir",e24) && tagtree(p40,"FrictionAir"),EmptyTag,0),(p46) => or3(p46,(p43) => newtree(p43,0,(p42) => e35(p42) && e18(p42) && linktree(p42,"restitution",e24) && tagtree(p42,"Restitution"),EmptyTag,0),(p45) => newtree(p45,0,(p44) => e36(p44) && e18(p44) && linktree(p44,"image",e22) && tagtree(p44,"Image"),EmptyTag,0))))));
}

function e9(px){
  return px.inputs[px.pos++] == 119 && px.inputs[px.pos++] == 111 && px.inputs[px.pos++] == 114 && px.inputs[px.pos++] == 108 && px.inputs[px.pos++] == 100 && e1(px);
}

function e6(px){
  return newtree(px,0,(p14) => e9(p14) && e10(p14) && linktree(p14,"",e11) && e1(p14) && many3(p14,(p13) => e12(p13) && linktree(p13,"",e11) && e1(p13)) && e13(p14) && tagtree(p14,"World"),EmptyTag,0);
}

function e7(px){
  return newtree(px,0,(p16) => linktree(p16,"name",e14) && e1(p16) && e10(p16) && linktree(p16,"",e15) && e1(p16) && many3(p16,(p15) => e12(p15) && linktree(p15,"options",e16) && e1(p15)) && e13(p16) && tagtree(p16,"Object"),EmptyTag,0);
}

function e2(px){
  return or3(px,e6,e7);
}

function e0(px){
  return e1(px) && newtree(px,0,(p2) => many3(p2,(p1) => linktree(p1,"",(p0) => e2(p0) && e1(p0))) && tagtree(p2,"Source"),EmptyTag,0) && e1(px) && e3(px);
}

function parseMSS(inputs,length){
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
    
