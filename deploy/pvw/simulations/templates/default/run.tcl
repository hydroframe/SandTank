# -----------------------------------------------------------------------------
# Script for the intial conditions of the replica sandtank model
# Import PF TCL package
# -----------------------------------------------------------------------------

lappend     auto_path $env(PARFLOW_DIR)/bin
package     require parflow
namespace   import Parflow::*

pfset FileVersion           4

# -----------------------------------------------------------------------------
# Set Processor topology
# -----------------------------------------------------------------------------

pfset Process.Topology.P    1
pfset Process.Topology.Q    1
pfset Process.Topology.R    1

# -----------------------------------------------------------------------------
# Read configuration
# -----------------------------------------------------------------------------

set runname    [lindex $argv 0]

source "./config.tcl"

puts "-------------------------------------------"
puts "Loading configuration for $runname"
puts "-------------------------------------------"
puts "reset:        $reset"
puts ""
puts "StartNumber:  $StartNumber"
puts "RunLength:    $RunLength"
puts ""
puts "hleft:        $hleft"
puts "hright:       $hright"
puts ""
puts "lake:         $lake"
puts ""
puts "k_1:         $k_1"
puts "k_2:         $k_2"
puts "k_3:         $k_3"
puts "k_4:         $k_4"
puts ""
puts "well_1_action:        $well_1_action"
puts "well_1_value:         $well_1_value"
puts ""
puts "well_2_action:        $well_2_action"
puts "well_2_value:         $well_2_value"
puts ""
puts "well_3_action:        $well_3_action"
puts "well_3_value:         $well_3_value"
puts ""
puts "well_4_action:        $well_4_action"
puts "well_4_value:         $well_4_value"
puts ""
puts "well_5_action:        $well_5_action"
puts "well_5_value:         $well_5_value"
puts ""
puts "well_6_action:        $well_6_action"
puts "well_6_value:         $well_6_value"
puts ""
puts "well_7_action:        $well_7_action"
puts "well_7_value:         $well_7_value"
puts ""
puts "well_8_action:        $well_8_action"
puts "well_8_value:         $well_8_value"
puts ""
puts "well_9_action:        $well_9_action"
puts "well_9_value:         $well_9_value"
puts ""
puts "well_10_action:       $well_10_action"
puts "well_10_value:        $well_10_value"
puts ""
puts "well_11_action:       $well_11_action"
puts "well_11_value:        $well_11_value"
puts "-------------------------------------------"

# -----------------------------------------------------------------------------
# Computational Grid
# sandtank actual demensions are 30cm by 15cm
# -----------------------------------------------------------------------------

pfset ComputationalGrid.Lower.X           0.0
pfset ComputationalGrid.Lower.Y           0.0
pfset ComputationalGrid.Lower.Z           0.0

pfset ComputationalGrid.DX                1.0
pfset ComputationalGrid.DY                1.0
pfset ComputationalGrid.DZ                1.0

pfset ComputationalGrid.NX                100
pfset ComputationalGrid.NY                1
pfset ComputationalGrid.NZ                50

# -----------------------------------------------------------------------------
# Domain Geometry Input
# -----------------------------------------------------------------------------

pfset Domain.GeomName                     domain

# -----------------------------------------------------------------------------
# Names of the GeomInputs
# -----------------------------------------------------------------------------

pfset GeomInput.Names                     "solidinput indi_input"

pfset GeomInput.solidinput.InputType      SolidFile
pfset GeomInput.solidinput.GeomNames      domain
pfset GeomInput.solidinput.FileName       SandTank.pfsol

pfset Geom.domain.Patches                 "z-upper z-lower x-lower x-upper y-lower y-upper"

# -----------------------------------------------------------------------------
# Domain Geometry
# -----------------------------------------------------------------------------

pfset Geom.domain.Lower.X                 0.0
pfset Geom.domain.Lower.Y                 0.0
pfset Geom.domain.Lower.Z                 0.0

pfset Geom.domain.Upper.X                 100.0
pfset Geom.domain.Upper.Y                 1.0
pfset Geom.domain.Upper.Z                 50.0

