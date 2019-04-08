import pymysql
import pymongo
import time
import calendar
from interval import Interval, IntervalSet
from datetime import datetime, timedelta
import numpy as np
import json
import copy
from intervals import DateTimeInterval

db = pymysql.connect(user='root', db='mydb3', port=3306, passwd='XX', host='127.0.0.1', charset='utf8')
cursor = db.cursor()

# client = pymongo.MongoClient("mongodb://localhost:27017/")
# mgdb = client['wbInfo']
# col = mgdb['dateSingleCol']

resultData = {}
singleObj = {
    "wbId": '',
    "pie":
        {
            "id": 0,
            "inNum": 0,
            "outNum": 0,
            "age18L": 0,
            "age30L": 0,
            "age40L": 0,
            "age50L": 0,
            "age50M": 0,
            "Error": 0
        },
    "area":
        {
            "age18L": [0] * 24,
            "age60L": [0] * 24,
            "age60M": [0] * 24,
            "Error": [0] * 24
        },
    "circleS": [[0] * 24] * 7,
    "calendar": {}
}


def initObject():
    for i in dateRange('2016-10-01', '2016-12-31'):
        singleObj["calendar"][i] = 0
    sql = 'SELECT a.`﻿SITEID` FROM wb_info a'
    cursor.execute(sql)
    for item in cursor.fetchall():
        resultData[item[0]] = singleObj


def processingData():
    success_num = 0
    failure_num = 0
    #                 0       1    2       3           4          5        6       7
    sql = 'SELECT PERSONID,SITEID,XB,CUSTOMERNAME,ONLINETIME,OFFLINETIME,AREAID,BIRTHDAY FROM hydata_swjl_all'
    cursor.execute(sql)
    for item in cursor.fetchall():
        try:
            temp_obj = copy.deepcopy(resultData[item[1]])
            a = item[4]
            b = item[5]
            start = datetime(int(a[0:4]), int(a[4:6]), int(a[6:8]), int(a[8:10]), int(a[10:12]), int(a[12:]))
            end = datetime(int(b[0:4]), int(b[4:6]), int(b[6:8]), int(b[8:10]), int(b[10:12]), int(b[12:]))

            dealPie(temp_obj, item[1], item[6], item[7])
            dealArea(temp_obj, item[4], item[5], item[7], start, end)
            dealCirS(temp_obj, item[4], item[5], start, end)
            dealCalendar(temp_obj, item[4], item[5])

            resultData[item[1]] = copy.deepcopy(temp_obj)
            success_num += 1
        except KeyError:
            failure_num += 1
    print('successNum:', success_num)
    print('failure_num(无网吧位置记录条数):', failure_num)

    with open('../processDataJson/child.json', 'w', encoding='utf-8')as f:
        f.write(json.dumps(resultData))

    # temp_list = []
    # failure_insert_num=0
    # for i in resultData.values():
    #     try:
    #         col.insert_one(i)
    #     except pymongo.errors.DuplicateKeyError:
    #         failure_insert_num += 1
    #         pass
    #     except pymongo:
    #         pass
    # print('failure_insert_num:',failure_insert_num)
    #     temp_list.append(i)
    # col.insert_many(temp_list)
    # client.close()

    # with open('../processDataJson/child.json', 'w', encoding='utf-8')as f:
    #     f.write(str(resultData))


def dealPie(temp_obj, siteid, areaid, birthday):
    temp_obj["wbId"] = siteid
    temp_obj["pie"]["id"] = siteid
    if areaid.endswith("5102", 0, 4):
        temp_obj["pie"]["inNum"] += 1
    else:
        temp_obj["pie"]["outNum"] += 1
        temp_obj["pie"][judgeAgePie(birthday)] += 1


def dealArea(temp_obj, s_time, e_time, birthday, start, end):
    for i in getHourSet(s_time, e_time, start, end):
        temp_obj["area"][judgeAgeArea(birthday)][i] += 1


def dealCirS(temp_obj, s_time, e_time, start, end):
    for i in getWeekSet(s_time, e_time, start, end):
        for j in getHourSet(s_time, e_time, start, end):
            temp_obj["circleS"][i][j] += 1


def dealCalendar(temp_obj, s_time, e_time):
    s = s_time[0:4] + '-' + s_time[4:6] + '-' + s_time[6:8]
    e = e_time[0:4] + '-' + e_time[4:6] + '-' + e_time[6:8]
    for i in dateRange(s, e):
        temp_obj['calendar'][i] += 1


def dateRange(s, e):
    dates = []
    last_t = datetime.strptime('2016-12-31', "%Y-%m-%d")
    st = datetime.strptime(s, "%Y-%m-%d")
    et = datetime.strptime(e, "%Y-%m-%d")
    if et > last_t:
        et = last_t
    while st <= et:
        date = st.strftime("%Y-%m-%d")
        dates.append(date)
        st = st + timedelta(1)
    return dates


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


def judgeAgePie(bir):
    if bir in Interval("19981001", "20161201"):
        return "age18L"
    else:
        if bir in Interval("19861001", "19980930"):
            return "age30L"
        else:
            if bir in Interval("19761001", "19860930"):
                return "age40L"
            else:
                if bir in Interval("19661001", "19760930"):
                    return "age50L"
                else:
                    if bir in Interval("19000101", "19660930"):
                        return "age50M"
                    else:
                        return "Error"


def judgeAgeArea(bir):
    if bir in Interval("19981001", "20161201"):
        return "age18L"
    else:
        if bir in Interval("19561001", "19980930"):
            return "age60L"
        else:
            if bir in Interval("19000101", "19560930"):
                return "age60M"
            else:
                return "Error"


def assemble():
    init_time = time.time()
    initObject()
    processingData()
    print('allTime: ', time.time() - init_time)


assemble()


# successNum: 1159340
# failure_num(无网吧位置记录条数): 665674
# allTime:  255.00496363639832
# 236.0405011177063
# 964.5512208938599
# 857.8676578998566
# 1292.3162250518799
# 1037.2731394767761


# 日历图最大值
circleMax = []
calendarMax = []
# 转化为与图相关的数据结构
def changeToresult():
    # sql = 'SELECT a.`﻿SITEID` FROM wb_info a'
    # cursor.execute(sql)
    # for item in cursor.fetchall():
    #     wbid.append(str(item[0]))
    with open('../processDataJson/child.json', 'r', encoding='utf-8')as f:
        data = json.load(f)
    wbid = data.keys()


    for k in wbid:
        temp = []
        for i in list(range(0, 7)):
            for j in list(range(0, 24)):
                temp.append([i, j, data[k]["circleS"][i][j]])
                circleMax.append(data[k]["circleS"][i][j])
        data[k]["circleS"] = temp

        calendar = []
        for b in data[k]['calendar'].items():
            calendar.append(list(b))
            calendarMax.append(list(b)[1])
        data[k]["calendar"] = calendar

    # print(circleMax, calendarMax)

    with open('../processDataJson/childData.json', 'w', encoding='utf-8')as f:
        f.write(json.dumps(data))


changeToresult()

circleMax.sort(reverse=False)
calendarMax.sort(reverse=False)
print(circleMax[0],circleMax[circleMax.__len__()-1])
print(calendarMax[0],calendarMax[calendarMax.__len__()-1])
