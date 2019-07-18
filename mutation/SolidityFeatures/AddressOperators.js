//var parser = require("solidity-parser-antlr");
var fs = require('fs');
var solm = require('solmeister');
//var solp = require('solidity-parser');
var parser = require('solparse');
var path = require('path');
var utility = require('../utility/utility.js');

var operators = {
            'zero': '0x0',
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



exports.mutateAddressLiteralOperator = function(file, filename){
	var ast;
	fs.readFile(file, function(err, data) {	
		if(err) throw err;

		fileNum = 1;
		var callNode = null;
		let mutCode = solm.edit(data.toString(), function(node) {
			
			//If contract has more than two calls to change addresses
			//to different contracts. Swap the calls.
			if(node.type == "CallExpression" && node.callee.hasOwnProperty('name')
                && node.callee.name == 'address' && node.arguments != null
            ){
                var tmpNodeZero = "";
                var tmpNodeRand = "";               

			    if(node.arguments[0].type == 'Literal') {
                    tmpNodeZero = node.getSourceCode().replace(node.arguments[0].value,
                         operators['zero']);
                    tmpNodeRand = node.getSourceCode().replace(node.arguments[0].value,
                        operators['random']);
                }else if( node.arguments[0].type == 'Identifier') {
                    tmpNodeZero = node.getSourceCode().replace(node.arguments[0].name,
                         operators['zero']);
                    tmpNodeRand = node.getSourceCode().replace(node.arguments[0].name,
                        operators['random']);      
                }else if(node.arguments[0].type == 'ThisExpression') {
                    tmpNodeZero = node.getSourceCode().replace('this',
                         operators['zero']);
                    tmpNodeRand = node.getSourceCode().replace('this',
                        operators['random']);
                }

                if(tmpNodeZero != "" && tmpNodeRand != "") {
                    fs.writeFile("./sol_output/" + filename + "/"
                        + path.basename(file).slice(0, -4) + "AddressZero"
                        + fileNum.toString() + ".sol",
                        data.toString().replace(node.getSourceCode(),
                        tmpNodeZero), 'ascii', function(err) {
                            if(err) throw err;
                        });
                    fileNum++;

                    fs.writeFile("./sol_output/" + filename + "/"
                        + path.basename(file).slice(0, -4) + "AddressRand"
                        + fileNum.toString() + ".sol", 
                        data.toString().replace(node.getSourceCode(),
                        tmpNodeRand), 'ascii', function(err) {
                            if(err) throw err;
                        });
                    fileNum++;
                }
			}else if(node.type == "AssignmentExpression" && node.left.literal != null
                && node.left.literal.literal == "address"
                && !(node.left.literal.hasOwnProperty('members') 
                && node.left.literal.members.hasOwnProperty('length')
                && node.left.literal.members.length  >= 0)
            ){
				tmpNodeZero = node.getSourceCode().replace(node.right.value, operators['zero']);
				tmpNodeRand = node.getSourceCode().replace(node.right.value, operators['random']);
				
                console.log(node.getSourceCode());
                console.log(node);
	
                fs.writeFile("./sol_output/" + filename + "/"
                    + path.basename(file).slice(0, -4) + "AddressZeroAE"
                    + fileNum.toString() + ".sol",
                     data.toString().replace(node.getSourceCode(),
                    tmpNodeZero), 'ascii', function(err) {
                        if(err) throw err;
                    });
				fileNum++;
						
		        fs.writeFile("./sol_output/" + filename + "/"
                    + path.basename(file).slice(0, -4) + "AddressRandAE"
                    + fileNum.toString() + ".sol", 
                    data.toString().replace(node.getSourceCode(),
                    tmpNodeRand), 'ascii', function(err) {
                        if(err) throw err;
                    });
				fileNum++;
			}else if(node.type == 'StateVariableDeclaration' && node.hasOwnProperty('literal')
				&& node.literal.hasOwnProperty('literal') && node.literal.literal == 'address'
				&& node.value != null && node.value.hasOwnProperty('value')	
			){
				tmpNodeZero = node.getSourceCode().replace(node.value.value, operators['zero']);
                tmpNodeRand = node.getSourceCode().replace(node.value.value, operators['random']);

                fs.writeFile("./sol_output/" + filename + "/"
                    + path.basename(file).slice(0, -4) + "AddressZeroSV"
                    + fileNum.toString() + ".sol", 
                    data.toString().replace(node.getSourceCode(),
                    tmpNodeZero), 'ascii', function(err) {
                        if(err) throw err;
                    });
                fileNum++;

                fs.writeFile("./sol_output/" + filename + "/"
                    + path.basename(file).slice(0, -4) + "AddressRandSV"
                    + fileNum.toString() + ".sol",
                    data.toString().replace(node.getSourceCode(),
                    tmpNodeRand), 'ascii', function(err) {
                        if(err) throw err;
                	});
                fileNum++;
			}

		});
		
	})
	
}

exports.mutateAddressSwitchCallExpressionOperator = function(file, filename) {
    contractNames = utility.collectImportedContracts(file).forEach(function(contract) {
        contract = contract.replace('.sol', '');
    });    
    
    console.log(contractNames);
    
    if (contractNames != null && contractNames.length >= 2) {
        fs.readFile(file, function(err, data) {
            let mutCode = solm.edit(data.toString(), function(node) {
                if(node.type == "CallExpression" 
                    && contractNames.indexOf(node.callee.name) >= 0
                ){
                    for(var i = 0; i < contractNames.length; i++) {
                        if (node.callee.name != contractNames[i]) {
                            tmpNodeSwitch = node.getSourceCode().replace(node.callee.name,
                                contractNames[i]);

                            fs.writeFile("./sol_output/" + filename + "/"
                                + path.basename(file).slice(0, -4) + "AddressSwitchCall"
                                + fileNum.toString() + ".sol",
                                data.toString().replace(node.getSourceCode(),
                                tmpNodeSwitch), 'ascii', function(err) {
                                    if(err) throw err;
                                });
                            fileNum++;
                        }
                    }
                }
            });
        });
    }
}

