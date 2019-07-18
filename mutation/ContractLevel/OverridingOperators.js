//var parser = require("solidity-parser-antlr");
var fs = require('fs');
var solm = require('solmeister');
//var solp = require('solidity-parser');
var parser = require('solparse');
var path = require('path');
var utility = require('../utility/utility.js');


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


exports.mutateOverrideFunctionDeleteOperator = function(file, filename){
	overridingList = utility.buildOverridingList(file);
    console.log(overridingList);


	fs.readFile(file, function(err, data) {	
		if(err) throw err;

		fileNum = 1;
		let mutCode = solm.edit(data.toString(), function(node) {
			
			if(node.type == 'FunctionDeclaration' && overridingList.indexOf(node.name) > -1) {
				fs.writeFile("./sol_output/" + filename + "/"  
				+ path.basename(file).slice(0, -4) + "OverriddenFunctionDelete" 
				+ fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
				""), 'ascii', function(err) {
					if(err) throw err;
				});
				fileNum++;
			}
		});
		
	})
	
}

exports.mutateOverrideFunctionCPC = function(file, filename) {
   overridingList = utility.buildOverridingList(file); 

	fs.readFile(file, function(err, data) {
        if(err) throw err;

        fileNum = 1;
        let mutCode = solm.edit(data.toString(), function(node) {

            if(node.type == 'FunctionDeclaration' && overridingList.indexOf(node.name) > -1) {
                //appending mutant to change the function name
                replaceCode = node.getSourceCode().replace(node.name, node.name + "MUTANT");

                fs.writeFile("./sol_output/" + filename + "/"
                + path.basename(file).slice(0, -4) + "OverriddenFunctionRename"
                + fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
                replaceCode), 'ascii', function(err) {
                    if(err) throw err;
                });
                fileNum++;
            }
        });

    })


}

exports.mutateOverrideFunctionRename = function(file, filename) {
	overridingList = utility.buildOverridingList(file);

    fs.readFile(file, function(err, data) {
        if(err) throw err;

        fileNum = 1;
        let mutCode = solm.edit(data.toString(), function(node) {

            if(node.type == 'FunctionDeclaration' && overridingList.indexOf(node.name) > -1) {
				//appending mutant to change the function name
				replaceCode = node.getSourceCode().replace(node.name, node.name + "MUTANT");
				
				fs.writeFile("./sol_output/" + filename + "/"
                + path.basename(file).slice(0, -4) + "OverridenFunctionRename"
                + fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
                replaceCode), 'ascii', function(err) {
                    if(err) throw err;
                });
                fileNum++;
            }
        });

    })

}
