(function () {
    let calendar = echarts.init(document.getElementById('calendar'));

    getChild( "calendar");

    function getChild( chart) {
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

        option = {
            backgroundColor: '#08304A',

            title: {
                top: 10,
                text: '网吧每日上网人数',
                // subtext: '数据纯属虚构',
                left: 'left',
                textStyle: {
                    color: '#1BB4FF'
                }
            },
            tooltip: {
                trigger: 'item',
                textStyle: {
                    color: '#1BB4FF'
                },
            },
            legend: {
                top: '10',
                left: '200',
                data: ['人次', 'Top 10'],
                textStyle: {
                    color: '#1BB4FF'
                }
            },
            calendar: [
                {
                top: 65,
                left: 'center',
                range: ['2016-10-01', '2016-12-31'],
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#000',
                        width: 4,
                        type: 'solid'
                    }
                },
                yearLabel: {
                    // formatter: '{start}  1st',
                    textStyle: {
                        color: '#1BB4FF'
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#323c48',
                        borderWidth: 1,
                        borderColor: '#111'
                    }
                }
            }],
            series: [
                {
                    name: '人次',
                    type: 'scatter',
                    coordinateSystem: 'calendar',
                    data: data,
                    symbolSize: function (val) {
                        return (val[1]/204)*30;
                        // return 18;
                        // return val[1];
                    },
                    itemStyle: {
                        normal: {
                            color: '#52ccb5'
                        }
                    },

                },
                {
                    name: '人次',
                    type: 'scatter',
                    coordinateSystem: 'calendar',
                    calendarIndex: 1,
                    data: data,
                    symbolSize: function (val) {
                        return (val[1]/204)*30;
                        // return 18;
                        // return val[1] ;
                    },
                    itemStyle: {
                        normal: {
                            color: '#52ccb5'
                        }
                    }
                },
                {
                    name: 'Top 10',
                    type: 'effectScatter',
                    coordinateSystem: 'calendar',
                    calendarIndex: 1,
                    data: data.sort(function (a, b) {
                        return b[1] - a[1];
                    }).slice(0, 10),
                    symbolSize: function (val) {
                        return (val[1]/204)*30+5;
                        // return 18;
                        // return val[1] ;
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
                    type: 'effectScatter',
                    coordinateSystem: 'calendar',
                    data: data.sort(function (a, b) {
                        return b[1] - a[1];
                    }).slice(0, 10),
                    symbolSize: function (val) {
                        return (val[1]/204)*30+5;
                        // return 18;
                        // return val[1] ;
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


        calendar.setOption(option);
    }


})();
