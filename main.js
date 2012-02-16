// Dim, by David Marrs (d.marrs@gmail.com)
//
// A dependency inverter for modules. It was written originally to enable the
// author to mock modules in Node.js.

var exec = require('child_process').exec;
(function() {
    var root    = '',
        modules = {};

    function Module() {
        this.dependencies = {};
        this.dependencies_ordered = [];
        this.run = undefined;
    }

    function find_module_path(name) {
        // Strings begining with ':' are relative to dim.root.
        return (name.indexOf(':') === 0)? root + name.substring(1): name;
    }

    exports.init = function(path) {
        if (root.length) return;
        if (!path) throw('Dim: Root path not provided');
        if (path.charAt(0) !== '/') {
            throw('Dim: Root path must be absolute');
        }
        root = path.charAt(path.length) !== '/'? path + '/': path;
    }

    exports.root = function() {
        return root;
    }

    exports.module = function(name) {
        if (name === undefined) {
            throw "Dim: Module must have a name.";
        }
        return {
            requires: function(args) {
                var module = modules[name] || new Module();
                for (var i = 0, mod = arguments[0]; i < arguments.length; mod = arguments[++i]) {
                    module.dependencies[mod] = require(find_module_path(mod));
                }
                module.dependencies_ordered = arguments;
                modules[name] = module;
                return this;
            },

            runs: function(fn) {
                modules[name].run = fn;
            }
        }
    };

    exports.require = function(name) {
        if (modules[name] === undefined) {
            modules[name] = new Module();
            require(find_module_path(name));
        }
        return {
            override: function(obj) {
                for (var i in obj) {
                    modules[name].dependencies[i] = obj[i];
                }
                return this;
            },

            get: function() {
                var args = [],
                    deps = modules[name].dependencies,
                    deps_ordered = modules[name].dependencies_ordered;

                for (var i =0; i<deps_ordered.length; i++) {
                    args[i] = deps[deps_ordered[i]];
                }
                return modules[name].run.apply({}, args);
            }
        };
    }
}());

