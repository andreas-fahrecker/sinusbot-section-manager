module.exports = {
    publicPath: (process.env.NODE_ENV === 'production' ?
        process.env.VUE_APP_DOMAIN + 'scripts/sinusbot-section-manager/'
        : '/'),
    outputDir: '../html'
};