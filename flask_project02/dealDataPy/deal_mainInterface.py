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
# 人数排名province_id
# ['51', '52', '42', '43', '41', '53', '36', '34', '61', '32', '62', '13', '33', '37', '35', '65', '44', '14', '45', '23', '15', '21', '22', '46', '63', '54', '64', '12', '31', '11']
# 部分外省id,人数较多的
pid = ['51', '52', '42', '43', '41', '53', '36', '34', '61', '32']
# pid对应名称
pid_name = ['四川省', '贵州省', '湖北省', '湖南省', '河南省', '云南省', '江西省', '安徽省', '陕西省', '江苏省']
# 所有外省
out_pro_id = ['51', '37', '23', '42', '53', '61', '22', '52', '45', '41', '32', '43', '62', '13', '14', '34', '35',
              '21', '31', '44', '15', '63', '65', '54', '36', '33', '46', '64', '12', '11']
out_name = ['四川省', '山东省', '黑龙江', '湖北省', '云南省', '陕西省', '吉林省', '贵州省', '广西', '河南省', '江苏省', '湖南省', '甘肃省', '河北省', '山西省',
            '安徽省', '福建省', '辽宁省', '上海市', '广东省', '内蒙古', '青海省', '新疆', '西藏自治区', '江西省', '浙江省', '海南省', '宁夏', '天津市', '北京市']
# 外省id与name映射
out_map = {'53': '云南省', '36': '江西省', '34': '安徽省', '61': '陕西省', '23': '黑龙江', '54': '西藏自治区', '12': '天津市', '52': '贵州省',
           '51': '四川省', '32': '江苏省', '62': '甘肃省', '41': '河南省', '37': '山东省', '64': '宁夏', '65': '新疆', '33': '浙江省',
           '46': '海南省', '42': '湖北省', '44': '广东省', '35': '福建省', '43': '湖南省', '63': '青海省', '21': '辽宁省', '31': '上海市',
           '13': '河北省', '15': '内蒙古', '14': '山西省', '45': '广西', '22': '吉林省', '11': '北京市'}
# age
ageId = list(range(1, 117, 1))

main_data = {
    "outProvince": {},
    "circleM": [[0] * 24] * 7,
}
main_splashes = {}
temp_splashes = {}


def initObject():
    for i in pid:
        main_data['outProvince'].setdefault(i.__str__(), {"男": 0, "女": 0})
        # peopleNum 人次； person  人数；
        temp_splashes[i.__str__()] = copy.deepcopy({"timeLen": 0, "peopleNum": 0, "person": set()})
    for age in ageId:
        main_splashes[age.__str__()] = copy.deepcopy(temp_splashes)  # bug已解决
    # print(main_splashes)


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


def dealCircleM(a, b):
    start = datetime(int(a[0:4]), int(a[4:6]), int(a[6:8]), int(a[8:10]), int(a[10:12]), int(a[12:]))
    end = datetime(int(b[0:4]), int(b[4:6]), int(b[6:8]), int(b[8:10]), int(b[10:12]), int(b[12:]))
    for i in getWeekSet(a, b, start, end):
        for j in getHourSet(a, b, start, end):
            main_data["circleM"][i][j] += 1


