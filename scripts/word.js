var BACK_TO=0; // see switch below in word_last_page

var loadpage_newword = function(data){
	// setup page header and its functionality
	// execute functions to fill the main part of the page

	$("#busy").show();
	
	if (data!=null){
		var word_id = data[0];
		BACK_TO = data[1];
	}
	else{
		var word_id=0;
		// do not set BACK_TO, it should have been set before
	}

	console.log("WORD:", SHOWTAG, LECID, LECNAME, data, word_id);

	
	//console.log("DEBUG DATA", BACK_TO, data);

	// --- Create header

	if (word_id==null || word_id==0){
		$('#header div.h1').text("Add new word");
	}
	else {
		$('#header div.h1').text("Edit word"); 
	}

	enableSaveButton();

	$('#header a[name="left"]').text("Back").show().unbind( "click" ).click(function(event){
		//var currentpage=localStorage.getItem("current_page");
		word_last_page();
	});

	
	// --- create content
	load_word(word_id);

}

var enableSaveButton = function(){
	$('#header a[name="right"]').text("Save").show().unbind( "click" ).click(function(event){
		$('#header a[name="right"]').unbind( "click" ).attr("disabled", true); // disable button to prevent bug that 2 entries are created
		get_new_word_properties();
	});
}

var word_last_page = function(){
	// logic to determine where the back button should lead to
	// uses the global BACK_TO variable for its decision

	//console.log("DEBUG LAST PAGE", BACK_TO);

	$("#busy").hide();
	switch(BACK_TO){
		case 3:
			loadpage("vocabulary");
			break;
		case 2: 
			loadpage("search");
			break;
		case 1: 
			loadpage("quiz"); // no data => proceed with quiz
			break;
		case 0:
		default:
			loadpage("words",[LECID, LECNAME]);
			break;
	}
}

// #####################################################################
// build form and its functionality 

var load_word = function (word_id){
	// if word should be edited, load its data
	// if not, just proceed to next function
	if (word_id){
		$.ajax({
			url: "http://pollmann.co/VocRainer/php/get_word.php",
			type:"POST",
	        data:{WordID:word_id},
			success: function(data){
				//console.log("DEBUG: data ", data);
				const obj = JSON.parse(data);
				//console.log("DEBUG: JSON ", obj, obj["ID"]);
				show_word_form(fill_word_form, obj);
	        },
	        error: function(jqXHR, textStatus, errorThrown){
	        	console.log("NEWWORD AJAX ERROR:",jqXHR, textStatus, errorThrown);
	        	alert("Timeout! Sorry, please reload this page");
	        }
		});
	}
	else show_word_form(null, null);
}

