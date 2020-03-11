import { Configuration, Plugin } from "webpack";
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

export type BuildConfiguration = {
    projectName: string;
    projectPath: string;
    entryFile: string;
    portNumber: number;
    exposes: Object
    sharedLibraries: string[];
    remotes: Object,
    presets: string[],
    plugins: Plugin[],
    outputPath: string
}

export default (config: Partial<BuildConfiguration>): Configuration => {
    return {
        name: config.projectName,
        entry: config.entryFile,
        cache: false,
        mode: "development",
        devtool: "source-map",
        optimization: {
            minimize: false
        },
        output: {
            path: config.outputPath,
            publicPath: `http://localhost:${config.portNumber}/`
        },
        resolve: {
            extensions: [".jsx", ".js", ".json", ".ts", ".tsx"]
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: `${config.projectPath}/node_modules`,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                ...config.presets || [],
                                '@babel/preset-env',
                                ['@babel/preset-typescript']
                            ]
                        }
                    }
                }
            ]
        },
        plugins: [
            new ModuleFederationPlugin({
                name: config.projectName,
                library: { type: "var", name: config.projectName },
                filename: `${config.projectName}.js`,
                shared: config.sharedLibraries,
                ...(config.remotes ? { remotes: config.remotes } : {}),
                ...(config.exposes ? { exposes: config.exposes } : {})
            }),
            ...config.plugins || []
        ]
    };
}