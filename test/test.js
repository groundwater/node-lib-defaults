var test = require('tap').test
var mock = require('nodemock')

test("copy overrides base case", function(t){
  var Defaults = require('../index.js')({
    NewConfig: {
      value: function(){
        return require('lib-union')().New()
      }
    },
    fs: {
      value: mock.mock('readFileSync')
        .mock('readFileSync').takes('/base/test.json').returns('{"x":"base"}')
        .mock('readFileSync').takes('/copy/test.json').returns('{"x":"copy"}')
    }
  })

  var base = '/base/'
  var copy = '/copy/'

  var def = Defaults.New()

  def.setCopyDir(copy)
  def.setBaseDir(base)

  var conf = def.getConfig('test')

  t.equals(conf.get('x'), 'copy')

  t.end()
})

test("base case is default", function(t){
  var Defaults = require('../index.js')({
    NewConfig: {
      value: function(){
        return require('lib-union')().New()
      }
    },
    fs: {
      value: mock.mock('readFileSync')
        .mock('readFileSync').takes('/base/test.json').returns('{"x":"base"}')
        .mock('readFileSync').takes('/copy/test.json').returns('{}')
    }
  })

  var base = '/base/'
  var copy = '/copy/'

  var def = Defaults.New()

  def.setCopyDir(copy)
  def.setBaseDir(base)

  var conf = def.getConfig('test')

  t.equals(conf.get('x'), 'base')

  t.end()
})

test("nonexistent file throws gracefully", function(t){
  var Defaults = require('../index.js')({
    NewConfig: {
      value: function(){
        return require('lib-union')().New()
      }
    },
    fs: {
      value: {readFileSync: function(){throw new Error}}
    }
  })

  var base = '/base/'
  var copy = '/copy/'

  var def = Defaults.New()

  def.setCopyDir(copy)
  def.setBaseDir(base)

  var conf = def.getConfig('test')

  t.equals(conf.get('x'), undefined)

  t.end()
})
