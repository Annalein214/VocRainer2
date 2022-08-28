
var impressum = function(){
	$('#main').empty();
	var string='<p><strong>Impressum</strong></p>';
		string+='<p>Anbieter:</p><p>Anna Pollmann</p>';
		string+='<p>千葉県千葉市中央区松波1-17-12</p>';
		string+='<p>Telefon: +81-(0)70-1274-6391 (JAPAN)</p>';
		string+='E-Mail: anna@pollmann.co</p>';
	$('#main').append(string);

	var loggedIn=parseInt(localStorage.getItem('user_is_logged_in'));
	if (!loggedIn){
		console.log("Test");
		var string2='<a href="#" id="backtologin" style="font-size:smaller;">Back to login</a>';  
		$('#main').append(string2);    
		$('#backtologin').click(function(event){ 
			 
	        check_login();
	    });
	}
	else{
		// nix, footer ist da
	}
}