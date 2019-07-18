//var parser = require("solidity-parser-antlr");
var fs = require('fs');
var solm = require('solmeister');
//var solp = require('solidity-parser');
var parser = require('solparse');
var path = require('path');

var operators = {
            "storage": 'memory',
            "memory": 'storage',
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



exports.mutateDataLocationOperator = function(file, filename){
//	console.log("Binary Operators Found");
	var ast;
	fs.readFile(file, function(err, data) {	
		if(err) throw err;

		fileNum = 1;
		let mutCode = solm.edit(data.toString(), function(node) {
			if(node.hasOwnProperty('storage_location') && node.storage_location != null) {
				var mutOperator;
				mutOperator = operators[node.storage_location];
				tmpNode = node.getSourceCode().replace(node.storage_location, mutOperator);


				fs.writeFile("./sol_output/" + filename + "/" 
				+ path.basename(file).slice(0, -4) + "DataLoc" + mutOperator + 
				+ fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(), tmpNode), 'ascii', function(err) {
					if(err) throw err;
				});
				fileNum++
			
			}

		});
		
	})
	
}

