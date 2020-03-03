//================
// PUERTO
//================

process.env.PORT = process.env.PORT || 3000;

//================
// ENTORNO
//================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; //'dev acá se usa para indicar que se está trabajando en desarrollo, de manera local


//================
// FECHA DE EXPIRACIÓN DEL TOKEN   
//================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//================
// SEED de autenticación del token
//================

process.env.SEED = process.env.SEED || 'seed-de-desarrollo';
//Acá se usa SEED de la variable de entorno previamente configurada en Heroku para producción
// o la seed definida en el caso que la variable de entorno no exista, 
//lo cual indica que está trabajando en desarrollo

//================
// BASE DE DATOS
//================
let urlBD;

if (process.env.NODE_ENV === 'dev') {
    //BD local
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    // BD remota en MongoDB Atlas
    urlBD = process.env.MONGO_URI;
}

process.env.urlBD = urlBD;