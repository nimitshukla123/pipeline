/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function showChild() {
//    console.log("HERE IN showChild");
}
var countArray = [];
var countJoinArray = [];
function ProcessOperationChange(element) {
//    console.log("HERE IN OPERATION CHANGE")
//    console.log(element.name)
    if (element.value == 'existing') {
        $("#join_div").show();
        if (element.name == 'join_operation') {
            element.nextElementSibling.value = element.options[element.selectedIndex].innerHTML;
            $("#child_payload").show();
            $("#analyze_child_div").show();
//            console.log("HHEERREEEEE");
//            console.log($('#plumber_select').val())
            $.ajax({
                url: '/plumberPipeline/' + $('#plumber_select').val(),
                type: 'GET',
                dataType: 'json',
                success: function (json) {
                    $('#child_title_select').empty();
                    $('#child_title_select').append('<option> </option>');
                    $.each(json, function (i, optionHtml) {
                        //console.log(optionHtml);
                        $('#child_title_select').append('<option value=' + optionHtml['id'] + '>' + optionHtml['stage_title'] + '</option>');
                    });
//                    console.log(json[0])
                    // Adding existing json to the html
                    $('#child_json_value').val(atob(json[0]['data']));
                }
            });
        }
    }
}

function drawChart(json) {
//obj = JSON.parse(json);
    var payload = [];
    for (var i = 0; i < json.length; i++) {
        var obj = JSON.parse(JSON.stringify(json[i]));
//        console.log(obj);
        var eachParentChild = [];
        for (var key in obj) {
//var attrName = key;
            var attrValue = obj[key];
            //eachParentChild.push(attrName);
            eachParentChild.push(attrValue);
        }
        eachParentChild.push('');
        payload.push(eachParentChild);
    }
//    console.log(payload);
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Child');
    data.addColumn('string', 'Parent');
    data.addColumn('string', 'ToolTip');
    data.addRows(payload)
    var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
    chart.draw(data, {allowHtml: true});
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function showParentDiv() {

//                $("#source_group").show();
//                showing the configure source box
    $('#wid-id-configuresource').css('display', 'block');
//    display operations
    $('.showoperations').trigger('click');
}

function showChildAnalyzeDiv() {
    $("#analyze_child_div").show();
}

function showChildDiv() {
//    console.log("HERE select_all")
    $("#destination_group").show();
    $.ajax({
        url: '/plumberPipeline/',
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            //console.log(element.name);
            $('#select_all').empty();
            $('#select_all').append('<option> </option>');
            $.each(json, function (i, optionHtml) {
                $('#select_all').append('<option value=' + optionHtml['id'] + '>' + optionHtml['stage_title'] + '</option>');
            });
        }
    });
}
function processPlumber(element) {

    $('#select-pipeline-chart').hide();
    $('#submitbox').css('display', 'block');
    if (element.name == 'plumber_name_select') {
//        $('#joininputbox').css('display', 'block');
        $('#analyze_parent').html();
        $('#firstinputname').val('');
        $('#joininputjson').val('');
        $('#available_inputs').html('<option>Select Input</option>');
        $('#pipeline-input-tree').empty();
        $('#pipelinename').val(element.options[element.selectedIndex].innerHTML);
        element.nextElementSibling.value = element.options[element.selectedIndex].innerHTML;
        if (element.value !== '') {
            $.ajax({
                url: 'http://spark.noip.me:180/plumber/v0/listModelsWithPlumberId?plumberId=' + element.value,
                type: 'GET',
                dataType: 'json',
                success: function (json) {
                    $('#analyze_parent').html();
                    $('#firstinputname').val('');
                    $('#joininputjson').val('');
                    $('#available_inputs').html('<option>Select Input</option>');
                    $('#wid-id-visu2').css('display', 'block');
                    $('#inputtreebox').css('display', 'block');

                    $('#pipeline-input-tree').empty();
                    $.each(json, function (i, optionHtml) {
//                    $('#stage_title_select').append('<option value=' + optionHtml['id'] + '>' + optionHtml['stage_title'] + '</option>');
                        $('#existingPipeline-name').html('<i class="fa fa-lg fa-folder-open"></i>' + element.options[element.selectedIndex].innerHTML);
                        $('#pipeline-input-tree').append("<li style='cursor:pointer'><span class='inputlis' data-json='" + JSON.stringify(optionHtml['data']) + "' onclick=fillinput(this)><i class='icon-leaf'></i>" + optionHtml['stage_title'] + "</span></li>");
                    });
                    if ($('#pipeline-input-tree').hasClass('joinpage')) {
                    } else {
                        $('#pipeline-input-tree').append("<li><span class='addmoreinput'><i class='icon-leaf'></i>Add <a onclick='addmoreinputs();' href='javascript:void(0);' class='btn btn-default btn-circle'><i class='fa fa-plus'</i></a></span></li>");
                    }
                    drawChart(json);
                }
            });
            $.ajax({
                url: 'http://spark.noip.me:180/plumber/v0/listModelMapsWithPlumberId?plumberId=' + element.value,
                type: 'GET',
                dataType: 'json',
                success: function (json) {

                    drawChart(json);
                }
            });
        } else {
            $('#inputtreebox').css('display', 'none');
            $('#chart-box').css('display', 'none');
            $('#inputjsonbox').css('display', 'none');
        }
    }
    if (element.name == 'plumber_select_visualize') {
        $('#joininputbox').css('display', 'block');
        $('#analyze_parent').html();
        $('#firstinputname').val('');
        $('#joininputjson').val('');
        $('#available_inputs').html('<option>Select Input</option>');
        $('#pipeline-input-tree').empty();
        $('#pipelinename').val(element.options[element.selectedIndex].innerHTML);
        element.nextElementSibling.value = element.options[element.selectedIndex].innerHTML;
        if (element.value !== '') {
            $.ajax({
                url: 'http://spark.noip.me:180/plumber/v0/listModelMapsWithPlumberId?plumberId=' + element.value,
                type: 'GET',
                dataType: 'json',
                success: function (json) {
                    $('#wid-id-chart').show();
                    drawChart(json);
                }
            });
        }
        else {
            $('#wid-id-chart').hide();
        }
    }
    if (element.name == 'plumber_select') {

//                    element.nextElementSibling.value = element.options[element.selectedIndex].innerHTML;
        $('#plumber').val(element.options[element.selectedIndex].innerHTML);
        ;
        //console.log(element)
        $.ajax({
            url: '/plumberPipelineView/' + element.value,
            type: 'GET',
            dataType: 'json',
            success: function (json) {
                $.each(json, function (i, optionHtml) {
                    //console.log(optionHtml)
                    //$('#stage_title_select').append('<option value=' + optionHtml['id'] + '>' + optionHtml['stage_title'] + '</option>');
                });
                drawChart(json);
            }
        });
        $.ajax({
            url: '/plumberPipeline/' + element.value,
            type: 'GET',
            dataType: 'json',
            success: function (json) {
                //console.log(element.name);
                $('#stage_title_select').empty();
                $('#stage_title_select').append('<option> </option>');
                $('#child_title_select').empty();
                $.each(json, function (i, optionHtml) {
                    $('#stage_title_select').append('<option value=' + optionHtml['id'] + '>' + optionHtml['stage_title'] + '</option>');
                });
            }
        });
    }
    if (element.name == 'stage_title_select') {
//                    element.nextElementSibling.value = element.options[element.selectedIndex].innerHTML;
        $('#stage_title').val(element.options[element.selectedIndex].innerHTML);
        ;
        $("#source_group").show();
        //console.log("HERE")
        $.ajax({
            url: '/plumberPipeline/' + $('#plumber_select').val() + '/' + element.value,
            //url:'/plumberPipeline/' + $('#plumber_select').val(),
            type: 'GET',
            dataType: 'json',
            success: function (json) {
                $('#child_title_select').empty();
                $('#child_title_select').append('<option> </option>');
                $.each(json, function (i, optionHtml) {
                    //console.log(optionHtml);
                    $('#child_title_select').append('<option value=' + optionHtml['id'] + '>' + optionHtml['stage_title'] + '</option>');
                });
                console.log(json[0])
                // Adding existing json to the html
                $('#parent_json_value').val(atob(json[0]['data']));
            }
        });
    }
    if (element.name == 'child_title_select') {
        element.nextElementSibling.value = element.options[element.selectedIndex].innerHTML;
        $("#child_payload").show();
        $("#analyze_child_div").show();
        console.log($('#plumber_select').val())
        $.ajax({
            url: '/plumberPipeline/' + $('#plumber_select').val(),
            type: 'GET',
            dataType: 'json',
            success: function (json) {
                $('#child_title_select').empty();
                $('#child_title_select').append('<option> </option>');
                $.each(json, function (i, optionHtml) {
                    //console.log(optionHtml);
                    $('#child_title_select').append('<option value=' + optionHtml['id'] + '>' + optionHtml['stage_title'] + '</option>');
                });
                console.log(json[0])
                // Adding existing json to the html
                $('#child_json_value').val(atob(json[0]['data']));
            }
        });
    }
    if (element.name == 'select_all') {
        console.log("HERE")
        element.nextElementSibling.value = element.options[element.selectedIndex].innerHTML;
        ;
        $("#source_group").show();
        //console.log("HERE")
        $.ajax({
            //url:'/plumberPipeline/' + $('#plumber_select').val() + '/' + element.value,
            url: '/plumberPipeline/',
            type: 'GET',
            dataType: 'json',
            success: function (json) {
                $('#select_all').empty();
                $('#select_all').append('<option> </option>');
                $.each(json, function (i, optionHtml) {
                    //console.log(optionHtml);
                    $('#select_all').append('<option value=' + optionHtml['id'] + '>' + optionHtml['stage_title'] + '</option>');
                });
                console.log(json[0])
                // Adding existing json to the html
                $('#select_all').val(atob(json[0]['data']));
            }
        });
    }
}


