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



exports.mutateErrorHandleOperator = function(file, filename){
	var ast;
	fs.readFile(file, function(err, data) {	
		if(err) throw err;

		fileNum = 1;
		let mutCode = solm.edit(data.toString(), function(node) {
			if(node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression'
				&& (node.expression.callee.name === 'revert' || node.expression.callee.name == 'require'
				|| node.expression.callee.name == 'assert') 
			) {
					
				fs.writeFile("./sol_output/" + filename + '/'
                	+ path.basename(file).slice(0, -4) + "ErrorHandle"
                    + fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
                    ""), 'ascii', function(err) {
						if(err) throw err;
                    }
				);
                fileNum++;
			
			}else if(node.hasOwnProperty('parent') && node.parent != null
            	&& node.parent.hasOwnProperty('type')
                && node.parent.type === 'FunctionDeclaration'
                && node.type === 'BlockStatement')
            {
                var require_statement = 'require(false);}';
				var assert_statement = 'assert(false);}';
				var revert_statement = 'revert("this is a mutant");}';
                var pos = node.getSourceCode().lastIndexOf('}');

                fs.writeFile("./sol_output/" + filename + "/"
                    + path.basename(file).slice(0, -4) + "ErrorHandleReqInsert"
                    + fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(), 
                    node.getSourceCode().substring(0, pos) + require_statement)
                    + node.getSourceCode().substring(pos + 1), 'ascii', function(err) {
                        if(err) throw err;
                    }
                );
                fileNum++

				fs.writeFile("./sol_output/" + filename + "/"
                    + path.basename(file).slice(0, -4) + "ErrorHandleAssertInsert"
                    + fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
                    node.getSourceCode().substring(0, pos) + assert_statement)
                    + node.getSourceCode().substring(pos + 1), 'ascii', function(err) {
                        if(err) throw err;
                    }
                );
                fileNum++


				fs.writeFile("./sol_output/" + filename + "/"
                    + path.basename(file).slice(0, -4) + "ErrorHandleRevertInsert"
                    + fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
                    node.getSourceCode().substring(0, pos) + revert_statement)
                    + node.getSourceCode().substring(pos + 1), 'ascii', function(err) {
                        if(err) throw err;
                    }
                );
                fileNum++


            }


		});
		
	})
	
}

