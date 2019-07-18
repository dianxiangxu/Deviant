var fs = require('fs');
var solm = require('solmeister');
var path = require('path');

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



exports.mutateHexadecimalOperator = function(file, filename){
	var ast;
	fs.readFile(file, function(err, data) {	
		if(err) throw err;


		fileNum = 1;
		let mutCode = solm.edit(data.toString(), function(node) {
			if(node.type === 'HexLiteral') {
				tmpNode = node.getSourceCode().replace(node.value, "0");
                tmpNodeExtra = node.getSourceCode().replace(node.value, "1234");			    
	
				//Writing to mutant file
				fs.writeFile("./sol_output/" + filename + '/' 
				    + path.basename(file).slice(0, -4) + "HexZero" 
				    + fileNum.toString() + ".sol", data.toString().replace(
                    node.getSourceCode(), tmpNode), 'ascii', function(err) {
					    if(err) throw err;
				    }
                );
				fileNum++;

                fs.writeFile("./sol_output/" + filename + '/'
                    + path.basename(file).slice(0, -4) + "HexRandom"
                    + fileNum.toString() + ".sol", data.toString().replace(
                    node.getSourceCode(), tmpNode), 'ascii', function(err) {
                        if(err) throw err;
                    }
			    );
                fileNum++;
			}

		});
		
	})
	
}

