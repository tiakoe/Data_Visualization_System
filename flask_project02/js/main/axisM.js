(function () {
    let axisM = echarts.init(document.getElementById('axisM'));

    getAxisM("mainAxisM.json");

    function getAxisM(filename) {
        $.ajax({
            cache: false,
            type: "GET",
            url: "/getAxisM/" + filename,
            async: true,
            data: null,
            dataType: "json",
            success: function (result) {
                ajaxend(result);
            }
        });
    }

    function ajaxend(data) {
        //data为一个二维数组

        let hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
            '7a', '8a', '9a', '10a', '11a',
            '12p', '1p', '2p', '3p', '4p', '5p',
            '6p', '7p', '8p', '9p', '10p', '11p'];
        let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
            'Sunday'];

        data = data.map(function (item) {
            return [item[1], item[0], item[2]];
        });

        option = {
            title: {
                text: '未成年上网时间',
                textStyle: {
                    color: '#1BB4FF',
                    opacity: 0.8,
                    fontSize: 16,
                },
            },
            legend: {
                data: ['人次'],
                left: 'right',
                textStyle: {
                    color: '#1BB4FF',
                    opacity: 0.8,
                },
            },
            tooltip: {
                position: 'top',
                textStyle: {
                    color: '#1BB4FF'
                },
                formatter: function (params) {
                    return params.value[2] + ' peoples in ' + hours[params.value[0]] + ' of ' + days[params.value[1]];
                }
            },
            grid: {
                left: 2,
                bottom: 30,
                right: 10,
                containLabel: true
            },
            xAxis: {
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
                textStyle: {
                    color: '#1BB4FF',
                    opacity: 0.8,
                },
                axisLabel: {
                    color: '#1BB4FF'
                },
            },
            yAxis: {
                type: 'category',
                data: days,
                axisLine: {
                    show: false
                },
                axisLabel: {
                    color: '#1BB4FF'
                },
                textStyle: {
                    color: '#1BB4FF',
                    opacity: 0.8,
                },
            },
            series: [{
                name: '人次',
                type: 'scatter',
                textStyle: {
                    color: '#1BB4FF',
                    opacity: 0.8,
                },
                symbolSize: function (val) {
                    let t = (val[2] - 10869) / 13902;
                    return Math.pow(t + 1, 3) * 3;
                },
                data: data,
                animationDelay: function (idx) {
                    return idx * 5;
                },
                color: '#52ccb5'
            },
            ]
        };

        axisM.setOption(option);
    }

})();
