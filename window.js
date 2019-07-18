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


/*Requirements */
const electron = require('electron');
var fs = require('fs');
const url = require('url');
const path = require('path');
const child = require('child_process');
const mutation = require('./mutation/mutation');
var safeEval = require('safe-eval')

//Adding mutation functions to context for safeEval
var context = {
    address: require("./mutation/SolidityFeatures/AddressOperators.js"),
    addressFunction: require("./mutation/SolidityFeatures/AddressFunctionOperators.js"),
    error: require("./mutation/SolidityFeatures/ErrorHandleOperators.js"),
    events: require("./mutation/SolidityFeatures/EventOperators.js"),
    functionType: require("./mutation/SolidityFeatures/FunctionTypeOperators.js"),
    functionVis: require("./mutation/SolidityFeatures/FunctionVisibilityOperators.js"),
    gas: require("./mutation/SolidityFeatures/GasOperators.js"),
    library: require("./mutation/SolidityFeatures/LibraryOperators.js"),
    modifiable: require("./mutation/SolidityFeatures/ModifiableDataOperators.js"),
    modifier: require("./mutation/SolidityFeatures/ModifierOperators.js"),
    sd: require("./mutation/SolidityFeatures/SelfdestructOperators.js"),
    sv: require("./mutation/SolidityFeatures/StateVariableOperators.js"),

    //Statement Level
    assign: require('./mutation/StatementLevel/AssignmentOperators.js'),
    binary: require('./mutation/StatementLevel/BinaryOperators.js'),
    boolOp: require('./mutation/StatementLevel/BooleanOperators.js'),
    byteOp: require('./mutation/StatementLevel/ByteOperators.js'),
    hexOp: require('./mutation/StatementLevel/HexadecimalOperators.js'),
    intOp: require('./mutation/StatementLevel/IntegerOperators.js'),
    strOp: require('./mutation/StatementLevel/StringOperators.js'),

    //Function Level
    block: require('./mutation/FunctionLevel/BlockModifierOperators.js'),
    statement: require('./mutation/FunctionLevel/StatementModifierOperators.js'),

    //Contract Level
    over:require('./mutation/ContractLevel/OverridingOperators.js'),
    superOp: require('./mutation/ContractLevel/SuperContractOperators.js')

}

var project = '';
var projectDict;
var currTime = new Date();
var outputLoc;


const {app, BrowserWindow, Menu, ipcMain, remote} = electron;

var mutOpt;
let mainWindow;
let mutOpWindow;
let reportWindow;
let statusWindow;

// Listen for app
app.on('ready', function(){
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		resizable: true,
		"max-height": 2160,
		"max-width": 3840,
		title: 'Solidity Mutation'
	});
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, './content/html/main.html'),
		protocol: 'file:',
		slashes: true
	}));

	//Quitting the app when main window closed
	mainWindow.on('closed', function(){
		app.quit();
	});

	const mainMenu = Menu.buildFromTemplate(mainMenuTemp);
	Menu.setApplicationMenu(mainMenu);

	//mainWindow.webContents.openDevTools();
});

function createStatusWindow() {
    statusWindow = new BrowserWindow({
        width: 500,
        height: 500,
        title: 'Test Status'
    });

    statusWindow.loadURL(url.format({
        pathname: path.join(__dirname, './content/html/status.html'),
        protocol: 'file:',
        slashes: true
    }));

    statusWindow.on('close', function() {
        statusWindow = null;
    });

    statusWindow.webContents.openDevTools();
}

//Mutation Operator Window
function createMutOpWindow(){
	mutOpWindow = new BrowserWindow({
		width: 800,
		height: 600,
		title: 'Select Mutation Operators'
	});

	mutOpWindow.loadURL(url.format({
		pathname: path.join(__dirname, './content/html/mutOp.html'),
		protocol: 'file:',
		slashes: true
	}));

	//Garbage collection
	mutOpWindow.on('close', function(){
		mutOpWindow = null;
	});
	
	mutOpWindow.on('open', function() {
		console.log(mutOpt);
		mutOpWindow.webContents.send('pop-checkboxes', mutOpt);
	});

	//mutOpWindow.webContents.openDevTools();
}

//Report Window
function createReportWindow() {
    testTasks--;
    if(testTasks <= 0) {
        reportWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            title: 'Mutation Report'
        });

        reportWindow.loadURL(url.format({
            pathname: path.join(__dirname, './content/html/report.html'),
            protocol: 'file:',
            slashes: true
        }));

        reportWindow.on('close', function() {
            reportWindow = null;
        });
    }

    reportWindow.webContents.openDevTools();
}

