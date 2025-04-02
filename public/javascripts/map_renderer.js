"use strict"

///attach events to dropdown
///https://stackoverflow.com/questions/55010528/how-to-listen-for-clicks-on-buttons-in-a-bootstrap-drop-down-menu-javascript
Array.from(document.getElementsByName('spaAutoCorr_button')).forEach((element) => {
    element.addEventListener('click', (event) => {
        draw_spatial_auto_correlation_results(base_data,spa_results, event.target.innerText);
    });
});

console.log("create map...")
// instanciate map
var map = L.map('map').setView([51, 12], 3)

//Baselayers
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var baseMaps = {
    "OSM": osm,
}
//here an layerControl is added to the map
var layerControl = L.control.layers(baseMaps).addTo(map);

if (base_data != undefined) {
    //add Data to map
    console.log(base_data.features[0].geometry)

    var geoJSONFeatureGroup_base_data = L.geoJSON(base_data).addTo(map)
    layerControl.addOverlay(geoJSONFeatureGroup_base_data, "filename")

    let referenceFeature = base_data.features[0]
    let pos = []
    if (referenceFeature.geometry.type == "Polygon") {
        pos = base_data.features[0].geometry.coordinates[0][0]
    }
    if (referenceFeature.geometry.type == "MultiPolygon") {
        pos = base_data.features[0].geometry.coordinates[0][0][0]
    }
    console.log("panning pos", pos)
    map.flyTo([pos[1], pos[0]], 5)
}


async function draw_spatial_auto_correlation_results(base_data, results_data, key) {

    //clear map
    map.eachLayer(layer => {
        map.removeLayer(layer)
    })
    osm.addTo(map)
    layerControl.remove()
    layerControl = L.control.layers(baseMaps).addTo(map);
    geoJSONFeatureGroup_base_data = L.geoJSON(base_data).addTo(map)
    layerControl.addOverlay(geoJSONFeatureGroup_base_data, "filename")



    //append spatial_autocorrelatio_results to base_data
    const results = results_data[key]
    if (results != undefined) {
        //add results data to origninal data, mapping ids
        for (var i = 0; i < base_data.features.length; i++) {
            var feature = base_data.features[i]
            //console.log("Feature ID: ", feature.id)
            for (var j = 0; j < results.length; j++)
                if (feature.id == results[j].id) {
                    //console.log(results[j].id)
                    feature.properties.spaAutoCorr_results = results[j]

                }
        }
        console.log(base_data)
        //define Styles for different results
        var polygonStyle_High_High = {
            "fillColor": "#d7301f", //red
            "opacity": 1,
            "fillOpacity": 1
        }
        var polygonStyle_High_Low = {
            "fillColor": "#fe9929", //orange
            "opacity": 1,
            "fillOpacity": 1,
        }
        var polygonStyle_Low_High = {
            "fillColor": "#2c7fb8", //blue
            "opacity": 1,
            "fillOpacity": 1
        }
        var polygonStyle_Low_Low = {
            "fillColor": "#253494", //dark blue
            "opacity": 1,
            "fillOpacity": 1
        }
        var polygonStyle_not_significant = {
            "fillColor": "#ece2f0", //grey
            "opacity": 1,
            "fillOpacity": 1
        }

        //filter features after results of spatial autto corr and assign a feature group
        var geoJSONFeatureGroup_High_High = L.geoJSON(base_data, {
            style: polygonStyle_High_High,
            filter: function (feature) {
                if (feature.properties.spaAutoCorr_results && feature.properties.spaAutoCorr_results.label === "High-high") return true
            },
            onEachFeature: function (feature, layer) {
                let popup = L.popup()
                    .setContent(
                        "<p>p: " + feature.properties.spaAutoCorr_results.p.toString() + "</p>" +
                        "<p>z: " + feature.properties.spaAutoCorr_results.z.toString() + "</p>"
                    )
                layer.bindPopup(popup)
            }
        }).addTo(map)
        var geoJSONFeatureGroup_High_Low = L.geoJSON(base_data, {
            style: polygonStyle_High_Low,
            filter: function (feature) {
                if (feature.properties.spaAutoCorr_results && feature.properties.spaAutoCorr_results.label === "High-low") return true
            },
            onEachFeature: function (feature, layer) {
                let popup = L.popup()
                    .setContent(
                        "<p>p: " + feature.properties.spaAutoCorr_results.p.toString() + "</p>" +
                        "<p>z: " + feature.properties.spaAutoCorr_results.z.toString() + "</p>"
                    )
                layer.bindPopup(popup)
            }
        }).addTo(map)

        var geoJSONFeatureGroup_Low_High = L.geoJSON(base_data, {
            style: polygonStyle_Low_High,
            filter: function (feature) {
                if (feature.properties.spaAutoCorr_results && feature.properties.spaAutoCorr_results.label === "Low-high") return true
            },
            onEachFeature: function (feature, layer) {
                let popup = L.popup()
                    .setContent(
                        "<p>p: " + feature.properties.spaAutoCorr_results.p.toString() + "</p>" +
                        "<p>z: " + feature.properties.spaAutoCorr_results.z.toString() + "</p>"
                    )
                layer.bindPopup(popup)
            }
        }).addTo(map)
        var geoJSONFeatureGroup_Low_Low = L.geoJSON(base_data, {
            style: polygonStyle_Low_Low,
            filter: function (feature) {
                if (feature.properties.spaAutoCorr_results && feature.properties.spaAutoCorr_results.label === "Low-low") return true
            },
            onEachFeature: function (feature, layer) {
                let popup = L.popup()
                    .setContent(
                        "<p>p: " + feature.properties.spaAutoCorr_results.p.toString() + "</p>" +
                        "<p>z: " + feature.properties.spaAutoCorr_results.z.toString() + "</p>"
                    )
                layer.bindPopup(popup)
            }
        }).addTo(map)
        var geoJSONFeatureGroup_not_significant = L.geoJSON(base_data, {
            style: polygonStyle_not_significant,
            filter: function (feature) {
                if (feature.properties.spaAutoCorr_results && feature.properties.spaAutoCorr_results.label === "Not significant") return true
            },
            onEachFeature: function (feature, layer) {
                let popup = L.popup()
                    .setContent(
                        "<p>p: " + feature.properties.spaAutoCorr_results.p.toString() + "</p>" +
                        "<p>z: " + feature.properties.spaAutoCorr_results.z.toString() + "</p>"
                    )
                layer.bindPopup(popup)
            }
        }).addTo(map)

        //add feautureGroups to layerControl
        layerControl.addOverlay(geoJSONFeatureGroup_High_High, "High-High")
        layerControl.addOverlay(geoJSONFeatureGroup_High_Low, "High-Low")
        layerControl.addOverlay(geoJSONFeatureGroup_Low_High, "Low-High")
        layerControl.addOverlay(geoJSONFeatureGroup_Low_Low, "Low-Low")
        layerControl.addOverlay(geoJSONFeatureGroup_not_significant, "not_significant")
    }
}

