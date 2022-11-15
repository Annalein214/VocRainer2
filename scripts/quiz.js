// non constant variables for quiz
var QUIZTYPE = 0; // 0 Training, 1 Testing, 2 Oral, 3 Spelling
var QUIZWORDS = []; // all selected words to be tested, see get_quiz_word.php for shape
var SELECTEDWORDS = []; // sub sample of above words, words to be tested next, chosen by certain algorithm
var STARTTIMEQUIZ = new Date();
var QUIZDURATION=0;
var COMPLETION=0;
// ------ settings => constants
var TR_MAX_WORST = 3; // for training mode: max number of words per shuffle round
var TR_MAX_SELECT = 5; // for training mode: length of SELECTEDWORDS
var TR_MAX_SUBLEVELS = 3; // start with 0, min is -1, if all correct need TR_MAX_SUBLEVELS-1 times to finalize traing, thus here 3 times
// var MAX_LEVELS = 4; // hard coded!! DB structure depends on it
var DELTA_LEVEL_PERFECT = 2; // if answered perfectly, raise level by x steps

// -----------------------------------------------------------------------------------------

var loadpage_quiz = function (data){
	// --- Create header

	$('#header div.h1').text("Quiz");

	$('#header a[name="left"]').text("Quit").show().unbind( "click" ).click(function(event){
		var endQuizTime= new Date();
        QUIZDURATION+=(endQuizTime-STARTTIMEQUIZ)/1000;
		loadpage("quizend");
	});

	// right button is "Edit" and changed below in a function
	console.log("QUIZ: start quiz of type", QUIZTYPE);

	if (data!=null) {
		// start new quiz
		console.log("QUIZ: start new quiz with words:", data);
		QUIZWORDS = data;
		show_quiz_word();
	}
	else{
		var returning=false;
		console.log("QUIZ: continue quiz", QUIZWORDS);
		if (!PREVIOUSPAGE.includes("quiz")) {
			returning=true; // makes sure that the previous word is shown and not the next one.
		}
		show_quiz_word(returning);
	}
	
}

var updateQuizWord = function(data){
	// function used in word.js to update data if a word was edited 

	// data {ID:id, Foreign:foreign, Native:native,Comment:comment,LecID:lectureid, Lecture:lecture, Tags:tags}
	console.log("QUIZ: Update edited word online:", QUIZWORDS.length, data);

	// tags: array of [id,name]
	var tagids=[];
	var tagnames=[];
	for (var i=0; i<data.Tags.length; i++){
		tagids.push(data.Tags[i][0]);
		tagnames.push(data.Tags[i][1]);
	}

	console.log("DEBUG UPDATE", tagids, tagnames)

	if (QUIZWORDS.length){ // if quiz running
		for (var i = 0; i < QUIZWORDS.length; i++) {
			if (QUIZWORDS[i].ID == data.ID){
				QUIZWORDS[i].LecID = data.LecID;
				QUIZWORDS[i].FWord = data.Foreign;
				QUIZWORDS[i].NWord = data.Native;
				QUIZWORDS[i].Comment = data.Comment;
				QUIZWORDS[i].LecID = data.LecID;
				QUIZWORDS[i].LecName = data.Lecture;
				QUIZWORDS[i].TagIDs = tagids;
				QUIZWORDS[i].TagNames = tagnames;
				break;
			}
		} 
	}
	// for training also update
	if (SELECTEDWORDS.length){ // if quiz running
		for (var i = 0; i < SELECTEDWORDS.length; i++) {
			if (SELECTEDWORDS[i].ID == data.ID){
				SELECTEDWORDS[i].LecID = data.LecID;
				SELECTEDWORDS[i].FWord = data.Foreign;
				SELECTEDWORDS[i].NWord = data.Native;
				SELECTEDWORDS[i].Comment = data.Comment;
				SELECTEDWORDS[i].LecID = data.LecID;
				SELECTEDWORDS[i].LecName = data.Lecture;
				SELECTEDWORDS[i].TagIDs = tagids;
				SELECTEDWORDS[i].TagNames = tagnames;
				break;
			}
		}
	} 

	console.log("DEBUG UPDATE", QUIZWORDS, SELECTEDWORDS)

}

