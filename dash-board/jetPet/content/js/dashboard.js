/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.78204010462075, "KoPercent": 0.21795989537925023};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8310118803768947, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9837662337662337, 500, 1500, "get fish category"], "isController": false}, {"data": [0.9775641025641025, 500, 1500, "signon-0"], "isController": false}, {"data": [0.9967320261437909, 500, 1500, "get fish product"], "isController": false}, {"data": [0.9897959183673469, 500, 1500, "view order with id"], "isController": false}, {"data": [0.9745222929936306, 500, 1500, "get signon page"], "isController": false}, {"data": [0.4935897435897436, 500, 1500, "signon"], "isController": false}, {"data": [0.9897260273972602, 500, 1500, "submit new order-1"], "isController": false}, {"data": [0.9863013698630136, 500, 1500, "submit new order-0"], "isController": false}, {"data": [0.01592356687898089, 500, 1500, "create order"], "isController": true}, {"data": [0.9803921568627451, 500, 1500, "add item to cart-0"], "isController": false}, {"data": [0.9933774834437086, 500, 1500, "create new order"], "isController": false}, {"data": [0.9901960784313726, 500, 1500, "add item to cart-1"], "isController": false}, {"data": [0.9807692307692307, 500, 1500, "signon-1"], "isController": false}, {"data": [0.5, 500, 1500, "add item to cart"], "isController": false}, {"data": [0.9967105263157895, 500, 1500, "get new order form"], "isController": false}, {"data": [0.48344370860927155, 500, 1500, "submit new order"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2294, 5, 0.21795989537925023, 388.6190061028763, 270, 3898, 308.0, 616.0, 662.0, 1088.0, 37.90983606557377, 760.6187292912975, 29.741824839494644], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["get fish category", 154, 0, 0.0, 315.0519480519482, 276, 1004, 300.0, 344.0, 369.25, 911.5999999999981, 2.656409017991134, 58.93983311735636, 1.4846115055715592], "isController": false}, {"data": ["signon-0", 156, 0, 0.0, 310.4871794871797, 272, 867, 290.0, 308.0, 374.75000000000125, 842.4900000000002, 2.6708212775428444, 1.4599700495642796, 1.9438791806485303], "isController": false}, {"data": ["get fish product", 153, 0, 0.0, 312.4379084967321, 278, 740, 304.0, 337.0, 351.39999999999986, 566.1200000000026, 2.674077181208054, 60.26028626717177, 1.3874062489076482], "isController": false}, {"data": ["view order with id", 147, 0, 0.0, 324.0680272108842, 278, 598, 315.0, 351.20000000000005, 387.9999999999999, 582.1600000000003, 2.6781810231744645, 71.24417350445452, 1.6092429128406938], "isController": false}, {"data": ["get signon page", 157, 0, 0.0, 332.3375796178343, 276, 1550, 298.0, 345.40000000000003, 491.39999999999833, 1335.9799999999955, 2.6148798321147217, 58.884095217226566, 1.4600699938375443], "isController": false}, {"data": ["signon", 156, 0, 0.0, 634.2499999999999, 550, 2027, 590.5, 662.3, 1083.3, 1819.5200000000025, 2.658124318429662, 63.23954375255589, 3.6616101779750543], "isController": false}, {"data": ["submit new order-1", 146, 0, 0.0, 343.041095890411, 306, 832, 332.0, 385.1000000000001, 405.90000000000003, 722.4900000000002, 2.606584303363565, 69.34113309424767, 1.7061424895558095], "isController": false}, {"data": ["submit new order-0", 146, 0, 0.0, 319.1643835616438, 292, 585, 313.5, 329.6, 345.55000000000007, 579.83, 2.606444702311881, 1.5364188163884673, 1.8307735651164867], "isController": false}, {"data": ["create order", 157, 5, 3.1847133757961785, 3693.1019108280243, 280, 5489, 3666.0, 4234.400000000001, 4549.899999999998, 5356.179999999998, 2.5896907216494847, 550.7385148195876, 19.20805412371134], "isController": true}, {"data": ["add item to cart-0", 153, 0, 0.0, 306.516339869281, 270, 808, 291.0, 314.6, 352.79999999999853, 795.0400000000002, 2.674357629785003, 1.6077520046757559, 1.5808158811833595], "isController": false}, {"data": ["create new order", 151, 0, 0.0, 305.13907284768214, 279, 579, 298.0, 326.40000000000003, 359.8, 552.9999999999995, 2.6962359831440614, 66.37005001874866, 2.5179214319512893], "isController": false}, {"data": ["add item to cart-1", 153, 0, 0.0, 307.59477124183013, 277, 795, 297.0, 321.4, 355.29999999999995, 766.3800000000005, 2.677352745598992, 63.89040448478458, 1.5355234563661497], "isController": false}, {"data": ["signon-1", 156, 0, 0.0, 323.4807692307693, 277, 1460, 298.0, 343.20000000000016, 378.30000000000024, 1400.7200000000007, 2.6726515787489933, 62.124191833421854, 1.736410407279549], "isController": false}, {"data": ["add item to cart", 153, 0, 0.0, 614.3921568627449, 549, 1122, 590.0, 651.0, 881.4999999999998, 1107.4200000000003, 2.6578650221488753, 65.02320067532355, 3.0954138799617823], "isController": false}, {"data": ["get new order form", 152, 0, 0.0, 304.8289473684212, 278, 735, 302.5, 318.70000000000005, 361.0, 553.7399999999996, 2.6858445390772707, 69.4963309839556, 1.543004297130387], "isController": false}, {"data": ["submit new order", 151, 5, 3.3112582781456954, 651.019867549669, 297, 1184, 644.0, 707.6, 774.8000000000006, 1181.3999999999999, 2.679490364481669, 70.50757335881215, 3.577916080712993], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 5, 100.0, 0.21795989537925023], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2294, 5, "500/Internal Server Error", 5, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["submit new order", 151, 5, "500/Internal Server Error", 5, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
