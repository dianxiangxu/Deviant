var fs = require('fs');
var solm = require('solmeister');
var path = require('path');
var solparse = require('solparse');

let options = {
	format: {
		indent: {
			style: '\t',
			base: 0
		},
		newline: '\n\n',
		space: ' ',
		quotes: 'double'
	}
};

exports.mutateBlockOperator = function(file, filename) {
    var ast;
    data = fs.readFileSync(file);

        fileNum = 1;
        let mutCode = solm.edit(data.toString(), function(node) {
            if(node.type === 'BlockStatement') {


                fs.writeFileSync("./sol_output/" +  filename + '/' 
                    + path.basename(file).slice(0, -4) + "BlkDelMut"  
                    + fileNum.toString() + ".sol", data.toString().replace(
                    node.getSourceCode(), "{}"), 'ascii');
                fileNum++
            }


        });
}

