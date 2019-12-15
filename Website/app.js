let express = require('express');
let helmet = require('helmet');
let compression = require('compression');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');

let token = require('./utils/authorisation');
let user = require('./api/controllers/user');

let app = express();

let authRouter = require('./api/routes/auth')
let generalRouter = require('./api/routes/generaluser');
let userRouter = require('./api/routes/user');
let cleanerRouter = require('./api/routes/cleaner.js')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.set('view engine', 'ejs');
app.use('/assets',express.static('assets'));

app.get('/',  token.index, (req, res) => {
    return res.render('index');
});

app.get('/home', token.home, (req, res) => {
    user.getDetails(req.body.user_id).then((details) => {
        if (details.code !== 200) {
            return res.render('home', {
                message: 'Error getting user details. Please try again'
            });
        }
        let date = new Date();
        details.details = [
            {
                date: date.getDate() + ':' + date.getMonth() + ':' + date.getFullYear(),
                total: 14000
            },
            {
                date: date.getDate() + ':' + date.getMonth() + ':' + date.getFullYear(),
                total: 14000
            },            {
                date: date.getDate() + ':' + date.getMonth() + ':' + date.getFullYear(),
                total: 14000
            }
            
        ]
        console.log(details);
        return res.render('home', {
            ...details
        });
    })
});

app.get('/cleaner/login', (req, res) => {
    res.render('cleaner/login');
});
app.get('/cleaner/dashboard', token.cleaner, (req, res) => {
    res.render('cleaner/dashboard');
});

app.use('/api/auth', authRouter);
app.use('/api/get', generalRouter);
app.use('/api/user', userRouter);
app.use('/api/cleaner', cleanerRouter);

app.get('/logout', (req, res) => {
    res.cookie('APP','',{maxAge:0});
    return res.json({
        success: true
    })
});

app.get('*', (req, res) => {
    res.json({
        code: 404,
        message: 'Error 404: Url not found'
    })
})

module.exports = app;