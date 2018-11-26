from flask import Flask, request, redirect, url_for, Response, send_file, render_template
import json
import re
import os

app = Flask(__name__)

# horizontalBar = r"---"
# reHorizontalBar = re.compile(horizontalBar)

# cookieを暗号化する秘密鍵
# app.config['SECRET_KEY'] = os.urandom(24)

@app.route('/')
def home():
    return send_file('templates/index.html')

@app.route('/stylesheet', methods=['POST'])
def transformStylesheet():
    inputText = request.form['stylesheet-value']
    splitText = re.split(r'---+', inputText)

    # TODO トランスパイル

    if len(splitText) == 2:
        with open('static/rule.js', mode='w') as f:
            f.write('var stylesheet = `' + splitText[0] + '`\n')
            f.write('function myRule(){' + splitText[1] + '}')
    else:
        with open('static/rule.js', mode='w') as f:
            f.write('var stylesheet = "";\nfunction myRule(){alert(\'syntax error\');}')
        
    return send_file('static/rule.js')


@app.route('/sample/slingshot', methods=['POST'])
def getSlingShotSample():
    with open('../examples/slingshot.macaron') as f:
        return f.read()

@app.route('/sample/bridge', methods=['POST'])
def getBridgeSample():
    with open('../examples/bridge.macaron') as f:
        return f.read()

@app.route('/sample/car', methods=['POST'])
def getCarSample():
    with open('../examples/car.macaron') as f:
        return f.read()

@app.route('/sample/pendulum', methods=['POST'])
def getPendulumSample():
    with open('../examples/pendulum.macaron') as f:
        return f.read()

@app.route('/sample/wreckingball', methods=['POST'])
def getWreckingBallSample():
    with open('../examples/wreckingball.macaron') as f:
        return f.read()

def main():
    app.run(debug=True)
    # app.debug = True # デバッグモード有効化
    # app.run(host='0.0.0.0') # どこからでもアクセス可能に

if __name__ == '__main__':
    main()
