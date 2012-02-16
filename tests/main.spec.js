if (process.env.DIM_TEST_CONFIG === undefined) {
    process.stdout.write("ABORTING: DIM_TEST_CONFIG is undefined\n");
    process.stdout.write("Please provide a config with app_root defined");
    process.exit(1);
}

var config = require(process.env.DIM_TEST_CONFIG);

describe('dim', function() {
    var dim = require('../main');
    var mod_dim_util = ':tests/dim-util';
    var app_root = config.app_root;
    dim.init(app_root);
    describe('init', function() {
        it('should throw an error if no argument is provided', function() {
            try {
                dim.init();
            } catch (e) {
                expect(e).toBe('Dim: Root path not provided');
            }
        });

        it('should not allow the root path to be overridden once set', function() {
            dim.init('foo');
            expect(dim.root()).toBe(app_root + '/');
        });

        it('should append a trailing slash to the string if none is present', function() {
            expect(dim.root()).toBe(app_root + '/');
        });
    });

    describe('module', function() {
        it('should be defined', function() {
            expect(dim.module).toBeDefined();
        });

        it('should abort if root is empty', function() {
            // Needs to be moved to a separate file since dim is a
            // singleton and init can only be called once per test file.
        });

        it('should return an object containing a method called requires.', function() {
            expect(dim.module(mod_dim_util).requires).toBeDefined();
        });

    });
    
    describe('require', function() {
        it('should be defined', function() {
            expect(dim.require).toBeDefined();
        });

        it('should abort if root is empty', function() {
        });

        it('should fetch the commonJS dependency if no other has been defined', function() {
            expect(dim.require(mod_dim_util).get().puts).toBeDefined();
        });

        describe('overrides', function() {
            it('should let you override any dependencies a module has with an empty object.', function() {
                expect(dim.require(mod_dim_util).override({util: {}}).get().puts).toBeUndefined();
            });

            it('should let you override any dependencies a module has with custom properties', function() {
                expect(dim.require(mod_dim_util)
                    .override({util: {puts: 'foo' }})
                    .get().puts).toBe('foo');
            });
        });
        describe('runs', function() {
            it('should provide modules as args in the order they were required', function() {
                var mod = dim.require(mod_dim_util)
                    .override({
                        util: {puts: 'foo' },
                        fs: {stat: 'bar'}
                    }).get();
                expect(mod.puts).toBe('foo');
                expect(mod.stat).toBe('bar');
            });
        });
    });
});

