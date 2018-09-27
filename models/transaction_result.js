'use strict'

class Transaction_Result{
    constructor(status,message,error_code,transaction_Infor){
        this.status = status
        this.message = message
        this.error_code = error_code
        this.data = transaction_Infor
    }
}
module.exports = Transaction_Result

