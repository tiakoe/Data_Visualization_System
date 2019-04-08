# -!- coding: utf-8 -!-
import pymysql
from datetime import datetime
import json

db = pymysql.connect(user='root', db='mydb3', port=3306, passwd='XX', host='127.0.0.1', charset='utf8')
cursor = db.cursor()

tables = []
# 外省id与name映射
out_map = {'53': '云南省', '36': '江西省', '34': '安徽省', '61': '陕西省', '23': '黑龙江', '54': '西藏自治区', '12': '天津市', '52': '贵州省',
           '51': '四川省', '32': '江苏省', '62': '甘肃省', '41': '河南省', '37': '山东省', '64': '宁夏', '65': '新疆', '33': '浙江省',
           '46': '海南省', '42': '湖北省', '44': '广东省', '35': '福建省', '43': '湖南省', '63': '青海省', '21': '辽宁省', '31': '上海市',
           '13': '河北省', '15': '内蒙古', '14': '山西省', '45': '广西', '22': '吉林省', '11': '北京市'}


def processingData():
    #                 0       1    2       3           4          5        6       7
    sql = 'SELECT PERSONID,SITEID,XB,CUSTOMERNAME,ONLINETIME,OFFLINETIME,AREAID,BIRTHDAY FROM hydata_swjl_all'
    cursor.execute(sql)
    for item in cursor.fetchall():
        try:
            cur_age = 2016 - int(item[7][0:4])
            ina = item[4]
            inb = item[5]
            dateIna = datetime(int(ina[0:4]), int(ina[4:6]), int(ina[6:8]), int(ina[8:10]), int(ina[10:12]),
                               int(ina[12:]))
            dateInb = datetime(int(inb[0:4]), int(inb[4:6]), int(inb[6:8]), int(inb[8:10]), int(inb[10:12]),
                               int(inb[12:]))
            duration = round(int((dateInb - dateIna).seconds) / 3600, 2) + int((dateInb - dateIna).days) * 24
            if cur_age < 18 or duration > 72 and cur_age > 40 or duration > 168:
                if item[6][0:4] != '5102':
                    pro_name = out_map[item[6][0:2]]
                else:
                    pro_name = '重庆'
                tables.append({
                    "id": item[0],
                    "wbid": item[1],
                    "sex": item[2],
                    "areaid": pro_name,
                    "age": cur_age,
                    "len": duration
                })
        except KeyError:
            pass

    with open('../processDataJson/tables.json', 'w', encoding='utf-8')as f:
        f.write(json.dumps(tables))


# 处理得到tables.json
processingData()
