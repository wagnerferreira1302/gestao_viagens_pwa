export default class DespesaModel {
    description: string;
    quantity: Number;
    amount: Number;
    currencyFrom: Number;
    currencyTo: Number;
 
    constructor(
      description: string,
      quantity: Number,
      amount: Number,
      currencyFrom: Number,
      currencyTo: Number,
    ) {
      this.description = description;
      this.quantity = quantity;
      this.amount = amount;
      this.currencyFrom = currencyFrom;
      this.currencyTo = currencyTo;
    }
  }