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

exports.mutateInsertSuper = function(file, filename){
	svList = utility.getParentStateVariables(file);
    overridingList = utility.buildOverridingList(file);

	data = fs.readFileSync(file);
		fileNum = 1;
		let mutCode = solm.edit(data.toString(), function(node) {
			
			if(node.type == 'CallExpression' && node.hasOwnProperty('callee')
                && overridingList.indexOf(node.callee.name) >= 0
            ) {
				tmpNode = node.getSourceCode().replace(node.callee.name,'super.'+node.callee.name);


                fs.writeFileSync("./sol_output/" + filename + "/"  
				    + path.basename(file).slice(0, -4) + "SuperInsert" 
				    + fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
				    tmpNode), 'ascii');
			    fileNum++;
            }else if (node.type == 'AssignmentExpression' && node.hasOwnProperty('left')
                && svList.indexOf(node.left.name) >= 0
            ){
                tmpNode = node.getSourceCode().replace(node.left.name,'super.'+node.left.name);


                fs.writeFileSync("./sol_output/" + filename + "/"
                    + path.basename(file).slice(0, -4) + "SuperInsert"          
                    + fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
                    tmpNode), 'ascii');
                fileNum++;

            }else if (node.type == 'BinaryExpression' && 
                (svList.indexOf(node.left.name) >= 0 || svList.indexOf(node.right.name) >=0)
            ){

                if(svList.indexOf(node.left.name) >= 0) {
                    tmpNode = node.getSourceCode().replace(node.left.name,'super.'+node.left.name);
                }else{
                    tmpNode = node.getSourceCode().replace(node.right.name,'super.'+node.right.name);
                }

                fs.writeFileSync("./sol_output/" + filename + "/"
                    + path.basename(file).slice(0, -4) + "SuperInsert"
                    + fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
                    tmpNode), 'ascii');
                fileNum++;

            }

		});
}

exports.mutateDeleteSuper = function (file, filename) {
    data = fs.readFileSync(file);
        fileNum = 1;
        let mutCode = solm.edit(data.toString(), function(node) {

            if(node.type == 'MemberExpression' && node.hasOwnProperty('object')
                && node.object.name == 'super'    
            ) {

                tmpNode = node.getSourceCode().replace('super', 'this');

                fs.writeFileSync("./sol_output/" + filename + "/"
                    + path.basename(file).slice(0, -4) + "SuperDelete"
                    + fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
                    tmpNode), 'ascii');
                fileNum++;
            }
        });

}

exports.mutateHidingVariableDelete = function (file, filename) {
    svList = utility.getParentStateVariables(file);

    data = fs.readFileSync(file);
        fileNum = 1;
        let mutCode = solm.edit(data.toString(), function(node) {

            if(node.type == 'StateVariableDeclaration' && svList.indexOf(node.name) >= 0
            ) {

                fs.writeFileSync("./sol_output/" + filename + "/"
                    + path.basename(file).slice(0, -4) + "HidingVariableDelete"
                    + fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
                    ""), 'ascii');
                fileNum++;
            }
        });
}

exports.mutateHidingVariableInsert = function (file, filename) {
    svList = utility.getParentStateVariableDeclaration(file);

    data = fs.readFileSync(file);
       

        fileNum = 1;
        let mutCode = solm.edit(data.toString(), function(node) {

            if(node.type == 'ContractStatement') {
                for(var i = 0; i < svList.length; i++) {
                    tmpNode = node.getSourceCode().replace('{', '{\n\t' + svList[i] + '\n');

                    fs.writeFileSync("./sol_output/" + filename + "/"
                        + path.basename(file).slice(0, -4) + "HidingVariableDelete"
                        + fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
                        tmpNode), 'ascii');
                    fileNum++;
                }
            }
        });
}

exports.mutateTypeCastInsertion = function (file, filename) {
    data = fs.readFileSync(file);

        importList = utility.collectImportedContracts(file);
		varTypeDict = utility.getVarTypeDict(file);
		fileNum = 1;
        let mutCode = solm.edit(data.toString(), function(node) {
			if(node.type == 'CallExpression' && node.callee.hasOwnProperty('object')
				&& node.callee.object != null && importList.indexOf(varTypeDict[node.callee.object.name]+'.sol') >= 0 
			) {
				importFile = file.replace(filename + '.sol', importList[importList.indexOf(varTypeDict[node.callee.object.name]+'.sol')]);
				pContracts = utility.collectInheritedContracts(importFile);

				for (var i = 0; i < pContracts.length; i++) {
					tmpNode = node.getSourceCode().replace(node.callee.object.name, pContracts[i]+'('+node.callee.object.name+')');

                    fs.writeFileSync("./sol_output/" + filename + "/"
                        + path.basename(file).slice(0, -4) + "TypeCastInsertion"
                        + fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
                        tmpNode), 'ascii');
                    fileNum++;

				}	
			}	
		
		});
}

exports.mutateTypeCastDeletion = function(file, filename) {
    data = fs.readFileSync(file);
        
		iList = utility.collectImportedContracts(file);
		fileNum = 1;
        let mutCode = solm.edit(data.toString(), function(node) {
            if(node.type == 'CallExpression' && node.hasOwnProperty('object')
				&& node.object.hasOwnProperty('callee') && iList.indexOf(node.object.callee.name+'.sol')
			) {
               
            	tmpNode = node.getSourceCode().replace(node.object.callee.name+'(', "");
				tmpNode = tmpNode.replace(')', "");

                fs.writeFileSync("./sol_output/" + filename + "/"
                    + path.basename(file).slice(0, -4) + "TypeCastDeletion"
                    + fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
                    tmpNode), 'ascii');
                fileNum++;
               
            }
        });
}

exports.mutateTypeCastChange = function(file, filename) {
    data = fs.readFileSync(file);
		importParentDict = utility.getImportedContractParentsDict(file, filename);
	
        fileNum = 1;
        let mutCode = solm.edit(data.toString(), function(node) {
            if(node.type == 'CallExpression' && node.hasOwnProperty('object')
                && node.object.hasOwnProperty('callee') && importParentDict[node.object.callee.name] != null
            ) {
				for(var i = 0; i < importParentDict[node.object.callee.name].length; i++){
                	tmpNode = node.getSourceCode().replace(node.object.callee.name, importParentDict[node.object.callee.name][i]);

                	fs.writeFile("./sol_output/" + filename + "/"
                    	+ path.basename(file).slice(0, -4) + "TypeCastChange"
                    	+ fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
                    	tmpNode), 'ascii');
                	fileNum++;
				}
            }
        });
   
}

exports.mutateSuperTypeAll = function(file, filename) {
    exports.mutateTypeCastChange(file, filename);
    exports.mutateTypeCastDeletion(file, filename);
    exports.mutateTypeCastInsertion(file, filename);
    exports.mutateHidingVariableInsert(file, filename);
    exports.mutateHidingVariableDelete(file, filename);
    exports.mutateDeleteSuper(file, filename);
    exports.mutateInsertSuper(file, filename);
}
