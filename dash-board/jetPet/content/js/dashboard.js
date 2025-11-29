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

    var data = {"OkPercent": 99.78031634446397, "KoPercent": 0.21968365553602812};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8317506193228736, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9868421052631579, 500, 1500, "get fish category"], "isController": false}, {"data": [0.9775641025641025, 500, 1500, "signon-0"], "isController": false}, {"data": [0.9967105263157895, 500, 1500, "get fish product"], "isController": false}, {"data": [0.9828767123287672, 500, 1500, "view order with id"], "isController": false}, {"data": [0.967948717948718, 500, 1500, "get signon page"], "isController": false}, {"data": [0.4967948717948718, 500, 1500, "signon"], "isController": false}, {"data": [0.9895833333333334, 500, 1500, "submit new order-1"], "isController": false}, {"data": [0.9930555555555556, 500, 1500, "submit new order-0"], "isController": false}, {"data": [0.01282051282051282, 500, 1500, "create order"], "isController": true}, {"data": [0.9933774834437086, 500, 1500, "add item to cart-0"], "isController": false}, {"data": [0.9900662251655629, 500, 1500, "create new order"], "isController": false}, {"data": [0.9933774834437086, 500, 1500, "add item to cart-1"], "isController": false}, {"data": [0.9903846153846154, 500, 1500, "signon-1"], "isController": false}, {"data": [0.5, 500, 1500, "add item to cart"], "isController": false}, {"data": [0.9900662251655629, 500, 1500, "get new order form"], "isController": false}, {"data": [0.48322147651006714, 500, 1500, "submit new order"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2276, 5, 0.21968365553602812, 389.5307557117749, 271, 3457, 311.0, 621.3000000000002, 668.3000000000002, 957.0700000000002, 37.660919350034746, 755.3907756033442, 29.540183428409506], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["get fish category", 152, 0, 0.0, 316.9276315789473, 278, 848, 298.0, 330.70000000000005, 366.2499999999999, 820.4399999999999, 2.6416865082813397, 58.61238545812405, 1.4760878219555431], "isController": false}, {"data": ["signon-0", 156, 0, 0.0, 309.44871794871796, 274, 831, 290.0, 310.3, 373.7000000000011, 812.7600000000002, 2.662388640475134, 1.453127133324231, 1.9374417335819367], "isController": false}, {"data": ["get fish product", 152, 0, 0.0, 311.0197368421054, 281, 544, 306.0, 337.80000000000007, 348.35, 467.14999999999986, 2.6416865082813397, 59.53125950442308, 1.3703171707450599], "isController": false}, {"data": ["view order with id", 146, 0, 0.0, 336.2465753424657, 281, 802, 326.0, 372.6, 404.0, 792.13, 2.6700316380461224, 71.02751355589693, 1.6040299361295516], "isController": false}, {"data": ["get signon page", 156, 0, 0.0, 341.6794871794871, 279, 1580, 299.0, 340.6, 849.3, 1367.9600000000025, 2.613634459765108, 58.85239091008093, 1.4590272745740278], "isController": false}, {"data": ["signon", 156, 0, 0.0, 620.1538461538463, 555, 1580, 591.0, 637.9000000000001, 855.1500000000001, 1332.050000000003, 2.6495465199225516, 63.02996237983627, 3.6491970154387037], "isController": false}, {"data": ["submit new order-1", 144, 0, 0.0, 346.0625, 307, 672, 335.0, 383.0, 395.75, 636.0000000000009, 2.570739980362403, 68.38744365348568, 1.6824978521378202], "isController": false}, {"data": ["submit new order-0", 144, 0, 0.0, 323.4722222222222, 294, 763, 315.0, 333.0, 340.0, 751.7500000000002, 2.5700976280140644, 1.5142827821306821, 1.805060632663442], "isController": false}, {"data": ["create order", 156, 5, 3.2051282051282053, 3718.448717948718, 866, 5706, 3681.5, 4260.900000000001, 4593.400000000001, 5574.9000000000015, 2.57485227610339, 547.0342519311392, 19.078284638777937], "isController": true}, {"data": ["add item to cart-0", 151, 0, 0.0, 299.27814569536395, 271, 718, 293.0, 313.0, 321.8, 617.1199999999981, 2.681726961123839, 1.6107115622835526, 1.5848696931553803], "isController": false}, {"data": ["create new order", 151, 0, 0.0, 316.11920529801324, 281, 855, 300.0, 342.8, 376.6, 838.8799999999997, 2.679728122948056, 65.96591388045928, 2.5022280231237466], "isController": false}, {"data": ["add item to cart-1", 151, 0, 0.0, 311.0397350993377, 278, 764, 298.0, 339.0, 360.20000000000005, 752.5599999999997, 2.6808699511762097, 63.9730532900577, 1.537238543053706], "isController": false}, {"data": ["signon-1", 156, 0, 0.0, 310.54487179487177, 278, 791, 297.0, 332.0, 353.45000000000005, 785.3000000000001, 2.6650266502665025, 61.94365166307913, 1.7311562275779007], "isController": false}, {"data": ["add item to cart", 151, 0, 0.0, 610.4370860927153, 551, 1057, 599.0, 633.6, 694.2, 1050.7599999999998, 2.6670905751024443, 65.24615943372898, 3.1055570642574537], "isController": false}, {"data": ["get new order form", 151, 0, 0.0, 314.35099337748335, 279, 847, 300.0, 345.40000000000003, 372.40000000000003, 831.3999999999996, 2.6804892336641046, 69.356393427254, 1.5396379009639112], "isController": false}, {"data": ["submit new order", 149, 5, 3.3557046979865772, 658.3691275167782, 307, 1082, 652.0, 710.0, 755.5, 1076.0, 2.6432968475580547, 69.52314561749365, 3.5283688729620892], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 5, 100.0, 0.21968365553602812], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2276, 5, "500/Internal Server Error", 5, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["submit new order", 149, 5, "500/Internal Server Error", 5, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
