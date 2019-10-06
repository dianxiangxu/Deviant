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
exports.mutateEventOperator = function(file, filename){
	var ast;
	data = fs.readFileSync(file);
		var events = [];
			

		fileNum = 1;
		var modifier = null;

		//First run mutates and deletes events
		let mutCode = solm.edit(data.toString(), function(node) {

			//If contract has more than two calls to change addresses
			//to different contracts. Swap the calls.
			if(node.type === 'EmitStatement'){


				fs.writeFileSync("./sol_output/" + filename + "/"
				    + path.basename(file).slice(0, -4) + "EventDelMut"
				    + fileNum.toString() + ".sol", data.toString().replace(node.getSourceCode(),
				    ""), 'ascii');
				fileNum++;

				events.push(node.getSourceCode());
			}	
		});

		//Second round swaps event invocations
		mutCode = solm.edit(data.toString(), function(node) {
			if(node.type === 'EmitStatement'){
                for(i = 0; i < events.length; i ++) {
					if(node.getSourceCode().valueOf() != events[i].valueOf()) {
	                    fs.writeFileSync("./sol_output/" + filename + "/"
                            + path.basename(file).slice(0, -4) + "EventSwapMut"
                            + fileNum.toString() + ".sol", data.toString().replace(
                            node.getSourceCode(),events[i]), 'ascii');            		
						fileNum++;
					}
				}
            } 
		});
}

