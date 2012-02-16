Dim
===

A dependency inverter for Node modules
--------------------------------------

### Purpose

Dim allows you to override module dependencies with your own custom
objects. This is primarily to facilitate mocking of dependencies for
the purpose of unit testing.

### Usage

To use Dim, first initialise it in your project bootstrapper.  Init
takes one argument, the path to the project's root directory.

    require('dim').init('/path/to/app/root');

Now Dim modules can be defined relative to this root. Module names
have the same nomenclature as any Node module, except that the root
directory is represened with a colon. So if a module is located at
`/path/to/app/root/path/to/module.js`, its name would be
`:path/to/module`.

You can check the root path at any time by calling `dim.root()`.

When defining a module, you must also provide the module's dependencies
(if it  has any), and a function containing the module code itself. This
function must return an object containing the module's public interface.
Do this instead of adding the module's members to the `exports` object.


    dim.module(':path/to/module')
        .requires('util', ':path/to/dependency')
        .runs(function(util, my_dependency) {
            // Module code goes here...
            return {
                // Public interface goes here.
            }
        });

To use a Dim module, require it with the following code:

    var my_module = dim.require(':path/to/module')
                       .get();

The purpose of Dim is to let you override dependencies. We can do this
with the override method, which takes, as a single argument, an object
containing replacements for all the dependencies you wish to override.

    var my_module = dim.require(':path/to/module');
                       .override({
                            util: {foo: 'bar'},
                            ':path/to/dependency': {omg: 'lol'}
                       })
                       .get();

Now `util` contains a single property called `foo` and
`:path/to/dependency` contains a single property called `omg`.

### Testing

Tests are written in Jasmine and are kept in the tests directory.

1. Create a config.js file in the tests directory using the example file as a
   template.
2. Make sure that your app root is in absolute path and that it omits
   the trailing slash. This is important to ensure that some of the unit
   tests pass correctly.
3. Run the tests using the run-tests utility.

### Limitations

This library is alpha.  It has not been put to work in a large
application yet.  Use at your own risk.

### Licence

Public Domain. 
