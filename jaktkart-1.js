
/* 
$Revision: 12 $
$Date: 2013-10-14 18:49:40 +0200 (Mon, 14 Oct 2013) $

   -timertask som oppdaterer age ?
   -append pos to polyline
   -adjust maxage ? timeout + accu
   

*/

var map;
var circle;
var ownPosition;
var browserSupportFlag =  new Boolean();
var gotPosition =  new Boolean();
var own_marker;
var updateLocation ;
var lastposition;
var updCount = 0;

function StatkartMapType(name, layer) {
  this.layer = layer
  this.name = name
  this.alt = name

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
  controlUI.title = 'Klikk for å sentrere på egen pos';
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
  
    updCount = 0;
    document.getElementById('gpsStatus').innerHTML = 'count=0, søker ...';
  
    // check pos again just in case
    getOwnPosition();

    // now center
    map.setCenter(ownPosition);
  });

}

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
  controlUI.title = 'Klikk for å sentrere på drev';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('DREVDIV');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlText.innerHTML = '<b>Drev</b>';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to
  // Chicago
  google.maps.event.addDomListener(controlUI, 'click', function() {
    map.setCenter(pos_center);
    map.setZoom(zoom_level);
  });

}

function gotPositionOK(position) {
  // got a position
  var now = new Date();
  var posTime = new Date(position.timestamp);
  var age = now.getTime() - position.timestamp;
  
  gotPosition = true;
  lastposition = position;
  
  ownPosition = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

  // put marker 
  own_marker.setPosition(ownPosition);

  // move circle and update radius & color
  circle.setCenter(ownPosition);
  
 // in test - go to own pos as default
  map.setCenter(ownPosition);
  circle.setRadius(position.coords.accuracy);

  
  document.getElementById('gpsStatus').innerHTML = "upd="+updCount+"," + "gotPosOK";
  document.getElementById('gpsPos').innerHTML = "lat: " + position.coords.latitude + ", lon: " +position.coords.longitude;	
  document.getElementById('gpsAccu').innerHTML = position.coords.accuracy;	
  document.getElementById('gpsAge').innerHTML = posTime.getHours() +":" + posTime.getMinutes() +":" + posTime.getSeconds() + " (" + age/1000 + "s )";
  

         
  // cancel any old watcher       
  if(updateLocation != null)
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
    circle.setMap(null);
  }
  */
  // bruk drevsenter ?
  //ownPosition = pos_center;  
  /*
       bytt til '?'
  */

  updCount = updCount + 1;
  document.getElementById('gpsStatus').innerHTML = "upd="+updCount+"," + "gotPosFailed:" + error.message;	
  document.getElementById('gpsPos').innerHTML = "?";	
  document.getElementById('gpsAccu').innerHTML = "?";	
  document.getElementById('gpsAge').innerHTML = "?";
  
  own_marker.setIcon('yellow.png');
  
}


function positionUpdateFromWatch(position) {
  var now = new Date();
  var age = now.getTime() - position.timestamp;
  
  lastposition = position;
  
  ownPosition = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
  
  // move marker here
  own_marker.setPosition(ownPosition);

  // move circle and update radius & color
  circle.setCenter(ownPosition);
  circle.setRadius(position.coords.accuracy);
              
  if (position.coords.accuracy > 100.0){
    circle.setOptions({strokeColor: '#FF0000'});  //red
  }
  else if (position.coords.accuracy > 50.0){
    circle.setOptions({strokeColor: 'yellow'});
  }
  else if (position.coords.accuracy > 25.0){
    circle.setOptions({strokeColor: '#00AA00'});  // dark green
  }
  else {//if (position.coords.accuracy > 0){
    circle.setOptions({strokeColor: 'green'});
  } 
  
  
  updCount = updCount + 1;
  document.getElementById('gpsStatus').innerHTML = "upd="+updCount+"," + "updFromWatchOK";	
  document.getElementById('gpsPos').innerHTML = "lat: " + position.coords.latitude + ", lon: " +position.coords.longitude;	
  document.getElementById('gpsAccu').innerHTML = position.coords.accuracy;	
  document.getElementById('gpsAge').innerHTML = posTime.getHours() +":" + posTime.getMinutes() +":" + posTime.getSeconds() + " (" + age + "ms )";

  
}
function oppdaterPoster() 
{
//alert("oppdaterer poster");
//$(#svar.load('lesPoster.php?$page='+$page+'&$item='+$item);}
//$(#svar.load('lesPoster.php');}
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

xhr.onreadystatechange = function(){
      if(xhr.readyState == 4){
          alert("fikk " + xhr.responseText);
      	      //document.getElementById('output').innerHTML = ajax.responseText;
      }
  }
  xhr.open("GET", "lesPoster.php", true);
  xhr.send(null);

	
}


