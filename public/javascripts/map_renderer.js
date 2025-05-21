"use strict"

///attach events to dropdown
///https://stackoverflow.com/questions/55010528/how-to-listen-for-clicks-on-buttons-in-a-bootstrap-drop-down-menu-javascript
Array.from(document.getElementsByName('spaAutoCorr_button')).forEach((element) => {
    element.addEventListener('click', (event) => {
        // draw_spatial_auto_correlation_results(base_data,spa_results, event.target.innerText);
        let key = event.target.innerText
        updateMap()
        updateLegend(key, jenksBounds)
        drawChoroplethMap(base_data, key, jenksBounds)
    });
});
Array.from(document.getElementsByName('choro_radio')).forEach((element =>{
    element.addEventListener('click', (event)=>{
        let key = event.target.value
        updateMap()
        updateLegend(key, jenksBounds)
        drawChoroplethMap(base_data, key, jenksBounds)

    })
}))
// _______________________________________________________________
// instanciate map
console.log("draw base-map...")
var map = L.map('map').setView([51, 12], 3)
//Baselayers
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
var baseMaps = {
    "OSM": osm,
}
//----------------------------------------------------------------
//________________________________________________________
//here an layerControl is added to the map
var layerControl = L.control.layers(baseMaps).addTo(map);
//--------------------------------------------------------

//________________________________________________________
//legend
let legend = document.createElement("div")
legend.id = "legend"
legend.role = "button"
legend.innerHTML = "<h6> Legende </h6>"
const mapDiv = document.getElementById("map")
mapDiv.appendChild(legend)
//-------------------------------------------------------
let popUp_layer
let geoJSONFeatureGroup_base_data

if (base_data != undefined) {
    //add Data to map
    console.log(base_data.features[0].geometry)
    geoJSONFeatureGroup_base_data = L.geoJSON(base_data).addTo(map)
    layerControl.addOverlay(geoJSONFeatureGroup_base_data, "base data")
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
    popUp_layer = L.geoJSON(base_data, {
        style: {
            "opacity": 0,
            "fillOpacity": 0
        },
        onEachFeature: function (feature, layer) {
            let popUpObject = []
            for (var keys in feature.properties) {
                // if (feature.properties.hasOwnProperty(key)) {
                var content = keys + ": " + feature.properties[keys];
                popUpObject.push(content);
                // }
            }
            let popupString = popUpObject.join(" <br>")

            let popup = L.popup().setContent(popupString)

            layer.bindPopup(popup)
        }
    }).addTo(map)

    map.on("overlayadd", (event) => {
        popUp_layer.bringToFront();
        geoJSONFeatureGroup_base_data.bringToBack()
    });
    map.on("overlayremove", (event) => {
        popUp_layer.bringToFront()
        geoJSONFeatureGroup_base_data.bringToBack()
    })
}

function updateMap() {
    //clear map
    map.eachLayer(layer => {
        map.removeLayer(layer)
    })
    osm.addTo(map)
    geoJSONFeatureGroup_base_data.addTo(map)
    popUp_layer.addTo(map)
    layerControl.remove()

    layerControl = L.control.layers(baseMaps).addTo(map);
    layerControl.addOverlay(geoJSONFeatureGroup_base_data, "base data")
    // map.on("overlayadd", function (event) {
    //     popUp_layer.bringToFront();
    // });
    popUp_layer.bringToFront();
}
function updateLegend(key, jenksBounds) {
    //generate entries
    let entries = []

    for (let i = 1; i < jenksBounds[key].length; i++) {
        let entry = `${Math.round((jenksBounds[key][i - 1]) * 100) / 100} - ${Math.round((jenksBounds[key][i]) * 100) / 100}`
        entries.push(entry)
    }
    let legend = document.getElementById("legend")
    legend.innerHTML = ""
    let legend_content =
        `<h6> ${key} </h6>
    <span style="color:#993404">&#9632  </span><span>5: ${entries[4]}</span><br>
    <span style="color:#d95f0e">&#9632  </span><span>4: ${entries[3]}</span><br>
    <span style="color:#fe9929">&#9632  </span><span>3: ${entries[2]}</span><br>
    <span style="color:#fed98e">&#9632  </span><span>2: ${entries[1]}</span><br>
    <span style="color:#ffffd4">&#9632  </span><span>1: ${entries[0]}</span><br>
    `
    legend.innerHTML = legend_content

    let displayStatus = 1
    //toggle legend
    legend.addEventListener('click', (event) => {
        if (displayStatus == 1) {
            legend.innerHTML = `<h6> Legende </h6>`
            displayStatus = 0
            return
        }
        else {
            legend.innerHTML = legend_content
            displayStatus = 1
            return
        }
    })
    //highlight on hover
    legend.addEventListener("mouseover", (event) => {
        legend.style['background'] = "#f9f9f9"
    })
    legend.addEventListener("mouseleave", (event) => {
        legend.style['background'] = "white"
    })


}
function drawChoroplethMap(base_data, key, jenksBounds) {
    //classes
    const class1 = {
        "fillColor": "#ffffd4",
        "opacity": 1,
        "fillOpacity": 1
    }
    const class2 = {
        "fillColor": "#fed98e",
        "opacity": 1,
        "fillOpacity": 1
    }
    const class3 = {
        "fillColor": "#fe9929",
        "opacity": 1,
        "fillOpacity": 1
    }
    const class4 = {
        "fillColor": "#d95f0e",
        "opacity": 1,
        "fillOpacity": 1
    }
    const class5 = {
        "fillColor": "#993404",
        "opacity": 1,
        "fillOpacity": 1
    }
    const choroLayer_1 = L.geoJSON(base_data, {
        style: class1,
        filter: function (feature) {
            if (feature.properties[key] >= jenksBounds[key][0] && feature.properties[key] < jenksBounds[key][1]) return true
        }
    }).addTo(map)
    const choroLayer_2 = L.geoJSON(base_data, {
        style: class2,
        filter: function (feature) {
            if (feature.properties[key] >= jenksBounds[key][1] && feature.properties[key] < jenksBounds[key][2]) return true
        }
    }).addTo(map)
    const choroLayer_3 = L.geoJSON(base_data, {
        style: class3,
        filter: function (feature) {
            if (feature.properties[key] >= jenksBounds[key][2] && feature.properties[key] < jenksBounds[key][3]) return true
        }
    }).addTo(map)
    const choroLayer_4 = L.geoJSON(base_data, {
        style: class4,
        filter: function (feature) {
            if (feature.properties[key] >= jenksBounds[key][3] && feature.properties[key] < jenksBounds[key][4]) return true
        }
    }).addTo(map)
    const choroLayer_5 = L.geoJSON(base_data, {
        style: class5,
        filter: function (feature) {
            if (feature.properties[key] >= jenksBounds[key][4] && feature.properties[key] <= jenksBounds[key][5]) return true
        }
    }).addTo(map)

    layerControl.addOverlay(choroLayer_1, '1')
    layerControl.addOverlay(choroLayer_2, '2')
    layerControl.addOverlay(choroLayer_3, '3')
    layerControl.addOverlay(choroLayer_4, '4')
    layerControl.addOverlay(choroLayer_5, '5')

    popUp_layer.bringToFront()
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
    layerControl.addOverlay(geoJSONFeatureGroup_base_data, "base data")
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

