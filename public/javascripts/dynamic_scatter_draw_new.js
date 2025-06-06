'use strict'

if (base_data != undefined) {
    let scatter_keys = []
    let all_radios = Array.from(document.getElementsByName('scatterplot_radio'))
    all_radios.forEach(element => {
        element.addEventListener('click', (event) => {
            scatter_keys = radios_checked(all_radios)
            if (scatter_keys.length >= 2) {
                let tuples = createDataTuple(scatter_dataset.fullData, scatter_keys)
                createChart(tuples)
                // createChart2(tuples)
            }
        })
    })
}
function get_panningPosition(coors) {
    let n = coors.length
    // get 4 equal apart positions and their mean 
    //start with first coor
    let positionsLat = [coors[0][0]]
    let positionsLon = [coors[0][1]]
    // console.log(positionsLat, positionsLon)
    let index = Math.floor(n / 4)

    for (let i = 1; i <= 2; i++) {
        positionsLat.push(coors[index][0])
        positionsLon.push(coors[index][1])
        index += index
    }
    positionsLat.push(coors[n - 1][0])

    positionsLon.push(coors[n - 1][1])
    //calculate mean of coordinates
    let initVal = 0
    let sumLat = positionsLat.reduce((accumalator, currentValue) => accumalator + currentValue, initVal)
    let meanLat = sumLat / positionsLat.length
    let sumLon = positionsLon.reduce((accumalator, currentValue) => accumalator + currentValue, initVal)
    let meanLon = sumLon / positionsLon.length
    let pan2pos = [meanLat, meanLon]
    return pan2pos
}
function radios_checked(all_radios) {
    let checked_keys = []
    all_radios.forEach(radio => {
        if (radio.checked == true) {
            checked_keys.push(radio.value)
        }
    })
    console.log('checked radios: ', checked_keys)
    return checked_keys
}


///takes scatterplot_dataset.fullData and active keys [] defined by radiobuttons
function createDataTuple(obj, keys) {

    let datasetObj = {}
    let ids = []
    for (var i = 0; i < keys.length; i++) {
        //let result = {label: label, data: []}
        let row1 = obj[keys[i]]
        let surlabel1 = keys[i]

        for (var j = 0; j < keys.length; j++) {
            let row2 = obj[keys[j]]
            let surlabel2 = keys[j]
            let label = surlabel1 + " / " + surlabel2
            let result = { label: label, data: [] }

            for (var z = 0; z < row1.length; z++) {
                let dataPoint = { x: row1[z], y: row2[z] }
                result.data.push(dataPoint)
            }
            //console.log(result)
            let id = i.toString() + j.toString()
            ids.push(id)

            Object.defineProperty(datasetObj, id, {
                value: result
            })
        }
    }
    console.log(ids)
    console.log(datasetObj)
    return { ids: ids, processed_data: datasetObj }
}

function createChart(datasetObj) {
    //console.log("createCharts data:",dataset["00"])
    console.log(datasetObj)
    // const ids = datasetObj.ids
    const dataset = datasetObj.processed_data
    const uniqueids = []
    document.getElementsByName("chartCanvas").forEach((element) => {
        uniqueids.push(element.id)
    })

    uniqueids.forEach(id => {
        var ctx = document.getElementById(id)
        // var ctx_big = document.getElementById(id+"_big")
        const data = {
            datasets: [{
                label: dataset[id].label,
                data: dataset[id].data
            }]
        }
        //double click
        function doubleClick(click2) {
            console.log("double clicked")
            scatter.resetZoom()
        }
        ctx.ondblclick = doubleClick
        var scatter = new Chart(ctx, {
            type: 'scatter',
            data: data,
            options: {
                plugins: {
                    zoom: {
                        pan: {
                            enabled: true,
                        },
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true
                            },
                            mode: 'xy',
                        }
                    },

                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: data.datasets[0].label.split("/")[1]
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: data.datasets[0].label.split("/")[0]
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                devicePixelRatio: 1,
                onClick: (event) => {
                    try {
                        console.log("Clicked Point in Chart")
                        let point = scatter.getElementsAtEventForMode(event, 'nearest', {
                            intersect: true
                        }, true)
                        //hardcoded indentifier!
                        let identifier
                        let key
                        try{
                            identifier = scatter_dataset.fullData.RS[point[0].index]
                            key = 'RS'
                        }
                        catch(error){
                            identifier = scatter_dataset.fullData.name[point[0].index]
                            key = 'name'
                        }
                        console.log(identifier)

                        for (let i = 0; i < base_data.features.length; i++) {
                            if (identifier == base_data.features[i].properties[key]) {
                                // get a position value from feature
                                let referenceFeature = base_data.features[i]
                                let pos 
                                if (referenceFeature.geometry.type == "Polygon") {
                                    pos = get_panningPosition(referenceFeature.geometry.coordinates[0])
                                }
                                if (referenceFeature.geometry.type == "MultiPolygon") {
                                    pos = get_panningPosition(referenceFeature.geometry.coordinates[0][0])
                                }

                                window.map.flyTo([pos[1], pos[0]], 10)
                                return
                            }
                        }
                    }
                    catch (error) {
                        console.log(error)
                    }
                },

            }
        })

    })
}
