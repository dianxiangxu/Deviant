var fs = require('fs');
var solm = require('solmeister');
var parser = require('solparse');
var path = require('path');


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



exports.collectContractFunctions = function(file) {
	functionList = []
	data = fs.readFileSync(file);

		let mutCode = solm.edit(data.toString(), function(node) {
			if(node.type == 'FunctionDeclaration') {functionList.push(node.name);}
		});

	return functionList;
}

exports.collectImportedContracts = function(file) {
	importList = [];
	data = fs.readFileSync(file);

		let mutCode = solm.edit(data.toString(), function(node) {
			if(node.type == 'ImportStatement') {importList.push(node.from)};
		});
    console.log(importList);
	return importList;
}

exports.collectInheritedContracts = function(file) {
	inheritedList = [];
	data = fs.readFileSync(file);

		let mutCode = solm.edit(data.toString(), function(node) {
			if(node.type == 'ContractStatement' && node.is.length > 0){
				for(var i = 0; i < node.is.length; i++) {
					inheritedList.push(node.is[i].name);
				}
			}
		});	
	return inheritedList;
}

exports.matchInheritedImportedContracts = function (inheritedList, importList) {
	matchList = [];
	
	for(var i = 0; i < inheritedList.length; i++) {
		for(var j = 0; j < importList.length; j++) {
			if(importList[j].includes(inheritedList[i])){matchList.push(importList[j]);}
		}
	}
	return matchList;
}

exports.getContractType = function(file) {
	data = fs.readFileSync(file);

		let mutCode = solm.edit(data.toString(), function(node) {
			if(node.type == 'LibraryStatement') {return 'Library';}
			if(node.type == 'ContractStatement') {return 'Contract';}
			if(node.type == 'InterfaceStatement') {return 'Interface';}

		});
		return 'None';
}

exports.buildOverridingList = function(file) {
    //gathering location of files that contract inherits from
    importList = this.collectImportedContracts(file);
    inheritedList = this.collectInheritedContracts(file);
    matchList = this.matchInheritedImportedContracts(inheritedList, importList);


    functionMatchLists = [];
    //changing path to match relation to original contract
    for(var i = 0; i < matchList.length; i++) {
        functionMatchLists.push(this.collectContractFunctions(
            path.dirname(file) + '/' + matchList[i])
        );
    }

    currFunctionList = this.collectContractFunctions(file);
    overridingList = [];
    for(var i = 0; i < functionMatchLists.length; i++) {
        for(var j = 0; j < functionMatchLists[i].length; j++){
            //if both lists contain same function name
            if(currFunctionList.indexOf(functionMatchLists[i][j]) > -1){
                overridingList.push(functionMatchLists[i][j]);
            }
        }
    }
    return overridingList;
}

exports.getStateVariables = function(file) {
    stateVariableList = [];
    data = fs.readFileSync(file);

        let mutCode = solm.edit(data.toString(), function(node) {
            if(node.type == 'StateVariableDeclaration' && node.is.length > 0){
                for(var i = 0; i < node.is.length; i++) {
                    stateVariableList.push(node.is[i].name);
                }
            }
        });
    return stateVariableList;
}

exports.getParentStateVariables = function(file) {
    inheritedList = this.collectInheritedContracts(file);
    importedList = this.collectImportedContracts(file);

    matchedList = this.matchInheritedImportedContracts(inheritedList, importedList);

    parentStateVariables = [];
    for(var i = 0; i < matchedList.legth; i++) {
        parentStateVariables = parentStateVariables.concat(this.getStateVariables(matchedList[i]));
    }
    return parentStateVariables;
}

exports.getStateVariableDeclaration = function(file) {
    stateVariableList = [];
    data = fs.readFileSync(file);

        let mutCode = solm.edit(data.toString(), function(node) {
            if(node.type == 'StateVariableDeclaration' && node.is.length > 0){
                for(var i = 0; i < node.is.length; i++) {
                    stateVariableList.push(node.getSourceCode());
                }
            }
        });
    return stateVariableList;

}

exports.getParentStateVariableDeclaration = function(file) {
    inheritedList = this.collectInheritedContracts(file);
    importedList = this.collectImportedContracts(file);

    matchedList = this.matchInheritedImportedContracts(inheritedList, importedList);

    parentStateVariables = [];
    for(var i = 0; i < matchedList.legth; i++) {
        parentStateVariables = parentStateVariables.concat(this.getStateVariableDeclaration(matchedList[i]));
    }
    return parentStateVariables;
}

exports.getParentContractReference = function(file) {
    parentList = this.collectInheritedContracts(file);
    
    parentDeclarationList = [];

    data = fs.readFileSync(file);

        let mutCode = solm.edit(data.toString(), function(node) {

            if(node.type == 'DeclarativeExpression' && node.hasOwnProperty('literal')
               && parentList.indexOf(node.literal.name) >= 0    
            ) {
                for(var i = 0; i < parentList.length; i++) {
                    parentDeclarationList.push(node.name);
                }
            }
        });
    return parentDeclarationList;
}

exports.getVarTypeDict = function(file) {
	varTypeDict = {};

	data = fs.readFileSync(file);

    let mutCode = solm.edit(data.toString(), function(node) {

        if(node.type == 'DeclarativeExpression' && node.hasOwnProperty('literal')
			&& node.literal != null
		) {
            varTypeDict[node.name] = node.literal.literal;
        }
    });
    return varTypeDict;

}

exports.getImportedContractParentsDict = function(file, filename) {
    importParentDict = {};

	impList = this.collectImportedContracts(file);
	for(var i = 0; i < impList.length; i++) {
		importParentDict[impList[i].replace('.sol', '')] = this.collectInheritedContracts(file.replace(filename+'.sol' + impList[i]));
	}

    return importParentDict;
} 