def processingData():
    #                 0       1    2       3           4          5        6       7
    sql = 'SELECT PERSONID,SITEID,XB,CUSTOMERNAME,ONLINETIME,OFFLINETIME,AREAID,BIRTHDAY FROM hydata_swjl_all'
    cursor.execute(sql)
    for item in cursor.fetchall():
        cur_id = item[6][0:2]
        if cur_id in pid and item[6][0:4] != '5102':
            dealCircleM(item[4], item[5])
            # if cur_id in pid:
            ina = item[4]
            inb = item[5]
            cur_xb = item[2]
            cur_age = 2016 - int(item[7][0:4])
            main_data["outProvince"][cur_id][cur_xb] += 1
            dateIna = datetime(int(ina[0:4]), int(ina[4:6]), int(ina[6:8]), int(ina[8:10]), int(ina[10:12]),
                               int(ina[12:]))
            dateInb = datetime(int(inb[0:4]), int(inb[4:6]), int(inb[6:8]), int(inb[8:10]), int(inb[10:12]),
                               int(inb[12:]))
            duration = round(int((dateInb - dateIna).seconds) / 3600, 2) + int((dateInb - dateIna).days) * 24
            main_splashes[cur_age.__str__()][cur_id]["timeLen"] += duration
            main_splashes[cur_age.__str__()][cur_id]["peopleNum"] += 1
            main_splashes[cur_age.__str__()][cur_id]["person"].add(item[0])

    # 此处未写入，若写入需将main_splashes中的person集合转为list，才能序列化
    # with open('../processDataJson/mainData.json', 'w', encoding='utf-8')as f:
    #     f.write(json.dumps(main_data))

    # print(main_splashes['18']['51']['peopleNum'])
    # print(main_splashes['19']['51']['peopleNum'])

    # with open('../processDataJson/mainSplash.json', 'w', encoding='utf-8')as f:
    #     f.write(json.dumps(main_splashes))


circleMax = []
# splash[]
sa = []
sb = []
sc = []
sd = []


def changeToResult():
    main = {}
    temp = []
    for i in list(range(0, 7)):
        for j in list(range(0, 24)):
            temp.append([i, j, main_data['circleM'][i][j]])
            circleMax.append(main_data['circleM'][i][j])
    main.setdefault("circleM", temp)
    boy = []
    girl = []
    total = []
    for id in pid:
        b = int(main_data['outProvince'][id]["男"])
        g = int(main_data['outProvince'][id]["女"])
        boy.append(b)
        girl.append(g)
        total.append((b + g))

    main.setdefault("columnar", {
        "boy": boy,
        "girl": girl,
        "province": pid_name
    })
    main.setdefault("provinceMap", total)

    with open('../processDataJson/mainData.json', 'w', encoding='utf-8')as f:
        f.write(json.dumps(main))


    splash = {}
    splash.setdefault('age', ageId)
    splash.setdefault('provinceName', pid_name)
    temp = []
    for i in main_splashes.keys():
        temp.append(int(i))
    temp.sort(reverse=False)
    series = []
    for i in temp:  # 年龄
        new_temp = []
        age = i.__str__()
        for j in main_splashes[age].keys():  # 省份
            p_num = copy.deepcopy(main_splashes[age][j]['peopleNum'])
            p_person = copy.deepcopy(main_splashes[age][j]['person'].__len__())
            if p_num != 0:
                avg_time = round(main_splashes[age][j]['timeLen'] / p_num, 2)
            else:
                avg_time = 0
            new_temp.append([p_person, avg_time, p_num, str(out_map[j]), int(age)])  # 第一个参数需要调整
            sa.append(p_person)
            sb.append(avg_time)
            sc.append(p_num)
            sd.append(int(age))

        series.append(new_temp)
    splash.setdefault('series', series)

    # with open('../processDataJson/mainSplash.json', 'w', encoding='utf-8')as f:
    #     f.write(json.dumps(splash))


# 初始化对象
initObject()
# 读取上网人记录，初步处理得到两个文件main_data.json和main_splashes.json
processingData()
# 该函数是将第一次处理的结果转化为图形所需的数据结构输出
# 输出文件包含两个，一个是mainData（主界面的迁移地图、柱状图、散点图），第二个是散点图

changeToResult()
circleMax.sort(reverse=False)
sa.sort(reverse=False)
sb.sort(reverse=False)
sc.sort(reverse=False)
sd.sort(reverse=False)
print(circleMax[0], circleMax[circleMax.__len__() - 1])

print(sa[0], sa[sa.__len__() - 1])
print(sb[0], sb[sb.__len__() - 1])
print(sc[0], sc[sc.__len__() - 1])
print(sd[0], sd[sd.__len__() - 1])
