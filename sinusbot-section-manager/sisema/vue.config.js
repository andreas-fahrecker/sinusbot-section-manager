module.exports = {
    publicPath: (process.env.NODE_ENV === 'production' ?
        'http://37.120.184.226:8087/scripts/sinusbot-section-manager/'
        : '/'),
    outputDir: '../html'
};