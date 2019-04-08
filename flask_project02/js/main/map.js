let map = new BMap.Map("map", {
    enableMapClick: false
});

function myMap() {

    map.centerAndZoom(new BMap.Point(107.464396, 30.494215), 8);  // 初始化地图,设置中心点坐标和地图级别

    map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放

    map.setMapStyle({
        style: 'midnight'
    });

    // 添加带有定位的导航控件
    let navigationControl = new BMap.NavigationControl({
        // 靠左上角位置
        anchor: BMAP_ANCHOR_TOP_LEFT,
        // LARGE类型
        type: BMAP_NAVIGATION_CONTROL_LARGE,
        // 启用显示定位
        enableGeolocation: true
    });
    map.addControl(navigationControl);

    let myDrag = new BMapLib.RectangleZoom(map, {
        // followText: "拖拽鼠标进行操作"
    });
    // myDrag.open();  //开启拉框放大
    //myDrag.close();  //关闭拉框放大

    //加载本地数据
    function getMapData() {
        $.ajax({
            cache: false,
            type: "GET",
            url: "/getMapData/" + "mapData.json",
            async: true,
            data: null,
            dataType: "json",
            success: function (result) {
                dealData(result);
            }
        });
    }

    function dealData(res) {
        let data = [], color = null;
        Object.keys(res).forEach(function (d) {
            switch (res[d]["cid"]) {
                case 0:
                    color = 'blue';
                    break;
                case 1:
                    color = 'red';
                    break;
                case 2:
                    color = 'yellow';
                    break;
            }
            data.push({
                geometry: {
                    type: 'Point',
                    coordinates: [res[d]["lng"], res[d]["lat"]]
                },
                people: res[d]["people"],
                name: res[d]['name'],
                cid: res[d]["cid"],
                wb_id: res[d]["wb_id"],
                fillStyle: color,
                stroke: color,
                opacity: 0.8,
                // size:res[d]["people"]/100,
                text: '',
            });
        });

        //此时已经加载完数据
        let dataSet = new mapv.DataSet(data);

        let options = {
            // fillStyle: 'rgba(255, 50, 50, 0.6)',
            maxSize: 20,
            max: 30,
            draw: 'choropleth',
            methods: { // 一些事件回调函数
                click: clickListener,
                mousemove: mouseMoveListener,
            },
        };
        //热力图
        heatMap(res);
        //图例
        legendMap();

        function clickListener(item) {
            console.log(item);
            layer.open({
                title: item['name'],
                type: 2,
                shade: 0,
                maxmin: true,
                shadeClose: false, //点击遮罩关闭层
                area: ['750px', '500px'],
                content: '../../childhtml/' + item['wb_id'],
                zIndex: layer.zIndex,   //重点1
                success: function (layero) {
                    layer.setTop(layero);  //重点2
                }
            });
            // console.log(item['wb_id']);
        }

        //可以实现
        function mouseMoveListener(item) {
            // console.log(item);
        }

        let mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);

    }


    function legendMap() {
        //正常 蓝色
        function legendNormalControl() {
            this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
            this.defaultOffset = new BMap.Size(20, 20);
        }
        legendNormalControl.prototype = new BMap.Control();
        legendNormalControl.prototype.initialize = function (map) {
            let input = document.createElement("input");
            input.type = "radio";
            input.checked = true;
            input.style.cursor = "pointer";
            input.style.border = "1px solid gray";
            input.style.backgroundColor = "white";

            // 绑定事件,点击
            let show = false;
            input.onclick = function (e) {
            };

            let p = document.createElement("p");
            p.appendChild(input);
            // 添加文字说明
            let txt = document.createElement("span");
            txt.innerHTML = "正常";
            txt.style.color = "blue";
            txt.style.opacity = "0.8";
            p.appendChild(txt);

            // 添加DOM元素到地图中
            map.getContainer().appendChild(p);
            // 将DOM元素返回
            return p;
        };
        let normalControl = new legendNormalControl();
        map.addControl(normalControl);
    //异常红色
         function legendSeriousControl() {
            this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
            this.defaultOffset = new BMap.Size(20, 40);
        }
        legendSeriousControl.prototype = new BMap.Control();
        legendSeriousControl.prototype.initialize = function (map) {
            let input = document.createElement("input");
            input.type = "radio";
            input.checked = true;
            input.style.cursor = "pointer";
            input.style.border = "1px solid gray";
            input.style.backgroundColor = "white";

            // 绑定事件,点击
            let show = false;
            input.onclick = function (e) {
            };

            let p = document.createElement("p");
            p.appendChild(input);
            // 添加文字说明
            let txt = document.createElement("span");
            txt.innerHTML = "直接";
            txt.style.color = "red";
            txt.style.opacity = "0.8";
            p.appendChild(txt);

            // 添加DOM元素到地图中
            map.getContainer().appendChild(p);
            // 将DOM元素返回
            return p;
        };
        let seriousControl = new legendSeriousControl();
        map.addControl(seriousControl);
    //异常黄色
        function legendWarnControl() {
            this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
            this.defaultOffset = new BMap.Size(20, 60);
        }
        legendWarnControl.prototype = new BMap.Control();
        legendWarnControl.prototype.initialize = function (map) {
            let input = document.createElement("input");
            input.type = "radio";
            input.checked = true;
            input.style.cursor = "pointer";
            input.style.border = "1px solid gray";
            input.style.backgroundColor = "white";

            // 绑定事件,点击
            let show = false;
            input.onclick = function (e) {
            };

            let p = document.createElement("p");
            p.appendChild(input);
            // 添加文字说明
            let txt = document.createElement("span");
            txt.innerHTML = "套牌";
            txt.style.color = "yellow";
            txt.style.opacity = "0.8";
            p.appendChild(txt);

            // 添加DOM元素到地图中
            map.getContainer().appendChild(p);
            // 将DOM元素返回
            return p;
        };
        let warnControl = new legendWarnControl();
        map.addControl(warnControl);

    }


    function heatMap(res) {


        let points = [];
        Object.keys(res).forEach(function (d) {
            points.push({
                "lng": parseFloat(res[d]["lng"]),
                "lat": parseFloat(res[d]["lat"]),
                "count": res[d]['people'],
            })
        });

        // 定义一个控件类,即function
        function ZoomControl() {
            // 默认停靠位置和偏移量
            this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
            this.defaultOffset = new BMap.Size(20, 0);
        }

// 通过JavaScript的prototype属性继承于BMap.Control
        ZoomControl.prototype = new BMap.Control();

// 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
// 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
        ZoomControl.prototype.initialize = function (map) {
            // 创建一个DOM元素
            let input = document.createElement("input");
            // 设置样式
            input.type = "radio";
            input.checked = true;
            input.style.cursor = "pointer";
            input.style.border = "1px solid gray";
            input.style.backgroundColor = "white";
            // 绑定事件,点击
            let show = false;
            input.onclick = function (e) {
                console.log(e);
                show = !show;
                if (show === false) {
                    input.checked = "";
                    //是否显示热力图
                    heatmapOverlay.hide();
                }
                else {
                    heatmapOverlay.show();
                }
            };

            let p = document.createElement("p");
            p.appendChild(input);
            // 添加文字说明
            let txt = document.createElement("span");
            txt.innerHTML = "热力";
            txt.style.color = "#1BB4FF";
            txt.style.opacity = "0.8";
            p.appendChild(txt);

            // 添加DOM元素到地图中
            map.getContainer().appendChild(p);
            // 将DOM元素返回
            return p;
        }
// 创建控件
        let myZoomCtrl = new ZoomControl();
// 添加到地图当中
        map.addControl(myZoomCtrl);


        //map.enableScrollWheelZoom(); // 允许滚轮缩放


        if (!isSupportCanvas()) {
            alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
        }
//详细的参数,可以查看heatmap.js的文档    
        //https://github.com/pa7/heatmap.js/blob/master/README.md
//参数说明如下:
        /* visible 热力图是否显示,默认为true
             * opacity 热力的透明度,1-100
             * radius 势力图的每个点的半径大小
             * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
             *{
        .2:'rgb(0, 255, 255)',
        .5:'rgb(0, 110, 255)',
        .8:'rgb(100, 0, 255)'
        }
        其中 key 表示插值的位置, 0~1.
            value 为颜色值.
             */
        heatmapOverlay = new BMapLib.HeatmapOverlay({"radius": 20, visible: false});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points, max: 50});

//closeHeatmap();
        function setGradient() {
            /*格式如下所示:
       {
         0:'rgb(102, 255, 0)',
         .5:'rgb(255, 170, 0)',
         1:'rgb(255, 0, 0)'
       }*/
            let gradient = {};
            let colors = document.querySelectorAll("input[type='color']");
            colors = [].slice.call(colors, 0);
            colors.forEach(function (ele) {
                gradient[ele.getAttribute("data-key")] = ele.value;
            });
            heatmapOverlay.setOptions({"gradient": gradient});
        }

//判断浏览区是否支持canvas
        function isSupportCanvas() {
            let elem = document.createElement('canvas');
            return !!(elem.getContext && elem.getContext('2d'));
        }
    }

    getMapData();

}

myMap();

// 用经纬度设置地图中心点
function theLocation(lng,lat) {
    console.log(lng,lat);
    if (lng !== "" && lat !== "") {
        map.clearOverlays();
        let new_point = new BMap.Point(lng, lat);
        let marker = new BMap.Marker(new_point);  // 创建标注
        map.addOverlay(marker);              // 将标注添加到地图中
        map.panTo(new_point);
    }
}
