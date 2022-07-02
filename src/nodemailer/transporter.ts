var nodemailer = require('nodemailer');

export var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET, 
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
})



// export var transporter = nodemailer.createTransport({
//     pool: true,
//     maxConnections: 1,
//     service: "Hotmail",
//     auth: {
//         user: 'CarBuddyOrg@outlook.com',
//         pass: 'Pythonist98'
//     }
// })