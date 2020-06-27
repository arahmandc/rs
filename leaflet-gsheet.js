function init() {

	var pointsURL = 'https://docs.google.com/spreadsheets/d/1EDXmzu9H6sd6Hn1Pf8Tvd9jLtr7HaHNWAdxOTsSylhM/edit?usp=sharing';

	Tabletop.init( { key: pointsURL,
    callback: addPoints,
    simpleSheet: true } ); 

 // var polyURL =
 //    "https://docs.google.com/spreadsheets/d/1wCeXWKTKHbhUh4f75ZHc9kAsz8Zp451xnMNeaGAp4bo/edit?usp=sharing";

 //  let sheet_names = ["map"];

 //  Tabletop.init({
 //    key: polyURL,
 //    wanted: sheet_names,
 //    callback: function (data) {
 //      addPolygons(data[ sheet_names[0] ].elements);
 //    },
 //  });


}





window.addEventListener('DOMContentLoaded', init);

var map = L.map('map').setView([25.39098,88.99309], 16);//25.38985,88.99026

// var hash = new L.Hash(map);

var basemap = L.tileLayer('Tiles/{z}/{x}/{y}.png', {
  attribution: '',
  subdomains: 'abcd',
  maxZoom: 19,
  minZoom:16
});
basemap.addTo(map);


var sidebar = L.control.sidebar({
  container: 'sidebar',
  closeButton: true,
  position: 'right'
}).addTo(map);



panelID = 'my-info-panel'
var panelContent = {
  id: panelID,
  tab: '<i class="fa fa-bars active"></i>',
  // pane: '<p id="sidebar-content"></p><a href="https://arahmandc.github.io/dump/img/1498800820242.jpg" target="_blank"><img src="https://arahmandc.github.io/dump/img/1498800820242.jpg" width="300px"></a> <p>details:</p><p id="sidebar-contentt"></p>',
  pane: '<p id="sidebar-content"></p><p id="sidebar-image"><p><h4>details:</h4></p><p id="sidebar-contentt"></p>',
  title: '<h2 id="sidebar-title">Please Select a Plot.</h2>',

};
sidebar.addPanel(panelContent);

map.on('click', function (feature, layer) {
  sidebar.close(panelID);
});


L.control.scale().addTo(map);



map.zoomControl.setPosition('bottomleft');


  var bounds_group = new L.featureGroup([]);
  function setBounds() {
  if (bounds_group.getLayers().length) {
    map.fitBounds(bounds_group.getBounds());
  }
  map.setMaxBounds([[25.3849,88.9808],[25.3959,89.0026]]);
}
setBounds();


// // These are declared outisde the functions so that the functions can check if they already exist
// var polygonLayer;
// // The form of data must be a JSON representation of a table as returned by Tabletop.js
// // addPolygons first checks if the map layer has already been assigned, and if so, deletes it and makes a fresh one
// // The assumption is that the locally stored JSONs will load before Tabletop.js can pull the external data from Google Sheets
// function addPolygons(data) {
//   if (polygonLayer != null) {
//     // If the layer exists, remove it and continue to make a new one with data
//     polygonLayer.remove();
//   }

//   // Need to convert the Tabletop.js JSON into a GeoJSON
//   // Start with an empty GeoJSON of type FeatureCollection
//   // All the rows will be inserted into a single GeoJSON
//   var geojsonStates = {
//     type: "FeatureCollection",
//     features: []
//   };
//   for (var row in data) {
//     // The Sheets data has a column 'include' that specifies if that row should be mapped
//     if (data[row].include == "y") {
//       var coords = JSON.parse(data[row].geometry);
//             total_conf += parseInt(data[row].cases);
//             total_recv += parseInt(data[row].rcov);
//             total_dead += parseInt(data[row].death);
//             today_conf += parseInt(data[row].todayconf);
//             today_rcov += parseInt(data[row].todayrcov);
//             today_dead += parseInt(data[row].todaydeath);
//       geojsonStates.features.push({
//         type: "Feature",
//         geometry: {
//           type: "MultiPolygon",
//           coordinates: coords
//         },
//         properties: {
//           name: data[row].name,
//           confirmed: data[row].confirmed,
//           deaths: data[row].deaths,
//           recover: data[row].recover,
//           quarantine: data[row].quarantine,
//           male: data[row].male,
//           female: data[row].female,
//           child: data[row].child,
//           web: data[row].web,
//           image: data[row].image
//         }
//       });
//     }
//   }





