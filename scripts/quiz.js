// non constant variables for quiz
var QUIZTYPE = 0; // 0 Training, 1 Testing, 2 Oral
var QUIZWORDS = []; // all selected words to be tested, see get_quiz_word.php for shape
var SELECTEDWORDS = []; // sub sample of above words, words to be tested next, chosen by certain algorithm
var STARTTIMEQUIZ = new Date();
var QUIZDURATION=0;
// ------ settings => constants
var TR_MAX_WORST = 3; // for training mode: max number of words per shuffle round
var TR_MAX_SELECT = 5; // for training mode: length of SELECTEDWORDS
var TR_MAX_SUBLEVELS = 4; // start with 0, min is -1, if all correct need TR_MAX_SUBLEVELS-1 times to finalize traing, thus here 3 times
// var MAX_LEVELS = 4; // hard coded!! DB structure depends on it
var DELTA_LEVEL_PERFECT = 2; // if answered perfectly, raise level by x steps

// -----------------------------------------------------------------------------------------

var loadpage_quiz = function (data){
	// --- Create header

	$('#header div.h1').text("Quiz");

	$('#header a[name="left"]').text("Quit").show().unbind( "click" ).click(function(event){
		loadpage("quizend");
	});

	// right button is "Edit" and changed below in a function

	if (data!=null) {
		// start new quiz
		console.log("QUIZ: start new quiz");
		QUIZWORDS = data;
	}
	else{
		console.log("QUIZ: continue quiz", QUIZWORDS);
	}
	show_quiz_word();
}

var show_quiz_word = function(){

	var string =  '<div id="progress"><div name="bar"></div><div name="value">100%</div></div>';
		string += '<div id="nword">Native Word</div>';
		string += '<div id="fword" class="hide">Foreign Word</div>';
		string += '<div id="comment" class="hide">Comment</div>';
		string += '<div id="buttons">';
			string +='<a href="#" name="read" class="hide">Read</a><br /><br />';
			string +='<a href="#" name="show">Show</a>';
			string += '<a href="#" name="correct" class="hide">Correct</a>';
			string += '<a href="#" name="wrong" class="hide">Wrong</a>';
		string += '</div>';
		string += '<div id="slevel" class="furtherInfo">Sublevel: <span></span></div>';
		string += '<div id="level" class="furtherInfo">Level: <span></span></div>';
		string += '<div id="nwrong" class="furtherInfo">N x Wrong: <span></span></div>';
		string += '<div id="wordid" class="furtherInfo">ID: <span></span></div>'
		

	$('#main').append(string);

	fill_quiz();
}

var fill_quiz = function(){
	console.log("QUIZ fill_quiz");
	var word = selectWord();
	console.log("QUIZ fill_quiz", word);
	if (word.ID == 0) {
		loadpage("quizend");
		return;
	}

	$('#nword').text(cunescape(word.NWord));
	$('#fword').text(cunescape(word.FWord));
	$('#comment').text(cunescape(word.Comment));
	$('#slevel span').text(word.SubLevel);
	$('#level span').text(word.Level);
	$('#nwrong span').text(word.NWrong);
	$('#wordid span').text(word.ID);

	$('#header a[name="right"]').text("Edit").show().unbind( "click" ).click(function(event){
		var endQuizTime= new Date();
        QUIZDURATION+=(endQuizTime-STARTTIMEQUIZ)/1000; // ms -> sec
		loadpage("newword",[word.ID, 1]); // data: ID, go_to [1=>quiz]
	});


	// once ready
	if(parseInt(localStorage.getItem("readaloud"))) read_native();

	add_quiz_fct();

	// start timer here, before no data available
	STARTTIMEQUIZ = new Date();
}

