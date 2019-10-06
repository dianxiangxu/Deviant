/*This is currently not used, but will probably be used when refactoring*/

var fs = require('fs');

exports.generateMutant = function(file, filename, functionNames){
	if(!fs.existsSync('./sol_output/' + filename)){
		fs.mkdirSync('./sol_output/' + filename);
	}

    for(var i = 0; i < functionNames; i++) {
        window[functionNames[i]](file, filename);
    }
}

exports.genAST = function(file, filename) {
    bin = require('./StatementLevel/BinaryOperators.js');
    bin.mutateBinaryOperator(file, filename);
}

var address = require("./SolidityFeatures/AddressOperators.js");
var addressFunction = require("./SolidityFeatures/AddressFunctionOperators.js");
var error = require("./SolidityFeatures/ErrorHandleOperators.js");
var events = require("./SolidityFeatures/EventOperators.js");
var functionType = require("./SolidityFeatures/FunctionTypeOperators.js");
var functionVis = require("./SolidityFeatures/FunctionVisibilityOperators.js");
var gas = require("./SolidityFeatures/GasOperators.js");
var library = require("./SolidityFeatures/LibraryOperators.js");
var modifiable = require("./SolidityFeatures/ModifiableDataOperators.js");
var modifier = require("./SolidityFeatures/ModifierOperators.js");
var sd = require("./SolidityFeatures/SelfdestructOperators.js");
var sv = require("./SolidityFeatures/StateVariableOperators.js");
var mult = require("./SolidityFeatures/MultipleInheritanceOperators.js");
//Statement Level
var assign = require('./StatementLevel/AssignmentOperators.js');
var binary = require('./StatementLevel/BinaryOperators.js');
var boolOp = require('./StatementLevel/BooleanOperators.js');
var byteOp = require('./StatementLevel/ByteOperators.js');
var hexOp = require('./StatementLevel/HexadecimalOperators.js');
var intOp = require('./StatementLevel/IntegerOperators.js');
var strOp = require('./StatementLevel/StringOperators.js');
var unOp = require('./StatementLevel/UnaryOperators.js');
//Function Level
var block = require('./FunctionLevel/BlockModifierOperators.js');
var statement = require('./FunctionLevel/StatementModifierOperators.js');
//Contract Level
var over = require('./ContractLevel/OverridingOperators.js');
var superOp = require('./ContractLevel/SuperContractOperators.js');

exports.generateTraditionalMutants = function(file, filename) {

}

exports.generateSolidityMutants = function(file, filename) {

}

exports.generateMutants = function(file, filename) {
    generateTraditionalMutants(file, filename);
    generateSolidityMutants(file, filename);
}