# -----------------------------------------------------------------------------
# Indicator Geometry Input
# -----------------------------------------------------------------------------

# will be set once the indi file in created
pfset GeomInput.indi_input.InputType      IndicatorField
pfset GeomInput.indi_input.GeomNames      "s1 s2 s3 s4"
pfset Geom.indi_input.FileName            SandTank_Indicator.pfb

# s1: gravel, s2: fine sand, s3: coarse sand, s4: clay
pfset GeomInput.s1.Value                  1
pfset GeomInput.s2.Value                  2
pfset GeomInput.s3.Value                  3
pfset GeomInput.s4.Value                  4

# -----------------------------------------------------------------------------
# Permeability (values in cm/s)
# -----------------------------------------------------------------------------

pfset Geom.Perm.Names                     "s1 s2 s3 s4"

pfset Geom.s1.Perm.Type                   Constant
pfset Geom.s1.Perm.Value                  $k_1

pfset Geom.s2.Perm.Type                   Constant
pfset Geom.s2.Perm.Value                  $k_2

pfset Geom.s3.Perm.Type                   Constant
pfset Geom.s3.Perm.Value                  $k_3

pfset Geom.s4.Perm.Type                   Constant
pfset Geom.s4.Perm.Value                  $k_4

pfset Perm.TensorType                     TensorByGeom
pfset Geom.Perm.TensorByGeom.Names        "domain"
pfset Geom.domain.Perm.TensorValX         1.0d0
pfset Geom.domain.Perm.TensorValY         1.0d0
pfset Geom.domain.Perm.TensorValZ         1.0d0

# -----------------------------------------------------------------------------
# Specific Storage
# -----------------------------------------------------------------------------

pfset SpecificStorage.Type                Constant
pfset SpecificStorage.GeomNames           "domain"
pfset Geom.domain.SpecificStorage.Value   1.0e-5

# -----------------------------------------------------------------------------
# Phases
# -----------------------------------------------------------------------------

pfset Phase.Names                         "water"
pfset Phase.water.Density.Type            Constant
pfset Phase.water.Density.Value           1.0
pfset Phase.water.Viscosity.Type          Constant
pfset Phase.water.Viscosity.Value         1.0

# -----------------------------------------------------------------------------
# Contaminants
# -----------------------------------------------------------------------------

pfset Contaminants.Names                  ""

# -----------------------------------------------------------------------------
# Gravity
# -----------------------------------------------------------------------------

pfset Gravity                             1.0

# -----------------------------------------------------------------------------
# Timing (time units is set by units of permeability)
# -----------------------------------------------------------------------------

pfset TimingInfo.BaseUnit                 1.0
pfset TimingInfo.DumpInterval             -1

pfset TimingInfo.StartCount               $StartNumber
pfset TimingInfo.StartTime                0.0
pfset TimingInfo.StopTime                 $RunLength

pfset TimeStep.Type                       Constant
pfset TimeStep.Value                      1.0

# -----------------------------------------------------------------------------
# Porosity
# -----------------------------------------------------------------------------

pfset Geom.Porosity.GeomNames             "domain s1 s2 s3 s4"

pfset Geom.domain.Porosity.Type           Constant
pfset Geom.domain.Porosity.Value          0.4

pfset Geom.s1.Porosity.Type               Constant
pfset Geom.s1.Porosity.Value              0.4

pfset Geom.s2.Porosity.Type               Constant
pfset Geom.s2.Porosity.Value              0.25

pfset Geom.s3.Porosity.Type               Constant
pfset Geom.s3.Porosity.Value              0.3

pfset Geom.s4.Porosity.Type               Constant
pfset Geom.s4.Porosity.Value              0.35

# -----------------------------------------------------------------------------
# Domain
# -----------------------------------------------------------------------------

pfset Domain.GeomName                     "domain"

# ----------------------------------------------------------------------------
# Mobility
# ----------------------------------------------------------------------------

pfset Phase.water.Mobility.Type           Constant
pfset Phase.water.Mobility.Value          1.0

