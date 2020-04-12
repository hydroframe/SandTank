# ParFlow Sandtank

This application aims to provide a standalone solution for simulating a specific Sand tank setup using ParFlow and an interactive Web UI for adjusting the various parameters that can be adjusted by the user.

____
## Table of Contents:
1. [ Sustainability Plan](#sustainability)
1. [ Docker Runtime](#docker)
1. [ Development setup](#devsetup)
1. [ Templates](#templates)
1. [ Variables for Customization](#customization)

____
<a name="sustainability"></a>
## 1. Sustainability Plan
This repo is developed in collaboration between the Colorado School of Mines, University of Arizona and Kitware.

### GitHub and DockerHub workflow

### Documentation
- New templates should be added to the list in the main ReadMe folder
- Variable additions or customization options should be documented in this manual in the [ Templates](#templates) or [ Variables for Customization](#customization) sections.

### Testing

### Deployment

____
<a name="docker"></a>
## 2. Docker Runtime

The ParaFlow Sandtank relies on a docker image to serve the web application along with the infrastructure to run the simulation codes and visualization server. This provides a streamlined execution and deployment of the application.

The sections below mainly focus on how a maintainer can rebuild each component that compose that end-product docker image.

The following set of users can safely skip this section and simply use the publicly available image under the name `hydroframe/sandtank:web-service` on DockerHub.

Users that can safely skip the Docker Build section:
- User that want to create/edit a *template*
- User that want to develop the *Web application (client)*
- User that want to develop the *ParaViewWeb server side API (server)*

### Building docker images

The following steps build the docker application. If you would like to run it you should follow the instructions to *Build the Web Client* and *Run Web Application* that are included in the main *README* after you have completed these steps.  Alternatively you can also follow the instructions for running the [ development setup ](#devsetup).

In general the steps below are not needed for the users as the end-product image is publicly available. Therefore if your goal is just to develop new *templates* or even make some *Web tweaks* you can achieve them without the build steps below.

These steps are mainly given as reference for when a new version of ParFlow or any other code is required after editing the DockerFile definitions.

#### Docker Development

This will create a local docker image named `sandtank-dev` which will build and install ParaFlow+EcoSlim with all its dependency along with ParaView-5.7.

```sh
cd ./docker/development
./build.sh
```

#### Docker Runtime

This will create a local docker image named `sandtank-runtime` which will only copy the end products from `sandtank-dev` into a more light-weight image meant to just run the application.

```sh
cd ./docker/runtime
./build.sh
```

#### Docker Web

This will create a local docker image named `pvw-sandtank-runtime` that extends `sandtank-runtime` with the ParaViewWeb infrastructure for managing web server and process manager.

```sh
cd ./docker/web
./build.sh
```

### Publish docker images to HydroFrame
Updated sand tank versions should be published to the HydroFrame docker-hub and tagged.

Before anything you need to login into docker-hub by running the following command lines:

```sh
docker login
```

Then provide your `Docker` ID and password at the prompts.
To tag your image, the command looks like:

```sh
docker tag <local-image-tag> <desired-tag-name-for-registry>
```

For example in our use case we will publish the following set of images:

- sandtank-runtime     => hydroframe/sandtank:runtime
- pvw-sandtank-runtime => hydroframe/sandtank:web-service

```sh
docker tag sandtank-runtime hydroframe/sandtank:runtime
docker push hydroframe/sandtank:runtime
```

```sh
docker tag pvw-sandtank-runtime hydroframe/sandtank:web-service
docker push hydroframe/sandtank:web-service
```

### Manage docker image as a file archive

If network is not available it can be convenient to capture a docker image so you can share it to someone else through a thumb-drive or any other media.

In order to capture a docker image into a file, you can run the following command line:

```sh
docker save hydroframe/sandtank:web-service | gzip > sandtank-web-service.tar.gz
```

Then once the user want to import that image to its local running docker, the following command line can be used:

```sh
docker load < sandtank-web-service.tar.gz
```

____
<a name="devsetup"></a>
## 3. Development setup
This section provide some background on how to isolate each part of the Web development and enable fast turn around in the application development and validation for either the client or server of the web application.

To achieve full control on the *client side*, *server side* and *simulation code*, we need to run 3 process independently as described below

### Web server

The following command will run a development web server that will automatically update the web content while you are editing the code. This is ideal for seeing your HTML/CSS and JavaScript change live. The web content should be accessed with the following URL assuming the port 8080 was actually available: `http://localhost:8080/?dev`

```sh
cd client
npm run serve
```

### ParaView process

That following command will start the ParaViewWeb process which drives the visualization and configures the simulation run. This is typically executing the python code inside `./server/*.py` while storing the simulation results inside `$PWD/simulations/runs/devrun/*`. Each time you are editing a Python file, you should restart the process and reload your web-page.

This workflow could also be convenient when developing a *template* as the outputs of the run will always be in the same directory which could then be easily monitored.

In that part we assume you have a downloaded version of ParaView on which we just use its *pvpython* executable for running our ParaViewWeb application.

```sh
cd deploy/pvw
/Applications/ParaView-5.7.0.app/Contents/bin/pvpython ./server/pvw-parflow.py --run devrun --basepath "$PWD/simulations/runs" --port 1234
```

### Launcher for Parflow

The following command will start the docker image which will provide the ParFlow execution infrastructure.
To debug *templates* and *simulation executions*, you should look into the `$PWD/deploy/pvw/launcher/logs/*` directories for the execution logs.

```sh
docker run --rm                   \
  -e PROTOCOL="ws"                 \
  -p 0.0.0.0:9000:80                \
  -e SERVER_NAME="localhost:9000"    \
  -v "$PWD/deploy/pvw:/pvw"           \
  -it hydroframe/sandtank:web-service
```

Use `Ctrl+C` to stop the container.

____
<a name="templates"></a>
## 4. Templates
The default template is the Sandtank model; however, the inputs listed below can be altered below to create custom templates. Templates can be run using by appending name to the sand tank call, i.e. http://localhost:9000/?name=noWells

The existing templates can be found at `./deploy/pvw/simulations/templates`. Each template has its own directory that must contain the following:
- A `run.tcl` script for ParFlow to use to read the simulation
- An indicator ParFlow binary file named `SandTank_Indicator.pfb`
- If a pf solid file is used in the `run.tcl` script, its vtk version should also be provided and named `SandTank.vtk`.
- A `domain.json` file to provide hints for the Web application by exposing in a more convinient manner what has been set inside the `run.tcl` script.
- An initial pressure ParFlow binary file named `InitialPress.pfb`

**Caution:** Regardless of the template being used the application is looking for specific file name within the template directory. Make sure you follow the naming convention.

**Note**: when creating the necessary inputs for a template, the dx, dy, dx ratio must be 1 to 1 to 1 in order for the inputs to be properly visualized in the web application.

## Steps for creating a new template
This section describes the steps for creating a new template by copying and modifying an existing template. In the new template directory you will need to replace the model input files and make the necessary edits to the `run.tcl` script and `domain.json` file. Refer to the list in the previous sections for the inputs you will need before you get started.


1. Create your new template directory
  ```sh
  cd  ./deploy/pvw/simulations/templates/
  cp -r ./default ./NewTemplate
  ```

2. Replace the following files with the inputs you would like for your new template
  - `SandTank.pfsol`
  - `SandTank_Indicator.pfb`
  - `SandTank.vtk`
  - `InitialPress.pfb`

 *Note: The rest of the files can be given different names as long as this is reflected in the *tcl* script but the VTK file must be named `SandTank.vtk` regardless of the template that is being created.*

3. Modify the `run.tcl` script for your domain. Additional changes may be needed depending on the template you are trying to build, but for starters, make sure to check/update the following:
 - Check that all input files names are updated to reflect new files from the previous step
 - Update domain dimensions to match your inputs (*Note: For visualization purposes on the web it is best to stick with a total ratio of 2:1 for all templates at this point, also see the note above that for now the dx, dy and dz, should be equal*)
 - Correct well placements
 - Check indicator values
 - Update parameter values to match your indicator file

4. Edit the `domain.json` file so that it matches the new `run.tcl` script (i.e. well placements/well keys, dimensions, constant head boundary heights, soil type keys, etc). All of the elements found in the `domain.json` file are outlined in the [ Variables for Customization](#customization).

5. Once the new inputs are placed in the new template directory and edits are complete, you can test your changes simply by re-runing the docker image. 

  ```
  cd ./

  export APP=$PWD/deploy/pvw
  export HOST=localhost:9000

  docker run --rm                   \
    -e PROTOCOL="ws"                 \
    -p 0.0.0.0:9000:80                \
    -e SERVER_NAME="${HOST}"           \
    -v "${APP}:/pvw"                    \
    -it hydroframe/sandtank:web-service
  ```
  Open your browser to `http://localhost:9000/?name=“NewTemplate”`

  Use `Ctrl+C` to stop the container.

6. When you have completed your template follow the GitHub procedures in the [ Sustainability Plan](#sustainability) to submit a pull request for your new template and add  the name of your NewTemplate with a description on the main ReadMe Page.

____
<a name="customization"></a>
## 5. Variables for Customization
This section summarizes the variables in the JSON file and provides pointers to other controls in the repo that can be used to customize the SandTank options and visualization.

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

## Other notes on customization
 - The background materials and the jpegs used as textures can be altered and modified here:
https://github.com/hydroframe/SandTank/tree/master/client/src/assets

- The color of the Inject arrow for the wells can be controlled here:
https://github.com/hydroframe/SandTank/blob/master/client/src/components/core/Visualization/template.html#L73

- The color of the pollutant inside water can be controlled here:
https://github.com/hydroframe/SandTank/blob/master/client/src/components/core/Visualization/template.html#L49

- Options for colors that can be used can be found here: https://v15.vuetifyjs.com/en/framework/colors

- The content of the About page can be changed here:
https://github.com/hydroframe/SandTank/blob/master/client/src/components/core/About/template.html
