
/* 
   -append pos to polyline
   -adjust maxage ? timeout + accu

*/

var pos_center;
var zoom_level = 12;
var num_poster = 0;


var map;
var own_marker;
var own_circle;
var ownPosition;
var ownAccuracy;
var visEgenPos;

var visAndre;
// hvor ofte skal vi lese andres plasser
var getInterval = (30*1000);
// hva er max alder for å tegne posisjoner
//var aldersgrense = (1000 * 60 * 60 * 24);
var aldersgrense = (1000 * 60 * 60 * 4);

var autoSentrer;

var runTimer;
/* hvor ofte timer kjører
 * 
 * timer restarter geopos hvis det ikke er pos
 */
var timerInterval = 10000;

var ownNavn;
var ownGruppe;
var posliste;
var antallPos = 0;

var hale;
var updateLocation ;
var updCount = 0;

var nopos = false;

var sendPosUpdates = 1;
var lastPosSent = 0;


/*
pkt 1: fra 
*/
var pkt_grense = [
new google.maps.LatLng(59.021716, 11.443119),
new google.maps.LatLng(59.021449,  11.445819),
new google.maps.LatLng(59.020939,  11.449259),
new google.maps.LatLng(59.019336,  11.454241),
new google.maps.LatLng(59.021497,  11.458969),
/*
new google.maps.LatLng(59.023663,  11.461267),
new google.maps.LatLng(59.026629,  11.464746),
new google.maps.LatLng(59.029577,  11.469192),
new google.maps.LatLng(59.032918,  11.466425),
new google.maps.LatLng(59.033162,  11.467070),
new google.maps.LatLng(59.028137,  11.477559),
*/
/* mellomtjern */

new google.maps.LatLng(59.024103  , 11.481291),
new google.maps.LatLng(59.024253  , 11.480518),
new google.maps.LatLng(59.027274  , 11.478278),
new google.maps.LatLng(59.027481  , 11.478711),
new google.maps.LatLng(59.027768  , 11.478549),
new google.maps.LatLng(59.028003  , 11.478226),
new google.maps.LatLng(59.027859  , 11.477981),
new google.maps.LatLng(59.028252  , 11.477172),
new google.maps.LatLng(59.030622  , 11.472323),
new google.maps.LatLng(59.033162  , 11.467041),
new google.maps.LatLng(59.033022  , 11.466613),
new google.maps.LatLng(59.033012  , 11.466455),
new google.maps.LatLng(59.034490  , 11.464574),
new google.maps.LatLng(59.035352  , 11.469552),
new google.maps.LatLng(59.035503  , 11.469406),
new google.maps.LatLng(59.036551  , 11.473821),
new google.maps.LatLng(59.037145  , 11.475145),
new google.maps.LatLng(59.037650  , 11.476934),
new google.maps.LatLng(59.037988  , 11.480409),
new google.maps.LatLng(59.041062  , 11.489496),
new google.maps.LatLng(59.041748  , 11.490226),
new google.maps.LatLng(59.042026  , 11.490481),
new google.maps.LatLng(59.041559  , 11.492383),
new google.maps.LatLng(59.041513  , 11.492641),
new google.maps.LatLng(59.042177  , 11.493160),
new google.maps.LatLng(59.042353  , 11.493120),
new google.maps.LatLng(59.042539  , 11.493238),
new google.maps.LatLng(59.042764  , 11.493490),
new google.maps.LatLng(59.043371  , 11.493430),
new google.maps.LatLng(59.043597  , 11.493603),
new google.maps.LatLng(59.043777  , 11.493354),
new google.maps.LatLng(59.044007  , 11.493319),
new google.maps.LatLng(59.044179  , 11.493462),
new google.maps.LatLng(59.044267  , 11.493128),
new google.maps.LatLng(59.044476  , 11.493457),
new google.maps.LatLng(59.044690  , 11.493551),
new google.maps.LatLng(59.045163  , 11.493455),
new google.maps.LatLng(59.045324  , 11.493493),
new google.maps.LatLng(59.046016  , 11.492549),
new google.maps.LatLng(59.046289  , 11.492359),
new google.maps.LatLng(59.046529  , 11.492534),
new google.maps.LatLng(59.047494  , 11.494173),
new google.maps.LatLng(59.047544  , 11.494412),
new google.maps.LatLng(59.048415  , 11.495338),
new google.maps.LatLng(59.049084  , 11.496983),
new google.maps.LatLng(59.049507  , 11.497458),
new google.maps.LatLng(59.049575  , 11.498117),
new google.maps.LatLng(59.050227  , 11.498530),
/* veien */
new google.maps.LatLng(59.050223  , 11.498739),
new google.maps.LatLng(59.047647  , 11.501639),
new google.maps.LatLng(59.046740  , 11.502540),
new google.maps.LatLng(59.046780  , 11.503956),
new google.maps.LatLng(59.045649  , 11.505992),
new google.maps.LatLng(59.046872  , 11.507546),
new google.maps.LatLng(59.047648  , 11.508544),
new google.maps.LatLng(59.049399  , 11.510712),
new google.maps.LatLng(59.050366  , 11.511541),
new google.maps.LatLng(59.050519  , 11.512703),
new google.maps.LatLng(59.050242  , 11.513076),
new google.maps.LatLng(59.050237  , 11.513337),
new google.maps.LatLng(59.050096  , 11.513693),
new google.maps.LatLng(59.050212  , 11.513937),
new google.maps.LatLng(59.049952  , 11.515513),
new google.maps.LatLng(59.050045  , 11.516279),
new google.maps.LatLng(59.049799  , 11.516496),
new google.maps.LatLng(59.049774  , 11.517070),
new google.maps.LatLng(59.049998  , 11.517348),
new google.maps.LatLng(59.049802  , 11.517700),
new google.maps.LatLng(59.049579  , 11.518076),
new google.maps.LatLng(59.048436  , 11.524871),
new google.maps.LatLng(59.042609  , 11.519579),
new google.maps.LatLng(59.040148  , 11.517255),
new google.maps.LatLng(59.035328  , 11.510731),
new google.maps.LatLng(59.035071  , 11.510817),
new google.maps.LatLng(59.034902  , 11.511197),
new google.maps.LatLng(59.033751  , 11.511453),
new google.maps.LatLng(59.033447  , 11.511823),
new google.maps.LatLng(59.033289  , 11.511655),
new google.maps.LatLng(59.033107  , 11.512007),
new google.maps.LatLng(59.032987  , 11.511946),
new google.maps.LatLng(59.032634  , 11.512051),
new google.maps.LatLng(59.032641  , 11.512418),
new google.maps.LatLng(59.031847  , 11.512334),

/* ekeli */
new google.maps.LatLng(59.027968  , 11.519164),
new google.maps.LatLng(59.026696  , 11.521502),
new google.maps.LatLng(59.021793  , 11.533819),
new google.maps.LatLng(59.020498  , 11.538010),
new google.maps.LatLng(59.019513  , 11.542172),
new google.maps.LatLng(59.019166  , 11.545413)



];

