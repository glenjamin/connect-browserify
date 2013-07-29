// Generated by CoffeeScript 1.6.3
(function() {
  var Q, browserify, dirname, extend, fs, join, relative, relativize, resolve, serve, shim, watchify, _ref;

  _ref = require('path'), dirname = _ref.dirname, join = _ref.join, resolve = _ref.resolve, relative = _ref.relative;

  fs = require('fs');

  Q = require('kew');

  browserify = require('browserify');

  watchify = require('watchify');

  shim = require('browserify-shim');

  extend = require('xtend');

  relativize = function(entry, requirement, extensions) {
    var expose;
    expose = relative(dirname(entry), requirement);
    expose = expose.replace(/\.[a-z_\-]+$/, '');
    return "./" + expose;
  };

  module.exports = serve = function(options) {
    var b, bundle, contentType, rendered, w;
    b = serve.bundle(options);
    contentType = options.contentType || 'application/javascript';
    rendered = void 0;
    bundle = function() {
      rendered = Q.defer();
      return b.bundle(options, function(err, result) {
        if (err) {
          return rendered.reject(err);
        } else {
          return rendered.resolve(result);
        }
      });
    };
    bundle();
    if (options.watch !== false) {
      w = watchify(b);
      w.on('update', bundle);
    }
    return function(req, res, next) {
      res.setHeader('Content-type', contentType);
      return rendered.then(function(result) {
        return res.end(result);
      }).fail(next);
    };
  };

  serve.bundle = function(options) {
    var b, baseDir, bundle, expose, extension, k, requirement, shims, transform, v, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3, _ref4;
    baseDir = dirname(resolve(options.entry));
    b = browserify({
      entries: [options.entry]
    });
    b.delay = options.bundleDelay || 300;
    if (options.extensions != null) {
      _ref1 = options.extensions;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        extension = _ref1[_i];
        b.extension(extension);
      }
    }
    if (options.shims != null) {
      shims = {};
      _ref2 = options.shims;
      for (k in _ref2) {
        v = _ref2[k];
        shims[k] = extend({}, v, {
          path: join(baseDir, v.path)
        });
      }
      b = shim(b, shims);
    }
    if (options.transforms != null) {
      _ref3 = options.transforms;
      for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
        transform = _ref3[_j];
        b.transform(transform);
      }
    }
    if (options.requirements != null) {
      _ref4 = options.requirements;
      for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
        requirement = _ref4[_k];
        expose = relativize(options.entry, requirement);
        b.require(requirement, {
          expose: expose
        });
      }
    }
    if (options.bundle != null) {
      bundle = options.bundle(bundle);
    }
    return b;
  };

  serve.serve = serve;

}).call(this);

/*
//@ sourceMappingURL=index.map
*/
