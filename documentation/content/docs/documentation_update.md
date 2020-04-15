title: Updating the Documentation
---

We welcome your contributions to the documentation of SandTank. This document will help you with the process.

## Workflow

1. Ensure [npm](https://www.npmjs.com/) and [git](https://git-scm.com/) are installed.
2. Fork [hydroframe/SandTank](https://github.com/hydroframe/SandTank).
3. Clone the repository to your computer and install dependencies.

    {% code %}
    $ git clone https://github.com/<username>/SandTank.git
    $ cd SandTank
    $ npm install
    {% endcode %}

4. Run a local copy of the documentation. While it is running, you can view it by opening a web browser and going to `http://localhost:4000/SandTank`.

    {% code %}
    $ npm run doc:www
    {% endcode %}

5. Modify the documentation code inside `./documentation` (see below for more details). To view the updates at `http://localhost:4000/SandTank`, re-build the documentation.

    {% code %}
    $ npm run doc
    {% endcode %}

6. Stage the changes to commit.

    {% code %}
    $ git add ./documentation/<path>/<to>/<file>
    {% endcode %}

7. Commit changes using commitizen.

    {% code %}
    $ npm run commit
    {% endcode %}

8. Push the branch:

    {% code %}
    $ git push origin new_feature
    {% endcode %}

9. Create a pull request and describe the changes. Once the changes are merged, the online documentation will be updated automatically.

## Modifying Pages

Documentation pages can be modified by editing the appropriate [markdown](https://guides.github.com/features/mastering-markdown/) file in `./documentation/content/docs`. To find the correct file, substitute the web page's `.html` ending with `.md`. For instance, the web page `https://hydroframe.github.io/SandTank/docs/docker.html` can be edited by modifying `./documentation/content/docs/docker.md`.

The user manual page can be found at `./documentation/content/manual/index.md`.

## Adding/Removing Pages

To add a documentation page:

1. Add a [markdown](https://guides.github.com/features/mastering-markdown/) file in `./documentation/content/docs/`. Follow the style in the other markdown files. For instance, begin the file with:

    {% code %}
    title: <title>
    ---
    {% endcode %}

2. Add the file to the side bar in `./documentation/tpl/__sidebar__`. For the key (left-hand side), use the file name without the extension. For the value (right-hand side), use `.html` for the file name ending, rather than `.md`.

3. Add an english translation for the file in `./documentation/tpl/__en__`. Use the same key (left-hand side) as in step 2. The translation will be the value (right-hand side).

To remove a page, remove the markdown file from `./documentation/content/docs` and its keys from `./documentation/tpl/__sidebar__` and `./documentation/tpl/__en__`.

## Documenting Templates

Once a template has been created by following the [steps for creating a new template](template.html#Steps-for-creating-a-new-template), documenting the template is an important next step. To document a template:

1. Add a documentation page for the template by following the instructions in the [Adding/Removing Pages section](#Adding-Removing-Pages).
2. Add a screenshot of the template in `./documentation/content/docs/template_gallery/`, and refer to this image in the new markdown file via `./template_gallery/<image>`.
3. Add a description of the template in the markdown file.
4. Submit changes by following steps 6-9 in [the workflow](#Workflow).

## Front Page

To modify the [front page](https://hydroframe.github.io/SandTank/), modify the [jade](http://jade-lang.com/) file at `./documentation/content/index.jade`.

## Top Menu Bar

### Modifying Pages

Many of the top menu bar pages are located in their own directories in `./documentation/content`. For instance, the [gallery](https://hydroframe.github.io/SandTank/gallery/) can be found in `./documentation/content/gallery/index.md`. Images can be added to this directory (remember to `git add` the image files), and then referred to in the markdown file.

### Adding/Removing Pages

To add a top menu page:

1. Add a directory in `./documentation/content` with an `index.md` file inside. The `index.md` file will be the page that opens.

2. Add a menu entry to `./documentation/data/menu.yml`. The key (left-hand side) should be the directory name. The value (right-hand side) should be the same name enclosed by `/` characters.

3. Add an english translation for the menu path in `./documentation/tpl/__en__`. Use the same key (left-hand side) as in step 2. The translation will be the value (right-hand side).
