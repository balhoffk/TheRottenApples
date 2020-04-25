function loadAPI(url)
{
    console.log("called url:", url);
    d3.json(url).then(function(data) {
        writeConsoleLog(url, data);
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
}

loadAPI( "http://young-beach-08773.herokuapp.com/getdf?key=real_feel_over_time");



function initialize_page () {

}


// function buildChart(sample) {
//     var dropdownItemOne = d3.select("#selDatasetOne");
//     var dropdownItemTwo = d3.select("#selDatasetTwo");

//     var CHART = d3.selectAll("#plot").node();

//     var x1 = [];
//     var y1 = [];

//     var x2 = [];
//     var y2 = [];

//     switch(dropdownItemOne) {
//         case "real_feel":
//             x1 = ;
//             y1 = ;
//             break;
//         case "temp":
//             x1 = ;
//             y1 = ;
//             break;
//         case "rain_percentage":
//             x1 = ;
//             y1 = ;
//             break;
//         case "cloud_percentage":
//             x1 = ;
//             y1 = ;
//             break;
//     }

//     switch(dropdownItemTwo) {
//         case "personal_crime":
//             x2 = ;
//             y2 = ;
//             break;
//         case "all_crime":
//             x2 = ;
//             y2 = ;
//             break;
//     }

// }

initialize_page();