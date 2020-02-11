const { fusebox, sparky } = require('fuse-box');
const { pluginTypeChecker } = require('fuse-box-typechecker');

class Context {
    isProduction;
    runServer;
    getConfig() {
        return fusebox({
            target: 'browser',
            output: `dev`,
            entry: `./src/index.ts`,
            webIndex: {
                template: `src/index.html`
            },
            log: false,
            cache: {
                root: '.cache',
                enabled: true
            },
            watcher: { 
                enabled:true,
                include:['../../packages', './src'],
                ignored: ['dist', 'dev'] 
            },
            hmr : { plugin : "./src/fuseHmrPlugin.ts"},
            devServer: this.runServer,
            plugins: [
                pluginTypeChecker({
                    basePath: './',
                    tsConfig: './tsconfig.json',
                    skipTsErrors: [6059]
                })
            ]
        });
    }
}
const { task, exec, src } = sparky(Context);

task('default', async ctx => {
    ctx.runServer = true;
    const fuse = ctx.getConfig();
    await fuse.runDev();
});