var show_quiz_word = function(returning=false){

	var string =  '<div id="progress"><div name="bar"></div><div name="value">100%</div></div>';
		string += '<div id="nword">Native Word</div>';

		if (QUIZTYPE == 3){ // spelling
			string += '<input type="text" name="speltword" id="speltword" placeholder="Spell the translated word here. Use dictionary form of verb. Use either furigana or kanji." />';
			string +='<div id="checkresult" class="hide"></div><br />';
		}

		string += '<div id="fword" class="hide">Foreign Word</div>';
		string += '<div id="comment" class="hide">Comment</div>';
		string += '<div id="buttons">';
			if (QUIZTYPE == 3){ // spelling
				string +='<a href="#" name="check">Check</a>';
				string +='<a href="#" name="read" class="hide">Read</a>';
				string +='<a href="#" name="proceed" class="hide">Proceed</a>';
			}
			else{
				string +='<a href="#" name="show">Show</a>';
				string +='<a href="#" name="read" class="hide">Read</a><br /><br />';
				string += '<a href="#" name="correct" class="hide">Correct</a>';
				string += '<a href="#" name="wrong" class="hide">Wrong</a>';
			}

		string += '</div>';
		string += '<div id="slevel" class="furtherInfo">Sublevel: <span></span></div>';
		string += '<div id="nwrong" class="furtherInfo">Wrong answers: <span></span></div>';
		string += '<div id="level" class="furtherInfo">Level: <span></span></div>';
		string += '<div id="wordid" class="furtherInfo">ID: <span></span></div>'
		string += '<div id="lecture" class="furtherInfo">Lecture: <span></span></div>'
		string += '<div id="tags" class="furtherInfo">Tags: <span></span></div>'
		

	$('#main').append(string);

	fill_quiz(returning);
}

