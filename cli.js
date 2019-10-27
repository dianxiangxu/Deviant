/*Simple CLI for Deviant*/

//Solidity
var address = require("./mutation/SolidityFeatures/AddressOperators.js");
var addressFunction = require("./mutation/SolidityFeatures/AddressFunctionOperators.js");
var error = require("./mutation/SolidityFeatures/ErrorHandleOperators.js");
var events = require("./mutation/SolidityFeatures/EventOperators.js");
var functionType = require("./mutation/SolidityFeatures/FunctionTypeOperators.js");
var functionVis = require("./mutation/SolidityFeatures/FunctionVisibilityOperators.js");
var gas = require("./mutation/SolidityFeatures/GasOperators.js");
var library = require("./mutation/SolidityFeatures/LibraryOperators.js");
var modifiable = require("./mutation/SolidityFeatures/ModifiableDataOperators.js");
var modifier = require("./mutation/SolidityFeatures/ModifierOperators.js");
var sd = require("./mutation/SolidityFeatures/SelfdestructOperators.js");
var sv = require("./mutation/SolidityFeatures/StateVariableOperators.js");
var multi = require("./mutation/SolidityFeatures/MultipleInheritanceOperators.js");

//Statement Level
var assign = require('./mutation/StatementLevel/AssignmentOperators.js');
var binary = require('./mutation/StatementLevel/BinaryOperators.js');
var boolOp = require('./mutation/StatementLevel/BooleanOperators.js');
var byteOp = require('./mutation/StatementLevel/ByteOperators.js');
var hexOp = require('./mutation/StatementLevel/HexadecimalOperators.js');
var intOp = require('./mutation/StatementLevel/IntegerOperators.js');
var strOp = require('./mutation/StatementLevel/StringOperators.js');
var unOp = require('./mutation/StatementLevel/UnaryOperators.js');

//Function Level
var block = require('./mutation/FunctionLevel/BlockModifierOperators.js');
var statement = require('./mutation/FunctionLevel/StatementModifierOperators.js');

//Contract Level
var over = require('./mutation/ContractLevel/OverridingOperators.js');
var superOp = require('./mutation/ContractLevel/SuperContractOperators.js');

//For running different experiments
var currTime = new Date();
var testExec = require('./test_execution/TestMutant.js')
const process = require('process');
const fs = require('fs');

//TODO: This mutant generation should go somewhere else
genSolidityMutants = function(file, filename_directory) {
    addressFunction.mutateAddressFunctionOperator(file, filename_directory);
    address.mutateAddressAll(file, filename_directory);
    error.mutateErrorHandleOperator(file, filename_directory);
    events.mutateEventOperator(file, filename_directory);
    functionType.mutateFunctionTypeOperator(file, filename_directory);
    functionVis.mutateFunctionVisibilityOperator(file, filename_directory);
    gas.mutateGasOperator(file, filename_directory);
    library.mutateLibraryOperator(file, filename_directory);
    modifiable.mutateDataLocationOperator(file, filename_directory);
    modifier.mutateModifierOperator(file, filename_directory);
    sd.mutateSelfdestructOperator(file, filename_directory);
    sv.mutateStateVarOperator(file, filename_directory);
    multi.mutateMultipleInheritanceOperator(file, filename_directory);
}

genTraditionalMutants = function(file, filename_directory) {
    over.mutateOverrideAll(file, filename_directory);
    superOp.mutateSuperTypeAll(file, filename_directory);
    block.mutateBlockOperator(file, filename_directory);
    statement.mutateStatementOperator(file, filename_directory);
    assign.mutateAssignmentOperator(file, filename_directory);   
    binary.mutateBinaryOperator(file, filename_directory);
    boolOp.mutateBooleanOperator(file, filename_directory);
    byteOp.mutateBytesOperator(file, filename_directory);
    hexOp.mutateHexadecimalOperator(file, filename_directory);
    intOp.mutateIntegerOperator(file, filename_directory);
    strOp.mutateStringOperator(file, filename_directory);
    unOp.mutateUnaryOperator(file, filename_directory);
}

