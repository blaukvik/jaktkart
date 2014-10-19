
var map;
var circle;
var ownPosition;
var browserSupportFlag =  new Boolean();
var gotPosition =  new Boolean();
var own_marker;
var updateLocation ;

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

function getOwnPosition() {  
  // Try W3C Geolocation 
  gotPosition = false;
  
  if(navigator.geolocation) 
  {  
    browserSupportFlag = true;
    
    navigator.geolocation.getCurrentPosition(
      function(position) {
        gotPosition = true;
        ownPosition = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

        document.getElementById('gpsPos').innerHTML = "lat: " + position.coords.latitude + ", lon: " +position.coords.longitude;	
        document.getElementById('gpsAccu').innerHTML = position.coords.accuracy;	
        document.getElementById('gpsSpeed').innerHTML = position.coords.speed;	

        if(own_marker)
        {
          own_marker.setMap(null);
          delete own_marker;
        }
        own_marker = new google.maps.Marker({
                          position: ownPosition,
                          map:map,
                          icon: 'blue.png'
                          }
                        ); 
                        
        var acc_radius = position.coords.accuracy;

        if(circle)
        {
          circle.setMap(null);
          delete circle;
        }
        
        circle = new google.maps.Circle({center:ownPosition,
                                         radius: acc_radius,
                                         map:map,
                                         strokeColor: 'red'});                        
               
        if(updateLocation)
        {
          navigator.geolocation.clearWatch(updateLocation);  
        }        
        // start watching      
        updateLocation = navigator.geolocation.watchPosition(
          function(position) {
            //alert("changed latitude: " + position.coords.latitude + "longitude: " + position.coords.longitude);			     

            document.getElementById('gpsPos').innerHTML = "lat: " + position.coords.latitude + ", lon: " +position.coords.longitude;	
            document.getElementById('gpsAccu').innerHTML = position.coords.accuracy;	
            document.getElementById('gpsSpeed').innerHTML = position.coords.speed;	

            ownPosition = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            own_marker.setPosition(ownPosition);

            var desRadiusMeter = position.coords.accuracy;  
            
            circle.setCenter(ownPosition);
            circle.setRadius(desRadiusMeter);
                        
            if (position.coords.accuracy > 100.0){
              circle.setOptions({strokeColor: '#FF0000'});
            }
            else if (position.coords.accuracy > 50.0){
              circle.setOptions({strokeColor: 'yellow'});
            }
            else if (position.coords.accuracy > 25.0){
              circle.setOptions({strokeColor: '#00AA00'});
            }
            else {//if (position.coords.accuracy > 0){
              circle.setOptions({strokeColor: 'green'});
            }
            
            
          }, 
          function () { 
            /* oppdatering feilet */
          },
          {enableHighAccuracy:true, maximumAge:30000, timeout:27000});               
      }, 
      function(error) {
        /* get feilet */
        alert("Fant ikke pos :" + error.message);

        if(own_marker)
        {
          own_marker.setMap(null);
          delete own_marker;
        }
        if(circle)
        {
          circle.setMap(null);
          delete circle;
        }
        // bruk drevsenter 
        ownPosition = pos_center;  
      },
      {enableHighAccuracy:true, maximumAge:30000, timeout:27000}
    );                   
  // Browser doesn't support Geolocation
  } else {
    browserSupportFlag = false;
    alert("Kan ikke få GPS pos" );

    if(own_marker)
    {
      own_marker.setMap(null);
      delete own_marker;
    }
    if(circle)
    {
      circle.setMap(null);
      delete circle;
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
                  mapTypeIds: ['kartdata2', 'sjo_hovedkart2', 'topo2', 'topo2graatone', 'toporaster2', 'europa',google.maps.MapTypeId.SATELLITE],
                  style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                  }
                });

  map.mapTypes.set('sjo_hovedkart2',new StatkartMapType("Sjo hovedkart", "sjo_hovedkart2"));
  map.mapTypes.set('kartdata2',new StatkartMapType("Kartdata 2", "kartdata2"));
  map.mapTypes.set('topo2',new StatkartMapType("Topografisk", "topo2"));
  map.mapTypes.set('topo2graatone',new StatkartMapType("Graatone", "topo2graatone"));
  map.mapTypes.set('toporaster2',new StatkartMapType("Toporaster", "toporaster2"));
  map.mapTypes.set('europa',new StatkartMapType("Europa", "europa"));

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

  /* Finn og tegn egen posisjon */
  getOwnPosition();
   
}

