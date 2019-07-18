//var parser = require("solidity-parser-antlr");
var fs = require('fs');
var solm = require('solmeister');
//var solp = require('solidity-parser');
var parser = require('solparse');
var path = require('path');

var operators = {
        "pure": 'view',
	    'view': 'pure',
};

var fTypes = ['pure', 'view', 'payable'];

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



exports.mutateFunctionTypeOperator = function(file, filename){
	var ast;
	fs.readFile(file, function(err, data) {	
		if(err) throw err;

		fileNum = 1;
		let mutCode = solm.edit(data.toString(), function(node) {
			if(node.type === 'ModifierArgument' && operators[node.name] != null) {

				tmpNode = node.parent.getSourceCode().replace(node.name, operators[node.name]);

				fs.writeFile("./sol_output/" + filename + "/" 
				+ path.basename(file).slice(0, -4) + "FunctionTypeSwap" 
				+ fileNum.toString() + ".sol", data.toString().replace(node.parent.getSourceCode(), tmpNode), 'ascii', function(err) {
					if(err) throw err;
				});
				fileNum++;
			
			}

			if(node.type == 'ModifierArgument' && fTypes.indexOf(node.name) >= 0){
				
				tmpNode = node.parent.getSourceCode().replace(node.name, "");

				fs.writeFile("./sol_output/" + filename + "/"
                + path.basename(file).slice(0, -4) + "FunctionTypeDel"
                + fileNum.toString() + ".sol", data.toString().replace(node.parent.getSourceCode(), tmpNode), 'ascii', function(err) {
                    if(err) throw err;
                });
                fileNum++;
			}

			containsModif = false;
			if (node.hasOwnProperty('modifiers') && node.modifiers != null) {
				for(var i = 0; i < node.modifiers.length; i++) {
					if(fTypes.indexOf(node.modifiers[i].name)){
						containsModif = true;
					}
				}
			}

			if(node.type == 'FunctionDeclaration'
				&& !containsModif
			) {
				for(var i = 0; i < fTypes.length; i++) {
               		tmpNode = node.getSourceCode().replace('{', fTypes[i] + ' {');		

					if(node.getSourceCode().includes('return')) {
						tmpNode = node.getSourceCode().replace('return', fTypes[i] + ' return');
					}				

					fs.writeFile("./sol_output/" + filename + "/"
                		+ path.basename(file).slice(0, -4) + "FunctionTypeIns"
                		+ fileNum.toString() + ".sol", data.toString().replace(
						node.getSourceCode(), tmpNode), 'ascii', function(err) {
                    		if(err) throw err;
               			}
					);
                	fileNum++;
				}
			}

		});
		
	})
	
}

