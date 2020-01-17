# Web docker

This image will provide a fully standalone solution for our ParaViewWeb application.
This subdirectory was taken as-is from the ParaViewWeb repository in the directory 
`tools/docker/paraviewweb` but was copied here for simplicity.

## Building 

We are going to use our runtime image as BASE_IMAGE for the ParaViewWeb image.
Therefore to build that image you will need to fetch ParaViewWeb and running 
its image creation like follow:

```
docker build --build-arg BASE_IMAGE=parflow -t pvw-parflow .
```