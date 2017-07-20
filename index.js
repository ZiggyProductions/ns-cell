/**
 * Created by GAZ on 6/28/17.
 */
require('dotenv').config({path: __dirname+'/.env'});
var pj = require('./package.json');
var os = require('os');
const DeepstreamServer = require('deepstream.io')
const C = DeepstreamServer.constants
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
        ds:{port:0}

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
            options.meta.ds = {port:data.port}
            client.emit('meta', options.meta, (data) => {});
        }catch(err){
            console.error(err);
        }
    }
});


