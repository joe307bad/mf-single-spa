import simplegit from 'simple-git/promise';
import shell from 'shelljs';
import * as path from 'path';
import * as fs from 'fs';

// TODO tag projects when this is actually ready to
// go so we can iterate on them and not worry about 
// this script pulling from master
const projects = [
    ['madrox', 'https://github.com/xura/madrox'],
    ['saturn', 'https://github.com/xura/saturn']
];

const git = simplegit();

projects.forEach(project => {
    const destination = path.resolve(__dirname, `../../${project[0]}`);
    if (!fs.existsSync(destination)) {
        console.log(`Cloning ${project[0]}...`)
        git.clone(project[1], destination).then(() => {
            console.log(`Installing dependencies (yarn install) for ${destination}. This may take a minute...`)
            shell.cd(destination);
            shell.exec('yarn install', { async: true, silent: true })
        })
    }
})