genMutants = async function(file, project_directory, operator_flag) {
    filename_directory = mutant_output_directory + '/' + file.replace(/^.*[\\\/]/, '');
    filename_directory = filename_directory.replace('.sol', '');

    if(!fs.existsSync(filename_directory)){
        fs.mkdirSync(filename_directory);
    }

    filename_directory = filename_directory.replace('./sol_output/', '');
    
    if(operator_flag == 'ALL') {
        genSolidityMutants(file, filename_directory);
        genTraditionalMutants(file, filename_directory);
    }else if(operator_flag == "SOLIDITY") {
        genSolidityMutants(file, filename_directory);
    }else if(operator_flag == "TRADITIONAL") {
        genTraditionalMutants(file, filename_directory);
    }
}

runMutants = function(file, mutant_output_directory, project_directory, txt_report_directory) {
    console.log("Running");
    testExec.runMutants(mutant_output_directory, project_directory+'/contracts/', file, project_directory, txt_report_directory);
}

var filename_directory = ""
var f = "";
var operators = "SOLIDITY";
var is_default = true;
var project_directory = '';
var mutant_output_directory = '';
var txt_report_directory =  '';

//TODO: Come up with a way to mutate more
//than one file at a time
try{
    var fileList = []
    var isFileArg = false
    for(i = 2; i < process.argv.length; i++) {
        if(process.argv[i] == "--file"){
            f = process.argv[i+1];
            fileList[fileList.length] = f
            isFileArg = true;
        }else if(process.argv[i] == "--operators"){
            operators = process.argv[i+1];
            is_default = false;
            isFileArg = false;
        }else if(process.argv[i] == "--project-directory"){
            project_directory = process.argv[i+1];
            isFileArg = false;
        }else if (isFileArg){
            f = process.argv[i]
            fileList[fileList.length] = f
        }


    }

    if (is_default){console.log("Using default operator flag SOLIDITY");}
    if (project_directory == ""){throw "Project directory argument must be given!";}
    if (operators != "ALL" && operators != "TRADITIONAL" && operators != "SOLIDITY"){
        throw "Invalid operator argument!\n";
    }

    if(project_directory.lastIndexOf('/') == project_directory.length-1){
        project_directory = project_directory.substring(0, project_directory.length-1);
    }

    mutant_output_directory = './sol_output/'
        + project_directory.replace(/^.*[\\\/]/, '')
        + '-' + currTime + '/';
    txt_report_directory = './txt_reports/'
        + project_directory.replace(/^.*[\\\/]/, '')
        + '-' + currTime + '/';

    if(!fs.existsSync('./txt_reports/')){
        fs.mkdirSync('./txt_reports/');
    }
    if(!fs.existsSync('./sol_output/')) {
        fs.mkdirSync('./sol_output/');
    }
    if(!fs.existsSync(mutant_output_directory)){
        fs.mkdirSync(mutant_output_directory);
    }
    if(!fs.existsSync(txt_report_directory)){
        fs.mkdirSync(txt_report_directory);
    }

}catch(e) {
    console.log(e+'\n');
    console.log('Usage: node cli.js --file <file-to-mutate> --project-directory <directory> [--operators <operators>]');
    console.log('Currently acceptable arguments for operators:');
    console.log('\tALL');
    console.log('\tSOLIDITY');
    console.log('\tTRADITIONAL');
    process.exit(1);
}

for(var i = 0; i < fileList.length; i++)
    genMutants(fileList[i], project_directory, operators);

//console.log(f);
//console.log(mutant_output_directory);
//console.log(txt_report_directory);

for(var i = 0; i < fileList.length; i++)
    runMutants(fileList[i], './sol_output/'+filename_directory.replace('//', '/')+'/', project_directory, txt_report_directory);
