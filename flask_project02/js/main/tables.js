let t_name = ["身份id", "网吧", "性别", "省份", "年龄", "时长h"];
let c_prop = ["id", "wbid", "sex", "areaid", "age", "len"];

(function () {

    getMainTables("tables.json");

    function getMainTables(filename) {
        $.ajax({
            cache: false,
            type: "GET",
            url: "/getMainTables/" + filename,
            async: true,
            data: null,
            dataType: "json",
            success: function (result) {
                ajaxend(result);
            }
        });
    }

    function ajaxend(data) {

        var arr = [];
        arr.push("<table border='1'>");


        arr.push("<tr onclick='onClickTitle()'>" +
            "<td>" + t_name[0] + "</td>" +
            "<td>" + t_name[1] + "</td>" +
            "<td>" + t_name[2] + "</td>" +
            "<td>" + t_name[3] + "</td>" +
            "<td>" + t_name[4] + "</td>" +
            "<td>" + t_name[5] + "</td>" +
            "</tr>");


        for (let i = 0; i < data.length; i++) {
            arr.push("<tr onclick='onDisplayInfo(" + i + "," + String(data[i][c_prop[1]]) + ")'>" +
                "<td>" + data[i][c_prop[0]] + "</td>" +
                "<td>" + data[i][c_prop[1]] + "</td>" +
                "<td>" + data[i][c_prop[2]] + "</td>" +
                "<td>" + data[i][c_prop[3]] + "</td>" +
                "<td>" + data[i][c_prop[4]] + "</td>" +
                "<td>" + data[i][c_prop[5]] + "</td>" +
                "</tr>");
        }
        arr.push("</table>");
        document.getElementById("tables").innerHTML = arr.join('');
    }

})();

function onClickTitle() {

}

function onDisplayInfo(index, wbid) {
    $.ajax({
        cache: false,
        type: "GET",
        url: "/getLocal/" + wbid,
        async: true,
        data: null,
        dataType: "json",
        success: function (res) {
            console.log(res);
            theLocation(res[0], res[1])
        }
    });
}
