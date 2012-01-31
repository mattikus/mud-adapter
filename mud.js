exports.Client = Client;
var net = require('net');
var util = require('util');
var repl = require('repl');

function Client(connectionObj) {
    var self = this;
    self.connect(connectionObj);
    process.EventEmitter.call(this);
}

util.inherits(Client, process.EventEmitter);
Client.prototype.conn = null;

Client.prototype.connect = function (connectionObj) {
	var self = this;
	self.conn = connectionObj;
	self.conn.addListener("connect", function() {
		self.conn.write("@connect account password\r\n");
		self.emit("connect");
	});
	var buffer = '';
	self.conn.addListener("data", function(chunk){
		buffer += chunk;
		var lines = buffer.split("\r\n");
		buffer = lines.pop();
		lines.forEach(function(line) {
			console.log(line);
			self.emit('raw', line);
		});
	});
	self.conn.addListener("close", function() {
		util.log('Connection closed by remote host, exiting.');
		return;
	});
};

Client.prototype.say = function(text) {
    var self = this;
    if (typeof text !== 'undefined') {
        this.conn.write('"' + text + '\r\n');
   }
};

Client.prototype.send = function(target, text) {
    var self = this;
    if (typeof text !== 'undefined') {
        this.conn.write(target + ', ' + text + '\r\n');
   }
};

console.log("Entering __main__");
// bot = new Client('wfg.mcs.anl.gov', 'Bacon', 'toc');
foo = net.createConnection(port, host);
bot = new Client(foo);
repl.start('BE THE MUD:');
