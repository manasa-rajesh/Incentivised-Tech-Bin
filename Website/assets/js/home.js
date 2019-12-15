var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
}

document.getElementsByClassName('logout')[0].addEventListener('click', () => {
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET','/logout');
    xhttp.onreadystatechange=()=>{
        if(xhttp.readyState==4) {
            window.location.href='/'
        }
    }
    xhttp.send();
})


document.getElementsByClassName('content')[0].addEventListener('click', ()=>{
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', '/api/user/locations');
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState==4) {
            if (xhttp.status == 200) {
                try {
                    let x = JSON.parse(xhttp.responseText);
                    console.log(x)
                    if (x.code !== 200) {
                        document.getElementById('error').innerHTML = "Error getting nearest dustbins";
                        document.getElementById('message').classList.add('show');
                        setTimeout(() => {
                            document.getElementById('message').classList.remove('show');
                        }, 2000);
                    }
                    document.getElementsByClassName('content')[0].style.display = 'none';
                    navigator.geolocation.getCurrentPosition((pos) => {
                        var crd = pos.coords;
                        console.log(crd);
                        map = new google.maps.Map(document.getElementById('map'), {
                            zoom: 16,
                            center: {lat: crd.latitude, lng: crd.longitude},
                            zoomControl: true,
                            scaleControl: true
                        });
                        let user = new google.maps.Marker({
                            position: map.getCenter(),
                            icon: {
                              path: google.maps.SymbolPath.CIRCLE,
                              scale: 8
                            },
                            map: map
                          });
                        map.data.setStyle(function(feature) {
                            var magnitude = feature.total;
                            return {
                              icon: getCircle(magnitude)
                            };
                        });                        
                    });
                } catch(err) {
                    document.getElementById('error').innerHTML = "Error getting nearest dustbins";
                    document.getElementById('message').classList.add('show');
                    setTimeout(() => {
                        document.getElementById('message').classList.remove('show');
                    }, 2000);                    
                }
            } else {
                document.getElementById('error').innerHTML = "Error getting nearest dustbins";
                document.getElementById('message').classList.add('show');
                setTimeout(() => {
                    document.getElementById('message').classList.remove('show');
                }, 2000);
            }
        }
    }
    xhttp.send();
});

/* Loading leaderboard */
let xhttpL = new XMLHttpRequest();
xhttpL.open('GET','/api/get/leaderboard');
xhttpL.onreadystatechange = () => {
    if (xhttpL.readyState == 4) {
        if (xhttpL.status == 200) {
            try {
                let x=JSON.parse(xhttpL.responseText);
                console.log(x);
                document.getElementsByClassName('collection')[0].innerHTML = '';

                for(let i=0;i<x.leaderboard.length;i++) {
                    document.getElementsByClassName('collection')[0].innerHTML += 
                    `
                        <div class="position">
                            <div class="rank">${i+1}</div>
                            <div class="name">${x.leaderboard[i].name}</div>
                            <div class="level"> | ${x.leaderboard[i].level}</div>
                            <div class="rewards">${x.leaderboard[i].current} points</div>
                        </div>
                    `
                }
            } catch(err) {
                console.log(err);
                document.getElementsByClassName('collection')[0].innerHTML =
                `
                <div class="leaderboard-error">
                    <div class="info">Error loading leaderboard</div>
                    <div class="action" onclick="reload();return;">Tap to retry <i class="material-icons">reload</i></div>   
                </div>
                `;
            }
        }     
    }
}
xhttpL.send();

function reload() {
    /* Loading leaderboard */
    let xhttpL = new XMLHttpRequest();
    xhttpL.open('GET','/api/get/leaderboard');
    xhttpL.onreadystatechange = () => {
        if (xhttpL.readyState == 4) {
            if (xhttpL.status == 200) {
                try {
                    let x=JSON.parse(xhttpL.responseText);
                    console.log(x);
                    document.getElementsByClassName('collection')[0].innerHTML = '';
    
                    for(let i=0;i<x.leaderboard.length;i++) {
                        document.getElementsByClassName('collection')[0].innerHTML += 
                        `
                            <div class="position">
                                <div class="rank">${i+1}</div>
                                <div class="name">${x.leaderboard[i].name}</div>
                                <div class="level"> | ${x.leaderboard[i].level}</div>
                                <div class="rewards">${x.leaderboard[i].current} points</div>
                            </div>
                        `
                    }
                } catch(err) {
                    console.log(err);
                    document.getElementsByClassName('collection')[0].innerHTML =
                    `
                    <div class="leaderboard-error">
                        <div class="info">Error loading leaderboard</div>
                        <div class="action" onclick="reload();return;">Tap to retry <i class="material-icons">reload</i></div>   
                    </div>
                    `;
                }
            }     
        }
    }
    xhttpL.send();
}

              
function getCircle(magnitude) {
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: 'green',
      fillOpacity: .2,
      scale: Math.pow(2, magnitude) / 2,
      strokeColor: 'white',
      strokeWeight: .5
    };
  }

  function eqfeed_callback(results) {
    map.data.addGeoJson(results);
  }
$(document).ready(() => {
    $('.slider').slick();
})