console.log("main.js connected");

// Create an AJAX object to load the about .json and display the contents
const xhttp = new XMLHttpRequest();
xhttp.onload = function() {
    // document.getElementById("section2").innerHTML = this.responseText;
    console.log(JSON.parse(this.responseText));
    var data = JSON.parse(this.responseText);
    var textToDisplay = "<em>"+data.about.company_name+"</em>" +", is an "+data.about.business_structure.substring(0,12) +" "+data.about.industry+ " services company. "+" Established in "+ data.about.established + ", our mission is "+  data.about.mission+"<br><br>"; 
    var ttd = "Our values of: "+ data.about.values +" help us achieve our vision "+  data.about.vision;
    var std = data.about.services;
    // document.getElementById("section2").innerHTML = this.responseText;
    document.getElementById("section1_div").innerHTML = textToDisplay;
    document.getElementById("section2_div").innerHTML = ttd;
    document.getElementById("section3_div").innerHTML = std.map(item => `<li>${item}</li>`).join("");
    document.getElementById("viewBackGround").style.backgroundColor = "white";
}
xhttp.open("GET", "/data/techservit_about.json");
xhttp.send();

// Fixed the background of the "/home" route - must be white or offsite the gray on cards
if (document.getElementById("viewBackGround") != null) {
    document.getElementById("viewBackGround").style.backgroundColor = "#ffffff";
} else {
    document.getElementById("viewBackGround").style.backgroundColor = "#ffffff";
}

// Fixed the background of the "/home" route - must be white or offsite the gray on cards
if (document.getElementById("aboutPage") != null) {
    document.getElementById("aboutPage").style.backgroundColor = "#ffffff";
} else {
    document.getElementById("aboutPage").style.backgroundColor = "#00bfff";
}

function openNewWindow(urlString) {
    window.open(urlString)

}