(function () {

    let pro_map = new BMap.Map("provinceMap", {
        enableMapClick: false
    });

    getMap("china.json");

    function getMap(filename) {
        $.ajax({
            cache: false,
            type: "GET",
            url: "/getMap/" + filename,
            async: true,
            data: null,
            dataType: "json",
            success: function (result) {
                ajaxend(result);
            }
        });
    }

    function ajaxend(geojson) {

        let pm = [918094,125491, 70469, 49421, 46360, 43304, 30557, 28537, 26486, 23359];

        pro_map.centerAndZoom(new BMap.Point(108.398586, 30.789703), 5);  // 初始化地图,设置中心点坐标和地图级别
        pro_map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放

        pro_map.setMapStyle({
            styleJson: [{
                "featureType": "water",
                "elementType": "all",
                "stylers": {
                    // "color": "#031628"
                     "color": "#08304A"
                }
            }, {
                "featureType": "land",
                "elementType": "geometry",
                "stylers": {
                    // "color": "#000102"
                     "color": "#08304A"
                }
            }, {
                "featureType": "highway",
                "elementType": "geometry.fill",
                "stylers": {
                    // "color": "#000000"
                     "color": "#08304A"
                }
            }, {
                "featureType": "highway",
                "elementType": "geometry.stroke",
                "stylers": {
                    "color": "#147a92"
                }
            }, {
                "featureType": "arterial",
                "elementType": "geometry.fill",
                "stylers": {
                    // "color": "#000000"
                     "color": "#08304A"
                }
            }, {
                "featureType": "arterial",
                "elementType": "geometry.stroke",
                "stylers": {
                    "color": "#0b3d51"
                }
            }, {
                "featureType": "local",
                "elementType": "geometry",
                "stylers": {
                    // "color": "#000000"
                     "color": "#08304A"
                }
            }, {
                "featureType": "railway",
                "elementType": "geometry.fill",
                "stylers": {
                    // "color": "#000000"
                     "color": "#08304A"
                }
            }, {
                "featureType": "railway",
                "elementType": "geometry.stroke",
                "stylers": {
                    "color": "#08304b"
                }
            }, {
                "featureType": "subway",
                "elementType": "geometry",
                "stylers": {
                    "lightness": -70
                }
            }, {
                "featureType": "building",
                "elementType": "geometry.fill",
                "stylers": {
                    // "color": "#000000"
                     "color": "#08304A"
                }
            }, {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": {
                    // "color": "#857f7f"
                     "color": "#08304A"
                }
            }, {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": {
                    // "color": "#000000"
                    "color": "#08304A"
                }
            }, {
                "featureType": "building",
                "elementType": "geometry",
                "stylers": {
                    "color": "#022338"
                }
            }, {
                "featureType": "green",
                "elementType": "geometry",
                "stylers": {
                    "color": "#062032"
                }
            }, {
                "featureType": "boundary",
                "elementType": "all",
                "stylers": {
                    "color": "#465b6c"
                }
            }, {
                "featureType": "manmade",
                "elementType": "all",
                "stylers": {
                    "color": "#022338"
                }
            }, {
                "featureType": "label",
                "elementType": "all",
                "stylers": {
                    "color": "#022338",
                    "visibility": "off"
                }
            }]
        });

        let geojsonOptions = {
            gradient: {
                0: 'rgba(55, 50, 250, 0.4)',
                1: 'rgba(55, 50, 250, 1)'
            },
            max: 918094,
            draw: 'intensity'
        };

        let geojsonDataSet = mapv.geojson.getDataSet(geojson);

        let to = '重庆';

        let qianxi = new mapv.DataSet([
            {
                from: '四川',
                count: pm[0],
                to: to,
            },
            {
                from: '贵州',
                count: pm[1],
                to: to,
            },
            {
                from: '湖北',
                count: pm[2],
                to: to,
            },
            {
                from: '湖南',
                count: pm[3],
                to: to,
            },
            {
                from: '河南',
                count: pm[4],
                to: to,
            },
            {
                from: '云南',
                count: pm[5],
                to: to,
            },
            {
                from: '江西',
                count: pm[6],
                to: to,
            },
            {
                from: '安徽',
                count: pm[7],
                to: to,
            },
            {
                from: '陕西',
                count: pm[8],
                to: to,
            },
            {
                from: '江苏',
                count: pm[9],
                to: to,
            },
        ]);

        let qianxiData = qianxi.get();

        let lineData = [];
        let pointData = [];
        let textData = [];
        let timeData = [];

        let citys = {}

        for (let i = 0; i < qianxiData.length; i++) {
            let fromCenter = mapv.utilCityCenter.getCenterByCityName(qianxiData[i].from);
            let toCenter = mapv.utilCityCenter.getCenterByCityName(qianxiData[i].to);
            if (!fromCenter || !toCenter) {
                continue;
            }
            citys[qianxiData[i].from] = qianxiData[i].count;
            citys[qianxiData[i].to] = 100;
            pointData.push(
                {
                    geometry: {
                        type: 'Point',
                        coordinates: [fromCenter.lng, fromCenter.lat]
                    }
                }
            );
            pointData.push(
                {
                    geometry: {
                        type: 'Point',
                        coordinates: [toCenter.lng, toCenter.lat]
                    }
                }
            );
            textData.push(
                {
                    geometry: {
                        type: 'Point',
                        coordinates: [fromCenter.lng, fromCenter.lat]
                    },
                    text: qianxiData[i].from
                }
            );
            textData.push(
                {
                    geometry: {
                        type: 'Point',
                        coordinates: [toCenter.lng, toCenter.lat]
                    },
                    text: qianxiData[i].to
                }
            );

            let curve = mapv.utilCurve.getPoints([fromCenter, toCenter]);

            for (let j = 0; j < curve.length; j++) {
                timeData.push({
                    geometry: {
                        type: 'Point',
                        coordinates: curve[j]
                    },
                    count: 1,
                    time: j
                });
            }

            lineData.push({
                geometry: {
                    type: 'LineString',
                    coordinates: curve
                    //coordinates: [[fromCenter.lng, fromCenter.lat], [toCenter.lng, toCenter.lat]]
                },
                count: 30 * Math.random()
            });

        }

        let data = geojsonDataSet.get({
            filter: function (item) {

                if (!citys[item.name]) {
                    return false;
                }

                item.count = citys[item.name];
                return true;
            }
        });
        geojsonDataSet = new mapv.DataSet(data);

        let mapvLayer = new mapv.baiduMapLayer(pro_map, geojsonDataSet, geojsonOptions);

        let textDataSet = new mapv.DataSet(textData);

        let textOptions = {
            draw: 'text',
            font: '14px Arial',
            fillStyle: 'white',
            shadowColor: 'yellow',
            shadowBlue: 10,
            zIndex: 11,
            shadowBlur: 10
        }

        let textMapvLayer = new mapv.baiduMapLayer(pro_map, textDataSet, textOptions);

        let lineDataSet = new mapv.DataSet(lineData);

        let lineOptions = {
            strokeStyle: 'rgba(255, 250, 50, 0.8)',
            shadowColor: 'rgba(255, 250, 50, 1)',
            shadowBlur: 20,
            lineWidth: 2,
            zIndex: 100,
            draw: 'simple'
        }

        let lineLayer = new mapv.baiduMapLayer(pro_map, lineDataSet, lineOptions);

        let pointOptions = {
            fillStyle: 'rgba(254,175,3,0.7)',
            shadowColor: 'rgba(55, 50, 250, 0.5)',
            shadowBlur: 10,
            size: 5,
            zIndex: 10,
            draw: 'simple'
        }


        let pointDataSet = new mapv.DataSet(pointData);

        let pointLayer = new mapv.baiduMapLayer(pro_map, pointDataSet, pointOptions);


        let timeDataSet = new mapv.DataSet(timeData);

        // console.log(timeData);

        let timeOptions = {
            fillStyle: 'rgba(255, 250, 250, 0.5)',
            zIndex: 200,
            size: 2.5,
            animation: {
                type: 'time',
                stepsRange: {
                    start: 0,
                    end: 50
                },
                trails: 10,
                duration: 2,
            },
            draw: 'simple'
        };

        let timeMapvLayer = new mapv.baiduMapLayer(pro_map, timeDataSet, timeOptions);

    }


})();


