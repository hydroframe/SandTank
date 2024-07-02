# -----------------------------------------------------------------------------
# Script for the intial conditions of the replica sandtank model
# -----------------------------------------------------------------------------
#%%
from parflow import Run
import json
import os
# -----------------------------------------------------------------------------
# Configuration variables for sandtank
# -----------------------------------------------------------------------------


f = open("./inputs.json")
input = json.load(f)

# os.mkdir("test")
# os.chdir("test")

reset = 1
StartNumber = 0
RunLength = 10
runname = sys.argv[0]

hleft = input['hleft']
hright = input['right']
lake = 1
k_1 = input['k_1']
k_2 = input['k_2']
k_3 = input['k_3']
k_4 = input['k_4']
well_1_action = input['well_1_action']
well_1_value = input['well_1_value']
well1loc = [11, 15]
# well_2_action = 'Extraction'
# well_2_value = 0
# well_3_action = 'Extraction'
# well_3_value = 0
# well_4_action = 'Extraction'
# well_4_value = 0
# well_5_action = 'Extraction'
# well_5_value = 0
# well_6_action = 'Extraction'
# well_6_value = 0
# well_7_action = 'Extraction'
# well_7_value = 0
# well_8_action = 'Extraction'
# well_8_value = 0
# well_9_action = 'Extraction'
# well_9_value = 0
# well_10_action = 'Extraction'
# well_10_value = 0
# well_11_action = 'Extraction'
# well_11_value = 0

# -----------------------------------------------------------------------------
# Setting up ParFlow run
# -----------------------------------------------------------------------------

sandtank = Run('sandtank_default', __file__)

sandtank.FileVersion = 4

# -----------------------------------------------------------------------------
# Set Processor topology
# -----------------------------------------------------------------------------

sandtank.Process.Topology.P = 1
sandtank.Process.Topology.Q = 1
sandtank.Process.Topology.R = 1

# -----------------------------------------------------------------------------
# Computational Grid
# sandtank actual demensions are 30cm by 15cm
# -----------------------------------------------------------------------------

sandtank.ComputationalGrid.Lower.X = 0.0
sandtank.ComputationalGrid.Lower.Y = 0.0
sandtank.ComputationalGrid.Lower.Z = 0.0

sandtank.ComputationalGrid.DX = 1.0
sandtank.ComputationalGrid.DY = 1.0
sandtank.ComputationalGrid.DZ = 1.0

sandtank.ComputationalGrid.NX = 100
sandtank.ComputationalGrid.NY = 1
sandtank.ComputationalGrid.NZ = 50

# -----------------------------------------------------------------------------
# Domain Geometry Input
# -----------------------------------------------------------------------------

sandtank.Domain.GeomName = 'domain'

# -----------------------------------------------------------------------------
# Names of the GeomInputs
# -----------------------------------------------------------------------------

sandtank.GeomInput.Names = 'solidinput indi_input'

sandtank.GeomInput.solidinput.InputType = 'SolidFile'
sandtank.GeomInput.solidinput.GeomNames = 'domain'
sandtank.GeomInput.solidinput.FileName = 'SandTank.pfsol'

sandtank.Geom.domain.Patches = 'z_upper z_lower x_lower x_upper y_lower y_upper'

# -----------------------------------------------------------------------------
# Domain Geometry
# -----------------------------------------------------------------------------

sandtank.Geom.domain.Lower.X = 0.0
sandtank.Geom.domain.Lower.Y = 0.0
sandtank.Geom.domain.Lower.Z = 0.0

sandtank.Geom.domain.Upper.X = 100.0
sandtank.Geom.domain.Upper.Y = 1.0
sandtank.Geom.domain.Upper.Z = 50.0

# -----------------------------------------------------------------------------
# Indicator Geometry Input
# -----------------------------------------------------------------------------

# will be set once the indi file in created
sandtank.GeomInput.indi_input.InputType = 'IndicatorField'
sandtank.GeomInput.indi_input.GeomNames = 's1 s2 s3 s4'
sandtank.Geom.indi_input.FileName = 'SandTank_Indicator.pfb'

