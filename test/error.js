var test = require('tap').test
var mock = require('nodemock')
var Conf = require('lib-union')()

test("throw if cannot write to file", function(t){
  var Defaults = require('../index.js')({
    NewConfig: {
      value: function(){
        return require('lib-union')().New()
      }
    },
    fs: {
      value: mock
        .mock('writeFileSync').takesF(function () {
          throw new Error();
        })
    }
  })

  var def = Defaults.New()

  t.throws(function(){
    def.setConfigSync('test', new Conf())
  })

  t.end()
})

test("if do not set base/copy", function(t){
  var Defaults = require('../index.js')({
    NewConfig: {
      value: function(){
        return require('lib-union')().New()
      }
    },
    fs: {
      value: mock
        .mock('readFileSync').takesF(function () {
          throw new Error();
        })
    }
  })

  var def = Defaults.New()

  var conf = def.getConfigSync('test')

  t.ok(conf)
  t.end()
})
