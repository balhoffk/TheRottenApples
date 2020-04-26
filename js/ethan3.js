

function getXandY(data) {
    var data_dict = Object.values(data);
    var x_axis = data_dict.map(dictionary => Object.keys(dictionary));
    var y_axis = data_dict.map(dictionary => Object.values(dictionary));

    return {
        x: x_axis,
        y: y_axis,
    }
}

function buildChart() {
    var dropdownItemOne = d3.select("#selDatasetOne").node().value;
    var dropdownItemTwo = d3.select("#selDatasetTwo").node().value;

    console.log(dropdownItemOne);
    console.log(dropdownItemTwo);

    switch(dropdownItemOne) {
        case "real_feel":
            var url1 = "http://young-beach-08773.herokuapp.com/getdf?key=real_feel_over_time"
            break;
        case "temp":
            var url1 = "http://young-beach-08773.herokuapp.com/getdf?key=temp_over_time"
            break;
        case "rain_percentage":
            var url1 = "http://young-beach-08773.herokuapp.com/getdf?key=rain_over_time"
            break;
        case "cloud_percentage":
            var url1 = "http://young-beach-08773.herokuapp.com/getdf?key=cloud_over_time"
            break;
    }
    switch(dropdownItemTwo) {
        case "personal_crime":
            var url2 = "http://young-beach-08773.herokuapp.com/getdf?key=personal_crime_over_time"
            break;
        case "all_crime":
            var url2 = "http://young-beach-08773.herokuapp.com/getdf?key=all_crime_over_time"
            break;
    }

    d3.json(url1).then(function(data) {
        var data1 = getXandY(data);
        d3.json(url2).then(function(data) {
            var data2 = getXandY(data);
            
            draw_plot(data1, data2);
        });
    });
}


function draw_plot(data1, data2) {

    console.log("data1:", data1);
    console.log("data2:", data2);

    console.log(data1.x);
    console.log(data1.y);
    console.log(data2.x);
    console.log(data2.y);

    var min_data1 = Math.min.apply(null, data1) 
    var max_data1 = Math.max(data1.y)
    var min_data2 = Math.max(data2.y)
    var max_data2 = Math.max(data2.y)

    

    console.log(min_data1);
    console.log(max_data1);
    console.log(min_data2);
    console.log(max_data2);
    


    var trace1 = {
        x: data1.x[0],
        y: data1.y[0],
        name: 'Weather Data',
        type: 'scatter',
        mode: "lines",
    };
    var trace2 = {
        x: data2.x[0],
        y: data2.y[0],
        name: 'Crime Data',
        yaxis: 'y2',
        type: 'scatter',
        mode: "lines",
    };

    console.log(trace1);
    
    var data = [trace1, trace2];

    console.log(data);

    var layout = {
        title: 'Weather vs. Crime',
        yaxis: {
            title: 'Weather Data',
            autorange: true,
            range: [, ],
            type: 'linear'
        },
        yaxis2: {
            title: 'Crime Data',
            autorange: true,
            range: [86.8700008333, 138.870004167],
            type: 'linear',
            titlefont: {color: 'rgb(148, 103, 189)'},
            tickfont: {color: 'rgb(148, 103, 189)'},
            overlaying: 'y',
            side: 'right'
        },
        xaxis: {
            type: 'date',
            range: ['2009-01-01', '2020-03-31']
        }
    };

    Plotly.newPlot('plot', data, layout);

}
    
function initialize_page () {

    var url1 = "http://young-beach-08773.herokuapp.com/getdf?key=cloud_over_time";
    var url2 = "http://young-beach-08773.herokuapp.com/getdf?key=personal_crime_over_time";

    d3.json(url1).then(function(data) {
        var data1 = getXandY(data);
        d3.json(url2).then(function(data) {
            var data2 = getXandY(data);
            
            draw_plot(data1, data2);
        });
    });

}

initialize_page();