# s1: gravel, s2: fine sand, s3: coarse sand, s4: clay
sandtank.GeomInput.s1.Value = 1
sandtank.GeomInput.s2.Value = 2
sandtank.GeomInput.s3.Value = 3
sandtank.GeomInput.s4.Value = 4

# -----------------------------------------------------------------------------
# Permeability (values in cm/s)
# -----------------------------------------------------------------------------

sandtank.Geom.Perm.Names = 's1 s2 s3 s4'

sandtank.Geom.s1.Perm.Type = 'Constant'
sandtank.Geom.s1.Perm.Value = k_1

sandtank.Geom.s2.Perm.Type = 'Constant'
sandtank.Geom.s2.Perm.Value = k_2

sandtank.Geom.s3.Perm.Type = 'Constant'
sandtank.Geom.s3.Perm.Value = k_3

sandtank.Geom.s4.Perm.Type = 'Constant'
sandtank.Geom.s4.Perm.Value = k_4

sandtank.Perm.TensorType = 'TensorByGeom'
sandtank.Geom.Perm.TensorByGeom.Names = 'domain'
sandtank.Geom.domain.Perm.TensorValX = 1.0
sandtank.Geom.domain.Perm.TensorValY = 1.0
sandtank.Geom.domain.Perm.TensorValZ = 1.0

# -----------------------------------------------------------------------------
# Specific Storage
# -----------------------------------------------------------------------------

sandtank.SpecificStorage.Type = 'Constant'
sandtank.SpecificStorage.GeomNames = 'domain'
sandtank.Geom.domain.SpecificStorage.Value = 1.0e-5

# -----------------------------------------------------------------------------
# Phases
# -----------------------------------------------------------------------------

sandtank.Phase.Names = 'water'
sandtank.Phase.water.Density.Type = 'Constant'
sandtank.Phase.water.Density.Value = 1.0
sandtank.Phase.water.Viscosity.Type = 'Constant'
sandtank.Phase.water.Viscosity.Value = 1.0

# -----------------------------------------------------------------------------
# Contaminants
# -----------------------------------------------------------------------------

sandtank.Contaminants.Names = ''

# -----------------------------------------------------------------------------
# Gravity
# -----------------------------------------------------------------------------

sandtank.Gravity = 1.0

# -----------------------------------------------------------------------------
# Timing (time units is set by units of permeability)
# -----------------------------------------------------------------------------

sandtank.TimingInfo.BaseUnit = 1.0
sandtank.TimingInfo.DumpInterval = -1

sandtank.TimingInfo.StartCount = StartNumber
sandtank.TimingInfo.StartTime = 0.0
sandtank.TimingInfo.StopTime = RunLength

sandtank.TimeStep.Type = 'Constant'
sandtank.TimeStep.Value = 1.0

# -----------------------------------------------------------------------------
# Porosity
# -----------------------------------------------------------------------------

sandtank.Geom.Porosity.GeomNames = 'domain s1 s2 s3 s4'

sandtank.Geom.domain.Porosity.Type = 'Constant'
sandtank.Geom.domain.Porosity.Value = 0.4

sandtank.Geom.s1.Porosity.Type = 'Constant'
sandtank.Geom.s1.Porosity.Value = 0.4

sandtank.Geom.s2.Porosity.Type = 'Constant'
sandtank.Geom.s2.Porosity.Value = 0.25

sandtank.Geom.s3.Porosity.Type = 'Constant'
sandtank.Geom.s3.Porosity.Value = 0.3

sandtank.Geom.s4.Porosity.Type = 'Constant'
sandtank.Geom.s4.Porosity.Value = 0.35

# -----------------------------------------------------------------------------
# Domain
# -----------------------------------------------------------------------------

sandtank.Domain.GeomName = 'domain'

# ----------------------------------------------------------------------------
# Mobility
# ----------------------------------------------------------------------------

sandtank.Phase.water.Mobility.Type = 'Constant'
sandtank.Phase.water.Mobility.Value = 1.0

