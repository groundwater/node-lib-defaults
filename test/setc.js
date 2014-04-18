var test = require('tap').test
var mock = require('nodemock')

test("setConfigSync", function(t){
  var Union = require('lib-union')();
  function ok(name, val){
    t.equals(name, '/copy/test.json', 'writes to copy location')
    t.deepEquals(JSON.parse(val), {a: 'A'}, 'grabs the writable version')

    return true;
  }

  var fs = mock
    .mock('writeFileSync').takesF(ok).returns()
  var Defaults = require('../index.js')({
    fs: {
      value: fs
    }
  })

  var def = Defaults.New()

  def.setCopyDir('/copy')
  def.setBaseDir('/base')

  var conf = Union.New();

  conf.set('a', 'a')
  conf.push()
  conf.set('a', 'A')

  def.setConfigSync('test', conf)

  fs.assertThrows()

  t.end()
})
