//================
// PUERTO
//================

process.env.PORT = process.env.PORT || 3000;

//================
// ENTORNO
//================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; //'dev acá se usa para indicar que se está trabajando en desarrollo, de manera local

//================
// BASE DE DATOS
//================
let urlBD;

if (process.env.NODE_ENV === 'dev') {
    //BD local
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    // BD remota en MongoDB Atlas
    urlBD = 'mongodb+srv://wkadmin:rH38PxpenccNZr5r@cluster0-apwgs.mongodb.net/cafe';
}

process.env.urlBD = urlBD;