var fs = require('fs');
var solm = require('solmeister');
var path = require('path');
var parser = require('solparse');

var operators = {
    "+": ['-', '*', '/', '%'],
    "-": ['+', '*', '/', '%'],
    "*": ['+','-','/','%'],
    "/": ['+','-','*','%'],
    "%": ['+','-','*','/'],
    "<": ['>', '<=' , '>=', '==', '!='],
    "<=": ['>', '<' , '>=', '==', '!='],
    ">": ['<', '<=' , '>=', '==', '!='],
    ">=": ['>', '<=', '<', '==', '!='],
    "==": ['>', '<=' , '>=', '<', '!='],
    "!=": ['>', '<=' , '>=', '==', '<'],
    '&&': '||',
    '||': '&&',
    '&': ['|', '^'],
    '|': ['&', '^'],
    "^": ['|', "&"],
    "<<": ">>",
    ">>": "<<"
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


exports.mutateBinaryOperator = function(file, filename){
    var ast;
    data = fs.readFileSync(file);

    //fs.writeFile('./ast', JSON.stringify(ast, null, 2));
    fileNum = 1;
    let mutCode = solm.edit(data.toString(), function(node) {
        if(node.type === 'BinaryExpression') {
            var mutOperator;
            mutOperatorList = operators[node.operator];
            if(typeof mutOperatorList !== 'string'){
                for (i = 0; i < mutOperatorList.length; i++) {
                    mutOperator = mutOperatorList[i];
                    tmpNode = node.getSourceCode().replace(node.operator, mutOperator);
                    console.log(tmpNode);
                    fs.writeFileSync("./sol_output/" + filename + "/"
                        + path.basename(file).slice(0, -4) + "BinMut"
                        + fileNum.toString() + ".sol", 
                        data.toString().replace(node.getSourceCode(),
                        tmpNode), 'ascii');
                    fileNum++
                }
            }else{
                mutOperator = mutOperatorList;
                tmpNode = node.getSourceCode().replace(node.operator, mutOperator);

                fs.writeFileSync("./sol_output/" + filename + "/"
                    + path.basename(file).slice(0, -4) + "BinMut"
                    + fileNum.toString() + ".sol",
                    data.toString().replace(node.getSourceCode(),
                    tmpNode), 'ascii');
                fileNum++
            }
        }

    });

}

