<?php 
  $drev = trim($_POST["drev"]);
  //$navn = trim($_POST["navn"]);
  $navn = "Dammane 2";
  $pos = trim($_POST["pos"]);
  
  if ($pos == "")              
    echo "Ingen posisjon"; 
  else                    
    echo "Ny post i posisjon= \"".$pos."\" ";
    
    
    
// login    
$con = mysql_connect("localhost","jakt","jakt");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }

// Œpne db
$db_selected = mysql_select_db("jakt", $con);
if (!$db_selected)
  {
  die('Could not use: ' . mysql_error());
  }

  
// legg inn i tabell
$result_res = mysql_query("INSERT INTO poster (DrevId, navn, pos, savedBy)
                          VALUES ('$drev', '$navn', '$pos', 'webside')");
if ($result_res == FALSE)
{
  die('Query failed: ' . mysql_error());
}


mysql_close($con);
    
?>
