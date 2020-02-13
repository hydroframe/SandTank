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

puts "-------------------------------------------"
puts "Loading configuration for $runname"
puts "-------------------------------------------"
source "/pvw/simulations/runs/$runname/config.tcl"

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
#puts ""
#puts "well_4_action:        $well_4_action"
#puts "well_4_value:         $well_4_value"
#puts ""
#puts "well_5_action:        $well_5_action"
#puts "well_5_value:         $well_5_value"
#puts ""
#puts "well_6_action:        $well_6_action"
#puts "well_6_value:         $well_6_value"
#puts ""
#puts "well_7_action:        $well_7_action"
#puts "well_7_value:         $well_7_value"
#puts ""
#puts "well_8_action:        $well_8_action"
#puts "well_8_value:         $well_8_value"
#puts ""
#puts "well_9_action:        $well_9_action"
#puts "well_9_value:         $well_9_value"
#puts ""
#puts "well_10_action:       $well_10_action"
#puts "well_10_value:        $well_10_value"
#puts ""
#puts "well_11_action:       $well_11_action"
#puts "well_11_value:        $well_11_value"
puts "-------------------------------------------"

# -----------------------------------------------------------------------------
# Computational Grid
# sandtank actual demensions are 30cm by 15cm
# -----------------------------------------------------------------------------

pfset ComputationalGrid.Lower.X           0.0
pfset ComputationalGrid.Lower.Y           0.0
pfset ComputationalGrid.Lower.Z           0.0

pfset ComputationalGrid.DX                10.0
pfset ComputationalGrid.DY                10.0
pfset ComputationalGrid.DZ                5.0

pfset ComputationalGrid.NX                100
pfset ComputationalGrid.NY                1
pfset ComputationalGrid.NZ                100

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
pfset GeomInput.solidinput.FileName       hillslope_dx10_dy10.pfsol

pfset Geom.domain.Patches                 "z-upper z-lower x-lower x-upper y-lower y-upper"

# -----------------------------------------------------------------------------
# Domain Geometry
# -----------------------------------------------------------------------------

pfset Geom.domain.Lower.X                 0.0
pfset Geom.domain.Lower.Y                 0.0
pfset Geom.domain.Lower.Z                 0.0

pfset Geom.domain.Upper.X                 1000.0
pfset Geom.domain.Upper.Y                 10.0
pfset Geom.domain.Upper.Z                 500.0

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
pfset Geom.s1.Perm.Value                  1.0

pfset Geom.s2.Perm.Type                   Constant
pfset Geom.s2.Perm.Value                  0.2

pfset Geom.s3.Perm.Type                   Constant
pfset Geom.s3.Perm.Value                  0.6

pfset Geom.s4.Perm.Type                   Constant
pfset Geom.s4.Perm.Value                  0.05

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
pfset Geom.s1.Porosity.Value              $k_1

pfset Geom.s2.Porosity.Type               Constant
pfset Geom.s2.Porosity.Value              $k_2

pfset Geom.s3.Porosity.Type               Constant
pfset Geom.s3.Porosity.Value              $k_3

pfset Geom.s4.Porosity.Type               Constant
pfset Geom.s4.Porosity.Value              $k_4

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

# -----------------------------------------------------------------------------
# Wells
# -----------------------------------------------------------------------------

pfset Wells.Names                         "w1 w2 w3"
# w4 w5 w6 w7 w8 w9 w10 w11"
# pfset Wells.Names                       ""

# -----------------------------------------------------------------------------

pfset Wells.w1.InputType                          Vertical
pfset Wells.w1.Type                               Flux
pfset Wells.w1.X                                  125.0
pfset Wells.w1.Y                                  5.0
pfset Wells.w1.ZUpper                             159.0
pfset Wells.w1.ZLower                             151.0
pfset Wells.w1.Cycle                              constant
pfset Wells.w1.alltime.Saturation.water.Value     1.0
pfset Wells.w1.Method                             Standard

pfset Wells.w1.Action                             $well_1_action
pfset Wells.w1.alltime.Flux.water.Value           $well_1_value

# -----------------------------------------------------------------------------

pfset Wells.w2.InputType                          Vertical
pfset Wells.w2.Type                               Flux
pfset Wells.w2.X                                  605.0
pfset Wells.w2.Y                                  5.0
pfset Wells.w2.ZUpper                             249.0
pfset Wells.w2.ZLower                             241.0
pfset Wells.w2.Cycle                              constant
pfset Wells.w2.alltime.Saturation.water.Value     1.0
pfset Wells.w2.Method                             Standard

pfset Wells.w2.Action                             $well_2_action
pfset Wells.w2.alltime.Flux.water.Value           $well_2_value

# -----------------------------------------------------------------------------

pfset Wells.w3.InputType                          Vertical
pfset Wells.w3.Type                               Flux
pfset Wells.w3.X                                  905.0
pfset Wells.w3.Y                                  5.0
pfset Wells.w3.ZUpper                             159.0
pfset Wells.w3.ZLower                             151.0
pfset Wells.w3.Cycle                              constant
pfset Wells.w3.alltime.Saturation.water.Value     1.0
pfset Wells.w3.Method                             Standard

pfset Wells.w3.Action                             $well_3_action
pfset Wells.w3.alltime.Flux.water.Value           $well_3_value

# -----------------------------------------------------------------------------


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

# -----------------------------------------------------------------------------
# Initial conditions: water pressure
# -----------------------------------------------------------------------------

if {$reset == 1} {
  pfset ICPressure.Type                           HydroStaticPatch
  pfset ICPressure.GeomNames                      domain
  pfset Geom.domain.ICPressure.Value              300.0
  pfset Geom.domain.ICPressure.RefGeom            domain
  pfset Geom.domain.ICPressure.RefPatch           z-lower
} else {
  set fname_ic [format "/pvw/simulations/runs/$runname/$runname.out.press.%05d.pfb" $StartNumber]
  puts "Initial Conditions: $fname_ic"
  pfset ICPressure.Type                           PFBFile
  pfset ICPressure.GeomNames                      domain
  pfset Geom.domain.ICPressure.FileName           $fname_ic
  pfdist $fname_ic
}

# -----------------------------------------------------------------------------
# Run and Unload the n ParFlow output files
# -----------------------------------------------------------------------------

pfdist SandTank_Indicator.pfb

pfrun     $runname
pfundist  $runname

puts "$runname is done"

# -----------------------------------------------------------------------------
