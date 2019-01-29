from pegpy.main import load_grammar, switch_generator
from pegpy.origami.expression import Expression

sample = '''正多角形Aについて、
  辺は3とする
  '''

ParamDict = {
   'x':'x',
   'X':'x',
   'x座標': 'x',
   'y':'y',
   'Y':'y',
   'y座標': 'y',
   '半径':'radius',
   '縦': 'height',
   '高さ': 'height',
   '横': 'width',
   '幅': 'width',
   '辺': 'sides',
   '斜辺':'slope',
   '傾き':'slope',
   '車輪':'wheelSize',
   'タイヤ':'wheelSize',
   '列':'columns',
   '列数':'columns',
   '行':'rows',
   '行数':'rows',
   '大きさ':'size',
   '長さ':'length',
   '要素':'elementType',
   '値': 'value',
   'フォント':'font',
   '色': 'color',
   '密度': 'density',
   '摩擦係数': 'friction',
   '静摩擦係数': 'frictionStatic',
   '空気抵抗': 'frictionAir',
   '反発係数': 'restitution',
   '角度': 'angle'
   #    isStatic: false,   /* 静的オブジェクトかどうか */
   #    isSensor: false,   /* コライダーとして扱うか（他のオブジェクトに干渉するか） */
   #    texture: null, /* テクスチャ */
   #    chamfer:{
   #          radius:0
   #    }
}

ObjDict = {
   'ボール':'circle',
   '玉':'circle',
   '球':'circle',
   '球形':'circle',
   '丸':'circle',
   '円':'circle',
   '四角':'rectangle',
   '四角形':'rectangle',
   '箱':'rectangle',
   '正多角形':'polygon',
   '台形':'trapezoid',
   '車':'car',
   'スタック':'stack',
   'ピラミッド':'pyramid',
   '鎖':'chain',
   '振り子':'pendulum',
   '布':'cloth',
   'カタパルト':'slingshot',
   'パチンコ':'slingshot',
   '文字':'text',
   '文字列':'text',
   'テキスト':'text'
   # softbody
}

WorldDict = {
   '全体':'world',
   '設定':'world',
   '世界':'world'
}

WorldParamDict = {
   'マウス':'mouse',
   '壁':'wall',
   '重力':'gravity'
}

ValueDict = {
   '可':'true',
   '不可':'false'
}

# パラメータ
class Obj:
   __slots__ = [
      'name', 
      'type', 
      'x', 
      'y', 
      'radius', 
      'width', 
      'height', 
      'sides',
      'slope',
      'wheelSize',
      'columns',
      'rows',
      'size',
      'length',
      'elementType',
      'value', 
      'color',
      'font',
      'density',
      'friction',
      'frictionStatic',
      'frictionAir',
      'restitution',
      'angle'
      ]
   def __init__(self):
      self.name = ''
      self.type = ''
      self.x = 0
      self.y = 0
      self.radius = 0
      self.width = 0
      self.height = 0
      self.sides = 0
      self.slope = 0
      self.wheelSize = 0
      self.columns = 0
      self.rows = 0
      self.size = 0
      self.length = 0
      self.elementType = ''
      self.value = ''
      self.color = 'white'
      self.font = ''
      # オプション
      self.density = 0.001
      self.friction = 0.1
      self.frictionStatic = 0.5
      self.frictionAir = 0.01
      self.restitution = 0
      self.angle = 0

   #def __str__(self):
   #     return self.code.format(name=self.name, object=self.object, x=self.x, y=self.y, radius=self.radius, width=self.width, height=self.height, value=self.value, color=self.color)

class World:
   __slots__ = [ 
      'mouse', 
      'wall',
      'gravity'
      ]
   def __init__(self):
      self.mouse = 'false'
      self.wall = 'false'
      self.gravity = 1
      

