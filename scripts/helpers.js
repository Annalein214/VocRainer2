function iOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

var iPhone = iOS();
console.log("Device is iPhone?", iPhone); //true/false


var shuffle = function (array) {
  // randomize order in array

  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

// -----------------------------------------------------------------

var getColorStringForLevel = function(level, inverse=false, avgsign=true){
	if (isNaN(level)) level=0;
	switch(level){
        case 1:
            levelclass="textred";
            break
        case 2:
            levelclass="textorange";
            break
        case 3:
            levelclass="textyellow";
            break
        case 4:
            levelclass="textgreen";
            break
        default:
            levelclass="textwhite";
            if (inverse) levelclass="textblack";
            break
    }
    var sign="";
    if (avgsign) sign="⦰ ";
	return '<span class="'+levelclass+'">'+sign+''+level+'</span>'
}

// -----------------------------------------------------------------
// enable JSON parsing of line breaks in textareas

var cescape = function(string){
	string=string.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r");
	return string;
}

var cunescape = function(string){
	return string.replace(/\\n/g, "\n").replace(/\\r/g, "\r");
}

var cunescapehtml = function(string){
    var newstring=string.replace(/\n/g, "<br />")
                 .replace(/\\\\n/g, "<br />")
                 .replace(/\\n/g, "<br />")
                 .replace(/\\\\r/g, "<br />")
                 .replace(/\\r/g, "<br />");
    //console.log("cunescapehtml", string, newstring);
    return newstring;
}

// for situations where you want to have only one line and no line break
var cunescapeline = function(string){
	return string.replace(/\n/g, " ").replace(/\\n/g, "; ").replace(/\\r/g, "");
}

// -----------------------------------------------------------------

function timeHumanReadable(seconds){
  // only sec resolution
  seconds=parseInt(seconds);
  // calc hours to seconds
  var hours = seconds / (60*60);
  hours = parseInt(hours);
  var minutes = seconds - (hours*60*60);
  minutes /= 60;
  minutes = parseInt(minutes)
  var secs = seconds - (hours*60*60) - (minutes*60); 
  // create string
  var string="";
  if (hours) string += hours+" h ";
  if (minutes) string += minutes+" min ";
  if (secs) string += secs+" sec";
  return string;
}