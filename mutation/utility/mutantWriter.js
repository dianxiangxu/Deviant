var fs = require('fs');
var path = require('path');

function writeMutant(fileInfo, mutInfo) {
    fs.writeFile("./sol_output/" + fileInfo.filename + '/'
        + path.basename(fileInfo.file).slice(0, -4) + "AddressFunctionSwap"
        + fileInfo.fileNum.toString() + ".sol",
        mutInfo.data.toString().replace(mutInfo.node.getSourceCode(), mutInfo.tmpNode),
        'ascii', function(err) {
            if(err) throw err;
        }
    );
});