function positionUpdateFailed(error) 
{ 
  /* oppdatering feilet 
     dvs ingen ny pos i tiden ...
     bytt til '?'
     
     timertask som oppdaterer age ?
     
  */
  var now = new Date();
  var age = now.getTime() - lastposition.timestamp;

  
  updCount = updCount + 1;
  document.getElementById('gpsStatus').innerHTML = "upd="+updCount+"," + "updFromWatchFailed:" + error.message;	
  
  document.getElementById('gpsAge').innerHTML = lastposition.timestamp.getHours() +":" + lastposition.timestamp.getMinutes() +":" + lastposition.timestamp.getSeconds() + " (" + age/1000 + "s )";
  
  own_marker.setIcon('yellow.png');
  circle.setOptions({strokeColor: '#FF0000'});
  
}


function getOwnPosition() {  
  // Try W3C Geolocation 
  gotPosition = false;
  
  if(navigator.geolocation) 
  {  
    browserSupportFlag = true;    
    
    navigator.geolocation.getCurrentPosition(
      gotPositionOK, 
      gotPositionFailed,
      {enableHighAccuracy:true, maximumAge:30000, timeout:30000}
    );                     
  } else {
    // Browser doesn't support Geolocation
    browserSupportFlag = false;
    alert("Kan ikke få GPS pos, er det skrudd av ?" );

    if(own_marker)
    {
      own_marker.setMap(null);
    }
    if(circle)
    {
      circle.setMap(null);
    }
    // bruk drevsenter    
    ownPosition = pos_center;  
  }    
    
}

