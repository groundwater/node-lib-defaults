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

Defaults.prototype.getConfig = function (name) {
  var config = this.$.NewConfig();

  var base = join(this.base, name + '.json');
  var copy = join(this.copy, name + '.json');

  config.load(graceful(base, this.$.fs.readFileSync));
  config.load(graceful(copy, this.$.fs.readFileSync));

  return config;
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
  var Config = require('lib-config');

  return {
    NewConfig: {
      value: function(){
        return new Config();
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
