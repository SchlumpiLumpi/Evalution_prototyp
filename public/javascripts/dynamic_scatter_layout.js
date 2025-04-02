'use strict'

if (base_data != undefined) {
    let scatter_keys = []
    let all_radios = Array.from(document.getElementsByName('scatterplot_radio'))
    all_radios.forEach(element => {
        element.addEventListener('click', (event) => {
            scatter_keys = radios_checked(all_radios)
            if(scatter_keys.length >= 2){
                let dimension = scatter_keys.length
                console.log("dynamic Dimension:", dimension)
                createCanvases(dimension)
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

function createCanvases(dimension){
    // ////////////////////////////////////////////////////////////////////////////////
    //create unique ids for charts, array as matrix
    // [[00,01,02,0n],
    //  [10,11,12,1n]]
    ////////////////////////////////////////////////////////////////////////////////
    let chart_ids = []
    for (var i=0; i<dimension;i++){
        var chart_id_one = i.toString()
        var cols=[]
        for(var j=0; j<dimension;j++){
           cols[j] = chart_id_one + j.toString()  
           //chart_ids.push(cols)
        }
        chart_ids.push(cols)
    }
    
    /////////////////////////////////////////////////////////
    //create table layout with canvas elements with unique ids
    ////////////////////////////////////////////////////////
    
    var table = document.getElementById('charts_table')
    //clear table
    table.replaceChildren([])
    var table_body = document.createElement('tbody')
    
    for(var i=0;i<dimension;i++){
        //rows
        var row = document.createElement('tr')
        //cells with canvas elements with unique ids
        for(j=0;j<dimension;j++){
            const cell = document.createElement('td')
            const div = document.createElement('div')
            div.setAttribute('class', 'chart-container')
            div.setAttribute('style', 'position : relative; height:30vh; width:30vw; margin: auto') //'position : relative; height:20vh; width:40vw'
            
            const canvas = document.createElement('canvas')
            
            var id = chart_ids[i][j].toString()
            //console.log(data[id])
            canvas.setAttribute('id',id)
            
            div.appendChild(canvas)
            cell.appendChild(div)
            row.appendChild(cell)
        }
        table_body.appendChild(row)

    }
    table.appendChild(table_body)
}