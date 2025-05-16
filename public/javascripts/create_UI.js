'use strict'

if (base_data != undefined) {
    ///get menu elements
    // let dropdown = document.getElementById("dropdown_menu")
    let choro_radiobuttons = document.getElementById("checkbox_menu_choro")
    let radiobuttons = document.getElementById("checkbox_menu")
    
    keys_numerical.forEach(key => {
        let label = key.toString()
        let li = document.createElement('li')

        ////////////////////////////////////////
        // create dropdown items for numerical keys --> calc spatial auto corr//choropleth map
        ////////////////////////////////////////
        // let button = document.createElement('button')
        // button.setAttribute('class', "dropdown-item")
        // button.setAttribute('type', "button")
        // button.setAttribute('name', 'spaAutoCorr_button')
        // button.innerHTML = label

        // li.appendChild(button)
        // dropdown.appendChild(li)
        
        
        ///////////////////////////////////////////////
        //create radiobuttons for numerical keys --> draw scatterplot
        //////////////////////////////////////////////
        let formcheck = document.createElement("div")
        formcheck.setAttribute('class', 'form-check')
        let radio = document.createElement('input')
        let radio_label = document.createElement('label')
        radio.setAttribute('id', label)
        radio.setAttribute('class', 'form-check-input')
        radio.setAttribute('type', 'checkbox')
        radio.setAttribute('value', label)
        radio.setAttribute('name','scatterplot_radio')
        radio_label.setAttribute('class', 'form-check-label')
        radio_label.setAttribute('for', label)
        radio_label.innerHTML = label

        //new Version: repurpose scatter radiobuttons for selecting variables for choroplethmap
        let formcheck_choro = document.createElement("div")
        formcheck_choro.setAttribute('class', 'form-check')
        let radio_choro = document.createElement('input')
        let radio_label_choro = document.createElement('label')
        radio_choro.setAttribute('id', label)
        radio_choro.setAttribute('class', 'form-check-input')
        radio_choro.setAttribute('type', 'radio')
        radio_choro.setAttribute('value', label)
        radio_choro.setAttribute('name','choro_radio')
        radio_label_choro.setAttribute('class', 'form-check-label')
        radio_label_choro.setAttribute('for', label)
        radio_label_choro.innerHTML = label
        //append for scatter
        formcheck.appendChild(radio)
        formcheck.appendChild(radio_label)
        radiobuttons.appendChild(formcheck)
        // //append for choro
        formcheck_choro.appendChild(radio_choro)
        formcheck_choro.appendChild(radio_label_choro)
        choro_radiobuttons.appendChild(formcheck_choro)
    })

}