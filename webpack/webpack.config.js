const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");
const path = require('path');

const config = {
	entry: './js/src/common_es6.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	module: {
	    //将es6代码编译成js
		loaders:[
			{
				test: /\.(js|jsx)$/,
				use: 'babel-loader'
			}
		]
	},
	plugins: [
	    //精简压缩js文件
		new webpack.optimize.UglifyJsPlugin(),
		//向html文件里添加script标签引用编译成的bundle.js
		new HtmlWebpackPlugin({template: './index.html'})
	],
	//webpack-dev-server配置npm安装
    devServer: {
        contentBase: "./dist", //本地服务器所加载的页面所在的目录
        historyApiFallback: true, //不跳转
        inline: true,
        port: 4200
    },
}

module.exports = config;