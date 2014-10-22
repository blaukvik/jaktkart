function Gruppe(navn)
{
  this.gruppe=navn;
}

function Posisjon(navn, gruppe, lat, lon)
{
   this.navn=navn;
   this.gruppe=gruppe;
   this.lat = lat;
   this.lon = lon;
  this.tid = new Date().getTime();
}





