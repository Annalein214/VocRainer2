var BACK_TO=0;

var loadpage_newword = function(data){

	console.log("WORD:", SHOWTAG, LECID, LECNAME);

	var word_id = data[0];
	BACK_TO = data[1];
	console.log("DEBUG DATA", BACK_TO, data);

	// --- Create header

	if (word_id==null){
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

	// --- create content
	load_word(word_id);

}

var word_last_page = function(){
	console.log("DEBUG LAST PAGE", BACK_TO);
	switch(BACK_TO){
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
	$.ajax({
		url: "http://pollmann.co/VocRainer/php/get_word.php",
		type:"POST",
        data:{WordID:word_id},
		success: function(data){
			//console.log("DEBUG: data ", data);
			const obj = JSON.parse(data);
			//console.log("DEBUG: JSON ", obj, obj["ID"]);
      		show_word_form(fill_word_form, obj);
        }
	});
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
			    form+='<fieldset id="tags"><legend>Tags:</legend><div id="theTags"><input type="checkbox" name="add_new_tags"><label for="add_new_tags" class="textpink">Add new Tag</label></div>';
			    form+='<div id="newtag" class="hide"><br /><label for="newtag">New tags (separated by ","):</label><input type="text" name="newtag"></input></div></fieldset>';
			    form+='<label class="labelWithMargin textgray" for="wordid">Word ID: <span name="wordid" class="textgray">0</span></label>';
		form+='</form>'; 
	$('#main').append(form);

	// ---------------------
	// fill options
	var il_fill_lectures = function(obj){
		for (var i = 0; i < obj.length; i++) {   
	        $('#form-newword select[name="lecture"]').append('<option value="'+obj[i]["ID"]+'">'+obj[i]["Name"]+'</option>');
	    }
	    fct(object); // needs to be loaded here, otherwise the values are not shown
	}

	var il_fill_tags = function(obj){
		for (var i = 0; i < obj.length; i++) {   
	        $('#theTags').append('<input type="checkbox" name="'+obj[i]["ID"]+'"><label for="'+obj[i]["ID"]+'">'+obj[i]["Name"]+'</label>');
	    }
	    load_all_lec_or_tags(il_fill_lectures, false); // needs to be nested, so that all options are loaded before the actual values are filled.
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
}



var fill_word_form = function (obj){
	// needs to be the very last thing on the site to be loaded! Therefore use nested functions above
	console.log("DBUG: fill", obj);
	$('#form-newword textarea[name="foreign"]').val(cunescape(obj["ForeignWord"]));
    $('#form-newword textarea[name="native"]').val(cunescape(obj["NativeWord"]));
    $('#form-newword textarea[name="comment"]').val(cunescape(obj["Comment"]));
    $('#form-newword span[name="wordid"]').text(obj["ID"]);

    $('#form-newword select[name="lecture"]').val(obj["LectureID"]).change();

    var tags=obj["Tags"];
    for (var i in tags){
        $('#tags input[name="'+tags[i]["TagID"]+'"]').prop('checked', true);
    }   
}

var get_new_word_properties = function(){

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
				alert("ERROR occured while saving word!",data);
			}
			word_last_page();
        }
	});
}

