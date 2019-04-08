(function () {


    // splashes.showLoading();

    getMainData("mainSplash.json");

    function getMainData(filename) {
        $.ajax({
            cache: false,
            type: "GET",
            url: "/getMainSplash/" + filename,
            async: true,
            data: null,
            dataType: "json",
            success: function (result) {
                ajaxend(result);
            }
        });
    }

    function ajaxend(data) {
        let splashes = echarts.init(document.getElementById('splashes'));
        console.log(data);
        // splashes.hideLoading();

        var itemStyle = {
            normal: {
                opacity: 0.8,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        };

        var sizeFunction = function (x) {
            var y = Math.sqrt(x / 5e8) + 0.1;
            return y * 80 + Math.log(x) * Math.log(x);
        };
        // let sizeFunction = function (x) {
        //     // return Math.log(x)*Math.log(x)*2+10;
        //     // return x;
        //     // return x / 10000+20;
        //     let y = Math.sqrt(x / 5e8) + 0.1;
        //     return y * 80;
        // };

        // Schema:
        let schema = [
            {name: 'Income', index: 0, text: '上网人数', unit: '人'},
            {name: 'LifeExpectancy', index: 1, text: '人均时长', unit: 'h'},
            {name: 'Population', index: 2, text: '总人次', unit: ''},
            {name: 'Country', index: 3, text: '省份', unit: ''}
        ];

        option = {
            baseOption: {
                timeline: {
                    axisType: 'category',
                    orient: 'vertical',
                    autoPlay: true,
                    inverse: true,
                    playInterval: 1000,
                    left: null,
                    right: 0,
                    top: 20,
                    bottom: 20,
                    width: 55,
                    height: null,
                    label: {
                        normal: {
                            textStyle: {
                                color: '#999'
                            }
                        },
                        emphasis: {
                            textStyle: {
                                color: '#1BB4FF'
                            }
                        }
                    },
                    symbol: 'none',
                    lineStyle: {
                        color: '#555'
                    },
                    checkpointStyle: {
                        color: '#1BB4FF',
                        borderColor: '#777',
                        borderWidth: 2
                    },
                    controlStyle: {
                        showNextBtn: false,
                        showPrevBtn: false,
                        normal: {
                            color: '#666',
                            borderColor: '#666'
                        },
                        emphasis: {
                            color: '#aaa',
                            borderColor: '#aaa'
                        }
                    },
                    data: []
                },
                backgroundColor: '#08304A',
                title: [{
                    text: data["age"][0],
                    textAlign: 'center',
                    left: '63%',
                    top: '55%',
                    textStyle: {
                        fontSize: 90,
                        color: 'rgba(255, 255, 255, 0.7)'
                    },
                }, {
                    text: '各省人均上网时长与年龄的关系',
                    left: 'center',
                    top: 10,
                    textStyle: {
                        color: '#1BB4FF',
                        // fontWeight: 'normal',
                        opacity: 0.8,
                        fontSize: 16
                    }
                }],
                tooltip: {
                    padding: 5,
                    textStyle: {
                        color: '#1BB4FF'
                    },
                    backgroundColor: '#222',
                    borderColor: '#777',
                    borderWidth: 1,
                    formatter: function (obj) {
                        let value = obj.value;
                        return schema[3].text + '：' + value[3] + '<br>'
                            + schema[1].text + '：' + value[1] + schema[1].unit + '<br>'
                            + schema[0].text + '：' + value[0] + schema[0].unit + '<br>'
                            + schema[2].text + '：' + value[2] + '<br>';
                    }
                },
                grid: {
                    top: 80,
                    containLabel: true,
                    left: 30,
                    right: '110',
                    // bottom: 10,
                },
                xAxis: {
                    type: 'log',
                    name: '上网人数',
                    max: 72043,
                    min: 1,
                    nameGap: 25,
                    nameLocation: 'middle',
                    nameTextStyle: {
                        fontSize: 18
                    },
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#1BB4FF'
                        }
                    },
                    axisLabel: {
                        formatter: '{value}人'
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '平均时长',
                    max: 10.64,
                    min: 0,
                    nameTextStyle: {
                        color: '#1BB4FF',
                        fontSize: 18
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#1BB4FF'
                        }
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        formatter: '{value} h'
                    }
                },
                visualMap: [
                    {
                        show: false,
                        dimension: 3,
                        categories: data.provinceName,
                        calculable: true,
                        precision: 0.1,
                        textGap: 30,
                        textStyle: {
                            color: '#1BB4FF'
                        },
                        inRange: {
                            color: (function () {
                                //颜色有重复
                                let colors = ['#bcd3bb', '#e88f70', '#edc1a5', '#9dc5c8', '#e1e8c8', '#7b7c68', '#e5b5b5', '#f0b489', '#928ea8', '#bda29a'];
                                return colors.concat(colors);
                            })()
                        }
                    }
                ],
                series: [
                    {
                        type: 'scatter',
                        itemStyle: itemStyle,
                        data: data.series[0],
                        symbolSize: function (val) {

                            return sizeFunction(val[2]);
                        }
                    }
                ],
                animationDurationUpdate: 1000,
                animationEasingUpdate: 'quinticInOut'
            },
            options: []
        };

        for (let n = 0; n < data.age.length; n++) {
            option.baseOption.timeline.data.push(data.age[n]);
            option.options.push({
                title: {
                    show: true,
                    'text': data.age[n] + ''
                },
                series: {
                    name: data.age[n],
                    type: 'scatter',
                    itemStyle: itemStyle,
                    data: data.series[n],
                    symbolSize: function (val) {
                        return sizeFunction(val[2]);
                    }
                }
            });
        }

        splashes.setOption(option);

    }
})();