class Environment:
   __slots__ = ['stmts', 'sb', 'objectID', 'definded', 'objs', 'rules', 'world']
   def __init__(self, e, sb = []):
      self.stmts = list(e[1:])
      self.sb = sb
      # TODO self.objectID = 0
      self.definded = [] # 定義済みの名前
      # self.defs = [] # スタイルシート Defクラス
      self.objs = []
      self.rules = [] # js
      self.world = World()

   def __str__(self):
      # FIXME
      return reduce(lambda x, y: x+'\n'+str(y), self.rules, reduce(lambda x, y: x+'\n'+str(y), self.defs, ''))

   def rename(self, name):
      self.objectID += 1
      return name + '@' + str(self.objectID)

   # def add_name(self, name):
   #    if name in self.definded:
   #       raise DefindedError
   #    else:
   #       self.definded.append(name)

   def push(self):
      for stmt in self.stmts:
         # stmt[0]:#tag
         getattr(Rule, str(stmt[0])[1:])(self, stmt[1:])

   def format(self):
      response = self.makeStyleSheet()
      response += self.makeRule()
      return response
   
   def makeStyleSheet(self):
      ss = 'var stylesheet = `{'

      # world
      ss += '"world":{'
      ss += '"mouse":' + str(self.world.mouse) + ','
      ss += '"wall":' + str(self.world.wall) + ','
      ss += '"gravity":' + str(self.world.gravity) + '}'

      for obj in self.objs:
         objType = obj.type

         if objType == 'circle':
            ss += ',"circle":{'
            ss += '"name":"' + str(obj.name) + '",'
            ss += '"x":' + str(obj.x) + ','
            ss += '"y":' + str(obj.y) + ','
            ss += '"radius":' + str(obj.radius) + ','
            ss += self.makeOption(obj) + '}'
         elif objType == 'rectangle':
            ss += ',"rectangle":{'
            ss += '"name":"' + str(obj.name) + '",'
            ss += '"x":' + str(obj.x) + ','
            ss += '"y":' + str(obj.y) + ','
            ss += '"width":' + str(obj.width) + ','
            ss += '"height":' + str(obj.height) + ','
            ss += self.makeOption(obj) + '}'
         elif objType == 'polygon':
            ss += ',"polygon":{'
            ss += '"name":"' + str(obj.name) + '",'
            ss += '"x":' + str(obj.x) + ','
            ss += '"y":' + str(obj.y) + ','
            ss += '"sides":' + str(obj.sides) + ','
            ss += '"radius":' + str(obj.radius) + ','
            ss += self.makeOption(obj) + '}'
         elif objType == 'trapezoid':
            ss += ',"trapezoid":{'
            ss += '"name":"' + str(obj.name) + '",'
            ss += '"x":' + str(obj.x) + ','
            ss += '"y":' + str(obj.y) + ','
            ss += '"width":' + str(obj.width) + ','
            ss += '"height":' + str(obj.height) + ','
            ss += '"slope":' + str(obj.slope) + ','
            ss += self.makeOption(obj) + '}'
         elif objType == 'car':
            ss += ',"car":{'
            ss += '"name":"' + str(obj.name) + '",'
            ss += '"x":' + str(obj.x) + ','
            ss += '"y":' + str(obj.y) + ','
            ss += '"width":' + str(obj.width) + ','
            ss += '"height":' + str(obj.height) + ','
            ss += '"wheelSize":' + str(obj.wheelSize) + ','
            ss += self.makeOption(obj) + '}'
         elif objType == 'stack':
            ss += ',"stack":{'
            ss += '"name":"' + str(obj.name) + '",'
            ss += '"x":' + str(obj.x) + ','
            ss += '"y":' + str(obj.y) + ','
            ss += '"columns":' + str(obj.columns) + ','
            ss += '"rows":' + str(obj.rows) + ','
            ss += '"size":' + str(obj.size) + ','
            ss += '"elementType":"' + str(obj.elementType) + '",'
            ss += self.makeOption(obj) + '}'
         elif objType == 'pyramid':
            ss += ',"pyramid":{'
            ss += '"name":"' + str(obj.name) + '",'
            ss += '"x":' + str(obj.x) + ','
            ss += '"y":' + str(obj.y) + ','
            ss += '"columns":' + str(obj.columns) + ','
            ss += '"rows":' + str(obj.rows) + ','
            ss += '"size":' + str(obj.size) + ','
            ss += '"elementType":"' + str(obj.elementType) + '",'
            ss += self.makeOption(obj) + '}'
         elif objType == 'chain':
            ss += ',"chain":{'
            ss += '"name":"' + str(obj.name) + '",'
            ss += '"x":' + str(obj.x) + ','
            ss += '"y":' + str(obj.y) + ','
            ss += '"length":' + str(obj.length) + ','
            ss += '"size":' + str(obj.size) + ','
            ss += self.makeOption(obj) + '}'
         elif objType == 'pendulum':
            ss += ',"pendulum":{'
            ss += '"name":"' + str(obj.name) + '",'
            ss += '"x":' + str(obj.x) + ','
            ss += '"y":' + str(obj.y) + ','
            ss += '"columns":' + str(obj.columns) + ','
            ss += '"radius":' + str(obj.radius) + ','
            ss += '"length":' + str(obj.length) + ','
            ss += self.makeOption(obj) + '}'
         elif objType == 'cloth':
            ss += ',"cloth":{'
            ss += '"name":"' + str(obj.name) + '",'
            ss += '"x":' + str(obj.x) + ','
            ss += '"y":' + str(obj.y) + ','
            ss += '"width":' + str(obj.width) + ','
            ss += '"height":' + str(obj.height) + ','
            ss += self.makeOption(obj) + '}'
         elif objType == 'slingshot':
            ss += ',"slingshot":{'
            ss += '"name":"' + str(obj.name) + '",'
            ss += '"x":' + str(obj.x) + ','
            ss += '"y":' + str(obj.y) + ','
            ss += self.makeOption(obj) + '}'
         elif objType == 'text':
            ss += ',"text":{'
            ss += '"name":"' + str(obj.name) + '",'
            ss += '"x":' + str(obj.x) + ','
            ss += '"y":' + str(obj.y) + ','
            ss += '"textColor":"' + str(obj.color) + '",'
            ss += '"font":"' + str(obj.font) + '",'
            ss += '"value":"' + str(obj.value) + '"'
         # elif objType == 'constraint':

      ss += '}`\n'
      return ss

   def makeOption(self, obj):
      opt = '"density":' + str(obj.density) + ','
      opt += '"friction":' + str(obj.friction) + ','
      opt += '"frictionStatic":' + str(obj.frictionStatic) + ','
      opt += '"frictionAir":' + str(obj.frictionAir) + ','
      opt += '"restitution":' + str(obj.restitution) + ','
      opt += '"angle":' + str(obj.angle)
      return opt

   def makeRule(self):
      return 'function myRule(){}'


