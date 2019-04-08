
import pymysql


db = pymysql.connect(user='root', db='mydb2', port=3306, passwd='XX', host='127.0.0.1', charset='utf8')
cursor = db.cursor()

out_pro_id = ['51', '37', '23', '42', '53', '61', '22', '52', '45', '41', '32', '43', '62', '13', '14', '34', '35',
              '21', '31', '44', '15', '63', '65', '54', '36', '33', '46', '64', '12', '11']
name=['四川省', '山东省', '黑龙江', '湖北省', '云南省', '陕西省', '吉林省', '贵州省', '广西', '河南省', '江苏省', '湖南省', '甘肃省', '河北省', '山西省', '安徽省', '福建省', '辽宁省', '上海市', '广东省', '内蒙古', '青海省', '新疆', '西藏自治区', '江西省', '浙江省', '海南省', '宁夏', '天津市', '北京市']

map_data={}
for i in list(range(0,out_pro_id.__len__())):
    map_data.setdefault(out_pro_id[i],name[i])
print(map_data)
print(name.__len__(),map_data.keys().__len__())



# import json
# import demjson
# a=set()
# a.add('fdf')
# a.add('fdf')
# a.add('fd')
# bb=json.dumps(list(a))
#
# print(json.loads(bb).__len__())

# with open('test.json','w',encoding='utf-8')as f:
#     f.write(aa)