function initialize() {
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
                  mapTypeIds: ['topo2',google.maps.MapTypeId.SATELLITE],
                  style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                  }
                });

  map.mapTypes.set('topo2',new StatkartMapType("Kart", "topo2"));

  // default maptype
  map.setMapTypeId('topo2');

  var homeControlDiv = document.createElement('HOMEDIV');
  var homeControl = new HomeControl(homeControlDiv, map);
  homeControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);  
    
  var drevControlDiv = document.createElement('DREVDIV');
  var drevControl = new DrevControl(drevControlDiv, map);
  drevControlDiv.index = 2;
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(drevControlDiv);  


  /* Legg ut postene */
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
/*
pkt 1: fra 
*/
var pkt_grense = [
new google.maps.LatLng(59.021716, 11.443119),
new google.maps.LatLng(59.021449,	11.445819),
new google.maps.LatLng(59.020939,	11.449259),
new google.maps.LatLng(59.019336,	11.454241),
new google.maps.LatLng(59.021497,	11.458969),
/*
new google.maps.LatLng(59.023663,	11.461267),
new google.maps.LatLng(59.026629,	11.464746),
new google.maps.LatLng(59.029577,	11.469192),
new google.maps.LatLng(59.032918,	11.466425),
new google.maps.LatLng(59.033162,	11.467070),
new google.maps.LatLng(59.028137,	11.477559),
*/
/* mellomtjern */

new google.maps.LatLng(59.024103	, 11.481291),
new google.maps.LatLng(59.024253	, 11.480518),
new google.maps.LatLng(59.027274	, 11.478278),
new google.maps.LatLng(59.027481	, 11.478711),
new google.maps.LatLng(59.027768	, 11.478549),
new google.maps.LatLng(59.028003	, 11.478226),
new google.maps.LatLng(59.027859	, 11.477981),
new google.maps.LatLng(59.028252	, 11.477172),
new google.maps.LatLng(59.030622	, 11.472323),
new google.maps.LatLng(59.033162	, 11.467041),
new google.maps.LatLng(59.033022	, 11.466613),
new google.maps.LatLng(59.033012	, 11.466455),
new google.maps.LatLng(59.034490	, 11.464574),
new google.maps.LatLng(59.035352	, 11.469552),
new google.maps.LatLng(59.035503	, 11.469406),
new google.maps.LatLng(59.036551	, 11.473821),
new google.maps.LatLng(59.037145	, 11.475145),
new google.maps.LatLng(59.037650	, 11.476934),
new google.maps.LatLng(59.037988	, 11.480409),
new google.maps.LatLng(59.041062	, 11.489496),
new google.maps.LatLng(59.041748	, 11.490226),
new google.maps.LatLng(59.042026	, 11.490481),
new google.maps.LatLng(59.041559	, 11.492383),
new google.maps.LatLng(59.041513	, 11.492641),
new google.maps.LatLng(59.042177	, 11.493160),
new google.maps.LatLng(59.042353	, 11.493120),
new google.maps.LatLng(59.042539	, 11.493238),
new google.maps.LatLng(59.042764	, 11.493490),
new google.maps.LatLng(59.043371	, 11.493430),
new google.maps.LatLng(59.043597	, 11.493603),
new google.maps.LatLng(59.043777	, 11.493354),
new google.maps.LatLng(59.044007	, 11.493319),
new google.maps.LatLng(59.044179	, 11.493462),
new google.maps.LatLng(59.044267	, 11.493128),
new google.maps.LatLng(59.044476	, 11.493457),
new google.maps.LatLng(59.044690	, 11.493551),
new google.maps.LatLng(59.045163	, 11.493455),
new google.maps.LatLng(59.045324	, 11.493493),
new google.maps.LatLng(59.046016	, 11.492549),
new google.maps.LatLng(59.046289	, 11.492359),
new google.maps.LatLng(59.046529	, 11.492534),
new google.maps.LatLng(59.047494	, 11.494173),
new google.maps.LatLng(59.047544	, 11.494412),
new google.maps.LatLng(59.048415	, 11.495338),
new google.maps.LatLng(59.049084	, 11.496983),
new google.maps.LatLng(59.049507	, 11.497458),
new google.maps.LatLng(59.049575	, 11.498117),
new google.maps.LatLng(59.050227	, 11.498530),
/* veien */
new google.maps.LatLng(59.050223	, 11.498739),
new google.maps.LatLng(59.047647	, 11.501639),
new google.maps.LatLng(59.046740	, 11.502540),
new google.maps.LatLng(59.046780	, 11.503956),
new google.maps.LatLng(59.045649	, 11.505992),
new google.maps.LatLng(59.046872	, 11.507546),
new google.maps.LatLng(59.047648	, 11.508544),
new google.maps.LatLng(59.049399	, 11.510712),
new google.maps.LatLng(59.050366	, 11.511541),
new google.maps.LatLng(59.050519	, 11.512703),
new google.maps.LatLng(59.050242	, 11.513076),
new google.maps.LatLng(59.050237	, 11.513337),
new google.maps.LatLng(59.050096	, 11.513693),
new google.maps.LatLng(59.050212	, 11.513937),
new google.maps.LatLng(59.049952	, 11.515513),
new google.maps.LatLng(59.050045	, 11.516279),
new google.maps.LatLng(59.049799	, 11.516496),
new google.maps.LatLng(59.049774	, 11.517070),
new google.maps.LatLng(59.049998	, 11.517348),
new google.maps.LatLng(59.049802	, 11.517700),
new google.maps.LatLng(59.049579	, 11.518076),
new google.maps.LatLng(59.048436	, 11.524871),
new google.maps.LatLng(59.042609	, 11.519579),
new google.maps.LatLng(59.040148	, 11.517255),
new google.maps.LatLng(59.035328	, 11.510731),
new google.maps.LatLng(59.035071	, 11.510817),
new google.maps.LatLng(59.034902	, 11.511197),
new google.maps.LatLng(59.033751	, 11.511453),
new google.maps.LatLng(59.033447	, 11.511823),
new google.maps.LatLng(59.033289	, 11.511655),
new google.maps.LatLng(59.033107	, 11.512007),
new google.maps.LatLng(59.032987	, 11.511946),
new google.maps.LatLng(59.032634	, 11.512051),
new google.maps.LatLng(59.032641	, 11.512418),
new google.maps.LatLng(59.031847	, 11.512334),

/* ekeli */
new google.maps.LatLng(59.027968	, 11.519164),
new google.maps.LatLng(59.026696	, 11.521502),
new google.maps.LatLng(59.021793	, 11.533819),
new google.maps.LatLng(59.020498	, 11.538010),
new google.maps.LatLng(59.019513	, 11.542172),
new google.maps.LatLng(59.019166	, 11.545413)



];