class Rule:
   def Definition(env, args):
      if str(args[0]) in WorldDict:
         newWorld = env.world
         args = args[1:]
         for arg in args:
            newWorld = getattr(Rule, 'World' + str(arg[0][1:]))(env, newWorld, arg[1:])
         # TODO world以外で #Param を生成しない場合
      else:
         newObj = Obj()
         for arg in args:
            newObj = getattr(Rule, str(arg[0][1:]))(env, newObj, arg[1:])
      
         # 登録されてなければ環境に登録
         if not newObj.name in env.definded:
            env.definded.append(newObj.name)
            env.objs.append(newObj)
      
      return env

   def Param(env, obj, args):
      name = str(args[0]) + str(args[1])
      if(name in env.definded):
         return env.objs[env.definded.index(name)]
      else:
         obj.name = name
         # TODO エラーチェック
         obj.type = ObjDict[str(args[0])]
         return obj

   def VarDecl(env, obj, args):
      setattr(obj, ParamDict[str(args[0])], ObjDict[str(args[1])] if str(args[1]) in ObjDict else args[1]) 
      return obj

   def Statement(env, world, args):
      # とりあえず保留
      return world

   def WorldVarDecl(env, world, args):
      setattr(world, WorldParamDict[str(args[0])], ValueDict[str(args[1])] if str(args[1]) in ValueDict else args[1]) 
      return world

   def WorldStatement(env, world, args):
      # とりあえず保留
      return world

