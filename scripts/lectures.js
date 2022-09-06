var SHOWTAG=false; // save last status of page
console.log("LEC: initialise SHOWTAG", SHOWTAG);

var loadpage_voc = function(){

	$("#busy").show();

	console.log("LEC:", SHOWTAG, LECID, LECNAME);

	$('#header div.h1').text("Vocabulary");

	$('#header a[name="left"]').text("Search").show().unbind( "click" ).click(function(event){
		loadpage("search");
	});

	$('#header a[name="right"]').text("New").show().unbind( "click" ).click(function(event){
		loadpage("newword", [null,3]); // data: id, back to vocabulary site
	});

	//------------------

	var choice='<div id="listchoice"><a href="#" id="showTagList" style="float:right;" class="';
		if (SHOWTAG) choice += 'cs_highl_btn';
		choice +='">Tags</a><a href="#" id="showLecList" class="';
		if (!SHOWTAG) choice += 'cs_highl_btn';
		choice +='" >Lectures</a></div>';
	$('#main').append(choice);

	$('#showLecList').click(function(event) {
        console.log("MAIN: voc: show lectures");
        if (!$('#showLecList').hasClass()) { // was not activated before
            $('#showLecList').addClass('cs_highl_btn');
            $('#showTagList').removeClass('cs_highl_btn');
            $('#listOfTagsOrLecs').remove();
            SHOWTAG=false;
            load_all_lec_or_tags(show_list, false);
        };
    });

    $('#showTagList').click(function(event) {
        console.log("MAIN: voc: show tags");
        if (!$('#showTagList').hasClass()) { // was not activated before
            $('#showTagList').addClass('cs_highl_btn');
            $('#listOfTagsOrLecs').remove();
            $('#showLecList').removeClass('cs_highl_btn');
			SHOWTAG=true;
            load_all_lec_or_tags(show_list, true);
        };
    });

	//------------------

	load_all_lec_or_tags(show_list, SHOWTAG);
}

// #####################################################################

var load_all_lec_or_tags = function(fct, tags=false){

      if (tags) url= "http://pollmann.co/VocRainer/php/get_tags.php";
      else url="http://pollmann.co/VocRainer/php/get_lectures.php";

	  $.ajax({
		url: url,
		type:"GET",
        data:"",
		success: function(data){
			//console.log("LEC:", data);
			const obj = JSON.parse(data);
          	if (obj.length>0){
          		fct(obj, tags);
          	}
        }
	});

}

var show_list = function(obj, tags=false){
	var list = '<ul class="list" id="listOfTagsOrLecs">';
	for (var i = 0; i < obj.length; i++) {   

		levelAvgString=getColorStringForLevel(parseFloat(obj[i]["Average"]).toFixed(1));

		list +='<li><a href="#" data-id="'+obj[i]["ID"]+'" data-name="'+obj[i]["Name"]+'">';
			list+='<p class="list_right_info"># '+obj[i]["Nwords"]+'</p>';
			list+='<p class="list_right_info">'+levelAvgString+'</p>';
			list+='<p class="list_main_entry">'+obj[i]["Name"]+'</p>';
			
		list+='</a></li>'
	}
	list += "</ul>";
	if (CURRENTPAGE=="vocabulary") $('#main').append(list); // to avoid appending to a different site if delayed

	$('#main ul li a').unbind( "click" ).click(function(event){            
            loadpage("words",[$(this).attr('data-id'), $(this).attr('data-name'), tags]);
    });
    $("#busy").hide();
}