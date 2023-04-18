#!/bin/bash
# usage: ./filter_pval_file.sh $bed_file $input_file output_file
set -x

bed_file=$1
input_file=$2
output_file=$3

# generate bed file from input file (requires at least CHR and BP columns)
awk 'NR==1 {for(i=1;i<=NF;i++){f[$i]=i}} NR>1 {print "chr"$f["CHR"]"\t"$f["BP"]-1"\t"$f["BP"]"\t"$0}' $input_file > $output_file.bed

# filter bed file
bedtools intersect -a $output_file.bed -b $bed_file > $output_file.filtered.bed

# generate output file from filtered bed file
awk 'NR==1 {gsub(/ +/, "\t"); print}' $input_file > $output_file
awk '{for(i=4;i<=NF;i++){printf "%s\t", $i}} {printf "\n"}' $output_file.filtered.bed >> $output_file
