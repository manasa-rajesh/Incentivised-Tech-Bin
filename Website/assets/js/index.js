document.getElementById('login-btn').addEventListener('click', (e) => {
    e.preventDefault();
    
    document.getElementById('image').click();
});

document.getElementById('image').addEventListener('change', () => {
    let form = new FormData();
    form.append("image", document.getElementById('image').files[0]);
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", '/api/auth/login');
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
                try {
                    let x = JSON.parse(xhttp.responseText);
                    if (x.code !== 200) {
                        document.getElementById('error').innerHTML = x.message;
                        document.getElementById('message').classList.add('show');
                        setTimeout(() => {
                            document.getElementById('message').classList.remove('show');
                        }, 2000);
                    }
                    if (!x.success) {
                        window.location.href='/';
                    } else {
                        window.location.href=x.url;
                    }
                } catch(err) {
                    console.log(xhttp.responseText)
                    console.log(err);
                    document.getElementById('error').innerHTML = 'Error logging in'
                    document.getElementById('message').classList.add('show');
                    setTimeout(() => {
                        document.getElementById('message').classList.remove('show');
                    }, 2000);
                }
            } else {
                console.log(xhttp.responseText)
                document.getElementById('error').innerHTML = 'Error logging in'
                document.getElementById('message').classList.add('show');
                setTimeout(() => {
                    document.getElementById('message').classList.remove('show');
                }, 2000);
            }
        }
    }
    xhttp.send(form);
});

document.getElementById('close').addEventListener('click',() => {
    document.getElementById('message').classList.remove('show');
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
    xhttpL = new XMLHttpRequest();
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

// window.onscroll = () => {
//     if(window.pageYOffset >100) {
//         document.getElementsByClassName('main-nav').classList.add('main-nav-down')
//     } else {
//         document.getElementsByClassName('main-nav').classList.remove('main-nav-down')
//     }
// }

document.getElementsByClassName('content')[0].addEventListener('click', ()=>{
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', '/api/get/empty');
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
                        let markers = [];
                        
                        for (let i=0;i< x.dustbins.length;i++) {
                            markers[0] = new google.maps.Marker({
                                position:  new google.maps.LatLng(x.dustbins[i].location.lat,x.dustbins[i].location.long),
                                map: map,
                                title: `Weight: ${x.dustbins[i].total}`
                            });
                        }
                    })
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