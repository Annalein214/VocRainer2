<?php

include('db_connect.php');
//$_POST['name']='anna';
//$_POST['email']='anna@pollmann.co';
//$_POST['password']="anna";

//var_dump($_POST);
if ( isset($_POST['name'])) {
	
// ###########################################################
	$sql1='SELECT ID FROM user WHERE Name ="'.$_POST['name'].'"';
	if($result1 = mysqli_query($link, $sql1)){
		$n_user=(int)mysqli_num_rows($result1);
		if ($n_user>0){ 
			echo $n_user.'This user name is already used. Please choose another.';
		}
		else {
			$sql2='INSERT INTO user (Name, Password, Email) 
						VALUES ("'.$_POST['name'].'", "'.password_hash($_POST['password'], PASSWORD_DEFAULT).'", "'.$_POST['email'].'")';
			if ($link->query($sql2) === TRUE) {
				$id=$link->insert_id;
				echo "Added new user with ID ".$id.".";
			}
		}
	}
	


// ###########################################################
}
else{ // no POST data transmitted
	echo "ERROR: Values not transmitted";
	var_dump($_POST);
}


?>