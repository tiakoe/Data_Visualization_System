import time
from datetime import datetime, timedelta
import calendar

from interval import Interval, IntervalSet

# from intervals import interval

ina = '20161203221223'
inb = '20161204021224'
inc = '20161206021224'

dateTime = datetime(int(ina[0:4]), int(ina[4:6]), int(ina[6:8]), int(ina[8:10]), int(ina[10:12]), int(ina[12:]))
changeA = ina[0:4] + '-' + ina[4:6] + '-' + ina[6:8] + ' ' + ina[8:10] + '-' + ina[10:12] + '-' + ina[12:]

# print(datetime.strptime(changeA, "%Y-%m-%d %H-%M-%S"))
# print(dateTime + timedelta(days=1))

dateIna=datetime(int(ina[0:4]), int(ina[4:6]), int(ina[6:8]), int(ina[8:10]), int(ina[10:12]), int(ina[12:]))
dateInb=datetime(int(inb[0:4]), int(inb[4:6]), int(inb[6:8]), int(inb[8:10]), int(inb[10:12]), int(inb[12:]))
duration=round((dateInb-dateIna).seconds/3600,2)
# print(round(cha.seconds/3600,2))

# print(calendar.weekday(2018, 11, 25))
# obj={}
# print(obj["dfd"])
# obj["dfd"]+=1
# print(obj)
tt={
    '123':{'fdsf':432},
    'fds':432
}
print(tt['123'])

# aa='2017-01-03'
# bb='2016-12-03'
# at = datetime.strptime(aa, "%Y-%m-%d")
# bt=datetime.strptime(bb, "%Y-%m-%d")
# if at>bt:
#     print('>')
tt={'01':{'a':[3,2]},'02':{'b':[3]},'03':{'c':{'d':32}}}
for i in tt.values():
    print(i)


import numpy as np

a = np.zeros((3, 4), dtype='int')
b = np.zeros(4, dtype='int')
print(b)
a[2][2] = 4
print(a)


def dateRange(s, e):
    dates = []
    st = datetime.strptime(s, "%Y-%m-%d")
    et = datetime.strptime(e, "%Y-%m-%d")
    while st <= et:
        date = st.strftime("%Y-%m-%d")
        dates.append(date)
        st = st + timedelta(1)
    return dates


print(dateRange('2016-10-01', '2016-10-03'))


def getWeekSet(a, b):
    week_list = []
    start = datetime(int(a[0:4]), int(a[4:6]), int(a[6:8]), int(a[8:10]), int(a[10:12]), int(a[12:]))
    end = datetime(int(b[0:4]), int(b[4:6]), int(b[6:8]), int(b[8:10]), int(b[10:12]), int(b[12:]))
    if end > start + timedelta(days=1):
        week_list = list(range(0, 7, 1))
    else:
        s = calendar.weekday(int(a[0:4]), int(a[4:6]), int(a[6:8]))
        e = calendar.weekday(int(b[0:4]), int(b[4:6]), int(b[6:8]))
        if s < e:
            week_list = list(range(s, e + 1, 1))
        else:
            week_list = list(range(s, 7, 1)) + list(range(0, e + 1, 1))
    return week_list


print(getWeekSet(ina, inb))


# a startTime;b endTime
def getHourSet(a, b):
    hours_list = []
    bStart = datetime(int(a[0:4]), int(a[4:6]), int(a[6:8]), int(a[8:10]), int(a[10:12]), int(a[12:]))
    bEnd = datetime(int(b[0:4]), int(b[4:6]), int(b[6:8]), int(b[8:10]), int(b[10:12]), int(b[12:]))
    if bEnd > bStart + timedelta(days=1):
        hours_list = list(range(0, 24, 1))
    else:
        s = int(a[8:10])
        e = int(b[8:10])
        if s < e:
            hours_list = list(range(s, e + 1, 1))
        else:
            hours_list = list(range(s, 24, 1)) + list(range(0, e + 1, 1))
    return hours_list

# print(getHourSet(ina, inc))
# print(getHourSet(ina, inb))
# ---------------------------------------------------|
# map = {"123": {"b": 1}, "124": {"b": 2}, "125": {"b": 3}}
# aa=map.get("124")
# aa["b"]=5
# print(map.get(124))
# map.setdefault("1",{"fd":34})
# print(map)


import pymongo



import json
# import demjson
# with open('test.txt','r',encoding='utf-8')as f:
#     result=f.read()
# # d=json.dumps(result)
# dd=demjson.encode(result)
# print(dd)
# print(dd['50022210000084'])


myList = [[0] * 3] * 4
print(myList)
