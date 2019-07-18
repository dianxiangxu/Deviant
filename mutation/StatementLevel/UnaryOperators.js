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



exports.mutateUnaryOperator = function(file, filename){
	var ast;
	fs.readFile(file, function(err, data) {	
		if(err) throw err;
		console.log("Unary Operators");


		fileNum = 1;
		let mutCode = solm.edit(data.toString(), function(node) {
			if(node.type === 'UnaryExpression' || node.type === 'UpdateExpression') {
				var mutOperator;
				mutOperatorList = operators[node.operator];
				if(typeof mutOperatorList !== 'string'){
					for(i = 0; i < mutOperatorList.length; i++) {
						tmpNode = node.getSourceCode().replace(node.operator, mutOperatorList[i]);
						

						fs.writeFile("./sol_output/" +  filename + '/'
						    + path.basename(file).slice(0, -4) + "UnaryMut"
						    + fileNum.toString() + ".sol", data.toString().replace(
                            node.getSourceCode(), tmpNode), 'ascii', function(err) {
							    if(err) throw err;
						    }
                        );
						fileNum++

					}
				}else{
					mutOperator = mutOperatorList;
				
					tmpNode = node.getSourceCode().replace(node.operator, mutOperator);


					console.log(mutOperator);

					fs.writeFile("./sol_output/" +  filename + '/'
					    + path.basename(file).slice(0, -4) + "UnaryMut" 
					    + fileNum.toString() + ".sol", data.toString().replace(
                        node.getSourceCode(), tmpNode), 'ascii', function(err) {
						    if(err) throw err;
					    }
                    );
					    fileNum++

				}
			
			}

		});
		
	})
	
}

