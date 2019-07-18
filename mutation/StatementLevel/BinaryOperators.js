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
	fs.readFile(file, function(err, data) {	
		if(err) throw err;
		console.log("Binary Operators");

	ast = parser.parse(data.toString());
	//fs.writeFile('./ast', JSON.stringify(ast, null, 2));
    console.log(filename);
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
						fs.writeFile("./sol_output/" + filename + "/"
						+ path.basename(file).slice(0, -4) + "BinMut"
						+ fileNum.toString() + ".sol", 
						data.toString().replace(node.getSourceCode(),
						tmpNode), 'ascii', function(err) {
							if(err) console.log(err);;
						});
						fileNum++
					}
				}else{
					mutOperator = mutOperatorList;
					tmpNode = node.getSourceCode().replace(node.operator, mutOperator);

					fs.writeFile("./sol_output/" + filename + "/"
                        + path.basename(file).slice(0, -4) + "BinMut"
                        + fileNum.toString() + ".sol",
                        data.toString().replace(node.getSourceCode(),
                        tmpNode), 'ascii', function(err) {
                            if(err) console.log(err);
                    });
                    fileNum++
				}
			}

		});
	})
	
}

