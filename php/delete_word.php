<?php

include('db_connect.php');
//$_POST['ID']=1;
if ( isset($_POST['ID'])) {
	
// ###########################################################

	
	// ----------------------------
	$sql1 = 'DELETE FROM voc WHERE ID = "'.$_POST['ID'].'" LIMIT 1';
	if ($link->query($sql1) === TRUE) {
		echo 'Deleted word  '.$_POST['ID'].' with lecs. <br />';
	}

	// delete connections
	$sql4 = 'DELETE FROM voc_lec WHERE VocID = "'.$_POST['ID'].'"';
	if ($link->query($sql4) === TRUE) {
		echo 'Deleted all connections of word  '.$_POST['ID'].' with lecs. <br />';
	}

	$sql5 = 'DELETE FROM voc_tag WHERE VocID = "'.$_POST['ID'].'"';
	if ($link->query($sql5) === TRUE) {
		echo 'Deleted all connections of word  '.$_POST['ID'].' with tags. <br />';
	}

	$sql7 = 'SELECT a.ID id, a.Name name FROM lectures a LEFT JOIN voc_lec b ON a.ID = b.LecID WHERE b.ID IS NULL';
	if($result7 = mysqli_query($link, $sql7)){
	  while($row7 = $result7->fetch_assoc()) {
	  	$sql8 = 'DELETE FROM lectures WHERE ID="'.$row7["id"].'"';
	  	if ($link->query($sql8) === TRUE) {
			echo 'Deleted lecture "'.$row7["id"].'" "'.$row7["name"].'" because it is not longer used.<br />';
		}
	  }
	}

	$sql7 = 'SELECT a.ID id, a.Name name FROM tags a LEFT JOIN voc_tag b ON a.ID = b.TagID WHERE b.ID IS NULL';
	if($result7 = mysqli_query($link, $sql7)){
	  while($row7 = $result7->fetch_assoc()) {
	  	$sql8 = 'DELETE FROM tags WHERE ID="'.$row7["id"].'"';
	  	if ($link->query($sql8) === TRUE) {
			echo 'Deleted tags "'.$row7["id"].'" "'.$row7["name"].'" because it is not longer used.<br />';
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