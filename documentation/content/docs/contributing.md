title: Contributing
---

We welcome your contributions to the development of SandTank. This document will help you with the process.

## Workflow

1. Ensure [npm](https://www.npmjs.com/) and [git](https://git-scm.com/) are installed.
2. Fork [hydroframe/SandTank](https://github.com/hydroframe/SandTank).
3. Clone the repository to your computer and install dependencies.

    {% code %}
    $ git clone https://github.com/<username>/SandTank.git
    $ cd SandTank
    $ npm install
    {% endcode %}

4. Create a feature branch.

    {% code %}
    $ git checkout -b new_feature
    {% endcode %}

5. Start hacking.

6. Stage the changes to commit.

    {% code %}
    $ git add ./<path>/<to>/<file>
    {% endcode %}

7. Commit changes using commitzen.

    {% code %}
    $ npm run commit
    {% endcode %}

8. Push the branch:

    {% code %}
    $ git push origin new_feature
    {% endcode %}

9. Create a pull request and describe the change.

## Contributing to the Client

To contribute to the client:

1. Follow the [instructions to run the web application](https://hydroframe.github.io/SandTank/docs/web_application.html).
2. Modify the code in `./client` and view the updates in the local web application.
3. Follow steps 6-9 in [the workflow](#Workflow).

#### Coding Style

- When contributing to the client, follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).
- Use soft-tabs with a two space indent.
- Don't put commas first.

#### Notice

- Don't modify the version numbers in `package.json`. They are modified automatically.

## Contributing Templates

After creating a new template, it is often helpful to contribute the new template to the main project. To contribute a template:

1. Follow steps 1-4 in [the Workflow instructions](#Workflow).
2. Copy the new template directory into `./deploy/pvw/simulations/templates` inside the repository.
3. Document the new template by following the [Documenting Templates instructions](documentation_update.html#Documenting-Templates).
4. `git add` the new template files and documentation changes for step 6 in [the workflow](#Workflow).
5. Follow steps 7-9 in [the workflow](#Workflow).

## Updating the Documentation

After modifying the source code, it is often necessary to update the documentation.

See [Documentation Update](./documentation_update.html) for more details.
