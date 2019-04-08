# -!- coding: utf-8 -!-
import pymysql
from datetime import datetime
import json

db = pymysql.connect(user='root', db='mydb3', port=3306, passwd='XX', host='127.0.0.1', charset='utf8')
cursor = db.cursor()

map_data = {}


def initObject():
    sql = 'select * from wb_info'
    cursor.execute(sql)
    for item in cursor.fetchall():
        map_data.setdefault(item[0].__str__(),
                            {'wb_id': item[0], 'name': item[1], 'lng': item[2], 'lat': item[3], 'people': 0, 'cid': 0})


def processingData():
    flag2 = 0
    flag3=0
    #                 0       1    2       3           4          5        6       7
    sql = 'SELECT PERSONID,SITEID,XB,CUSTOMERNAME,ONLINETIME,OFFLINETIME,AREAID,BIRTHDAY FROM hydata_swjl_all'
    cursor.execute(sql)
    for item in cursor.fetchall():
        wb_id = item[1]
        try:
            map_data[wb_id]['people'] += 1
            cur_age = 2016 - int(item[7][0:4])
            if cur_age < 18:
                map_data[wb_id]['cid'] = 1
            else:
                ina = item[4]
                inb = item[5]
                dateIna = datetime(int(ina[0:4]), int(ina[4:6]), int(ina[6:8]), int(ina[8:10]), int(ina[10:12]),
                                   int(ina[12:]))
                dateInb = datetime(int(inb[0:4]), int(inb[4:6]), int(inb[6:8]), int(inb[8:10]), int(inb[10:12]),
                                   int(inb[12:]))
                duration = round(int((dateInb - dateIna).seconds) / 3600, 2) + int((dateInb - dateIna).days) * 24
                if duration > 72 and cur_age > 40:
                    map_data[wb_id]['cid'] = 2
                    flag2 += 1
                if duration > 168:
                    map_data[wb_id]['cid'] = 2
                    flag3 += 1
        except KeyError:
            pass

    print(flag2,flag3,flag2+flag3)
    with open('../processDataJson/mapData.json', 'w', encoding='utf-8')as f:
        f.write(json.dumps(map_data))


# 初始化对象
initObject()
# 处理得到mapData.json
processingData()
