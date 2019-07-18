//var parser = require("solidity-parser-antlr");
var fs = require('fs');
var solm = require('solmeister');
//var solp = require('solidity-parser');
var parser = require('solparse');
var path = require('path');

var operators = {
            'random': '0x12345'
};

var kwds = {
		'public': true,
		'private': true,
		'view': true,
		'pure': true,
		'internal': true,
		'memory': true,
		'storage': true,
		'external': true
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



exports.mutateModifierOperator = function(file, filename){
	var ast;
	fs.readFile(file, function(err, data) {	
		if(err) throw err;

		fileNum = 1;
		var modifier = null;
		let mutCode = solm.edit(data.toString(), function(node) {
			
			//If contract has more than two calls to change addresses
			//to different contracts. Swap the calls.
			if(node.type === 'FunctionDeclaration' && node.modifiers != null){
					var loctn = 0;
					var anyMod = false;
					node.modifiers.forEach(function(modif){
						if(!kwds[modif.name]){
							if(modifier == null){
								modifier = modif;
								anyMod = true;
							}
							tmpNode = node.getSourceCode().replace(node.modifiers[loctn].name, "");

							fs.writeFile("./sol_output/" + filename + "/" 
							+ path.basename(file).slice(0, -4) + "ModifierDelMut" 
							+ fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
							tmpNode), 'ascii', function(err) {
								if(err) throw err;
							});
							fileNum++;
						}
						loctn++;
					});

					if(!anyMod && modifier != null){
						tmpNode = node.getSourceCode().replace(node.modifiers[loctn-1].name, node.modifiers[loctn-1].name + " " + modifier.name);
						console.log(modifier.name);
						fs.writeFile("./sol_output/" + filename + "/"
						+ path.basename(file).slice(0, -4) + "ModifierAddMut"
						+ fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),						 tmpNode), 'ascii', function(err) {
							if(err) throw err;
						});
							fileNum++;
				}

			}

		});
		
	})
	
}

