module.exports = {
    get_local_ip: function (req, res) {
    var os = require('os');
    var ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;
        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }
            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                console.log(ifname + ':' + alias, iface.address);
            } else {
                // this interface has only one ipv4 adress
                console.log(ifname, iface.address);
                res.json({
                    "Ip current": iface.address
                })
            }
            ++alias;
        });
    });
},
    inputdata: function (req, res) {
        var sess = req.session
        var table_name = "mf_instruction"
        if (req.method == "POST") {
            var post = req.body
            var id_feature = post.id_feature
            var name = post.name
            var link = post.link
            var error = post.error
            var note = post.note

            var sql = "INSERT INTO `" + table_name + "` values ('" + id_feature + "','" + name + "','" + link + "','" + error + "','" + note + "')"
            db.query(sql, function (err, result) {
                if (err) throw console.log(err)
                console.log("1 record inserted " + id_feature + "','" + name + "','" + link + "','" + error + "','" + note + "")
                console.log(sql)
                res.json({
                    "Message: ":"Success"
                })
            })
        }
    },

    clone_database: function (req, res) {
        //config database 
        configauthor()


        //get_detail_product(1,"https://tiki.vn/bo-thu-giai-ma-tin-hieu-denon-da10spem-p1947935.html?src=category-page")
        //clone_data()
    },

    updateImage_feature: function (req, res) {
        //console.log("Load Done")
        insertImage()
    },

    get_product: function (req, res) {

        var sql = "SELECT * FROM `mf_product` WHERE `image_src`  = 'undefined'"
        //var sql = "select * from `mf_product` where `author`= '' and `id_category` in (select `id` as `id_category` from `mf_category` where `rating` = 3 and  `priority` in  (select `id` from `mf_category` where `priority` = 2)) "
        //var sql = "SELECT `id`,`link_refer` FROM `mf_category` WHERE `rating` = 3 and `product_quantity` is null LIMIT 20"
        //var sql = "SELECT `id`,`product_href` FROM `mf_product` WHERE `review` is null limit 1"
        //var pos = 1
        db.query(sql, function (err, rows, fields) {
            if (err) throw console.log(err + " ")
            rows.forEach(row => {
                //console.log("link " + row.product_href)
                //get_detail_product(row.id, row.product_href)
                get_detail_product(row.product_href, row.id)
            })
        })
        //get_detail_product()
    }
}

function configauthor() {
    var sql = "select `id`,`author` from `mf_product` where `id_category` in (select `id` as `id_category` from `mf_category` where `rating` = 3 and  `priority` in  (select `id` from `mf_category` where `priority` = 2)) "

    db.query(sql, function (err, rows, fields) {
        if (err) throw console.log(err + " ")
        rows.forEach(row => {
            //console.log(row.id + " " + row.author.trim())
            //console.log(row.author.length)
            var newstring = ''
            for (var i = 0; i < row.author.length; i++) {
                character = row.author.charAt(i);
                character_back = row.author.charAt(i - 1)
                if (character == character.toUpperCase() && character_back != ' ' && character != ' ' && character_back != '') {
                    //console.log(character + '  upper case true')
                    //console.log("char "+character + " back is  " + character_back)
                    character = ' ' + character
                }
                if (character == character.toLowerCase()) {
                    //console.log(character +'   lower case true')
                }
                newstring += character
            }
            //console.log('temp ' + newstring)
            var arr = newstring.split(" ")
            newstring = ''
            var arr_new = newstring.split(" ")
            var flag = 0
            arr.forEach(item => {
                //console.log(item)
                var arr_new = newstring.split(" ")
                arr_new.forEach(item_new => {
                    if (item == item_new) {
                        flag = 1
                    }
                })
                if (flag == 0) {
                    newstring += " " + item
                }
            })
            console.log("new " + newstring.trim())
            var sql_update = "UPDATE `mf_product` set `author` = '" + newstring.trim() + "'where `id` = '" + row.id + "' "
            db.query(sql_update, function (err, result) {
                if (err) throw console.log(err)
                console.log("success update" + sql_update)
            })
        })
    })


}