# -----------------------------------------------------------------------------
# Relative Permeability
# -----------------------------------------------------------------------------

sandtank.Phase.RelPerm.Type = 'VanGenuchten'
sandtank.Phase.RelPerm.GeomNames = 'domain'

sandtank.Geom.domain.RelPerm.Alpha = 2.0
sandtank.Geom.domain.RelPerm.N = 3.0

# -----------------------------------------------------------------------------
# Saturation
# -----------------------------------------------------------------------------

sandtank.Phase.Saturation.Type = 'VanGenuchten'
sandtank.Phase.Saturation.GeomNames = 'domain'

sandtank.Geom.domain.Saturation.Alpha = 2.0
sandtank.Geom.domain.Saturation.N = 3.0
sandtank.Geom.domain.Saturation.SRes = 0.2
sandtank.Geom.domain.Saturation.SSat = 1.0

# -----------------------------------------------------------------------------
# Time Cycles
# -----------------------------------------------------------------------------

sandtank.Cycle.Names = 'constant'
sandtank.Cycle.constant.Names = 'alltime'
sandtank.Cycle.constant.alltime.Length = 1
sandtank.Cycle.constant.Repeat = -1

# -----------------------------------------------------------------------------
# Wells
# -----------------------------------------------------------------------------

# sandtank.Wells.Names = 'w1 w2 w3 w4 w5 w6 w7 w8 w9 w10 w11'
sandtank.Wells.Names = 'w1'

# -----------------------------------------------------------------------------

sandtank.Wells.w1.InputType = 'Vertical'
sandtank.Wells.w1.Type = 'Flux'
sandtank.Wells.w1.X = 11.5
sandtank.Wells.w1.Y = 0.5
sandtank.Wells.w1.ZUpper = 15.9
sandtank.Wells.w1.ZLower = 15.1
sandtank.Wells.w1.Cycle = 'constant'
sandtank.Wells.w1.alltime.Saturation.water.Value = 1.0
sandtank.Wells.w1.Method = 'Standard'

sandtank.Wells.w1.Action = well_1_action
sandtank.Wells.w1.alltime.Flux.water.Value = well_1_value

# -----------------------------------------------------------------------------

