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

runId       = $1
runLength   = $2
runReset    = $3
hLeft       = $4
hRight      = $5
wellFlux_01 = $6
wellFlux_02 = $7
wellFlux_03 = $8
wellFlux_04 = $9
wellFlux_05 = $10
wellFlux_06 = $11
wellFlux_07 = $12
wellFlux_08 = $13
wellFlux_09 = $14
wellFlux_10 = $15
wellFlux_11 = $16

# -----------------------------------------------------------------------------

mkdir -p "/pvw/simulations/runs/$runId"
cd "/pvw/simulations/runs/$runId"

# -----------------------------------------------------------------------------

if [ $runReset -eq 1 ]
then
  echo "Reseting to initial conditions"
  cd "/pvw/simulations/runs"
  rm -rf "/pvw/simulations/runs/$runId"
  mkdir -p "/pvw/simulations/runs/$runId"
  cd "/pvw/simulations/runs/$runId"

  cp "../template/*" .

  echo "Run Starting"
  tclsh run.tcl $runId 1 0 $runLength $hLeft $hRight $wellFlux_01 $wellFlux_02 $wellFlux_03 $wellFlux_04 $wellFlux_05 $wellFlux_06 $wellFlux_07 $wellFlux_08 $wellFlux_09 $wellFlux_10 $wellFlux_11
  echo "Run Complete"
else
  ls -lhrt *press*pfb > presslist.out
  last=$(tail -c10 presslist.out | cut -b -5| sed 's/^0*//')

  echo "Run Continuing from $last"
  tclsh run.tcl $runId 0 $last $runLength $hLeft $hRight $wellFlux_01 $wellFlux_02 $wellFlux_03 $wellFlux_04 $wellFlux_05 $wellFlux_06 $wellFlux_07 $wellFlux_08 $wellFlux_09 $wellFlux_10 $wellFlux_11
  echo "Run Complete"
fi
