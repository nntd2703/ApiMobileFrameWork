var braintree = require('braintree')
var gateway_pay = require('../lib/gateway')
const Transaction_Infor = require('../models/transaction_infor')
const Transaction_Result = require('../models/transaction_result')
//import * as Transaction_Result from "../model/transaction_result"
//import * as Transaction_Infor from "../model/transaction_infor"

var TRANSACTION_SUCCESS_STATUSES = [
    braintree.Transaction.Status.Authorizing,
    braintree.Transaction.Status.Authorized,
    braintree.Transaction.Status.Settled,
    braintree.Transaction.Status.Settling,
    braintree.Transaction.Status.SettlementConfirmed,
    braintree.Transaction.Status.SettlementPending,
    braintree.Transaction.Status.SubmittedForSettlement
];
/*gateway_pay.clientToken.generate({
    merchantAccountId: "VND"
}, function (err, response) {
    var clientToken = response.clientToken
});*/
module.exports = {
    client_token: (req, res) => {
        gateway_pay.clientToken.generate({
        }, (err, response) => {
            //res.send(response)
            if (!err) res.json({ "status": true, "data": response.clientToken })
            else {
                console.log("Err get client token " + err)
                res.json({ "status": false, "data": err })}
        })
    },
    transaction: (req, res) => {
        var amount = req.body.amount
        var paymentMethodNonce = req.body.payment_method_nonce
        console.log("Transaction Start: " + amount + "      " + paymentMethodNonce)
        //var merchant_Account_Id = req.body.merchantAccountId
        var merchant_Account_Id = req.body.merchantAccountId
        console.log("Currency " + merchant_Account_Id)
        var sale = {
            amount: amount,
            merchantAccountId: merchant_Account_Id,
            paymentMethodNonce: paymentMethodNonce,
            options: {
                submitForSettlement: true
            }
        }
        console.log("Detail transaction " + JSON.stringify(sale, null, 2) )
        gateway_pay.transaction.sale(sale, (error, result) => {
            console.log("Transaction active")
            //console.log(result.transaction.id)
            console.log("Err " + error) 
            if (result.success || result.transaction) {
                console.log("Transaction")
                var trans = result.transaction
                //console.log(JSON.stringify(trans, null, 2))
                var transaction_infor = new Transaction_Infor(trans.id,trans.amount,trans.createdAt,trans.currencyIsoCode,trans.paymentInstrumentType,trans.status)
                console.log(JSON.stringify(transaction_infor, null, 2))
                var transaction_result = new Transaction_Result(true,"is success","null",transaction_infor)
                console.log(JSON.stringify(transaction_result, null, 2))
                res.send(JSON.stringify(transaction_result, null, 2))
            }
            else {
                //res.send(result)
                /**
                 * https://developers.braintreepayments.com/reference/general/validation-errors/all/php#code-91565
                 */
                console.log("False with " + result.transaction)
                console.log(result)
                console.log("with error: " + error)
                var transaction_result = new Transaction_Result(false  ,result.message,"1312",null)
                res.send(JSON.stringify(transaction_result, null, 2))

                //res.json({ "status": false, "data": null })
            }
        })
    },
    check_out_id: (req, res) => {
        console.log("checkout")
        var result
        var transaction_id = req.params.id
        gateway_pay.transaction.find(transaction_id, (err, transaction) => {
            // result = createResultObject(transaction)
            res.json(transaction)
        })
    }

    /*check_out: function (req, res) {
        var nonceFromTheClient = req.body.payment_method_nonce
        gateway_pay.transaction.sale({
            amount: "10.00",
            payment_method_nonce: nonceFromTheClient,
            options: {
                submitForSettlement: true
            }
        }, function (err, result) {
            res.send(result)
            console.log(result)
        })
    },
    */

}

function createResultObject(transaction) {
    var result;
    var status = transaction.status;
    if (TRANSACTION_SUCCESS_STATUSES.indexOf(status) !== -1) {
        result = {
            header: 'Sweet Success!',
            icon: 'success',
            message: 'Your test transaction has been successfully processed. See the Braintree API response and try again.'
        };
    } else {
        result = {
            header: 'Transaction Failed',
            icon: 'fail',
            message: 'Your test transaction has a status of ' + status + '. See the Braintree API response and try again.'
        };
    }
    return result;
}
