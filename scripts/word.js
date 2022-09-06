var BACK_TO=0; // see switch below

var loadpage_newword = function(data){

	
	if (data!=null){
		var word_id = data[0];
		BACK_TO = data[1];
	}
	else{
		var word_id=0;
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

	$('#header a[name="right"]').text("Save").show().unbind( "click" ).click(function(event){
		get_new_word_properties();
	});
	$('#header a[name="left"]').text("Back").show().unbind( "click" ).click(function(event){
		//var currentpage=localStorage.getItem("current_page");
		word_last_page();
	});

	$("#busy").show();
	// --- create content
	load_word(word_id);

}

var word_last_page = function(){
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

var load_word = function (word_id){
	if (word_id){
		$.ajax({
			url: "http://pollmann.co/VocRainer/php/get_word.php",
			type:"POST",
	        data:{WordID:word_id},
			success: function(data){
				console.log("DEBUG: data ", data);
				const obj = JSON.parse(data);
				//console.log("DEBUG: JSON ", obj, obj["ID"]);
				show_word_form(fill_word_form, obj);
	        }
		});
	}
	else show_word_form(null, null);

}

var show_word_form = function (fct, object){

	var form = '<form id="form-newword" method="post">';
				form+='<label class="labelWithMargin" for="foreign">Foreign word:</label><textarea name="foreign" lang="ja"></textarea>';
				form+='<label class="labelWithMargin" for="native">Native word:</label><textarea name="native" lang="de"></textarea>';
				form+='<label class="labelWithMargin" for="comment">Comment:</label><textarea name="comment" lang="de"></textarea>';
    			form+='<label class="labelWithMargin" for="lecture">Lecture:</label>';
    				form+='<select name="lecture"><option value=""></option><option value="add_new_lecture">Add new lecture ...</option></select>';
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
		// add default lecture if no quiz is running
		if (SHOWTAG==false && QUIZWORDS.length==0) $('#form-newword select[name="lecture"]').val(LECID).change();
	}

	var il_fill_tags = function(obj){
		for (var i = 0; i < obj.length; i++) {   
	        $('#theTags').append('<div><input type="checkbox" name="'+obj[i]["ID"]+'"><label for="'+obj[i]["ID"]+'">'+obj[i]["Name"]+'</label></div>');
	    }
	    load_all_lec_or_tags(il_fill_lectures, false); // needs to be nested, so that all options are loaded before the actual values are filled.
		// --------------------
		// add default tag
		if (SHOWTAG==true && QUIZWORDS.length==0 ) $('#tags input[name="'+LECID+'"]').prop('checked', true);
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

    if (object){
	    $('input[name="deleteword"]').click(function(event){            
	        deleteWord(object["ID"]);
	    });    
	}
	else{
		$("#busy").hide();
	}


}



var fill_word_form = function (obj){
	// needs to be the very last thing on the site to be loaded! Therefore use nested functions above
	//console.log("DBUG: fill", obj);
	$('#form-newword textarea[name="foreign"]').val(cunescape(obj["ForeignWord"]));
    $('#form-newword textarea[name="native"]').val(cunescape(obj["NativeWord"]));
    $('#form-newword textarea[name="comment"]').val(cunescape(obj["Comment"]));
    $('#form-newword span[name="wordid"]').text(obj["ID"]);

    $('#form-newword select[name="lecture"]').val(obj["LectureID"]).change();

    var tags=obj["Tags"];
    for (var i in tags){
        $('#tags input[name="'+tags[i]["TagID"]+'"]').prop('checked', true);
    }   
    $("#busy").hide();
}

var get_new_word_properties = function(){

	$("#busy").show();

	var id = $('#form-newword span[name="wordid"]').text();
	if (id == "") id=0;
	var foreign = cescape($('#form-newword textarea[name="foreign"]').val());
	console.log("Foreign", foreign);
    var native = cescape($('#form-newword textarea[name="native"]').val());
    var comment = cescape($('#form-newword textarea[name="comment"]').val());

    // ---------------------
    // get a pre defined lecture
	var lectureid = $('#form-newword select[name="lecture"]').val();
	var lecture = lectureid;
	// get a newly defined lecture
	if (lectureid=="add_new_lecture"){
        var lecture=$('#newlecture input').val();
    }
    if (lecture=="") {
    	$("#busy").hide();
        alert("Lecture may not be empty. Please choose a lecture.");
        return;
    }

    // ---------------------
	// get all pre defined tags
	var tags=[];
	var checkNewTags=false;
    $(':checkbox').each(function() {
        if (this.checked){
            tags.push([this.name, ""]); // id
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


	save_new_word_properties({ID:id, Foreign:foreign, Native:native,Comment:comment,LecID:lectureid, Lecture:lecture, Tags:tags});
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
        }
	});
}

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