var fill_quiz = function(returning=false){
	console.log("QUIZ fill_quiz");
	var word = selectWord(returning);
	updateProgressBar();
	console.log("QUIZ fill_quiz", word);
	if (word.ID == 0) {
		loadpage("quizend");
		return;
	}

	console.log("FILLQUIZ:",word, cunescapehtml(word.NWord), cunescapehtml(word.FWord), cunescapehtml(word.Comment));

	$('#nword').html(cunescapehtml(word.NWord));
	$('#fword').html(cunescapehtml(word.FWord));
	$('#comment').html(cunescapehtml(word.Comment));
	$('#slevel span').text(word.SubLevel);
	$('#level span').text(word.Level);
	$('#nwrong span').text(word.NWrong);
	$('#wordid span').text(word.ID);
	$('#lecture span').text(word.LecName+'('+word.LecID+')');
	for(var i=0; i<word.TagIDs.length; i++){
		$('#tags span').append(word.TagNames[i]+' ('+word.TagIDs[i]+'), ');
	}
	

	$('#header a[name="right"]').text("Edit").show().unbind( "click" ).click(function(event){
		var endQuizTime= new Date();
        QUIZDURATION+=(endQuizTime-STARTTIMEQUIZ)/1000; // ms -> sec
		loadpage("newword",[word.ID, 1]); // data: ID, go_to [1=>quiz]
	});


	// once ready
	var readaloud = parseInt(localStorage.getItem("readaloud"));
	if(readaloud==1 || readaloud==2) read_native();

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
		// check all words, if current word found, adjust level
		for (var i = 0; i < QUIZWORDS.length; i++) {
			if (id==QUIZWORDS[i].ID) {
				if (parseInt(QUIZWORDS[i].SubLevel)<TR_MAX_SUBLEVELS) QUIZWORDS[i].SubLevel=parseInt(QUIZWORDS[i].SubLevel)+1;
				break;
			}
		}
		// handle quiz duration
		var endQuizTime= new Date();
        QUIZDURATION+=(endQuizTime-STARTTIMEQUIZ)/1000;
        // load new quiz word
		loadpage("quiz");
	});

	$('#buttons a[name="wrong"]').click(function(event){ 
		// check all words, if current word found, adjust level and number of wrong attempts
		for (var i = 0; i < QUIZWORDS.length; i++) {
			if (id==QUIZWORDS[i].ID) {
				if (parseInt(QUIZWORDS[i].SubLevel)>-1) {
					QUIZWORDS[i].SubLevel=parseInt(QUIZWORDS[i].SubLevel)-1;
				}
				QUIZWORDS[i].NWrong=parseInt(QUIZWORDS[i].NWrong)+1;
				break;
			}
			
		}
		var endQuizTime= new Date();
        QUIZDURATION+=(endQuizTime-STARTTIMEQUIZ)/1000;
		loadpage("quiz");
	});

	$('#buttons a[name="proceed"]').click(function(event){ 
		var wrong = $('#checkresult').text().includes("Wrong");
		console.debug("DEBUG: Wrong answer?", wrong);
		// check all words, if current word found, adjust level and number of wrong attempts
		for (var i = 0; i < QUIZWORDS.length; i++) {
			if (id==QUIZWORDS[i].ID) {
				if (!wrong){
					if (parseInt(QUIZWORDS[i].SubLevel)<TR_MAX_SUBLEVELS) QUIZWORDS[i].SubLevel=parseInt(QUIZWORDS[i].SubLevel)+1;
				}
				else{
					if (parseInt(QUIZWORDS[i].SubLevel)>-1) {
						QUIZWORDS[i].SubLevel=parseInt(QUIZWORDS[i].SubLevel)-1;
					}
				}
				QUIZWORDS[i].NWrong=parseInt(QUIZWORDS[i].NWrong)+1;
				break;
			}
			
		}
		// handle quiz duration
		var endQuizTime= new Date();
        QUIZDURATION+=(endQuizTime-STARTTIMEQUIZ)/1000;
        // load new quiz word
		loadpage("quiz");
	});

	$('#buttons a[name="show"]').click(function(event){ 
		$('#fword').show();
		$('#comment').show();
		$('#buttons a[name="read"]').show();
		$('#buttons a[name="correct"]').show();
		$('#buttons a[name="wrong"]').show();
		$('#buttons a[name="show"]').hide();
		var readaloud = parseInt(localStorage.getItem("readaloud"));
		if(readaloud==1 || readaloud==3) read_foreign();
	});

	$('#buttons a[name="check"]').click(function(event){ 
		$('#fword').show();
		$('#comment').show();
		$('#buttons a[name="read"]').show();
		$('#buttons a[name="proceed"]').show();
		$('#buttons a[name="check"]').hide();
		$('#checkresult').show();
		$('input[name="speltword"]').prop("disabled", true);
		
		var readaloud = parseInt(localStorage.getItem("readaloud"));
		if(readaloud==1 || readaloud==3) read_foreign();
		checkSpelling();
	});

}