/* s�ndre grense */
var pkt_grense2 = [

new google.maps.LatLng(59.002562  , 11.531700),
new google.maps.LatLng(59.002914  , 11.531621),
new google.maps.LatLng(59.003131  , 11.530854),
new google.maps.LatLng(59.003129  , 11.528894),
new google.maps.LatLng(59.003028  , 11.526457),
new google.maps.LatLng(59.003254  , 11.525899),
new google.maps.LatLng(59.003382  , 11.525569),
new google.maps.LatLng(59.003182  , 11.524771),
new google.maps.LatLng(59.003039  , 11.524499),
new google.maps.LatLng(59.003193  , 11.524197),
new google.maps.LatLng(59.003582  , 11.523598),
new google.maps.LatLng(59.003776  , 11.523351),
new google.maps.LatLng(59.003679  , 11.522796),
new google.maps.LatLng(59.003326  , 11.522247),
new google.maps.LatLng(59.003069  , 11.522255),
new google.maps.LatLng(59.002820  , 11.522628),
new google.maps.LatLng(59.002462  , 11.523020),
new google.maps.LatLng(59.002164  , 11.523076),
new google.maps.LatLng(59.001227  , 11.522041),
new google.maps.LatLng(59.000810  , 11.522037),
new google.maps.LatLng(59.000546  , 11.521704),
new google.maps.LatLng(58.999005  , 11.519188),
new google.maps.LatLng(58.998854  , 11.519334),
new google.maps.LatLng(58.998034  , 11.518543),
new google.maps.LatLng(58.996654  , 11.521576),
new google.maps.LatLng(58.995665  , 11.521869),
new google.maps.LatLng(58.994920  , 11.521371),
new google.maps.LatLng(58.994281  , 11.520933),
new google.maps.LatLng(58.993745  , 11.520789),
new google.maps.LatLng(58.992799  , 11.520903),
new google.maps.LatLng(58.992714  , 11.520426),
new google.maps.LatLng(58.992285  , 11.520317),
new google.maps.LatLng(58.992045  , 11.520168),
new google.maps.LatLng(58.991526  , 11.520522),
new google.maps.LatLng(58.991172  , 11.520705),
new google.maps.LatLng(58.990987  , 11.520535),
new google.maps.LatLng(58.989631  , 11.520984),
new google.maps.LatLng(58.988332  , 11.520524),
new google.maps.LatLng(58.988961  , 11.520048),
new google.maps.LatLng(58.988999  , 11.519502),
new google.maps.LatLng(58.989527  , 11.516590),
new google.maps.LatLng(58.989366  , 11.515873),
new google.maps.LatLng(58.989706  , 11.515741),
new google.maps.LatLng(58.990499  , 11.512352),
new google.maps.LatLng(58.991897  , 11.509059),
new google.maps.LatLng(58.991920  , 11.508591),
new google.maps.LatLng(58.992236  , 11.506890),
new google.maps.LatLng(58.992472  , 11.506516),
new google.maps.LatLng(58.993425  , 11.505331),
new google.maps.LatLng(58.994078  , 11.505013),
new google.maps.LatLng(58.994247  , 11.504634),
new google.maps.LatLng(58.994584  , 11.502543),
new google.maps.LatLng(58.995054  , 11.500566),
new google.maps.LatLng(58.995209  , 11.499506),
new google.maps.LatLng(58.995931  , 11.497704),
new google.maps.LatLng(58.996292  , 11.497130),
new google.maps.LatLng(58.996881  , 11.496676),
new google.maps.LatLng(58.997237  , 11.496389),
new google.maps.LatLng(58.997203  , 11.496021),
new google.maps.LatLng(58.997089  , 11.495673),
new google.maps.LatLng(58.997376  , 11.494048),
new google.maps.LatLng(58.997543  , 11.493068),
new google.maps.LatLng(58.997823  , 11.491808),
new google.maps.LatLng(58.998751  , 11.490543),
new google.maps.LatLng(58.998907  , 11.489405),
new google.maps.LatLng(58.998672  , 11.489049),
new google.maps.LatLng(58.997939  , 11.488604),
new google.maps.LatLng(58.996977  , 11.488169),
new google.maps.LatLng(58.996252  , 11.488038),
new google.maps.LatLng(58.995946  , 11.487833),
new google.maps.LatLng(58.995628  , 11.488254),
new google.maps.LatLng(58.995203  , 11.487910),
new google.maps.LatLng(58.994741  , 11.488112),
new google.maps.LatLng(58.994501  , 11.487990),
new google.maps.LatLng(58.994487  , 11.487310),
new google.maps.LatLng(58.994238  , 11.486953),
new google.maps.LatLng(58.993890  , 11.486823),
new google.maps.LatLng(58.993732  , 11.486629),
new google.maps.LatLng(58.993846  , 11.486298),
new google.maps.LatLng(58.994119  , 11.486134),
new google.maps.LatLng(58.994072  , 11.485765),
new google.maps.LatLng(58.993592  , 11.485496),
new google.maps.LatLng(58.993161  , 11.484786),
new google.maps.LatLng(58.992246  , 11.483989),
new google.maps.LatLng(58.991101  , 11.482574),
new google.maps.LatLng(58.990340  , 11.482180),
new google.maps.LatLng(58.989788  , 11.481435),
new google.maps.LatLng(58.989398  , 11.480728),
new google.maps.LatLng(58.988587  , 11.480148),
new google.maps.LatLng(58.988004  , 11.479610),
new google.maps.LatLng(58.986909  , 11.478356),
new google.maps.LatLng(58.985740  , 11.476784),
new google.maps.LatLng(58.985580  , 11.476694)
];

