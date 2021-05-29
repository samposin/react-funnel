import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

mapboxgl.accessToken =
  "pk.eyJ1IjoiaGFtemFoYWQiLCJhIjoiY2trY2YybmozMGo3bzJ1b2FpcTh4ZmdpeiJ9.urpUJIK3zKrxCaEKXNe9Rw";

function Map() {
  const mapContainer = useRef();
  const [filtersAndScores, setFiltersAndScores] = useState([]);

  const loadMarker = (map) => {
    // var monument = [-77.0353, 38.8895];
    var monument = [-83.11664408899672, 29.88990754517599];

    var popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false
    }).setHTML(
        '   <p class="heading">Region</p>\
            <p class="sub-heading">North Central Florida </p.\
        '
    );

    // create DOM element for the marker
    var el = document.createElement('div');
    el.id = 'marker';

    // create the marker
    new mapboxgl.Marker(el)
        .setLngLat(monument)
        .setPopup(popup) // sets a popup on this marker
        .addTo(map);
  }

  const loadRegionSourceAndLayers = (mapInstance) => {

    var minZoom = 3;
    var maxZoom = 7;

    mapInstance.addSource(`region-source`, {
      type: "vector",
      url: `mapbox://hamzahad.5i53xg4c`,
    });

    mapInstance.addLayer(
      {
        'id': `region-layer`,
        'type': "fill",
        'source': `region-source`,
        "source-layer": `Region-43v2r5`,
        'maxzoom': maxZoom,
        'minzoom': minZoom,
        'paint': {
          'fill-color': "#E2E3F0",
          "fill-opacity": 0.2,
        },
        filter : ["==", "$type", "Polygon"]
      }
    );
    
    mapInstance.addLayer({
      'id': `region-layer-outline`,
      'type': "line",
      'source': `region-source`,
      "source-layer": `Region-43v2r5`,
      'maxzoom': maxZoom,
      'minzoom': minZoom,
      'paint': {
        "line-color": "rgba(50, 54, 67, 0.27)",
        "line-opacity": 1,
        "line-width": 1
      },
      filter: ["==", "$type", "Polygon"],
    });
    
    mapInstance.addLayer({
      'id': `region-layer-hover`,
      'type': "fill",
      'source': `region-source`,
      'maxzoom': maxZoom,
      'minzoom': minZoom,
      "source-layer": `Region-43v2r5`,
      'layout': {},
      'paint': {
        "fill-color": "rgba(87, 95, 249, 0.13)",
        "fill-opacity": 1,
      },
      filter: ["==", "polygonId", ""],
    });
    
    mapInstance.addLayer({
      'id': `region-layer-border-hover`,
      'type': "line",
      'source': `region-source`,
      'maxzoom': maxZoom,
      'minzoom': minZoom,
      "source-layer": `Region-43v2r5`,
      'paint': {
        "line-color": "rgb(87, 95, 249)",
        "line-width": 2,
      },
      filter: ["==", "polygonId", ""],
    });
    
    mapInstance.on("click", `region-layer`, function (e) {
    
    
      var features = e.features[0];
      var props = features.properties;
      var coordinates = features.geometry.coordinates;
      // new mapboxgl.Popup()
      // .setLngLat(coordinates)
      // .setHTML("<div className='p-3'><h3>" + props.Name + "</h3></div>")
      // .addTo(mapInstance);
    });

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });
    
    mapInstance.on("mousemove", `region-layer`, (e) => {
      var features = e.features;
      // Single out the first found feature.
      var ft = features[0];
      var showTooltip = ft && ft.properties;

      if (showTooltip) {
        // Change the cursor style as a UI indicator.
        mapInstance.getCanvas().style.cursor = 'pointer';
        
        var Region = e.features[0].properties.Region;
        var html = `<div class="popup-text"><strong>Region </strong>${Region}</div>`
        popup.setLngLat(e.lngLat).setHTML(html).addTo(mapInstance);
        mapInstance.setFilter(`region-layer-hover`, [
          "in",
          "polygonId",
          ft.properties.polygonId,
        ]);
    
        mapInstance.setFilter(`region-layer-border-hover`, [
          "in",
          "polygonId",
          ft.properties.polygonId,
        ]);
      } else {
        mapInstance.setFilter(`region-layer-hover`, ["in", "polygonId", ""]);
        mapInstance.setFilter(`region-layer-border-hover`, [
          "in",
          "polygonId",
          "",
        ]);
      }
    });
    mapInstance.on("mouseleave", `region-layer`, function () {
      mapInstance.getCanvas().style.cursor = '';
      popup.remove();
      mapInstance.setFilter(`region-layer-hover`, ["in", "polygonId", ""]);
      mapInstance.setFilter(`region-layer-border-hover`, [
        "in",
        "polygonId",
        "",
      ]);
    });

  }

  const loadCountySourceAndLayers = (mapInstance) => {

    var minZoom = 7;
    var maxZoom = 9;

    mapInstance.addSource(`county-source`, {
      type: "vector",
      url: `mapbox://hamzahad.b9i2wbp0`,
    });

    mapInstance.addLayer(
      {
        'id': `county-layer`,
        'type': "fill",
        'source': `county-source`,
        "source-layer": `County-2ftyno`,
        'maxzoom': maxZoom,
        'minzoom': minZoom,
        'paint': {
          'fill-color': "#E2E3F0",
          "fill-opacity": 0.2,
        },
        filter : ["==", "$type", "Polygon"]
      }
    );
    
    mapInstance.addLayer({
      'id': `county-layer-outline`,
      'type': "line",
      'source': `county-source`,
      "source-layer": `County-2ftyno`,
      'maxzoom': maxZoom,
      'minzoom': minZoom,
      'paint': {
        "line-color": "rgba(50, 54, 67, 0.27)",
        "line-opacity": 1,
        "line-width": 1
      },
      filter: ["==", "$type", "Polygon"],
    });
    
    mapInstance.addLayer({
      'id': `county-layer-hover`,
      'type': "fill",
      'source': `county-source`,
      'maxzoom': maxZoom,
      'minzoom': minZoom,
      "source-layer": `County-2ftyno`,
      'layout': {},
      'paint': {
        "fill-color": "rgba(87, 95, 249, 0.13)",
        "fill-opacity": 1,
      },
      filter: ["==", "polygonId", ""],
    });
    
    mapInstance.addLayer({
      'id': `county-layer-border-hover`,
      'type': "line",
      'source': `county-source`,
      'maxzoom': maxZoom,
      'minzoom': minZoom,
      "source-layer": `County-2ftyno`,
      'paint': {
        "line-color": "rgb(87, 95, 249)",
        "line-width": 2,
      },
      filter: ["==", "polygonId", ""],
    });
    
    mapInstance.on("click", `county-layer`, function (e) {
    
    
      var features = e.features[0];
      var props = features.properties;
      var coordinates = features.geometry.coordinates;
      // new mapboxgl.Popup()
      // .setLngLat(coordinates)
      // .setHTML("<div className='p-3'><h3>" + props.Name + "</h3></div>")
      // .addTo(mapInstance);
    });

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });
    
    mapInstance.on("mousemove", `county-layer`, (e) => {
      var features = e.features;
      // Single out the first found feature.
      var ft = features[0];
      var showTooltip = ft && ft.properties;

      if (showTooltip) {
        // Change the cursor style as a UI indicator.
        mapInstance.getCanvas().style.cursor = 'pointer';
        
        var county = e.features[0].properties.County;
        var html = `<div class="popup-text"><strong>County </strong>${county}</div>`
        popup.setLngLat(e.lngLat).setHTML(html).addTo(mapInstance);
        mapInstance.setFilter(`county-layer-hover`, [
          "in",
          "polygonId",
          ft.properties.polygonId,
        ]);
    
        mapInstance.setFilter(`county-layer-border-hover`, [
          "in",
          "polygonId",
          ft.properties.polygonId,
        ]);
      } else {
        mapInstance.setFilter(`county-layer-hover`, ["in", "polygonId", ""]);
        mapInstance.setFilter(`county-layer-border-hover`, [
          "in",
          "polygonId",
          "",
        ]);
      }
    });
    mapInstance.on("mouseleave", `county-layer`, function () {
      mapInstance.getCanvas().style.cursor = '';
      popup.remove();
      mapInstance.setFilter(`county-layer-hover`, ["in", "polygonId", ""]);
      mapInstance.setFilter(`county-layer-border-hover`, [
        "in",
        "polygonId",
        "",
      ]);
    });

  }

  const loadCitySourceAndLayers = (mapInstance) => {

    var minZoom = 9;
    var maxZoom = 12;

    mapInstance.addSource(`city-source`, {
      type: "vector",
      url: `mapbox://hamzahad.bsewhgay`,
    });

    mapInstance.addLayer(
      {
        'id': `city-layer`,
        'type': "fill",
        'source': `city-source`,
        "source-layer": `City-d7ern7`,
        'maxzoom': maxZoom,
        'minzoom': minZoom,
        'paint': {
          'fill-color': "#E2E3F0",
          "fill-opacity": 0.2,
        },
        filter : ["==", "$type", "Polygon"]
      }
    );
    
    mapInstance.addLayer({
      'id': `city-layer-outline`,
      'type': "line",
      'source': `city-source`,
      "source-layer": `City-d7ern7`,
      'maxzoom': maxZoom,
      'minzoom': minZoom,
      'paint': {
        "line-color": "rgba(50, 54, 67, 0.27)",
        "line-opacity": 1,
        "line-width": 1
      },
      filter: ["==", "$type", "Polygon"],
    });
    
    mapInstance.addLayer({
      'id': `city-layer-hover`,
      'type': "fill",
      'source': `city-source`,
      'maxzoom': maxZoom,
      'minzoom': minZoom,
      "source-layer": `City-d7ern7`,
      'layout': {},
      'paint': {
        "fill-color": "rgba(87, 95, 249, 0.13)",
        "fill-opacity": 1,
      },
      filter: ["==", "polygonId", ""],
    });
    
    mapInstance.addLayer({
      'id': `city-layer-border-hover`,
      'type': "line",
      'source': `city-source`,
      'maxzoom': maxZoom,
      'minzoom': minZoom,
      "source-layer": `City-d7ern7`,
      'paint': {
        "line-color": "rgb(87, 95, 249)",
        "line-width": 2,
      },
      filter: ["==", "polygonId", ""],
    });
    
    mapInstance.on("click", `city-layer`, function (e) {
    
    
      var features = e.features[0];
      var props = features.properties;
      var coordinates = features.geometry.coordinates;
      // new mapboxgl.Popup()
      // .setLngLat(coordinates)
      // .setHTML("<div className='p-3'><h3>" + props.Name + "</h3></div>")
      // .addTo(mapInstance);
    });

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });
    
    mapInstance.on("mousemove", `city-layer`, (e) => {
      var features = e.features;
      // Single out the first found feature.
      var ft = features[0];
      var showTooltip = ft && ft.properties;

      if (showTooltip) {
        // Change the cursor style as a UI indicator.
        mapInstance.getCanvas().style.cursor = 'pointer';
        
        var city = e.features[0].properties.City;
        var html = `<div class="popup-text"><strong>City </strong>${city}</div>`
        popup.setLngLat(e.lngLat).setHTML(html).addTo(mapInstance);
        mapInstance.setFilter(`city-layer-hover`, [
          "in",
          "polygonId",
          ft.properties.polygonId,
        ]);
    
        mapInstance.setFilter(`city-layer-border-hover`, [
          "in",
          "polygonId",
          ft.properties.polygonId,
        ]);
      } else {
        mapInstance.setFilter(`city-layer-hover`, ["in", "polygonId", ""]);
        mapInstance.setFilter(`city-layer-border-hover`, [
          "in",
          "polygonId",
          "",
        ]);
      }
    });
    mapInstance.on("mouseleave", `city-layer`, function () {
      mapInstance.getCanvas().style.cursor = '';
      popup.remove();
      mapInstance.setFilter(`city-layer-hover`, ["in", "polygonId", ""]);
      mapInstance.setFilter(`city-layer-border-hover`, [
        "in",
        "polygonId",
        "",
      ]);
    });

  }

  const loadNeighborhoodSourceAndLayers = (mapInstance) => {

    var minZoom = 12;
    var maxZoom = 24;
    
    mapInstance.addSource(`neighborhood-source`, {
      type: "vector",
      url: `mapbox://hamzahad.4tdbv2s6`,
    });

    mapInstance.addLayer(
      {
        'id': `neighborhood-layer`,
        'type': "fill",
        'source': `neighborhood-source`,
        "source-layer": `Neighborhood-89bxo1`,
        'maxzoom': maxZoom,
        'minzoom': minZoom,
        'paint': {
          'fill-color': "#E2E3F0",
          "fill-opacity": 0.2,
        },
        filter : ["==", "$type", "Polygon"]
      }
    );
    
    mapInstance.addLayer({
      'id': `neighborhood-layer-outline`,
      'type': "line",
      'source': `neighborhood-source`,
      "source-layer": `Neighborhood-89bxo1`,
      'maxzoom': maxZoom,
      'minzoom': minZoom,
      'paint': {
        "line-color": "rgba(50, 54, 67, 0.27)",
        "line-opacity": 1,
        "line-width": 1
      },
      filter: ["==", "$type", "Polygon"],
    });
    
    mapInstance.addLayer({
      'id': `neighborhood-layer-hover`,
      'type': "fill",
      'source': `neighborhood-source`,
      'maxzoom': maxZoom,
      'minzoom': minZoom,
      "source-layer": `Neighborhood-89bxo1`,
      'layout': {},
      'paint': {
        "fill-color": "rgba(87, 95, 249, 0.13)",
        "fill-opacity": 1,
      },
      filter: ["==", "polygonId", ""],
    });
    
    mapInstance.addLayer({
      'id': `neighborhood-layer-border-hover`,
      'type': "line",
      'source': `neighborhood-source`,
      'maxzoom': maxZoom,
      'minzoom': minZoom,
      "source-layer": `Neighborhood-89bxo1`,
      'paint': {
        "line-color": "rgb(87, 95, 249)",
        "line-width": 2,
      },
      filter: ["==", "polygonId", ""],
    });
    
    mapInstance.on("click", `neighborhood-layer`, function (e) {
    
    
      var features = e.features[0];
      var props = features.properties;
      var coordinates = features.geometry.coordinates;
      // new mapboxgl.Popup()
      // .setLngLat(coordinates)
      // .setHTML("<div className='p-3'><h3>" + props.Name + "</h3></div>")
      // .addTo(mapInstance);
    });

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });
    
    mapInstance.on("mousemove", `neighborhood-layer`, (e) => {
      var features = e.features;
      // Single out the first found feature.
      var ft = features[0];
      var showTooltip = ft && ft.properties;

      if (showTooltip) {
        // Change the cursor style as a UI indicator.
        mapInstance.getCanvas().style.cursor = 'pointer';
        
        var neighborhood = e.features[0].properties.Neighborhood;
        var html = `<div class="popup-text"><strong>Neighborhood </strong>${neighborhood}</div>`
        popup.setLngLat(e.lngLat).setHTML(html).addTo(mapInstance);
        mapInstance.setFilter(`neighborhood-layer-hover`, [
          "in",
          "polygonId",
          ft.properties.polygonId,
        ]);
    
        mapInstance.setFilter(`neighborhood-layer-border-hover`, [
          "in",
          "polygonId",
          ft.properties.polygonId,
        ]);
      } else {
        mapInstance.setFilter(`neighborhood-layer-hover`, ["in", "polygonId", ""]);
        mapInstance.setFilter(`neighborhood-layer-border-hover`, [
          "in",
          "polygonId",
          "",
        ]);
      }
    });
    mapInstance.on("mouseleave", `neighborhood-layer`, function () {
      mapInstance.getCanvas().style.cursor = '';
      popup.remove();
      mapInstance.setFilter(`neighborhood-layer-hover`, ["in", "polygonId", ""]);
      mapInstance.setFilter(`neighborhood-layer-border-hover`, [
        "in",
        "polygonId",
        "",
      ]);
    });

  }

  const getAllFiltersScoresFromJson = async () => {
    let json = await axios.get("../all-filters-scores-from-db.json");
    // return json.data;
    setFiltersAndScores(json.data);
  }

  // useEffect(() => {
  //   filtersAndScores.map((obj)=> {
      // console.log(filtersAndScores)
  //   })
  // }, [filtersAndScores]);


  const loadMarkers = (mapInstance) => {

    var minZoom = 3;
    var maxZoom = 7;

    mapInstance.addSource(`all-layer`, {
      type: "vector",
      url: `mapbox://hamzahad.44pt4lkm`,
    });


    const images =[
      {url: './icons/20.png', id: 'image_20'},
      {url: './icons/40.png', id: 'image_40'},
      {url: './icons/60.png', id: 'image_60'},
      {url: './icons/80.png', id: 'image_80'},
      {url: './icons/100.png', id: 'image_100'}
    ];
    images.map(img => {
      mapInstance.loadImage(img.url, function (error, res) {
        if (error) throw error;
          mapInstance.addImage(img.id, res)
      })
    });

      mapInstance.addLayer({
        id: 'exit-devices-layer',
        type: 'symbol',
        source: 'all-layer',
        "source-layer": "All_In_One-41lsuj",
        // 'maxzoom': maxZoom,
        // 'minzoom': minZoom,
        layout: {
          "icon-size": 0.068,
          "text-field": ["concat", ["get", "Score"], "%"],
          "icon-image": "image_20",
          // [
          //   'case',
          //   ['<=', ["get", "Score"], 20],
          //   "image_20",
          //   ['<=', ["get", "Score"], 40],
          //   "image_20",
          //   ['<=', ["get", "Score"], 60],
          //   "image_20",
          //   ['<=', ["get", "Score"], 80],
          //   "image_20",
          //   [">", ["get", "Score"], 80],
          //   "image_20",
          //   "image_20"
          // ]
        }
      });

      // [
      //   "case",
      //   ["<=", ["get", "Score"], 20],
      //   "image_20",
      //   ["<=", ["get", "Score"], 40],
      //   "image_40",
      //   ["<=", ["get", "Score"], 60],
      //   "image_60",
      //   ["<=", ["get", "Score"], 80],
      //   "image_80",
      //   [">", ["get", "Score"], 80],
      //   "image_100",

      //   "image_100",
      // ]
  }

  useEffect(() => {

    getAllFiltersScoresFromJson();

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      // style: 'mapbox://styles/mapbox/streets-v11',
      style: "mapbox://styles/hamzahad/ckm6lqb38f5ev17ljx1v8jxgp",
      center: [-84.13814338407742, 26.573880643027238], 
      zoom: 5,
    });

    loadMarker(map);
    map.on('load', function(){

      loadMarkers(map);
        loadRegionSourceAndLayers(map);
        loadCountySourceAndLayers(map);
        loadCitySourceAndLayers(map);
        loadNeighborhoodSourceAndLayers(map);

        // setTimeout(() => {
        //   var feature = map.queryRenderedFeatures({ layers: ['city-layer'] });//map.queryRenderedFeatures({ layers: ['city-layer'] });
          
        //   setTimeout(() => {
        //     console.log('features list: ', feature);
        //   }, 2000);
        // }, 3000);
    });

  }, [])

  return (<div className="map-container" ref={mapContainer} id="map-container" />)
}

export default Map;