# -----------------------------------------------------------------------------
# Relative Permeability
# -----------------------------------------------------------------------------

pfset Phase.RelPerm.Type                  VanGenuchten
pfset Phase.RelPerm.GeomNames             "domain"

pfset Geom.domain.RelPerm.Alpha           2.0
pfset Geom.domain.RelPerm.N               3.0

# -----------------------------------------------------------------------------
# Saturation
# -----------------------------------------------------------------------------

pfset Phase.Saturation.Type               VanGenuchten
pfset Phase.Saturation.GeomNames          "domain"

pfset Geom.domain.Saturation.Alpha        2.0
pfset Geom.domain.Saturation.N            3.0
pfset Geom.domain.Saturation.SRes         0.2
pfset Geom.domain.Saturation.SSat         1.0

#-----------------------------------------------------------------------------
# Contaminants
#-----------------------------------------------------------------------------
#pfset Contaminants.Names      "dye"
#pfset Contaminants.dye.Degradation.Value   0.0

# -----------------------------------------------------------------------------
# Wells
# -----------------------------------------------------------------------------

pfset Wells.Names                         "w1 w2 w3 w4 w5 w6 w7 w8 w9 w10 w11"
# pfset Wells.Names                       ""

# -----------------------------------------------------------------------------

pfset Wells.w1.InputType                          Vertical
pfset Wells.w1.Type                               Flux
pfset Wells.w1.X                                  11.5
pfset Wells.w1.Y                                  0.5
pfset Wells.w1.ZUpper                             15.9
pfset Wells.w1.ZLower                             15.1
pfset Wells.w1.Cycle                              constant
pfset Wells.w1.alltime.Saturation.water.Value     1.0
pfset Wells.w1.Method                             Standard

pfset Wells.w1.Action                             $well_1_action
pfset Wells.w1.alltime.Flux.water.Value           $well_1_value

# -----------------------------------------------------------------------------

pfset Wells.w2.InputType                          Vertical
pfset Wells.w2.Type                               Flux
pfset Wells.w2.X                                  23.5
pfset Wells.w2.Y                                  0.5
pfset Wells.w2.ZUpper                             1.9
pfset Wells.w2.ZLower                             1.1
pfset Wells.w2.Cycle                              constant
pfset Wells.w2.alltime.Saturation.water.Value     1.0
pfset Wells.w2.Method                             Standard

pfset Wells.w2.Action                             $well_2_action
pfset Wells.w2.alltime.Flux.water.Value           $well_2_value

# -----------------------------------------------------------------------------

pfset Wells.w3.InputType                          Vertical
pfset Wells.w3.Type                               Flux
pfset Wells.w3.X                                  26.5
pfset Wells.w3.Y                                  0.5
pfset Wells.w3.ZUpper                             15.9
pfset Wells.w3.ZLower                             15.1
pfset Wells.w3.Cycle                              constant
pfset Wells.w3.alltime.Saturation.water.Value     1.0
pfset Wells.w3.Method                             Standard

pfset Wells.w3.Action                             $well_3_action
pfset Wells.w3.alltime.Flux.water.Value           $well_3_value

# -----------------------------------------------------------------------------

pfset Wells.w4.InputType                          Vertical
pfset Wells.w4.Type                               Flux
pfset Wells.w4.X                                  29.5
pfset Wells.w4.Y                                  0.5
pfset Wells.w4.ZUpper                             27.9
pfset Wells.w4.ZLower                             27.1
pfset Wells.w4.Cycle                              constant
pfset Wells.w4.alltime.Saturation.water.Value     1.0
pfset Wells.w4.Method                             Standard

pfset Wells.w4.Action                             $well_4_action
pfset Wells.w4.alltime.Flux.water.Value           $well_4_value

# -----------------------------------------------------------------------------

pfset Wells.w5.InputType                          Vertical
pfset Wells.w5.Type                               Flux
pfset Wells.w5.X                                  48.5
pfset Wells.w5.Y                                  0.5
pfset Wells.w5.ZUpper                             1.9
pfset Wells.w5.ZLower                             1.1
pfset Wells.w5.Cycle                              constant
pfset Wells.w5.alltime.Saturation.water.Value     1.0
pfset Wells.w5.Method                             Standard

