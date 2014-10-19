
/* 
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



/* vis egen pos */  
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