//$('select').change(function () {
//    var optionSelected = $(this).find("option:selected");
//    var valueSelected = optionSelected.val();
//    var textSelected = optionSelected.text();
//    console.log("Selected" + textSelected);
//});
function recursiveGetProperty(obj, prop, callback) {
    var keys = [];
    var values = [];
    var kvstore = {}
    // This needs a lot more thought
    if (Array.isArray(obj)) {
        kvstore[prop] = obj.toString();
        callback(kvstore)
        /* WILL HAVE TO REVISIT FOR HANDLING JSON WITHIN ARRAY
         for (var i = 0; i < obj.length; i++) {
         for (var key in obj[i]) {
         if (obj[i].hasOwnProperty(key)) {
         //console.log("Property " + prop + "." + key +  " Value " + obj[key]);
         //callback(prop);
         //keys.push(key);
         //values.push(obj[i][key]);
         }else{
         console.log("HERE  .....")
         }
         }
         }
         */

    } else if (typeof obj == 'object') {
        for (property in obj) {
            //console.log("Property is " + property + " prop is " + prop);
            if (prop) {
                newProperty = prop + "." + property;
            } else {
                newProperty = property;
            }
            if (obj[property] instanceof Object) {

                //console.log("Property" + property);
                recursiveGetProperty(obj[property], newProperty, callback);
            } else {
                //callback(newProperty);
                kvstore[newProperty] = obj[property];
                callback(kvstore);
            }
        }
    }
}
// This function allows us to add a new json
$(function () { //shorthand document.ready function
    $('#parent_json_value,#child_json_value').on('change', function (e) { //use on if jQuery 1.7+
//console.log("Element clicked " );
//console.log(e.target.id);
//        console.log("Analyze id " + e.target.id);
        var keys = [];
        var values = [];
        var kv = {};
        var htmlStr1 = "<table class=\"table table-bordered\"> \
                        <thead> \
                        <th>Field</th> \
                        <th>Enrich</th> \
                        <th>Window</th> \
                        <th>Machine Learn</th> \
                        <th>Dedup</th> \
                        </thead> \
                        <tbody> \
                        ";
        var htmlStr = ' <table class=\"table table-hover\">\
                        <thead> \
                                <th>Field</th> \
                                <th>Data Type</th> \
                                <th>Sample value</th> \
                        </thead> \
                        <tbody> \
                        ';
        e.preventDefault(); //prevent form from submitting
        //var data = $("#form :input").serializeArray();
        if (e.target.id === 'parent_json_value') {
            var data = $('#parent_json_value').serializeArray();
            var radioParent = 'parent_radio_';
            var search = 'parent_search_';
            var analyzeId = 'analyze_parent';
            var operationId = 'operation_id';
        } else if (e.target.id === 'child_json_value') {
            var data = $('#child_json_value').serializeArray();
            var radioParent = 'child_radio_';
            var search = 'child_search_';
            var analyzeId = 'analyze_child';
            var operationId = 'operation_id';
        }
        if (IsJsonString(data[0].value)) {
//console.log(data[0].value); //use the console for debugging, F12 in Chrome, not alerts
//var $records = $('#json-records'),
            myRecords = JSON.parse(data[0].value);
            recursiveGetProperty(myRecords, "", function (obj) {
                // do something with it.
                for (var attrname in obj) {
                    kv[attrname] = obj[attrname];
                }
                keys.push(obj);
            });
//            console.log(kv);
            var count = 0;
            $.each(kv, function (i, key) {
                htmlStr = htmlStr + "<tr> \
                <td> " + i + " </td>\
                <input type ='hidden' name=" + i + " value=" + key + " />\
                            <td><select class='form-control' name=" + radioParent + count + ">\
<option value='String'>String</option><option value='Integer'>Integer</option></select></td>\
                <td> <label / > " + key + " </label></td>\
                </tr>"
                count++;
            });
            htmlStr = htmlStr + "</tbody> \
                        </table>";
            document.getElementById(analyzeId).innerHTML = htmlStr
            operStr = '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1"> \
                                    <li><a href="#">Action</a></li> \
                                    <li><a href="#">Another action</a></li> \
                                    <li><a href="#">Something else here</a></li> \
                                    <li><a href="#">Separated link</a></li> \
                                </ul>';
            document.getElementById(operationId).innerHTML = operStr
            //console.log(htmlStr);
        } else {
            alert("Invalid JSON");
        }
    });
    $('#StreamProcessor').on('change', function () {
        if (this.value == "Storm") {
            $("#storm").show();
            $("#samza").hide();
        } else if (this.value == "Samza") {
            $("#storm").hide();
            $("#samza").show();
        } else if (this.value == "Spark") {
            $("#storm").hide();
            $("#samza").hide();
        }
    });
    $('#joininputjson').on('change', function (e) { //use on if jQuery 1.7+
//console.log("Element clicked " );
//console.log(e.target.id);
//        console.log("Analyze id " + e.target.id);
        var keys = [];
        var values = [];
        var kv = {};
        var htmlStr1 = "<table class=\"table table-bordered\"> \
                        <thead> \
                        <th>Field</th> \
                        <th>Enrich</th> \
                        <th>Window</th> \
                        <th>Machine Learn</th> \
                        <th>Dedup</th> \
                        </thead> \
                        <tbody> \
                        ";
        if ($('#joininputjson').hasClass('filterbox')) {
            var htmlStr = ' <table class=\"table table-hover\">\
                        <thead> \
                                <th>Select</th> \
                                <th>Field</th> \
                                <th>Data Type</th> \
                                <th>Filter</th> \
                                <th>Sample value</th> \
                        </thead> \
                        <tbody> \
                        ';

        } else {

            var htmlStr = ' <table class=\"table table-hover\">\
                        <thead> \
                                <th>Select</th> \
                                <th>Field</th> \
                                <th>Data Type</th> \
                                <th>Value</th> \
                        </thead> \
                        <tbody> \
                        ';
        }
        e.preventDefault(); //prevent form from submitting
        //var data = $("#form :input").serializeArray();
        if (e.target.id === 'parent_json_value') {
            var data = $('#parent_json_value').serializeArray();
            var radioParent = 'parent_radio_';
            var search = 'parent_search_';
            var analyzeId = 'analyze_parent';
            var operationId = 'operation_id';
        } else if (e.target.id === 'child_json_value') {
            var data = $('#child_json_value').serializeArray();
            var radioParent = 'child_radio_';
            var search = 'child_search_';
            var analyzeId = 'analyze_child';
            var operationId = 'operation_id';
        } else if (e.target.id === 'joininputjson') {
            var data = $('#joininputjson').serializeArray();
            var radioParent = 'parent_radio_';
            var search = 'parent_search_';
            var analyzeId = 'analyze_parent';
            var operationId = 'operation_id';
        }
        if (IsJsonString(data[0].value)) {
//console.log(data[0].value); //use the console for debugging, F12 in Chrome, not alerts
//var $records = $('#json-records'),
            myRecords = JSON.parse(data[0].value);
            recursiveGetProperty(myRecords, "", function (obj) {
                // do something with it.
                for (var attrname in obj) {
                    kv[attrname] = obj[attrname];
                }
                keys.push(obj);
            });
//            console.log(kv);
            var count = 0;
            if ($('#joininputjson').hasClass('filterbox')) {
                $('#firstinputcolumns').empty();
                $('#firstinputcolumns').append('<option value="">Select Field</option>');
                $.each(kv, function (i, key) {
                    $('#firstinputcolumns').append('<option value=' + i + '>' + i + '</option>');
                    htmlStr = htmlStr + "<tr> \
                            <td><input id =" + radioParent + count + " onclick='resetSql()' data-attr=" + count + " type='checkbox' name=" + radioParent + count + ">\
                <td id='field_" + count + "'> " + i + " </td>\
                            <td>String</td>\
                            <td><select id='filter_" + count + "' class='form-control' name=" + radioParent + count + ">\
<option value=''>Select Opertation</option><option value='='>Equal</option><option value='<'>Less Than</option><option value='LIKE'>Like</option><option value='!='>Not equal</option><option value='>'>greater</option></select></td>\
                <td> <input class='form-control' id=value_" + count + " type='text' value='" + key + "'/></td>\
                </tr>"
                    countArray.push(count);
                    count++;
                });
            } else {
                $.each(kv, function (i, key) {
                    htmlStr = htmlStr + "<tr> \
                            <td><input type='checkbox' name=" + radioParent + count + "/>\
                <td> " + i + " </td>\
                            <td><select class='form-control' name=" + radioParent + count + ">\
<option value='String'>String</option><option value='Integer'>Integer</option></select></td>\
                <td> <label / > " + key + " </label></td>\
                </tr>"
                    count++;
                });
            }
            htmlStr = htmlStr + "</tbody> \
                        </table>";
            document.getElementById(analyzeId).innerHTML = htmlStr
            operStr = '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1"> \
                                    <li><a href="#">Action</a></li> \
                                    <li><a href="#">Another action</a></li> \
                                    <li><a href="#">Something else here</a></li> \
                                    <li><a href="#">Separated link</a></li> \
                                </ul>';
//            document.getElementById(operationId).innerHTML = operStr
            //console.log(htmlStr);
        } else {
            alert("Invalid JSON");
        }
    });
    $('#joininputjson2').on('change', function (e) { //use on if jQuery 1.7+
//console.log("Element clicked " );
//console.log(e.target.id);
//        console.log("Analyze id " + e.target.id);
        var keys = [];
        var values = [];
        var kv = {};
        var htmlStr1 = "<table class=\"table table-bordered\"> \
                        <thead> \
                        <th>Field</th> \
                        <th>Enrich</th> \
                        <th>Window</th> \
                        <th>Machine Learn</th> \
                        <th>Dedup</th> \
                        </thead> \
                        <tbody> \
                        ";
        if ($('#joininputjson2').hasClass('filterbox')) {
            var htmlStr = ' <table class=\"table table-hover\">\
                        <thead> \
                                <th>Select</th> \
                                <th>Field</th> \
                                <th>Data Type</th> \
                                <th>Filter</th> \
                                <th>Sample value</th> \
                        </thead> \
                        <tbody> \
                        ';

        } else {

            var htmlStr = ' <table class=\"table table-hover\">\
                        <thead> \
                                <th>Select</th> \
                                <th>Field</th> \
                                <th>Data Type</th> \
                                <th>Value</th> \
                        </thead> \
                        <tbody> \
                        ';
        }
        e.preventDefault(); //prevent form from submitting
        //var data = $("#form :input").serializeArray();
        if (e.target.id === 'parent_json_value') {
            var data = $('#parent_json_value').serializeArray();
            var radioParent = 'parent_radio_';
            var radioParent2 = 'parent_radio2_';
            var search = 'parent_search_';
            var analyzeId = 'analyze_parent';
            var operationId = 'operation_id';
        } else if (e.target.id === 'child_json_value') {
            var data = $('#child_json_value').serializeArray();
            var radioParent = 'child_radio_';
            var radioParent2 = 'parent_radio2_';
            var search = 'child_search_';
            var analyzeId = 'analyze_child';
            var operationId = 'operation_id';
        } else if (e.target.id === 'joininputjson2') {
            var data = $('#joininputjson2').serializeArray();
            var radioParent = 'parent_radio_';
            var radioParent2 = 'parent_radio2_';
            var search = 'parent_search_';
            var analyzeId = 'analyze_parent2';
            var operationId = 'operation_id';
        }
        if (IsJsonString(data[0].value)) {
//console.log(data[0].value); //use the console for debugging, F12 in Chrome, not alerts
//var $records = $('#json-records'),
            myRecords = JSON.parse(data[0].value);
            recursiveGetProperty(myRecords, "", function (obj) {
                // do something with it.
                for (var attrname in obj) {
                    kv[attrname] = obj[attrname];
                }
                keys.push(obj);
            });
//            console.log(kv);
            var count = 0;
            if ($('#joininputjson2').hasClass('filterbox')) {
                $('#secondinputcolumns').empty();
                $('#secondinputcolumns').append('<option value="">Select Field</option>');
                $.each(kv, function (i, key) {
                    $('#secondinputcolumns').append('<option value=' + i + '>' + i + '</option>');
                    htmlStr = htmlStr + "<tr> \
                            <td><input id=" + radioParent2 + count + " type='checkbox' name=" + radioParent2 + count + "/>\
                <td id=" + radioParent2 + 'field_' + count + "> " + i + " </td>\
                            <td>String</td>\
                            <td><select id=" + radioParent2 + 'filter_' + count + " class='form-control' name=" + radioParent2 + count + ">\
<option value=''>Select Opertation</option><option value='='>Equal</option><option value='<'>Less Than</option><option value='LIKE'>Like</option><option value='!='>Not equal</option><option value='>'>greater</option></select></td>\
                <td> <input class='form-control' id=" + radioParent2 + 'input_' + count + " type='text' value='" + key + "'/></td>\
                </tr>"
                    countJoinArray.push(count);
                    count++;
                });
            } else {
                $.each(kv, function (i, key) {
                    htmlStr = htmlStr + "<tr> \
                            <td><input type='checkbox' name=" + radioParent + count + "/>\
                <td> " + i + " </td>\
                            <td><select class='form-control' name=" + radioParent + count + ">\
<option value='String'>String</option><option value='Integer'>Integer</option></select></td>\
                <td> <label / > " + key + " </label></td>\
                </tr>"
                    count++;
                });
            }
            htmlStr = htmlStr + "</tbody> \
                        </table>";
            document.getElementById(analyzeId).innerHTML = htmlStr
            operStr = '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1"> \
                                    <li><a href="#">Action</a></li> \
                                    <li><a href="#">Another action</a></li> \
                                    <li><a href="#">Something else here</a></li> \
                                    <li><a href="#">Separated link</a></li> \
                                </ul>';
//            document.getElementById(operationId).innerHTML = operStr
            //console.log(htmlStr);
        } else {
            alert("Invalid JSON");
        }
    });

    $('#StreamProcessor').on('change', function () {
        if (this.value == "Storm") {
            $("#storm").show();
            $("#samza").hide();
        } else if (this.value == "Samza") {
            $("#storm").hide();
            $("#samza").show();
        } else if (this.value == "Spark") {
            $("#storm").hide();
            $("#samza").hide();
        }
    });
});
//additional works

