#usage: bash run.dhs.filter.on.magma.file.sh magma.file dhs.bed {inputFolder} {headerFile}

cat $4 > $1.header #creates header in file2
tail -n+2 $1 >> $1.header #removes header and adds to new file

tail -n+2 $1.header| awk '{print "chr"$1"\t"$3-1"\t"$3"\t"$0}' > $1.bed

bedtools intersect -a $1.bed -b $2 > results.filtered.bed

head -1 $1.header > filtered.for.magma.tsv 

awk '{print $4"\t"$5"\t"$6"\t"$7}' results.filtered.bed >> filtered.for.magma.tsv

mv results.filtered.bed $3
mv $1.bed $3
mv filtered.for.magma.tsv $3
