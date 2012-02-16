var dim = require('../main');
dim.module(':tests/dim-util').requires('util', 'fs').runs(function(util, fs) {
    return {
        puts: util.puts,
        stat: fs.stat
    }
});
