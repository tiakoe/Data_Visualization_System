function columnar() {
    let columnar = echarts.init(document.getElementById('columnar'));

    // app.title = '堆叠条形图';


    getMainData("columnar");

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

    function ajaxend(data) {
        option = {
            // color: ['#9DD3FA','#FCD692'],
            title: {
                text: '外省男女人数',
                textStyle: {
                    color: '#1BB4FF',
                    opacity: 0.8,
                    fontSize: 16,
                },
                textAlign: 'left',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    label: {
                        show: true,
                        color: '#1BB4FF'
                    }
                },
                textStyle: {
                    color: '#1BB4FF'
                },
            },
            toolbox: {
                show: true,
                feature: {
                    // mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    // saveAsImage: {show: true}
                }
            },
            dataZoom: [
                {
                    show: true,
                    start: 0,
                    end: 45,
                    height: 20,
                    top: '95%',
                    showDataShadow: true,
                    opacity: 0.8,
                },
                {
                    type: 'inside',
                    start: 0,
                    end: 45,
                    height: 20,
                    top: '95%',
                    showDataShadow: true,
                    opacity: 0.8,
                },
            ],
            legend: {
                top: 5,
                data: ['男', '女'],
                textStyle: {
                    color: '#1BB4FF',
                    opacity: 0.8,
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '8%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data["province"],
                axisLabel: {
                    color: '#1BB4FF',
                    rotate: -30,
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    color: '#1BB4FF'
                }

            },
            series: [
                {
                    name: '男',
                    type: 'bar',
                    stack: '总量',
                    // label: {
                    //     normal: {
                    //         show: true,
                    //         position: 'insideRight'
                    //     },
                    // },
                    data: data["boy"],
                    color: '#52ccb5'
                },
                {
                    name: '女',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight',
                            color: '#1BB4FF'
                        }
                    },
                    data: data["girl"],
                    color: '#ccca9f'
                },

            ]
        };

        columnar.setOption(option);

        columnar.on('click', function (params) {
            console.log(params);
            $.ajax({
                cache: false,
                type: "GET",
                url: "/getMainProvinceData/" + String(params.dataIndex),
                async: true,
                data: null,
                dataType: "json",
                success: function (result) {
                    onClick(String(params.name));
                }
            });
        });
    }
}


new columnar();

function onClick(name) {
    circleMF(name);
}
