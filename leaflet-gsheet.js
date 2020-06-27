function init() {

 var polyURL =
    "https://docs.google.com/spreadsheets/d/1D1pdjJqTVbI-CJt0DmedbxTxVI7l9XGykOm3pzlKArA/edit?usp=sharing";

    //https://docs.google.com/spreadsheets/d/1D1pdjJqTVbI-CJt0DmedbxTxVI7l9XGykOm3pzlKArA/edit?usp=sharing

  let sheet_names = ["map"];

  Tabletop.init({
    key: polyURL,
    wanted: sheet_names,
    callback: function (data) {
      addPolygons(data[ sheet_names[0] ].elements);
    },
  });


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
  pane: '<p id="sidebar-image"><p><h4>details:</h4></p><h4 id="sidebar-contentt" style="color:#800026"></h4><h4 id="sidebar-content"></h4><h5 id="address"></h5> <h5 id="price"></h5>',
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


// These are declared outisde the functions so that the functions can check if they already exist
var polygonLayer;
// The form of data must be a JSON representation of a table as returned by Tabletop.js
// addPolygons first checks if the map layer has already been assigned, and if so, deletes it and makes a fresh one
// The assumption is that the locally stored JSONs will load before Tabletop.js can pull the external data from Google Sheets
function addPolygons(data) {
  if (polygonLayer != null) {
    // If the layer exists, remove it and continue to make a new one with data
    polygonLayer.remove();
  }

  // Need to convert the Tabletop.js JSON into a GeoJSON
  // Start with an empty GeoJSON of type FeatureCollection
  // All the rows will be inserted into a single GeoJSON
  var geojsonStates = {
    type: "FeatureCollection",
    features: []
  };
  for (var row in data) {
    // The Sheets data has a column 'include' that specifies if that row should be mapped
    if (data[row].include == "y") {
      var coords = JSON.parse(data[row].geometry);
      geojsonStates.features.push({
        type: "Feature",
        geometry: {
          type: "MultiPolygon",
          coordinates: coords
        },
        properties: {
          name: data[row].name,
          plot: data[row].plot,
          katha: data[row].Katha,
          status: data[row].status,
          statuscode: data[row].statuscode,
          zone: data[row].zone,
          road: data[row].road,
          price: data[row].price,
          image: data[row].image
        }
      });
    }
  }





// The polygons are styled slightly differently on mouse hovers
  var polygonStyle = { color: "#f78c72", fillColor: "#f78c72" , weight: 1.5, fillOpacity: 1};
  var polygonHoverStyle = { color: "#f5eb5d", fillColor: "#f7ea2f", weight: 1.5, fillOpacity: 1};





  polygonLayer = L.geoJSON(geojsonStates, {
    onEachFeature: function(feature, layer) {

      layer.on({
        // mouseout: function(e) {
        //   e.target.setStyle({  // Need to manually set each property except `fillColor`
        //     color: polygonStyle.color,
        //     weight: polygonStyle.weight,
        //     fillColor: feature.fill_color,  // Use saved color
        //   });
        // },
        // mouseover: function(e) {
        //   e.target.setStyle(polygonHoverStyle);
        // }


      // marker.on({
      click: function(e) {
        L.DomEvent.stopPropagation(e);
        document.getElementById('sidebar-title').innerHTML = e.target.feature.properties.zone + " Zone, Plot: "+ e.target.feature.properties.plot;
        document.getElementById('sidebar-content').innerHTML = "Measurement:    "+ e.target.feature.properties.katha + " Katha";
        document.getElementById('sidebar-contentt').innerHTML = e.target.feature.properties.status;
        document.getElementById('sidebar-image').innerHTML ='<img src="https://'+ e.target.feature.properties.image+'" width="300px">';
        document.getElementById('address').innerHTML = "Address: Plot "+ e.target.feature.properties.plot + ", "+ e.target.feature.properties.road + ", "+ e.target.feature.properties.zone + " Zone, Super Star City, Dhaka.";
        document.getElementById('price').innerHTML = "Price:    "+ e.target.feature.properties.price + " BDT.";
        sidebar.open(panelID);
      }
      });

      let dist_label_html = "<div class='map-dist-label-cont'>" +
        "<div class='map-dist-label-name'>" +
        feature.properties.plot +
        "</div>" //+
        // "<div class='map-dist-label-num'>" +feature.properties.plot+
        // // (map_lang === "bn" ? bn_num(feature.properties.confirmed) : feature.properties.confirmed) +
        // "</div></div>";
        ;

      let label = L.marker(layer.getBounds().getCenter(), {
      icon: L.divIcon({
        className: 'label',
        html: dist_label_html,
      })
    }).addTo(map);
    },
    style: polygonStyle
  }).addTo(map);



  // Set different polygon fill colors based on number of quarantined
  polygonLayer.eachLayer(function (layer) {
    let d = layer.feature.properties.statuscode;
    let fc = d == 2 ? 'red' :
          d == 1   ? 'blue' :
          d == 0    ? 'green' :
          '#FFFFFF';
    layer.setStyle({fillColor: fc});
    layer.feature.fill_color = fc;  // Save color to use again after mouseout
  });

}
