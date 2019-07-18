//var parser = require("solidity-parser-antlr");
var fs = require('fs');
var solm = require('solmeister');
//var solp = require('solidity-parser');
var parser = require('solparse');
var path = require('path');

var operators = {
	'public': ['private', 'internal'],
	'private': ['public', 'internal'],
	'internal': ['public', 'private']
};

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



exports.mutateStateVarOperator = function(file, filename){
	var ast;
	fs.readFile(file, function(err, data) {	
		if(err) throw err;

		fileNum = 1;
		var modifier = null;
		let mutCode = solm.edit(data.toString(), function(node) {

			//If contract has more than two calls to change addresses
			//to different contracts. Swap the calls.
			if(node.type === 'StateVariableDeclaration' && node.visibility != null){
				tmpNodeSC1 = node.getSourceCode().replace(node.visibility, operators[node.visibility][0]); 

				fs.writeFile("./sol_output/" + filename + "/"
				+ path.basename(file).slice(0, -4) + "StateVarMut" 
				+ fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
				tmpNodeSC1), 'ascii', function(err) {
					if(err) throw err;
				});
				fileNum++;

				tmpNodeSC2 = node.getSourceCode().replace(node.visibility, operators[node.visibility][1]);
				
				fs.writeFile("./sol_output/" + filename + "/"
                                + path.basename(file).slice(0, -4) + "StateVarMut"
                                + fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
                                tmpNodeSC2), 'ascii', function(err) {
                                        if(err) throw err;
                                });
                                fileNum++;




			}	
		});

		})

	}

