# ParFlow Sandtank

This application aims to provide a standalone solution for simulating a specific Sand tank setup using ParFlow and an interactive Web UI for adjusting the various parameters that can be adjusted by the user.

## Build the web client

```sh
cd ./client
npm install
npm run build
```

## Bundle the application

Once the client as been built, the only required part for running the service is the content of the deploy directory which can be archived and shared for deploying such service in another location.

The following set of commands can be used to capture the application.

```sh
cd ./deploy
tar cvfz sandtank-app.tgz ./pvw
```

## Run Web application with docker inside repository

```sh
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

Open your browser to `http://localhost:9000/`

Use `Ctrl+C` to stop the container.

## Run Web service using the application bundle

```sh
mkdir -p /opt/sandtank
cd /opt/sandtank
tar xvfz /.../sandtank-app.tgz

export APP=/opt/sandtank/pvw
export HOST=localhost:9100

docker run --rm                 \
  -e PROTOCOL="ws"               \
  -p 0.0.0.0:9100:80              \
  -e SERVER_NAME="${HOST}"         \
  -v "${APP}:/pvw"                  \
  -d hydroframe/sandtank:web-service
```

Open your browser to `http://localhost:9100/`

## Templates
The base Sandtank model will open by default with the procedures outlined above. To use a different template modify the URL to open your browser to `http://localhost:9100/?name=“TemplateName”`. The following templates are available:
1.  **default** : This is the default sand tank model.
2.  **hillslope**: This template incorporates topography to include two hillslopes with a river in the middle.
3.  **nowells**: The dafault sand tank with all wells removed. This template was only just for testing purposes.  