pfset Wells.w5.Action                             $well_5_action
pfset Wells.w5.alltime.Flux.water.Value           $well_5_value

# -----------------------------------------------------------------------------

pfset Wells.w6.InputType                          Vertical
pfset Wells.w6.Type                               Flux
pfset Wells.w6.X                                  51.5
pfset Wells.w6.Y                                  0.5
pfset Wells.w6.ZUpper                             13.9
pfset Wells.w6.ZLower                             13.1
pfset Wells.w6.Cycle                              constant
pfset Wells.w6.alltime.Saturation.water.Value     1.0
pfset Wells.w6.Method                             Standard

pfset Wells.w6.Action                             $well_6_action
pfset Wells.w6.alltime.Flux.water.Value           $well_6_value

# -----------------------------------------------------------------------------

pfset Wells.w7.InputType                          Vertical
pfset Wells.w7.Type                               Flux
pfset Wells.w7.X                                  54.5
pfset Wells.w7.Y                                  0.5
pfset Wells.w7.ZUpper                             15.9
pfset Wells.w7.ZLower                             15.1
pfset Wells.w7.Cycle                              constant
pfset Wells.w7.alltime.Saturation.water.Value     1.0
pfset Wells.w7.Method                             Standard

pfset Wells.w7.Action                             $well_7_action
pfset Wells.w7.alltime.Flux.water.Value           $well_7_value

# -----------------------------------------------------------------------------

pfset Wells.w8.InputType                          Vertical
pfset Wells.w8.Type                               Flux
pfset Wells.w8.X                                  57.5
pfset Wells.w8.Y                                  0.5
pfset Wells.w8.ZUpper                             1.9
pfset Wells.w8.ZLower                             1.1
pfset Wells.w8.Cycle                              constant
pfset Wells.w8.alltime.Saturation.water.Value     1.0
pfset Wells.w8.Method                             Standard

pfset Wells.w8.Action                             $well_8_action
pfset Wells.w8.alltime.Flux.water.Value           $well_8_value

# -----------------------------------------------------------------------------

pfset Wells.w9.InputType                          Vertical
pfset Wells.w9.Type                               Flux
pfset Wells.w9.X                                  82.5
pfset Wells.w9.Y                                  0.5
pfset Wells.w9.ZUpper                             1.9
pfset Wells.w9.ZLower                             1.1
pfset Wells.w9.Cycle                              constant
pfset Wells.w9.alltime.Saturation.water.Value     1.0
pfset Wells.w9.Method                             Standard

pfset Wells.w9.Action                            $well_9_action
pfset Wells.w9.alltime.Flux.water.Value          $well_9_value

# -----------------------------------------------------------------------------

pfset Wells.w10.InputType                         Vertical
pfset Wells.w10.Type                              Flux
pfset Wells.w10.X                                 87.5
pfset Wells.w10.Y                                 0.5
pfset Wells.w10.ZUpper                            14.9
pfset Wells.w10.ZLower                            14.1
pfset Wells.w10.Cycle                             constant
pfset Wells.w10.alltime.Saturation.water.Value    1.0
pfset Wells.w10.Method                            Standard

pfset Wells.w10.Action                            $well_10_action
pfset Wells.w10.alltime.Flux.water.Value          $well_10_value

# -----------------------------------------------------------------------------

pfset Wells.w11.InputType                         Vertical
pfset Wells.w11.Type                              Flux
pfset Wells.w11.X                                 92.5
pfset Wells.w11.Y                                 0.5
pfset Wells.w11.ZUpper                            26.9
pfset Wells.w11.ZLower                            26.1
pfset Wells.w11.Cycle                             constant
pfset Wells.w11.alltime.Saturation.water.Value    1.0
pfset Wells.w11.Method                            Standard

pfset Wells.w11.Action                            $well_11_action
pfset Wells.w11.alltime.Flux.water.Value          $well_11_value

