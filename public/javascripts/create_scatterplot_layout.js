'use strict'

if(base_data != undefined){

let dimension = keys_numerical.length 
console.log("Dimension of scatterplot matrix: " + dimension + " x " + dimension)


/////////////////////////////////////////////////////////////////////////////////////////////
// adapted from 
// https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Traversing_an_HTML_table_with_JavaScript_and_DOM_Interfaces

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
    //create tablelayout with  canvaselements with unique ids
    ////////////////////////////////////////////////////////
    var table = document.getElementById('charts_table')
    var table_body = document.createElement('tbody')
    
    for(var i=0;i<dimension;i++){
        //rows
        var row = document.createElement('tr')
        //cells with canvas elements with unique ids
        for(j=0;j<dimension;j++){
            const cell = document.createElement('td')
            const div = document.createElement('div')
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

createCanvases(dimension)
///////////////////////////////////////////////////////////////////////////////////////
}