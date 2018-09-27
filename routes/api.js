'user strict'
const api_ctrl = require('../controllers/api.controller')
const ac_db = require('../controllers/acdb.controller')
const payment_fea = require('../controllers/payment.controller')
const error_out = require('../controllers/error.controller')

module.exports = function(app){
    //get infor address
    app.get('/api/getallprovince', api_ctrl.getallprovince) //-> http://172.16.5.169:8889/api/getallprovince 
    app.get('/api/getalldistrict', api_ctrl.getalldistrict) // -> http://172.16.5.169:8889/api/getalldistrict
    app.get('/api/getallward', api_ctrl.getallward) // -> http://172.16.5.169:8889/api/getallward
    app.get('/api/getdistrictwith/:provincecode', api_ctrl.getdistrict) // -> http://172.16.5.169:8889/api/getdistrictwith/01: matp
    app.get('/api/getwardwith/:districtcode', api_ctrl.getward)  // -> http://172.16.5.169:8889/api/getdistrictwith/555 : maqh 

    //get category
    app.get('/api/getallcategory', api_ctrl.get_category)
    app.get('/api/get_main_category', api_ctrl.get_main_category)
    app.get('/api/get_subcate_2/:id_number_cat_2', api_ctrl.get_sub2_category)
    app.get('/api/get_subcate_3/:id_number_cat_3', api_ctrl.get_sub3_category)


    //get product
    app.get('/api/get_product/:type/:id', api_ctrl.get_product_with_main)
    app.get('/api/get_random_product',api_ctrl.random_product)
    //get all feature of API
    app.get('/api', api_ctrl.getinstruction)
    app.get('/local_ip', ac_db.get_local_ip)

    app.get('/testconnection', function (res, req) {
        console.log('Connect success')
    })
    app.get('/', error_out.index)
    app.get('/inputdata', error_out.index)

    //input feature to database
    app.post('/inputdatabase', ac_db.inputdata)
    app.get('/clone_database', ac_db.clone_database)
    app.get('/insert_image', ac_db.updateImage_feature)
    app.get('/get_product', ac_db.get_product)
    //payment feature
    app.get('/api/token', payment_fea.client_token)
    app.post('/api/payment', payment_fea.transaction)
    app.get('/api/checkouts/:id', payment_fea.check_out_id)

    //user checking feature 
    app.post('/api/check_user', api_ctrl.check_user)
    //get address_book
    app.get('/api/get_address_book/:user_id', api_ctrl.get_address_book)
    app.post('/api/post_address_book', api_ctrl.post_address_book)


    app.post('/api/getproduct',api_ctrl.get_add_list_item_in_cart)
}

//process.on('uncaughtException', function (err) {});