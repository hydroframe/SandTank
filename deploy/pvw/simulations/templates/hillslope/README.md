### Hillslope Template
The hillslope dimensions are 1km * 10m * 500m (lx, ly, lz) with 100 cells in the x and z directions (1 in the y).

Edits to the run.tcl script are well locations (only 3 wells), initial z-boundary condition (start at 300m), 
and files being read in (indi.pfb and hillslope_dx10_dy10.pfsol)

The indi file is just 3 flat layers as a test with index values of 1, 2, and 3. 

The InitialPress.pfb contains a WTD of 200m across the domain.

The domain.json files contain new dimensions and new boundaries to find the new solid file. 
