// Copy artworks
const fs = require('fs');
const shell = require('shelljs');
const galleryData = require('../../gallery.json');

const data = [];

for (let i = 0; i < galleryData.length; i++) {
  const path = `${__dirname}/../../artworks/${galleryData[i]}`;
  const pkg = require(`${path}/package.json`);
  const buildDir = `${path}/build/*`;
  // Copy artworks to public/artworks/*
  const artworkDir = `${__dirname}/../public/artworks/artwork-${pkg.artwork.artist
    .split(' ')
    .join('-')
    .toLowerCase()}/`;
  if (!fs.existsSync(artworkDir)) {
    shell.mkdir(artworkDir);
  }
  data.push(pkg.artwork);
  shell.cp('-R', buildDir, artworkDir);
}

// Write latest json data for the site's gallery
fs.writeFileSync(`${__dirname}/../src/data/gallery.json`, JSON.stringify(data, null, 2));
