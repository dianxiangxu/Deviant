if [ ! -f "log" ]; then
	touch log
else
	mv log old_log
fi

if [ ! -f "final_report" ]; then
	touch final_report
else
	mv final_report old_report
fi

grep -E 'Live|Killed|Total' txt_reports/*/*.txt >> log;

i=0
live=0
killed=0
total=0

while read line
do
	if [ $i -eq 0 ];then
		echo $line| awk '{print $9}' | sed -r 's/.*\/(.*)\..*/\1/' >> final_report
		tmp=`echo $line| awk '{print $10}'`
		echo "Live:" $tmp >> final_report
		live=$(expr $tmp + $live)
	fi

	if [ $i -eq 1 ];then
		tmp=`echo $line| awk '{print $10}'`
		echo "Killed:" $tmp >> final_report
		killed=$(expr $tmp + $killed)
	fi

	if [ $i -eq 2 ];then
		tmp=`echo $line| awk '{print $10}'`
		echo "Total:" $tmp >> final_report
		total=$(expr $tmp + $total)
	fi

	i=$(expr $i + 1)
	i=$(expr $i % 3)
done < log

echo "====================" >> final_report
echo "Final Live : " $live >> final_report
echo "Final Killed : " $killed >> final_report
echo "Final Total : " $total >> final_report;
