import pymongo
import json

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client['wbInfo']


# 插入mainData和mainSplash数据到mongodb
col = db['mainData']
with open('../processDataJson/mainData.json', 'r', encoding='utf-8')as f:
    res = f.read()
    col.insert_one(json.loads(res))


col = db['mainSplash']
with open('../processDataJson/mainSplash.json', 'r', encoding='utf-8')as f:
    res = f.read()
    col.insert_one(json.loads(res))


# 插入数据到mongodb
col = db['childData']
with open('../processDataJson/childData.json', 'r', encoding='utf-8')as f:
    result = f.read()
    res_json = json.loads(result)
    mylist=[]
    for i in res_json.items():
        mylist.append({i[0]: i[1]})
    col.insert_many(mylist)

client.close()

# dateArr = [
#     {'id': 0, 'value': 23},
#     {'id': 1, 'value': 3},
#     {'id': 4, 'value': 433}
# ]
# data = {
#     "432": {"fds": 43},
#     "42": {"fdfs": 42},
#     "4352": {"ffeds": 63},
#     "4242222": [[4234, 432], [43, 43]],
# }



# condition = {"50010710000166.wbId":"50010710000166"}
# for item in col.find(condition):
#     print(item)
# {"50011810000017":{"$exists":true}}

# from flask import jsonify
# import demjson
# a={}
# for i in col.find({"50011810000017":{"$exists": True}},{"_id":0}):
#     print(i["50011810000017"])
#     a["50011810000017"]=i["50011810000017"]
#     print(jsonify(a))
#     # print(json.loads(demjson.encode(i)))
#
# client.close()