/* 3: rundt Mo */
var pkt_grense3 = [
new google.maps.LatLng(59.024461,  11.515169),
new google.maps.LatLng(59.023327,  11.513858),
new google.maps.LatLng(59.021788,  11.512596),
new google.maps.LatLng(59.020687,  11.511679),
new google.maps.LatLng(59.020089,  11.510564),
new google.maps.LatLng(59.019277,  11.510766),
new google.maps.LatLng(59.019441,  11.512006),
new google.maps.LatLng(59.019270,  11.512490),
new google.maps.LatLng(59.020123,  11.515062),
new google.maps.LatLng(59.020954,  11.514600),
new google.maps.LatLng(59.021848,  11.514351),
new google.maps.LatLng(59.022678,  11.514673),
new google.maps.LatLng(59.023695,  11.515035),
new google.maps.LatLng(59.024339,  11.515161)
];


var num_grenser=3;

var grenser= [
pkt_grense,
pkt_grense2,
pkt_grense3
];


/*
*/
function StatkartMapType(name, layer) {
  this.layer = layer;
  this.name = name;
  this.alt = name;

  this.tileSize = new google.maps.Size(256,256);
  this.maxZoom = 19;
  this.getTile = function(coord, zoom, ownerDocument) {
      var div = ownerDocument.createElement('DIV');
      div.style.width = this.tileSize.width + 'px';
      div.style.height = this.tileSize.height + 'px';
      div.style.backgroundImage = "url(http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=" + this.layer + "&zoom=" + zoom + "&x=" + coord.x + "&y=" + coord.y + ")";
      return div;
    };
}

      