function reduceString(str, amount) {
    var re = new RegExp("(.)(?=\\1{" + amount + "})", "g");
    return str.replace(re, "");
}

function get_detail_product(url_link, id) {//id, url_link) {
    //var sql = "SELECT `product_href` FROM `mf_product` WHERE image_src is null LIMIT 100"
    //var url_link = "https://tiki.vn/bon-chang-trai-cung-nhau-di-du-lich-p1621207.html?src=category-page"
    request(url_link, function (error, response, body) {
        if (error) throw console.log(error + " with link" + url_link)
        $ = cheerio.load(body)
        console.log(url_link)
        //var comming_soon = $('p.g-preorder').text()
        //console.log(comming_soon)
        //var final_price = $('p.special-price-item').attr('data-value')
        //var price_regular = $('p.old-price-item').attr('data-value')
        //var sale_tag = $('span.discount-percent').text()
        //console.log(id + "    " + final_price + " " + price_regular + " " + sale_tag + " " + url_link)

        /* var ds = $('div.zoomWrapper').find('img').attr('src')
         console.log(ds)
         var sql_update = "UPDATE `mf_product` set `image_src` = '" + ds + "'where `id` = '" + id + "' "
         db.query(sql_update, function (err, result) {
             if (err) throw console.log(err)
             console.log("success update" + sql_update)
         })*/

        var ds = $(body).find('.item-brand').find('p').find('a').text()
        console.log(ds)
        var sql_update = "UPDATE `mf_product` set `author` = '" + ds + "'where `id` = '" + id + "' "
        db.query(sql_update, function (err, result) {
            if (err) throw console.log(err)
            console.log("success update" + sql_update)
        })
        /*
        ds.each(function (i, e) {
            var data_id = e["attribs"]["target"]
            console(data_id)
            /*if (typeof data_id === 'string' || data_id instanceof String) {
                var author = e["attribs"]["data-brand"]
                var title = e["attribs"]["data-title"]
                console.log("    " + data_id + " " + author + " " + title + " ")
                var sql_update = "UPDATE `mf_product` set `author` = '" + author + "'where `id_tiki` = '" + data_id + "' "
                db.query(sql_update, function (err, result) {
                    if (err) throw console.log(err)
                    console.log("success update" + sql_update)
                })
            }
        })*/

        /* var data_id =  $('div.product-item').attr('data-id')
        var author = $('div.product-item').attr('data-brand')
        var title = $('div.product-item').attr('data-title')
        var img_src =  $('img.product-image img-responsive').attr('src')
        console.log(id + "    " + data_id + " " + author + " " + title + " " + img_src) */
        /*var sql_update = "UPDATE `mf_product` set `final_price` = '" + final_price + "', `price-regular` = '" + price_regular + "', `sale-tag` = '" + sale_tag + "' where `id` = '" + id + "' "
        db.query(sql_update, function (err, result) {
        if (err) throw console.log(err)
            console.log("success update" + sql_update)
        })*/
    })
}

