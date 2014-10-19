
/* 
$Revision: 12 $
$Date: 2013-10-14 18:49:40 +0200 (Mon, 14 Oct 2013) $

   -timertask som oppdaterer age ?
   -append pos to polyline
   -adjust maxage ? timeout + accu
   

*/

function PostData() {
	
	//alert("post 1");
	
    // 1. Create XHR instance - Start
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Msxml2.XMLHTTP");
    }
    else {
        throw new Error("Ajax is not supported by this browser");
    }
    // 1. Create XHR instance - End
    
	//alert("post 2");
    // 2. Define what to do when XHR feed you the response from the server - Start
    xhr.onreadystatechange = function () {
    	 
    	    //alert("ready: " + xhr.readyState);
    	    
        if (xhr.readyState === 4) {
        	alert("ready: status " + xhr.status);
            if (xhr.status == 200 && xhr.status < 300) {
                document.getElementById('div1').innerHTML = xhr.responseText;
            }
        }
    }

    // 2. Define what to do when XHR feed you the response from the server - Start

    var userid = document.getElementById("userid").value;

    //alert("post 3");

    // 3. Specify your action, location and Send to the server - Start 
    xhr.open('POST', 'submit.php');
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("userid=" + userid);    
    // 3. Specify your action, location and Send to the server - End
    
    	alert("sendt");

    
}
function SendPost() {
	
	//alert("post 1");
	
    // Lag request
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Msxml2.XMLHTTP");
    }
    else {
        throw new Error("Ajax is not supported by this browser");
    }

    //alert("post 2");
    // handle statuscode
    xhr.onreadystatechange = function () {
    	 
    	//alert("ready: " + xhr.readyState);
    	    
        if (xhr.readyState === 4) {
        	//alert("ready: status " + xhr.status);
            if (xhr.status == 200 && xhr.status < 300) {
                document.getElementById('svar').innerHTML = xhr.responseText;
                // refresh poster etter 3 sek
                var t=setTimeout(oppdaterPoster,3000)
            }
        }
    }

    //alert("post 3");
    var ownPosition=document.getElementById("gpsPos").innerHTML;

    // Send pos til server 
    xhr.open('POST', 'submitPost.php');
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("drev=1&pos=" + ownPosition);    

    
}

function TESTSEND()
{
        var pos = new Posisjon("Bårdx", "buer1");
        var p2 = new Pos(ownPosition);

        pos.addPos(p2);       
        
        sendPosisjon(pos);
}

function sendPosisjon(pos) 
{
    var jsonstring = JSON.stringify(pos, replacer);
    logText("jsonstring=" + jsonstring);

    // post til server
    $.ajax({
        type: "POST",
        url: "submitPos.php",
        data: {json: jsonstring},
        success: function(data) 
        {
            logText('succ:' + data.message);

            return true;
        },
        complete: function() 
        {
            logText('complete:');
        },
        error: function(x, textStatus, errorThrown) 
        {
            logText('ajax err:' + x.status + ', st=' + textStatus + ", t=" + errorThrown);

            if (x.status === 0) {
                logText('Offline ? !\n Sjekk nett.');
            } else if (x.status === 404) {
                logText('Requested URL not found.');
            } else if (x.status === 500) {
                logText('Internel Server Error.');
            } else if (textStatus === 'parsererror') {
                logText('Error.\nParsing JSON Request failed.');
            } else if (textStatus === 'timeout') {
                logText('Request Time out.');
            } else {
                logText('Unknow Error.\n' + x.responseText);
            }

            return false;
        }


    });

}
function replacer(key, value)
{
    if (typeof value === 'number' && !isFinite(value)) {
        return String(value);
    }
    return value;
}


function logText(t)
{
  setText('gpsStatus', t);
}