/*
   handler for knapp - EgenPos
*/
function HomeControl(controlDiv, map) {

  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlDiv.style.padding = '5px';

  // Set CSS for the control border
  var controlUI = document.createElement('HOMEDIV');
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '2px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Klikk for &aring; sentrere p&aring; egen pos';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('HOMEDIV');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlText.innerHTML = '<b>Egen pos</b>';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to
  // Chicago
  google.maps.event.addDomListener(controlUI, 'click', function() {

    logText("egen pos");
    map.setCenter(ownPosition);
  });

}

/*
   handler for knapp - Drev
*/
function DrevControl(controlDiv, map) {

  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlDiv.style.padding = '5px';

  // Set CSS for the control border
  var controlUI = document.createElement('DREVDIV');
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '2px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Klikk for &aring; sentrere p&aring; drev';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('DREVDIV');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlText.innerHTML = '<b>Senter</b>';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to
  // Chicago
  google.maps.event.addDomListener(controlUI, 'click', function() {
    logText("drev");
    map.setCenter(pos_center);
    map.setZoom(zoom_level);
  });

}

/*
*/
function gotPositionOK(position) {
  // got a position  
  
  ownPosition = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
  ownAccuracy = position.coords.accuracy;
          
  var posTime = new Date(position.timestamp);

  if (autoSentrer === undefined || autoSentrer === 1)
  {
      logText("AutoSentrer egen pos");
    // flytt marker dit (ble satt til center først)
    own_marker.setPosition(ownPosition);

    // flytt circle and update radius & color
    own_circle.setCenter(ownPosition);

   // set egen plass midt på kart
    map.setCenter(ownPosition);
  }
  
  own_circle.setRadius(position.coords.accuracy);

  if (nopos === true)
  {
    nopos = false;
  }

  
  
  setText('gpsStatus', "upd="+updCount+"," + "gotPosOK");
  setText('gpsPos', "lat,lon: " + ownPosition.lat() + ", " +ownPosition.lng());
  //tText('gpsAccu').innerHTML = position.coords.accuracy;  
  setOppdatertTid(posTime);
  

/*
	hale
*/
	if (hale === undefined)
	{
		var linjefarge = "#E01BE0";
		var tykkelse = 3;
		hale = new google.maps.Polyline({
			strokeColor : linjefarge,
			strokeOpacity : 1.0,
			map : map,
			strokeWeight : tykkelse
		});
	}
	else
	{
		hale.getPath().clear();
	}
         
  // cancel any old watcher       
  if(updateLocation !== null)
  {
    navigator.geolocation.clearWatch(updateLocation);  
  }  
  
  // start watching      
  updateLocation = navigator.geolocation.watchPosition(
    positionUpdateFromWatch, 
    positionUpdateFailed,
    {enableHighAccuracy:true, maximumAge:30000, timeout:30000});               
}