# sandtank.Wells.w2.InputType = 'Vertical'
# sandtank.Wells.w2.Type = 'Flux'
# sandtank.Wells.w2.X = 23.5
# sandtank.Wells.w2.Y = 0.5
# sandtank.Wells.w2.ZUpper = 1.9
# sandtank.Wells.w2.ZLower = 1.1
# sandtank.Wells.w2.Cycle = 'constant'
# sandtank.Wells.w2.alltime.Saturation.water.Value = 1.0
# sandtank.Wells.w2.Method = 'Standard'
#
# sandtank.Wells.w2.Action = well_2_action
# sandtank.Wells.w2.alltime.Flux.water.Value = well_2_value
#
# # -----------------------------------------------------------------------------
#
# sandtank.Wells.w3.InputType = 'Vertical'
# sandtank.Wells.w3.Type = 'Flux'
# sandtank.Wells.w3.X = 26.5
# sandtank.Wells.w3.Y = 0.5
# sandtank.Wells.w3.ZUpper = 15.9
# sandtank.Wells.w3.ZLower = 15.1
# sandtank.Wells.w3.Cycle = 'constant'
# sandtank.Wells.w3.alltime.Saturation.water.Value = 1.0
# sandtank.Wells.w3.Method = 'Standard'
#
# sandtank.Wells.w3.Action = well_3_action
# sandtank.Wells.w3.alltime.Flux.water.Value = well_3_value
#
# # -----------------------------------------------------------------------------
#
# sandtank.Wells.w4.InputType = 'Vertical'
# sandtank.Wells.w4.Type = 'Flux'
# sandtank.Wells.w4.X = 29.5
# sandtank.Wells.w4.Y = 0.5
# sandtank.Wells.w4.ZUpper = 27.9
# sandtank.Wells.w4.ZLower = 27.1
# sandtank.Wells.w4.Cycle = 'constant'
# sandtank.Wells.w4.alltime.Saturation.water.Value = 1.0
# sandtank.Wells.w4.Method = 'Standard'
#
# sandtank.Wells.w4.Action = well_4_action
# sandtank.Wells.w4.alltime.Flux.water.Value = well_4_value
#
# # -----------------------------------------------------------------------------
#
# sandtank.Wells.w5.InputType = 'Vertical'
# sandtank.Wells.w5.Type = 'Flux'
# sandtank.Wells.w5.X = 48.5
# sandtank.Wells.w5.Y = 0.5
# sandtank.Wells.w5.ZUpper = 1.9
# sandtank.Wells.w5.ZLower = 1.1
# sandtank.Wells.w5.Cycle = 'constant'
# sandtank.Wells.w5.alltime.Saturation.water.Value = 1.0
# sandtank.Wells.w5.Method = 'Standard'
#
# sandtank.Wells.w5.Action = well_5_action
# sandtank.Wells.w5.alltime.Flux.water.Value = well_5_value
#
# # -----------------------------------------------------------------------------
#
# sandtank.Wells.w6.InputType = 'Vertical'
# sandtank.Wells.w6.Type = 'Flux'
# sandtank.Wells.w6.X = 51.5
# sandtank.Wells.w6.Y = 0.5
# sandtank.Wells.w6.ZUpper = 13.9
# sandtank.Wells.w6.ZLower = 13.1
# sandtank.Wells.w6.Cycle = 'constant'
# sandtank.Wells.w6.alltime.Saturation.water.Value = 1.0
# sandtank.Wells.w6.Method = 'Standard'
#
# sandtank.Wells.w6.Action = well_6_action
# sandtank.Wells.w6.alltime.Flux.water.Value = well_6_value
#
# # -----------------------------------------------------------------------------
#
# sandtank.Wells.w7.InputType = 'Vertical'
# sandtank.Wells.w7.Type = 'Flux'
# sandtank.Wells.w7.X = 54.5
# sandtank.Wells.w7.Y = 0.5
# sandtank.Wells.w7.ZUpper = 15.9
# sandtank.Wells.w7.ZLower = 15.1
# sandtank.Wells.w7.Cycle = 'constant'
# sandtank.Wells.w7.alltime.Saturation.water.Value = 1.0
# sandtank.Wells.w7.Method = 'Standard'
#
# sandtank.Wells.w7.Action = well_7_action
# sandtank.Wells.w7.alltime.Flux.water.Value = well_7_value
#
# # -----------------------------------------------------------------------------
#
# sandtank.Wells.w8.InputType = 'Vertical'
# sandtank.Wells.w8.Type = 'Flux'
# sandtank.Wells.w8.X = 57.5
# sandtank.Wells.w8.Y = 0.5
# sandtank.Wells.w8.ZUpper = 1.9
# sandtank.Wells.w8.ZLower = 1.1
# sandtank.Wells.w8.Cycle = 'constant'
# sandtank.Wells.w8.alltime.Saturation.water.Value = 1.0
# sandtank.Wells.w8.Method = 'Standard'
#
# sandtank.Wells.w8.Action = well_8_action
# sandtank.Wells.w8.alltime.Flux.water.Value = well_8_value
#
# # -----------------------------------------------------------------------------
#
# sandtank.Wells.w9.InputType = 'Vertical'
# sandtank.Wells.w9.Type = 'Flux'
# sandtank.Wells.w9.X = 82.5
# sandtank.Wells.w9.Y = 0.5
# sandtank.Wells.w9.ZUpper = 1.9
# sandtank.Wells.w9.ZLower = 1.1
# sandtank.Wells.w9.Cycle = 'constant'
# sandtank.Wells.w9.alltime.Saturation.water.Value = 1.0
# sandtank.Wells.w9.Method = 'Standard'
#
# sandtank.Wells.w9.Action = well_9_action
# sandtank.Wells.w9.alltime.Flux.water.Value = well_9_value
#
# # -----------------------------------------------------------------------------
#
# sandtank.Wells.w10.InputType = 'Vertical'
# sandtank.Wells.w10.Type = 'Flux'
# sandtank.Wells.w10.X = 87.5
# sandtank.Wells.w10.Y = 0.5
# sandtank.Wells.w10.ZUpper = 14.9
# sandtank.Wells.w10.ZLower = 14.1
# sandtank.Wells.w10.Cycle = 'constant'
# sandtank.Wells.w10.alltime.Saturation.water.Value = 1.0
# sandtank.Wells.w10.Method = 'Standard'
#
# sandtank.Wells.w10.Action = well_10_action
# sandtank.Wells.w10.alltime.Flux.water.Value = well_10_value
#
# # -----------------------------------------------------------------------------
#
# sandtank.Wells.w11.InputType = 'Vertical'
# sandtank.Wells.w11.Type = 'Flux'
# sandtank.Wells.w11.X = 92.5
# sandtank.Wells.w11.Y = 0.5
# sandtank.Wells.w11.ZUpper = 26.9
# sandtank.Wells.w11.ZLower = 26.1
# sandtank.Wells.w11.Cycle = 'constant'
# sandtank.Wells.w11.alltime.Saturation.water.Value = 1.0
# sandtank.Wells.w11.Method = 'Standard'
#
# sandtank.Wells.w11.Action = well_11_action
# sandtank.Wells.w11.alltime.Flux.water.Value = well_11_value