function performjoinoperations() {
    $('#wid-id-configuresource').css('display', 'block');
    $('#wid-id-joinoperation').toggle();
    $('.join-box').toggle();
    $('.joinlinkselector').toggle();
}

function addjoinrow() {
    $elm = $('.join-box');
    $elm.css('id', Math.random());
    $('#join-box-1').after("<div id='" + Math.random() + "'class='jarviswidget join-box jarviswidget-sortable' data-widget-deletebutton='false' data-widget-custombutton='false' data-widget-editbutton='false' role='widget'>" + $elm.html() + '</div>');
}

//new pipeline

function proceednew() {
    if (!$('#pipelinename').val()) {

        alert('Please Enter Pipeline Name');
    } else {
        $('#procnwpipe').css('display', 'none')
        $('#submitbtnbox').css('display', 'block')

        $.ajax({
            url: 'http://spark.noip.me:180/plumber/v1/createPlumber',
            type: 'POST',
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({"plumber": $('#pipelinename').val()}),
            success: function (response) {
                if (response.status == 'succesful') {
                    $('#create-pipeline').dialog('open');
                    $('#jsonload').css('display', 'block')
                    $('#overviewbox').css('display', 'block')
                    $('#submitbox').css('display', 'block')
                    $('#pipelinenameset').html('<b>' + $('#pipelinename').val() + '</b>');
                } else if (response.status == 'Failed') {
                    alert('Unable to create the plumber');
                } else {
                    alert('Unable to create the plumber! please try after some time');
                }
            }
        });

    }
}


