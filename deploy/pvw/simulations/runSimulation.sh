#!/bin/bash

# -----------------------------------------------------------------------------
# User input
# -----------------------------------------------------------------------------
# Expected args:
#   $1      runId
#   $2      runLength
#   $3      runReset
#
#   $4      hLeft
#   $5      hRight
#
#   $6      wellFlux_01
#   $7      wellFlux_02
#   $8      wellFlux_03
#   $9      wellFlux_04
#   $10     wellFlux_05
#   $11     wellFlux_06
#   $12     wellFlux_07
#   $13     wellFlux_08
#   $14     wellFlux_09
#   $15     wellFlux_010
#   $16     wellFlux_011
# -----------------------------------------------------------------------------

runId=$1
runLength=$2
runReset=$3
hLeft=$4
hRight=$5
isLake=$6
wellFlux_01=$7
wellFlux_02=$8
wellFlux_03=$9
wellFlux_04=${10}
wellFlux_05=${11}
wellFlux_06=${12}
wellFlux_07=${13}
wellFlux_08=${14}
wellFlux_09=${15}
wellFlux_10=${16}
wellFlux_11=${17}

echo "runId $runId"
echo "runLength $runLength"
echo "runReset $runReset"
echo "hLeft $hLeft"
echo "hRight $hRight"
echo "isLake $isLake"
echo "wellFlux_1 $wellFlux_01"
echo "wellFlux_2 $wellFlux_02"
echo "wellFlux_3 $wellFlux_03"
echo "wellFlux_4 $wellFlux_04"
echo "wellFlux_5 $wellFlux_05"
echo "wellFlux_6 $wellFlux_06"
echo "wellFlux_7 $wellFlux_07"
echo "wellFlux_8 $wellFlux_08"
echo "wellFlux_9 $wellFlux_09"
echo "wellFlux_10 $wellFlux_10"
echo "wellFlux_11 $wellFlux_11"

# -----------------------------------------------------------------------------

mkdir -p "/pvw/simulations/runs/$runId"
cd "/pvw/simulations/runs/$runId"

# -----------------------------------------------------------------------------

if [ $runReset -eq 1 ]
then
  echo "Reseting to initial conditions"
  # cd "/pvw/simulations/runs"
  # rm -rf "/pvw/simulations/runs/$runId"
  # mkdir -p "/pvw/simulations/runs/$runId"
  # cd "/pvw/simulations/runs/$runId"
  # cp /pvw/simulations/template/* "/pvw/simulations/runs/$runId/"

  echo "Run Starting"
  tclsh run.tcl $runId 1 0 $runLength $hLeft $hRight $isLake $wellFlux_01 $wellFlux_02 $wellFlux_03 $wellFlux_04 $wellFlux_05 $wellFlux_06 $wellFlux_07 $wellFlux_08 $wellFlux_09 $wellFlux_10 $wellFlux_11
  echo "Run Complete"
else
  ls -lhrt *press*pfb > presslist.out
  last=$(tail -c10 presslist.out | cut -b -5| sed 's/^0*//')

  echo "Run Continuing from $last"
  tclsh run.tcl $runId 0 $last $runLength $hLeft $hRight $isLake $wellFlux_01 $wellFlux_02 $wellFlux_03 $wellFlux_04 $wellFlux_05 $wellFlux_06 $wellFlux_07 $wellFlux_08 $wellFlux_09 $wellFlux_10 $wellFlux_11
  echo "Run Complete"
fi

# Need to sleep in order to detect completion
sleep 1
