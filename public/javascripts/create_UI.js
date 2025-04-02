'use strict'

if (base_data != undefined) {
    ///get menu elements
    let dropdown = document.getElementById("dropdown_menu")
    let radiobuttons = document.getElementById("checkbox_menu")
    
    keys_numerical.forEach(key => {
        var label = key.toString()
        var li = document.createElement('li')

        ////////////////////////////////////////
        // create dropdown items for numerical keys --> calc spatial auto corr
        ////////////////////////////////////////
        var button = document.createElement('button')
        button.setAttribute('class', "dropdown-item")
        button.setAttribute('type', "button")
        button.setAttribute('name', 'spaAutoCorr_button')
        button.innerHTML = label

        li.appendChild(button)
        dropdown.appendChild(li)
        
        ///////////////////////////////////////////////
        //create radiobuttons for numerical keys --> draw scatterplot
        //////////////////////////////////////////////
        var formcheck = document.createElement("div")
        formcheck.setAttribute('class', 'form-check')
        var radio = document.createElement('input')
        var radio_label = document.createElement('label')
        radio.setAttribute('id', label)
        radio.setAttribute('class', 'form-check-input')
        radio.setAttribute('type', 'checkbox')
        radio.setAttribute('value', label)
        radio.setAttribute('name','scatterplot_radio')
        radio_label.setAttribute('class', 'form-check-label')
        radio_label.setAttribute('for', label)
        radio_label.innerHTML = label

        formcheck.appendChild(radio)
        formcheck.appendChild(radio_label)
        radiobuttons.appendChild(formcheck)
        
    })

}