
<?php
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

  //$page = $_GET['$page'];
//$item = $_GET['$item'];
//$getContentQuery = "SELECT content FROM myTable WHERE page='".$page."' AND item='".$item."'";
//$content = mysql_query($getContentQuery, $db);

$content = mysql_query("SELECT * FROM poster");
//echo $content;

    while($row = mysql_fetch_array($content))
    {
       echo $row['pos'];
    }

echo "slutt"
?>
