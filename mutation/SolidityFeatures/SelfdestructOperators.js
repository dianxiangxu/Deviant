//var parser = require("solidity-parser-antlr");
var fs = require('fs');
var solm = require('solmeister');
//var solp = require('solidity-parser');
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


//TODO: Split into multiple functions
exports.mutateSelfdestructOperator = function(file, filename){
    //	console.log("Binary Operators Found");
    var ast;
    data = fs.readFileSync(file);	

    fileNum = 1;
    let mutCode = solm.edit(data.toString(), function(node) {
        if(node.type === 'ExpressionStatement' &&
            node.expression.type === 'CallExpression' &&
            (node.expression.callee.name === 'selfdestruct'
            || node.expression.callee.name == 'suicide')) 
        {

            var dummyStatement = 'int dummy_mutant_sub;';

            fs.writeFileSync("./sol_output/" + filename + "/" 
                + path.basename(file).slice(0, -4) + "SelfdestructDelete" 
                + fileNum.toString() + ".sol", data.toString().replace(
                    node.getSourceCode(), dummyStatement), 'ascii');
            fileNum++

        }else if(node.hasOwnProperty('parent') && node.parent != null
            && node.parent.hasOwnProperty('type')
            && node.parent.type === 'FunctionDeclaration'
            && node.type === 'BlockStatement') 
        {
            var selfdestruct_statement = 'selfdestruct(address(0x123));\n }';
            var pos = node.getSourceCode().lastIndexOf('}');

            //Matching to a return statement
            isMatching = node.getSourceCode().match(/return\s*.*;/)
            if (isMatching){
                //Change the position of insertion in case the block has a return statement.
                pos = node.getSourceCode().lastIndexOf(isMatching[0])+isMatching[0].length;
            }

            fs.writeFileSync("./sol_output/" + filename + "/"
                + path.basename(file).slice(0, -4) + "SelfdestructInsert"
                + fileNum.toString() + ".sol", data.toString().replace(
                    node.getSourceCode(), node.getSourceCode().substring(0, pos) +
                    selfdestruct_statement)+ 
                node.getSourceCode().substring(pos + 1), 'ascii');
            fileNum++
        }
    });

}