var show_word_form = function (fct, object){ 
	// this function creates a form and fills it with default options
	// and activates functionality
	// this function has some nested sub-functions in order to make sure that all 
	// form parts are loaded before proceeding to load functionality
	// if an existing word shall be edited, need to execute fct 
	// with the data in obj after this function

	var form = '<form id="form-newword" method="post">';
				form+='<label class="labelWithMargin" for="foreign">Foreign word:<br /><span style="color:#3E4040;">Separate correct answers into new rows, so that the spellchecker can work</span></label><textarea name="foreign" lang="ja"></textarea>';
				form+='<label class="labelWithMargin" for="native">Native word:</label><textarea name="native" lang="de"></textarea>';
				form+='<label class="labelWithMargin" for="comment">Comment:</label><textarea name="comment" lang="de"></textarea>';
    			form+='<label class="labelWithMargin" for="lecture">Lecture:</label>';
    				form+='<select name="lecture"><option value="">Choose a lecture ...</option><option value="add_new_lecture">Add new lecture ...</option></select>';
    			form+='<div id="newlecture" class="hide">';
    				form+='<br /><label for="newlecture">New lecture name:</label><input type="text" name="newlecture"></input></div>';
			    form+='<fieldset id="tags"><legend>Tags:</legend><div id="theTags"><div><input type="checkbox" name="add_new_tags"><label for="add_new_tags" class="textpink">Add new Tag</label></div></div><div class="stopfloat"></div>';
			    form+='<div id="newtag" class="hide"><br /><label for="newtag">New tags (separated by ","):</label><input type="text" name="newtag"></input></div></fieldset>';
			    form+='<label class="labelWithMargin textgray" for="wordid">Word ID: <span name="wordid" class="textgray">0</span></label>';
		form+='</form>'; 
		if (object && QUIZWORDS.length==0){ // do not show option in quiz	
			form+='<input type="submit" name="deleteword" value="Delete Entry" class="btn_fullwidth btn_red" />';
		}
	$('#main').append(form);

	// ---------------------
	// fill options
	var il_fill_lectures = function(obj){
		for (var i = 0; i < obj.length; i++) {   
	        $('#form-newword select[name="lecture"]').append('<option value="'+obj[i]["ID"]+'">'+obj[i]["Name"]+'</option>');
	    }
	    if (fct) fct(object); // needs to be loaded here, otherwise the values are not shown

	    // --------------------
		// add default lecture if no quiz is running and not using the search
		//console.log("NEWWORD: change to default lecture", LECID, SHOWTAG, QUIZWORDS.length, BACK_TO);
		if (SHOWTAG==false && QUIZWORDS.length==0 && BACK_TO==0) {
			//console.log("DEBUG", LECID);
			$('#form-newword select[name="lecture"]').val(LECID).change();
		}
		if (!object){
			// this is the end of this function
			// if a new word is requested, no further data needs to be loaded

			$("#busy").hide();
		}
	}

	var il_fill_tags = function(obj){
		for (var i = 0; i < obj.length; i++) {   
	        $('#theTags').append('<div><input type="checkbox" name="'+obj[i]["ID"]+'"><label for="'+obj[i]["ID"]+'">'+obj[i]["Name"]+'</label></div>');
	    }
	    load_all_lec_or_tags(il_fill_lectures, false); // needs to be nested, so that all options are loaded before the actual values are filled.
		// --------------------
		// add default tag
		if (SHOWTAG==true && QUIZWORDS.length==0 && BACK_TO!=2) $('#tags input[name="'+LECID+'"]').prop('checked', true);
	}
	load_all_lec_or_tags(il_fill_tags, true);

	// ---------------------
	// add functionality
	$('#form-newword select[name="lecture"]').on('change',function(event){
            if (this.value=="add_new_lecture"){
                $('#newlecture').show();
            }
            else{
            	$('#newlecture').hide();	
            }
    });

    $('#form-newword input[name="add_new_tags"]').click(function(event){
            if (this.checked){
                $('#newtag').show();
            }
            else{
            	$('#newtag').hide();	
            }
    });	

    // if a word is edited provide deletion etc.
    if (object){
	    $('input[name="deleteword"]').click(function(event){            
	        deleteWord(object["ID"]);
	    });    
	}
	}

// #####################################################################
// edit word (show current data)

var fill_word_form = function (obj){
	// needs to be the very last thing on the site to be loaded! Therefore use nested functions above
	//console.log("DBUG: fill", obj);
	$('#form-newword textarea[name="foreign"]').val(cunescape(obj["ForeignWord"]));
    $('#form-newword textarea[name="native"]').val(cunescape(obj["NativeWord"]));
    $('#form-newword textarea[name="comment"]').val(cunescape(obj["Comment"]));
    $('#form-newword span[name="wordid"]').text(obj["ID"]);

    // sometimes lecture is empty when word is accessed from search. The following seems to fix it.
    // I think the reason was fighting with the LECID setting in the other function, disabled it there for searches now
    //console.log("WORD filling lecture ID:", obj["LectureID"], $('#form-newword select[name="lecture"]').val());
    $('#form-newword select[name="lecture"]').val(obj["LectureID"]).change();
    var check = $('#form-newword select[name="lecture"]').val();
    if (check!=obj["LectureID"]){
    	console.log("WORD: try again!");
    	$('#form-newword select[name="lecture"]').val(obj["LectureID"]).change();
    }

    //console.log("DEBUG2:", obj["LectureID"], $('#form-newword select[name="lecture"]').val());


    var tags=obj["Tags"];
    for (var i in tags){
        $('#tags input[name="'+tags[i]["TagID"]+'"]').prop('checked', true);
    }   
    $("#busy").hide();
}

