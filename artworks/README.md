# Artwork template

We have provided you with a simple [Create React App](https://reactjs.org/docs/create-a-new-react-app.html) [template](./_artwork-template) for developing your artwork.

## Setup and workflow

Before you get stuck in please read the following steps :)

- Create a new branch using gitflow: `git flow feature start artwork-<firstname>-<lastname>`
- Publish your branch on Github
- Copy the `_artwork-template` folder and rename it to `artwork-<firstname>-<lastname>`
- Change directory and run `npm start`

**Notes**

- Gitflow is a standard we use at Jam3 when working on projects. More information can be read on our [Wiki page](https://wiki.jam3.net/books/standards/page/git-standards).
- Please consider supporting mobile devices for your artwork. It's not a requirement but it will allow more people to see your artwork if optimised.
- Please use relative urls for assets.

## Publishing your artwork

Your artwork will be displayed in [The Gallery](https://jam3.github.io/intern-dev-training-generative-art/), a place that showcases everyones artwork who participated in this training project.

To publish your artwork please follow these steps:

- Clean your code
- Ensure your assets are optimised (filesize and resolution)
- Test on desktop and mobile (mobile optional but nice to have)
- Update the `artwork` fields in the `package.json` with your information
- Create a 2048x2048 screenshot of your artwork and overwrite `public/thumbnail.jpg`
- Add your folder name to [gallery.json](../gallery.json) in the project root
- Build your project with `npm run build`
- Publish your project to the Gallery with `npm run publish`

**Notes**

- To test your build before publishing change directory into the build folder and run `http-server`.
- If you don't have http-server installed `npm i -g http-server`.
