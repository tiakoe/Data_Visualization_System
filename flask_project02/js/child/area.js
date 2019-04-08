(function () {

    let area = echarts.init(document.getElementById('area'));
    getChild("area");

    function getChild(chart) {
        $.ajax({
            cache: false,
            type: "GET",
            url: "/getChild/" + chart,
            async: true,
            data: null,
            dataType: "json",
            success: function (result) {
                console.log(result)
                ajaxend(result);
            }
        });
    }

    function ajaxend(ad) {

        option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                textStyle: {
                    color: '#1BB4FF'
                },
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985',
                        color:'#1BB4FF'
                    },
                }
            },
            legend: {
                data: ['<18', '<60', '>60'],
                textStyle: {
                    color: '#1BB4FF',
                    opacity:0.8,
                },
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    textStyle: {
                        color: '#1BB4FF'
                    },
                    type: 'category',
                    boundaryGap: false,
                    data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                    axisLabel: {
                        color: '#1BB4FF',
                        rotate: -30,
                    },
                },

            ],
            yAxis: [
                {
                    type: 'value',
                    textStyle: {
                        color: '#1BB4FF'
                    },
                    axisLabel: {
                        color: '#1BB4FF',
                        rotate: -30,
                    },
                }
            ],
            series: [
                {
                    textStyle: {
                        color: '#1BB4FF'
                    },
                    name: '<18',
                    type: 'line',
                    stack: '总量',
                    areaStyle: {},
                    data: ad["age18L"]
                },
                {
                    textStyle: {
                        color: '#1BB4FF'
                    },
                    name: '<60',
                    type: 'line',
                    stack: '总量',
                    areaStyle: {},
                    data: ad["age60L"]
                },
                {
                    textStyle: {
                        color: '#1BB4FF'
                    },
                    name: '>60',
                    type: 'line',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    areaStyle: {normal: {}},
                    data: ad["age60M"]
                }
            ]
        };
        area.setOption(option);
    }

})();
