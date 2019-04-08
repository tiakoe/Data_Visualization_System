# -*- coding: utf-8 -*-
import sqlite3, pymysql, codecs
import flask
from flask import Flask, request, render_template, jsonify, send_from_directory
import urllib, json
from flask_cors import *
import pymongo
import json
import demjson

wbid = 0
cur_pro = -1
pid = ['51', '52', '42', '43', '41', '53', '36', '34', '61', '32']
client = pymongo.MongoClient("mongodb://localhost:27017/")
mgdb = client['wbInfo']

app = Flask(__name__)

# CORS(app, supports_credentials=True)
# r'/*' 是通配符，让本服务器所有的URL 都允许跨域请求
CORS(app, resources=r'/*')


# db = pymysql.connect(user='root', db='mydb3', port=3306, passwd='Hhgj9bjt', host='127.0.0.1', charset='utf8')
# cursor = db.cursor()


@app.route('/getMainData/mainData.json/<filename>', methods=['GET'])
def getMainData(filename):
    if cur_pro == -1:
        with open('./data/main/mainData.json', 'r', encoding='utf-8')as f:
            mainData = json.loads(f.read())
        return jsonify(mainData[filename])
    else:
        with open('./data/main/coandcir.json', 'r', encoding='utf-8')as f:
            mainData = json.loads(f.read())
        print(cur_pro.__str__())
        return jsonify(mainData[cur_pro.__str__()])


# 多余可删去
@app.route('/getMainSplash/<filename>', methods=['GET'])
def getMainSplash(filename):
    with open('./data/main/' + str(filename), 'r', encoding='utf-8')as f:
        mainData = json.loads(f.read())
    return jsonify(mainData)


# china.json
@app.route('/getMap/<filename>', methods=['GET'])
def getMap(filename):
    with open('./data/map/' + str(filename), 'r', encoding='utf-8')as f:
        mainData = json.loads(f.read())
    return jsonify(mainData)


# tables.json
@app.route('/getMainTables/<filename>', methods=['GET'])
def getMainTables(filename):
    with open('./data/main/' + str(filename), 'r', encoding='utf-8')as f:
        mainData = json.loads(f.read())
    return jsonify(mainData)


# AxisM.json
@app.route('/getAxisM/<filename>', methods=['GET'])
def getAxisM(filename):
    with open('./data/main/' + str(filename), 'r', encoding='utf-8')as f:
        mainData = json.loads(f.read())['axisM']
    return jsonify(mainData)


# getMainProvinceData.json  id为索引号
@app.route('/getMainProvinceData/<id>', methods=['GET'])
def getMainProvinceData(id):
    global cur_pro
    cur_pro = pid[int(id)]
    return jsonify({})


# 地图所需数据
@app.route('/getMapData/<filename>', methods=['GET'])
def getMapData(filename):
    with open('./data/main/' + filename, 'r', encoding='utf-8')as f:
        mapData = json.loads(f.read())
    return jsonify(mapData)


# 定位地图
@app.route('/getLocal/<wbid>', methods=['GET'])
def getLocal(wbid):
    with open('./data/main/mapData.json', 'r', encoding='utf-8')as f:
        mapData = json.loads(f.read())
    return jsonify([mapData[wbid]['lng'], mapData[wbid]['lat']])


@app.route('/getChild/<chart>', methods=['GET'])
def getChild(chart):
    global wbid
    wb_id = wbid
    col = mgdb['childData']
    for i in col.find({wb_id: {"$exists": True}}, {"_id": 0}):
        return demjson.encode(i[wb_id][chart])


@app.route('/', methods=["GET"])
def index():
    return render_template("mainIndex.html")


@app.route('/childhtml/<wb_id>', methods=["GET"])
def childhtml(wb_id):
    global wbid
    wbid = wb_id
    return render_template("childIndex.html")


@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path)


@app.route('/data/<path:path>')
def send_data(path):
    return send_from_directory('data', path)


@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)


@app.route('/plug-in/<path:path>')
def send_plug_ins(path):
    return send_from_directory('plug-in', path)


@app.route('/getTest/<testname>', methods=['GET'])
def getTest(testname):
    global res
    if request.method == 'OPTIONS':
        res = flask.make_response()
    if request.method == 'POST':
        data = request.data
        data = json.loads(data)

        res = flask.make_response(data)
    res.headers['Access-Control-Allow-Origin'] = '*'
    res.headers['Access-Control-Allow-Methods'] = 'POST，GET,OPTIONS'
    res.headers['Access-Control-Allow-Headers'] = 'x-requested-with,content-type'
    return res


@app.route('/test', methods=['GET'])
def ping_pong_test():
    return jsonify('Test Hello World!...........hhhha')  # （jsonify返回一个json格式的数据）


# 上传文件
@app.route('/upload', methods=['GET'])
def upload():
    result_text = {"statusCode": 200, "message": "文件上传成功"}
    response = flask.make_response(jsonify(result_text))
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'OPTIONS,HEAD,GET,POST'
    response.headers['Access-Control-Allow-Headers'] = 'x-requested-with'
    return response


if __name__ == "__main__":
    app.run(debug=True)
