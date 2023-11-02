// Store our API endpoint as queryUrl
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(earthquakeData) {
    //Send data.features object to the createFeatures function.
    console.log(earthquakeData);
    createFeatures(earthquakeData.features);
});
// Create markers whose size increases with magnitude and color with depth
function createMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color:"#000",
        weight: 0.5,
        opacity: 0.5,
        fillOpacity: 1
    });
}

function createFeatures(earthquakeData) {
    //Define function to run for each feature in the features array.
    // Give each feature a popup that describes the time and place of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3> Magnitude:</h3> ${feature.properties.mag}<h3> Depth:</h3> ${feature.geometry.coordinates[2]}`);
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
    });

    // Send earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {
    // Create the base layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

    // Create map
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Depth Color Legend</h4>";
        div.innerHTML += '<i style="background: #1a9850"></i><span>(Depth < 10)</span><br>';
        div.innerHTML += '<i style="background: #91cf60"></i><span>(10 < Depth <= 25)</span><br>';
        div.innerHTML += '<i style="background: #d9ef8b"></i><span>(25 < Depth <= 40)</span><br>';
        div.innerHTML += '<i style="background: #fee08b"></i><span>(40 < Depth <= 55)</span><br>';
        div.innerHTML += '<i style="background: #fc8d59"></i><span>(55 < Depth <= 70)</span><br>';
        div.innerHTML += '<i style="background: #d73027"></i><span>(Depth > 70)</span><br>';
      
        return div;
      };
      //add the legend to the map
      legend.addTo(myMap);
}

// Increase marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 5;
}

// Change marker color based on depth
function markerColor(depth) {
    return depth > 90 ? '#d73027' :
            depth > 70 ? '#fc8d59' :
            depth > 50 ? '#fee08b' :
            depth > 30 ? '#d9ef8b' :
            depth > 10 ? '#91cf60' :
                         '#1a9850' ;          
}