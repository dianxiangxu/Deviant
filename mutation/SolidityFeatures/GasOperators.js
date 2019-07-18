//var parser = require("solidity-parser-antlr");
var fs = require('fs');
var solm = require('solmeister');
//var solp = require('solidity-parser');
var parser = require('solparse');
var path = require('path');

var operators = {
            'random': '0x12345'
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



exports.mutateGasOperator = function(file, filename){
	var ast;
	fs.readFile(file, function(err, data) {	
		if(err) throw err;

		fileNum = 1;
		let mutCode = solm.edit(data.toString(), function(node) {
			
			//If contract has more than two calls to change addresses
			//to different contracts. Swap the calls.
			if(node.type === 'CallExpression' && node.hasOwnProperty('callee')
			&& node.callee.hasOwnProperty('property') && node.callee.property.name == 'gas') {
					tmpNode = node.getSourceCode().replace(node.arguments[0].value, operators['random']);
					fs.writeFile("./sol_output/" + filename + "/" 
					+ path.basename(file).slice(0, -4) + "GasMut" 
					+ fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
					tmpNode), 'ascii', function(err) {
						if(err) throw err;
					});
					fileNum++;
			}

		});
		
	})
	
}

