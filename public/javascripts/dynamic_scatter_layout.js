'use strict'

if (base_data != undefined) {
    let scatter_keys = []
    let all_radios = Array.from(document.getElementsByName('scatterplot_radio'))
    all_radios.forEach(element => {
        element.addEventListener('click', (event) => {
            scatter_keys = radios_checked(all_radios)
            const view = "side"
            if (scatter_keys.length >= 2) {
                let dimension = scatter_keys.length

                console.log("dynamic Dimension:", dimension)
                // createCanvases(dimension)
                createCanvases(dimension, view)
            }
            if (scatter_keys.length < 2) {
                hideCanvases(view)
            }
        })
    })
}

// returns checked keys --> 
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
function hideCanvases(view) {
    let canvasRow
    if (view == "side") {
        canvasRow = document.getElementById("canvasSideView")
        const mapDiv = document.getElementById("mapDiv")
        mapDiv.setAttribute("class", "container-fluid col-10")
        // canvasRow.style["visibility"] = "collapse"
        canvasRow.style["display"] = "none"
    }
    if (view == "bottom") {
        canvasRow = document.getElementById("canvasBottomView")
        const map = document.getElementById('map')
        // canvasRow.style["visibility"] = "collapse"
        canvasRow.style["display"] = "none"
        canvasRow.style["height"] = "0px"
        // map.style["height"]= "90vh"
    }

}

function createCanvases(dimension, view) {
    let canvasRow
    //side or bottomview behavior
    if (view == "side") {
        canvasRow = document.getElementById("canvasSideView")
        const mapDiv = document.getElementById("mapDiv")
    }
    if (view == "bottom") {
        canvasRow = document.getElementById("canvasBottomView")
        const map = document.getElementById('map')
        canvasRow.style["height"] = "20vh"
        // map.style["height"]= "80vh"
    }
    
    // destroy all canvases 
    canvasRow.replaceChildren([])
    // show charts
    canvasRow.style["display"] = "block"

    // create id - matrix
    let chart_ids = []
    for (var i = 0; i < dimension; i++) {
        var chart_id_one = i.toString()
        var cols = []
        for (var j = 0; j < dimension; j++) {
            cols[j] = chart_id_one + j.toString()
            //chart_ids.push(cols)
        }
        chart_ids.push(cols)
    }
    console.log(chart_ids)

    // extract only the lower trinagle ids of the matrix
    const uniqueIds = extractTriangle(chart_ids, 'lower')


    // for each unique id -> create a canvas, in which a chart can be drawn
    
    for (let i = 0; i < uniqueIds.length; i++) {
        let chartDiv = document.createElement("div")
        chartDiv.setAttribute("class", "container")
        chartDiv.setAttribute("class", "scatterplot")
        let canvas = document.createElement("canvas")
        canvas.setAttribute("name", "chartCanvas")
        canvas.id = uniqueIds[i]

        chartDiv.appendChild(canvas)
        canvasRow.appendChild(chartDiv)
    }

}
function extractTriangle(matrix, type) {
    const numRows = matrix.length;
    let result = Array.from({ length: numRows }, () => Array(numRows).fill(null));

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numRows; j++) {
            if ((type === 'lower' && i > j) || (type === 'upper' && i < j)) {
                result[i][j] = matrix[i][j];
            }
        }
    }

    const uniqueIds = []
    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result[i].length; j++) {
            if (result[i][j] != null) {
                // console.log(result[i][j])
                uniqueIds.push(result[i][j])
            }

        }
    }

    return uniqueIds;
}
