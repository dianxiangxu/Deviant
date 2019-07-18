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



exports.mutateAssignmentOperator = function(file, filename){
//	console.log("Binary Operators Found");
	var ast;
	fs.readFile(file, function(err, data) {	
		if(err) throw err;

		fileNum = 1;
		let mutCode = solm.edit(data.toString(), function(node) {
			if(fileNum == 1) {
				fs.writeFile("ast_example", node.toString(), 'ascii', function(err){
					if(err) throw err;
				});
			}
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

					fs.writeFile("./sol_output/" + filename + '/'
						+ path.basename(file).slice(0, -4) + "AssignmentMut" 
						+ fileNum.toString() + ".sol", data.toString().replace(
						node.getSourceCode(), tmpNode), 'ascii', function(err) {
							if(err) throw err;
					});
					
					fileNum++
				}
			
			}

		});
		
	})
	
}

