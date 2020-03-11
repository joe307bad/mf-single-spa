const handler = require('serve-handler');
const http = require('http');

export default (projectName: string, outputPath: string, portNumber: number) => {
    // TODO can we hard type this so you have to add a rewrite 
    // when you add a project?
    const serveOptions = {
        public: outputPath,
        rewrites: [
            {
                "source": "saturn/**",
                "destination": "./index.html"
            },
            {
                "source": "madrox/**",
                "destination": "./index.html"
            }
        ]
    };

    http.createServer((request: any, response: any) =>
        handler(request, response, serveOptions)
    ).listen(portNumber, () => {
        console.log(`Serving ${projectName} at http://localhost:${portNumber}`);
    });
}
