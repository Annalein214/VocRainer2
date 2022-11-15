var LECID=0; // save last status of page
var LECNAME="";

var loadpage_words = function(data){

	LECID=data[0]; // or tag id if SHOWTAG=true
	lecture_name=data[1];
	LECNAME=lecture_name;
	BACK_TO = 0;
	console.log("WORDS:", SHOWTAG, LECID, LECNAME);

	if (lecture_name.length<5) lecture_name="Lecture: "+lecture_name; // less confusing for short lecture titles
	$('#header div.h1').text(lecture_name); // TODO change to lecture name

	load_all_words_from_lec(LECID);

	$('#header a[name="left"]').text("Back").show().unbind( "click" ).click(function(event){
		loadpage("vocabulary", SHOWTAG);
	});

	$('#header a[name="right"]').text("New").show().unbind( "click" ).click(function(event){
		loadpage("newword",); // data [null, 0] -> id, go_back_to -> new word, "words"
	});

	$("#busy").show();

}

var load_all_words_from_lec = function(id){
	  var post = {LecID: id};
	  if (SHOWTAG) post = {TagID: id};

	  //console.log("DEBUG: LecID:", lecture_id);
	  $.ajax({
		url: "http://pollmann.co/VocRainer/php/get_words.php",
		type:"POST",
        data: post,
		success: function(data){
			//console.log("DEBUG: ", data);
			const obj = JSON.parse(cunescapeline(data));
          	if (obj.length>0){
          		show_word_list(obj);
          	}
        }
	});
}

var show_word_list = function(obj){
	var list = '<ul class="list">';
	for (var i = 0; i < obj.length; i++) {   

		// color the level:
		levelString=getColorStringForLevel(obj[i]["Level"]);


		list +='<li><a href="#" data-id="'+obj[i]["ID"]+'">';
			list+='<p class="list_right_info">'+levelString+'</p>';
			list+='<p class="list_half_entry list_half_entry_first">'+obj[i]["FWord"]+'</p>';
			list+='<p class="list_half_entry">'; //['+obj[i]["ID"]+']'
			list+= obj[i]["NWord"]+'</p>';
			
		list+='</a></li>'
	}
	list += "</ul>";
	if (CURRENTPAGE=="words") $('#main').append(list);

	$('#main ul li a').unbind( "click" ).click(function(event){            
            loadpage("newword",[$(this).attr('data-id'),0]);
    });
    $("#busy").hide();
}


