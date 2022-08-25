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
console.log("iPhone", iPhone);


var WORDI = 0;
var LONGTIMEOUT = 7*1000;
var SHORTTIMEOUT = 3*1000;
if (iPhone){ // on iPhone there is a strange delay before giving the German output
	LONGTIMEOUT = 15*1000;
	SHORTTIMEOUT = 100;
}

var loadpage_oral = function(data){
	// --- Create header

	$('#header div.h1').text("Oral Training");

	$('#header a[name="left"]').text("Quit").show().unbind( "click" ).click(function(event){
		var endQuizTime= new Date();
        QUIZDURATION+=(endQuizTime-STARTTIMEQUIZ)/1000;
		loadpage("quizend");
	});

	// right button is "Edit" and changed below in a function
	QUIZWORDS = data;
	
	exe_oral_quiz();
}


var exe_oral_quiz = function(){
	console.log("DEBUG exe", QUIZWORDS.length);
	STARTTIMEQUIZ = new Date();
	setTimeout(showRead_Nword, 100);
}


var showRead_Nword = function(){
	if (WORDI >= QUIZWORDS.length){
		var string = '<div/>ENDE</div>';
		$('#main').append(string);
		speak("Ende", "de");
		var endQuizTime= new Date();
        QUIZDURATION+=(endQuizTime-STARTTIMEQUIZ)/1000;
		loadpage("quizend");
		return;
	}

	var string = '<div/>Native Word:<br /><span class="textpink">'+QUIZWORDS[WORDI].NWord+'</span></div>';
	$('#main').append(string);
	speak(QUIZWORDS[WORDI].NWord, "de");
	setTimeout(showRead_Fword, LONGTIMEOUT);
}

var showRead_Fword = function(){
	var string = '<div/>Foreign Word:<br /><span class="textpink">'+QUIZWORDS[WORDI].FWord+'</span></div><br /><br />';
	$('#main').append(string);
	speak(QUIZWORDS[WORDI].FWord, "jp");
	WORDI++;
	setTimeout(showRead_Nword, SHORTTIMEOUT);
}