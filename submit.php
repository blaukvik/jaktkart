<?php 
  $userid = trim($_POST["userid"]);
  
  if ($userid == "")                // if user id is blank
    echo "you must not leave it blank"; 
  else if ($userid == "johnny")     // if user id is "johnny" (case sensitive)
    echo "'johnny' has been used, please choose another User ID";
  else                              // if user id anything else
    echo "yeah! user id \"".$userid."\" is available, you are free to use it.d";
?>
