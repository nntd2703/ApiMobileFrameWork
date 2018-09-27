'user strict'

const User = require('../models/user')

module.exports = {
    check_user: (req, res) => {
        var user_id = req.body.user_id
        var email = req.body.email
        var name = req.body.name
        var phone = req.body.phone
        var sql = "SELECT * FROM `mf_user` Where `user_id` = '" + user_id + "'"
        var user_infor = new User(user_id, email, name, phone)
        db.query(sql, (err, result) => {
            if (err) return res.send(err)
            console.log("Length " + result.length)
            if (result.length === 0) {
                insert_new_user(user_infor, function (User) {
                    res.json(User)
                    console.log("behind callback " + JSON.stringify(User, null, 2))
                })
            }
            res.json(user_infor)
        })
    },

    get_address_book: (req, res) => {
        var user_id = req.params.user_id
        console.log(user_id)
        var sql = "SELECT * FROM `mf_addressbook` WHERE `user_id` ='" + user_id + "' "
        db.query(sql, (err, result) => {
            if (err) throw res.json({
                "err_message ": err
            })
            res.json({
                "message": result
            })
        })
    },

    post_address_book: (req, res) => {
        var post_id_user = req.body.id_user
        var post_receiver_name = req.body.receiver_name
        var post_receiver_phone = req.body.receiver_phone
        var post_city = req.body.city
        var post_district = req.body.district
        var post_ward = req.body.ward
        var post_detail_address = req.body.detail_address
        var post_province_code = req.body.province_code
        var post_district_code = req.body.district_code
        var sql = "INSERT INTO `mf_addressbook` (`id_user`,`receiver_name`,`receiver_phone`,`detail_address`,`ward`,`district`,`city`,`province_code`,`district_code`) value ('" + post_id_user + "','" + post_receiver_name + "'," + post_receiver_phone + ",'" + post_detail_address + "','" + post_ward + "','" + post_district + "','" + post_city + "','" + post_province_code + "','" + post_district_code + "');"

        db.query(sql, (err, result) => {
            if (err) throw res.json({
                "Message: ": err, "address_infor": null
            })
            res.json({
                "Message: ": "Sucess"
                , "address_infor": {
                    "id_user": post_id_user,
                    "receiver_name": post_receiver_name,
                    "receiver_phone": post_receiver_phone,
                    "city": post_city,
                    "district": post_district,
                    "ward": post_ward,
                    "detail_address": post_detail_address,
                    "province_code": post_province_code,
                    "district_code": post_district_code
                }
            })
        })
    },
    getallprovince: (req, res) => {
        console.log("Get all province")
        var sql = "SELECT * FROM `mf_province`"
        db.query(sql, function (err, result) {
            if (err) throw res.json({ 'result': err })
            res.json(result)
        })
    },
    getalldistrict: (req, res) => {
        console.log("Get all district")
        var sql = "SELECT * FROM `mf_districts`"
        db.query(sql, function (err, result) {
            if (err) throw res.status(500)  //res.json({'result':err})
            res.json(result)
        })
    },
    getallward: (req, res) => {
        var sql = "SELECT * FROM `mf_ward`"
        db.query(sql, function (err, result) {
            if (err) throw res.json({ 'result': err })
            res.json(result)
        })
    },
    getdistrict: (req, res) => {
        var province_code = req.params.provincecode
        var sql = "SELECT * FROM `mf_districts` WHERE `province_code` = '" + province_code + "'"
        db.query(sql, function (err, result) {
            if (err) res.json({ 'result': err })
            if (result.length === 0) throw res.json({ 'error_message': 'Province code : non-existed' })
            else {
                res.json(result)
            }
        })
    },
    getward: (req, res) => {
        var district_code = req.params.districtcode
        var sql = "SELECT * FROM `mf_ward` WHERE `district_code` = '" + district_code + "' "
        db.query(sql, function (err, result) {
            if (err) throw res.json({ 'result': err })
            if (result.length === 0) throw res.json({ 'error_message': 'District code : non-existed' })
            res.json(result)
        })
    },

    getinstruction: (res, rep) => {
        var sql = "SELECT * FROM `mf_instruction` "
        var title = "Instructions For Use"
        //If you use ,you will replace url_localhost with your domain
        var url_localhost = local_ip
        db.query(sql, function (err, result) {
            if (err) {
                console.log("error is  : " + err)
            }
            console.log("Access Instruction")
            rep.render('table.ejs', { page_title: title, data: result, url: url_localhost })
        })
    },


    get_category: function (rep, res) {
        var sql = "select * from `mf_category`"
        db.query(sql, function (err, result) {
            if (err) {
                console.log("error is  : " + err)
            }
            if (result.length === 0) throw res.json({ 'error_message': 'Database is lost connect. Please try!' })
            res.json(result)

        })
    },
    random_product: (req, res) => {
        console.log("Get random product")
        var sql = "SELECT * FROM `mf_product` ORDER BY RAND() LIMIT 20"
        db.query(sql, function (err, result) {
            if (err) throw console.log("with error : " + err)
            else
                res.json(result)
        })
    },

    get_main_category: (rep, res) => {
        var sql = "select * from `mf_category` where  `rating` = 1"
        console.log("Anydevice get Main Category")
        db.query(sql, function (err, result) {
            if (err) throw res.json({ 'result': err })
            if (result.length === 0) throw res.json({ 'error_message': "Database with main : non-existed" })
            else {
                res.json(result)
            }
        })
    },

    get_sub2_category: (req, res) => {
        var id_cate_2 = req.params.id_number_cat_2
        var sql = "select * from `mf_category` where  `priority` = '" + id_cate_2 + "' and `rating` = 2"
        console.log("Anydevice get Subcategory 2 : " + sql)
        db.query(sql, function (err, result) {
            if (err) throw res.json({ 'result': err })
            if (result.length === 0) throw res.json({ 'error_message': "Database with '" + id_cate_2 + "' : non-existed" })
            else {
                res.json(result)
            }
        })
    },

    get_sub3_category: (req, res) => {
        var id_cate_3 = req.params.id_number_cat_3
        var sql = "select * from `mf_category` where  `priority` = '" + id_cate_3 + "' and `rating` = 3"
        console.log("Anydevice get Subcategory 3 : " + sql)
        db.query(sql, function (err, result) {
            if (err) throw console.log("with error : " + err) //res.json({'result':err})
            if (result.length === 0) {
                console.log(" error : " + err)
                res.json({ 'error_message': "Database with '" + id_cate_3 + "' : non-existed" })
            }
            else {
                res.json(result)
            }
        })
    },


    get_product_with_main: (req, res) => {
        var id_category = req.params.id
        var type_category = req.params.type
        console.log("id " + id_category + "  type " + type_category)
        if (type_category === '1') {
            var sql = "select * from `mf_product` where  `id_category` in (select `id` as `id_category` from `mf_category` where `rating` = 3 and  `priority` in  (select `id` from `mf_category` where `priority` = " + id_category + "))"
        }
        else if (type_category === '2') {
            var sql = "select * from `mf_product` where  `id_category` in (select `id` as `id_category` from `mf_category` where `rating` = 3 and  `priority` = " + id_category + ")"
        }
        else if (type_category === '3') {
            var sql = "select * from `mf_product` where  `id_category` = " + id_category + ""
        }
        db.query(sql, function (err, result) {
            if (err) throw console.log("with error : " + err) //res.json({'result':err})
            if (result.length === 0) {
                console.log(" error : " + err)
                res.json({ 'error_message': "Database with '" + id_category + "' : non-existed" })
            }
            else {
                res.json(result)
            }
        })
    },

    get_add_list_item_in_cart: (req, res) => {
        var listid = req.body
        var strId = ""
        var fareDelivery = 2 //phi giao hang 2$
        console.log(listid)
        listid.forEach(function (item, index) {
            if (strId.length === 0) {
                strId += "'" + item.id + "'"
            }
            else {
                strId += ",'" + item.id + "'"
            }
        })
        var sql = "select * from `mf_product` where `id` in (" + strId + ")"
        console.log(sql)
        var total_temp = 0
        db.query(sql, (err, result) => {
            if (err) throw console.log("with error : " + err)
            if (result.length === 0) {
                console.log(" error : " + err)
                res.json({ 'error_message': "Product '" + item.quantity + "' : non-existed" })
            }
            else {
                result.forEach(e => {
                    listid.forEach(elist => {
                        if (e.id == elist.id) {
                            e.quantity = elist.quantity
                            total_temp += e.quantity * e.final_price
                        }
                    })
                })
                console.log(total_temp)
                //let total_temp = result.reduce((a,b)=>a.final_price*b.quantity,0)
                res.send({ "list_item": result, "total_temp": total_temp,"total":total_temp+fareDelivery })
            }
        })
    }
}

function insert_new_user(User, callback) {
    var sql_add = "INSERT INTO `mf_user` (`user_id`,`email`,`name`,`phone_number`) values ('" + User.user_id + "','" + User.email + "','" + User.name + "','" + User.phone + "')"
    console.log(sql_add)
    db.query(sql_add, (err_add, result) => {
        if (err_add) return callback(err_add)
        //console.log("User " + User.user_id  + "  " + User.name)
        callback(User)
    })
}

//process.on('uncaughtException', function (err) {//console.error(err);});