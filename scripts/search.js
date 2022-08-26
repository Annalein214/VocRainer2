// search string should separate words with a space for best performance

var SEARCH = ''; // for back page

var loadpage_search = function(){

	$('#header a[name="left"]').text("Back").show().unbind( "click" ).click(function(event){
		loadpage("vocabulary", SHOWTAG);
	});

	$("#busy").show();


	showSearchField();

}

var showSearchField = function(){
	var string = '<input type="text" name="search" id="search" autocomplete="off" placeholder="Search vocabulary ..." /><br />';
		string += '<div id="searchresult"><ul class="list"></ul></div>';
	$('#main').append(string);
	$("#busy").hide();
	addSearchFct();
	if (SEARCH!=''){ // come back from another page
		$('#search').val(SEARCH);
		showResult(SEARCH);
	}
}

var addSearchFct = function(){
	$('#search').on("keyup input", function(){
		
		var inputVal = $(this).val();
		SEARCH=inputVal;
		console.log("SEARCH", inputVal);
		var resultDropdown = $('#searchresult ul');
		
		if (inputVal.length){
			showResult(inputVal, resultDropdown);
		}
		else{
			resultDropdown.empty();
		}
	});	
}

var showResult = function(inputVal){
	$("#busy").show();
	var resultDropdown = $('#searchresult ul');
	$.ajax({
		url: "http://pollmann.co/VocRainer/php/get_search_result.php",
		type:"POST",
        data: {Search:inputVal},
		success: function(data){
			$("#busy").hide();
			console.log("DEBUG: ", data);
			resultDropdown.empty();
			const obj = JSON.parse(cunescapeline(data));
          	if (obj.length>0){
          		var list='';
          		for (var i = 0; i < obj.length; i++) {
	          		list+='<li><a href="#" data-id="'+obj[i]["ID"]+'"><p class="list_right_info"></p>';
					list+='<p class="list_half_entry list_half_entry_first">'+obj[i]["FWord"]+'</p>';
					list+='<p class="list_half_entry">'+obj[i]["NWord"]+'</p></a></li>'
				}
				resultDropdown.append(list);
				$('#main div ul li a').unbind( "click" ).click(function(event){            
			            loadpage("newword",[$(this).attr('data-id'),2]);
			    });
          	}
        }
	});
}