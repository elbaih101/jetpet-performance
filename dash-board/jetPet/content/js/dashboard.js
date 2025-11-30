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

    var data = {"OkPercent": 99.6969696969697, "KoPercent": 0.30303030303030304};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8283855225701505, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.964516129032258, 500, 1500, "get fish category"], "isController": false}, {"data": [0.9968354430379747, 500, 1500, "signon-0"], "isController": false}, {"data": [0.9741935483870968, 500, 1500, "get fish product"], "isController": false}, {"data": [0.9966442953020134, 500, 1500, "view order with id"], "isController": false}, {"data": [0.9591194968553459, 500, 1500, "get signon page"], "isController": false}, {"data": [0.5, 500, 1500, "signon"], "isController": false}, {"data": [0.9930555555555556, 500, 1500, "submit new order-1"], "isController": false}, {"data": [0.9965277777777778, 500, 1500, "submit new order-0"], "isController": false}, {"data": [0.015723270440251572, 500, 1500, "create order"], "isController": true}, {"data": [0.9838709677419355, 500, 1500, "add item to cart-0"], "isController": false}, {"data": [0.9868421052631579, 500, 1500, "create new order"], "isController": false}, {"data": [0.9806451612903225, 500, 1500, "add item to cart-1"], "isController": false}, {"data": [0.9873417721518988, 500, 1500, "signon-1"], "isController": false}, {"data": [0.5, 500, 1500, "add item to cart"], "isController": false}, {"data": [0.9868421052631579, 500, 1500, "get new order form"], "isController": false}, {"data": [0.4768211920529801, 500, 1500, "submit new order"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2310, 7, 0.30303030303030304, 379.35064935065, 268, 3245, 303.0, 608.9000000000001, 642.4499999999998, 913.119999999999, 38.30972834919898, 765.345204753889, 29.937459705338483], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["get fish category", 155, 0, 0.0, 319.6193548387097, 275, 1084, 293.0, 314.8, 556.7999999999998, 894.7199999999992, 2.696074168130664, 59.82006286853594, 1.506519770485815], "isController": false}, {"data": ["signon-0", 158, 0, 0.0, 289.5506329113924, 270, 751, 285.0, 305.0, 308.0, 493.1699999999985, 2.6971662683509727, 1.4739125448105155, 1.962827276800956], "isController": false}, {"data": ["get fish product", 155, 0, 0.0, 319.81290322580645, 276, 803, 302.0, 327.0, 544.9999999999998, 783.3999999999999, 2.695605293820977, 60.74349182514217, 1.3983282627693432], "isController": false}, {"data": ["view order with id", 149, 0, 0.0, 316.7852348993288, 278, 564, 316.0, 349.0, 358.5, 485.0, 2.6861850763489517, 71.45716033392526, 1.6137955434567055], "isController": false}, {"data": ["get signon page", 159, 0, 0.0, 340.33333333333326, 275, 1411, 291.0, 318.0, 827.0, 1261.6000000000015, 2.6492493793425194, 59.656957872352834, 1.479138202509289], "isController": false}, {"data": ["signon", 158, 0, 0.0, 597.0949367088608, 548, 1330, 578.0, 617.3, 628.2499999999999, 1187.8099999999993, 2.6840165117977812, 63.854549768970735, 3.6968266388638797], "isController": false}, {"data": ["submit new order-1", 144, 0, 0.0, 331.59722222222206, 303, 593, 328.0, 346.0, 354.0, 585.8000000000002, 2.5571814178150305, 68.02616588160606, 1.673693412372141], "isController": false}, {"data": ["submit new order-0", 144, 0, 0.0, 312.09027777777777, 291, 587, 308.5, 327.5, 332.0, 484.4000000000026, 2.557590181695469, 1.507156312718683, 1.7963456376658438], "isController": false}, {"data": ["create order", 159, 7, 4.40251572327044, 3626.679245283019, 287, 4915, 3601.0, 4249.0, 4436.0, 4879.0, 2.6324939154621765, 556.6606901345634, 19.420253103321247], "isController": true}, {"data": ["add item to cart-0", 155, 0, 0.0, 302.090322580645, 268, 809, 288.0, 311.8, 317.2, 775.3999999999999, 2.6955584153594656, 1.6188805117648082, 1.5931001584727487], "isController": false}, {"data": ["create new order", 152, 0, 0.0, 303.49342105263145, 278, 724, 294.0, 314.0, 321.0, 664.1099999999999, 2.6846111729278155, 66.0837475604479, 2.506853651159505], "isController": false}, {"data": ["add item to cart-1", 155, 0, 0.0, 306.18709677419326, 276, 930, 292.0, 311.4, 320.59999999999997, 749.1199999999992, 2.694949143701643, 64.31078781078848, 1.5453679203251325], "isController": false}, {"data": ["signon-1", 158, 0, 0.0, 307.39873417721503, 276, 1053, 291.0, 311.1, 319.0, 911.9899999999992, 2.69679797910835, 62.684918146634125, 1.7518719170307913], "isController": false}, {"data": ["add item to cart", 155, 0, 0.0, 608.374193548387, 545, 1234, 580.0, 625.0, 875.2, 1170.1599999999999, 2.6821713474882762, 65.61670608809635, 3.1232290098461646], "isController": false}, {"data": ["get new order form", 152, 0, 0.0, 303.4736842105263, 276, 790, 293.0, 316.0, 322.0, 670.7499999999998, 2.6848956953349936, 69.47195211347217, 1.5422349438291558], "isController": false}, {"data": ["submit new order", 151, 7, 4.635761589403973, 631.1721854304639, 292, 920, 636.0, 670.0, 686.2, 916.8799999999999, 2.66737325560855, 69.25052925167815, 3.53829242845787], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 7, 100.0, 0.30303030303030304], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2310, 7, "500/Internal Server Error", 7, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["submit new order", 151, 7, "500/Internal Server Error", 7, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