function gotPositionFailed(error) {
  /* første get etter klikk feilet, typisk timeout 
     watch er ikke startet ?
     
     
     
  */

/*  if(own_marker)
  {
    own_marker.setMap(null);
  }
  if(circle)
  {
    own_circle.setMap(null);
  }
  */
  // bruk drevsenter ?
  //ownPosition = pos_center;  
  /*
       bytt til '?'
  */
 nopos = true;

  updCount = updCount + 1;
	
  setText('gpsStatus', "upd="+updCount+"," + "gotPosFailed:" + error.message);
  setText('gpsPos',"?");  
  setText('gpsAccu', "?");  
  setText('gpsAge', "?");
  
  
}

function setText(elem, txt)
{
	//alert("e" + elem + "-" + txt);
	
	if (document.getElementById(elem) && document.getElementById(elem).innerHTML) 
	   document.getElementById(elem).innerHTML = txt;
}
function setValue(elem, v)
{
	//alert("e" + elem + "-" + txt);
	
	if (document.getElementById(elem)) 
	   document.getElementById(elem).value = v;
}

function getTimeString(posTime) {
	return(( "0" + posTime.getHours()).slice(-2) 
	     + ":" + ("0" + posTime.getMinutes()).slice(-2) 
	     + ":" + ("0" + posTime.getSeconds()).slice(-2));
}

function setOppdatertTid(posTime) {
	setText('gpsTime', getTimeString(posTime));
}


function positionUpdateFromWatch(position) 
{
  
  ownPosition = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
  ownAccuracy = position.coords.accuracy;
  var posTime = new Date(position.timestamp);
  
  
    if (nopos === true)
  {
    nopos = false;
  }

  
  if (autoSentrer === undefined || autoSentrer === 1)
  {
    // flytt markør
    own_marker.setPosition(ownPosition);

    // flytt sirkel, set radius & farge
    own_circle.setCenter(ownPosition);
    own_circle.setRadius(position.coords.accuracy);

    if (position.coords.accuracy > 100.0){
      own_circle.setOptions({strokeColor: '#FF0000'});  //red
    }
    else if (position.coords.accuracy > 50.0){
      own_circle.setOptions({strokeColor: 'yellow'});
    }
    else if (position.coords.accuracy > 25.0){
      own_circle.setOptions({strokeColor: '#00AA00'});  // dark green
    }
    else {//if (position.coords.accuracy > 0){
      own_circle.setOptions({strokeColor: 'green'});
    } 

  }
  
	

  	// lagre i historien
	if (hale.getPath().length > 50)
		hale.getPath().removeAt(0);
	
	hale.getPath().push(ownPosition);	
  
  
  updCount = updCount + 1;
  setText('gpsStatus', "upd="+updCount+"," + "updFromWatchOK");
  setText('gpsPos', "lat,lon: " + ownPosition.lat() + ", " +ownPosition.lng());
  setText('gpsAccu', position.coords.accuracy);  
  setOppdatertTid(posTime);
  
  
  if (sendPosUpdates !== undefined && sendPosUpdates  > 0)
  {
      var now = new Date();
    var diff = now - lastPosSent;
    
      if (diff > 10000)
    {
        onTimerSendOwnPos();
        lastPosSent = posTime;
        setText('userid', "sendt"); 
    }
    else
    {
        setText('userid', "ikke enda " + diff); 
    }
  }
          
  
  
}


function positionUpdateFailed(error) 
{ 
  /* oppdatering feilet 
     dvs ingen ny pos i tiden ...
     bytt til '?'
     
  */
 nopos = true;
  
  updCount = updCount + 1;
  setText('gpsStatus', "upd="+updCount+"," + "updFromWatchFailed:" + error.message);  
  
  //setOppdatertTid(posTime);
  
  own_circle.setOptions({strokeColor: '#FF0000'});
  
}


function getOwnPosition() {  
	setText('gpsStatus', "leter etter gps");
  // Try W3C Geolocation 
  
  if(navigator.geolocation) 
  {  
    navigator.geolocation.getCurrentPosition(
      gotPositionOK, 
      gotPositionFailed,
      {enableHighAccuracy:true, maximumAge:30000, timeout:30000}
    );                     
  } else {
    // Browser doesn't support Geolocation
    setText('gpsStatus',  "GPS virker ikke ?");  
    alert("Kan ikke få GPS pos, er det skrudd av ?" );

	// fjern fra kart  
    if(own_marker)
    {
      own_marker.setMap(null);
    }
    if(own_circle)
    {
      own_circle.setMap(null);
    }
    // bruk drevsenter    
    ownPosition = pos_center;  
    ownAccuracy = 1000;
  }    
    
}