# -----------------------------------------------------------------------------
# EcoSlim input generation (well.sa)
# -----------------------------------------------------------------------------
f = open('welltest.sa', 'w')
f.write("100 1 50\n")
for k in range(50):
    for i in range(100):
        if i == well1loc[0] and k == well1loc[1]:
            if well1_action == "injection":
                f.write(well1_value + "\n")
            else:
                f.write("-1\n")

        elif i == well2loc[0] and k == well2loc[1]:
            if well2_action == "injection":
                f.write(well2_value + "\n")
            else:
                f.write("-1\n")

        elif i == well3loc[0] and k == well3loc[1]:
            if well3_action == "injection":
                f.write(well3_value + "\n")
            else:
                f.write("-1\n")

        elif i == well4loc[0] and k == well4loc[1]:
            if well4_action == "injection":
                f.write(well4_value + "\n")
            else:
                f.write("-1\n")

        elif i == well5loc[0] and k == well5loc[1]:
            if well5_action == "injection":
                f.write(well5_value + "\n")
            else:
                f.write("-1\n")

        elif i == well6loc[0] and k == well6loc[1]:
            if well6_action == "injection":
                f.write(well6_value + "\n")
            else:
                f.write("-1\n")

        elif i == well7loc[0] and k == well7loc[1]:
            if well7_action == "injection":
                f.write(well7_value + "\n")
            else:
                f.write("-1\n")

        elif i == well8loc[0] and k == well8loc[1]:
            if well8_action == "injection":
                f.write(well8_value + "\n")
            else:
                f.write("-1\n")

        elif i == well9loc[0] and k == well9loc[1]:
            if well9_action == "injection":
                f.write(well9_value + "\n")
            else:
                f.write("-1\n")

        elif i == well10loc[0] and k == well10loc[1]:
            if well10_action == "injection":
                f.write(well10_value + "\n")
            else:
                f.write("-1\n")

        elif i == well11loc[0] and k == well11loc[1]:
            if well11_action == "injection":
                f.write(well11_value + "\n")
            else:
                f.write("-1\n")
        else:
            f.write("0.0\n")
f.close()

# -----------------------------------------------------------------------------
# Boundary Conditions
# -----------------------------------------------------------------------------

sandtank.BCPressure.PatchNames = sandtank.Geom.domain.Patches

sandtank.Patch.x_lower.BCPressure.Type = 'DirEquilRefPatch'
sandtank.Patch.x_lower.BCPressure.Cycle = 'constant'
sandtank.Patch.x_lower.BCPressure.RefGeom = 'domain'
sandtank.Patch.x_lower.BCPressure.RefPatch = 'z_lower'
sandtank.Patch.x_lower.BCPressure.alltime.Value = input['hleft']

