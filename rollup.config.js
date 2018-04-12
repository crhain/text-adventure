// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/app/main.js',
    output: {
      file: 'public/app/app.js',
      format: 'iife',
      name: 'game'      
    },
    plugins: [        
        resolve({
            preferBuiltins: false,
            modulesOnly: true,
            customResolveOptions: {
                moduleDirectory: 'src/app'
            }                        
        })        
    ]
};