function addinputs() {
    if (!$('#inputname').val() || !$('#pipelinename').val() || !$('#parent_json_value').val()) {
        alert('Please Enter Input Name & JSON Payload')
    } else {
        $.ajax({
            url: 'http://spark.noip.me:180/plumber/v1/createModel',
            type: 'POST',
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({"plumber": $('#pipelinename').val(), "title": $('#inputname').val(), "parentModel": "", "data": JSON.parse($('#parent_json_value').val())}),
            success: function (response) {
                if (response.status == 'successful') {
                    $('#dialog_simple').dialog('open');
                } else if (response.status == 'Failed') {
                    alert('Unable to save inputs');
                } else {
                    alert('Unable to save inputs! please try after some time');
                }
            }
        });
    }
    return false;
}

function addmoreinputs() {

    $('#jsonload').css('display', 'block');
}

//function addinputexisting() {
//    if (!$('#parent_json_value').val()) {
//        alert('Please Enter JSON Payload')
//    } else {
//        $('#dialog_simple').dialog('open');
//    }
//    return false;
//
//}

function proceedjoin() {
    $('#joininputbox').css('display', 'block');
    $('#selectinputsbox').css('display', 'block');

}

function  showjoininputboxfinal() {
    if ($('.inputlis').hasClass('activeinput')) {
        $('#addjoinbtn').toggleClass('btn-warning');
        $('#addjoinbtn').toggleClass('btn-success');
        $('#addjoinbtn').toggleClass('join-is-active');
        $('#selectsqlpreview').toggle();
        $('#wid-id-rgt-inputs').toggle();
        $('#sqlpreview').hide();
        $('#wid-id-joinprv').hide();
        $('#select-query-build').toggle();
        jQuery('.sql-data').find('code').html('SQL preview shown here');
        updateJoinInputList();
    } else {
        alert('first Select Input');
    }


}

