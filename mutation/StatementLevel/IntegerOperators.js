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



exports.mutateIntegerOperator = function(file){
	var ast;
	fs.readFile(file, function(err, data) {	
		if(err) throw err;


		fileNum = 1;
		let mutCode = solm.edit(data.toString(), function(node) {
			if(node.type === 'StateVariableDeclaration' && node.literal == "int"
                && node.value != null
            ) {
				tmpNode = node.getSourceCode().replace(node.value, 0);
                tmpNodeExtra = node.getSourceCode().replace(node.value, 1234);			    
	
				//Writing to mutant file
				fs.writeFile("./sol_output/" 
				    + path.basename(file).slice(0, -4) + "IntDelete" 
				    + fileNum.toString() + ".sol", data.toString().replace(
                    node.getSourceCode(), tmpNode), 'ascii', function(err) {
					    if(err) throw err;
				    }
                );
				fileNum++;

                fs.writeFile("./sol_output/"
                    + path.basename(file).slice(0, -4) + "IntRandom"
                    + fileNum.toString() + ".sol", data.troString().replace(
                    node.getSourceCode(), tmpNode), 'ascii', function(err) {
                        if(err) throw err;
                    }
			    );
                fileNum++;
			}

		});
		
	})
	
}

