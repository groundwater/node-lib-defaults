'use strict';

var join = require('path').join;

function Defaults() {
  this.base = null;
  this.copy = null;
}

Defaults.prototype.setBaseDir = function (base) {
  this.base = base;
};

Defaults.prototype.setCopyDir = function (copy) {
  this.copy = copy;
};

Defaults.prototype.getConfigSync = function (name) {
  var config = this.$.NewConfig();

  var base = join(this.base, name + '.json');
  var copy = join(this.copy, name + '.json');

  config.push(graceful(base, this.$.fs.readFileSync));
  config.push(graceful(copy, this.$.fs.readFileSync));

  return config;
};

Defaults.prototype.setConfigSync = function (name, config) {
  this.$.fs.writeFileSync(join(this.copy, name + '.json'),
    JSON.stringify(config.stack));
};

Defaults.NewEmpty = function( ){
  return Object.defineProperty(new Defaults(), '$', {value: this});
};

Defaults.New = function (global, copy) {
  var def = this.NewEmpty();

  return def;
};

function graceful(file, read) {
  var out;
  try {
    out = JSON.parse(read(file));
  } catch (e) {
    out = {};
  }
  return out;
}

function inject(deps) {
  return Object.create(Defaults, deps);
}

function defaults() {
  var Union = require('lib-union')();

  return {
    NewConfig: {
      value: function(){
        return Union.New();
      }
    },
    fs: {
      value: require('fs')
    }
  };
}

module.exports = function INIT(deps) {
  return inject(deps || defaults());
};
