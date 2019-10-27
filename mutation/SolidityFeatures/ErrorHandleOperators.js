//var parser = require("solidity-parser-antlr");
var fs = require('fs');
var solm = require('solmeister');
//var solp = require('solidity-parser');
var parser = require('solparse');
var path = require('path');

const REQUIRE_STATEMENT = "require(false);";
const ASSERT_STATEMENT = "assert(false);";
const REVERT_STATEMENT = "revert('this is a mutant');";

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
exports.mutateErrorHandleOperator = function(file, filename){
    var ast;
    data = fs.readFileSync(file);

    fileNum = 1;
    let mutCode = solm.edit(data.toString(), function(node) {
        if(node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression'
            && (node.expression.callee.name === 'revert' || node.expression.callee.name == 'require'
                || node.expression.callee.name == 'assert') 
        ) {

            fs.writeFileSync("./sol_output/" + filename + '/'
                + path.basename(file).slice(0, -4) + "ErrorHandleDeletion"
                + fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
                    ""), 'ascii');
            fileNum++;

        }else if(node.hasOwnProperty('parent') && node.parent != null
            && node.parent.hasOwnProperty('type')
            && node.parent.type === 'FunctionDeclaration'
            && node.type === 'BlockStatement')
        {
            var pos = node.getSourceCode().lastIndexOf('}');
            
            //Matching to a return statement
            isMatching = node.getSourceCode().match(/return\s*.*;/)
            if (isMatching){
                //Change the position of insertion in case the block has a return statement.
                pos = node.getSourceCode().lastIndexOf(isMatching[0])+isMatching[0].length;
            }

            fs.writeFileSync("./sol_output/" + filename + "/"
                + path.basename(file).slice(0, -4) + "ErrorHandleReqInsert"
                + fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(), 
                    node.getSourceCode().substring(0, pos) + REQUIRE_STATEMENT)
                + node.getSourceCode().substring(pos + 1), 'ascii');
            fileNum++

            fs.writeFileSync("./sol_output/" + filename + "/"
                + path.basename(file).slice(0, -4) + "ErrorHandleAssertInsert"
                + fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
                    node.getSourceCode().substring(0, pos) + ASSERT_STATEMENT)
                + node.getSourceCode().substring(pos + 1), 'ascii');
            fileNum++


            fs.writeFileSync("./sol_output/" + filename + "/"
                + path.basename(file).slice(0, -4) + "ErrorHandleRevertInsert"
                + fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
                    node.getSourceCode().substring(0, pos) + REVERT_STATEMENT)
                + node.getSourceCode().substring(pos + 1), 'ascii');
            fileNum++


        }


    });
}

