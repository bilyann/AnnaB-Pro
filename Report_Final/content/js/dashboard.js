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

    var data = {"OkPercent": 50.037602630319526, "KoPercent": 49.962397369680474};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5000917953594577, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5007100031555696, 500, 1500, "HTTP Request - GET Character by ID"], "isController": false}, {"data": [0.500199619408266, 500, 1500, "HTTP Request - DELETE Character"], "isController": false}, {"data": [0.4983627363575306, 500, 1500, "HTTP Request - GET All Characters"], "isController": false}, {"data": [0.5006119731592397, 500, 1500, "HTTP Request - POST Create Character"], "isController": false}, {"data": [0.5005749393385209, 500, 1500, "HTTP Request - PUT Update Character"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2091609, 1045018, 49.962397369680474, 10.759388585534195, 0, 3082, 3.0, 9.0, 11.0, 36.0, 5242.114681416839, 6651.606050662311, 485.2585714658297], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP Request - GET Character by ID", 418308, 208802, 49.91585147785842, 7.297615632500485, 0, 3068, 1.0, 9.0, 12.0, 38.0, 1048.3988601418055, 1307.3872383438973, 82.00280220230353], "isController": false}, {"data": ["HTTP Request - DELETE Character", 418296, 208791, 49.914653738022835, 9.205892478053684, 0, 3059, 1.0, 9.0, 13.0, 53.9800000000032, 1048.3845500274442, 1309.5652386660977, 94.27788187499844], "isController": false}, {"data": ["HTTP Request - GET All Characters", 418381, 209816, 50.14950487713352, 22.356622313154695, 0, 1179, 31.0, 57.0, 61.0, 67.0, 1048.57130683883, 1415.2392695483534, 80.65375208176171], "isController": false}, {"data": ["HTTP Request - POST Create Character", 418319, 208810, 49.91645132064286, 6.79431725549172, 0, 3082, 1.0, 7.0, 11.0, 33.0, 1048.426429271398, 1313.933834598067, 110.20120990493037], "isController": false}, {"data": ["HTTP Request - PUT Update Character", 418305, 208799, 49.91549228433799, 8.140512305614218, 0, 3068, 1.0, 8.0, 12.0, 37.9900000000016, 1048.3939688618434, 1305.5559297586944, 118.12869540828731], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404/Not Found", 6034, 0.5774063221877518, 0.28848604112910203], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Can't assign requested address", 1038984, 99.42259367781224, 49.67391132855137], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2091609, 1045018, "Non HTTP response code: java.net.BindException/Non HTTP response message: Can't assign requested address", 1038984, "404/Not Found", 6034, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["HTTP Request - GET Character by ID", 418308, 208802, "Non HTTP response code: java.net.BindException/Non HTTP response message: Can't assign requested address", 207799, "404/Not Found", 1003, "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request - DELETE Character", 418296, 208791, "Non HTTP response code: java.net.BindException/Non HTTP response message: Can't assign requested address", 205758, "404/Not Found", 3033, "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request - GET All Characters", 418381, 209816, "Non HTTP response code: java.net.BindException/Non HTTP response message: Can't assign requested address", 209816, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request - POST Create Character", 418319, 208810, "Non HTTP response code: java.net.BindException/Non HTTP response message: Can't assign requested address", 208810, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request - PUT Update Character", 418305, 208799, "Non HTTP response code: java.net.BindException/Non HTTP response message: Can't assign requested address", 206801, "404/Not Found", 1998, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
