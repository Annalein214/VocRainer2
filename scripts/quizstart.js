/*
N_words
lectures (words/mean level)
tags (words / mean level)

sort by/choose by

type of test: 
- oral only (reading aloud, no test)
- training (every word 3 times)
- testing (good words only 1 time)
*/

var DEFAULTNWORDS = 15; // recommended number of words


var loadpage_quizstart = function(){

	if (QUIZWORDS.length>0){
		console.log("QUIZSTART: Running Quiz, switch to it (if oral: end it)");
		if (QUIZTYPE==2) {
			QUIZWORDS = [];
			QUIZDURATION=0;
			WORDI=0; // for oral training
			COMPLETION=0;
		}
		else 
			{
			loadpage("quiz");
			return;
			}
	}

	// --- Create header

	$('#header div.h1').text("Quiz Settings");

	$('#header a[name="right"]').text("Start").show().unbind( "click" ).click(function(event){
		getAllQuizSettings();
	});

	$("#busy").show();
	show_quiz_settings();
}


var show_quiz_settings = function(){
	var form = '';
	form +='<form id="quizstart">';
		form +='<label for="nwords" class="textpink">Number of words for quiz:</label><br />';
		form +='<input type="range" name="nwords" value="0" min="0" max="0" style="width:75%"/>';
		form +='<span id="nwords">0</span><br /><br />';
		form +='<label for="offset" class="textpink">Offset: &nbsp;&nbsp;</label><input type="number" name="offset" min="0" max="5" value=0 /><br /><br />';
		form +='<label for="lectures" class="textpink">Lecture(s):</label>';
		form +='<div id="lectures" name="lectures"></div><div style="clear:both;"></div><br /><br />';
		form +='<label for="tags" class="textpink">Tag(s):</label>';
		form +='<div id="tags" name="tags"></div><div style="clear:both;"></div><br /><br />';
		form +='<label for="sort" class="textpink">Sort/choose words by:</label><br />';
		form +='<input type="radio" name="sort" id="random" value="random"><label for="random">Random</label><br>';
		form +='<input type="radio" name="sort" id="oldest" value="oldest"><label for="oldest">Oldest Level</label><br>';
		form +='<input type="radio" name="sort" id="worst" value="worst" checked="checked"><label for="worst">Worst level</label><br><br />';
		form +='<label for="type" class="textpink">Quiz type:</label><br />';
		form +='<input type="radio" name="type" id="training" value="training" checked="checked"><label for="training">Training</label><br>';
		form +='<input type="radio" name="type" id="testing" value="testing"><label for="testing">Testing</label><br>';
		form +='<input type="radio" name="type" id="oral" value="oral"><label for="oral">Oral only</label><br><br>';
	form +='</form>';

	$('#main').append(form);

	load_all_lec_or_tags(fillq_lectures, false); // nested functions to ensure everything is loaded in the correct order
}

var fillq_lectures = function(obj){
	for (var i = 0; i < obj.length; i++) {   
			levelAvgString=getColorStringForLevel(parseFloat(obj[i]["Average"]).toFixed(1), true, false);
	        $('#lectures').append('<div class="bubble" name="lec--'+obj[i]["ID"]+'--'+obj[i]["Nwords"]+'">'+obj[i]["Name"]+'&nbsp;&nbsp;<span>('+obj[i]["Nwords"]+'/'+levelAvgString+')</span></div>');
	}
	load_all_lec_or_tags(fillq_tags, true);
}

var fillq_tags = function(obj){
	for (var i = 0; i < obj.length; i++) {   
			levelAvgString=getColorStringForLevel(parseFloat(obj[i]["Average"]).toFixed(1), true, false);
	        $('#tags').append('<div class="bubble" name="tag--'+obj[i]["ID"]+'--'+obj[i]["Nwords"]+'">'+obj[i]["Name"]+'&nbsp;&nbsp;<span>('+obj[i]["Nwords"]+'/'+levelAvgString+')</span></div>');
	}
	add_form_functions()
}

var updateSlider=function(availWords){
        // update slider and text
        //console.log("UPDATE SLIDER");
        $('#quizstart input[name="nwords"]').attr("max",availWords);
        $('#quizstart input[name="offset"]').attr("max",availWords);
        $('#quizstart input[name="nwords"]').val(Math.min(availWords, DEFAULTNWORDS));
        $('#quizstart input[name="nwords"]').focus();
        $('#quizstart input[name="nwords"]').blur();

        $('#nwords').text(Math.min(availWords, DEFAULTNWORDS));
    }

