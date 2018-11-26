from flask import Flask, request, redirect, url_for, Response, send_file, render_template
import json, re, os, platform, subprocess, sys
from pathlib import Path

app = Flask(__name__)

# horizontalBar = r"---"
# reHorizontalBar = re.compile(horizontalBar)

# cookieを暗号化する秘密鍵
# app.config['SECRET_KEY'] = os.urandom(24)

@app.route('/')
def home():
    return send_file(str(file_search('index.html', 'src/templates')))



@app.route('/stylesheet', methods=['POST'])
def transformStylesheet():
    inputText = request.form['stylesheet-value']
    splitText = re.split(r'---+', inputText)

    # TODO トランスパイル

    if len(splitText) == 2:
        with file_search('rule.js', 'src/static/js/').open(mode='w') as f:
            f.write('var stylesheet = `' + splitText[0] + '`\n')
            f.write('function myRule(){' + splitText[1] + '}')
    else:
        with file_search('rule.js', 'src/static/js').open(mode='w') as f:
            f.write('var stylesheet = "";\nfunction myRule(){alert(\'syntax error\');}')

    return send_file(str(file_search('rule.js', 'src/static/js')))


@app.route('/sample/slingshot', methods=['POST'])
def getSlingShotSample():
    with file_search('slingshot.macaron').open() as f:
        return f.read()

@app.route('/sample/bridge', methods=['POST'])
def getBridgeSample():
    with file_search('bridge.macaron').open() as f:
        return f.read()

@app.route('/sample/car', methods=['POST'])
def getCarSample():
    with file_search('car.macaron').open() as f:
        return f.read()

@app.route('/sample/pendulum', methods=['POST'])
def getPendulumSample():
    with file_search('pendulum.macaron').open() as f:
        return f.read()

@app.route('/sample/wreckingball', methods=['POST'])
def getWreckingBallSample():
    with file_search('wreckingball.macaron').open() as f:
        return f.read()

def file_search(file, subdir = 'examples'):
    return Path(__file__).resolve().parent.parent / subdir / file

def main():
    argv = sys.argv
    if len(argv) == 2 and argv[1] == 'update':
        try:
            subprocess.check_call(['pip3', 'install', '-U', 'git+https://github.com/t-ryo/macaron.git@server'])
        except:
            pass
    else:
        app.run(debug=True)
        # app.debug = True # デバッグモード有効化
        # app.run(host='0.0.0.0') # どこからでもアクセス可能に

        if platform.system() == 'Darwin':
            try:
                #subprocess.check_call(['open'])
                pass
            except:
                pass

if __name__ == '__main__':
    main()
