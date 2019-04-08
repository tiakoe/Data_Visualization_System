import pymysql
import operator
import time
import calendar
from interval import Interval, IntervalSet
from datetime import datetime, timedelta
import json
from intervals import DateTimeInterval

db = pymysql.connect(user='root', db='mydb3', port=3306, passwd='XX', host='127.0.0.1', charset='utf8')
cursor = db.cursor()
#
# sql = 'SELECT AREAID FROM hydata_swjl_all'
# cursor.execute(sql)
# temp = {}
# all_provin_id=[]
# for i in cursor.fetchall():
#     t = str(i[0][0:2])
#     if not temp.get(t):
#         temp.setdefault(t, 1)
#         all_provin_id.append(t)
#     temp[t] += 1
# # arr = []
# # for i in temp.values():
# #     arr.append(i)
# # arr.sort()
# print('all_province',all_provin_id)
# res=sorted(temp.items(),key=operator.itemgetter(1),reverse=True)
# arr=[]
# for i in res:
#     arr.append(str(i[0]))
# print(arr)


#
obj = {
    'fdf': 'fds',
    'asd': {'fd': 432,
            'xx': {'fd':'fds'}
            },
    'er':'fs'
}
ac = obj
# ac['fd'] = 10
print(ac)

# fd=obj.get('asd')
# fd['fd']=43
# print(obj['asd'])
# # print(obj.items())
# for i in obj.items():
#     print(list(i))
