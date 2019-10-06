var fs = require('fs');
var solm = require('solmeister');
var path = require('path');
var solparse = require('solparse');

var operators = {
    "++": ['--', ''],
    "--": ['++', ''],
    "~": '',
    "!": '',
    '+': '-',
    '-': '+'
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
exports.mutateUnaryOperator = function(file, filename){
    var ast;
    data = fs.readFileSync(file);
    fileNum = 1;
    let mutCode = solm.edit(data.toString(), function(node) {
        if(node.type === 'UnaryExpression' || node.type === 'UpdateExpression') {
            var mutOperator;
            mutOperatorList = operators[node.operator];
            if(typeof mutOperatorList !== 'string'){
                for(i = 0; i < mutOperatorList.length; i++) {
                    tmpNode = node.getSourceCode().replace(node.operator, mutOperatorList[i]);


                    fs.writeFileSync("./sol_output/" +  filename + '/'
                        + path.basename(file).slice(0, -4) + "UnaryMut"
                        + fileNum.toString() + ".sol", data.toString().replace(
                            node.getSourceCode(), tmpNode), 'ascii');
                    fileNum++

                }
            }else{
                mutOperator = mutOperatorList;

                tmpNode = node.getSourceCode().replace(node.operator, mutOperator);


                console.log(mutOperator);

                fs.writeFileSync("./sol_output/" +  filename + '/'
                    + path.basename(file).slice(0, -4) + "UnaryMut" 
                    + fileNum.toString() + ".sol", data.toString().replace(
                        node.getSourceCode(), tmpNode), 'ascii');
                fileNum++

            }

        }

    });
}

