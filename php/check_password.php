<?php



if ( isset($_POST['name']) and isset($_POST['password'])) {

	if ( $_POST['name'] == 'anna' and $_POST['password'] == 'anna'){
		echo "SUCCESS: Login OK";
	}
	else{
		echo "ERROR: Name or password wrong!";
		var_dump($_POST);
	}
}
else{
	echo "ERROR: Values not transmitted";
	var_dump($_POST);
}

?>