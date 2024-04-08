// we will be using the all month json
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'

// tile layer map
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// create a baseMaps object to hold the streetmap layer.
let baseMaps = {
    "streets": streets
};

// centering on Taiwan given recent events
var mapLayer = L.map("map-id", {
    center: [24, 121],
    zoom: 8,
    layers: [streets]
});

// create layer for earthquake data
let quakeData = new L.LayerGroup();

// define quakes layer
let quakeLayer = {
    "earthquakes": quakeData
};

// pass quakeLayer
L.control.layers(baseMaps, quakeLayer).addTo(mapLayer);

// get json data and create markers
d3.json(url).then(function (data) {
    L.geoJson(data, {
        // create circle marker at the coordinate of the earthquake
        pointToLayer: function (feature, coord) {
            console.log(`${feature.id} plotted`);
            // popup will show info from 
            return L.circleMarker(coord).bindPopup(`${feature.id}: Magnitude ${feature.properties.mag} earthquake located ${feature.properties.place}`);
        },
        // style is defined in seperate function
        style: style
    }).addTo(quakeData);
    // add earthquakes to map layer
    quakeData.addTo(mapLayer);
});

// create a legend
var legend = L.control({position: 'bottomright'});
legend.onAdd = function(mapLayer){
    var div = L.DomUtil.create("div", "legend");
       div.innerHTML += "<h4>Earthquake Depth Classification</h4>";
       div.innerHTML += '<i style="background: blue"></i><span>Very Shallow (Under 20 km)</span><br>';
       div.innerHTML += '<i style="background: teal"></i><span>Shallow (20-40 km)</span><br>';
       div.innerHTML += '<i style="background: green"></i><span>Deep Shallow (40-70 km)</span><br>';
       div.innerHTML += '<i style="background: yellow"></i><span>Intermediate (70-300 km)</span><br>';
       div.innerHTML += '<i style="background: orange"></i><span>Deep (300-700 km)</span><br>';
       div.innerHTML += '<i style="background: red"></i><span>Deep focus (Over 700 km)</span><br>';
  
    return div;
};
//add the legend to the map
legend.addTo(mapLayer);

// function defining the color and radius of circle markers
function style(feature) {
    // pass neccesary info to variables
    let depth = feature.geometry.coordinates[2];
    let magnitude = feature.properties.mag;
    let color = "";
    // select a color based on depth
    if (depth <= 20)
    color = "blue";
    else if (depth > 20 & depth <= 40)
    color = "teal";
    else if (depth > 40 & depth <= 70)
    color = "green";
    else if (depth > 70 & depth <= 300)
    color = "yellow";
    else if (depth > 300 & depth <= 700)
    color = "orange"
    else 
    color = "red";
    // radius will be 3x magnitude
    return {
        color: color,
        radius: magnitude*3
    }
};