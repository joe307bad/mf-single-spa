import * as path from 'path';
import buildWebpackConfiguration, { BuildConfiguration } from '../tooling/config';
import { omit } from 'lodash/fp';
import { capitalCase } from 'change-case';
import webpack, { Configuration } from 'webpack';
import { PROJECTS } from '../registry';
import serve from '../scripts/serve';
const HtmlWebpackPlugin = require("html-webpack-plugin");

const absPath = (p: string) => path.resolve(__dirname, p);

type Project = typeof PROJECTS[number];

const project = process.argv.find((arg: any) =>
    PROJECTS.some((project: string) => arg === project)
) as Project;

if (!project) {
    throw new Error('Project argument required')
}

const sharedLibraries = ["react", "react-dom", "single-spa-react"]

const allRemotes = PROJECTS.reduce((acc, project: Project) => ({
    ...acc,
    [project]: project
}), {})

const buildProjectConfiguration = (project: Project): [Configuration, Partial<BuildConfiguration>] => {

    const projectPath = absPath(`../../${project}`);

    const config: Partial<BuildConfiguration> = {
        projectName: project,
        remotes: omit(project)(allRemotes),
        exposes: {
            [capitalCase(project)]: `${projectPath}/single-spa-config.ts`
        },
        entryFile: `${projectPath}/single-spa-config.ts`,
        projectPath: projectPath,
        presets: ['@babel/preset-react'],
        sharedLibraries,
        outputPath: `${projectPath}/dist`
    };

    const webpackConfig = (function (): Configuration {
        switch (project) {
            case "mf":
                config.portNumber = 3000;
                return buildWebpackConfiguration(omit(['exposes', 'presets'])({
                    ...config,
                    entryFile: absPath('../src/index.ts'),
                    projectPath: absPath('../'),
                    plugins: [
                        new HtmlWebpackPlugin({
                            template: absPath('../index.html')
                        })
                    ]
                }))

            case "saturn":
                config.portNumber = 3001;
                return buildWebpackConfiguration(omit('remotes')(config))
            case "madrox":
                config.portNumber = 3002;
                return buildWebpackConfiguration(omit('remotes')(config))
        }
    })()

    return [webpackConfig, config];

}

const config = buildProjectConfiguration(project);

webpack(config[0]).watch({}, (err, stats) => {
    if (err) {
        console.error('webpack:build', err);
    }
    console.log('[webpack:build]', stats.toString({
        chunks: false,
        colors: true
    }));
});

serve(
    config[1].projectName ?? '',
    config[1].outputPath ?? '',
    config[1].portNumber ?? 0
)