let circleM = echarts.init(document.getElementById('circleM'));

function circleMF(name) {

    getMainData("circleM");

    function getMainData(chart) {
        $.ajax({
            cache: false,
            type: "GET",
            url: "/getMainData/mainData.json/" + chart,
            async: true,
            data: null,
            dataType: "json",
            success: function (result) {
                ajaxend(result);
            }
        });
    }

    function ajaxend(res) {

        let data = res;
        let interval = [1470500, 5295762];
        if (Array.isArray(res) === false) {
            data = res['data'];
            interval = res['interval'];
        }
        // console.log(data,interval);


        //data为一个二维数组

        let hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
            '7a', '8a', '9a', '10a', '11a',
            '12p', '1p', '2p', '3p', '4p', '5p',
            '6p', '7p', '8p', '9p', '10p', '11p'];
        let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
            'Sunday'];

        option = {
            title: {
                text: name+'上网时间',
                // link: 'https://github.com/pissang/echarts-next/graphs/punch-card'
                textStyle: {
                    color: '#1BB4FF',
                    opacity: 0.8,
                    fontSize: 16,
                },
            },
            legend: {
                data: ['人次', 'Top 10'],
                left: 'right',
                textStyle: {
                    color: '#1BB4FF',
                    opacity: 0.8,
                },
            },
            polar: {},
            tooltip: {
                formatter: function (params) {
                    return params.value[2] + ' people in ' + hours[params.value[1]] + ' of ' + days[params.value[0]];
                },
                textStyle: {
                    color: '#1BB4FF',
                    opacity: 0.8,
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
                    color: '#1BB4FF'
                }
            },
            radiusAxis: {
                type: 'category',
                data: days,
                axisLine: {
                    show: false
                },
                axisLabel: {
                    rotate: 45,
                    color: '#1BB4FF'
                },
            },
            series: [{
                name: '人次',
                type: 'scatter',
                textStyle: {
                    color: '#1BB4FF',
                    opacity: 0.8,
                },
                coordinateSystem: 'polar',
                symbolSize: function (val) {
                    let t = (val[2] - interval[0]) / (interval[1] - interval[0]);
                    return Math.pow(t + 1, 3) * 3
                },
                data: data,

                animationDelay: function (idx) {
                    return idx * 5;
                },
                color: '#52ccb5'
            },
                {
                    name: 'Top 10',
                    type: 'scatter',
                    coordinateSystem: 'polar',
                    data: data.sort(function (a, b) {
                        return b[2] - a[2];
                    }).slice(0, 10),
                    symbolSize: function (val) {
                        let t = (val[2] - interval[0]) / (interval[1] - interval[0]);
                        return Math.pow(t + 1, 3) * 3
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
            ]
        };

        circleM.setOption(option);
    }

}

circleMF("外省");

