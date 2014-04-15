# lib-defaults

## Install

```javascript
npm install --save lib-defaults
```

## Usage

```javascript
var Defaults = require('lib-defaults');
var defaults = new Defaults();

defaults.get(key);
defaults.set(key, val);
defaults.cat();

defaults.generate();
defaults.remove();
defaults.list();
```
