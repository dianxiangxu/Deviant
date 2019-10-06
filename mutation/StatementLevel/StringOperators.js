var fs = require('fs');
var solm = require('solmeister');
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
exports.mutateStringOperator = function(file){
    var ast;
    data = fs.readFileSync(file);	

    fileNum = 1;
    let mutCode = solm.edit(data.toString(), function(node) {
        if(node.type === 'StateVariableDeclaration' && node.literal == "string") {
            tmpNode = node.getSourceCode().replace(node.value, "");
            tmpNodeExtra = node.getSourceCode().replace(node.value, node.value + "EXTRA");			    

            //Writing to mutant file
            fs.writeFileSync("./sol_output/" 
                + path.basename(file).slice(0, -4) + "StringDelete" 
                + fileNum.toString() + ".sol", data.toString().replace(
                    node.getSourceCode(), tmpNode), 'ascii');
            fileNum++;

            fs.writeFileSync("./sol_output/"
                + path.basename(file).slice(0, -4) + "StringAdd"
                + fileNum.toString() + ".sol", data.troString().replace(
                    node.getSourceCode(), tmpNode), 'ascii');
            fileNum++;
        }

    });
}

