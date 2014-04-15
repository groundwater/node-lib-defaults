var test = require('tap').test
var mock = require('nodemock')

test("user overrides base case", function(t){
  var Defaults = require('../index.js')({
    NewConfig: {
      value: function(){
        return new (require('lib-config'))
      }
    },
    fs: {
      value: mock.mock('readFileSync')
        .mock('readFileSync').takes('/base/test.json').returns('{"x":"base"}')
        .mock('readFileSync').takes('/user/test.json').returns('{"x":"user"}')
    }
  })

  var base = '/base/'
  var user = '/user/'

  var def = Defaults.New()

  def.setUserDir(user)
  def.setBaseDir(base)

  var conf = def.getConfig('test')

  t.equals(conf.get('x'), 'user')

  t.end()
})

test("base case is default", function(t){
  var Defaults = require('../index.js')({
    NewConfig: {
      value: function(){
        return new (require('lib-config'))
      }
    },
    fs: {
      value: mock.mock('readFileSync')
        .mock('readFileSync').takes('/base/test.json').returns('{"x":"base"}')
        .mock('readFileSync').takes('/user/test.json').returns('{}')
    }
  })

  var base = '/base/'
  var user = '/user/'

  var def = Defaults.New()

  def.setUserDir(user)
  def.setBaseDir(base)

  var conf = def.getConfig('test')

  t.equals(conf.get('x'), 'base')

  t.end()
})

test("nonexistent file throws gracefully", function(t){
  var Defaults = require('../index.js')({
    NewConfig: {
      value: function(){
        return new (require('lib-config'))
      }
    },
    fs: {
      value: {readFileSync: function(){throw new Error}}
    }
  })

  var base = '/base/'
  var user = '/user/'

  var def = Defaults.New()

  def.setUserDir(user)
  def.setBaseDir(base)

  var conf = def.getConfig('test')

  t.equals(conf.get('x'), undefined)

  t.end()
})
