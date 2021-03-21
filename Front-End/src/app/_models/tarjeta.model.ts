


export class Tarjeta {

  public object : Object;
  public number: String;
  public exp_month: number;
  public exp_year: number;
  public cvc: number;

  constructor(
    object : string = 'card',
    number: string = '',
    exp_month: number = 0,
    exp_year: number = 0,
    cvc: number = 0, 
  ){

    this.object = object;
    this.number = number;
    this.exp_month = exp_month;
    this.exp_year = exp_year;
    this.cvc = cvc;

  }

}