var updateSliderText=function(event){
        nWords = $('#quizstart input[name="nwords"]').val();
        $('#nwords').text(nWords);
        //console.log(val);
        $('#quizstart input[name="offset"]').attr("max",availWords-nWords);
    }
    

var add_form_functions = function(){
	// --- important variables
	var availWords = 0;
	var lectures = [];
	var tags = [];

	

	// --- bubble and slider functionality
	$('#lectures div').click(function(event){
		// get info from div data
		var info = $(this).attr('name').split("--"); // 0 lec/tag, 1 ID, 2 nwords
		// update layout and arrays
		if (!$(this).hasClass('cs_highl_btn')) { 
            $(this).addClass('cs_highl_btn');
            if (!lectures.includes(info[1])) lectures.push(info[1]);
            availWords+=parseInt(info[2]);
        }
        else{
            $(this).removeClass('cs_highl_btn');
            if (lectures.includes(info[1])) {
                const index = lectures.indexOf(info[1]);
                if (index > -1) lectures.splice(index, 1); // 2nd parameter means remove one item only
            }
            availWords-=parseInt(info[2]);
        }

        // --- Slider functionality
		$('#quizstart input[name="nwords"]').on('input', updateSliderText);
		updateSlider(availWords);
	});

	// --- bubble and slider functionality
	$('#tags div').click(function(event){
		// get info from div data
		var info = $(this).attr('name').split("--"); // 0 lec/tag, 1 ID, 2 nwords
		// update layout and arrays
		if (!$(this).hasClass('cs_highl_btn')) { 
            $(this).addClass('cs_highl_btn');
            if (!tags.includes(info[1])) tags.push(info[1]);
            availWords+=parseInt(info[2]);
        }
        else{
            $(this).removeClass('cs_highl_btn');
            if (tags.includes(info[1])) {
                const index = tags.indexOf(info[1]);
                if (index > -1) tags.splice(index, 1); // 2nd parameter means remove one item only
            }
            availWords-=parseInt(info[2]);
        }

        // --- Slider functionality
		$('#quizstart input[name="nwords"]').on('input', updateSliderText);
		updateSlider(availWords);
	});

	$("#busy").hide();
}

var getAllQuizSettings = function(){
	$("#busy").show();
	// get all settings
	var lectures = [];
	var tags = [];
	var nWords = $('#quizstart input[name="nwords"]').val();
	var sortby = $('#quizstart input[name="sort"]:checked').val();
	var type = $('#quizstart input[name="type"]:checked').val();
	var offset = $('#quizstart input[name="offset"]').val();

	// collect lectures
	$('#lectures div').each(function(){
		if ($(this).hasClass('cs_highl_btn')) {
			var info = $(this).attr('name').split("--"); 
			if (!lectures.includes(info[1])) lectures.push(info[1]);
		}
	});

	// collect tags
	$('#tags div').each(function(){
		if ($(this).hasClass('cs_highl_btn')) {
			var info = $(this).attr('name').split("--"); 
			if (!tags.includes(info[1])) tags.push(info[1]);
		}
	});

	console.log("QUIZ SETTINGS:", nWords, sortby, type, lectures, tags, offset);

	if (parseInt(nWords)==0){
		alert("Please choose a set of words for the quiz.");
		$("#busy").hide();
	}
	else{
		getQuizWords(nWords, sortby, type, lectures, tags, offset);
	}

}

var getQuizWords = function(nWords, sortby, type, lectures, tags, offset){
	var data={nWords:nWords, 
				sortby:sortby, 
				lectures:lectures,
				tags:tags,
				offset:offset};

	switch (type){
        case "training":
			QUIZTYPE = 0;
			break;
		case 'testing':
			QUIZTYPE = 1;
			break;
		case 'oral':
			QUIZTYPE = 2;
			break;
		default: //"training":
			QUIZTYPE = 0;
			break;
	}

	$.ajax({
		url: "http://pollmann.co/VocRainer/php/get_quiz_words.php",
		type:"POST",
        data:data,
		success: function(res){
			console.log("QUIZ: ",res);
			var resj = JSON.parse(res);
			console.log("QUIZ: ",resj.length,"words:",resj[0])
			$("#busy").hide();
			if (QUIZTYPE!=2) loadpage("quiz", resj);
			else loadpage("oral",resj);
        }
	});
}
