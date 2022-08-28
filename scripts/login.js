// functions to handle login process
// check password in php page hard coded, later move to database
// if logged in, save in localstorage

// initialize localstorage for login info
if (localStorage.getItem("user_is_logged_in") === null) {
  localStorage.setItem('user_is_logged_in',0); 
}
if (localStorage.getItem("last_login") === null) {
  localStorage.setItem('last_login',0);
}

var LOGINEXPIRE = 30*24*60*60; // 30 days




var check_login = function(){

	var loggedIn=parseInt(localStorage.getItem('user_is_logged_in'));
	console.log("LOGIN: Login status:", loggedIn);

	if (loggedIn){
		// if last login too old, log the user out
		const now=Math.floor(new Date().getTime() / 1000);
		var lastLogin=parseInt(localStorage.getItem('last_login'));
		//console.log("DEBUG:", now, lastLogin);
		console.log("LOGIN: duration since last time:", Math.round((now-lastLogin)/3600), "hours or ", Math.round((now-lastLogin)/3600/24), "days");
		if ((now-lastLogin)>(LOGINEXPIRE)){
			logout();
			
		}
	}	
	
    if (loggedIn){
        initialize_website();
    }
    else{
    	emptyPage();
    	// show login screen and initialize login submit button
    	var loginscreen = '<div class="ui-login">'+
						'<form id="form-login" method="post"> '+
		                    '<label for="username">Username:</label><br />'+
		                    '<input type="text" name="username" autofocus />'+
		                    '<br /><br />'+
		                    '<label for="password">Password:</label><br />'+
		                    '<input type="password" name="password" />'+
		                    '<br /><br />'+
		                    '<input type="submit" name="userlogin_submit" value="Login" /><br /><br />'+
		                    '<a href="#" id="register">Register</a> - <a href="#" id="forgot">Forgot password</a>'
		                '</form>'+
		            '</div>';
		$('#main').append(loginscreen);
        $('#form-login input[name=userlogin_submit]').click(function(event){        
            event.preventDefault();    
            login();
        });
        $('#register').click(function(event){        
            register();
        });
        $('#forgot').click(function(event){        
            forgotPassword();
        });
        $('div[data-role="footer"]').hide();
    }
}

var forgotPassword = function(){
	alert("This function is not automated yet. Please send a mail to anna@pollmann.co with all information that you can remember. We try to assist as soon as possible.");
}

var login = function(){
	var name=$("#form-login input[name=username]").val();
	var password=$("#form-login input[name=password]").val();
	console.log("LOGIN",name, password);
	check_password(name, password);
}

var logout = function(){
	console.log("LOGIN: logged user out");
	localStorage.setItem('user_is_logged_in',0);
	check_login();
}


var check_password=function(name, password){
	// TODO check that name and password are save to upload!
	$.ajax({
		url: "http://pollmann.co/VocRainer/php/check_password.php",
		type:"POST",
        data:{name:name, password:password},
		success: function(data){
          	console.log("LOGIN", data);
			if (data.includes("SUCCESS")){
				localStorage.setItem('user_is_logged_in',1);
				const now=Math.floor(new Date().getTime() / 1000);
				localStorage.setItem('last_login',now);
				initialize_website();
			}
			else {
				localStorage.setItem('user_is_logged_in',0);
				alert("LOGIN FAILED: username or password is wrong! Server answer: "+ data);
			}
        }
	});
}

// #############################################################################

// set global timeout for get/post/ajax
$.ajaxSetup({
    timeout: 1000,
    error: function(XMLHttpRequest, textStatus, errorThrown) {
        if (textStatus == 'timeout') {
            console.log("SYNC: Timeout", textStatus, errorThrown);
        } else {
            console.log("SYNC: Some error appeared:", errorThrown);
        }
    }
});