# -----------------------------------------------------------------------------
# EcoSlim input generation (well.sa)
# -----------------------------------------------------------------------------

# make a flux file based on the action type of each well
set fileId [open well.sa w]
puts $fileId "100 1 50"

# convert from m / h of well pumping or injection to flux 1/t units by dividing by dz
for { set kk 0 } { $kk < 50 } { incr kk } {
  for { set jj 0 } { $jj < 1 } { incr jj } {
    for { set ii 0 } { $ii < 100 } { incr ii } {
      if { ($kk == 1) && ($ii == 23) } {
        if { $well_2_action == "Injection" } {
          puts $fileId $well_2_value
        } else {
          puts $fileId [expr (-1.0 * $well_2_value)]
        }
      }  elseif { ($kk == 15) && ($ii == 11) } {
        if { $well_1_action == "Injection" } {
          puts $fileId $well_1_value
        } else {
          puts $fileId [expr (-1.0 * $well_1_value)]
        }
      } elseif { ($kk == 15) && ($ii == 26) } {
        if { $well_3_action == "Injection" } {
          puts $fileId $well_3_value
        } else {
          puts $fileId [expr (-1.0 * $well_3_value)]
        }
      } elseif { ($kk == 27) && ($ii == 29) } {
        if { $well_4_action == "Injection" } {
          puts $fileId $well_4_value
        } else {
          puts $fileId [expr (-1.0 * $well_4_value)]
        }
      } elseif { ($kk == 1) && ($ii == 48) } {
        if { $well_5_action == "Injection" } {
          puts $fileId $well_5_value
        } else {
          puts $fileId [expr (-1.0 * $well_5_value)]
        }
      } elseif { ($kk == 13) && ($ii == 51) } {
        if { $well_6_action == "Injection" } {
          puts $fileId $well_6_value
        } else {
          puts $fileId [expr (-1.0 * $well_6_value)]
        }
      } elseif { ($kk == 15) && ($ii == 54) } {
        if { $well_7_action == "Injection" } {
          puts $fileId $well_7_value
        } else {
          puts $fileId [expr (-1.0 * $well_7_value)]
        }
      } elseif { ($kk == 1) && ($ii == 57) } {
        if { $well_8_action == "Injection" } {
          puts $fileId $well_8_value
        } else {
          puts $fileId [expr (-1.0 * $well_8_value)]
        }
      } elseif { ($kk == 1) && ($ii == 82) } {
        if { $well_9_action == "Injection" } {
          puts $fileId $well_9_value
        } else {
          puts $fileId [expr (-1.0 * $well_9_value)]
        }
      } elseif { ($kk == 14) && ($ii == 87) } {
        if { $well_10_action == "Injection" } {
          puts $fileId $well_10_value
        } else {
          puts $fileId [expr (-1.0 * $well_10_value)]
        }
      } elseif { ($kk == 26) && ($ii == 92) } {
        if { $well_11_action == "Injection" } {
          puts $fileId $well_11_value
        } else {
          puts $fileId [expr (-1.0 * $well_11_value)]
        }
      } else {
        # zero flux non well locations
        puts $fileId "0.0"
      }
    }
  }
}

close $fileId

set wellflux         [pfload -sa well.sa]
pfsetgrid {100 1 50} {0.0 0.0 0.0} {1.0 1.0 1.0} $wellflux
pfsave $wellflux -pfb well_forcing.pfb

# make this the from to for the run
# copy the well_forcing file to the run name file over these timesteps

for { set itime $StartNumber } { $itime <= [expr ($StartNumber + $RunLength ) ] } { incr itime } {
  set pump_name [format "./$runname.out.evaptrans.%05d.pfb" $itime]
  file copy -force well_forcing.pfb $pump_name
}

# -----------------------------------------------------------------------------
# Time Cycles
# -----------------------------------------------------------------------------

pfset Cycle.Names                                 "constant"
pfset Cycle.constant.Names                        "alltime"
pfset Cycle.constant.alltime.Length               1
pfset Cycle.constant.Repeat                       -1

