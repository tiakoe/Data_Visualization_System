# -!- coding: utf-8 -!-
# 清理掉虚网吧
import pymysql
from datetime import datetime
import json

db = pymysql.connect(user='root', db='mydb3', port=3306, passwd='XX', host='127.0.0.1', charset='utf8')
cursor = db.cursor()

with open('../processData/mapData.json','r',encoding='utf-8')as f:
    res=json.loads(f.read())
    for item in res.keys():
        if res[item]['people']==0:
            sql='DELETE FROM wb_info WHERE wb_info.`﻿SITEID`={i};'.format(i=item)
            print(sql)
            # cursor.execute(sql)

