var path = require('path');
var fs = require('fs');
var dirpath = path.join(__dirname, '/path');

function wipeList(divId){
    document.getElementById(divId).innerHTML = "";
}

function listFiles(divId, directory, is_mutant) {
	//console.log(directory);
    //console.log(typeof directory);


    var files = fs.readdirSync(directory);

		for (let file of files) {

			if(fs.statSync(path.join(directory, file)).isDirectory()) {
				
				listFiles(divId, path.join(directory, file), is_mutant);

			}else if (file.split('.').pop() === 'sol' && !directory.includes("node_modules")
                && !directory.includes('sol_output') && !is_mutant    
            ){

				document.getElementById(divId).innerHTML +=
                    '<option name = "'+file+'" value="' + 
                    directory  + '/' + file + '">' + 
                file +  '</option>';
			
			}else if(file.split('.').pop() === 'sol' && !directory.includes("node_modules")
                && directory.includes('sol_output')  
            ){
                document.getElementById(divId).innerHTML += 
                    '<option name = "'+file+'" value="' +  
                    directory  + '/' + file + '">' + 
                file +  '</option>';

            }
		}
}