# -----------------------------------------------------------------------------
# Boundary Conditions
# -----------------------------------------------------------------------------

pfset BCPressure.PatchNames                       [pfget Geom.domain.Patches]

pfset Patch.x-lower.BCPressure.Type               DirEquilRefPatch
pfset Patch.x-lower.BCPressure.Cycle              constant
pfset Patch.x-lower.BCPressure.RefGeom            domain
pfset Patch.x-lower.BCPressure.RefPatch           z-lower
pfset Patch.x-lower.BCPressure.alltime.Value      $hleft

pfset Patch.y-lower.BCPressure.Type               FluxConst
pfset Patch.y-lower.BCPressure.Cycle              constant
pfset Patch.y-lower.BCPressure.alltime.Value      0.0

pfset Patch.z-lower.BCPressure.Type               FluxConst
pfset Patch.z-lower.BCPressure.Cycle              constant
pfset Patch.z-lower.BCPressure.alltime.Value      0.0

pfset Patch.x-upper.BCPressure.Type               DirEquilRefPatch
pfset Patch.x-upper.BCPressure.Cycle              constant
pfset Patch.x-upper.BCPressure.RefGeom            domain
pfset Patch.x-upper.BCPressure.RefPatch           z-lower
pfset Patch.x-upper.BCPressure.alltime.Value      $hright

pfset Patch.y-upper.BCPressure.Type               FluxConst
pfset Patch.y-upper.BCPressure.Cycle              constant
pfset Patch.y-upper.BCPressure.alltime.Value      0.0

if {$lake == 1} {
  pfset Patch.z-upper.BCPressure.Type               FluxConst
  pfset Patch.z-upper.BCPressure.Cycle              constant
  pfset Patch.z-upper.BCPressure.alltime.Value      0.0
} else {
  pfset Patch.z-upper.BCPressure.Type               OverlandFlow
  pfset Patch.z-upper.BCPressure.Cycle              constant
  pfset Patch.z-upper.BCPressure.alltime.Value      0.0
}

# -----------------------------------------------------------------------------
# Topo slopes in x-direction
# -----------------------------------------------------------------------------

pfset TopoSlopesX.Type                            Constant
pfset TopoSlopesX.GeomNames                       "domain"
pfset TopoSlopesX.Geom.domain.Value               0.0

# -----------------------------------------------------------------------------
# Topo slopes in y-direction
# -----------------------------------------------------------------------------

pfset TopoSlopesY.Type                            Constant
pfset TopoSlopesY.GeomNames                       "domain"
pfset TopoSlopesY.Geom.domain.Value               0.05

# -----------------------------------------------------------------------------
# Mannings coefficient
# -----------------------------------------------------------------------------

pfset Mannings.Type                               Constant
pfset Mannings.GeomNames                          "domain"
pfset Mannings.Geom.domain.Value                  5.e-6

# -----------------------------------------------------------------------------
# Phase sources:
# -----------------------------------------------------------------------------

pfset PhaseSources.water.Type                     Constant
pfset PhaseSources.water.GeomNames                "domain"
pfset PhaseSources.water.Geom.domain.Value        0.0

# -----------------------------------------------------------------------------
# Exact solution specification for error calculations
# -----------------------------------------------------------------------------

pfset KnownSolution                               NoKnownSolution

# -----------------------------------------------------------------------------
# Set solver parameters
# -----------------------------------------------------------------------------

pfset Solver                                      Richards
pfset Solver.MaxIter                              2500000
pfset OverlandFlowDiffusive                       0

pfset Solver.Nonlinear.MaxIter                    100
pfset Solver.Nonlinear.ResidualTol                1e-5
pfset Solver.Nonlinear.EtaValue                   0.01
pfset Solver.Nonlinear.UseJacobian                False
pfset Solver.Nonlinear.UseJacobian                True
pfset Solver.Nonlinear.DerivativeEpsilon          1e-8
pfset Solver.Nonlinear.StepTol                    1e-20
pfset Solver.Nonlinear.Globalization              LineSearch
pfset Solver.Linear.KrylovDimension               100
pfset Solver.Linear.MaxRestarts                   5