function joinprogressshow() {
    if ($('#available_inputs').val() != '') {
        $('#sqlpreview').toggle();
        $('#wid-id-joinprv').toggle();

    } else {
        alert('Select Input to JOIN')
    }

}

//set selected input
function fillinput(e) {
          $('#joininputbox').css('display', 'block');

    $('#firstinputname').val($(e).text());
    $('#joininputjson').val($(e).attr('data-json'));
    $('#joininputjson').trigger('change');
    $('.inputlis').css('background', 'white');
    $('.inputlis').removeClass('activeinput').addClass('inactiveinput');
    $(e).css('background', 'greenyellow');
    $(e).addClass('activeinput').removeClass('inactiveinput');
    $('#sqlpreview').hide();
    $('#wid-id-joinprv').hide();
    $('#select-query-build').removeAttr('disabled');
    updateJoinInputList();


}

function updateJoinInputList() {
    var options = '<option value="">Select Input</input>';
    $('.inactiveinput').each(function () {
        options += '<option value=' + $(this).attr('data-json') + '>' + $(this).text() + '</option>';
    });
    $('#joininputjson2').val('');
    $('#analyze_parent2').html('');
    $('#available_inputs').html(options);
}

function getselectedinputs(e) {
    if ($(e).val() != '') {

        $('#joininputjson2').val($(e).val());
        $('#joininputjson2').trigger('change');
    } else {
        $('#analyze_parent2').html('');
        $('#joininputjson2').val('');
    }

}