/* s¿ndre grense */
var pkt_grense2 = [

new google.maps.LatLng(59.002562	, 11.531700),
new google.maps.LatLng(59.002914	, 11.531621),
new google.maps.LatLng(59.003131	, 11.530854),
new google.maps.LatLng(59.003129	, 11.528894),
new google.maps.LatLng(59.003028	, 11.526457),
new google.maps.LatLng(59.003254	, 11.525899),
new google.maps.LatLng(59.003382	, 11.525569),
new google.maps.LatLng(59.003182	, 11.524771),
new google.maps.LatLng(59.003039	, 11.524499),
new google.maps.LatLng(59.003193	, 11.524197),
new google.maps.LatLng(59.003582	, 11.523598),
new google.maps.LatLng(59.003776	, 11.523351),
new google.maps.LatLng(59.003679	, 11.522796),
new google.maps.LatLng(59.003326	, 11.522247),
new google.maps.LatLng(59.003069	, 11.522255),
new google.maps.LatLng(59.002820	, 11.522628),
new google.maps.LatLng(59.002462	, 11.523020),
new google.maps.LatLng(59.002164	, 11.523076),
new google.maps.LatLng(59.001227	, 11.522041),
new google.maps.LatLng(59.000810	, 11.522037),
new google.maps.LatLng(59.000546	, 11.521704),
new google.maps.LatLng(58.999005	, 11.519188),
new google.maps.LatLng(58.998854	, 11.519334),
new google.maps.LatLng(58.998034	, 11.518543),
new google.maps.LatLng(58.996654	, 11.521576),
new google.maps.LatLng(58.995665	, 11.521869),
new google.maps.LatLng(58.994920	, 11.521371),
new google.maps.LatLng(58.994281	, 11.520933),
new google.maps.LatLng(58.993745	, 11.520789),
new google.maps.LatLng(58.992799	, 11.520903),
new google.maps.LatLng(58.992714	, 11.520426),
new google.maps.LatLng(58.992285	, 11.520317),
new google.maps.LatLng(58.992045	, 11.520168),
new google.maps.LatLng(58.991526	, 11.520522),
new google.maps.LatLng(58.991172	, 11.520705),
new google.maps.LatLng(58.990987	, 11.520535),
new google.maps.LatLng(58.989631	, 11.520984),
new google.maps.LatLng(58.988332	, 11.520524),
new google.maps.LatLng(58.988961	, 11.520048),
new google.maps.LatLng(58.988999	, 11.519502),
new google.maps.LatLng(58.989527	, 11.516590),
new google.maps.LatLng(58.989366	, 11.515873),
new google.maps.LatLng(58.989706	, 11.515741),
new google.maps.LatLng(58.990499	, 11.512352),
new google.maps.LatLng(58.991897	, 11.509059),
new google.maps.LatLng(58.991920	, 11.508591),
new google.maps.LatLng(58.992236	, 11.506890),
new google.maps.LatLng(58.992472	, 11.506516),
new google.maps.LatLng(58.993425	, 11.505331),
new google.maps.LatLng(58.994078	, 11.505013),
new google.maps.LatLng(58.994247	, 11.504634),
new google.maps.LatLng(58.994584	, 11.502543),
new google.maps.LatLng(58.995054	, 11.500566),
new google.maps.LatLng(58.995209	, 11.499506),
new google.maps.LatLng(58.995931	, 11.497704),
new google.maps.LatLng(58.996292	, 11.497130),
new google.maps.LatLng(58.996881	, 11.496676),
new google.maps.LatLng(58.997237	, 11.496389),
new google.maps.LatLng(58.997203	, 11.496021),
new google.maps.LatLng(58.997089	, 11.495673),
new google.maps.LatLng(58.997376	, 11.494048),
new google.maps.LatLng(58.997543	, 11.493068),
new google.maps.LatLng(58.997823	, 11.491808),
new google.maps.LatLng(58.998751	, 11.490543),
new google.maps.LatLng(58.998907	, 11.489405),
new google.maps.LatLng(58.998672	, 11.489049),
new google.maps.LatLng(58.997939	, 11.488604),
new google.maps.LatLng(58.996977	, 11.488169),
new google.maps.LatLng(58.996252	, 11.488038),
new google.maps.LatLng(58.995946	, 11.487833),
new google.maps.LatLng(58.995628	, 11.488254),
new google.maps.LatLng(58.995203	, 11.487910),
new google.maps.LatLng(58.994741	, 11.488112),
new google.maps.LatLng(58.994501	, 11.487990),
new google.maps.LatLng(58.994487	, 11.487310),
new google.maps.LatLng(58.994238	, 11.486953),
new google.maps.LatLng(58.993890	, 11.486823),
new google.maps.LatLng(58.993732	, 11.486629),
new google.maps.LatLng(58.993846	, 11.486298),
new google.maps.LatLng(58.994119	, 11.486134),
new google.maps.LatLng(58.994072	, 11.485765),
new google.maps.LatLng(58.993592	, 11.485496),
new google.maps.LatLng(58.993161	, 11.484786),
new google.maps.LatLng(58.992246	, 11.483989),
new google.maps.LatLng(58.991101	, 11.482574),
new google.maps.LatLng(58.990340	, 11.482180),
new google.maps.LatLng(58.989788	, 11.481435),
new google.maps.LatLng(58.989398	, 11.480728),
new google.maps.LatLng(58.988587	, 11.480148),
new google.maps.LatLng(58.988004	, 11.479610),
new google.maps.LatLng(58.986909	, 11.478356),
new google.maps.LatLng(58.985740	, 11.476784),
new google.maps.LatLng(58.985580	, 11.476694)
];

