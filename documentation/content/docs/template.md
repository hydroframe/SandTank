title: Templates
---

The default template is the Sandtank model; however, the inputs listed below can be altered to create custom templates. Templates can be used by appending name to the sand tank call, i.e. http://localhost:9000/?name=noWells (see [Using Custom Templates](run_application.html#Using-Custom-Templates) for more details).

The existing templates can be found in the repository at `./deploy/pvw/simulations/templates`. Each template has its own directory that must contain the following:
- A `run.tcl` script for ParFlow to use to read the simulation
- An indicator ParFlow binary file named `SandTank_Indicator.pfb`
- If a pf solid file is used in the `run.tcl` script, its vtk version should also be provided and named `SandTank.vtk`.
- A `domain.json` file to provide hints for the Web application by exposing in a more convinient manner what has been set inside the `run.tcl` script.
- An initial pressure ParFlow binary file named `InitialPress.pfb`

**Caution:** Regardless of the template being used the application is looking for specific file name within the template directory. Make sure you follow the naming convention.

**Note**: when creating the necessary inputs for a template, the dx, dy, dx ratio must be 1 to 1 to 1 in order for the inputs to be properly visualized in the web application.

## Steps for creating a new template
This section describes the steps for creating a new template by copying and modifying an existing template. In the new template directory you will need to replace the model input files and make the necessary edits to the `run.tcl` script and `domain.json` file. Refer to the list in the previous sections for the inputs you will need before you get started. Note that for this workflow you do not need to build the docker image. You can simply clone the repo, modify the template, and launch the application following the instructions below.

1. Follow steps 1-4 of [the Workflow](contributing.html#Workflow) to clone and install the repository.

2. Create your new template directory
  ```sh
  cd  ./deploy/pvw/simulations/templates/
  cp -r ./default ./NewTemplate
  ```

3. Replace the following files with the inputs you would like for your new template
  - `SandTank.pfsol`
  - `SandTank_Indicator.pfb`
  - `SandTank.vtk`
  - `InitialPress.pfb`

 *Note: The rest of the files can be given different names as long as this is reflected in the *tcl* script but the VTK file must be named `SandTank.vtk` regardless of the template that is being created.*

4. Modify the `run.tcl` script for your domain. Additional changes may be needed depending on the template you are trying to build, but for starters, make sure to check/update the following:
 - Check that all input files names are updated to reflect new files from the previous step
 - Update domain dimensions to match your inputs (*Note: For visualization purposes on the web it is best to stick with a total ratio of 2:1 for all templates at this point, also see the note above that for now the dx, dy and dz, should be equal*)
 - Correct well placements
 - Check indicator values
 - Update parameter values to match your indicator file

5. Edit the `domain.json` file so that it matches the new `run.tcl` script (i.e. well placements/well keys, dimensions, constant head boundary heights, soil type keys, etc). All of the elements found in the `domain.json` file are outlined in the [ domain.json ](#domain-json).

6. Once the new inputs are placed in the new template directory and edits are complete, you can test your changes simply by re-runing the docker image. Follow the instructions [for using custom templates](run_application.html#Using-Custom-Templates).

7. After you are satisfied with the new template, consider contributing it to the project by following the [Contributing Templates](contributing.html#Contributing-Templates) instructions.


# domain.json

## Explanation of the variables in the JSON file

- **Dimensions**: number of cells in x, y, and z direction. Note at this point the dimensions of all cells (i.e. dx,dy, dz) must be a 1:1:1 ratio.
- **Bounds**: lower and upper bounds in each direction by taking a ‘half-step’ in. For example if there are 100 cells in the x direction (each 1 unit in length) the x bounds would be 0.5 and 99.5. In the case of y which only has one cell, the bounds will be placed a quarter step in at 0.25 and 0.75 if dy is 1.
- **Wells**: defines the well name, assigns a key, and specifies the location (x cell and z cell) where water is extracted or injected. The keys are used when generating the configuration file for the run.tcl script.
- **Refresh Rate**: This is the speed at which the parflow outputs are visualized on the web client
- **Simulation Length**: Number of timesteps taken for each time the “Run” button is clicked
- **Max Height**, **hLeft**, and **hRight**: The maximum height of the left and right constant head boundaries by number of cells. hLeft and hRight determine the default starting constant head boundary heights
- **Indicators**: set keys for each index in the indicator file
- **Pressures** (visualization extents for landfill, river, and wells): define location for pressure files to be read and the extents for the visualization of water in the wells and in potential bodies of water (landfill, lake, river)
- **Flow and Storage Calculations** List of cellids to be used in the storage or flow calculations (the river bottom or lake bottom)

## Other Notes on Customization
 - The background materials and the jpegs used as textures can be altered and modified [here](https://github.com/hydroframe/SandTank/tree/master/client/src/assets).

- The color of the Inject arrow for the wells can be controlled [here](https://github.com/hydroframe/SandTank/blob/master/client/src/components/core/Visualization/template.html#L73).

- The color of the pollutant inside water can be controlled [here](https://github.com/hydroframe/SandTank/blob/master/client/src/components/core/Visualization/template.html#L49).

- Options for colors that can be used can be found [here](https://v15.vuetifyjs.com/en/framework/colors).

- The content of the About page can be changed [here](https://github.com/hydroframe/SandTank/blob/master/client/src/components/core/About/template.html).
