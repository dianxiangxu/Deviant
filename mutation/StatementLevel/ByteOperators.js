//var parser = require("solidity-parser-antlr");
var fs = require('fs');
var solm = require('solmeister');
//var solp = require('solidity-parser');
var parser = require('solparse');
var path = require('path');

var operators = {
    "byte": 'bytes32',
    "bytes1": "bytes32",
    "bytes2": "byte",
    "bytes3": "byte",
    "bytes4": "byte",
    "bytes5": "byte",        
    "bytes6": "byte",        
    "bytes7": "byte",        
    "bytes8": "byte",        
    "bytes9": "byte",        
    "bytes10": "byte",        
    "bytes11": "byte",        
    "bytes12": "byte",        
    "bytes13": "byte",        
    "bytes14": "byte",        
    "bytes15": "byte",        
    "bytes16": "byte",        
    "bytes17": "byte",        
    "bytes18": "byte",        
    "bytes19": "byte",        
    "bytes20": "byte",        
    "bytes21": "byte",        
    "bytes22": "byte",        
    "bytes23": "byte",        
    "bytes24": "byte",
    "bytes25": "byte",        
    "bytes26": "byte",        
    "bytes27": "byte",        
    "bytes28": "byte",        
    "bytes29": "byte",        
    "bytes30": "byte",        
    "bytes31": "byte",        
    "bytes32": "byte",        
    "bytes": 'bytes32'
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



exports.mutateBytesOperator = function(file, filename){
//	console.log("Binary Operators Found");
	var ast;
	fs.readFile(file, function(err, data) {	
		if(err) throw err;

		fileNum = 1;
		let mutCode = solm.edit(data.toString(), function(node) {
			if(node.hasOwnProperty('literal')
                && node.literal.hasOwnProperty('literal')
                && typeof node.literal.literal == 'string' 
                && node.literal.literal.includes('byte')
            ) {
				tmpNode = node.getSourceCode().replace(node.operator, operators[node.operator]);


                fs.writeFile("./sol_output/" + filename + "/"
                    + path.basename(file).slice(0, -4) + "ByteMut"
                    + fileNum.toString() + ".sol",
                    data.toString().replace(node.getSourceCode(),
                    tmpNode), 'ascii', function(err) {
                        if(err) throw err;
                });
                fileNum++
			}

		});
		
	})
	
}

