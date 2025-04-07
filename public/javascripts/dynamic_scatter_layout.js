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
                createCanvases2(dimension, view)
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
        canvasRow.style["visibility"] = "collapse"
    }
    if (view == "bottom") {
        canvasRow = document.getElementById("canvasBottomView")
        const map = document.getElementById('map')
        canvasRow.style["visibility"] = "collapse"
        canvasRow.style["height"] = "0px"
        // map.style["height"]= "90vh"
    }
    
}

function createCanvases2(dimension, view) {
    let canvasRow
    
    if (view == "side") {
        canvasRow = document.getElementById("canvasSideView")
        const mapDiv = document.getElementById("mapDiv")
        mapDiv.setAttribute("class", "container-fluid col-7")
    }
    if (view == "bottom") {
        canvasRow = document.getElementById("canvasBottomView")
        const map = document.getElementById('map')
        canvasRow.style["height"]="20vh"
        // map.style["height"]= "80vh"
    }
    canvasRow.replaceChildren([])
    canvasRow.style["visibility"] = "visible"

    

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

    const uniqueIds = extractTriangle(chart_ids, 'lower')

    for (let i = 0; i < uniqueIds.length; i++) {
        let chartDiv = document.createElement("div")
        chartDiv.setAttribute("class", "container")
        chartDiv.setAttribute('style', 'position : relative; height:20vh; width:20vw;')
        
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
function createCanvases(dimension) {
    // ////////////////////////////////////////////////////////////////////////////////
    //create unique ids for charts, array as matrix
    // [[00,01,02,0n],
    //  [10,11,12,1n]]
    ////////////////////////////////////////////////////////////////////////////////
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
    /////////////////////////////////////////////////////////
    //create table layout with canvas elements with unique ids
    ////////////////////////////////////////////////////////

    var table = document.getElementById('charts_table')
    //clear table
    table.replaceChildren([])
    var table_body = document.createElement('tbody')

    for (var i = 0; i < dimension; i++) {
        //rows
        var row = document.createElement('tr')
        //cells with canvas elements with unique ids
        for (j = 0; j < dimension; j++) {
            const cell = document.createElement('td')
            const div = document.createElement('div')
            div.setAttribute('class', 'chart-container')
            //Stylings
            //'style', 'position : relative; height:20vh; width:40vw'
            // 'style', 'position : relative; height:30vh; width:30vw; margin: auto'
            div.setAttribute('style', 'position : relative; height:30vh; width:30vw;') //'position : relative; height:20vh; width:40vw'
            const canvas = document.createElement('canvas')

            var id = chart_ids[i][j].toString()
            //console.log(data[id])
            canvas.setAttribute('id', id)

            div.appendChild(canvas)
            cell.appendChild(div)
            row.appendChild(cell)
        }
        table_body.appendChild(row)

    }
    table.appendChild(table_body)
}