function get_product_for_sub3(url_link, id_parent) {
    var url = "https://tiki.vn"
    request(url + url_link, function (error, response, body) {
        if (error) throw console.log(error + " with link" + url_link)
        $ = cheerio.load(body)
        var ds = $(body).find("div.product-item").find("a")
        var position = 0;
        ds.each(function (i, e) {
            if (position < 11) {
                console.log("with ds find1")
                var product_id = e["attribs"]["data-id"]
                if (!isNaN(product_id)) {
                    var product_href = e["attribs"]["href"]
                    var product_title = e["attribs"]["title"].replace(/['(''')']/g, '')
                    console.log(position + "   " + product_id + "   " + product_href + "    " + product_title + "  " + id_parent)
                    position++
                    update_product(product_id, product_href, product_title, id_parent, position)
                }
                //ds.find('.product-image.img-responsive').attr("src")
            }
            var sql_update = "UPDATE `mf_category` set `product_quantity` = '" + position + "' where `id` = '" + id_parent + "' "
            db.query(sql_update, function (err, result) {
                if (err) throw console.log(err)
                console.log("success update" + sql_update)
            })
        })
    })
}

function update_product(product_id, product_href, product_title, id_parent, product_quantity) {
    var product_quantity = 0;
    var sql = "INSERT INTO `mf_product` (`id_tiki`,`product_href`,`title`,`id_category`) values('" + product_id + "','" + product_href + "','" + product_title + "','" + id_parent + "')"
    var sql_update = "UPDATE INTO `mf_category` set `product_quantity` = '" + product_quantity + "' where `id` = '" + id_parent + "' "
    //console.log("Fail " + sql)
    db.query(sql, function (err, result) {
        if (err) throw console.log(err)
        console.log("success " + sql)
        product_quantity++
    })
}

function getdata_withlink(url_link, id_priority) {
    var rating = 2
    var rating_new = rating + 1
    //var id_add = 19
    //var sql_get_cat = "SELECT `id`,`link_refer` FROM `mf_category` WHERE `rating` = '" + rating + "' and `id` = " + id_add + "  "
    var url = "https://tiki.vn"
    /*db.query(sql_get_cat, function (err, rows, fields) {
        if (err) throw console.log(err + " " + url)
        console.log(rows.length + "      " + rating)
        rows.forEach(function (row) {
            console.log("Link: " + url)
            console.log("Load Done")
            console.log(url + row.link_refer)
            var url_link = url + row.link_refer
            var id_priority = row.id*/
    request(url + url_link, function (error, response, body) {
        if (error) throw console.log(error + " with link" + url_link)
        $ = cheerio.load(body)
        var ds = $(body).find("div.is-child").find('a')
        ds.each(function (i, e) {
            var url_category = e["attribs"]["href"]
            fix_str = url_category.replace(/[/]+/g, '-').replace('?src=tree', '')
            fix_str = "cat" + fix_str
            var name_category = $(this).text().replace(/[0-9]+/g, '').replace(/['(',')']/g, '') //return only number
            console.log("main   :  " + name_category)
            console.log(url_link + "    link:  " + url_category + "    " + name_category + "   fixed:  " + fix_str)
            insertDatabase(fix_str, name_category, id_priority, url_category, rating_new)
        })
    })
    //})
    //})
}

function clone_data() {
    var sql = "select `id`,`link_refer` from `mf_category` where `rating` = 2"
    db.query(sql, function (err, rows, fields) {
        rows.forEach(element => {
            var sql = "select  * from `mf_category` where `rating` = 3 and `priority` = " + element.id + ""
            db.query(sql, function (err, rows, fields) {
                if (rows.length < 5) {
                    console.log(element.id + "  length " + rows.length + " link  " + element.link_refer)
                    getdata_withlink(element.link_refer, element.id)
                }
            })
        });
    })
}


function insertDatabase(id_category, title, priority, link_refer, rating) {
    var sql = "INSERT INTO `mf_category` (`id_category`,`title`,`priority`,`link_refer`,`rating`) values('" + id_category + "', '" + title + "', '" + priority + "', '" + link_refer + "', '" + rating + "')"
    //console.log("Fail " + sql)
    db.query(sql, function (err, result) {
        if (err) throw console.log(err)
        console.log("success " + sql)
    })
}


//Function with add image for any category  not yet have
function insertImage() {
    var sql = "SELECT `link_refer` FROM `mf_category` WHERE `image_src` is NULL LIMIT 100"
    var url = "https://tiki.vn"
    var array_image = []
    db.query(sql, function (err, rows, fields) {
        if (err) throw console.log(err)
        updateImageDB(rows)
    })
}


function updateImageDB(array_image) {
    console.log("Length " + array_image.length)
    array_image.forEach(function (row) {
        console.log("It's link: " + "https://tiki.vn" + row.link_refer)
        request("https://tiki.vn" + row.link_refer, function (error, response, body) {
            if (error) throw console.log(error + " with link")
            $ = cheerio.load(body)
            src = $('.product-image.img-responsive').attr("src");
            if (typeof src === 'string' || src instanceof String) {
                var sql = "UPDATE `mf_category` SET `image_src` = '" + src + "' WHERE `link_refer` = '" + row.link_refer + "' "
                //console.log("Fail " + sql)
                db.query(sql, function (err, result) {
                    if (err) throw console.log(err)
                    console.log("success " + sql)
                })
            }
            console.log("Image main category " + src + "         of ")
        })
    })
    /**/
}



//console.log(arr_link)

    /* 
    request(url_link, function (error, response, body) {
        if (error) throw console.log(error + " " + url_link)
        $ = cheerio.load(body)
        var ds = $(body).find("div.is-child").find('a')
        ds.each(function (i, e) {
            var url_category = e["attribs"]["href"]
            var fix_str = url_category
            fix_str = fix_str.replace(/[/]+/g, '_')
            fix_str = fix_str.replace('?src=tree', '')
            fix_str = "cat"+fix_str
            var name_category = $(this).text().replace(/[0-9]+/g, '').replace(/['(',')']/g, '') //return only number
            //name_category.replace(/[^0-9\.]+/g,'')
            console.log("main   :  " + name_category)
            console.log(url_link + "    link:  " + url_category + "    " + name_category + "   fixed:  " + fix_str)
            var sql = "INSERT INTO `mf_category` (`id_category`,`title`,`priority`,`link_refer`) values ('" + fix_str + "','" + name_category + "','" + id_priority + "','" + url_category + "')"
            console.log("Non-success "+sql)
            db.query(sql, function (err, result) {
                if (err) throw console.log(err)
                console.log("Non-success "+sql)
            })
            var url_category_full = url + url_category
            request(url_category_full, function (err, response, result_body) {
                if (err) throw console.log(err + " " + url_category_full)
                var body_child = $(result_body).find("div.is-child").find('a')
                //var get_category_img =  $(result_body).find("img.product-image").attr("src");
                //console.log("Image main category " +get_category_img + "         of " + url_category_full)
                body_child.each(function (i, e) {
                    var url_sub_category = e["attribs"]["href"]
                    var fix_sub_str = url_sub_category
                    fix_sub_str = fix_sub_str.replace(/[/]+/g, '_')
                    fix_sub_str = fix_sub_str.replace('?src=tree', '')
                    fix_sub_str = "cat"+fix_sub_str
                    name_sub_category = $(this).text().replace(/[0-9]+/g, '').replace(/['(',')']/g, '')  //return only number
                    //name_sub_category.replace(/[^0-9\.]+/g,'')
                    console.log("sub   :  " + name_sub_category)
                    console.log(url_category_full + "    link:  " + url_sub_category + "    " + name_sub_category + "     fixed  " + fix_sub_str)
                    
                    var sql = "INSERT INTO `mf_category` (`id_category`,`title`,`priority`,`link_refer`) values ('" + fix_sub_str + "','" + name_sub_category + "','" + fix_str + "','" + url_sub_category + "')"
                    db.query(sql, function (err, result) {
                        if (err) throw console.log(err)
                        console.log(sql)
                    })
                    /*request(url+url_sub_category,function(err,response,result_sub_body){
                         if (err) throw console.log(err + " " + url_sub_category)
                         //var get_sub_img =  $(result_sub_body).find("img.product-image").attr("src");
                         //console.log("Image sub category " +get_sub_img + "         of " + url+url_sub_category)
                     })
                    })
                })
            })
        })
    */

    /*request(url_link, function (error, response, body) {
        if (error) throw console.log(error + " " + url_link)
        $ = cheerio.load(body)
        var ds = $(body).find("div.is-child").find('a')
        ds.each(function (i, e) {
            var url_category = e["attribs"]["href"]
            var fix_str  = url_category
            fix_str = fix_str.replace(/[/]+/g,'_')
            fix_str = fix_str.replace('?src=tree','')
            var name_category = $(this).text().replace(/[0-9]+/g,'').replace(/['(',')']/g,'') //return only number
            //name_category.replace(/[^0-9\.]+/g,'')
            console.log("main   :  " + name_category)
            //console.log(url_link+ "    link:  "+ url_category + "    " + name_category +"   fixed:  " + fix_str)
            var url_category_full = url+url_category
            request(url_category_full,function(err,response,body){
                if (error) throw console.log(error + " " + url_category_full)
                var body_child =  $(body).find("div.is-child").find('a')
                body_child.each(function (i, e){
                    var url_sub_category = e["attribs"]["href"]
                    var fix_sub_str = url_sub_category
                    fix_sub_str = fix_sub_str.replace(/[/]+/g,'_')
                    fix_sub_str = fix_sub_str.replace('?src=tree','')
                    name_sub_category = $(this).text().replace(/[0-9]+/g,'').replace(/['(',')']/g,'')  //return only number
                    //name_sub_category.replace(/[^0-9\.]+/g,'')
                    console.log("sub   :  " + name_sub_category)
                    //console.log(url_category_full+ "    link:  "+ url_sub_category + "    " + name_sub_category + "     fixed  " + fix_sub_str)
                })
            })
        })
    })*/
    /*request(url_link, function (error, response, body) {
        if (error) throw console.log(error + " " + url_link)
        $ = cheerio.load(body)
        var ds = $(body).find("div.is-child").find('a')
        ds.each(function (i, e) {
            var url_category = e["attribs"]["href"]
            var fix_str  = url_category
            fix_str = fix_str.replace(/[/]+/g,'_')
            fix_str = fix_str.replace('?src=tree','')
            console.log(url_link+ "    link:  "+ url_category + "    " + $(this).text() +"   fixed:  " + fix_str)
            var url_category_full = url+url_category
            request(url_category_full,function(err,response,body){
                if (error) throw console.log(error + " " + url_category_full)
                var body_child =  $(body).find("div.is-child").find('a')
                body_child.each(function (i, e){
                    var url_sub_category = e["attribs"]["href"]
                    var fix_sub_str = url_sub_category
                    fix_sub_str = fix_sub_str.replace(/[/]+/g,'_')
                    fix_sub_str = fix_sub_str.replace('?src=tree','')
                    console.log(url_category_full+ "    link:  "+ url_sub_category + "    " + $(this).text() + fix_sub_str)
                })
            })
        })
    })*/
    //res.json({ 'message': 'Success' })

/*
var sql = "INSERT INTO `mf_category` (`id_category`,`title`,`priority`,`link_refer`,`rating`)
 values ('" + fix_str + "','" + name_category + "','" + id_priority + "','" + url_category + "','"+rating_new +"')"
                        console.log("Non-success "+sql)
                        db.query(sql, function (err, result) {
                            if (err) throw console.log(err)
                            console.log("Non-success "+sql)
                        })
*/


/*
code get image 

var get_sub_img = $(body).find("img.product-image").attr("src");
                        console.log("Image sub category " + get_sub_img + "         of " + url + url_sub_category)




                //console.log(data)
                /*ds.each(function (i, e) {
                    //console.log("attribs is " + e["attribs"])
                    var name_class = e
                    if (name_class === "list-group-item is-top") {
                        //console.log( "main_category: " +  url_link + " "  +  $(this).text())
                    }
                    else if (name_class === "list-group-item is-child")
                    {
                        //console.log("Log link "+ e["attribs"]["href"])
                        //console.log("subcategory: "+  url_link + " "  +  $(this).text())
                    }
                    console.log($(this).text())
                })*/
                //var child_in = $(body).find("div.list-group-item is-child").find("a")
                //console.log("Child Ne1" )
                /*child_in.each(function(i, row){
                    //var data = row["attribs"]
                    //console.log(data)
                    console.log(i)
                })*/
                //console.log("Child Ne2" )
                //console.log(child_in)

                //console.log(ds[0].children[0].parent.children[1])
                //res.render("Length of ds " + ds.length + "")
