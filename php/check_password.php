<?php

include('db_connect.php');
//$_POST['name']='anna';
//$_POST['password']="anna";

//var_dump($_POST);
if ( isset($_POST['name'])) {
	
// ###########################################################
	$sql1='SELECT ID, Password, Name FROM user WHERE Name ="'.$_POST['name'].'"';
	if($result1 = mysqli_query($link, $sql1)){
		$n_user=(int)mysqli_num_rows($result1);
		if ($n_user>0){ 
			while($row1 = $result1->fetch_assoc()) {
				if(password_verify($_POST['password'], $row1['Password'])){
					echo 'SUCCESS';
				}
				else {
					echo 'Username or password wrong.';
				}
			}
		}
		else {
			echo 'Username or password wrong.';
		}
	}
	


// ###########################################################
}
else{ // no POST data transmitted
	echo "ERROR: Values not transmitted";
	var_dump($_POST);
}


?>