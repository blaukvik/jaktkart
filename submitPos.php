<?php 

// JSON encode and send back to the server
header('Content-type: application/json; charset=utf-8');

  $log_dir = dirname( __FILE__ ) . '/logs/';
  $log_name = "pos.log";
  $fp=fopen( $log_dir . $log_name, 'a' );

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
 


  $jsonpos=trim($_POST["json"]);
  //$jsonpos = '{"navn":"Bla","gruppe":"buer","lat":43,"lon":12}';

  $log_entry = gmdate('r') . "jsonpos= " . $jsonpos . "\n";
  fputs($fp, $log_entry);

  $dpos = json_decode($jsonpos);


$con = mysql_connect("localhost","skullcom_jakt","jBalder01");
if (!$con)
  {
       $data = array('status'=> 'error','success'=> false,'message'=> 'DB login feil:' . mysql_error());
       echo(json_encode($data));
       die();
  }

$db_selected = mysql_select_db("skullcom_jakt", $con);
if (!$db_selected)
  {
       $data = array('status'=> 'error','success'=> false,'message'=> 'DB åpningsfeil:' . mysql_error());
       echo(json_encode($data));
       die();
  }

/* legg inn i tabell  POSISJONER
*/


/*
  Bare ha siste posisjon:
*/
        $result_res = mysql_query("delete from POSISJONER where gruppe='$dpos->gruppe' and navn='$dpos->navn'");

/*
   -kan ha med symbol inn

   -kan ha med tid som skal beholdes inn, feks slette alt eldre enn 10 sec, 3600 sec....
        $result_res = mysql_query("delete from POSISJONER where gruppe='$dpos->gruppe' and navn='$dpos->navn' and 
            (('$dpos->tid' - tid) > '$dpos->age')");


    select * from POSISJONER where (  (UNIX_TIMESTAMP(NOW()) - (tid/1000)) > 10000);

*/

        $result_res = mysql_query("INSERT INTO POSISJONER (gruppe, navn, tid, lat, lon)
                              VALUES ('$dpos->gruppe', '$dpos->navn', '$dpos->tid', '$dpos->lat', '$dpos->lon' )");
        if ($result_res == FALSE)
        {
            $data = array('status'=> 'error','success'=> false,'message'=> 'DB feil:' . mysql_error());
            echo(json_encode($data));
            die();
        }
  mysql_close($con);
    
//return
   $data = array('status'=> 'success','success'=> true,'message'=>'Lagret ' . $n . ' posisjoner  OK');
	 
// JSON encode and send back to the server
 echo(json_encode($data));

  $log_entry = gmdate('r') . "Lagret " . $n . " posisjoner \n";
  fputs($fp, $log_entry);


?>