/*

*/
function initialize() {

	setText('gpsStatus', "start init");
        
	setText('svar', "Fjerner personer etter " + aldersgrense/(3600*1000) + " timer");

	ownNavn = localStorage.getItem("jaktNavn");
	//ownGruppe = localStorage.getItem("jaktGruppe");

        //if (ownNavn === undefined || ownNavn.length < 1)
        {
           var person = prompt("Hvem er du?", ownNavn);
           if (person != null) {
             ownNavn = person;
             localStorage.setItem("jaktNavn", ownNavn);
	   }
         }       
	setValue('userid', ownNavn);
        
/* set navigerings stil for maps
*/
  var useragent = navigator.userAgent;
  var myStyle;

  if (useragent.indexOf('iPhone') != -1) {
    myStyle = google.maps.NavigationControlStyle.SMALL;
  } else if (useragent.indexOf('Android') != -1 ) {
    myStyle = google.maps.NavigationControlStyle.ANDROID;    
  } else {
    myStyle = google.maps.NavigationControlStyle.DEFAULT;  // DEFAULT, SMALL, ZOOM_PAN    
  } 
    
  map = new google.maps.Map(document.getElementById("mapCanvas"),
                {
                zoom: zoom_level,
                center: pos_center,
                scaleControl : true,
                navigationControlOptions: {
                  style: myStyle
                },
                mapTypeControlOptions: {
                  mapTypeIds: ['topo2',google.maps.MapTypeId.SATELLITE, 'europa'],
                  style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                  }
                });

  map.mapTypes.set('topo2',new StatkartMapType("Kart", "topo2"));
  
  
  /*
  //flere kart i meny:
  mapTypeIds: ['kartdata2', 'sjo_hovedkart2', 'topo2', 'topo2graatone', 'toporaster2', 'europa',google.maps.MapTypeId.SATELLITE],
                 
  
  map.mapTypes.set('sjo_hovedkart2',new StatkartMapType("Sjo hovedkart", "sjo_hovedkart2"));
  map.mapTypes.set('kartdata2',new StatkartMapType("Kartdata 2", "kartdata2"));
  map.mapTypes.set('topo2graatone',new StatkartMapType("Graatone", "topo2graatone"));
  map.mapTypes.set('toporaster2',new StatkartMapType("Toporaster", "toporaster2"));
  */
  map.mapTypes.set('europa',new StatkartMapType("Europa", "europa"));

  // default maptype
  map.setMapTypeId('topo2');

  // lag "buttons"	
  var homeControlDiv = document.createElement('HOMEDIV');
  var homeControl = new HomeControl(homeControlDiv, map);
  homeControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);  
    
  var drevControlDiv = document.createElement('DREVDIV');
  var drevControl = new DrevControl(drevControlDiv, map);
  drevControlDiv.index = 2;
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(drevControlDiv);  


  /* Legg ut postene */
	setText('gpsStatus', "legger ut poster");
  var n;                  
  for (n=1; n <=num_poster; n++)
  {
    var marker_post = new google.maps.Marker({
                        position: post_pos[n-1],
                        map:map,
                        icon:'marker'+n+'.png'}
                      ); 
  }                         

  
  /* Legg ut grensen */
	setText('gpsStatus', "legger ut grenser");


var linjefarge = "#E01BE0";
var tykkelse = 3;
  
var gn = 0;

for(gn=0;gn<num_grenser;gn++)
{
  var gr = new google.maps.Polyline({
      path: grenser[gn],
      strokeColor: linjefarge,
      strokeOpacity: 1.0,
      map: map,
      strokeWeight: tykkelse
      });

}  


	setText('gpsStatus', "start i senter");
  // lag egen markør - midt i kartet  
                    own_marker = new MarkerWithLabel({
                        position: pos_center,
                        map:map,
                        icon: "blue.png",                        
                        title : ownNavn ,
			labelAnchor: new google.maps.Point(20,50),
			labelClass: "plabel",
			labelContent: ownNavn,
			labelStyle: {opacity: 0.75}
			}); 
                    
  own_circle = new google.maps.Circle({center:pos_center,
                                   radius: 1000,
                                   map:map,
                                   strokeColor: 'red'});    
                               
