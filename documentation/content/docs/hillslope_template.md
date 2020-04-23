title: Hill Slope Template
---

[![](./template_gallery/hill-slope.png)](https://pvw.kitware.com/sandtank/?name=hillSlope)

The hillslope dimensions are 1OOm * 1m * 500m (lx, ly, lz) with 100 cells in the x and  50 in the z direction (1 in the y).

Edits to the run.tcl script are well locations (only 3 wells), initial z-boundary condition (start at 300m), and files being read in (SandTank_Indicator.pfb and SandTank.pfsol)

The indi file is just 3 flat layers as a test with index values of 1, 2, and 3.

The InitialPress.pfb contains a WTD of 30m across the domain.

The domain.json files contain new dimensions and new boundaries to find the new solid file.