// #####################################################################
// save new word

var get_new_word_properties = function(){

	$("#busy").show();

	var id = $('#form-newword span[name="wordid"]').text();
	if (id == "") id=0;
	var foreign = cescape($('#form-newword textarea[name="foreign"]').val());
	//console.log("Foreign", foreign);
    var native = cescape($('#form-newword textarea[name="native"]').val());
    var comment = cescape($('#form-newword textarea[name="comment"]').val());

    // ---------------------
    // get a pre defined lecture
	var lectureid = $('#form-newword select[name="lecture"]').val();
	var lecture=$('#form-newword select[name="lecture"] option:selected').text();
	// get a newly defined lecture
	if (lectureid=="add_new_lecture"){
        lecture=$('#newlecture input').val();
    }
    if (lecture=="" || lecture.includes("Choose a lecture")) {
    	$("#busy").hide();
        alert("Lecture may not be empty. Please choose a lecture.");
        enableSaveButton(); // enable disabled button again, disabling prevents getting 2 entries for one word
        return;
    }

    // ---------------------
	// get all pre defined tags
	var tags=[]; // array of [id,name]
	var tagnames=[];
	var checkNewTags=false;
    $(':checkbox').each(function() {
        if (this.checked){
            tags.push([this.name, $(this).next('label').text()]); // id
            if (this.name == "add_new_tags") checkNewTags=true;
        }
    });
    // get newly created tags
    if (checkNewTags){
	    var extratags=$('#form-newword input[name="newtag"]').val();

	    if (extratags!="") {
	        var ext = extratags.split(',');
	        console.log("VOC: Add extra tag:", ext);
	        for (var k in ext){
	            var string=ext[k];
	            string=string.replace(/\s+/g, ''); // solve bug with extra spaces in tags
	            tags.push(["0", string]);
	        }
	    }
	}


	save_new_word_properties({ID:id, 
							  Foreign:foreign, 
							  Native:native,
							  Comment:comment,
							  LecID:lectureid, 
							  Lecture:lecture, // new lecture name or existing lecture 
							  Tags:tags, // array of [id,name]
							});
}



var save_new_word_properties = function(send){
	console.log("WORD: send", send); 
	$.ajax({
		url: "http://pollmann.co/VocRainer/php/save_word.php",
		type:"POST",
        data:send,
		success: function(data){
			console.log("WORD: save word:", data);
			if (data.includes("ERROR") || data.includes("Warning") || data.includes("Error") || data.includes("error")){
				$("#busy").hide();
				alert("ERROR occured while saving word!",data);
			}

			updateQuizWord(send); // function to be found in quiz.js

			word_last_page();
        },
        error: function(jqXHR, textStatus, errorThrown){
	        	console.log("NEWWORD AJAX ERROR:",jqXHR, textStatus, errorThrown);
	        	alert("Timeout! Sorry, please reload this page");
	    }
	});
}

// #####################################################################
// delete word

var deleteWord = function(id){
	console.log("WORD: delete", id); 
	$.ajax({
		url: "http://pollmann.co/VocRainer/php/delete_word.php",
		type:"POST",
        data:{ID:id},
		success: function(data){
			console.log("WORD: delete word:", data);
			if (data.includes("ERROR") || data.includes("Warning") || data.includes("Error") || data.includes("error")){
				$("#busy").hide();
				alert("ERROR occured while saving word!",data);
			}
			word_last_page();
        }
	});
}