const mainMenuTemp = [
{
	label: 'File',
	submenu:[{
		label: 'Quit',
		click(){
			app.quit();
		}
	}]
},
{
	label: 'Settings',
	submenu: [{
		label: 'Mutation Operators',
		click(){
			createMutOpWindow();
			mutOpWindow.webContents.send('pop-checkboxes', mutOpt);
		}
	}]
}
];

ipcMain.on('save:files', function(e, param) {
	
});

function dirExist (dirpath) {
  try {
    fs.mkdirSync(dirpath, function(err){
        if(err) console.log('error');
    });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

//Generating mutants based on selected files and selected operators
ipcMain.on('generateMutants', function(e, mutParam){
    var dir = mutParam[1]; //directory where file is located
    var files = mutParam[0]; //selected files

    //Generating mutants for each file and inserting into separate directories
    for(var i = 0; i < files.length; i++) {
        var file = files[i];
	    var filename = './sol_output/' + project.replace(/^.*[\\\/]/, '') + '-' + currTime;
	    //console.log(filename);
   
        outputLoc = filename; 

        filename = filename + '/' + file.replace(/^.*[\\\/]/, '');
        filename = filename.replace('.sol', '');

        //console.log(filename);   

        //creating directories for mutants
        try{
            dirExist(outputLoc);
            dirExist(filename);
            console.log('success');
        }catch(err){
            console.error(err); 
        }
        filename = filename.replace('./sol_output/', '') + '/';
        //Updating main page with status
        mainWindow.webContents.send('send:update', 'Generating Mutant: ' + filename);
        
        //Splitting each line based on ; delimiter
        mutOptList = mutOpt.split(';');
        context['file'] = file;
        context['filename'] = filename;
        console.log(mutOptList);
        //last statement is a blank string (skip it)
        for(var j = 0; j < mutOptList.length-1; j++) {
            evalStatement = mutOptList[j] + '(file, filename);';
            console.log(evalStatement);
            safeEval(evalStatement, context);
        }
    }
});

ipcMain.on('run:tests', function(e, mutParam){
		dir = mutParam[0];
		filenames = mutParam[1];

            testTasks = filenames.length;

            for(var i = 0; i < filenames.length; i++) {
                filename = filenames[i]
                dir = filename.match(/(.*)[\/\\]/)[1]||'' + '/';
                mutDir = outputLoc + '/' + filename.replace(/^.*[\\\/]/, '').replace('.sol', '') + '/';
                reportDir = './txt_reports/' + outputLoc.replace(/^.*[\\\/]/, '') + '/';
                execProj = project + '/';

                try{
                    dirExist (reportDir)
                }catch(e) {
                    console.log(e);
                }

                //console.log(mutDir);
                //console.log(dir);
                //console.log(filename);
                //console.log(execProj);
                //console.log(reportDir);
               
                createStatusWindow();    
                statusWindow.webContents.once('dom-ready', ()=>{
                    param = [mutDir, dir, filename, execProj, reportDir];
                    statusWindow.webContents.send('run:mutants', param);
                });
                

                
            }
	//createReportWindow();

});

ipcMain.on('get:statusUpdate', function(e, statusUpdate) {
	mainWindow.webContents.send('send:update', statusUpdate);
	if(statusUpdate.includes('Finished')) {
		createReportWindow();
	}
});

ipcMain.on('save:project', function(e, projPath) {
    project = projPath;
});

ipcMain.on('send:project', function(e) {
    if(project != '') { 
        reportWindow.webContents.send('get:project', project);
    }
});

ipcMain.on('send:projectDict', function(e) {
    if(projectDict != undefined) {
        reportWindow.webContents.send('get:projectDict', projectDict);
    }
});

ipcMain.on('save:projectDict', function(e, projectObj) {
    console.log(projectObj);
    projectDict = projectObj;
});

ipcMain.on('load:mutops', function(e) {
	console.log(mutOpt);
	mutOpWindow.webContents.send('pop-checkboxes', mutOpt);
});

ipcMain.on('op:select', function(e, mutParams){
	console.log("made it");
	mutOpt = mutParams;
	console.log(mutOpt);
	//mutOpWindow.webContents.send('pop-checkboxes', mutOpt);
});

ipcMain.on('send:outputLoc', function(e) {
    console.log('heeere' + outputLoc);
    reportWindow.webContents.send('get:outputLoc', outputLoc);
});

ipcMain.on('open:mut', function(e) {
    createMutOpWindow();
});

ipcMain.on('open:report', function(e) {
    createReportWindow();
});

function printStats() {
	console.log('live mutants: ' + live);
	console.log('killed mutants: ' + killed);
}