pfset Solver.Linear.Preconditioner                PFMG
pfset Solver.PrintSubsurf                         False
pfset Solver.Drop                                 1E-20
pfset Solver.AbsTol                               1E-7

pfset Solver.WritePfbMannings                     True
pfset Solver.WritePfbSlopes                       True
pfset Solver.PrintMask                            True

pfset Solver.PrintVelocities                      True

# -----------------------------------------------------------------------------
# Initial conditions: water pressure
# -----------------------------------------------------------------------------

if {$reset == 1} {
  pfset ICPressure.Type                           HydroStaticPatch
  pfset ICPressure.GeomNames                      domain
  pfset Geom.domain.ICPressure.Value              30.0
  pfset Geom.domain.ICPressure.RefGeom            domain
  pfset Geom.domain.ICPressure.RefPatch           z-lower
} else {
  set fname_ic [format "./$runname.out.press.%05d.pfb" $StartNumber]
  puts "Initial Conditions: $fname_ic"
  pfset ICPressure.Type                           PFBFile
  pfset ICPressure.GeomNames                      domain
  pfset Geom.domain.ICPressure.FileName           $fname_ic
  pfdist $fname_ic
}

# -----------------------------------------------------------------------------
# EcoSlim input generation (slimin.txt)
# -----------------------------------------------------------------------------

puts "Making EcoSLIM input file with $runname"

set fileID [open slimin.txt w]
puts $fileID "SLIM_SandTank_test   !Automatically Generated EcoSLIM input file"
puts $fileID "\"./$runname\""
puts $fileID "\"\""
puts $fileID "100    !nx"
puts $fileID "1      !ny"
puts $fileID "50     !nz"
if {$reset == 1} {
  puts $fileID "0      !no particles per cell at start of simulation"
} else {
  puts $fileID "-1     !read particle restart file"
}
puts $fileID "500000        !np Total"
puts $fileID "1.0           !dx"
puts $fileID "1.0           !dy, dz follows"
puts $fileID "1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0"
puts $fileID "1.0           ! ParFlow DT"
puts $fileID "[expr ($StartNumber + 1) ]    ! Parflow t1: ParFlow file number to start from (initial condition is pft1-1)"
puts $fileID "[expr ($StartNumber + $RunLength ) ]    ! Parflow t2: ParFlow file number to stop at"
puts $fileID "0             ! EcoSLIM output start counter 0=pft1"
puts $fileID "0.0           ! Particle start time counter (for recording particle insert times)"
puts $fileID "1             ! Time Sequence Repeat"
puts $fileID "0             ! ipwrite frequency, controls an ASCII, .3D particle file not recommended due to poor performance"
puts $fileID "1             ! ibinpntswrite frequency, controls VTK, binary output of particle locations and attributes"
puts $fileID "0             ! etwrite frequency, controls ASCII ET output"
puts $fileID "1             ! icwrite frequency,controls VTK, binary grid based output where particle masses, concentrations"
puts $fileID "1.0d0         ! velocity multiplier 1.0=forward, -1.0=backward"
puts $fileID "True          ! CLM Evap Trans"
puts $fileID "False         ! CLM Variables Read logical"
puts $fileID "50            ! number of particles per Evap Trans IC"
puts $fileID "1000.0        ! density H2O"
puts $fileID "0.00000001        ! Molecular Diffusivity"
puts $fileID "0.25d0        ! fraction of Dx/Vx for numerical stability"
puts $fileID "0             ! Number of indicators provided. If this value is great than 0 an indicator file must be included"
puts $fileID "\"\"            ! Name of the indictor file to use set to '' if not using an indicator file"
puts $fileID "True          ! use velfile"
puts $fileID "\"\"          ! Boolname"
close $fileID

# -----------------------------------------------------------------------------
# Run and Unload the n ParFlow output files
# -----------------------------------------------------------------------------

pfdist SandTank_Indicator.pfb

pfrun     $runname
pfundist  $runname

puts "$runname is done"
