var express = require("express");
var cors = require('cors');//跨域资源共享
var path = require("path");
var bodyParser = require('body-parser');
var credentials = require("./credentials");

var index = require("./routes/index");
var user = require("./routes/users");
var cms = require("./routes/cms");
var admin = require("./routes/admin");
var api = require("./routes/api");
var blog = require("./routes/blog");
var app = express();

app.set("port", process.env.port || 3009);

//调用中间件
// cookie-parser configuration
app.use(require('cookie-parser')(credentials.cookieSecret));

// express-session configuration
app.use(require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
}));


// database configuration MongoDB数据库连接设置
var mongoose = require('mongoose');
var options = {
    server: {
        socketOptions: { keepAlive: 1 }
    }
};
switch(app.get('env')){
    case 'development':
        mongoose.connect(credentials.mongo.development.connectionString, options);
        break;
    case 'production':
        mongoose.connect(credentials.mongo.production.connectionString, options);
        break;
    default:
        throw new Error('Unknown execution environment: ' + app.get('env'));
};
//设置handlebars 视图引擎及视图目录和视图文件扩展名
var handlebars = require("express-handlebars").create({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        static: function (name) {
            return require('./lib/static.js').map(name);
        },
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('hbs', handlebars.engine);
app.set("view engine", "hbs");
app.set('views', path.join(__dirname, 'views'));
//静态资源配置
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Handlebars中引用局部文件 中间件设置
app.use(function(req, res, next){
    if(!res.locals.partials)  res.locals.partials = {};
    res.locals.partials.discountContext = {
        locations: [{product: 'book', price: '99.00'}]
    };

    var Loginname='';
    if(req.session.loginName){
        Loginname = req.session.loginName;
    }
    res.locals.partials.navigationContext = {
        locations: [{Loginname:Loginname}]
    };
    next();
});


app.use("/", index);
app.use("/users", user);
app.use("/cms", cms);
app.use("/admin", admin);
app.use("/blog", blog);
app.use("/api", cors(), api);
//定制错误部分
app.use(function (req, res) {
    res.status(404);
    res.render("404");
});
app.use(function (err, req, res, next) {
    res.status(500);
    res.render("500");
});

app.listen(app.get("port"), function () {
    console.log("Express 已启动在http://localhost:" +
        app.get("port") + ', 若要终止运行请按组合键Ctr + C');
});