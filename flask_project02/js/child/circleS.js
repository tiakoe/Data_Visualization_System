(function () {
    let circleS = echarts.init(document.getElementById('circleS'));


    getChild("circleS");

    function getChild(chart) {
        $.ajax({
            cache: false,
            type: "GET",
            url: "/getChild/" + chart,
            async: true,
            data: null,
            dataType: "json",
            success: function (result) {
                ajaxend(result);
            }
        });
    }

    function ajaxend(data) {
        //data 为一个二维数组
        let hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
            '7a', '8a', '9a', '10a', '11a',
            '12p', '1p', '2p', '3p', '4p', '5p',
            '6p', '7p', '8p', '9p', '10p', '11p'];
        let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
            'Sunday'];

        option = {
            legend: {
                data: ['人次', 'Top 10'],
                left: 'right',
                textStyle: {
                    color: '#1BB4FF',
                    opacity: 0.8
                },
            },
            polar: {},
            tooltip: {
                formatter: function (params) {
                    return params.value[2] + ' peoples in ' + hours[params.value[1]] + ' of ' + days[params.value[0]];
                },
                textStyle: {
                    color: '#1BB4FF'
                },
            },
            angleAxis: {
                type: 'category',
                data: hours,
                boundaryGap: false,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#1BB4FF',
                        type: 'dashed'
                    }
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    rotate: 45,
                    color: '#1BB4FF'
                },
            },
            radiusAxis: {
                textStyle: {
                    color: '#1BB4FF'
                },
                type: 'category',
                data: days,
                axisLine: {
                    show: false
                },
                axisLabel: {
                    rotate: 45,
                    textStyle: {
                        color: '#1BB4FF'
                    },
                }
            },
            series: [
                {
                    name: '人次',
                    type: 'scatter',
                    coordinateSystem: 'polar',
                    textStyle: {
                        color: '#1BB4FF'
                    },
                    symbolSize: function (val) {
                        return Math.log10(val[2]) * Math.log10(val[2]) + 5
                        // return (val[2]/33370)*10+10;
                        // return 20;
                        // return val[2] ;
                    },
                    data: data,
                    animationDelay: function (idx) {
                        return idx * 5;
                    },
                    color:'#52ccb5'
                },
                {
                    name: 'Top 10',
                    type: 'scatter',
                    coordinateSystem: 'polar',
                    data: data.sort(function (a, b) {
                        return b[2] - a[2];
                    }).slice(0, 10),
                    symbolSize: function (val) {
                        return Math.log10(val[2]) * Math.log10(val[2]) + 5
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    itemStyle: {
                        normal: {
                            color: '#f4e925',
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    },
                    zlevel: 1
                },
                {
                    name: 'Top 10',
                    type: 'scatter',
                    coordinateSystem: 'polar',
                    data: data.sort(function (a, b) {
                        return b[2] - a[2];
                    }).slice(0, 10),
                    symbolSize: function (val) {
                        return Math.log10(val[2]) * Math.log10(val[2]) + 5
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    itemStyle: {
                        normal: {
                            color: '#f4e925',
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    },
                    zlevel: 1
                }
            ]
        };

        circleS.setOption(option);
    }


})();
