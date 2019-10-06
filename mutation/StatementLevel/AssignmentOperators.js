var fs = require('fs');
var solm = require('solmeister');
var path = require('path');
var solparse = require('solparse');

var operators = {
    "*=":  ['/=', '+=', '-=', '%=', '|=', '&=', '^=', '='],
    "/=":  ['*=', '+=', '-=', '%=', '|=', '&=', '^=', '='],
    "+=":  ['*=', '/=', '-=', '%=', '|=', '&=', '^=', '='],
    "-=":  ['*=', '+=', '/=', '%=', '|=', '&=', '^=', '='],
    '%=':  ['*=', '+=', '-=', '/=', '|=', '&=', '^=', '='],
    '|=':  ['*=', '+=', '-=', '%=', '/=', '&=', '^=', '='],
    '&=':  ['*=', '+=', '-=', '%=', '|=', '/=', '^=', '='],
    '^=':  ['*=', '+=', '-=', '%=', '|=', '&=', '/=', '='],
    '=':  ['*=', '+=', '-=', '%=', '|=', '&=', '/=', '^=']
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


//TODO: This generates too many invalid mutants. Rewrite to
//only generate assignment mutants for supported types. For
//example, strings do not support compound assignment operators.
exports.mutateAssignmentOperator = function(file, filename){
    //	console.log("Binary Operators Found");
    var ast;
    data = fs.readFileSync(file);
    fileNum = 1;
    let mutCode = solm.edit(data.toString(), function(node) {
        if(node.type === 'AssignmentExpression'
            && ((node.left.hasOwnProperty('literal')
                && node.left.literal.hasOwnProperty('literal')
                && node.left.literal.literal != "string") ||
                (!node.left.hasOwnProperty('literal')))    
        ) {
            var mutOperator;
            mutOperatorList = operators[node.operator];
            console.log(node.operator);				
            for (i = 0; i < mutOperatorList.length; i++) {
                mutOperator = mutOperatorList[i];	
                tmpNode = node.getSourceCode().replace(node.operator, mutOperator);

                console.log(mutOperator);

                fs.writeFileSync("./sol_output/" + filename + '/'
                    + path.basename(file).slice(0, -4) + "AssignmentMut" 
                    + fileNum.toString() + ".sol", data.toString().replace(
                        node.getSourceCode(), tmpNode), 'ascii');
                fileNum++
            }
        }
    });
}

