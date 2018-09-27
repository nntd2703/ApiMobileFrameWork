'use strict'

class Transaction_Infor{  
    constructor(transaction_id,amount,created_At,currency,payment_type,status_transaction){
        this.transaction_id = transaction_id
        this.amount = amount
        this.created_At = created_At
        this.currency = currency
        this.payment_type = payment_type 
        this.status_transaction = status_transaction
    }
}

module.exports = Transaction_Infor