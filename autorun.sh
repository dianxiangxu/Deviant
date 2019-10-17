var=`find $1/contracts/*/ -name *.sol`;
for tmp in $var
do
	node cli.js --file $tmp --project-directory $1 --operators SOLIDITY
done
