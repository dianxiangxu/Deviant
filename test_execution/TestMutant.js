const fs = require('fs');
const exec = require('child_process').execSync;
const electron = require('electron');
const {ipcRenderer} = electron;

exports.runMutants = function(mutantDirectory, contractDirectory, contractFile, 
                              sourceProject, reportDirectory, reportWindow
){
	var killed = 0;
	var live = 0;
	var total_mutants = 0;
	var contractName = contractFile.replace(/^.*[\\\/]/, '');

	fs.renameSync(contractFile, contractFile + '.tmp');

	fs.readdirSync(mutantDirectory).forEach(function(file) {
		var filename = file;
		file = mutantDirectory + file;
		console.log('Now testing: ' + file);
        console.log('Replacing: ' + contractFile);
		fs.copyFile(file, contractFile, function(err) {
            if(err) console.log('ERROR: ' + err);
        });
        
        if(ipcRenderer != undefined){
            ipcRenderer.send(
                'get:statusUpdate', 
                `Status: Testing  ${filename} &emsp; Total: ${total_mutants} `
                    + `&emsp; Total: ${total_mutants} Killed: ${killed} `
                    + `Live: ${live}`
            );
        }

		let child;
		try{
			command = `cd "${sourceProject}" && npm test`;
			child = exec(
				command, 
				{encoding: 'utf8', maxBuffer: 50 * 1024 * 1024}
			).toString();
				
			console.log(child);
            
            //If any number of tests are failing
            if(child.match(/[0-9]*\s*failing/)) {
                killed++
                total_mutants++;
                console.log('Mutant killed: ' + file);
                
				fs.appendFileSync(
                    `${reportDirectory}${contractName}MutationReport.txt`,
                    `${filename}\t killed\n`
                );

            //Else no tests failing
            }else if(child.match(/[0-9]*\s*passing/)){
				live++;
				total_mutants++;
				console.log(`Mutant live: ${file}`);
				fs.appendFileSync(
                    `${reportDirectory}${contractName}MutationReport.txt`,
                    `${filename}\t live\n`
                );
			
            //In case the compilation failied/syntax error
            }else if(child.match(/Compilation\s*failed/) || child.match(/Syntax\s*Error/)){
                console.log('Mutant not valid: ' + file);
                fs.unlinkSync(file);
            }
			fs.unlinkSync(contractFile);
			
			
		}catch(err){
			if(err.hasOwnProperty('stdout')){
                console.log(err.stdout.toString());
            }else{
                console.log(err);
            }	
			
            if(err.stdout.toString().match(/[0-9]*\s*failing/)){
				killed++;
                total_mutants++;
				console.log(`Mutant killed: ${file}`);
                fs.appendFileSync(
                    `${reportDirectory}${contractName}MutationReport.txt`,
                    `${filename}\t killed\n`
                );
			}else if(err.stdout.toString().match(/Compilation\s*failed/)
                //Solc or truffle contains a misspelling...
                || err.stdout.toString().match(/Compiliation\s*failed/)
                || err.stdout.toString().match(/Syntax\s*Error/)
            ){
				console.log(`Mutant not valid: ${file}`);
				fs.unlinkSync(file);
			}
			fs.unlinkSync(contractFile);
		}
	});

    if(ipcRenderer != undefined) {
        ipcRenderer.send(
            'get:statusUpdate', 
            'Status: Finished testing... View report for details.'
        );
    }
    fs.appendFileSync(
        `${reportDirectory}${contractName}MutationReport.txt`, 
        `Live: ${live}\n`
    );
	fs.appendFileSync(
        `${reportDirectory}${contractName}MutationReport.txt`, 
        `Killed: ${killed}\n`
    );
	fs.appendFileSync(
        `${reportDirectory}${contractName}MutationReport.txt`, 
        `Total: ${total_mutants}\n`
    );
	fs.appendFileSync(
        `${reportDirectory}${contractName}MutationReport.txt`, 
        `Mutation Score: ${killed/total_mutants}\n`
    );

	fs.rename(`${contractFile}.tmp`, contractFile, function(err) {
		if (err) {
			console.log(`ERROR: ${err}`);
			console.log('Original contract NOT restored!');
		}
	});

}

copyFile = function(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
     console.log(err);
      cbCalled = true;
    }
  }
}
