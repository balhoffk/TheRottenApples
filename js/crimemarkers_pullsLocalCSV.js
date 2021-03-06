// 1. CREATE THE DATE DROPDOWN FILTER FUNCTION
//path to the csv
var path = "../raw_data/crime_weather.csv"



//create the empty drop-down array for the dates
var dropdownDates = []

//create the drop down with all of the dates so you can choose to look at a single day of data by year
d3.csv(path).then((data) => {

  // create the filter function
  function filterYears(date) {
    return date.year == "2020";
  }
    // filter on the date to narrow down the data for only the year selected
  data = data.filter(filterYears);

  //loop through all the dates and if unique, add to the dropdownDates array
  data.forEach((crime)=> {
    //if the date is already in the array, then it is discarded, otherwise it is added
    if (dropdownDates.indexOf(crime.date) == -1) {

      dropdownDates.push(crime.date);
    };
  });

  //Loop through the dropdownDates and add each element text and value to the dropdown
  dropdownDates.forEach((date) => {
    //create the dropdown element
    var day = document.createElement("option");
    //add the element text and value equal to the date
    day.text = date;
    day.value = date;
    
    //append the date to the selDataset element
    var sel = document.getElementById("selDate");
    sel.appendChild(day);
  });
});




// 2. PULL DROPDOWN DATE SELECTED AND CHANGE AS NEW DATES ARE CHOOSEN
//set default date for the map to pull
var dropdownDate = "2020-01-31";

//on change to filter call getDate()
d3.selectAll("#selDate").on("change", getDate, buildMap);

//function called when DOM changes
function getDate() {

  dropdownDate = d3.select("#selDate").property("value");
  console.log(dropdownDate);
};




// 3. CREATE THE LEAFLET MAP WITH CRIME MARKERS
// Creating map object
var myMap = L.map("map", {
    center: [33.7490, -84.3880],
    zoom: 11
  });
  
  // Adding tile layer
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);


//create function that determines the crime marker to popup
function chooseMarker(crime) {
  switch (crime) {
    case "LARCENY":
      return "pink";
    case "AUTO THEFT":
      return "red";
    case "ROBBERY":
      return "orange";
    case "BURGLARY":
      return "black";
    case "HOMICIDE":
      return "purple";
    case "MANSLAUGHTER":
      return "blue";
    case "AGG ASSAULT":
      return "green";
    default:
      return "white";
  }
}

//read in crime data & create the markers on the map
var path = "../raw_data/crime_weather.csv"

function buildMap() {


  d3.csv(path).then(function(data) {

    //create the filter function
    function filterDates(date) {
      return date.date == String(dropdownDate);
      
    }

    //filter on the date to narrow down the data
    data = data.filter(filterDates);
    console.log(data);

    //loop through the data and create a marker for each crime on the Atlanta map
    data.forEach(function(crime) {

      //create the markers
      L.circleMarker([crime.lat, crime.lon], {
        radius: 13,
        fillColor: chooseMarker(crime.type_crime),
        color: "white",
        fillOpacity: .75,
        weight: 2
      })
        //bind the popup to each marker
        .bindPopup("<h1>" + crime.type_crime + "</h1><hr><h3> Location: "+crime.Neigborhood +"</h3><hr><h3> Temperature(F): "+Math.round(crime.temperature,0)+"</h3><hr><h3>Date: "+crime.date+"</h3>")
        .addTo(myMap);

      })


      // Set up the legend
      //set the legend to be in the topright of the page
      var legend = L.control({position: "topright"});

      //put together the legend function
      legend.onAdd = function() {
      
        //create the "info legend" class in the html
        var div = L.DomUtil.create("div", "info legend");
        
        //list out the category lables and the colors used
        var categories = [" Larceny"," Robbery", " Auto Theft", " Burglary", " Homicide"," Manslaughter", " Agg Assault"];
        var colors = ["pink", "orange", "red","black","purple", "blue", "green"];

        //loop through the categories and push the labels and colors to the legend html
        for (i=0; i<colors.length; i++) {

          div.innerHTML +=
          '<li style=\"background:' + colors[i] +'"></li>' +(categories[i] ? categories[i] +'<br>' : '+')
        }
      return div;
    }
    //add the legend to the map   
    legend.addTo(myMap)

  });


  }

buildMap();




