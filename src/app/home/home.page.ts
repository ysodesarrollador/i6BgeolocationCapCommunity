import { Component, NgZone, OnInit } from '@angular/core';
import {BackgroundGeolocationPlugin} from "@capacitor-community/background-geolocation";
import { registerPlugin } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { BGService } from '../services/bg.service';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';


const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");
const started = Date.now();
const watcher_colours = {};
const colours = [
    "red",
    "green",
    "blue",
    "yellow",
    "pink",
    "orange",
    "purple",
    "cyan"
];
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
 
    locations: any = [];
    watch: string;
    newlat: number;
    newlng: number;
    starbg = false;
    activateWatch: boolean = true;
    id: any;

  constructor(
    private zone: NgZone,
    private bg: BGService,
    private plt: Platform
  ) {}
  ngOnInit(): void {

    this.bg.$starbg.subscribe(resp =>{
        this.starbg = resp;
    })
/*     this.bg.$storeLocation.subscribe(resp =>{
        this.locations = resp;
        console.log(this.locations.length)
    }) */

try {
   if(this.plt.is('hybrid') ){
    Geolocation.requestPermissions();
   }
   
} catch (error) {
   
}
/*     this.motionServ.$acceleration.subscribe(acel =>{
    if (!acel)
        return;
    this.x = acel.x;
    this.y = acel.y;
    this.z = acel.z;      
    if(this.x > 1 || this.y > 1)  {
        alert(this.x + " " + this.x)
    }         
}) */
}

   log_for_watcher(text , time, colour = "gray") {
       return
    const li = document.createElement("li");
    li.style.color = colour;
    li.innerText = String(Math.floor(( started) / 1000)) + ":" + text;
    const container = document.getElementById("log");
    return container.insertBefore(li, container.firstChild);
}

 log_error(error, colour = "gray") {
    console.error(error);
    return this.log_for_watcher(
        error.name + ": " + error.message,
        Date.now(),
        colour
    );
}

 log_location(location, watcher_ID) {
    return this.log_for_watcher(
        location.latitude + ":" + location.longitude,
        location.time,
        watcher_colours[watcher_ID]
    );
}

 add_watcher(background) {
     this.starbg = true;
    let id;
    BackgroundGeolocation.addWatcher(
        Object.assign({
            stale: true
        }, (
            background
            ? {
                backgroundTitle: "Tracking your location, senõr.",
                backgroundMessage: "Cancel to prevent battery drain."
            }
            : {
                distanceFilter: 50
            }
        )),
        (location, error)=>{
         {
            if (error) {
                if (
                    error.code === "NOT_AUTHORIZED" &&
                    window.confirm(
                        "This app needs your location, " +
                        "but does not have permission.\n\n" +
                        "Open settings now?"
                    )
                ) {
                    BackgroundGeolocation.openSettings();
                }
                return this.log_error(error, watcher_colours[id]);
            }
            this.zone.run(()=>{
                this.locations.push(location);
            })
           
            LocalNotifications.schedule({
                notifications: [
                  {
                    id:111,
                    title:"Está conectado a Internet",
                    body:"Background Geolocation Deshabilitdado",            
                    extra: {
                      data:'localNotificationActionPerformed'
                    }
                  }
                  ]
              });
              this.id = id;
              //BackgroundGeolocation.removeWatcher(this.id)
            return  true;//this.log_location(location, id);
        }
        }
    )
}