if (visEgenPos === undefined || visEgenPos ===1)
{
    own_marker.setVisible(true);
    own_circle.setVisible(true);

}  
else
{
    own_marker.setVisible(false);
    own_circle.setVisible(false);    
}

  
  /* Finn og tegn egen posisjon */
  getOwnPosition();


    ///window.onload = function(){timer.start(10, 'timer');};
    if (runTimer === undefined || runTimer === 1)
    {
        logText("runtimer, starter timer");
       
        mytimer.start(timerInterval, 'timer') ;
    }
    else
    {
        logText("uten timer");        
    }


}

function logText(intxt)
{
    var now = new Date();
    
    //var txt = now.getHours() + ":" + now.getMinutes()+ ":" + now.getSeconds() + ":" + intxt;
   var txt = ("0" + now.getHours()).slice(-2) +":" + ("0" + now.getMinutes()).slice(-2) +":" + ("0" + now.getSeconds()).slice(-2);
   txt = txt + ":" + intxt;
    
    if (console)
        console.log(txt);
    else
        alert(txt);

    
    var txtarea = document.getElementById('id_log');
    
    if (txtarea && txtarea.innerHTML)
    {    
        var newtext = txtarea.innerHTML.toString() + txt + '\n';

        txtarea.innerHTML = newtext;

        txtarea.scrollTop =    txtarea.scrollHeight;
    } 

}



function setUserId()
{
     ownNavn = document.getElementById("userid").value;
     localStorage.setItem("jaktNavn", ownNavn);
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
    var opt=document.getElementById("gpsPos").innerHTML;

    // Send pos til server 
    xhr.open('POST', 'submitPost.php');
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("drev=1&pos=" + opt);    

    
}
var nypostnr=1;
function onKlikkSendNyPost()
{
  if (ownPosition !== undefined )
  {
        var post = new Posisjon("ny"+nypostnr+ownNavn, ownGruppe, ownPosition.lat(), ownPosition.lng());
        sendNyPost(post);
	nypostnr++;
  }	 
  else
    logText("ownPosition undef");
}

function onKlikkSendOwnPos()
{
  if (ownPosition !== undefined )
  {
      if (ownNavn === undefined || ownNavn.length < 1)
      {
          setText(gpsStatus, "Ikke navn, lagrer ikke");
	  return;
      }
        var pos = new Posisjon(ownNavn, ownGruppe, ownPosition.lat(), ownPosition.lng());
        sendPosisjon(pos);
  }	 
  else
    logText("ownPosition undef");
}

