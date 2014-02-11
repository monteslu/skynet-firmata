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
      console.log('could node connect to board' , err);
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

function getModes(pin){
  return pin.supportedModes.map(function (mode) {
    return modeNames[mode];
  });
}


Plugin.prototype.onMessage = function(data){
  var board = this.board;

  if(data.pins){

    data.pins.forEach(function(pin){
      if(pin.value == 'on'){
        board.digitalWrite(pin.id, 1);
      }else{
        board.digitalWrite(pin.id, 0);
      }
    });
  }

  if(data.fromUuid && data.pinModes){
    this.messenger.send({
      devices: data.fromUuid,
      message: {
        pinModes: board.pins.map(function (pin, i) {
          console.log(i, pin);
          if (!pin.supportedModes.length){
            return {id:i, mode:null, supported:null};
          }else{
            return {id:i, mode:modeNames[pin.mode], supported:getModes(pin)};
          }
        })
      }
    });
  }

};

Plugin.prototype.destroy = function(){
  //clean up
  console.log('destroying.', this.options);
};


module.exports = Plugin;