// Produces the most accurate location possible within the specified time limit.
 make_guess(timeout) {
    return new Promise(function (resolve) {
        let last_location = null;
        let id;
        BackgroundGeolocation.addWatcher(
            {
                requestPermissions: false,
                stale: true
            },
            function callback(location) {
                last_location = location;
            }
        ).then(function retain_callback_id(the_id) {
            id = the_id;
        });

        setTimeout(function () {
            resolve(last_location);
            BackgroundGeolocation.removeWatcher({id});
        }, timeout);
    });
}

 guess(timeout) {
    return this.make_guess(timeout).then(function (location:any) {
        return (
            location === null
            ? this.log_for_watcher("null", Date.now())
            : this.log_for_watcher(
                [
                    location.latitude,
                    location.longitude
                ].map(String).join(":"),
                location.time
            )
        );
    });
  }

      /** Activar o desactivar mi localización */
      async toogleMyLocation(){    
        if(this.activateWatch){
            this.activateWatch = !this.activateWatch ;
            var options: PositionOptions ={
                enableHighAccuracy:true
            }      
        
            this.watch = await Geolocation.watchPosition(options,(position, err)=>{
                this.zone.run(() => {
                if(position){               
                    this.newlat = position.coords.latitude ;
                    this.newlng = position.coords.longitude ;                
                }
            });
            console.log("this.watch") 
            console.log(JSON.stringify(this.watch))      
            
        })
        }
        else{
            Geolocation.clearWatch({id:this.watch})
            this.activateWatch = !this.activateWatch ;
        }
    }

    stop(){
        this.zone.run(()=>{
            this.starbg = false;
            console.log("this.id: ")
            console.log(this.id)
             BackgroundGeolocation.removeWatcher(this.id)
        })
    }

    /* Otherrrrr */
    add_watcher1(){
        this.starbg = true;
        BackgroundGeolocation.addWatcher(
            {
                // If the "backgroundMessage" option is defined, the watcher will
                // provide location updates whether the app is in the background or the
                // foreground. If it is not defined, location updates are only
                // guaranteed in the foreground. This is true on both platforms.
        
                // On Android, a notification must be shown to continue receiving
                // location updates in the background. This option specifies the text of
                // that notification.
                backgroundMessage: "Cancel to prevent battery drain.",
        
                // The title of the notification mentioned above. Defaults to "Using
                // your location".
                backgroundTitle: "Tracking You.",
        
                // Whether permissions should be requested from the user automatically,
                // if they are not already granted. Defaults to "true".
                requestPermissions: true,
        
                // If "true", stale locations may be delivered while the device
                // obtains a GPS fix. You are responsible for checking the "time"
                // property. If "false", locations are guaranteed to be up to date.
                // Defaults to "false".
                stale: false,
        
                // The minimum number of metres between subsequent locations. Defaults
                // to 0.
                distanceFilter: 50
            },
            ((location, error)=> {
                if (error) {
                    if (error.code === "NOT_AUTHORIZED") {
                        if (window.confirm(
                            "This app needs your location, " +
                            "but does not have permission.\n\n" +
                            "Open settings now?"
                        )) {
                            // It can be useful to direct the user to their device's
                            // settings when location permissions have been denied. The
                            // plugin provides the 'openSettings' method to do exactly
                            // this.
                            BackgroundGeolocation.openSettings();
                        }
                    }
                    return console.error(error);
                }
                this.zone.run(()=>{
                    this.locations.push(location);
                })
                LocalNotifications.schedule({
                    notifications: [
                      {
                        id:111,
                        title:"Posición",
                        body:location.latitude + " : " + location.longitude,            
                        extra: {
                          data:'localNotificationActionPerformed'
                        }
                      }
                      ]
                  });
                //return console.log(location);
            }
        )).then((watcher_id)=>{
             {
                console.log("watcher_id es: ")
                 console.log(watcher_id)
                this.id = watcher_id;
                // When a watcher is no longer needed, it should be removed by calling
                // 'removeWatcher' with an object containing its ID.
/*                 setTimeout(() => {
                    BackgroundGeolocation.removeWatcher({
                        id: watcher_id
                    }); 
                }, 5000); */
            }
        } );
        
        // If you just want the current location, try something like this. The longer
        // the timeout, the more accurate the guess will be. I wouldn't go below about
        // 100ms.

    }
}

/* 
        function guess_location(callback, timeout) {
            let last_location;
            BackgroundGeolocation.addWatcher(
                {
                    requestPermissions: false,
                    stale: true
                },
                function (location) {
                    last_location = location || undefined;
                }
            ).then(function (id) {
                setTimeout(function () {
                    callback(last_location);
                    console.log('Removinnnnnnnnnng')
                    BackgroundGeolocation.removeWatcher({id});
                }, timeout);
            });
        }
*/