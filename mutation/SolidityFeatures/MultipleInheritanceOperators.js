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



exports.mutateMultipleInheritanceOperator = function(file, filename){
//	console.log("Binary Operators Found");
	var ast;
	fs.readFile(file, function(err, data) {	
		if(err) throw err;

		fileNum = 1;
		let mutCode = solm.edit(data.toString(), function(node) {
			if(node.type === 'ContractStatement' && node.is.length > 1) {
			
				for(i = 0; i < node.is.length; i++) {
                    tmpNode = node.getSourceCode().replace(node.is[i].name, "");

                    if(node.getSourceCode().includes(', '+ node.is[i].name+',')){
					    tmpNode = node.getSourceCode().replace(', ' + node.is[i].name, "");
                    }else if(node.getSourceCode().includes(node.is[i].name+',')) {
					    tmpNode = node.getSourceCode().replace(node.is[i].name+',', "");
                    }else if(node.getSourceCode().includes(', ' + node.is[i].name)) {
					    tmpNode = node.getSourceCode().replace(', ' + node.is[i].name, "");
                    }

					fs.writeFile("./sol_output/" + filename + '/'
						+ path.basename(file).slice(0, -4) + "MultipleInheritance" 
						+ fileNum.toString() + ".sol", 
						data.toString().replace(node.getSourceCode(), tmpNode),
						'ascii', function(err) {
							if(err) throw err;
					});
					fileNum++;
				}
			
			}

		});
		
	})
	
}

