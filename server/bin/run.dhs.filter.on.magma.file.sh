#usage: bash run.dhs.filter.on.magma.file.sh magma.file dhs.bed {inputFolder}

tail -n+2 $1| awk '{print "chr"$1"\t"$3-1"\t"$3"\t"$0}' > $1.bed

bedtools intersect -a $1.bed -b $2 > results.filtered.bed

head -1 $1 > filtered.for.magma.tsv 

awk '{print $4"\t"$5"\t"$6"\t"$7}' results.filtered.bed >> filtered.for.magma.tsv

mv results.filtered.bed $3
mv $1.bed $3
mv filtered.for.magma.tsv $3