# color = {
#     '赤': 'red',
#     '赤色': 'red',
#     '青': 'blue',
#     '青色': 'blue',
#     '黄': 'yellow',
#     '黄色': 'yellow',
#     'オレンジ': 'orange',
#     'オレンジ色': 'orange',
#     'ピンク': 'pink',
#     'ピンク色': 'pink',
#     '紫': 'purple',
#     '紫色': 'purple',
#     '緑': 'green',
#     '緑色': 'green',
#     '黒': 'black',
#     '黒色': 'black',
#     '白': 'white',
#     '白色': 'white',
#     '灰': 'gray',
#     '灰色': 'gray',
#     '茶': 'brown',
#     '茶色': 'brown',
# }

# modifier = {
#     '少し': '0.2',
#     'すこし': '0.2',
#     'ちょっと': '0.1',
#     'めっちゃ': '0.5',
#     'ごっつ': '0.4',
#     'すごく': '0.4',
#     'ぐーんと': '0.4',
#     'がくっと': '0.4',
#     'ぐぐーんと': '0.5',
#     'がくーん': '0.5',
#     '超': '0.5',
#     'ちょう': '0.5',
#     'ちょー': '0.5',
#     '大分': '0.4',
#     'だいぶ': '0.4',
#     '結構': '0.5',
#     'けっこう': '0.5',
# }

# no_name_direct = {
#     '上': ('cvsw/ratew/2', '0', 0),
#     '下': ('cvsw/ratew/2', 'cvsh/rateh', 0),
#     '右': ('cvsw/ratew', 'cvsh/rateh/2', 0),
#     '左': ('0', 'cvsh/rateh/2', 0),
#     '真ん中': ('cvsw/ratew/2', 'cvsh/rateh/2', 0),
#     '中心': ('cvsw/ratew/2', 'cvsh/rateh/2', 0),
#     '右上': ('cvsw/ratew', '0', 0),
#     '右下': ('cvsw/ratew', 'cvsh/rateh', 0),
#     '左上': ('0', '0', 0),
#     '左下': ('0', 'cvsh/rateh', 0),
# }

# directive = ['これら', 'あれら', 'それら', 'これ', 'あれ', 'それ', 'こ', 'あ', 'そ']
# be = ['おく', 'ある', 'いる', '置く', 'いらっしゃる', 'おられる', 'おき', 'あり', 'おり', '置き', 'いらっしゃり', 'おられり', 'おいて', 'あって', 'いて', '置いて', 'いらっしゃって', 'おられて']
# crash = ['衝突するとき', '衝突するなら', '衝突するならば', '衝突したとき', '衝突したら', '衝突したならば', '当たるとき', '当たるなら', '当たるならば', '当たったとき', '当たったなら', '当たったならば', 'あたるとき', 'あたるなら', 'あたるならば', 'あたったとき', 'あたったなら', 'あたったならば']
# add = ['増加する', '増加して', '増加し', '増やす', '増やして', '増やし', '増える', '増えて', '増え', '増す', '増して', '増し', 'ふやす', 'ふやして', 'ふやし', 'ふえる', 'ふえて', 'ふえ', 'ます', 'まして', 'まし']
# subtract = ['減少する', '減少して', '減少し', '減らす', '減らして', '減らし', '減る', '減って', '減り', 'へらす', 'へらして', 'へらし', 'へる', 'へって', 'へり']

# class DefindedError(Exception):
#     pass

# class UnknownNameError(Exception):
#     pass




def parse(input):
   parser = switch_generator({}, 'npl.tpeg')(load_grammar({}, 'npl.tpeg'))
   return parser(input)

def transpile(input):
   tree = parse(input)

   if tree.tag == 'err':
        return 'Parse Error'

   e = Expression.treeConv(tree)
   # return e
   env = Environment(e)
   env.push()
   return env.format()

def main():
   print(transpile(sample))

if __name__ == '__main__':
    main()