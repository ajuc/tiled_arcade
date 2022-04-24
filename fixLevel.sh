#!/bin/sh

TEMP="$1_temp_$(date)"
mv $1 "$TEMP"
cat levelHeader.txt "$TEMP" levelFooter.txt > $1