function updateSql(e) {
    
          $('#prvbx').css('display', 'block');

    var sqlObjSelect = '';
    var tabel = $('#firstinputname').val();
    jQuery.each(countArray, function (i, val) {
        if (jQuery('#parent_radio_' + val).prop('checked')) {
            var fieldname = $('#field_' + val).html();
            var filter = $('#filter_' + val).val();
            var value = $('#value_' + val).val();
            if (filter !== '') {
                if (sqlObjSelect !== '') {
                    sqlObjSelect = sqlObjSelect.field(fieldname).where(fieldname + filter + ' "' + value + '"');
                } else {
                    sqlObjSelect = squel.select().field(fieldname).from(tabel).where(fieldname + filter + ' "' + value + '"');
                }
            } else {
                if (sqlObjSelect !== '') {
                    sqlObjSelect = sqlObjSelect.field(fieldname);
                } else {
                    sqlObjSelect = squel.select().field(fieldname).from(tabel);
                }
            }
        }

    });
    jQuery('.sql-data').find('code').html(sqlObjSelect.toString());
}
function resetSql() {
    sqlObjSelect = '';
}

function createJoinSql() {
    var sqlObjSelect = '';
    var tabel1 = $('#firstinputname').val();
    var selectedFieldTable1 = 0;
    var selectedFieldTable2 = 0;
    var tabel2 = $('#available_inputs :selected').text();
    var joinColumn1 = $('#firstinputcolumns').val();
    var joinCodition = $('#conditionsselect').val();
    var joinColumn2 = $('#secondinputcolumns').val();
    jQuery.each(countArray, function (i, val) {
        if (jQuery('#parent_radio_' + val).prop('checked')) {
            selectedFieldTable1 = 1;
            var fieldname = $.trim($('#field_' + val).text());
            var filter = $('#filter_' + val).val();
            var value = $('#value_' + val).val();
            if (filter !== '') {
                if (sqlObjSelect !== '') {
                    sqlObjSelect = sqlObjSelect.field(tabel1 + '.' + fieldname).where(tabel1 + '.' + fieldname + filter + ' "' + value + '"');
                } else {
                    sqlObjSelect = squel.select().field(tabel1 + '.' + fieldname).where(tabel1 + '.' + fieldname + filter + ' "' + value + '"');
                }
            } else {
                if (sqlObjSelect !== '') {
                    sqlObjSelect = sqlObjSelect.field(tabel1 + '.' + fieldname);
                } else {
                    sqlObjSelect = squel.select().field(tabel1 + '.' + fieldname);
                }
            }
        }

    });
    jQuery.each(countJoinArray, function (i, val) {
        if (jQuery('#parent_radio2_' + val).prop('checked')) {
            selectedFieldTable2 = 1;
            var fieldname = $.trim($('#parent_radio2_field_' + val).text());
            var filter = $('#parent_radio2_filter_' + val).val();
            var value = $('#parent_radio2_input_' + val).val();
            if (filter !== '') {
                if (sqlObjSelect !== '') {
                    sqlObjSelect = sqlObjSelect.field(tabel2 + '.' + fieldname).where(tabel2 + '.' + fieldname + filter + ' "' + value + '"');
                } else {
                    sqlObjSelect = squel.select().field(tabel2 + '.' + fieldname).where(tabel2 + '.' + fieldname + filter + ' "' + value + '"');
                }
            } else {
                if (sqlObjSelect !== '') {
                    sqlObjSelect = sqlObjSelect.field(tabel2 + '.' + fieldname);
                } else {
                    sqlObjSelect = squel.select().field(tabel2 + '.' + fieldname);
                }
            }
        }

    });
    if (selectedFieldTable2 == 0 && selectedFieldTable1 == 0) {
        alert('Please select fields from inputs!');
    } else {
        if (joinCodition !== '' && joinColumn1 !== '' && joinColumn2 !== '') {
            var condition = tabel1 + '.' + joinColumn1 + ' = ' + tabel2 + '.' + joinColumn2;
            console.log(condition);
            if (sqlObjSelect !== '') {
                sqlObjSelect = sqlObjSelect
                        .from(tabel1)
                        .join(tabel2, null, condition)
                        .toString();
            } else {
                sqlObjSelect = squel.select()
                        .from(tabel1)
                        .join(tabel2, null, condition)
                        .toString();
            }

        } else {
            alert('Please select join condition!');
        }
    }


    jQuery('#sqlpreview').find('code').html(sqlObjSelect.toString());

}

function addmoreinputs(){
                        $('#chart-box').toggle();
                    $('#inputjsonbox').toggle();
}