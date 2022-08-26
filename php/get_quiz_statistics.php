<?php

include('db_connect.php');


//$_POST['Learned']=2;
//$_POST['Duration']=15;//sec


	
// ###########################################################

// get all levels
$string='{"Level": ';
$string=$string.'[';
$sql1='SELECT Level, COUNT(*) Count FROM voc GROUP BY Level';
if($result1 = mysqli_query($link, $sql1)){
  while($row1 = $result1->fetch_assoc()) {
  	$string=$string.'{"Level":'.$row1["Level"].', "Count":'.$row1["Count"].'},';
  }
}
$string=rtrim($string, ",");
$string=$string.'],';

//var_dump($levels);

//echo "<br /><br />";

$string=$string.'"Learned": [';
$sql2='SELECT Day,SUM(Duration) SDuration, SUM(Learned) SLearned, 
				SUM(L0) SL0, SUM(L1) SL1, SUM(L2) SL2, SUM(L3) SL3, SUM(L4) SL4 FROM quiz GROUP BY Day';
if($result2 = mysqli_query($link, $sql2)){
  while($row2 = $result2->fetch_assoc()) {
  	$string=$string.'{"Day":"'.$row2["Day"].'", ';
  	$string=$string.'"Duration":"'.$row2["SDuration"].'", ';
  	$string=$string.'"Learned":"'.$row2["SLearned"].'", ';
  	$string=$string.'"L0":"'.$row2["SL0"].'", ';
  	$string=$string.'"L1":"'.$row2["SL1"].'", ';
  	$string=$string.'"L2":"'.$row2["SL2"].'", ';
  	$string=$string.'"L3":"'.$row2["SL3"].'", ';
  	$string=$string.'"L4":"'.$row2["SL4"].'" ';
  	$string=$string.'},';
  }
}
$string=rtrim($string, ",");
$string=$string.']';
$string=$string.'}';

echo $string;

?>