var checkSpelling = function(){
	var user_spelling=$('input[name="speltword"]').val().trim();
	var correct_spelling=$('#fword').html();
	var corr_spell_arr = correct_spelling.split('<br>'); // this works if spelling and kanji are always in different rows for nouns
	var correct = corr_spell_arr.includes(user_spelling);
	console.log("DEBUG: ",user_spelling,corr_spell_arr,corr_spell_arr.includes(user_spelling));
	if (correct){
		$('#checkresult').text("Correct. The correct answer is:");
		$('#checkresult').css("color", "green");
	}
	else{
		$('#checkresult').text("Wrong. The correct answer is:");
		$('#checkresult').css("color", "red");
	}
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


var selectWord = function (returning=false){
	// implement different test modi
	// returns a word
	console.log("QUIZ selectWord");

	switch (QUIZTYPE){
        case 0: // training
			return selectTrainingWord(returning);
		case 3: // spelling
		case 1: // testing
			return selectTestingWord(); // returning should work anyway
		default:
			return;
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

var selectTrainingWord = function(returning=false){
	console.log("QUIZ selectTrainingWord");
	// id, selected
	// if returning, SELECTEDWORDS should always be filled!
	var lastword='';
	if (returning){
		for (var i = 0; i < SELECTEDWORDS.length; i++) {
			if (!SELECTEDWORDS[i].Selected) {
				// last lastword was the searched word
				return lastword;
			}
			lastword=SELECTEDWORDS[i];
		}
		// the very last entry is the lastword
		return lastword;
	}

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

// ---------------------------------------------------------------------


var updateProgressBar = function(calcOnly=false){
	switch (QUIZTYPE){
        case 0: // training
			return updateProgressBarTraining(calcOnly);
		case 3: // spelling
		case 1: // testing
			return updateProgressBarTest(calcOnly);
		default:
			return;
	}

}

var updateProgressBarTest = function(calcOnly=false){
	var total=QUIZWORDS.length;
	var sublevels=Array(3).fill(0); // -1,0,1

	for (var i = 0; i < QUIZWORDS.length; i++) {
		var index= QUIZWORDS[i].SubLevel
		if (QUIZWORDS[i].SubLevel==-1) index =  sublevels.length-1;
		//console.log("DEBUG:", QUIZWORDS[i].SubLevel, index);
		sublevels[index]+=1;
	}

	// make percentage
	var percentage=Array(3).fill(0);
	for (var i = 0; i < sublevels.length; i++) {
		percentage[i]=sublevels[i]/total*100;
	}
	// sum and round
	var l1=percentage[1].toFixed(0);
	var lm1p1=(percentage[1]+percentage[2]).toFixed(0);
	//console.log("QUIZ: Progress", sublevels, percentage, l1,lm1p1);

	COMPLETION = lm1p1;
	console.log("QUIZ Progressbar:", Number(COMPLETION).toFixed(1), percentage);

	if (!calcOnly){
		$('#progress div[name="value"]').text(Number(COMPLETION).toFixed(1)+'%');

		$('#progress div[name="bar"]').css("background-size", l1+'% 100%,'+ // green   +1
											  '0% 100%,'+ // yellos
											  '0% 100%, '+ // orange
											  lm1p1+'% 100%, '+ // red                 -1 (+1)
											  '0% 100%, '+ // violett
											  '100% 100%' // black                      0   (rest)
											  ); 
	}
	
}

var updateProgressBarTraining = function(calcOnly=false){
	var total=QUIZWORDS.length;
	var sublevels=Array(TR_MAX_SUBLEVELS+2).fill(0); // if 4: -1,0,1,2,3
	for (var i = 0; i < QUIZWORDS.length; i++) {
		var index= QUIZWORDS[i].SubLevel
		if (QUIZWORDS[i].SubLevel==-1) index =  sublevels.length-1;
		//console.log("DEBUG:", QUIZWORDS[i].SubLevel, index);
		sublevels[index]+=1;
	}

	// make percentage
	var percentage=Array(3).fill(0);
	for (var i = 0; i < sublevels.length; i++) {
		percentage[i]=sublevels[i]/total*100;
	}
	// sum and round
	var l3=percentage[3].toFixed(0);
	var l32=(percentage[2]+percentage[3]).toFixed(0);
	var l321=(percentage[1]+percentage[2]+percentage[3]).toFixed(0);
	var l3210=(percentage[0]+percentage[1]+percentage[2]+percentage[3]).toFixed(0);
	var l3210m1=(percentage[0]+percentage[1]+percentage[2]+percentage[3]+percentage[4]).toFixed(0);

	//console.log("QUIZ: Progress", sublevels, percentage, l3, l32,l321, l3210,l3210m1);

	
	COMPLETION = 100-(sublevels[3]*0 + sublevels[2]*1 + sublevels[1]*2 + sublevels[0]*3 + sublevels[4]*4)/(total*TR_MAX_SUBLEVELS+sublevels[4])*100;
	

	console.log("QUIZ Progressbar:", Number(COMPLETION).toFixed(1), total, total*TR_MAX_SUBLEVELS+sublevels[4], 
									sublevels[3]*0,
									sublevels[2]*1,
									sublevels[1]*2,
									sublevels[0]*3,
									sublevels[4]*4);

	if (!calcOnly){
		$('#progress div[name="value"]').text(Number(COMPLETION).toFixed(1)+'%');

		$('#progress div[name="bar"]').css("background-size", l3+'% 100%,'+ // green    +3   
											  l32+'% 100%,'+ // yellos					+2
											  l321+'% 100%, '+ // orange				+1
											  l3210+'% 100%, '+ // red        			 0
											  l3210m1+'% 100%, '+ // violett				-1
											  '100% 100%' // black         				--
											  ); 
	}
}