sandtank.Patch.y_lower.BCPressure.Type = 'FluxConst'
sandtank.Patch.y_lower.BCPressure.Cycle = 'constant'
sandtank.Patch.y_lower.BCPressure.alltime.Value = 0.0

sandtank.Patch.z_lower.BCPressure.Type = 'FluxConst'
sandtank.Patch.z_lower.BCPressure.Cycle = 'constant'
sandtank.Patch.z_lower.BCPressure.alltime.Value = 0.0

sandtank.Patch.x_upper.BCPressure.Type = 'DirEquilRefPatch'
sandtank.Patch.x_upper.BCPressure.Cycle = 'constant'
sandtank.Patch.x_upper.BCPressure.RefGeom = 'domain'
sandtank.Patch.x_upper.BCPressure.RefPatch = 'z_lower'
sandtank.Patch.x_upper.BCPressure.alltime.Value = input['hright']

sandtank.Patch.y_upper.BCPressure.Type = 'FluxConst'
sandtank.Patch.y_upper.BCPressure.Cycle = 'constant'
sandtank.Patch.y_upper.BCPressure.alltime.Value = 0.0

if lake == 1:
  sandtank.Patch.z_upper.BCPressure.Type = 'FluxConst'
  sandtank.Patch.z_upper.BCPressure.Cycle = 'constant'
  sandtank.Patch.z_upper.BCPressure.alltime.Value = 0.0
else:
  sandtank.Patch.z_upper.BCPressure.Type = 'OverlandFlow'
  sandtank.Patch.z_upper.BCPressure.Cycle = 'constant'
  sandtank.Patch.z_upper.BCPressure.alltime.Value = 0.0

# -----------------------------------------------------------------------------
# Topo slopes in x-direction
# -----------------------------------------------------------------------------

sandtank.TopoSlopesX.Type = 'Constant'
sandtank.TopoSlopesX.GeomNames = 'domain'
sandtank.TopoSlopesX.Geom.domain.Value = 0.0

# -----------------------------------------------------------------------------
# Topo slopes in y-direction
# -----------------------------------------------------------------------------

sandtank.TopoSlopesY.Type = 'Constant'
sandtank.TopoSlopesY.GeomNames = 'domain'
sandtank.TopoSlopesY.Geom.domain.Value = 0.05

# -----------------------------------------------------------------------------
# Mannings coefficient
# -----------------------------------------------------------------------------

sandtank.Mannings.Type = 'Constant'
sandtank.Mannings.GeomNames = 'domain'
sandtank.Mannings.Geom.domain.Value = 5.e-6

# -----------------------------------------------------------------------------
# Phase sources:
# -----------------------------------------------------------------------------

sandtank.PhaseSources.water.Type = 'Constant'
sandtank.PhaseSources.water.GeomNames = 'domain'
sandtank.PhaseSources.water.Geom.domain.Value = 0.0

# -----------------------------------------------------------------------------
# Exact solution specification for error calculations
# -----------------------------------------------------------------------------

sandtank.KnownSolution = 'NoKnownSolution'

# -----------------------------------------------------------------------------
# Set solver parameters
# -----------------------------------------------------------------------------

sandtank.Solver = 'Richards'
sandtank.Solver.MaxIter = 2500000
sandtank.OverlandFlowDiffusive = 0

sandtank.Solver.Nonlinear.MaxIter = 100
sandtank.Solver.Nonlinear.ResidualTol = 1e-5
sandtank.Solver.Nonlinear.EtaValue = 0.01
sandtank.Solver.Nonlinear.UseJacobian = False
sandtank.Solver.Nonlinear.UseJacobian = True
sandtank.Solver.Nonlinear.DerivativeEpsilon = 1e-8
sandtank.Solver.Nonlinear.StepTol = 1e-20
sandtank.Solver.Nonlinear.Globalization = 'LineSearch'
sandtank.Solver.Linear.KrylovDimension = 100
sandtank.Solver.Linear.MaxRestarts = 5