function onTimerSendOwnPos()
{
  if (ownPosition !== undefined )
  {
      if (ownNavn === undefined || ownNavn.length < 1)
      {
          logText("Ikke navn, lagrer ikke");
          return;
      }
        var pos = new Posisjon(ownNavn, ownGruppe, ownPosition.lat(), ownPosition.lng());
        sendPosisjon(pos);
  }	 
  else
    logText("ownPosition undef");
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

function onKlikkLesPosisjoner()
{
    logText("henter posisjoner");
    getPosisjoner(ownGruppe);
    
    return false;
}

var     getInProgress = 0;

function getPosisjoner(gruppe)
{
    
    // her må det være en mutex
    if (getInProgress > 0)
    {
       logText("Henter er i gang");
        return;
    }
    
    getInProgress = 1;

/*
 * can pass maxage etc
 */    
   var g = new Gruppe(gruppe);

    var jsonstring = JSON.stringify(g, replacer);

    $.ajax({
        type: "POST",
        url: "getPos.php",
        data: {json: jsonstring},
        success: function(data) {
	    if (data === undefined || data.pos === undefined)
	    {
               logText('ingen posisjoner');
	       return;
            }

            logText('lest inn ' + data.pos.length + ' posisjoner');

            if (posliste)
            {
                //logText("Sletter gamle");
		for (var o=0; o<posliste.length;o++)
		{
		   posliste[o].setMap(null);
		   //delete posliste[o];
		}
                delete posliste;
            }

            posliste = new Array();
            
            var now = new Date();
	    var navneliste = "";

            for (var n=0 ; n<data.pos.length; n++)
            {
                var navn = data.pos[n].navn;

if (navn==ownNavn)
{
  //logText("Tegner ikke egen");
  continue;
}
                var tidstr;
                
                if (data.pos[n].tid !== undefined)
		{
		  var ptime=new Date(data.pos[n].tid);

	          // 30 minutter
                  if ((navn.substr(0,2) != "ny") &&
		      (now-ptime > aldersgrense))
		  {
		     logText("For gammel pos  " + navn + " " + ptime);
		     continue;
                  }

                   tidstr = getTimeString(ptime);
                }
		else
                   tidstr = "";
                       
                if (navn === undefined)
                    navn = "ukjent";
                
                var icon = "red.png";
                
                if (navn.substr(0,2) == "ny")
		{
		  icon="green.png";
		}

                var p = new google.maps.LatLng(data.pos[n].lat, data.pos[n].lon);
                //var p = new google.maps.LatLng(data.pos[n].lon, data.pos[n].lat);  // bug i firefox ??

                if (p !== undefined)
                {
                    logText(navn + ":" + tidstr + ":" + p.lat() + "/" + p.lng());
                    var m = new MarkerWithLabel({
                        position: p,
                        map:map,
                        icon: icon,                        
                        title : "" + navn + ' kl ' + tidstr,
			labelAnchor: new google.maps.Point(20,50),
			labelClass: "plabel",
			labelContent: navn,
			labelStyle: {opacity: 0.75}
			}); 
              
                   posliste.push(m);
		   navneliste = navneliste + "<br/>-" + navn + " sist lagret " + tidstr;
                }
                else
                {
                    logText("feil  med p " + data.pos[n].lat + "/" + data.pos[n].lon)
                }
                
            }

            antallPos=posliste.length;
	    setText('personer', antallPos + " personer oppdatert " + getTimeString(now) + ""+ navneliste);

            getInProgress = 0;

            return true;
        },
        complete: function() {
            //logText('complete:');
        },
        error: function(x, textStatus, errorThrown) {
            logText('ajax err:' + x.status + ', st=' + textStatus + ", t=" + errorThrown);

            if (x.status === 0) {
                logText('You are offline!!\n Please Check Your Network.');
            } else if (x.status === 404) {
                logText('Requested URL not found.');
            } else if (x.status === 500) {
                logText('Internel Server Error.');
            } else if (textStatus === 'parsererror') {
                logText('Error.\nParsing JSON Request failed.');
            } else if (textStatus === 'timeout') {
                logText('Request Time out.');
            } else {
                logText('Unknown Error.\n' + x.responseText);
            }

            setText('id_brukttid', 'Prøv igjen');

            getInProgress = 0;
            
            return false;
        }


    });





}

// ikke hent første gang 
//var lastGetTime = new Date() ;
// hent første gang
var lastGetTime = new Date(0);

var mytimer = (function() {
    // 10 sek
    var basePeriod = 10000;


    var timeoutRef;
    return {
      start : function(speed, id) {
        logText("Start timer, id="+id);
        basePeriod = speed;
        mytimer.run();
      },

      run: function() {
        if (timeoutRef) clearInterval(timeoutRef);

        logText("Timer tick");
        
        if (nopos === true)
        {
            logText("restart pos");
            
            getOwnPosition();
        }    

        // Pos watch sender pos ...

        if (visAndre > 0)
        {
            var now = new Date();    
            if ( now - lastGetTime > getInterval)
            {
                // hent hvert minutt
                getPosisjoner(ownGruppe);   

                lastGetTime = new Date();
            }    
        }

        timeoutRef = setTimeout(mytimer.run, basePeriod);
      },

    }

}());

function sendNyPost(post) 
{
    var jsonstring = JSON.stringify(post, replacer);
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

/*
 * 
 * denne "virker" men gir størrelses endring
 * event på orientationchange:
 * 
$(document).ready(function () {
     $(window)    
          .bind('orientationchange', function(){
               if (window.orientation % 180 == 0){
                   $(document.body).css("-webkit-transform-origin", "")
                       .css("-webkit-transform", "");               
               } 
               else {                   
                   if ( window.orientation > 0) { //clockwise
                     $(document.body).css("-webkit-transform-origin", "200px 190px")
                       .css("-webkit-transform",  "rotate(-90deg)");  
                   }
                   else {
                     $(document.body).css("-webkit-transform-origin", "280px 190px")
                       .css("-webkit-transform",  "rotate(90deg)"); 
                   }
               }
           })
          .trigger('orientationchange'); 
});

ingen effekt 
@viewport all and (max-width: 480px) {
 orientation:portrait;
}


*/
