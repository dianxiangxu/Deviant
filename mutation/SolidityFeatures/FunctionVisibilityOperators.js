var fs = require('fs');
var solm = require('solmeister');
var parser = require('solparse');
var path = require('path');
var utility = require('../utility/utility.js');

var operators = {
    "public": ['internal', 'private', 'external'],
    'internal': ['public', 'private', 'external'],
    'private': ['public', 'internal', 'external'],
    "external": ['public', 'internal', 'private']
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



exports.mutateFunctionVisibilityOperator = function(file, filename){
    var ast;

    if(utility.getContractType(file) == 'Contract') {
        fs.readFile(file, function(err, data) {	
                if(err) throw err;

                fileNum = 1;
                let mutCode = solm.edit(data.toString(), function(node) {
                        if(node.type === 'FunctionDeclaration'
                            && node.hasOwnProperty('modifiers')
                            && typeof node.modifiers[0] != 'undefined'
			) {

			var visPos = 0;
			
		        for(var i = 0; i < node.modifiers.length; i++) {
				if(node.modifiers[i].name == 'public'
					|| node.modifiers[i].name == 'private'
					|| node.modifiers[i].name == 'internal'
					|| node.modifiers[i].name == 'external'
				){
					visPos = i;
				}
			}

                        tmpNodeSC1 = node.getSourceCode().replace(node.modifiers[visPos].name, operators[node.modifiers[visPos].name][0]);
                        tmpNodeSC2 = node.getSourceCode().replace(node.modifiers[visPos].name, operators[node.modifiers[visPos].name][1]);
                        tmpNodeSC3 = node.getSourceCode().replace(node.modifiers[visPos].name, operators[node.modifiers[visPos].name][2]);

                        fs.writeFile("./sol_output/" + filename + "/"
                                + path.basename(file).slice(0, -4) + "FunctionVisMut" 
                                + fileNum.toString() + ".sol", data.toString().replace(
                                    node.parent.getSourceCode(), tmpNodeSC1), 'ascii', function(err) {
                                if(err) throw err;
                                });
                        fileNum++;

                        fs.writeFile("./sol_output/" + filename + "/"
                                + path.basename(file).slice(0, -4) + "FunctionVisMut"
                                + fileNum.toString() + ".sol", data.toString().replace(
                                    node.parent.getSourceCode(), tmpNodeSC2), 'ascii', function(err) 
                                {
                                if(err) throw err;
                                });
                        fileNum++;

                        fs.writeFile("./sol_output/" + filename + "/"
                                + path.basename(file).slice(0, -4) + "FunctionVisMut"
                                + fileNum.toString() + ".sol", data.toString().replace(
                                    node.parent.getSourceCode(), tmpNodeSC3), 'ascii', function(err) 
                                {
                                if(err) throw err;
                                });
                        fileNum++;



                        }

                });
        })
    }

}