var add_quiz_fct = function() {
	// TODO: QUIT / EDIT
	console.log("QUIZ add_quiz_fct");
	var id=$('#wordid span').text();

	$('#buttons a[name="read"]').click(function(event){ 
		read_foreign();
	});

	$('#buttons a[name="correct"]').click(function(event){ 
		for (var i = 0; i < QUIZWORDS.length; i++) {
			if (id==QUIZWORDS[i].ID) {
				if (parseInt(QUIZWORDS[i].SubLevel)<TR_MAX_SUBLEVELS) QUIZWORDS[i].SubLevel=parseInt(QUIZWORDS[i].SubLevel)+1;
				break;
			}
		}
		//console.log("DEBUG1", QUIZWORDS);
		var endQuizTime= new Date();
        QUIZDURATION+=(endQuizTime-STARTTIMEQUIZ)/1000;
		loadpage("quiz");
	});

	$('#buttons a[name="wrong"]').click(function(event){ 
		for (var i = 0; i < QUIZWORDS.length; i++) {
			if (id==QUIZWORDS[i].ID) {
				if (parseInt(QUIZWORDS[i].SubLevel)>-1) {
					QUIZWORDS[i].SubLevel=parseInt(QUIZWORDS[i].SubLevel)-1;
				}
				//console.log("DEBUG2", parseInt(QUIZWORDS[i].NWrong));
				QUIZWORDS[i].NWrong=parseInt(QUIZWORDS[i].NWrong)+1;
				//console.log("DEBUG2", parseInt(QUIZWORDS[i].NWrong));
				break;
			}
			
		}
		var endQuizTime= new Date();
        QUIZDURATION+=(endQuizTime-STARTTIMEQUIZ)/1000;
		loadpage("quiz");
	});

	$('#buttons a[name="show"]').click(function(event){ 
		$('#fword').show();
		$('#comment').show();
		$('#buttons a[name="read"]').show();
		$('#buttons a[name="correct"]').show();
		$('#buttons a[name="wrong"]').show();
		$('#buttons a[name="show"]').hide();
		if(parseInt(localStorage.getItem("readaloud"))) read_foreign();
	});

}

// ---------------------------------------------------------------------
// speech

var read_native=function(){
	var native = $('#nword').text();
    speak(native, "de")
}

var read_foreign=function(){
	var foreign = $('#fword').text();
    speak(foreign, "jp")
}

// ---------------------------------------------------------------------


var selectWord = function (){
	// implement different test modi
	// returns a word
	console.log("QUIZ selectWord");

	switch (QUIZTYPE){
        case 0: // training
			return selectTrainingWord();
			break;
		case 1:
			return selectTestingWord();
		default:
			alert('Not implemented');
			break;
	}

}

var selectTestingWord = function(){
	console.log("QUIZ selectTestingWord");
	for (var i = 0; i < QUIZWORDS.length; i++) {
		if (QUIZWORDS[i].SubLevel==0){
			return QUIZWORDS[i];
		}
	}
	return {ID:0,Selected:true}; // return something with ID==0 in order to stop the test
}

var selectTrainingWord = function(){
	console.log("QUIZ selectTrainingWord");
	// id, selected
	for (var i = 0; i < SELECTEDWORDS.length; i++) {
		if (!SELECTEDWORDS[i].Selected) {
			SELECTEDWORDS[i].Selected = true;
			return SELECTEDWORDS[i];
		}
	}
	// if code reaches here SELECTEDWORDS is empty or all words used in this shuffle round
	// require some randomness
	QUIZWORDS = shuffle(QUIZWORDS);
	// empty this shuffle round
	SELECTEDWORDS=[]; 
	// search for max 3 words with sublevel -1
	for (var i = 0; i < QUIZWORDS.length; i++) {
		if (SELECTEDWORDS.length == TR_MAX_WORST) break; // don't fill completely with worst words
		if (parseInt(QUIZWORDS[i].SubLevel)==-1) {
			SELECTEDWORDS.push(QUIZWORDS[i]);
			SELECTEDWORDS.at(-1).Selected = false;
		}
	}
	// fill rest
	for (var i = 0; i < QUIZWORDS.length; i++) {
		if (SELECTEDWORDS.length == TR_MAX_SELECT) break; // fill up to this number, array can be shorter if nothing to fill left
		if (parseInt(QUIZWORDS[i].SubLevel)<TR_MAX_SUBLEVELS) {
			SELECTEDWORDS.push(QUIZWORDS[i]);
			//console.log("DEBUG", SELECTEDWORDS.at(-1));
			SELECTEDWORDS.at(-1).Selected = false;
		}
	}
	// signal end of quiz if all words are ok
	if (SELECTEDWORDS.length==0) {
		SELECTEDWORDS.push({ID:0,Selected:true});
	}

	// return first word
	SELECTEDWORDS[0].Selected = true;
	return SELECTEDWORDS[0];
}



