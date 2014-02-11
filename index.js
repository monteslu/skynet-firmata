var firmata = require('firmata');

var modeNames = [
  "INPUT",
  "OUTPUT",
  "ANALOG",
  "PWM",
  "SERVO",
];

function Plugin(messenger, options){
  this.messenger = messenger;
  this.options = options;


  this.board = new firmata.Board(this.options.port, function (err, ok) {
    if (err){
      throw err;
    }

    console.log("board loaded", ok);
  });


  return this;
}

Plugin.getOptionsSchema = function(){
  return {
    'type': 'object',
    'properties': {
      'port': {
        'type': 'string',
        'required': true
      }
    }
  };
};

Plugin.prototype.onMessage = function(data){
  if(data.pins){
    data.pins.forEach(function(pin){
      if(pin.value == 'on'){
        this.board.digitalWrite(pin.id, 1);
      }else{
        this.board.digitalWrite(pin.id, 0);
      }
    });
  }

};

Plugin.prototype.destroy = function(){
  //clean up
  console.log('destroying.', this.options);
};


module.exports = Plugin;
