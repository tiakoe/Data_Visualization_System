(function () {
// app.title = '嵌套环形图';
// 基于准备好的dom，初始化echarts实例
    let pie = echarts.init(document.getElementById('pie'));
    getChild("pie");

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

    function ajaxend(pd) {
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)",
                textStyle: {
                    color: '#1BB4FF'
                },
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: ['本地', '外来', '<18', '18-30', '30-40', '40-50', '>50'],
                textStyle: {
                    color: '#1BB4FF'
                },
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            calculable: false,
            series: [
                {
                    name: '内外地',
                    type: 'pie',
                    selectedMode: 'single',
                    radius: [0, 40],

                    // for funnel
                    x: '60%',
                    width: '60%',
                    funnelAlign: 'right',
                    max: 1825014,

                    itemStyle: {
                        normal: {
                            label: {
                                position: 'inner',
                                color:'#1BB4FF'
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    },
                    data: [
                        {value: pd["inNum"], name: '本地'},
                        {value: pd["outNum"], name: '外来', selected: true}
                    ],

                },
                {
                    name: '年龄区间',
                    type: 'pie',
                    radius: [60, 90],

                    // for funnel
                    x: '60%',
                    y: '60%',
                    width: '35%',
                    funnelAlign: 'right',
                    max: 1825014,
                    data: [
                        {value: pd["age18L"], name: '<18'},
                        {value: pd["age30L"], name: '18-30'},
                        {value: pd["age40L"], name: '30-40'},
                        {value: pd["age50L"], name: '40-50'},
                        {value: pd["age50M"], name: '>50'},
                    ]
                }
            ]
        };

// 使用刚指定的配置项和数据显示图表。
        pie.setOption(option);

    }

})();
