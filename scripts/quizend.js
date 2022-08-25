var loadpage_quizend = function (){
	// --- Create header

	$('#header div.h1').text("Quiz Summary");

	$('#header a[name="right"]').text("New").show().unbind( "click" ).click(function(event){
		//TODO
	});
	evaluateQuiz();
}

var evaluateQuiz = function(){

	var perfect = 0;
	var good = 0;
	var bad = 0;
	var all = QUIZWORDS.length;
	var data = []; // prepare for saving the outcome, remove stuff you dont need

	// set level and count good/bad answers
	switch (QUIZTYPE){
		case 0:
			for (var i = 0; i < all; i++) {
				if (QUIZWORDS[i].SubLevel == TR_MAX_SUBLEVELS){
					if (QUIZWORDS[i].NWrong == 0){
						// if DELTA_LEVEL_PERFECT != 1, have a bigger step for perfect answers
						QUIZWORDS[i].Level = Math.min(QUIZWORDS[i].Level+DELTA_LEVEL_PERFECT, 4);
						perfect++;
					}
					else {
						QUIZWORDS[i].Level = Math.min(QUIZWORDS[i].Level+1, 4);
						good++;
					}
				}
				else if (QUIZWORDS[i].SubLevel == -1 ||  QUIZWORDS[i].SubLevel == 0){ // not customizable because -1 and 0 really mean a bad answer!
					QUIZWORDS[i].Level = Math.max(QUIZWORDS[i].Level-1, 0);
					bad++;
				}
				// else: dont change level

				data.push({ID:QUIZWORDS[i].ID,Level:QUIZWORDS[i].Level});
			}
			break;
		case 1:
			for (var i = 0; i < all; i++) {
				if (QUIZWORDS[i].SubLevel == 1){
					QUIZWORDS[i].Level = Math.min(QUIZWORDS[i].Level+1, 4);
					good++;
				}
				else if (QUIZWORDS[i].SubLevel == -1){
					QUIZWORDS[i].Level = Math.max(QUIZWORDS[i].Level-1, 0);
					bad++;
				}
				data.push({ID:QUIZWORDS[i].ID,Level:QUIZWORDS[i].Level});
			}
			break;
		case 2:
			break;
	}


	// print evaluation
	var string = '<div>';
		string += 'Quiz completed by <span class="textpink">xx %</span><br /><br />'; // TODO
		string += 'Number of words: <span class="textpink">'+all+'</span><br />';
		if (QUIZTYPE==0) string += 'Perfect answers: <span class="textpink">'+perfect+' ('+(perfect/all*100).toFixed(1)+'%)</span><br />';
		if (QUIZTYPE<2) string += 'Good answers: &nbsp&nbsp&nbsp<span class="textpink">'+good+' ('+(good/all*100).toFixed(1)+'%)</span><br />';
		if (QUIZTYPE<2) string += 'Bad answers: &nbsp&nbsp&nbsp&nbsp<span class="textpink">'+bad+' ('+(bad/all*100).toFixed(1)+'%)</span><br /><br />';
		string += 'Time used: <span class="textpink">'+timeHumanReadable(QUIZDURATION)+'</span><br /><br />'; // TODO
		string += '</div>';

	$('#main').append(string);

	if (QUIZTYPE<2) saveOutcome(data);

	saveStatistics(perfect+good, QUIZDURATION);

	//reset
	QUIZWORDS = [];
	QUIZDURATION=0;
}

var saveStatistics = function(learned, duration){
	$.ajax({
		url: "http://pollmann.co/VocRainer/php/save_quiz_statistics.php",
		type:"POST",
        data:{Learned:learned, Duration:duration},
		success: function(res){
			console.log("QUIZEND Statistics: ",res);
			$('#main').append('<div>Saving Quiz statistics:<br /><span class="textpink">'+ res+'</span></div><br />');
        }
	});
}

var saveOutcome = function(data){
	$.ajax({
		url: "http://pollmann.co/VocRainer/php/update_quiz_words.php",
		type:"POST",
        data:{Data:data},
		success: function(res){
			console.log("QUIZEND: ",res);
			$('#main').append('<div>Saving Quiz outcome:<br /><span class="textpink">'+ res+'</span></div><br />');
        }
	});
}