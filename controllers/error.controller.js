exports.index = function(res,rep)
{
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
                //console.log(local_ip)
                console.log(ifname, iface.address);
                local_ip = "http://" + iface.address + ":8889/"
                //console.log(local_ip)
            }
            ++alias;
        });
    });
    rep.render('index.ejs',{ ip_current: local_ip })
}


exports.inputdata = function(res,rep)
{
    rep.render('inputdata.ejs')
}