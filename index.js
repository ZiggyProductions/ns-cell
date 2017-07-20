/**
 * Created by GAZ on 6/28/17.
 */
require('dotenv').config({path: __dirname+'/.env'});
var _ = require('underscore');
var pj = require('./package.json');
var os = require('os');
const DeepstreamServer = require('deepstream.io')
const C = DeepstreamServer.constants

var net = os.networkInterfaces();
var filtered;
_.each(net,function(ifaces){
    _.each(ifaces,function (iface) {
        if(iface.internal == false && iface.family == 'IPv4')
            filtered = iface.address;
    })
})

console.log(filtered);
var options = {
    endpoint: process.env.NS_MONITOR_ENDPOINT,
    namespace: process.env.NS_MONITOR_NAMESPACE,
    meta: {
        node: 'ns-cell',
        version: pj.version,
        os:{
            hostname: os.hostname(),
            pid: process.pid
        },
        ds:{port:0, ip:filtered}

    }
};

var client = require('@netshards/ns-monitor').client(options);

// Requesting available port
client.emit('req-port', options.meta.os, (data) => {
    console.log(data);
    if(data.port){
        const DSServer = new DeepstreamServer({
            host: 'localhost',
            port: data.port,
            showLogo: false,
            plugins: {
                message: {
                    name: 'redis',
                    options: {
                        host: 'localhost',
                        port: 6379
                    }
                }
            }
        })
        try{
            DSServer.start();
            options.meta.ds = {port:data.port, ip:filtered}
            client.emit('meta', options.meta, (data) => {});
        }catch(err){
            console.error(err);
        }
    }
});


