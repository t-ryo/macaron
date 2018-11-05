from flask import Flask, render_template, request, redirect, url_for, Response, send_file
import json

app = Flask(__name__)

# cookieを暗号化する秘密鍵
# app.config['SECRET_KEY'] = os.urandom(24)

@app.route('/')
def home():
    return send_file('templates/index.html')

@app.route('/stylesheet', methods=['POST'])
def transformStylesheet():
    stylesheetValue =  request.form['stylesheet-value']
    # TODO トランスパイル
    # json形式の文字列に変換して返すので、json形式にする必要はないはず
    # jsonVal = json.loads(stylesheetValue)
    return json.dumps({'json':stylesheetValue})

@app.route('/rule', methods=['POST'])
def transformRule():
    ruleValue =  request.form['rule-value']
    # TODO トランスパイル
    return json.dumps({'rule':ruleValue})

if __name__ == '__main__':
    app.run(debug=True)
    # app.debug = True # デバッグモード有効化
    # app.run(host='0.0.0.0') # どこからでもアクセス可能に
