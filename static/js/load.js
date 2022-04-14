const { runMain } = require("module");

let outputBx = document.getElementById('outputBx');
let bttn = document.getElementById("input")
let fr = new FileReader();

fr.readAsText('user1&2messages.txt');
//outputBx.innerHTML = "HEY B"
fr.onload = function(){
     outputBx.innerHTML = "WHATS UP";
 };
