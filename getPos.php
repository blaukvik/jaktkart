<?php 
// JSON encode and send back to the server
header('Content-type: application/json; charset=utf-8');


  $log_dir = dirname( __FILE__ ) . '/logs/';
  //$log_name = "posts-" . $_SERVER['REMOTE_ADDR'] . "-" . date("Y-m-d-H") . ".log";
  $log_name = "pos.log";
  $fp=fopen( $log_dir . $log_name, 'a' );

  $fstat = fstat($fp);
  if ($fstat['size'] > 10000)
  {
    // begynn på ny
    ftruncate($fp, 0);
  $log_entry = gmdate('r') . "(Truncated)\n";
  fputs($fp, $log_entry);
  }

if ( isset($_POST) && is_array($_POST) && count($_POST) > 0 ) { 
  $log_entry = gmdate('r') . "\t" . $_SERVER['REQUEST_URI'] . "-" . serialize($_POST) . "\n";
  fputs($fp, $log_entry);

}
else if ( isset($_POST) ) { 
  $log_entry = gmdate('r') . "\t" . $_SERVER['REQUEST_URI'] . "-" . serialize($_POST) . "\n";
  fputs($fp, $log_entry);
}
else
{
  $log_entry = gmdate('r') . "Ikke noe post\n";
  fputs($fp, $log_entry);
}
 


  $jsongruppe=trim($_POST["json"]);

  $log_entry = gmdate('r') . "jsongruppe= " . $jsongruppe . "\n";
  fputs($fp, $log_entry);

  $posquery = json_decode($jsongruppe);


$con = mysql_connect("localhost","skullcom_jakt","jBalder01");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }

$db_selected = mysql_select_db("skullcom_jakt", $con);
if (!$db_selected)
  {
  die('Could not use: ' . mysql_error());
  }

/* les tabell  POSTER
*/


$content = mysql_query("SELECT * FROM POSISJONER WHERE gruppe='$posquery->gruppe' ORDER BY tid ASC");
if ($content == FALSE)
{
  die('Query failed: ' . mysql_error());
}


/*
{"pos":[{"lat":59.13026858015918,"lon":11.406490802764893, "navn": "bla", "tid":"33331112"},
                                                  {"lat":59.13064290694189,"lon":11.404752731323242, "navn": "bla", "tid":"33331112"},
                                                  {"lat":59.13067593557923,"lon":11.406404972076416, "navn": "bla", "tid":"33331112"}
                                                 ]}
*/

  $log_entry = gmdate('r') . " parse pos\n";
  fputs($fp, $log_entry);

$posstring='';

    // første rad
    $row = mysql_fetch_array($content);
       $posstring= $posstring . '{"lat":' . $row['lat'] . ',"lon":' . $row['lon'] . ',"navn":"' . $row['navn'] . '","tid":' . $row['tid'] . ',"gruppe":"' . $row['gruppe'] . '"}';
    
  $log_entry = gmdate('r') . $posstring . " \n";
  fputs($fp, $log_entry);

    while($row = mysql_fetch_array($content))
    {
       $posstring= $posstring . ', {"lat":' . $row['lat'] . ',"lon":' . $row['lon'] . ',"navn":"' . $row['navn'] . '","tid":' . $row['tid'] . ',"gruppe":"' . $row['gruppe'] . '"}';
  $log_entry = gmdate('r') . $posstring . " \n";
  fputs($fp, $log_entry);
    }

echo "{";
echo '"pos":[';
echo $posstring;
echo ']}';


mysql_close($con);
    
  $log_entry = gmdate('r') . "Lest pos \n";
  fputs($fp, $log_entry);


?>
