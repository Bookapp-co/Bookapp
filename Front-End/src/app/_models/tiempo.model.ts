
export class Tiempo {

  public _id : String;
  public nombre: String;
  public minutos: number;

  public restaurante: boolean;
  public cancha: boolean;
  public medico: boolean;
  public peluqueria: boolean;
  public tolerancia: boolean;

  constructor(
      _id : string = '',
      nombre: string = '',
      minutos: number = 1,

      restaurante: boolean = false,
      cancha: boolean = false,
      medico: boolean = false,
      peluqueria: boolean = false,
      tolerancia: boolean = false,
  ) {

    this._id                = _id;
    this.nombre             = nombre;
    this.minutos            = minutos;

    this.restaurante = restaurante;
    this.cancha = cancha;
    this.medico = medico;
    this.peluqueria = peluqueria;
    this.tolerancia = peluqueria;

  }
}
