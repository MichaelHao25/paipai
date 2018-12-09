if (process.env.NODE_ENV === 'development') {
    //开发环境
    module.exports = require('./configureStore.dev.js');

} else {
    //生产环境
    module.exports = require('./configureStore.pro.js');
}