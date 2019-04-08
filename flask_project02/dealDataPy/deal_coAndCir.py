# -!- coding: utf-8 -!-
import pymysql
import time
import math
import calendar
from interval import Interval, IntervalSet
from datetime import datetime, timedelta
import copy
import json

db = pymysql.connect(user='root', db='mydb3', port=3306, passwd='XX', host='127.0.0.1', charset='utf8')
cursor = db.cursor()
# 部分外省id,人数较多的
pid = ['51', '52', '42', '43', '41', '53', '36', '34', '61', '32']
# pid对应名称
pid_name = ['四川省', '贵州省', '湖北省', '湖南省', '河南省', '云南省', '江西省', '安徽省', '陕西省', '江苏省']

# 外省id与name映射
out_map = {'53': '云南省', '36': '江西省', '34': '安徽省', '61': '陕西省', '23': '黑龙江', '54': '西藏自治区', '12': '天津市', '52': '贵州省',
           '51': '四川省', '32': '江苏省', '62': '甘肃省', '41': '河南省', '37': '山东省', '64': '宁夏', '65': '新疆', '33': '浙江省',
           '46': '海南省', '42': '湖北省', '44': '广东省', '35': '福建省', '43': '湖南省', '63': '青海省', '21': '辽宁省', '31': '上海市',
           '13': '河北省', '15': '内蒙古', '14': '山西省', '45': '广西', '22': '吉林省', '11': '北京市'}
res_data = {}
main_data = {
    "circleM": [[0] * 24] * 7,
}


def initObject():
    for i in pid:
        res_data[i] = copy.deepcopy(main_data)


def getWeekSet(a, b, start, end):
    week_list = []
    if end > start + timedelta(days=7):
        week_list = list(range(0, 7, 1))
    else:
        s = calendar.weekday(int(a[0:4]), int(a[4:6]), int(a[6:8]))
        e = calendar.weekday(int(b[0:4]), int(b[4:6]), int(b[6:8]))
        if s < e:
            week_list = list(range(s, e + 1, 1))
        else:
            week_list = list(range(s, 7, 1)) + list(range(0, e + 1, 1))
    return week_list


def getHourSet(a, b, start, end):
    hours_list = []
    if end > start + timedelta(days=1):
        hours_list = list(range(0, 24, 1))
    else:
        s = int(a[8:10])
        e = int(b[8:10])
        if s < e:
            hours_list = list(range(s, e + 1, 1))
        else:
            hours_list = list(range(s, 24, 1)) + list(range(0, e + 1, 1))
    return hours_list


def dealCircleM(id, a, b):
    start = datetime(int(a[0:4]), int(a[4:6]), int(a[6:8]), int(a[8:10]), int(a[10:12]), int(a[12:]))
    end = datetime(int(b[0:4]), int(b[4:6]), int(b[6:8]), int(b[8:10]), int(b[10:12]), int(b[12:]))
    for i in getWeekSet(a, b, start, end):
        for j in getHourSet(a, b, start, end):
            res_data[id]["circleM"][i][j] += 1


def processingData():
    #                 0       1    2       3           4          5        6       7
    sql = 'SELECT PERSONID,SITEID,XB,CUSTOMERNAME,ONLINETIME,OFFLINETIME,AREAID,BIRTHDAY FROM hydata_swjl_all'
    cursor.execute(sql)
    for item in cursor.fetchall():
        cur_id = item[6][0:2]
        if cur_id in pid and item[6][0:4] != '5102':
            dealCircleM(cur_id, item[4], item[5])


def changeToResult():
    main = {}
    for k in res_data.keys():
        tempobj = copy.deepcopy({})
        temp = copy.deepcopy([])
        circleMax = copy.deepcopy([])
        for i in list(range(0, 7)):
            for j in list(range(0, 24)):
                temp.append([i, j, res_data[k]['circleM'][i][j]])
                circleMax.append(res_data[k]['circleM'][i][j])  # 加入list排序
        circleMax.sort(reverse=False)
        tempobj['data'] = copy.deepcopy(temp)
        tempobj['interval'] = copy.deepcopy([circleMax[0], circleMax[circleMax.__len__() - 1]])
        main.setdefault(k, tempobj)
    with open('../processDataJson/coandcir.json', 'w', encoding='utf-8')as f:
        f.write(json.dumps(main))


# 初始化对象
initObject()
# 读取上网人记录，初步处理得到两个文件main_data.json和main_splashes.json
processingData()
# 该函数是将第一次处理的结果转化为图形所需的数据结构输出
# 输出文件包含两个，一个是mainData（主界面的迁移地图、柱状图、散点图），第二个是散点图

changeToResult()
