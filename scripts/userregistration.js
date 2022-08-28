var register = function (){

	alert("Database is not adjusted yet for multi-user mode. Please contact me, if you need it.");
	return;

	$('#main').empty();

	var string = '<form id="form-register">';
		string += '<label for="name">Name/UserID</label><br /><input type="text" name="name" placeholder="No space" /><br /><br />';
		string += '<label for="name">Email</label><br /><input type="email" name="email" placeholder="For password retrieval if forgotton" /><br /><br />';
		string += '<label for="name">Password</label><br /><input type="password" name="password" placeholder="Recommended to use special characters." /><br /><br />';
		string += '<input type="submit" name="userregistration_submit" value="Register" /><br /><br />';
		string +='</form>';

	$('#main').append(string);

	$('#form-register input[name=userregistration_submit]').click(function(event){        
            event.preventDefault();    
            checkregistration();
    });
}

var checkregistration = function(){

	// validate username
	var regex1 = new RegExp("^[a-zA-Z0-9!@#$%^&*+()=.:,;{}]+$");  
    var name = $('#form-register input[name="name"]').val();
    if (!regex1.test(name)) {
       alert('Only letters allowed in "Name" are: a-z A-Z 0-9 ! @ # $ % ^ & * + ( ) = . : , ; { } \nPlease change your input.');
       return;
    }

    // validate email
    var regex2 = new RegExp("/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/");  
    var email = $('#form-register input[name="email"]').val();
    if (!regex1.test(email)) {
       alert('Please enter a valid E-mail address for passwort retrieval in case you forget the password.');
       return;
    }

    // validate password
    var password = $('#form-register input[name="password"]').val();
    if (!regex1.test(password)) {
       alert('Only letters allowed in "Password" are: a-z A-Z 0-9 ! @ # $ % ^ & * + ( ) = . : , ; { } \nPlease change your input.');
       return;
    }

    saveRegisterInfo(name, password, email);
}

var saveRegisterInfo = function (name, password, email){
	$.ajax({
		url: "http://pollmann.co/VocRainer/php/save_registration.php",
		type:"POST",
        data:{name:name, password:password, email:email},
		success: function(data){
          	console.log("REGISTER", data);
			if (data.includes("already used")) {
				alert(data);
				return;
			}
			else {
				alert(data+" Please login.");
				check_login();
			}
        }
	});
}