// // The polygons are styled slightly differently on mouse hovers
//   var polygonStyle = { color: "#f78c72", fillColor: "#f78c72" , weight: 1.5, fillOpacity: 1};
//   var polygonHoverStyle = { color: "#f5eb5d", fillColor: "#f7ea2f", weight: 1.5, fillOpacity: 1};





//   polygonLayer = L.geoJSON(geojsonStates, {
//     onEachFeature: function(feature, layer) {

//       layer.on({
//         mouseout: function(e) {
//           e.target.setStyle({  // Need to manually set each property except `fillColor`
//             color: polygonStyle.color,
//             weight: polygonStyle.weight,
//             fillColor: feature.fill_color,  // Use saved color
//           });
//         },
//         mouseover: function(e) {
//           e.target.setStyle(polygonHoverStyle);
//         }
//       });

//       var html = (map_lang === "bn" ? ("নিশ্চিত: <b>" + bn_num(feature.properties.confirmed)) : ('Confirmed: <b>' + feature.properties.confirmed)) + '</b><br/>';
//       html += (map_lang === "bn" ? ("সুস্থ: <b>" + bn_num(feature.properties.recover)) : ('Recovered: <b>' + feature.properties.recover)) + '</b><br/>';
//       html += (map_lang === "bn" ? ("মৃত: <b>" + bn_num(feature.properties.deaths)) : ('Death: <b>' + feature.properties.deaths)) + '</b><br/>';
//       html += '<h6 class="more-button">' + (!feature.properties.web ? "" : (map_lang === "bn" ? "<a href='dhaka.html' target='_blank'>বিস্তারিত তথ্য</a>" : "<a href='../dhaka.html' target='_blank'>Details</a>")) +'</h6>';
//       layer.bindPopup(html);

//       let dist_label_html = "<div class='map-dist-label-cont'>" +
//         "<div class='map-dist-label-name'>" +
//         feature.properties.name +
//         "</div>" +
//         "<div class='map-dist-label-num'>" +
//         (map_lang === "bn" ? bn_num(feature.properties.confirmed) : feature.properties.confirmed) +
//         "</div></div>";

//       let label = L.marker(layer.getBounds().getCenter(), {
//       icon: L.divIcon({
//         className: 'label',
//         html: dist_label_html,
//       })
//     }).addTo(map);
//     },
//     style: polygonStyle
//   }).addTo(map);



//   // Set different polygon fill colors based on number of quarantined
//   polygonLayer.eachLayer(function (layer) {
//     let d = layer.feature.properties.confirmed;
//     let fc = d > 50 ? '#800026' :
//           // d > 200  ? '#E31A1C' :
//           // d > 50  ? '#BD0026' :
//           d > 25   ? '#FC4E2A' :
//           d > 10   ? '#FD8D3C' :
//           // d > 10   ? '#FEB24C' :
//           d > 0    ? '#FED976' :
//           '#FFFFFF';
//     layer.setStyle({fillColor: fc});
//     layer.feature.fill_color = fc;  // Save color to use again after mouseout
//   });






var pointGroupLayer;

var geojsonStates = {
    'type': 'FeatureCollection',
    'features': []
  };



function addPoints(data) {
  if (pointGroupLayer != null) {
    pointGroupLayer.remove();
  }
  pointGroupLayer = L.layerGroup().addTo(map);

  for(var row = 0; row < data.length; row++) {
    var marker = L.marker([data[row].lat, data[row].long]).addTo(pointGroupLayer);

     marker.feature = {
      properties: {
        location: data[row].location_name,
        category: data[row].category,
        level: data[row].level,
        imagepath: data[row].Image2,
      }
    };
    marker.on({
      click: function(e) {
        L.DomEvent.stopPropagation(e);
        document.getElementById('sidebar-title').innerHTML = e.target.feature.properties.location;
        document.getElementById('sidebar-content').innerHTML = e.target.feature.properties.category;
        document.getElementById('sidebar-contentt').innerHTML = e.target.feature.properties.level;
        document.getElementById('sidebar-image').innerHTML = e.target.feature.properties.imagepath;
        sidebar.open(panelID);
      }
    });

    var icon = L.AwesomeMarkers.icon({
      icon: 'info-sign',
      iconColor: 'white',
      markerColor: getColor(data[row].category),
      prefix: 'glyphicon',
      extraClasses: 'fa-rotate-0'
    });
    marker.setIcon(icon);
  }
}





function getColor(type) {
  switch (type) {
    case 'Coffee Shop':
      return 'green';
    case 'Restaurant':
      return 'blue';
    default:
      return 'green';
  }
}
