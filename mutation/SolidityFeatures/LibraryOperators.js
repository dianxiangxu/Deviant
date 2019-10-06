var fs = require('fs');
var solm = require('solmeister');
var parser = require('solparse');
var path = require('path');
var utility = require('../utility/utility.js');

var operators = {
    "public": ['internal', 'private'],
    'internal': ['public', 'private'],
    'private': ['public', 'internal'],
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


//TODO: Split into multiple functions
exports.mutateLibraryOperator = function(file, filename){
    var ast;

    if(utility.getContractType(file) == 'Library') {
        data = fs.readFileSync(file);	
        fileNum = 1;
        let mutCode = solm.edit(data.toString(), function(node) {
            if(node.type === 'FunctionDeclaration' 
                && node.hasOwnProperty('modifiers')
                && typeof node.modifiers[0] != 'undefined'
            ){
                tmpNodeSC1 = node.getSourceCode().replace(node.modifiers[0].name, operators[node.modifiers[0].name][0]);
                tmpNodeSC2 = node.getSourceCode().replace(node.modifiers[0].name, operators[node.modifiers[0].name][1]);

                fs.writeFileSync("./sol_output/" + filename + "/"
                    + path.basename(file).slice(0, -4) + "Library" 
                    + fileNum.toString() + ".sol",
                    data.toString().replace(node.getSourceCode(), tmpNodeSC1),
                    'ascii');
                fileNum++;

                fs.writeFileSync("./sol_output/" + filename + "/"
                    + path.basename(file).slice(0, -4) + "LibraryVisibility"
                    + fileNum.toString() + ".sol", 
                    data.toString().replace(node.getSourceCode(), tmpNodeSC2),
                    'ascii');
                fileNum++;
            }
        });
    }
}