sandtank.Solver.Linear.Preconditioner = 'PFMG'
sandtank.Solver.PrintSubsurf = False
sandtank.Solver.Drop = 1E-20
sandtank.Solver.AbsTol = 1E-7

sandtank.Solver.WritePfbMannings = True
sandtank.Solver.WritePfbSlopes = True
sandtank.Solver.PrintMask = True

sandtank.Solver.PrintVelocities = True

# -----------------------------------------------------------------------------
# Initial conditions: water pressure
# -----------------------------------------------------------------------------

if reset == 1:
  sandtank.ICPressure.Type = 'HydroStaticPatch'
  sandtank.ICPressure.GeomNames = 'domain'
  sandtank.Geom.domain.ICPressure.Value = 30.0
  sandtank.Geom.domain.ICPressure.RefGeom = 'domain'
  sandtank.Geom.domain.ICPressure.RefPatch = 'z_lower'
else:
  fname_ic = f'./sandtank.out.press.{"{:0>5}".format(StartNumber)}.pfb'
  print(f'Initial Conditions: {fname_ic}')
  sandtank.ICPressure.Type = 'PFBFile'
  sandtank.ICPressure.GeomNames = 'domain'
  sandtank.Geom.domain.ICPressure.FileName = fname_ic
  sandtank.dist(fname_ic)


# -----------------------------------------------------------------------------
# EcoSlim input generation (slimin.txt)
# -----------------------------------------------------------------------------

print("Making EcoSLIM input file with {}".format(runname))
f = open('slimintest.txt', 'w')

f.write("SLIM_SandTank_test   !Automatically Generated EcoSLIM input file\n")
f.write('"./{}"\n'.format(runname))
f.write('""\n')
f.write("100    !nx\n")
f.write("1      !ny\n")
f.write("50     !nz\n")
if reset == 1:
    f.write("0      !no particles per cell at start of simulation\n")
else:
    f.write("-1     !read particle restart file\n")
f.write("500000        !np Total\n")
f.write("1.0           !dx\n")
f.write("1.0           !dy, dz follows\n")
f.write("1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0\n")
f.write("1.0           ! ParFlow DT\n")
f.write(str(StartNumber + 1) +
        "    ! Parflow t1: ParFlow file number to start from (initial condition is pft1-1)\n")
f.write(str(StartNumber + RunLength) +
        "    ! Parflow t2: ParFlow file number to stop at\n")
f.write("0             ! EcoSLIM output start counter 0=pft1\n")
f.write("0.0           ! Particle start time counter (for recording particle insert times)\n")
f.write("1             ! Time Sequence Repeat\n")
f.write("0             ! ipwrite frequency, controls an ASCII, .3D particle file not recommended due to poor performance\n")
f.write("1             ! ibinpntswrite frequency, controls VTK, binary output of particle locations and attributes\n")
f.write("0             ! etwrite frequency, controls ASCII ET output\n")
f.write("1             ! icwrite frequency,controls VTK, binary grid based output where particle masses, concentrations\n")
f.write("1.0d0         ! velocity multiplier 1.0=forward, -1.0=backward\n")
f.write("True          ! CLM Evap Trans\n")
f.write("False         ! CLM Variables Read logical\n")
f.write("50            ! number of particles per Evap Trans IC\n")
f.write("1000.0        ! density H2O\n")
f.write("0.00000001        ! Molecular Diffusivity\n")
f.write("0.25d0        ! fraction of Dx/Vx for numerical stability\n")
f.write("0             ! Number of indicators provided. If this value is great than 0 an indicator file must be included\n")
f.write('""            ! Name of the indictor file to use set to "" if not using an indicator file')


f.close()


# -----------------------------------------------------------------------------
# Run and Unload the n ParFlow output files
# -----------------------------------------------------------------------------

sandtank.dist('SandTank_Indicator.pfb')

sandtank.run()

print('Run is done')

# %%
