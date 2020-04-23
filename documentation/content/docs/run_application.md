title: Running the Application
---

In addition to [the web application](https://pvw.kitware.com/sandtank/), the Sandtank application may be ran on a personal computer. Because running the application requires [Docker](https://www.docker.com/), administrator privileges are required.

To run the application on a local computer, follow these instructions:

1. Download and install [Docker](https://www.docker.com/).
2. Open a terminal.
  * On Windows, open a command prompt with administrator privileges.
  * On Mac/Linux, open a terminal. You will either have to use `sudo` with the docker commands, or [set up docker to run without sudo](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user).
3. Ensure you can run docker by running in the terminal:

    ```bash
    $ docker info
    ```

4. Pull the application by running:

    ```bash
    $ docker pull hydroframe/sandtank:web-service
    ```

5. When it finishes downloading, run:

    ```bash
    $ docker run -p 9000:80 -it hydroframe/sandtank:web-service
    ```

6. Access the application by opening a web browser at http://localhost:9000/

## Using Custom Templates

To use custom templates, follow these steps:

1. First, follow steps 1-5 [for creating a new template](template.html#Steps-for-creating-a-new-template).

2. To try it out, follow the steps for [Running the Application](run_application.html), except, for the `docker run` command, add an additional argument like the following:

    ```bash
    $ docker run -p 9000:80 -it -v /path/to/templates:/pvw/simulations/templates hydroframe/sandtank:web-service
    ```

where `/path/to/templates` is the path to your local `templates` directory. This will replace the `templates` directory inside the docker container with your local one.

3. Access the application by appending `?name=<template_name>` to the end of the web url, where `<template_name>` is the name of your new template directory. For example, http://localhost:9000/?name=NewTemplate.

4. To update the application after modifying the new template files, simply refresh the page in the browser.

5. After you are satisfied with the new template, consider contributing it to the project by following the [Contributing Templates](contributing.html#Contributing-Templates) instructions.
