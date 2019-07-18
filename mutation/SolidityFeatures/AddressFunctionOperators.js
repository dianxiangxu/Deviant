//var parser = require("solidity-parser-antlr");
var fs = require('fs');
var solm = require('solmeister');
//var solp = require('solidity-parser');
var parser = require('solparse');
var path = require('path');

var operators = {
            "send": 'transfer',
            "transfer": 'send',
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



exports.mutateAddressFunctionOperator = function(file, filename){
//	console.log("Binary Operators Found");
	var ast;
	fs.readFile(file, function(err, data) {	
		if(err) throw err;

		fileNum = 1;
		let mutCode = solm.edit(data.toString(), function(node) {
			if(node.type === 'ExpressionStatement'
			   && node.expression.type === 'CallExpression'
			   && node.expression.callee.hasOwnProperty('property')
			   && (node.expression.callee.property.name === 'transfer' || 
			   node.expression.callee.property.name === 'send')
			){
				
				var mutOperator;
				mutOperator = operators[node.expression.callee.property.name];
				tmpNode = node.getSourceCode().replace(node.expression.callee.property.name, mutOperator);

				fs.writeFile("./sol_output/" + filename + '/'
				+ path.basename(file).slice(0, -4) + "AddressFunctionSwap" 
				+ fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(), tmpNode), 'ascii', function(err) {
					if(err) throw err;
				});
				fileNum++;
	
				tmpNodeCall = node.getSourceCode().replace(node.expression.callee.property.name,
					"call.value"	
				);
				tmpNodeCall = tmpNodeCall.replace(';', '();');
	
                fs.writeFile("./sol_output/" + filename + '/'
                + path.basename(file).slice(0, -4) + "AddressFunction"
                + fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(), tmpNodeCall), 'ascii', function(err) {
                    if(err) throw err;
                });
                fileNum++;


				if(typeof node.expression.arguments[0] != 'undefined'
				&& node.expression.arguments[0].type == 'Literal'){

					tmpNode = node.getSourceCode().replace(node.expression.arguments[0].value, '0')

					fs.writeFile("./sol_output/" + filename + '/'
						+ path.basename(file).slice(0, -4) + "AddressFunctionLiteral"
						+ fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(), tmpNode), 'ascii', function(err) {
							if(err) throw err;
					});
					fileNum++

					
				}
			}

		});
		
	})
	
}

