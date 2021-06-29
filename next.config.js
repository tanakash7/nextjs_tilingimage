const isProd = process.env.NODE_ENV === "production"

module.exports = {
  webpack(config, { buildId, dev, isServer, defaultLoaders, webpack }) {
    if(isProd) {
      config.module.rules[2].oneOf.forEach((moduleLoader, i) => {
        Array.isArray(moduleLoader.use) &&
          moduleLoader.use.forEach((l) => {
            if (
              // ('\\css-loader') だと動かない
              l.loader.includes('css-loader') &&
              !l.loader.includes('postcss-loader')
            ) {
              const { getLocalIdent, ...others } = l.options.modules;
  
              l.options = {
                ...l.options,
                modules: {
                  ...others,
                  localIdentName: '[hash:base64:6]',
                },
              };
            }
          });
      });
    }
    return config;
  },
};