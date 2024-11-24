console.log("main.js connected");
console.log(document.location.href)

function shit() {
// Create an AJAX object to load the about .json and display the contents
const xhttp = new XMLHttpRequest();
xhttp.onload = function() {
    // document.getElementById("section2").innerHTML = this.responseText;
    console.log(JSON.parse(this.responseText));
    var data = JSON.parse(this.responseText);
    var textToDisplay = "<em>"+data.about.company_name+"</em>" +", is an "+data.about.business_structure.substring(0,12) +" "+data.about.industry+ " services company. "+" Established in "+ data.about.established + ", our mission is "+  data.about.mission+"<br><br>"; 
    var ttd = "Our values of: "+ data.about.values +" help us achieve our vision "+  data.about.vision;
    var std = data.about.services;
    var dtd = data.about.descriptions;
    // document.getElementById("section2").innerHTML = this.responseText;
    document.getElementById("section1_div").innerHTML = textToDisplay;
    document.getElementById("section2_div").innerHTML = ttd;
    // Example array
    const items = std;

    // Get the container where the list will be inserted
    const container = document.getElementById('section3_div');

    // Create the <ul> element
    const ul = document.createElement('ul');

    // Loop through the array
    for (let i = 0; i < items.length; i++){

        // Create an <li> element for each item
        const li = document.createElement('li');
        li.className = 'index-li';
        const p = document.createElement('p');
        p.className = 'index-p'
        p.id = i
        li.textContent = items[i]; // Set the text content of the <li>
         // Add hover event listeners
        li.addEventListener('mouseover', () => {
            p.textContent = dtd[i];
            p.style.display = 'block';
        });

        li.addEventListener('mouseout', () => {
            p.style.display = 'none';
        });
        ul.appendChild(li).appendChild(p); // Append the <li> to the <ul>
    }

    // Append the <ul> to the container
    container.appendChild(ul);


    // document.getElementById("section3_div").innerHTML = std.map(item => `<li class="feed-li">${item}</li><br><p id="${0}">${item}</p>`).join("");
    document.getElementById("viewBackGround").style.backgroundColor = "white";
}
xhttp.open("GET", "/data/techservit_about.json");
xhttp.send();
}
shit()
// // Fixed the background of the "/home" route - must be white or offsite the gray on cards
// if (document.getElementById("viewBackGround") != null) {
//     document.getElementById("viewBackGround").style.backgroundColor = "#ffffff";
// } else {
//     document.getElementById("viewBackGround").style.backgroundColor = "#ffffff";
// }

// // Fixed the background of the "/home" route - must be white or offsite the gray on cards
// if (document.getElementById("aboutPage") != null) {
//     document.getElementById("aboutPage").style.backgroundColor = "#ffffff";
// } else {
//     document.getElementById("aboutPage").style.backgroundColor = "#00bfff";
// }

function openNewWindow(urlString) {
    window.open(urlString)
}


