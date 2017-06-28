/**
 * Created by GAZ on 6/28/17.
 */
require('dotenv').config({path: __dirname+'/.env'});
var pj = require('./package.json');
var os = require('os');
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

    }
};

var client = require('@netshards/ns-monitor').client(options);
