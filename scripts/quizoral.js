var WORDI = 0; // iterator

var loadpage_oral = function(data){
	// --- Create header

	$('#header div.h1').text("Oral Training");

	$('#header a[name="left"]').text("Quit").show().unbind( "click" ).click(function(event){
		var endQuizTime= new Date();
    QUIZDURATION+=(endQuizTime-STARTTIMEQUIZ)/1000;
		loadpage("quizend");
	});

	$('#header a[name="right"]').text("Repeat").show().unbind( "click" ).click(function(event){
		var endQuizTime= new Date();
    QUIZDURATION+=(endQuizTime-STARTTIMEQUIZ)/1000;
    WORDI=0;
		loadpage("oral",data);
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
		if (CURRENTPAGE=="oral") $('#main').append(string);
		speak("Ende", "de");
		var endQuizTime= new Date();
        QUIZDURATION+=(endQuizTime-STARTTIMEQUIZ)/1000;
		//loadpage("quizend");
		return;
	}

	var string = '<div/>'+(WORDI+1)+':<br /><span class="textpink">Native Word:</span><br /><span class="">'+QUIZWORDS[WORDI].NWord+'</span></div>';
	if (CURRENTPAGE=="oral") $('#main').append(string);
	speak(QUIZWORDS[WORDI].NWord, "de");
	var foreigndelay=Number(localStorage.getItem("readForeignDelay"));
	setTimeout(showRead_Fword, foreigndelay);
}

var showRead_Fword = function(){
	var string = '<div/><span class="textpink">Foreign Word:</span><br /><span class="">'+QUIZWORDS[WORDI].FWord+'</span></div><br />';
	if (CURRENTPAGE=="oral") $('#main').append(string);
	speak(QUIZWORDS[WORDI].FWord, "jp");
	var string = '<div/><span class="textpink">Comment:</span><br /><span class="">'+QUIZWORDS[WORDI].Comment+'</span></div><br /><br />';
	if (CURRENTPAGE=="oral") $('#main').append(string);
	speak(QUIZWORDS[WORDI].Comment, "de");
	WORDI++;
	var nativedelay=Number(localStorage.getItem("readNativeDelay"));
	setTimeout(showRead_Nword, nativedelay);
}





