


export class Ubicacion {

  public _id : String;
  public direccion: String;
  public referencia: String;
  public latitude: number;
  public longitude: number;
  public lat: number;
  public lng: number;
  public draggable: boolean;

  constructor(
    _id : string = '',
    direccion : string = '',
    referencia : string = '',
    latitude: number = 0,
    longitude: number = 0,
    lat: number = 0,
    lng: number = 0,
    draggable: boolean = false
  ) {

    this._id          = _id;
    this.direccion    = direccion;
    this.referencia   = referencia;
    this.latitude     = latitude;
    this.longitude    = longitude;
    this.lat          = lat;
    this.lng          = lng;
    this.draggable    = draggable;

  }
}
