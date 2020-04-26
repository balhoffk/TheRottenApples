function loadAPI(url)
{
    console.log("called url:", url);
    d3.json(url).then(function(data) {
       // writeConsoleLog(url, data);
    });
}
function writeConsoleLog(url, data)
{
    console.log("Output url:", url);
    console.log("Data:\n", );
    if(data.length > 0){
        loopSize = 5
        if(data.length < 5)
        {
            loopSize = data.length;
        }
        for (var i = 0; i < loopSize; i++) {
            console.log(data[i]);
        }
    } else {
        console.log(data);
    };
    var test_output = Object.values(data);
    var test_list = test_output.map(dictionary => Object.keys(dictionary))
    console.log(test_list);
}

loadAPI( "http://young-beach-08773.herokuapp.com/getdf?key=real_feel_over_time");



function initialize_page () {

}

function get_item_two() {

    switch(dropdownItemTwo) {
        case "personal_crime":
            var url = "http://young-beach-08773.herokuapp.com/getdf?key=personal_crime_over_time"
            d3.json(url).then(function(data) {

                var data_dict = Object.values(data);
                var x_axis = data_dict.map(dictionary => Object.values(dictionary));
                var y_axis = data_dict.map(dictionary => Object.keys(dictionary));

                console.log(x_axis);
                console.log(y_axis);

                x2 = x_axis;
                y2 = y_axis;
            });
            break;
        case "all_crime":
            var url = "http://young-beach-08773.herokuapp.com/getdf?key=all_crime_over_time"
            d3.json(url).then(function(data) {

                var data_dict = Object.values(data);
                var x_axis = data_dict.map(dictionary => Object.values(dictionary));
                var y_axis = data_dict.map(dictionary => Object.keys(dictionary));

                x2 = x_axis;
                y2 = y_axis;
            });
            break;
    };

}

function create_chart() {

    var trace1 = {
        x: x1,
        y: y1,
        name: 'Weather Data',
        type: 'scatter'
      };
      
      var trace2 = {
        x: x2,
        y: y2,
        name: 'Crime Data',
        yaxis: 'y2',
        type: 'scatter'
      };
      
      var data = [trace1, trace2];
      
      var layout = {
        title: 'Weather vs. Crime',
        yaxis: {title: 'Weather Data'},
        yaxis2: {
          title: 'Crime Data',
          titlefont: {color: 'rgb(148, 103, 189)'},
          tickfont: {color: 'rgb(148, 103, 189)'},
          overlaying: 'y',
          side: 'right'
        }
      };
      
      Plotly.newPlot('plot', data, layout);

}


function buildChart() {
    var dropdownItemOne = d3.select("#selDatasetOne").node().value;
    var dropdownItemTwo = d3.select("#selDatasetTwo").node().value;

    console.log(dropdownItemOne);
    console.log(dropdownItemTwo);

    var CHART = d3.selectAll("#plot").node();

    var x1 = [];
    var y1 = [];

    var x2 = [];
    var y2 = [];

    switch(dropdownItemOne) {
        case "real_feel":
            var url = "http://young-beach-08773.herokuapp.com/getdf?key=real_feel_over_time"
            d3.json(url).then(function(data) {

                var data_dict = Object.values(data);
                var x_axis = data_dict.map(dictionary => Object.values(dictionary));
                var y_axis = data_dict.map(dictionary => Object.keys(dictionary));

                console.log(x_axis);
                console.log(y_axis);

                x1 = x_axis;
                y1 = y_axis;

                get_item_two();
                create_chart();
            });
            break;
        case "temp":
            var url = "http://young-beach-08773.herokuapp.com/getdf?key=temp_over_time"
            d3.json(url).then(function(data) {

                var data_dict = Object.values(data);
                var x_axis = data_dict.map(dictionary => Object.values(dictionary));
                var y_axis = data_dict.map(dictionary => Object.keys(dictionary));

                x1 = x_axis;
                y1 = y_axis;

                get_item_two();
                create_chart();
            });
            break;
        case "rain_percentage":
            var url = "http://young-beach-08773.herokuapp.com/getdf?key=rain_over_time"
            d3.json(url).then(function(data) {

                var data_dict = Object.values(data);
                var x_axis = data_dict.map(dictionary => Object.values(dictionary));
                var y_axis = data_dict.map(dictionary => Object.keys(dictionary));

                x1 = x_axis;
                y1 = y_axis;

                get_item_two();
                create_chart();
            });
            break;
        case "cloud_percentage":
            var url = "http://young-beach-08773.herokuapp.com/getdf?key=cloud_over_time"
            d3.json(url).then(function(data) {
 
                var data_dict = Object.values(data);
                var x_axis = data_dict.map(dictionary => Object.values(dictionary));
                var y_axis = data_dict.map(dictionary => Object.keys(dictionary));

                x1 = x_axis;
                y1 = y_axis;

                get_item_two();
                create_chart();
            });
            break;
    }



    console.log(x1);
    console.log(y1);
    console.log(x2);
    console.log(y2);


}

initialize_page();