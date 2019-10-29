<!-- Earthquake Data - Last 7 Days -->
var apiKey = "pk.eyJ1IjoibXVkb2ltZWgiLCJhIjoiY2sxOGh4aHR2MDI2dTNubnYwdGFxODU3cCJ9.-6eTzrDAvJd0gwWwIwityw"
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson

console.log("working")
var graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
 attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
 maxZoom: 18,
 id: "mapbox.streets",
 accessToken: apiKey
});

var map = L.map("map", {
    center: [
      40.7, -94.5
    ],
    zoom: 3
   });

   graymap.addTo(map);

   d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {
    function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: getColor(feature.properties.mag),
          color: "#000000",
          radius: getRadius(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
      }

      function getColor(magnitude) {
        switch (true) {
        case magnitude > 5:
          return "#ea2c2c";
        case magnitude > 4:
          return "#ea822c";
        case magnitude > 3:
          return "#ee9c00";
        case magnitude > 2:
          return "#eecc00";
        case magnitude > 1:
          return "#d4ee00";
        default:
          return "#98ee00";
        }
      }

      function getRadius(magnitude) {
          if (magnitude === 0){
            return 1;
          }
            return magnitude * 4

      }
     
      L.geoJson(data, {
        // We turn each feature into a circleMarker on the map.
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
        },
        // We set the style for each circleMarker using our styleInfo function.
        style: styleInfo,
        // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
        onEachFeature: function(feature, layer) {
          layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
      }).addTo(map);

     // Here we create a legend control object.
 var legend = L.control({
   position: "bottomright"
 });
      legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [0, 1, 2, 3, 4, 5];
        var colors = [
          "#98ee00",
          "#d4ee00",
          "#eecc00",
          "#ee9c00",
          "#ea822c",
          "#ea2c2c"
        ];

    // Looping through our intervals to generate a label with a colored square for each interval.
   for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }
  return div;
};    
   });