/* 3: rundt Mo */
var pkt_grense3 = [
new google.maps.LatLng(59.024461,	11.515169),
new google.maps.LatLng(59.023327,	11.513858),
new google.maps.LatLng(59.021788,	11.512596),
new google.maps.LatLng(59.020687,	11.511679),
new google.maps.LatLng(59.020089,	11.510564),
new google.maps.LatLng(59.019277,	11.510766),
new google.maps.LatLng(59.019441,	11.512006),
new google.maps.LatLng(59.019270,	11.512490),
new google.maps.LatLng(59.020123,	11.515062),
new google.maps.LatLng(59.020954,	11.514600),
new google.maps.LatLng(59.021848,	11.514351),
new google.maps.LatLng(59.022678,	11.514673),
new google.maps.LatLng(59.023695,	11.515035),
new google.maps.LatLng(59.024339,	11.515161)
];


var num_grenser=3;

var grenser= [
pkt_grense,
pkt_grense2,
pkt_grense3
];


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



if (1)
{
  // lag egen markør  
  own_marker = new google.maps.Marker({
                    position: pos_center,
                    map:map,
                    icon: 'blue.png'
                    }
                  ); 
                    
  circle = new google.maps.Circle({center:pos_center,
                                   radius: 1000,
                                   map:map,
                                   strokeColor: 'red'});                        
  
  
  /* Finn og tegn egen posisjon */
  getOwnPosition();
}  
}

