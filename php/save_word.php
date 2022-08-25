<?php

include('db_connect.php');

/*
$_POST['ID']="0";
$_POST['LecID']="add_new_lecture";
$_POST['Lecture']="Test";
$_POST['Tags']=[["add_new_tags",""],["0","NewTag"], ["1", "OldTag"]];
$_POST['Foreign'] = "Test";
$_POST['Native'] = "TestN";
$_POST['Comment'] = "TestC2";
*/

if ( isset($_POST['LecID'])) {
	
// ###########################################################

	
	
	// add new lectures
	if ($_POST['LecID']=="add_new_lecture"){
		$sql1= 'INSERT INTO lectures (Name) VALUES ("'.$_POST['Lecture'].'")'; 
		if ($link->query($sql1) === TRUE) {
			$_POST['LecID']=$link->insert_id;
			echo "Added new lecture: ".$_POST['Lecture']." ".$_POST['LecID']."<br />";
		}
	}
	

	// add new tags
	if (isset($_POST['Tags'])){ // if no tag is chosen this would fail otherwise
		$tags = $_POST['Tags'];
		$newtags = array();
		//foreach ($tags as list($tagID, $tagName)) {echo $tagID." ".$tagName."<br />";}
		//echo "<br /><br />";
		foreach ($tags as list($tagID, $tagName)) {
		    if ($tagID == "0") {
		    	$sql2= 'INSERT INTO tags (Name) VALUES ("'.$tagName.'")'; 
				if ($link->query($sql2) === TRUE) {
					$tagID = $link->insert_id;
					echo "Added new tag: ".$tagName." ".$tagID." <br />";
					array_push($newtags, array($tagID, $tagName));
				}
		    }
		    elseif ($tagID!="add_new_tags") {
		    	array_push($newtags, array($tagID, $tagName));
		    }
		}
	}
	

	
	// add/update new word
	if ($_POST['ID'] == "0"){
		$sql3= 'INSERT INTO voc (ForeignWord, NativeWord, Comment, Level) VALUES 
					("'.$_POST['Foreign'].'", "'.$_POST['Native'].'", "'.$_POST['Comment'].'", 0)'; 
		if ($link->query($sql3) === TRUE) {
			$wordID=$link->insert_id; // do not update $_POST['ID'] !!
			echo 'Added new word: '.$wordID.' '.$_POST['ID'].' "'.$_POST['Foreign'].'" "'.$_POST['Native'].'" "'.$_POST['Comment'].'" <br />';
		}
	}
	else {
		$sql3= 'UPDATE voc SET ForeignWord = "'.$_POST['Foreign'].'", 
								NativeWord="'.$_POST['Native'].'", 
								Comment="'.$_POST['Comment'].'" 
				WHERE ID = '.$_POST['ID'].'';
		if ($link->query($sql3) === TRUE) {
			$wordID=$_POST['ID'];
			echo 'Updated word: '.$wordID.' '.$_POST['ID'].' "'.$_POST['Foreign'].'" "'.$_POST['Native'].'" "'.$_POST['Comment'].'" <br />';
			
		}
	}
	

	
	// connect word and lecture 
	// first delete all previous connections
	$sql4 = 'DELETE FROM voc_lec WHERE VocID = "'.$wordID.'"';
	if ($link->query($sql4) === TRUE) {
		echo "Deleted all connections of word  '.$wordID.' with lecs. <br />";
	}
	// connect newly
	$sql4= 'INSERT INTO voc_lec (LecID, VocID) VALUES 
					("'.$_POST['LecID'].'", "'.$wordID.'")'; 
	if ($link->query($sql4) === TRUE) {
		$connID=$link->insert_id;
		echo 'Added new connection: '.$connID.' "'.$_POST['LecID'].'" "'.$wordID.'"<br />';
	}
	
	// connect word and tags
	// first delete all previous connections
	$sql5 = 'DELETE FROM voc_tag WHERE VocID = "'.$wordID.'"';
	if ($link->query($sql5) === TRUE) {
		echo "Deleted all connections of word  '.$wordID.' with tags. <br />";
	}
	// connect newly
	if (isset($_POST['Tags'])){ // if no tag is chosen this would fail otherwise
		foreach ($newtags as list($tagID, $tagName)) {
			$sql6= 'INSERT INTO voc_tag (TagID, VocID) VALUES 
						("'.$tagID.'", "'.$wordID.'")'; 
			if ($link->query($sql6) === TRUE) {
				$connTagID=$link->insert_id;
				echo 'Added new tag connection: '.$connTagID.' "'.$tagID.'" "'.$wordID.'"<br />';
			}
		}
	}
	

	// ----------------- Clean DB 

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