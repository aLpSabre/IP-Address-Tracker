const header = document.querySelector(".header");
const submit = document.getElementById("submit");
const input = document.getElementById("input");
const ipElement = document.getElementById("ip");
const locationElement = document.getElementById("location");
const timezoneElement = document.getElementById("timezone");
const ispElement = document.getElementById("isp");


let ips = JSON.parse(localStorage.getItem("IPS")) || [];
let searchedIps = JSON.parse(localStorage.getItem("searchedIps")) || [];
const isNew = localStorage.getItem("visit") == null;

const init = function () {
  ipElement.innerText = "-";
  locationElement.innerText = "-";
  timezoneElement.innerText = "-";
  ispElement.innerText = "-";
}
const accessToken = config.MY_API_TOKEN;
const map = L.map('map').setView([38.9637, 35.2433], 6);
L.tileLayer(
  `https://tile.jawg.io/jawg-terrain/{z}/{x}/{y}.png?access-token=${accessToken}`, {
  attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">© <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">© OSM contributors</a>',
  minZoom: 2,
  maxZoom: 20
}
).addTo(map);

const buttonRemove =
  '<button type="button" class="remove btn btn-danger mx-auto ">Delete the Marker!</button>';

// remove marker
function removeMarker() {
  const marker = this;

  let lat = marker.getLatLng().lat;
  let lng = marker.getLatLng().lng;
  ips.forEach(element => {
    if (element.lat == lat && element.lng) {
      ipElement.innerText = element.id;
      locationElement.innerText = element.myLocation;
      timezoneElement.innerText = element.myTimeZone;
      ispElement.innerText = element.myIsp;
    }
  })


  const btn = document.querySelector(".remove");
  btn.addEventListener("click", function () {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const markerPlace = document.querySelector(".marker-position");
        let ip;
        ips.forEach(element => {
          if (element.lat == lat && element.lng == lng) {
            ip = element.id;
          }
        })
     
        searchedIps.splice(searchedIps.indexOf(ip), 1);
        localStorage.setItem("searchedIps", JSON.stringify(searchedIps));
        ips = ips.filter(element => element.lat != lat || element.lng != lng);
      

        localStorage.setItem("IPS", JSON.stringify(ips));

        map.removeLayer(marker);
        init();
        swalWithBootstrapButtons.fire(
          `The marker of "${ip}" is deleted!`
        )

      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your marker is safe :)',
          'error'
        )
      }
    })

  });
}


function renderIps(ips) {
  ips.forEach(element => {


    const marker = new L.marker([element.lat, element.lng], {
      draggable: false
    })
      .addTo(map)
      .bindPopup(`<p class="ip text-center">The Ip adress is "${element.id}".</p>` + buttonRemove);

    // event remove marker
    marker.on("popupopen", removeMarker);



  });
}

renderIps(ips);

submit.addEventListener("click", () => {
  if (input.value.length > 0) {
    getIP(input.value);
    input.value = "";

  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please enter an Ip adress!',

    })
  }

})


const getIP = async function (ip) {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
  
    if (res.error) {
      renderError();
      throw new Error(`${res.status}`);
    }
    const data = await res.json();
    renderData(data);
  }
  catch (error) {

  }
}

function renderError() {

  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Please enter an valid Ip adress!',

  })
}
function renderData(data) {

  const { ip, latitude, longitude, utc_offset, country, region, city, org } = data;
  if (data.error) {
    renderError();
    return;
  } else if (latitude === null || longitude === null) {
    ipElement.innerText = ip;
    locationElement.innerText = country + " ," + region + ", " + city;
    timezoneElement.innerText = "UTC" + " " + utc_offset.slice(0, 3) + ":" + utc_offset.slice(3, utc_offset.length);
    ispElement.innerText = org || "-";
    let timerInterval
    Swal.fire({
      title: 'The location can not be found!',
      timer: 1500,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    })
    return;
  }




 
  ipElement.innerText = ip;
if(region===city ){
  locationElement.innerText = country + ", " + city;
}else{
  locationElement.innerText = country +" ,"+region+ ", " + city;
}
  
  timezoneElement.innerText = "UTC" + " " + utc_offset.slice(0, 3) + ":" + utc_offset.slice(3, utc_offset.length);
  ispElement.innerText = org || "-";



  let marker;
  if (searchedIps.indexOf(ip) == -1) {
    searchedIps.push(ip);
    localStorage.setItem("searchedIps", JSON.stringify(searchedIps))
 
    let newIP = {}
    newIP.id = ip
    newIP.lat = latitude
    newIP.lng = longitude
    if(region===city ){
      newIP.myLocation = country +", " + city;
    }else{
      newIP.myLocation = country + " ," + region + ", " + city;
    }
  
    newIP.myTimeZone = "UTC" + " " + utc_offset.slice(0, 3) + ":" + utc_offset.slice(3, utc_offset.length)
    newIP.myIsp = org || "-"

  
    ips.push(newIP)
    localStorage.setItem("IPS", JSON.stringify(ips))
   
    marker = new L.marker([latitude, longitude], {
      draggable: false
    })
      .addTo(map)
      .bindPopup(`<p class="ip text-center">The Ip adress is "${ip}".</p>` + buttonRemove);
  }

  // set the mapview
  map.setView([latitude, longitude], 12)

  // event remove marker
  marker.on("popupopen", removeMarker);
}

window.addEventListener("load", () => {
  input.focus();
  if (isNew) {
    localStorage.setItem("visit", ".");
    Swal.fire({
      title: '<strong>Welcome to the <span class="ip-info-title">Ip Tracker</span></strong>',
      icon: 'info',
      html:
        '<ul><li>With the help of Ip tracker, you can track the location,timezone and isp of  any valid ips in the world.</li><li>Any time you searched for an Ip adress,it will be marked on the map,so you can check it later.</li><li>If you want to delete a marker on the map,basically click on the marker and than click the "Delete the marker button" on the pop-up and confirm it,so you are not going to have that marker on your map anymore.</li><li>If you want the see the information of the Ip adress you searched before, click on the marker and it is going to be shown on your webpage.</li></ul>',
      showCloseButton: true,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i> Great!',
      confirmButtonAriaLabel: 'Great!,Thumbs up',
   
    })
  } else {
    return;
  }
})

input.addEventListener("keydown", (e) => {

  if (e.code == "Enter" || e.code == "NumpadEnter") {
    e.preventDefault();
    submit.click();
  }
})