import { Component, NgZone, OnInit } from '@angular/core';
import {BackgroundGeolocationPlugin} from "@capacitor-community/background-geolocation";
import { registerPlugin } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { BGService } from '../services/bg.service';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
 
    locations: any = [];
    watch: string;
    newlat: number = 0;
    newlng: number = 0;
    starbg = false;
    activateWatch: boolean = true;
    id: any;
    distanceFilter: number = 10;

  constructor(
    private zone: NgZone,
    private bg: BGService,
    private plt: Platform
  ) {}
    ngOnInit(): void {

        try {
        if(this.plt.is('hybrid') ){
            Geolocation.requestPermissions();
        }
        
        } catch (error) {
        
            }
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
        })
    }

    /* Otherrrrr */
    start(){
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
                distanceFilter: this.distanceFilter
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
                  if(this.starbg == false){
                    try {
                        BackgroundGeolocation.removeWatcher({
                            id: this.id
                        });
                    } catch (error) {
                        alert(error)
                    }
                    this.starbg = true;
                }
                //return console.log(location);
            }
        )).then((watcher_id)=>{
            this.zone.run(()=>{
                console.log("watcher_id es: ")
                console.log(watcher_id)
                this.id = watcher_id;
                // When a watcher is no longer needed, it should be removed by calling
                // 'removeWatcher' with an object containing its ID.
/*                 if(this.starbg == false){
                    setTimeout(() => {
                        BackgroundGeolocation.removeWatcher({
                            id: watcher_id
                        }); 
                        this.starbg = true;
                    }, 100);
                } */
            })
        } );
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