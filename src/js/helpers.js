// function readTextFile(file) {
//     var rawFile = new XMLHttpRequest();
//     rawFile.open("GET", file, false);
//     rawFile.onreadystatechange = function() {
//       if(rawFile.readyState === 4) {
//         if(rawFile.status === 200 || rawFile.status == 0) {
//           var allText = rawFile.responseText;
//           document.getElementById('text-area').innerText = allText; 
//         }
//       }
//     }
//     rawFile.send(null);
// }
// readTextFile('https://gitlab.com/yhagio/stm-files/raw/master/agency.txt');

function textFileToJSON(textFile) {
  var lines=textFile.split("\n");
  var result = [];
  var headers=lines[0].split(",");
  for(var i=1;i<lines.length;i++){
    var obj = {};
    var currentline=lines[i].split(",");

    for(var j=0;j<headers.length;j++){
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  return result;
}
