
export class Banco {

  public pago_cuenta_banco: String;
  public banco: String;
  public pago_beneficiario: String;

  constructor(
      pago_cuenta_banco: string = '',
      banco: string = '',
      pago_beneficiario: string = ''
  ) {

    this.pago_cuenta_banco    = pago_cuenta_banco;
    this.banco                = banco;
    this.pago_beneficiario    = pago_beneficiario;

  }
}
