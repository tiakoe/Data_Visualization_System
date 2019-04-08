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

main_data = {
    "axisM": [[0] * 24] * 7,
}


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


def dealaxisM(a, b):
    start = datetime(int(a[0:4]), int(a[4:6]), int(a[6:8]), int(a[8:10]), int(a[10:12]), int(a[12:]))
    end = datetime(int(b[0:4]), int(b[4:6]), int(b[6:8]), int(b[8:10]), int(b[10:12]), int(b[12:]))
    for i in getWeekSet(a, b, start, end):
        for j in getHourSet(a, b, start, end):
            main_data["axisM"][i][j] += 1


axisMax = []


def processingData():
    #                 0       1    2       3           4          5        6       7
    sql = 'SELECT PERSONID,SITEID,XB,CUSTOMERNAME,ONLINETIME,OFFLINETIME,AREAID,BIRTHDAY FROM hydata_swjl_all'
    cursor.execute(sql)
    for item in cursor.fetchall():
        cur_age = 2016 - int(item[7][0:4])
        ina = item[4]
        inb = item[5]
        dateIna = datetime(int(ina[0:4]), int(ina[4:6]), int(ina[6:8]), int(ina[8:10]), int(ina[10:12]),
                           int(ina[12:]))
        dateInb = datetime(int(inb[0:4]), int(inb[4:6]), int(inb[6:8]), int(inb[8:10]), int(inb[10:12]),
                           int(inb[12:]))
        duration = round(int((dateInb - dateIna).seconds) / 3600, 2) + int((dateInb - dateIna).days) * 24
        if cur_age < 18 or duration > 72 and cur_age > 40 or duration > 168:
            dealaxisM(item[4], item[5])
    temp = []
    for i in list(range(0, 7)):
        for j in list(range(0, 24)):
            temp.append([i, j, main_data["axisM"][i][j]])
            axisMax.append(main_data["axisM"][i][j])
    main_data["axisM"] = temp

    with open('./processData/mainAxisM.json', 'w', encoding='utf-8')as f:
        f.write(json.dumps(main_data))


processingData()
axisMax.sort(reverse=False)
print(axisMax[0], axisMax[axisMax.__len__() - 1])
