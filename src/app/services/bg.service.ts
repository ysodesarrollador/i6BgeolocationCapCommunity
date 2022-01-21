/* import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BGService {

  constructor() { }
} */
import { Injectable, NgZone } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { BehaviorSubject, Observable } from 'rxjs';

const keyGeo = '_storeLocation';
@Injectable({
  providedIn: 'root'
})
export class BGService {
/*   storeLocationNoObs : BackgroundGeolocationResponse[] = []
  private _storeLocation = new BehaviorSubject<BackgroundGeolocationResponse[]>([]);
  
  public set storeLocation(v : BackgroundGeolocationResponse[] ) {
    this._storeLocation.next(v); 
  }

  public get $storeLocation() : Observable<BackgroundGeolocationResponse[]> {
    return this._storeLocation.asObservable();
  } */
  
  private _starbg = new BehaviorSubject<boolean>(false);
  
  public set starbg(v : boolean) {
    this._starbg.next(v);
  }
  
  public get $starbg() : Observable<boolean>{
    return this._starbg.asObservable();
  }
  
  
  constructor(
    //private backgroundGeolocation: BackgroundGeolocation,
    private zone: NgZone
  ) {
/*     let stored = JSON.parse(localStorage.getItem(keyGeo));
    if(!stored)
      return
    this._storeLocation.next(stored); */
   }

  init(notif:boolean = false){
  }

  stop(){
   
    this.zone.run(()=>{
      this.starbg = false;
      try {
        //this.backgroundGeolocation.stop();
      } catch (error) {
        
      }
    })

  }

  notification(){
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
  }
}
