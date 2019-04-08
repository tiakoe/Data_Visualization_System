# -!- coding: utf-8 -!-
import pymysql
from datetime import datetime
import copy
import json

db = pymysql.connect(user='root', db='mydb3', port=3306, passwd='XX', host='127.0.0.1', charset='utf8')
cursor = db.cursor()


def processingData():
    # flag2 = 0
    # flag3 = 0
    maxduration = 0
    #                 0       1    2       3           4          5        6       7
    sql = 'SELECT PERSONID,SITEID,XB,CUSTOMERNAME,ONLINETIME,OFFLINETIME,AREAID,BIRTHDAY FROM hydata_swjl where hydata_swjl.`personid`="{id}"'.format(
        id='f96f017fc2701e3d42')
    sql2 = 'SELECT PERSONID,SITEID,XB,CUSTOMERNAME,ONLINETIME,OFFLINETIME,AREAID,BIRTHDAY FROM hydata_swjl where hydata_swjl.`personid`="{id}"'.format(
        id='f35fe23ffdb5bd3f74')
    cursor.execute(sql)
    for item in cursor.fetchall():
        ina = item[4]
        inb = item[5]
        try:
            dateIna = datetime(int(ina[0:4]), int(ina[4:6]), int(ina[6:8]), int(ina[8:10]), int(ina[10:12]),
                               int(ina[12:14]))
            dateInb = datetime(int(inb[0:4]), int(inb[4:6]), int(inb[6:8]), int(inb[8:10]), int(inb[10:12]),
                               int(inb[12:14]))
            duration = round(int((dateInb - dateIna).seconds)/3600,2)+int((dateInb - dateIna).days)*24
            print(dateIna, dateInb, dateInb - dateIna, (dateInb - dateIna).seconds)
            print('duration',duration)
            if duration > maxduration:
                maxduration = duration
        except ValueError as e:
            print(e)
        # if duration > 72 and cur_age > 40:
        #     flag2 += 1
        # if duration > 168:  # 貌似没有连续上网时长大于7天的
        #     flag3 += 1
    print('maxduration:',maxduration)


# 处理得到mapData.json
processingData()
