#usage: bash run.dhs.filter.on.magma.file.sh magma.file dhs.bed

tail -n+2 $1| awk '{print "chr"$1"\t"$3-1"\t"$3"\t"$0}' > $1.bed

bedtools intersect -a $1.bed -b ~/Downloads/roadmap.dhs.files/$2 > $1.filtered.bed

head -1 $1 > filtered.for.magma.tsv 

awk '{print $4"\t"$5"\t"$6"\t"$7}' $1.filtered.bed >> filtered.for.magma.tsv


mkdir $1.intermediate.files

mv $1.bed $1.intermediate.files
mv filtered.for.magma.tsv $1.intermediate.files