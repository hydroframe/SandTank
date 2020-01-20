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
# Read in command line arguments
# -----------------------------------------------------------------------------

set runname         [lindex $argv 0]
set reset           [lindex $argv 1]

set StartNumber     [lindex $argv 2]
set RunLength       [lindex $argv 3]

set hleft           [lindex $argv 4]
set hright          [lindex $argv 5]

set lake            [lindex $argv 6]

set w1flux          [lindex $argv 7]
set w2flux          [lindex $argv 8]
set w3flux          [lindex $argv 9]
set w4flux          [lindex $argv 10]
set w5flux          [lindex $argv 11]
set w6flux          [lindex $argv 12]
set w7flux          [lindex $argv 13]
set w8flux          [lindex $argv 14]
set w9flux          [lindex $argv 15]
set w10flux         [lindex $argv 16]
set w11flux         [lindex $argv 17]

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
if {$w1flux >= 0} {
  pfset Wells.w1.Action                           Extraction
  pfset Wells.w1.alltime.Flux.water.Value         $w1flux
} else {
  pfset Wells.w1.Action                           Injection
  pfset Wells.w1.alltime.Flux.water.Value         [expr  -1*$w1flux]
}

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
if {$w2flux >= 0} {
  pfset Wells.w2.Action                           Extraction
  pfset Wells.w2.alltime.Flux.water.Value         $w2flux
} else {
  pfset Wells.w2.Action                           Injection
  pfset Wells.w2.alltime.Flux.water.Value         [expr  -1*$w2flux]
}

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
if {$w3flux >= 0} {
  pfset Wells.w3.Action                           Extraction
  pfset Wells.w3.alltime.Flux.water.Value         $w3flux
} else {
  pfset Wells.w3.Action                           Injection
  pfset Wells.w3.alltime.Flux.water.Value         [expr  -1*$w3flux]
}

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
if {$w4flux >= 0} {
  pfset Wells.w4.Action                           Extraction
  pfset Wells.w4.alltime.Flux.water.Value         $w4flux
} else {
  pfset Wells.w4.Action                           Injection
  pfset Wells.w4.alltime.Flux.water.Value         [expr  -1*$w4flux]
}

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
if {$w5flux >= 0} {
  pfset Wells.w5.Action                           Extraction
  pfset Wells.w5.alltime.Flux.water.Value         $w5flux
} else {
  pfset Wells.w5.Action                           Injection
  pfset Wells.w5.alltime.Flux.water.Value         [expr  -1*$w5flux]
}

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
if {$w6flux >= 0} {
  pfset Wells.w6.Action                           Extraction
  pfset Wells.w6.alltime.Flux.water.Value         $w6flux
} else {
  pfset Wells.w6.Action                           Injection
  pfset Wells.w6.alltime.Flux.water.Value         [expr  -1*$w6flux]
}

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
if {$w7flux >= 0} {
  pfset Wells.w7.Action                           Extraction
  pfset Wells.w7.alltime.Flux.water.Value         $w7flux
} else {
  pfset Wells.w7.Action                           Injection
  pfset Wells.w7.alltime.Flux.water.Value         [expr  -1*$w7flux]
}

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
if {$w8flux >= 0} {
  pfset Wells.w8.Action                           Extraction
  pfset Wells.w8.alltime.Flux.water.Value         $w8flux
} else {
  pfset Wells.w8.Action                           Injection
  pfset Wells.w8.alltime.Flux.water.Value         [expr  -1*$w8flux]
}

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
if {$w9flux >= 0} {
  pfset Wells.w9.Action                           Extraction
  pfset Wells.w9.alltime.Flux.water.Value         $w9flux
} else {
  pfset Wells.w9.Action                           Injection
  pfset Wells.w9.alltime.Flux.water.Value         [expr  -1*$w9flux]
}

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
if {$w10flux >= 0} {
  pfset Wells.w10.Action                          Extraction
  pfset Wells.w10.alltime.Flux.water.Value        $w10flux
} else {
  pfset Wells.w10.Action                          Injection
  pfset Wells.w10.alltime.Flux.water.Value        [expr  -1*$w10flux]
}

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
if {$w11flux >= 0} {
  pfset Wells.w11.Action                          Extraction
  pfset Wells.w11.alltime.Flux.water.Value        $w11flux
} else {
  pfset Wells.w11.Action                          Injection
  pfset Wells.w11.alltime.Flux.water.Value        [expr  -1*$w11flux]
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
