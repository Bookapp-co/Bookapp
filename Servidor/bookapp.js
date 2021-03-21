


var express     	  =   require("express");
var app         	  =   express();
var bodyParser  	  =   require("body-parser");
var router      	  =   express.Router();
var mongoose 		    = 	require('mongoose');
var MongoClient 	  = 	require('mongodb').MongoClient
    , format 		    = 	require('util').format;
var ObjectId 		    = 	require('mongodb').ObjectId;
var dateFormat  	  = 	require('dateformat');
var moment 			    = 	require('moment');
var QRCode 			    = 	require('qrcode');
var gcm 			      = 	require('node-gcm');
var apn 			      = 	require('apn');
var nodemailer  	  =   require('nodemailer');
var smtpTransport 	= 	require('nodemailer-smtp-transport');
var handlebars 	  	= 	require('handlebars');
var fs 				      = 	require('fs');
var multer 			    = 	require('multer');
var stripe			    =   require('stripe')('sk_test_51HFV6DE5oHFxR7sy3xGadvegSNz9WxmVDc4zZnbEVOMhDSv5I0Htv78ApH4nzaV1y1AlbKrzd7JJvTulixaG71mJ00Z2yFtGSK');
var async 			    = 	require('async');
var mercadopago 	  = 	require('mercadopago');
var http 			      = 	require('http');
var https           =   require('https');
var socket			    =   require('socket.io')(http, { path: '/bookapp/socket.io'});
var Accountkit 		  = 	require ('node-accountkit');
var schedule 		    = 	require('node-schedule');
let fetch_api       =   require('node-fetch');
const { Headers }   =   require('node-fetch');
let base64          =   require('base-64');
let FormData        =   require('form-data');
let paypal          =   require('paypal-rest-sdk');
let uuid            =   require('node-uuid');
var rule 			      = 	new schedule.RecurrenceRule();
let request_api     = require('request')

function actualizar_tiempo_pedido(tipo, pedido, date_now, diffMins){
	var collection    =  datb.collection('Pedido');
	console.log("prueba 1");
	return new Promise(function (resolve, reject) {
		console.log("prueba 2");
		console.log(tipo);
		if( tipo === 1 ){

			collection.update(
				{ '_id' : ObjectId(pedido._id) },
		        { $set: {
					'status' : 5,
					'status_comentario' : "Autocancelado",
					'fecha_cancelacion' : date_now,
					"autocancelado_modal" : true
				} },
				function(err, result){
					console.log(" TIEMPO REGISTRADO ");
					console.log(pedido._id + " - - - " + diffMins);
					console.log("usuario_id;" + pedido.usuario_id);
					io.sockets.in(pedido.usuario_id).emit('autocancelacion:pedido', {});
					io.sockets.emit('refresh:pedidos', {});
					resolve();
			});

		}else{

			collection.update(
				{ '_id' : ObjectId(pedido._id) },
		        { $set: {
					'time_left' : diffMins
				} },
				function(err, result){
					// Action
					console.log(" TIEMPO REGISTRADO ");
					console.log(pedido._id + " - - - " + diffMins);
					io.sockets.emit('refresh:pedidos', {});
					resolve();
			});

		}
	});
}

mercadopago.configure({
    access_token: 'TEST-6997151496706823-020615-a7127df57f711fa7ef5545d28556c8c3-401575393'
});

Accountkit.set ("495572581269821", "bd5c4fa62b42278bbc9fe864fd1d7600", "v1.1");

const FCM = require('fcm-node');
// Replace these with your own values.
const apiKey = "AAAAF2R8Wjs:APA91bEZNMcj8L7yzaiW4MhH3VoYnUQ1IbdH5E_j_AG-HPg_5khf4GS6tvX2CVqVUeLNQWim5U-SKFkSJPRBDe5DkLg4QYViZ5ORS0PffEXaiXQCgPFxk_CVhfxtyALIiK-13Zbh5ePJ";
const fcm = new FCM(apiKey);

app.use(bodyParser({limit: '1024mb'}));
app.use(bodyParser.urlencoded({limit: '1024mb'}));
app.use(bodyParser());

app.use('/bookapp_fotos', express.static('bookapp_fotos'));
app.use('/bookapp', express.static('bookapp'));
app.use('/uploads', express.static('uploads_bookapp'));

// Run server to listen on port 3005.
var server = app.listen(4025, () => {
  console.log('Bookapp en *:4025 - Producción');
  console.log('READY');
});

var io = socket.listen(server);

// Database Mongo Connection //

	var datb;

  MongoClient.connect('mongodb://bookapppro:Bookapp09!@localhost:27017/bookapp', function(err, db) {
	    if(err) throw err;
	    datb = db;
	});

// Database Mongo Connection //

// Add Security Headers

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

	// var allowedOrigins = [
  //   'https://app.bookappapp.com' ,
  //   'https://www.app.bookappapp.com' ,
  //   'https://app.bookappapp.com' ,
  //   'https://www.app.bookappapp.com' ,
  //   'http://app.bookappapp.com' ,
  //   'http://www.app.bookappapp.com',
  //   'https://ebixteam.codigeek.com' ,
  //   'https://www.ebixteam.codigeek.com' ,
  //   'https://ebixteam.codigeek.com' ,
  //   'https://www.ebixteam.codigeek.com' ,
  //   'http://ebixteam.codigeek.com' ,
  //   'http://www.ebixteam.codigeek.com',
  //   'https://bookapp.mx' ,
  //   'https://www.bookapp.mx' ,
  //   'https://bookapp.mx' ,
  //   'https://www.bookapp.mx' ,
  //   'http://bookapp.mx' ,
  //   'http://www.bookapp.mx',
  //   "http://localhost:4210",
  //   "http://192.168.0.107:4210",
  //   "http://192.168.0.64:4210"
  // ];
	//   var origin = req.headers.origin;
	//   if(allowedOrigins.indexOf(origin) > -1){
	// 	   res.setHeader('Access-Control-Allow-Origin', origin);
	// }

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

// Add Security Headers

// FUNCTIONS

// FUNCTIONS

// IO SOCKETS

// Set socket.io listeners.
io.of('/bookapp/');
io.on('connection', (socket) => {
  	console.log('Usuario esta viendo bookapp');
	// socket.emit('message', { content: 'You are connected!', importance: '1' });
  	socket.on('join', function(data) { //Listen to any join event from connected users
		console.log("JoinSocket");
		console.log(data._id);
  		socket.user_id = data._id;
  		// socket.email   = data.email;
  		// socket.tipo_uid   = data.tipo_uid;
		//Privado por user _id
		socket.join(data._id);
        // socket.join(data._id); User joins a unique room/channel that's named after the userId
        // console.log("User joined room: " + data.user_id);
    });

	socket.on('mensaje_test', function(mensaje) {
		console.log("mensaje recibido");
	});

	socket.on('envia_ubicacion', function(ubicacion) {
		io.sockets.emit('transmite_ubicacion', ubicacion);
	});

	socket.on('ubicacion_conductor', function(viaje_track) {
		console.log("Ubicación registrada");
		io.sockets.in(viaje_track.viaje.usuario_id).emit('conductor_tiempo_real', { "viaje_track" : viaje_track });
	});

    socket.on('confirmacion_choferes', function(info) {
		console.log("confirmacion_choferes");
		console.log(info.choferes.length);
		// VIAJE
		info.viaje.modalidad_id = ObjectId(info.viaje.modalidad._id);
		info.viaje.modo_pago_id = ObjectId(info.viaje.modo_pago._id);
		info.viaje.usuario_id 	= ObjectId(info.viaje.usuario_id);
		if(info.viaje.seleccion.seleccion_para_quien === 2){
			info.viaje.negocio_id 	= ObjectId(info.viaje.negocio_id);
		}
		delete info.viaje.modalidad;
		delete info.viaje.modo_pago;
		var collection = datb.collection("Viaje");
		collection.insert(info.viaje, function(err, result) {
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				return res_err;
			}
			else{
				console.log("inserto choferes");
				console.log(result);
				info.viaje._id = result.insertedIds[0];
				for(var i = 0; i<info.choferes.length; i++){
					console.log(info.choferes[i]._id);
					io.sockets.in(info.choferes[i]._id).emit('nuevo_viaje', { "viaje" : info.viaje });
				}
			}
		});
    });

	socket.on('invitar_cliente', function(reservation) {
    	io.sockets.in(reservation.usuario_uid).emit('invitacion_cliente', { "message" : "Cliente invitado." });
    });

  	socket.on('disconnect', () => {
    	console.log('Usuario se fue de boarding pass');
  	});
});

// IO SOCKETS

// Router and Routes

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

var storage = multer.diskStorage({ //multers disk storage settings
	destination: function (req, file, cb) {
		cb(null, './uploads_bookapp/')
	},
	filename: function (req, file, cb) {
		console.log(file);
		var datetimestamp = Date.now();
		cb(null, file.originalname)
	}
});

var upload = multer({ //multer settings
	storage: storage
}).single('file');
/** API path that will upload the files */


var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function enviar_multiple_notificacion_socket(notificacion){
	// "cliente_id" : req.body.trabajo.usuario_id,
	// "trabajo_id" : req.body.trabajo._id,
	// "mensaje" 	 : "Se canceló un trabajo.",
	// "fecha_alta" : req.body.trabajo.fecha_alta,
	// "tipo" 		 : 3
	var collection    =  datb.collection('Solicitud_Trabajo');
	var bookapp_ids	  =  [];
    collection.aggregate([
		{ $match :  { "trabajo_id" : new ObjectId(notificacion.trabajo_id) } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
			for(var i = 0; i<result.length; i++){
				bookapp_ids.push(ObjectId(result[i].usuario_id));
			}
			collection	=  datb.collection('Usuario');
            collection.aggregate([
				{ $match :  { "_id" : { $in : bookapp_ids } } }
			]).toArray(function(err, bookapp){
				if(err){
					var res_err      = {};
					res_err.status   = "error";
					res_err.error    = err;
					res_err.message  = err;
					res.send(res_err);
				}else{
					for(var i = 0; i<bookapp.length; i++){
						collection			=  datb.collection('Notificacion');
						var notificacion_nanny = {};
						notificacion_nanny.trabajo_id = ObjectId(notificacion.trabajo_id);
						notificacion_nanny.usuario_id = ObjectId(bookapp[i]._id);
						notificacion_nanny.cliente_id = ObjectId(notificacion.cliente_id);
						notificacion_nanny.mensaje 	  = notificacion.mensaje;
						notificacion_nanny.fecha_alta = notificacion.fecha_alta;
						notificacion_nanny.tipo 	  = notificacion.tipo;
						collection.insert(notificacion_nanny, function(err, result) {
							if(err){
								var res_err      = {};
								res_err.status   = "error";
								res_err.error    = err;
								res_err.message  = err;
								return res_err;
							}
							else{
								console.log("Notificacion Cliente");
								console.log(notificacion.cliente_id);
								io.sockets.in(bookapp[i]).emit('trabajo_eliminado', { "notificacion" : notificacion_nanny });
								result.status  = "success";
								result.message = "Notificacion agregada.";
							}
						});
					}
				}
			});
        }
    });
}

function enviar_notificacion_socket(notificacion){
	var collection			=  datb.collection('Notificacion');
	notificacion.cliente_id = ObjectId(notificacion.cliente_id);
	notificacion.usuario_id = ObjectId(notificacion.usuario_id);
	notificacion.trabajo_id = ObjectId(notificacion.trabajo_id);
    collection.insert(notificacion, function(err, result) {
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            return res_err;
        }
        else{
			console.log("Notificacion Cliente");
			console.log(notificacion.cliente_id);
			io.sockets.in(notificacion.cliente_id).emit('nueva_notificacion', { "notificacion" : notificacion });
            result.status  = "success";
			result.message = "Notificacion agregada.";
			return result;
        }
    });
}

function enviarNotificacion_Usuario(usuario_id, title_p, message_p){
	console.log(usuario_id);
	collection 		 = datb.collection("Usuario");
	collection.aggregate([
    	{ $match :  { "_id": new ObjectId(usuario_id)}}
	]).toArray(function(err, result){
		var reg_tokens = [];
		if(result.length > 0){

			for(var i = 0; i<result.length; i++){
				if(result[i].registrationId != "" && result[i].registrationId != undefined){
					reg_tokens.push(result[i].registrationId);
				}
			}

			const message = {
				registration_ids: reg_tokens,
				data: {
					"title": title_p,
					"message": message_p,
					"image": "http://zcodiclean.codigeek.com/logo.png"
				}
			};

			console.log(reg_tokens);
			fcm.send(message, (err, response) => {
			  if (err) {
				console.log(err);
				console.log("Something has gone wrong!");
			  } else {
				console.log("Successfully sent with response: ", response);
			  }
			});
		}
    });
}

function enviar_test(correo, contrasena){

	let transporter = nodemailer.createTransport({
        host: 'mail.codigeek.com',
        port: 25,
        tls: {
			rejectUnauthorized:false
		},
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'contacto@codigeek.com', // generated ethereal user // operaciones@chronosingenieros.pe
            pass: 'Decaene09!1!'  // generated ethereal password
        }
    });
	readHTMLFile('plantillas_correo/recuperar_contrasena_pass.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements = {
			 contrasena_p : contrasena
		};
		var htmlToSend = template(replacements);
		var mailOptions = {
			from: 'contacto@codigeek.com', // sender address
			to: 'alanbarreraf@hotmail.com,'+correo, // list of receivers
			subject: 'Recupera tu clave', // Subject line
			text: 'Recupera tu clave', // Subject line
			html: htmlToSend // html body
		 };
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
		});
	});
}

function enviar_correo_viaje(correo, viaje){

	let transporter = nodemailer.createTransport({
        host: 'mail.codigeek.com',
        port: 25,
        tls: {
			rejectUnauthorized:false
		},
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'contacto@codigeek.com', // generated ethereal user // operaciones@chronosingenieros.pe
            pass: 'Decaene09!1!'  // generated ethereal password
        }
    });
	readHTMLFile('plantillas_correo/tu_viaje_pass.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements = {
			 chofer_p : viaje.conductor[0].name+" "+viaje.conductor[0].apellidos,
			 inicio_p : viaje.inicio.address,
			 destino_p : viaje.destino.address,
			 total_p : viaje.total_viaje,
			 fecha_p : viaje.alta,
			 necesitas_factura_p : "https://www.ebixteam.codigeek.com/#/pass/factura/"+viaje._id
		};
		var htmlToSend = template(replacements);
		var mailOptions = {
			from: 'contacto@codigeek.com', // sender address
			to: 'alanbarreraf@hotmail.com,'+correo, // list of receivers
			subject: 'Tu viaje con bookapp', // Subject line
			text: 'Tu viaje con bookapp', // Subject line
			html: htmlToSend // html body
		 };
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
		});
	});
}

function enviar_correo_viaje_factura(correo, viaje){

	let transporter = nodemailer.createTransport({
        host: 'mail.codigeek.com',
        port: 25,
        tls: {
			rejectUnauthorized:false
		},
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'contacto@codigeek.com', // generated ethereal user // operaciones@chronosingenieros.pe
            pass: 'Decaene09!1!'  // generated ethereal password
        }
    });
	readHTMLFile('plantillas_correo/tu_factura_pass.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements = {
			 chofer_p : viaje.conductor[0].name+" "+viaje.conductor[0].apellidos,
			 inicio_p : viaje.inicio.address,
			 destino_p : viaje.destino.address,
			 total_p : viaje.total_viaje,
			 fecha_p : viaje.alta,
			 factura_pass : viaje.factura_url
		};
		var htmlToSend = template(replacements);
		var mailOptions = {
			from: 'contacto@codigeek.com', // sender address
			to: 'alanbarreraf@hotmail.com,'+correo, // list of receivers
			subject: 'Factura de tu viaje', // Subject line
			text: 'Factura de tu viaje', // Subject line
			html: htmlToSend // html body
		 };
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
		});
	});
}

function enviar_correo_recuperar_contrasena(correo, codigo_p){
	let transporter = nodemailer.createTransport({
        host: 'mail.codigeek.com',
        port: 25,
        tls: {
			rejectUnauthorized:false
		},
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'contacto@codigeek.com', // generated ethereal user // operaciones@chronosingenieros.pe
            pass: 'Decaene09!1!'  // generated ethereal password
        }
    });
	readHTMLFile('plantillas_correo/ebixteam/recuperar_contrasena.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements = {
			 codigo_p : codigo_p
		};
		var htmlToSend = template(replacements);
		var mailOptions = {
			from: 'contacto@codigeek.com', // sender address
			to: 'alanbarreraf@hotmail.com', // list of receivers '+correo
			subject: 'Contacto', // Subject line
			text: 'Contacto', // Subject line
			html: htmlToSend // html body
		 };
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}else{
				console.log(info);
			}
		});
	});
}

function enviar_correo_registro_pass(correo){

	let transporter = nodemailer.createTransport({
        host: 'mail.codigeek.com',
        port: 25,
        tls: {
			rejectUnauthorized:false
		},
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'contacto@codigeek.com', // generated ethereal user // operaciones@chronosingenieros.pe
            pass: 'Decaene09!1!'  // generated ethereal password
        }
    });
	readHTMLFile('plantillas_correo/registro_pass.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements = {

		};
		var htmlToSend = template(replacements);
		var mailOptions = {
			from: 'contacto@bookapp.com', // sender address
			to: 'alanbarreraf@hotmail.com,'+correo, // list of receivers
			subject: 'Registro - bookapp', // Subject line
			text: 'Registro - bookapp', // Subject line
			html: htmlToSend // html body
		 };
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
		});
	});
}

function enviar_correo(correo, usuario, mensaje, solicitud){

	let transporter = nodemailer.createTransport({
        host: 'mail.codigeek.com',
        port: 25,
        tls: {
			rejectUnauthorized:false
		},
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'contacto@codigeek.com', // generated ethereal user // operaciones@chronosingenieros.pe
            pass: 'Decaene09!1!'  // generated ethereal password
        }
    });
	readHTMLFile('plantillas_correo/registro.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements = {
			 user_p : usuario
		};
		var htmlToSend = template(replacements);
		var mailOptions = {
			from: 'contacto@bookapp.com', // sender address
			to: 'alanbarreraf@hotmail.com,'+correo, // list of receivers
			subject: 'bookapp - Confirmación', // Subject line
			text: 'bookapp - Confirmación', // Subject line
			html: htmlToSend // html body
		 };
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
		});
	});
}

function enviar_correo_confirmacion_cita( correo_t, usuario_t, fecha_t, hora_t, negocio_t, servicio_t ){

  let transporter = nodemailer.createTransport({
        host: 'mail.codigeek.com',
        port: 25,
        tls: {
      rejectUnauthorized:false
    },
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'contacto@codigeek.com', // generated ethereal user // operaciones@chronosingenieros.pe
            pass: 'Decaene09!1!'  // generated ethereal password
        }
    });
  readHTMLFile('plantillas_correo/bookapp/confirmacion_cita.html', function(err, html) {
    var template = handlebars.compile(html);
    var replacements = {
       usuario_t : usuario_t,
       fecha_t : fecha_t,
       hora_t : hora_t,
       negocio_t : negocio_t,
       servicio_t : servicio_t
    };
    var htmlToSend = template(replacements);
    var mailOptions = {
      from: 'contacto@codigeek.com', // sender address
      to: 'alanbarreraf@hotmail.com,'+ correo_t, // list of receivers
      subject: 'Confirmación de reserva', // Subject line
      text: 'Confirmación de reserva', // Subject line
      html: htmlToSend // html body
     };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
    });
  });

}

function enviar_correo_confirmacion_cita_negocio( correo_t, usuario_t, fecha_t, hora_t, negocio_t, servicio_t, negocio_id_t ){

  var collection    =  datb.collection('Usuario');
  collection.aggregate([
  { $match :  { "status" : { $ne : 5 }, "negocio_id" : ObjectId(negocio_id_t), "tipo_usuario_id" : ObjectId("5c4050fa58209844a83c8623") }},
  { $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } },
  { $lookup: { from: "Negocio", localField: "sucursal_id", foreignField: "_id", as: "sucursal" } }
  ]).toArray(function(err, result){
      if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
      }else{

        if(result.length > 0){
          var usuario_negocio_t = result[0];

          let transporter = nodemailer.createTransport({
                host: 'mail.codigeek.com',
                port: 25,
                tls: {
              rejectUnauthorized:false
            },
                secure: false, // true for 465, false for other ports
                auth: {
                    user: 'contacto@codigeek.com', // generated ethereal user // operaciones@chronosingenieros.pe
                    pass: 'Decaene09!1!'  // generated ethereal password
                }
            });
          readHTMLFile('plantillas_correo/bookapp/confirmacion_cita.html', function(err, html) {
            var template = handlebars.compile(html);
            var replacements = {
               usuario_t : usuario_t,
               fecha_t : fecha_t,
               hora_t : hora_t,
               negocio_t : negocio_t,
               servicio_t : servicio_t
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
              from: 'contacto@codigeek.com', // sender address
              to: 'alanbarreraf@hotmail.com,'+ usuario_negocio_t.correo, // list of receivers
              subject: 'Confirmación de reserva', // Subject line
              text: 'Confirmación de reserva', // Subject line
              html: htmlToSend // html body
             };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
            });
          });
        }
      }
  });

}

function nueva_notificacion(
  pedido_id,
  not_usuario_id,
  fecha_alta,
  mensaje
){
  var notification_t = {
    pedido_id : pedido_id,
    not_usuario_id : not_usuario_id,
    fecha_alta : fecha_alta,
    mensaje : mensaje
  };
	var collection						=  datb.collection('Notificacion');
	notification_t.not_usuario_id 				=  ObjectId(notification_t.not_usuario_id);
    collection.insert(notification_t, function(err, result) {
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            return res_err;
        }
        else{
            result.status  = "success";
			result.message = "Notificacion agregada.";
			return result;
        }
    });
}


// APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp
// APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp
// APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp
// APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp // APP - bookapp


function correccion_de_correo ( usuario_t ){
  return new Promise(function (resolve, reject) {
    var collection    =  datb.collection('Usuario');
    collection.update(
      { '_id' : ObjectId(usuario_t._id) },
      { $set: {
        'correo' : usuario_t.correo.toString().trim()
      } },
      function(err, result){
        console.log("Actualizado: " + usuario_t._id);
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            resolve(result);
        }
    });
  });
}


function enviar_push_usuario( usuario_id, mensaje_t ){
  console.log("enviar_push_usuario");
  console.log(usuario_id);
  var collection    =  datb.collection('Usuario');
  collection.aggregate([
    { $match :  { "_id" : ObjectId(usuario_id) }}
  ]).toArray(function(err, result){
      if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
      }else{
        const message = {
          registration_ids: [ result[0].registrationId ] ,
          data: {
            forceShow: true,
            icon: "default",
            title: 'bookapp',
            message: mensaje_t,
            style: "inbox",
            // viaje: viaje,
            summaryText: mensaje_t,
          }
        };
        var note = new apn.Notification();
        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = 3;
        // note.sound = "ping.aiff";
        note.alert = mensaje_t,
        note.payload = {'messageFrom': 'protribe'};
        note.topic = "codigeek.protribe";
        // apnProvider.send(note, [ reg_id ]).then( (result) => {
          // console.log(result);
        // });
        fcm.send(message, (err, response) => {
          if (err) {
            console.log(err);
            console.log("Something has gone wrong!");
          } else {
            console.log(response);
          }
        });
      }
  });
}

function enviar_push_usuario_admin_negocio( negocio_id, mensaje_t ){
  console.log("enviar_push_usuario_admin_negocio");
  console.log(negocio_id);
  var collection	=  datb.collection('Negocio');
  collection.aggregate([
    { $match :  { "_id" : ObjectId(negocio_id) }}
  ]).toArray(function(err, result){
    if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
    }else{
      collection    =  datb.collection('Usuario');
      collection.aggregate([
        { $match :  { "_id" : ObjectId(result[0].usuario_id) }}
      ]).toArray(function(err, result){
          if(err){
              var res_err      = {};
              res_err.status   = "error";
              res_err.error    = err;
              res_err.message  = err;
              res.send(res_err);
          }else{
            const message = {
              registration_ids: [ result[0].registrationId ] ,
              data: {
                forceShow: true,
                icon: "default",
                title: 'bookapp',
                message: mensaje_t,
                style: "inbox",
                // viaje: viaje,
                summaryText: mensaje_t,
              }
            };
            var note = new apn.Notification();
            note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
            note.badge = 3;
            // note.sound = "ping.aiff";
            note.alert = mensaje_t,
            note.payload = {'messageFrom': 'protribe'};
            note.topic = "codigeek.protribe";
            // apnProvider.send(note, [ reg_id ]).then( (result) => {
              // console.log(result);
            // });
            fcm.send(message, (err, response) => {
              if (err) {
                console.log(err);
                console.log("Something has gone wrong!");
              } else {
                console.log(response);
              }
            });
          }
      });
    }
  });
}

function notificacionInternaUsuariosNegocio( negocio_id_t, pedidos_length ){
  var collection    =  datb.collection('Usuario');
  collection.aggregate([
    { $match :  { "negocio_id" : ObjectId(negocio_id_t) }},
  ]).toArray(function(err, result){
      if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
      }else{

        for( var i = 0; i<result.length; i++ ){
          console.log("sockets1: " +result[i]._id );
          io.sockets.in(result[0]._id.toString().trim()).emit('actualizar_pedidos_pendientes', { data : { tipo : 2, cantidad : pedidos_length } });
          enviar_push_usuario( result[i]._id.toString().trim(), pedidos_length+" Pending orders for action." );
        }

      }
  });
}

function tiempoRealPedidosNuevosYPendientes_AdminYNegocios( negocio_id_t ){
  var collection    =  datb.collection('Usuario');
  collection.aggregate([
    { $match :  { "negocio_id" : ObjectId(negocio_id_t) }},
  ]).toArray(function(err, result){
      if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
      }else{

        for( var i = 0; i<result.length; i++ ){
          console.log("sockets1: " +result[i]._id );
          io.sockets.in(result[i]._id.toString().trim()).emit('actualizar_pedidos_pendientes', { data : { tipo : 1, cantidad : 1, mensaje : "Nueva reserva" } });
        }

        collection.aggregate([
          { $match :  { "tipo_usuario_id" : ObjectId("5c4050f358209844a83c8622") }},
        ]).toArray(function(err, result2){
          if(err){
              var res_err      = {};
              res_err.status   = "error";
              res_err.error    = err;
              res_err.message  = err;
              res.send(res_err);
          }else{
              for( var i = 0; i<result2.length; i++ ){
                console.log("sockets2: " +result2[i]._id );
                io.sockets.in(result2[i]._id.toString().trim()).emit('actualizar_pedidos_pendientes', { data : { tipo : 1, cantidad : 1, mensaje : "Nueva reserva" } });
              }
          }
        });
      }
  });
}

router.get("/prueba_payu",function(req,res){
  var headers = {
    "Content-Type": "application/json"
  }
  fetch_api(
    "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi",
    {
      method: 'POST',
      headers: headers,
      body : {
         "language": "es",
         "command": "CREATE_TOKEN",
         "merchant": {
            "apiLogin": "pRRXKOl8ikMmt9u",
            "apiKey": "4Vj8eK4rloUd272L48hsrarnUA"
         },
         "creditCardToken": {
            "payerId": "10",
            "name": "full name",
            "identificationNumber": "32144457",
            "paymentMethod": "VISA",
            "number": "4111111111111111",
            "expirationDate": "2023/01"
         }
      }
    }
  )
  .then((results) => {
    console.log(results);
    res.send(results);
    // return res.json()
  })
  // .then((json) => {
  //   console.log(json);
  //   // Do something with the returned data.
  // });
});


router.get("/prueba_de_push_bookapp",function(req,res){
  const message = {
    registration_ids: [ "caIALtZrsTY:APA91bFDZ5zhPhw9mOEUmNDsaj2Ao_0P2GmvrUM6SSj1FL8RskXMAaU5P7BYw9puVvZuoUtkL2mHV6ThOTcBjQ2PYi_LeadKzXGwR_hBkEJx1IAxxsXPBqmdMHowx-IyqTTm3b1tRFGE" ] ,
    data: {
      forceShow: true,
      icon: "default",
      title: 'bookapp',
      message: 'Nueva notificación1',
      style: "inbox",
      // viaje: viaje,
      summaryText: 'Nueva notificación2',
    }
  };
  var note = new apn.Notification();
  note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
  note.badge = 3;
  // note.sound = "ping.aiff";
  note.alert = 'Nueva notificación1',
  note.payload = {'messageFrom': 'protribe'};
  note.topic = "codigeek.protribe";

  // apnProvider.send(note, [ reg_id ]).then( (result) => {
    // console.log(result);
  // });
  fcm.send(message, (err, response) => {
    if (err) {
    console.log(err);
    console.log("Something has gone wrong!");
    } else {
    // var res_data      = {};
    // res_data.status   = "success";
    // res_data.message  = "TEST";
    // res_data.data     = response;
    // res.send(res_data);
    console.log(response);
    }
  });
});

router.get("/corregir_correos",function(req,res){
  var collection    =  datb.collection('Usuario');
  collection.aggregate([
  ]).toArray(function(err, result){
      if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
      }
      else{
        console.log(result.length);
          for( var i = 0; i<result.length; i++ ){
            correccion_de_correo( result[i] );
          }
      }
  });
});

router.get("/test2",function(req,res){
    var res_err      = {};
    res_err.status   = "success";
    res_err.message  = "test";
    res.send(res_err);
});

router.post("/guardar_documento",function(req,res){
	upload(req,res,function(err){
		if(err){
			 res.json({error_code:1,err_desc:err});
			 return;
		}
		 res.json({error_code:0,err_desc:null});
	})
});

//accion_bookapper
router.post("/aceptar_pedido",function(req,res){
    var collection	=  datb.collection('Pedido');
    collection.aggregate([
		{ $match :  { "status" : 2 , "bookapper_id" : ObjectId(req.body.usuario._id) }}
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            if(result.length === 0){
            	collection.update(
					{ '_id' : ObjectId(req.body.pedido._id) },
			        { $set: {
						'bookapper_id' : ObjectId(req.body.usuario._id),
						'fecha_aceptado' : req.body.pedido.fecha_aceptado,
						'copia_ubicacion_inicio' : req.body.usuario.location,
						'status' : 2
					} },
					function(err, result){
						if(err){
							var res_err      = {};
							res_err.status   = "error";
							res_err.error    = err;
							res_err.message  = err;
							res.send(res_err);
						}
						else{
							io.sockets.in(req.body.pedido.usuario_id).emit('refresh:pedidos_en_curso_usuario', {});
							var res_err      = {};
							res_err.status   = "success";
							res_err.message  = "Servicio aceptado.";
							res.send(res_err);
						}
				});
            }else{
            	var res_err      = {};
				res_err.status   = "info";
				res_err.message  = "Ya tienes un pedido en curso, solo puedes tener un pedido activo.";
				res.send(res_err);
            }
        }
    });
});

router.post("/actualizar_registration_id",function(req,res){
    console.log("actualizar_registration_id");
    console.log(req.body.data.registrationId);
    var collection	=  datb.collection('Usuario');
    collection.update(
		{ '_id' : ObjectId(req.body.data._id) },
        { $set: {
        	'registrationId' : req.body.data.registrationId
		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				var res_err      = {};
				res_err.status   = "success";
				res_err.message  = "OK.";
				res.send(res_err);
			}
	});
});

router.post("/actualizar_tiempo",function(req,res){
    var collection	=  datb.collection('Tiempo_Minuto');
    if( !(req.body.data._id === "") ){
      collection.update(
  		{ '_id' : ObjectId(req.body.data._id) },
      { $set : {
          	'nombre' : req.body.data.nombre,
            'minutos' : req.body.data.minutos,
            'restaurante' : req.body.data.restaurante,
            'cancha' : req.body.data.cancha,
            'medico' : req.body.data.medico,
            'peluqueria' : req.body.data.peluqueria,
            'tolerancia' : req.body.data.tolerancia
  		  }
      },
  		function(err, result){
  			if(err){
  				var res_err      = {};
  				res_err.status   = "error";
  				res_err.error    = err;
  				res_err.message  = err;
  				res.send(res_err);
  			}
  			else{
  				var res_err      = {};
  				res_err.status   = "success";
  				res_err.message  = "Actualizado.";
  				res.send(res_err);
  			}
  	});
  }else{
    delete req.body.data._id;
    collection.insert(req.body.data, function(err, result) {
  		if(err){
  			var res_err      = {};
  			res_err.status   = "error";
  			res_err.error    = err;
  			res_err.message  = err;
  			res.send(res_err);
  		}
  		else{
        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Actualizado.";
        res.send(res_data);
      }
    });
  }
});

//accion_bookapper
router.post("/productos_recogidos",function(req,res){
    var collection	=  datb.collection('Pedido');
    collection.update(
		{ '_id' : ObjectId(req.body.pedido._id) },
        { $set: {
        	'costo_real' : req.body.pedido.costo_real,
			'fecha_recojo' : req.body.pedido.fecha_recojo,
			'status' : 3
		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				io.sockets.in(req.body.pedido.usuario_id).emit('refresh:pedidos_en_curso_usuario', {});
				var res_err      = {};
				res_err.status   = "success";
				res_err.message  = "OK.";
				res.send(res_err);
			}
	});
});

//accion_bookapper
router.post("/finalizar_pedido",function(req,res){
    var collection	=  datb.collection('Pedido');
    collection.update(
		{ '_id' : ObjectId(req.body.pedido._id) },
        { $set: {
        	'comision_bookapp' : req.body.pedido.comision_bookapp,
			'fecha_finalizacion' : req.body.pedido.fecha_finalizacion,
			'status' : 6
		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				io.sockets.in(req.body.pedido.usuario_id).emit('refresh:pedidos_en_curso_usuario', {});
				io.sockets.in(req.body.pedido.usuario_id).emit('finalizacion:usuario_pedido', {});
				var res_err      = {};
				res_err.status   = "success";
				res_err.message  = "OK.";
				res.send(res_err);
			}
	});
});

//accion_bookapper
router.post("/productos_entregados",function(req,res){
    var collection	=  datb.collection('Pedido');
    collection.update(
		{ '_id' : ObjectId(req.body.pedido._id) },
        { $set: {
			'fecha_entrega' : req.body.pedido.fecha_entrega,
			'tiempo_servicio' : req.body.pedido.tiempo_servicio,
			'status' : 4
		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				io.sockets.in(req.body.pedido.usuario_id).emit('refresh:pedidos_en_curso_usuario', {});
				var res_err      = {};
				res_err.status   = "success";
				res_err.message  = "OK.";
				res.send(res_err);
			}
	});
});

//accion_bookapper

router.post("/get_whatsapp",function(req,res){
    var collection	=  datb.collection('Whatsapp');
    collection.aggregate([
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Whatsapp";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_llave_2checkout",function(req,res){
    var res_data      		= {};
    res_data.status   		= "success";
    res_data.key  		    = "CBDF7A45-0FAB-4BB8-9495-D65E8181B3B3";
    res_data.mc  		      = "250390968041";
    res.send(res_data);
});

router.post("/get_categorias",function(req,res){
    var collection	=  datb.collection('Categoria');
    collection.aggregate([
      { $match :  { "status" : { $ne : 5 }  }}
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            for( var i = 0; i<result.length; i++ ){
                result[i].foto = result[i].foto+'?'+makeid();
            }
            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Categorias";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_publicidades",function(req,res){
    var collection	=  datb.collection('Publicidad');
    collection.aggregate([
      { $match :  { "status" : { $ne : 5 }  }}
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            for( var i = 0; i<result.length; i++ ){
                result[i].foto = result[i].foto+'?'+makeid();
            }
            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Publicidades";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_publicidades_negocio",function(req,res){
    var collection	=  datb.collection('Publicidad');
    collection.aggregate([
      { $match :  { "status" : { $ne : 5 }, "negocio_id" : ObjectId(req.body.negocio._id) }}
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            for( var i = 0; i<result.length; i++ ){
                result[i].foto = result[i].foto+'?'+makeid();
            }
            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Publicidades";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_publicidades_admin",function(req,res){
    var collection	=  datb.collection('Publicidad');
    collection.aggregate([
      { $match :  { "status" : { $ne : 5 } }},
  		{ $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            for( var i = 0; i<result.length; i++ ){
                result[i].foto = result[i].foto+'?'+makeid();
                if( result[i].negocio.length > 0 ){
                    result[i].negocio = result[i].negocio[0];
                }else{
                  delete result[i].negocio;
                }
            }
            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Publicidades";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_fotos_producto",function(req,res){
    var collection	=  datb.collection('Producto_Foto');
    collection.aggregate([
      { $match :  { "producto_id" : ObjectId(req.body.data._id)  }}
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            for( var i = 0; i<result.length; i++ ){

                result[i].foto = result[i].foto+'?'+makeid();
            }

            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Fotos";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_categorias_negocio_admin",function(req,res){
    var collection	=  datb.collection('Categoria_Negocio');
    collection.aggregate([
      { $match :  { "status" : { $ne : 5 }, "negocio_id" : ObjectId(req.body.data._id)  }},
  		{ $lookup: { from: "Platillo", localField: "_id", foreignField: "categoria_id", as: "platillos" } },
  		{ $lookup: { from: "Especialidad", localField: "especialidad_id", foreignField: "_id", as: "especialidad" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            for( var i = 0; i<result.length; i++ ){
                result[i].foto = result[i].foto+'?'+makeid();
                if( result[i].especialidad.length > 0 ){
                    result[i].especialidad = result[i].especialidad[0];
                }else{
                  delete result[i].especialidad;
                }
            }

            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Categorias";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_categorias_negocio",function(req,res){
    var collection	=  datb.collection('Categoria_Negocio');
    collection.aggregate([
      { $match :  { "status" : { $ne : 5 }, "negocio_id" : ObjectId(req.body.data._id)  }},
  		{ $lookup: { from: "Servicio", localField: "servicio_id", foreignField: "_id", as: "servicio" } },
      { $lookup: { from: "Tiempo_Hora", localField: "tiempo_id", foreignField: "_id", as: "tiempo" } },
      { $lookup: { from: "Tiempo_Minuto", localField: "tiempo_alquilacion_id", foreignField: "_id", as: "tiempo_alquilacion" } },
  		{ $lookup: { from: "Especialidad", localField: "especialidad_id", foreignField: "_id", as: "especialidad" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{

            for( var i = 0; i<result.length; i++ ){
              if( result[i].servicio.length > 0 ){
                  result[i].servicio = result[i].servicio[0];
              }else{
                delete result[i].servicio;
              }
              if( result[i].tiempo.length > 0 ){
                  result[i].tiempo = result[i].tiempo[0];
              }else{
                delete result[i].tiempo;
              }
              if( result[i].tiempo_alquilacion.length > 0 ){
                  result[i].tiempo_alquilacion = result[i].tiempo_alquilacion[0];
              }else{
                delete result[i].tiempo_alquilacion;
              }
              if( result[i].especialidad.length > 0 ){
                  result[i].especialidad = result[i].especialidad[0];
              }else{
                delete result[i].especialidad;
              }
            }

            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Categorias";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_categorias_negocio_promociones",function(req,res){
    var collection	=  datb.collection('Categoria_Negocio');
    collection.aggregate([
      { $match :  { "status" : { $ne : 5 }, promocion : true }},
  		{ $lookup: { from: "Servicio", localField: "servicio_id", foreignField: "_id", as: "servicio" } },
      { $lookup: { from: "Tiempo_Hora", localField: "tiempo_id", foreignField: "_id", as: "tiempo" } },
      { $lookup: { from: "Tiempo_Minuto", localField: "tiempo_alquilacion_id", foreignField: "_id", as: "tiempo_alquilacion" } },
      { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{

            for( var i = 0; i<result.length; i++ ){
              if( result[i].servicio.length > 0 ){
                  result[i].servicio = result[i].servicio[0];
              }else{
                delete result[i].servicio;
              }
              if( result[i].tiempo.length > 0 ){
                  result[i].tiempo = result[i].tiempo[0];
              }else{
                delete result[i].tiempo;
              }
              if( result[i].negocio.length > 0 ){
                  result[i].negocio = result[i].negocio[0];
              }else{
                delete result[i].negocio;
              }
              if( result[i].tiempo_alquilacion.length > 0 ){
                  result[i].tiempo_alquilacion = result[i].tiempo_alquilacion[0];
              }else{
                delete result[i].tiempo_alquilacion;
              }
            }

            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Categorias";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_categorias_negocio_peluqueros",function(req,res){
    var collection	=  datb.collection('Categoria_Negocio');
    collection.aggregate([
      { $match :  { "status" : { $ne : 5 }, "negocio_id" : ObjectId(req.body.data._id), "usuario_id" : ObjectId(req.body.usuario._id)  }},
  		{ $lookup: { from: "Servicio", localField: "servicio_id", foreignField: "_id", as: "servicio" } },
      { $lookup: { from: "Tiempo_Hora", localField: "tiempo_id", foreignField: "_id", as: "tiempo" } },
      { $lookup: { from: "Tiempo_Minuto", localField: "tiempo_alquilacion_id", foreignField: "_id", as: "tiempo_alquilacion" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{

            for( var i = 0; i<result.length; i++ ){
              if( result[i].servicio.length > 0 ){
                  result[i].servicio = result[i].servicio[0];
              }else{
                delete result[i].servicio;
              }
              if( result[i].tiempo.length > 0 ){
                  result[i].tiempo = result[i].tiempo[0];
              }else{
                delete result[i].tiempo;
              }
              if( result[i].tiempo_alquilacion.length > 0 ){
                  result[i].tiempo_alquilacion = result[i].tiempo_alquilacion[0];
              }else{
                delete result[i].tiempo_alquilacion;
              }
            }

            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Categorias";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

function insert_alerta_usuario ( alerta_id, usuario_id ){
  return new Promise(function (resolve, reject) {
    var collection						   =  datb.collection('Notificacion_Usuario');
    collection.insert({
      "alerta_id" : ObjectId(alerta_id),
      "usuario_id" : ObjectId(usuario_id)
    }, function(err, result) {
        if(err){
          resolve(err);
        }
        else{
          resolve(result);
        }
    });
  });
}

router.post("/enviar_alertas",function(req,res){

    var collection	=  datb.collection('Alerta');

    var alerta_t = {
      "titulo" : req.body.data.titulo,
      "mensaje" : req.body.data.mensaje,
      "fecha_alta" : req.body.data.fecha_alta
    }

    delete req.body.data._id;
    collection.insert(alerta_t, function(err, result) {
  		if(err){
  			var res_err      = {};
  			res_err.status   = "error";
  			res_err.error    = err;
  			res_err.message  = err;
  			res.send(res_err);
  		}
  		else{

  			var ins_id = result.insertedIds[0];

        for(var i = 0; i<req.body.usuarios.length; i++){
          insert_alerta_usuario( ins_id, req.body.usuarios[i]._id ).then(function (vals) {

            console.log("Se Genero Notificación");

          });
          nueva_notificacion(
            ins_id,
            req.body.usuarios[i]._id,
            new Date(),
            req.body.data.mensaje
          );
          enviar_push_usuario(req.body.usuarios[i]._id, req.body.data.titulo);
        }

        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Alerta enviada";
        res.send(res_data);

      }
    });
});

router.post("/enviar_alertas_con_ubicacion",function(req,res){

   var collection = datb.collection('Usuario');

   var tipos_usuarios_t = [];
   if( req.body.data.administradores ){
     tipos_usuarios_t.push(ObjectId("5c4050f358209844a83c8622"));
   }
   if( req.body.data.sucursales ){
     tipos_usuarios_t.push(ObjectId("5c4050fa58209844a83c8623"));
   }
   if( req.body.data.clientes ){
     tipos_usuarios_t.push(ObjectId("5c40513258209844a83c8629"));
   }

   collection.aggregate([
     { $geoNear: {
       near: {
         type: "Point",
         coordinates: [req.body.data.longitude, req.body.data.latitude]
       },
       distanceField: "dist.calculated",
       maxDistance: 550000,
       spherical: true
     }},
     { $match :
       {
         "registrationId" : { $exists : true },
         "tipo_usuario_id" : { $in : tipos_usuarios_t }
       }
     }
   ]).toArray(function(err, result){
       if(err){
           var res_err      = {};
           res_err.status   = "error";
           res_err.error    = err;
           res_err.message  = err;
           res.send(res_err);
       }else{
           var res_data      = {};
           res_data.status   = "success";
           res_data.message  = "Usuarios";
           res_data.data     = result;
           res.send(res_data);
       }
   });
});

router.post("/enviar_alertas_sin_ubicacion",function(req,res){

   var collection = datb.collection('Usuario');

   var tipos_usuarios_t = [];
   if( req.body.data.administradores ){
     tipos_usuarios_t.push(ObjectId("5c4050f358209844a83c8622"));
   }
   if( req.body.data.sucursales ){
     tipos_usuarios_t.push(ObjectId("5c4050fa58209844a83c8623"));
   }
   if( req.body.data.clientes ){
     tipos_usuarios_t.push(ObjectId("5c40513258209844a83c8629"));
   }

   collection.aggregate([
     { $match :
       {
         "registrationId" : { $exists : true },
         "tipo_usuario_id" : { $in : tipos_usuarios_t }
       }
     }
   ]).toArray(function(err, result){
       if(err){
           var res_err      = {};
           res_err.status   = "error";
           res_err.error    = err;
           res_err.message  = err;
           res.send(res_err);
       }else{
           var res_data      = {};
           res_data.status   = "success";
           res_data.message  = "Usuarios";
           res_data.data     = result;
           res.send(res_data);
       }
   });
});

router.post("/get_alertas",function(req,res){
    var collection	=  datb.collection('Alerta');
    collection.aggregate([
      { $match :  { "status" : { $ne : 5 }  }},
  		{ $lookup: { from: "Notificacion_Usuario", localField: "_id", foreignField: "alerta_id", as: "envios" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Alertas";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_promocion_pago_efectivo_sin_comision",function(req,res){
  var res_data      		= {};
  res_data.data     		= true;
  res.send(res_data);
});

router.post("/get_negocios",function(req,res){

    var filtros_categoria_t = {};

    if(req.body.filtro.categoria_id){
      filtros_categoria_t = { "categoria_id" : ObjectId(req.body.filtro.categoria_id) };
    }

    if(req.body.filtro.ubicacion){
      var collection	=  datb.collection('Negocio');
      collection.aggregate([
      { $geoNear: {
        near: {
          type: "Point",
          coordinates: [req.body.filtro.longitude, req.body.filtro.latitude]
        },
        distanceField: "distance",
        maxDistance: 25000,
        spherical: true
      }},
      { $match :  { "status" : { $nin : [ 5 ] } , "main" : true }},
      { $match :  filtros_categoria_t },
  		{ $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
  		{ $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
  		{ $lookup: { from: "Negocio", localField: "_id", foreignField: "marca_id", as: "sucursales" } },
      { $lookup: { from: "Negocio_Foto", localField: "_id", foreignField: "negocio_id", as: "galeria" } },
      ]).toArray(function(err, result){
          if(err){
              var res_err      = {};
              res_err.status   = "error";
              res_err.error    = err;
              res_err.message  = err;
              res.send(res_err);
          }
          else{

              for( var i = 0; i<result.length; i++ ){
                  if( result[i].usuario.length > 0 ){
                      delete result[i].usuario[0].telefono;
                      result[i].usuario = result[i].usuario[0];
                  }else{
                    delete result[i].usuario;
                  }
                  if( result[i].categoria.length > 0 ){
                      result[i].categoria = result[i].categoria[0];
                  }else{
                    delete result[i].categoria;
                  }
              }

              var res_data      		= {};
              res_data.status   		= "success";
              res_data.message  		= "Negocios";
              res_data.data     		= result;
              res.send(res_data);
          }
      });
    }else{
      var collection	=  datb.collection('Negocio');
      collection.aggregate([
      { $match :  { "status" : { $nin : [ 5 ] } , "main" : true }},
      { $match :  filtros_categoria_t },
  		{ $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
  		{ $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
  		{ $lookup: { from: "Negocio", localField: "_id", foreignField: "marca_id", as: "sucursales" } },
      { $lookup: { from: "Negocio_Foto", localField: "_id", foreignField: "negocio_id", as: "galeria" } },
      ]).toArray(function(err, result){
          if(err){
              var res_err      = {};
              res_err.status   = "error";
              res_err.error    = err;
              res_err.message  = err;
              res.send(res_err);
          }
          else{

              for( var i = 0; i<result.length; i++ ){
                  if( result[i].usuario.length > 0 ){
                      delete result[i].usuario[0].telefono;
                      result[i].usuario = result[i].usuario[0];
                  }else{
                    delete result[i].usuario;
                  }
                  if( result[i].categoria.length > 0 ){
                      result[i].categoria = result[i].categoria[0];
                  }else{
                    delete result[i].categoria;
                  }
              }

              var res_data      		= {};
              res_data.status   		= "success";
              res_data.message  		= "Negocios";
              res_data.data     		= result;
              res.send(res_data);
          }
      });
    }
});

router.post("/get_sucursales",function(req,res){
    var collection	=  datb.collection('Negocio');
    collection.aggregate([
      { $match :  { "status" : { $nin : [ 5 ] }, "marca_id" : ObjectId(req.body.data._id) }},
  		{ $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
  		{ $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
      { $lookup: { from: "Negocio_Foto", localField: "_id", foreignField: "negocio_id", as: "galeria" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{

            for( var i = 0; i<result.length; i++ ){
                if( result[i].usuario.length > 0 ){
                    delete result[i].usuario[0].telefono;
                    result[i].usuario = result[i].usuario[0];
                }else{
                  delete result[i].usuario;
                }
                if( result[i].categoria.length > 0 ){
                    result[i].categoria = result[i].categoria[0];
                }else{
                  delete result[i].categoria;
                }
            }

            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Sucursales";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_negocio_by_id",function(req,res){
    var collection	=  datb.collection('Negocio');
    collection.aggregate([
    { $match :  { "_id" : ObjectId(req.body.data._id) }},
		{ $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
		{ $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
    { $lookup: { from: "Negocio_Foto", localField: "_id", foreignField: "negocio_id", as: "galeria" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{

            for( var i = 0; i<result.length; i++ ){
                if( result[i].usuario.length > 0 ){
                    delete result[i].usuario[0].telefono;
                    result[i].usuario = result[i].usuario[0];
                }else{
                  delete result[i].usuario;
                }
                if( result[i].categoria.length > 0 ){
                    result[i].categoria = result[i].categoria[0];
                }else{
                  delete result[i].categoria;
                }
            }

            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Negocios";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_negocios_by_categoria",function(req,res){
    var collection	=  datb.collection('Negocio');
    if(!req.body.usuario){
      req.body.usuario = {
        latitude : req.body.ubicacion.latitude,
        longitude : req.body.ubicacion.longitude,
      }
    }else{
      if(!req.body.usuario.latitude){
        req.body.usuario = {
          latitude : req.body.ubicacion.latitude,
          longitude : req.body.ubicacion.longitude,
        }
      }
    }
    collection.aggregate([
      { $geoNear: {
        near: {
          type: "Point",
          coordinates: [req.body.usuario.longitude, req.body.usuario.latitude]
        },
        distanceField: "distance",
        maxDistance: 25000,
        spherical: true
      }},
      { $match :  { "categoria_id": ObjectId(req.body.data._id), "status" : { $nin : [ 4, 5 ] }, "main" : false  }},
  		{ $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
      { $lookup: { from: "Negocio_Foto", localField: "_id", foreignField: "negocio_id", as: "galeria" } },
      { $sort : { 'fecha_alta' : -1 } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            for( var i = 0; i<result.length; i++ ){
              // result[i].distancias_todas = result[i].distancias;
              // result[i].distancias = [];
              // for( var j = 0; j<result[i].distancias_todas.length; j++ ){
              //   if( result[i].distancias_todas[j].status != 5 ){
              //     result[i].distancias.push(
              //       result[i].distancias_todas[j]
              //     );
              //   }
              // }
              if( result[i].categoria.length > 0 ){
                  result[i].categoria = result[i].categoria[0];
              }else{
                delete result[i].categoria;
              }
            }
            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Negocios";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_negocios_by_categoria_especialidad",function(req,res){
    var collection    =  datb.collection('Especialidad_Negocio');
    collection.aggregate([
      { $match : { "status" : { $nin : [ 4, 5 ] }, "especialidad_id" : ObjectId(req.body.filtros.categoria_id) } },
      { $lookup: { from: "Especialidad", localField: "especialidad_id", foreignField: "_id", as: "especialidad" } },
      { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

            var negocios_t = [];

            for( var i = 0; i<result.length; i++ ){
              if( result[i].especialidad.length > 0 ){
                  result[i].especialidad = result[i].especialidad[0];
              }else{
                delete result[i].especialidad;
              }
              if( result[i].negocio.length > 0 ){
                  result[i].negocio = result[i].negocio[0];
              }else{
                delete result[i].negocio;
              }
              if(
                result[i].negocio.categoria_id.toString().trim() === req.body.data._id.toString().trim()
                &&
                ( result[i].negocio.status != 4 && result[i].negocio.status != 5 )
                && result[i].negocio.main === false
              ){
                negocios_t.push(ObjectId(result[i].negocio._id));
              }

            }

            collection	=  datb.collection('Negocio');
            if(!req.body.usuario){
              req.body.usuario = {
                latitude : req.body.ubicacion.latitude,
                longitude : req.body.ubicacion.longitude,
              }
            }else{
              if(!req.body.usuario.latitude){
                req.body.usuario = {
                  latitude : req.body.ubicacion.latitude,
                  longitude : req.body.ubicacion.longitude,
                }
              }
            }
            collection.aggregate([
              { $geoNear: {
                near: {
                  type: "Point",
                  coordinates: [req.body.usuario.longitude, req.body.usuario.latitude]
                },
                distanceField: "distance",
                maxDistance: 25000,
                spherical: true
              }},
              { $match :  { '_id' : { $in : negocios_t } }},
          		{ $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
              { $lookup: { from: "Negocio_Foto", localField: "_id", foreignField: "negocio_id", as: "galeria" } },
              { $sort : { 'fecha_alta' : -1 } },
            ]).toArray(function(err, result){
                if(err){
                    var res_err      = {};
                    res_err.status   = "error";
                    res_err.error    = err;
                    res_err.message  = err;
                    res.send(res_err);
                }
                else{
                    for( var i = 0; i<result.length; i++ ){
                      // result[i].distancias_todas = result[i].distancias;
                      // result[i].distancias = [];
                      // for( var j = 0; j<result[i].distancias_todas.length; j++ ){
                      //   if( result[i].distancias_todas[j].status != 5 ){
                      //     result[i].distancias.push(
                      //       result[i].distancias_todas[j]
                      //     );
                      //   }
                      // }
                      if( result[i].categoria.length > 0 ){
                          result[i].categoria = result[i].categoria[0];
                      }else{
                        delete result[i].categoria;
                      }
                    }
                    var res_data      		= {};
                    res_data.status   		= "success";
                    res_data.message  		= "Negocios";
                    res_data.data     		= result;
                    res.send(res_data);
                }
            });
        }
    });
});

router.post("/get_negocios_cerca_de_mi",function(req,res){
    var collection	=  datb.collection('Negocio');
    if(!req.body.usuario){
      req.body.usuario = {
        latitude : req.body.ubicacion.latitude,
        longitude : req.body.ubicacion.longitude,
      }
    }else{
      if(!req.body.usuario.latitude){
        req.body.usuario = {
          latitude : req.body.ubicacion.latitude,
          longitude : req.body.ubicacion.longitude,
        }
      }
    }
    collection.aggregate([
      { $geoNear: {
        near: {
          type: "Point",
          coordinates: [req.body.usuario.longitude, req.body.usuario.latitude]
        },
        distanceField: "distance",
        maxDistance: 25000,
        spherical: true
      }},
      { $match :  { "status" : { $nin : [ 4, 5 ] }, "main" : false }},
  		{ $lookup: { from: "Distancia", localField: "_id", foreignField: "negocio_id", as: "distancias" } },
  		{ $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
      { $lookup: { from: "Negocio_Foto", localField: "_id", foreignField: "negocio_id", as: "galeria" } },
      { $sort : { 'fecha_alta' : -1 } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            for( var i = 0; i<result.length; i++ ){
              result[i].distancias_todas = result[i].distancias;
              result[i].distancias = [];
              for( var j = 0; j<result[i].distancias_todas.length; j++ ){
                if( result[i].distancias_todas[j].status != 5 ){
                  result[i].distancias.push(
                    result[i].distancias_todas[j]
                  );
                }
              }
              if( result[i].categoria.length > 0 ){
                  result[i].categoria = result[i].categoria[0];
              }else{
                delete result[i].categoria;
              }
            }
            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Negocios";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_negocios_por_texto",function(req,res){
    var collection	=  datb.collection('Negocio');
    collection.aggregate([
      { $match   :  {
          nombre : { $regex : req.body.busqueda.texto },
          status : { $nin : [ 4, 5 ] }
        }
      },
      { $lookup: { from: "Negocio_Foto", localField: "_id", foreignField: "negocio_id", as: "galeria" } },
      { $sort : { 'fecha_alta' : -1 } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Negocios";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_usuarios",function(req,res){

    var filtros_t = {};

    if(req.body.filtro){
      if(req.body.filtro.tipo_usuario_id){
        if( req.body.filtro.tipo_usuario_id != "TODOS" ){
          filtros_t = { "tipo_usuario_id" : ObjectId(req.body.filtro.tipo_usuario_id) };
        }
      }
    }else{
      req.body.filtro = { ubicacion : false };
    }

    if(req.body.filtro.ubicacion){
      var collection    =  datb.collection('Usuario');
      collection.aggregate([
      { $geoNear: {
        near: {
          type: "Point",
          coordinates: [req.body.filtro.longitude, req.body.filtro.latitude]
        },
        distanceField: "distance",
        maxDistance: 25000,
        spherical: true
      }},
      { $match :  { "status" : { $ne : 5 }  }},
      { $match :  filtros_t },
  		{ $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } }
      ]).toArray(function(err, result){
          if(err){
              var res_err      = {};
              res_err.status   = "error";
              res_err.error    = err;
              res_err.message  = err;
              res.send(res_err);
          }else{

              for( var i = 0; i<result.length; i++ ){

                  if(result[i].foto){
                    result[i].foto = result[i].foto+'?'+makeid();
                  }

                  if( result[i].tipo_usuario.length > 0 ){
                      result[i].tipo_usuario = result[i].tipo_usuario[0];
                  }else{
                    delete result[i].tipo_usuario;
                  }
              }

              var res_data      = {};
              res_data.status   = "success";
              res_data.message  = "Usuarios";
              res_data.data     = result;
              res.send(res_data);
          }
      });
    }else{
      var collection    =  datb.collection('Usuario');
      collection.aggregate([
      { $match :  { "status" : { $ne : 5 }  }},
      { $match :  filtros_t },
  		{ $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } }
      ]).toArray(function(err, result){
          if(err){
              var res_err      = {};
              res_err.status   = "error";
              res_err.error    = err;
              res_err.message  = err;
              res.send(res_err);
          }else{

              for( var i = 0; i<result.length; i++ ){

                  if(result[i].foto){
                    result[i].foto = result[i].foto+'?'+makeid();
                  }

                  if( result[i].tipo_usuario.length > 0 ){
                      result[i].tipo_usuario = result[i].tipo_usuario[0];
                  }else{
                    delete result[i].tipo_usuario;
                  }
              }

              var res_data      = {};
              res_data.status   = "success";
              res_data.message  = "Usuarios";
              res_data.data     = result;
              res.send(res_data);
          }
      });
    }
});

router.post("/get_usuarios_negocio",function(req,res){
    var collection    =  datb.collection('Usuario');
    collection.aggregate([
    { $match :  { "status" : { $ne : 5 }, "negocio_id" : ObjectId(req.body.data._id)  }},
		{ $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } },
    { $lookup: { from: "Negocio", localField: "sucursal_id", foreignField: "_id", as: "sucursal" } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

            for( var i = 0; i<result.length; i++ ){

                if(result[i].foto){
                  result[i].foto = result[i].foto+'?'+makeid();
                }

                if( result[i].tipo_usuario.length > 0 ){
                    result[i].tipo_usuario = result[i].tipo_usuario[0];
                }else{
                  delete result[i].tipo_usuario;
                }
                if( result[i].sucursal.length > 0 ){
                    result[i].sucursal = result[i].sucursal[0];
                }else{
                  delete result[i].sucursal;
                }
            }

            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Usuarios";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_usuarios_negocio_peluqueros",function(req,res){
    var collection    =  datb.collection('Usuario');
    collection.aggregate([
    { $match :  { "status" : { $ne : 5 }, "negocio_id" : ObjectId(req.body.data._id), "tipo_usuario_id" : ObjectId("5c40513658209844a83c862a")  }},
		{ $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

            for( var i = 0; i<result.length; i++ ){

                if(result[i].foto){
                  result[i].foto = result[i].foto+'?'+makeid();
                }

                if( result[i].tipo_usuario.length > 0 ){
                    result[i].tipo_usuario = result[i].tipo_usuario[0];
                }else{
                  delete result[i].tipo_usuario;
                }
            }

            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Usuarios";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_usuarios_sucursal_peluqueros",function(req,res){
    var collection    =  datb.collection('Usuario');
    collection.aggregate([
    { $match :  { "status" : { $ne : 5 }, "sucursal_id" : ObjectId(req.body.data._id), "tipo_usuario_id" : ObjectId("5c40513658209844a83c862a")  }},
		{ $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

            for( var i = 0; i<result.length; i++ ){

                if(result[i].foto){
                  result[i].foto = result[i].foto+'?'+makeid();
                }

                if( result[i].tipo_usuario.length > 0 ){
                    result[i].tipo_usuario = result[i].tipo_usuario[0];
                }else{
                  delete result[i].tipo_usuario;
                }
            }

            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Usuarios";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_peluqueros",function(req,res){
    var collection    =  datb.collection('Usuario');
    collection.aggregate([
    { $match :  { "status" : { $ne : 5 },"tipo_usuario_id" : ObjectId("5c40513658209844a83c862a")  }},
		{ $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

            for( var i = 0; i<result.length; i++ ){

                if(result[i].foto){
                  result[i].foto = result[i].foto+'?'+makeid();
                }

                if( result[i].tipo_usuario.length > 0 ){
                    result[i].tipo_usuario = result[i].tipo_usuario[0];
                }else{
                  delete result[i].tipo_usuario;
                }
            }

            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Usuarios";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_usuarios_motofast",function(req,res){
    var collection    =  datb.collection('Usuario');
    collection.aggregate([
    { $match :  { "status" : { $ne : 5 }, "tipo_usuario_id" : ObjectId("5c40513658209844a83c862a")  }},
		{ $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

            for( var i = 0; i<result.length; i++ ){

                if(result[i].foto){
                  result[i].foto = result[i].foto+'?'+makeid();
                }

                if( result[i].tipo_usuario.length > 0 ){
                    result[i].tipo_usuario = result[i].tipo_usuario[0];
                }else{
                  delete result[i].tipo_usuario;
                }
            }

            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Usuarios";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_usuarios_repartidor_administrador",function(req,res){
    var collection    =  datb.collection('Usuario');
    collection.aggregate([
    { $match :  { "status" : { $ne : 5 }, "tipo_usuario_id" : ObjectId("5c40513658209844a83c862a"), "negocio_id" : { $exists : false }  }},
		{ $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

            for( var i = 0; i<result.length; i++ ){

                if(result[i].foto){
                  result[i].foto = result[i].foto+'?'+makeid();
                }

                if( result[i].tipo_usuario.length > 0 ){
                    result[i].tipo_usuario = result[i].tipo_usuario[0];
                }else{
                  delete result[i].tipo_usuario;
                }
            }

            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Usuarios";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_usuarios_repartidor_negocio",function(req,res){
    var collection    =  datb.collection('Usuario');
    collection.aggregate([
    { $match :  { "status" : { $ne : 5 }, "tipo_usuario_id" : ObjectId("5c40513658209844a83c862a"), "negocio_id" : ObjectId(req.body.negocio._id)  }},
		{ $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

            for( var i = 0; i<result.length; i++ ){

                if(result[i].foto){
                  result[i].foto = result[i].foto+'?'+makeid();
                }

                if( result[i].tipo_usuario.length > 0 ){
                    result[i].tipo_usuario = result[i].tipo_usuario[0];
                }else{
                  delete result[i].tipo_usuario;
                }
            }

            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Usuarios";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_pedido_activo_bookapper",function(req,res){
    var collection	=  datb.collection('Pedido');
    collection.aggregate([
		{ $match :  { "status" : { $in : [ 2,3,4 ] } , "bookapper_id" : ObjectId(req.body.usuario._id) }},
		{ $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
		{ $lookup: { from: "Rango_Costo", localField: "rango_id", foreignField: "_id", as: "rango" } },
		{ $lookup: { from: "Servicio", localField: "servicio_id", foreignField: "_id", as: "servicio" } },
		{ $lookup: { from: "Direccion", localField: "ubicacion_entrega_id", foreignField: "_id", as: "ubicacion_entrega" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Pedidos";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/set_tipo_get_modulos_tipo_usuario",function(req,res){

    var collection	=  datb.collection('Usuario');

    collection.update(
		{ '_id' : ObjectId(req.body.usuario._id) },
        { $set: {
			'tipo_usuario_id' : ObjectId(req.body.tipo_usuario._id)
		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				collection	=  datb.collection('Modulo');
				collection.aggregate([
					{ $match :  { "tipo_usuario_id" : ObjectId(req.body.tipo_usuario._id) }}
			    ]).toArray(function(err, result){
			        if(err){
			            var res_err      = {};
			            res_err.status   = "error";
			            res_err.error    = err;
			            res_err.message  = err;
			            res.send(res_err);
			        }
			        else{
			            var res_data      		= {};
			            res_data.status   		= "success";
			            res_data.message  		= "Modulos";
			            res_data.data     		= result;
			            res.send(res_data);
			        }
			    });
			}
	});
});

router.post("/get_tipo_vehiculo",function(req,res){
    var collection	=  datb.collection('Tipo_Vehiculo');
    collection.aggregate([
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Tipo_Vehiculo";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_tipo_moneda",function(req,res){
    var collection	=  datb.collection('Tipo_Moneda');
    collection.aggregate([
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Tipo_Moneda";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_configuracion",function(req,res){
    var collection	=  datb.collection('Configuracion');
    collection.aggregate([
  		{ $lookup: { from: "Tipo_Moneda", localField: "tipo_de_moneda_id", foreignField: "_id", as: "tipo_de_moneda" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            for( var i = 0; i<result.length; i++ ){
              if( result[i].tipo_de_moneda.length > 0 ){
                  result[i].tipo_de_moneda = result[i].tipo_de_moneda[0];
              }else{
                delete result[i].tipo_de_moneda;
              }
            }
            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Configuracion";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_tipo_pago",function(req,res){
    // var collection    =  datb.collection('Tipo_Pago');
    // collection.aggregate([
    //   { $match :  { "status" : { $ne : 5 } }}
    // ]).toArray(function(err, result){
    //     if(err){
    //         var res_err      = {};
    //         res_err.status   = "error";
    //         res_err.error    = err;
    //         res_err.message  = err;
    //         res.send(res_err);
    //     }else{
    //         collection =  datb.collection('Tipo_Usuario');
    //         collection.aggregate([
    //           { $match : { "_id" : ObjectId(req.body.usuario.tipo_usuario_id) } }
    //         ]).toArray(function(err, result){
    //             if(err){
    //                 var res_err      = {};
    //                 res_err.status   = "error";
    //                 res_err.error    = err;
    //                 res_err.message  = err;
    //                 res.send(res_err);
    //             }else{
    //                 var tipo_usuario_t = result[0];
    //                 var tipos_pago_t   = [];
    //                 if( tipo_usuario_t.efectivo ){
    //                   tipos_pago_t.push(
    //                     {
    //                       "_id" : "5e0a9048ce07baeb91675dbd",
    //                       "descripcion" : "Efectivo",
    //                       "icon" : "https://codigeek.com/projects/rivasgrill/cash.gif"
    //                     }
    //                   );
    //                 }
    //                 if( tipo_usuario_t.tarjeta ){
    //                   tipos_pago_t.push(
    //                     {
    //                       "_id" : "5e0a904ece07baeb91675dbe",
    //                       "descripcion" : "Tarjeta",
    //                       "icon" : "https://codigeek.com/projects/rivasgrill/card.gif"
    //                     }
    //                   );
    //                 }
    //                 var res_data      = {};
    //                 res_data.status   = "success";
    //                 res_data.message  = "Tipo_Pago";
    //                 res_data.data     = tipos_pago_t;
    //                 res.send(res_data);
    //             }
    //         });
    //     }
    // });
    var tipos_pago_t   = [];
    if( req.body.negocio.pago_efectivo ){
      tipos_pago_t.push(
        {
          "_id" : "5e0a9048ce07baeb91675dbd",
          "descripcion" : "Pago en establecimiento",
          "icon" : "https://codigeek.com/projects/rivasgrill/cash.gif"
        }
      );
    }
    if( req.body.negocio.pago_tarjeta ){
      tipos_pago_t.push(
        {
          "_id" : "5e0a904ece07baeb91675dbe",
          "descripcion" : "Pago online",
          "icon" : "https://codigeek.com/projects/rivasgrill/card.gif"
        }
      );
    }
    var res_data      = {};
    res_data.status   = "success";
    res_data.message  = "Tipo_Pago";
    res_data.data     = tipos_pago_t;
    res.send(res_data);
});

router.post("/get_tipo_pago_pide_lo_que_quieras",function(req,res){
    var tipos_pago_t   = [];
    tipos_pago_t.push(
      {
        "_id" : "5e0a9048ce07baeb91675dbd",
        "descripcion" : "Efectivo",
        "icon" : "https://codigeek.com/projects/rivasgrill/cash.gif"
      }
    );
    tipos_pago_t.push(
      {
        "_id" : "5e0a904ece07baeb91675dbe",
        "descripcion" : "Tarjeta",
        "icon" : "https://codigeek.com/projects/rivasgrill/card.gif"
      }
    );
    var res_data      = {};
    res_data.status   = "success";
    res_data.message  = "Tipo_Pago";
    res_data.data     = tipos_pago_t;
    res.send(res_data);
});

function guardarErroresStripe(info){
	var collection			=  datb.collection('Error_Stripe');
    collection.insert(info, function(err, result) {
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            return res_err;
        }
        else{

        }
    });
}

router.post("/get_usuario_tarjetas",function(req,res){
  collection    =  datb.collection('Usuario');
  collection.aggregate([
    { $match :  { "_id" : ObjectId(req.body.data._id) }}
  ]).toArray(function(err, result){
      if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
      }else{
        var stripe = require('stripe')('sk_test_51HFV6DE5oHFxR7sy3xGadvegSNz9WxmVDc4zZnbEVOMhDSv5I0Htv78ApH4nzaV1y1AlbKrzd7JJvTulixaG71mJ00Z2yFtGSK');
        stripe.customers.listSources(
        result[0].customer_id_prod,
        {object: 'card', limit: 10},
        function(err, cards) {
          if(err){
            console.log(err);
            guardarErroresStripe(err);
              var res_err      = {};
              res_err.status   = "error";
              res_err.error    = err;
              res_err.message  = err;
              res.send(res_err);
          }else{
              var res_data      = {};
              res_data.status   = "success";
              res_data.message  = "Tarjetas";
              res_data.data     = cards.data;
              res.send(res_data);
          }
        }
        );
      }
  });
});

router.get("/test_nueva_api",function(req,res){
    var headers = {
      "Content-Type": "application/json"
    }
    // fetch_api("https://cloud.abitmedia.com/api/payments/index?access-token=2y-13-tx-zsjtggeehkmygjbtsf-51z5-armmnw-ihbuspjufwubv4vxok6ery7wozao3wmggnxjgyg&initial_date=2020-01-01")
    // .then(response => response.json())
    // .then(data => {
    //   console.log(data)
    // })
    // .catch(err => {
    //   console.log(2,err);
    // })
    fetch_api(
      "https://cloud.abitmedia.com/api/payments/index?access-token=2y-13-tx-zsjtggeehkmygjbtsf-51z5-armmnw-ihbuspjufwubv4vxok6ery7wozao3wmggnxjgyg&initial_date=2020-01-01",
      {
        method: 'GET',
        headers: headers
      }
    )
      .then((res) => {
         return res.json()
    })
    .then((json) => {
      console.log(json);
      // Do something with the returned data.
    });
});

router.post("/guardar_tarjeta",function(req,res){
    console.log( req.body.data );
    console.log( req.body.tarjeta );
    var stripe = require('stripe')('sk_test_51HFV6DE5oHFxR7sy3xGadvegSNz9WxmVDc4zZnbEVOMhDSv5I0Htv78ApH4nzaV1y1AlbKrzd7JJvTulixaG71mJ00Z2yFtGSK');
    stripe.tokens.create(
      {
        card: {
          number: req.body.tarjeta.number,
          exp_month: req.body.tarjeta.exp_month,
          exp_year: req.body.tarjeta.exp_year,
          cvc: req.body.tarjeta.cvc
        },
      },
      function(err, token) {
        if(err){
        guardarErroresStripe(err);
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
          var collection =  datb.collection('Usuario');
          collection.aggregate([
            { $match :  { "_id" : ObjectId(req.body.data._id) }}
          ]).toArray(function(err, result){
              if(err){
                  var res_err      = {};
                  res_err.status   = "error";
                  res_err.error    = err;
                  res_err.message  = err;
                  res.send(res_err);
              }else{
                if(result[0].customer_id_prod){
                  stripe.customers.createSource(
                    result[0].customer_id_prod,
                    {source: token.id },
                    function(err, card) {

                      if(err){
                      guardarErroresStripe(err);
                          var res_err      = {};
                          res_err.status   = "error";
                          res_err.error    = err;
                          res_err.message  = err.message;
                          res.send(res_err);
                      }else{

                        var res_data      = {};
                        res_data.status   = "success";
                        res_data.message  = "Se guardo tu tarjeta con éxito.";
                        res_data.data     = card;
                        res.send(res_data);

                      }

                    }
                  );
                }else{
                  var res_data      = {};
                  res_data.status   = "error";
                  res_data.message  = "Cuenta no habilitada para guardar tarjeta.";
                  res.send(res_data);
                }
              }
          });
        }
      }
    );
});

function actualizar_ubicacion_pedido_individual ( pedido_t, usuario_t ){
  return new Promise(function (resolve, reject) {
    var collection    =  datb.collection('Pedido');
    //Cliente
    if( usuario_t.tipo_usuario_id === "5c40513258209844a83c8629" && pedido_t.tipo_servicio === 1 ){
      collection.update(
        { '_id' : ObjectId(pedido_t._id) },
        { $set: {
          'destino_direccion' : "Abrir la ubicación del usuario",
          'destino_latitude' : usuario_t.latitude,
          'destino_longitude' : usuario_t.longitude
        } },
        function(err, result){
          if(err){
              var res_err      = {};
              res_err.status   = "error";
              res_err.error    = err;
              res_err.message  = err;
              res.send(res_err);
          }else{
              resolve(result);
          }
      });
    }
    //Repartidor
    if( usuario_t.tipo_usuario_id === "5c40513658209844a83c862a" ){
      collection.update(
        { '_id' : ObjectId(pedido_t._id) },
        { $set: {
          'repartidor_direccion' : "Abrir la ubicación del repartidor",
          'repartidor_latitude'  : usuario_t.latitude,
          'repartidor_longitude' : usuario_t.longitude
        } },
        function(err, result){
          if(err){
              var res_err      = {};
              res_err.status   = "error";
              res_err.error    = err;
              res_err.message  = err;
              res.send(res_err);
          }else{
              resolve(result);
          }
      });
    }
  });
}

function notificar_admins_negocio_ubicacion_usuario( pedido_t, usuario_t ){
  return new Promise(function (resolve, reject) {
    var collection    =  datb.collection('Negocio');
    collection.aggregate([
      { $match :  { "_id" : ObjectId(pedido_t.negocio_id)  }}
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

            for( var i = 0; i<result.length; i++ ){
                io.sockets.in(result[i].usuario_id).emit('actualizar_pedidos_ubicacion', {});
            }

            resolve(result);
        }
    });
  });
}

router.post("/actualizar_ubicacion_pedidos",function(req,res){
  req.body.usuario.latitude  = req.body.ubicacion.latitude;
  req.body.usuario.longitude = req.body.ubicacion.longitude;

  var collection    =  datb.collection('Usuario');

  if( req.body.usuario.tipo_usuario_id === "5c40513658209844a83c862a" ){
    collection.update(
      { '_id' : ObjectId(req.body.usuario._id) },
      { $set: {
        'latitude' : req.body.usuario.latitude,
        'longitude' : req.body.usuario.longitude,
        'location'      :
          {
            type: "Point",
            coordinates: [ req.body.usuario.longitude, req.body.usuario.latitude ]
          }
      } },
      function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

        }
    });
  }

  collection    =  datb.collection('Pedido');
  collection.aggregate([
  { $match:  { $or : [ { 'usuario_id' : ObjectId(req.body.usuario._id) }, { 'motofast_id' : ObjectId(req.body.usuario._id) } ], 'status' : { $in:  [1,2,10]  } }  },
  { $sort : { 'fecha_alta' : -1 } },
  { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
  { $lookup: { from: "Usuario", localField: "motofast_id", foreignField: "_id", as: "motofast" } },
  { $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } }
  ]).toArray(function(err, result){
      if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
      }else{

          console.log("----------------------------");
          console.log("actualizar_ubicacion_pedidos");
          console.log("actualizar_ubicacion_pedidos");
          console.log("actualizar_ubicacion_pedidos");
          console.log(result.length);

          for( var i = 0; i<result.length; i++ ){
              if( result[i].usuario.length > 0 ){
                  result[i].usuario = result[i].usuario[0];
              }else{
                delete result[i].usuario;
              }
              if( result[i].motofast.length > 0 ){
                  result[i].motofast = result[i].motofast[0];
              }else{
                delete result[i].motofast;
              }
              if( result[i].negocio.length > 0 ){
                  result[i].negocio = result[i].negocio[0];
              }else{
                delete result[i].negocio;
              }
              actualizar_ubicacion_pedido_individual( result[i] , req.body.usuario );
              if(result[i].tipo_servicio === 1){
                notificar_admins_negocio_ubicacion_usuario( result[i] , req.body.usuario );
              }
              io.sockets.in(result[i].usuario_id).emit('actualizar_pedidos_ubicacion', {});
          }

          var res_data      = {};
          res_data.status   = "success";
          res_data.message  = "Pedidos en Curso";
          res_data.data     = result;
          res.send(res_data);
      }
  });
});

router.post("/actualizar_ubicacion_usuario",function(req,res){

  var collection  = datb.collection('Direccion');

  var direccion_t = {
    direccion  : req.body.usuario.direccion,
    referencia : req.body.usuario.referencia,
    latitude   : req.body.usuario.latitude,
    longitude  : req.body.usuario.longitude,
    usuario_id : ObjectId(req.body.usuario._id)
  };

  collection.insert( direccion_t , function(err, result) {
      if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
      }
      else{

        var direccion_id = result.insertedIds[0];

        collection	=  datb.collection('Usuario');
        collection.update(
    		    { '_id' : ObjectId(req.body.usuario._id) },
            { $set: {
              'direccion_id'  : ObjectId(direccion_id),
              'direccion'     : req.body.usuario.direccion,
              'referencia'    : req.body.usuario.referencia,
              'latitude'      : req.body.usuario.latitude,
              'longitude'     : req.body.usuario.longitude,
        			'location'      :
                {
                  type: "Point",
                  coordinates: [ req.body.usuario.longitude, req.body.usuario.latitude ]
                }
        		} },
    		function(err, result){
    			if(err){
    				var res_err      = {};
    				res_err.status   = "error";
    				res_err.error    = err;
    				res_err.message  = err;
    				res.send(res_err);
    			}
    			else{
            var res_err            = {};
            res_err.direccion_id   = direccion_id;
            res_err.status         = "success";
            res_err.message        = "Ubicación actualizada.";
            res.send(res_err);
          }
        });
      }
  });
});

router.post("/actualizar_ubicacion_bookapper",function(req,res){
	console.log("usuario update location");
    var collection	=  datb.collection('Usuario');
    collection.update(
		{ '_id' : ObjectId(req.body.usuario._id) },
        { $set: {
			'location' : { type: "Point", coordinates: [ req.body.usuario.location.lng, req.body.usuario.location.lat ] },
			// req.body.usuario.location
		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
			 	collection	=  datb.collection('Pedido');
			    collection.aggregate([
					{ $match :  { "status" : { $in : [ 2,3,4 ] } , "bookapper_id" : ObjectId(req.body.usuario._id) }},
					{ $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
					{ $lookup: { from: "Rango_Costo", localField: "rango_id", foreignField: "_id", as: "rango" } },
					{ $lookup: { from: "Servicio", localField: "servicio_id", foreignField: "_id", as: "servicio" } },
					{ $lookup: { from: "Direccion", localField: "ubicacion_entrega_id", foreignField: "_id", as: "ubicacion_entrega" } },
			    ]).toArray(function(err, result){
			        if(err){
			            var res_err      = {};
			            res_err.status   = "error";
			            res_err.error    = err;
			            res_err.message  = err;
			            res.send(res_err);
			        }
			        else{
			        	if(result.length === 0){
			        		var res_err      = {};
							res_err.status   = "success";
							res_err.message  = "Usuario actualizado.";
							res.send(res_err);
			        	}else{
			        		io.sockets.in(result[0].usuario_id).emit('refresh:ubicacion_bookapper_en_pedido', { bookapper : req.body.usuario });
			        		var res_err      = {};
							res_err.status   = "success";
							res_err.message  = "Usuario actualizado.";
							res.send(res_err);
			        	}
			        }
			    });
			}
	});
});

router.post("/busqueda_pedidos_bookapper",function(req,res){
    var collection    =  datb.collection('Pedido');
    if(req.body.usuario.location){
    	if( req.body.usuario.location.coordinates ){
    		req.body.usuario.location = {
    			"lat" : req.body.usuario.location.coordinates[1],
    			"lng" : req.body.usuario.location.coordinates[0]
    		}
    	}
    	if(req.body.usuario.location.lat){
	    	collection.aggregate([
				{ $geoNear: {
					near: {
						type: "Point",
						coordinates: [req.body.usuario.location.lng, req.body.usuario.location.lat]
					},
					distanceField: "dist.calculated",
					maxDistance: 1500000000000,
					spherical: true
				}},
				{ $match :  { "status" : 1 }},
				{ $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
				{ $lookup: { from: "Rango_Costo", localField: "rango_id", foreignField: "_id", as: "rango" } },
				{ $lookup: { from: "Servicio", localField: "servicio_id", foreignField: "_id", as: "servicio" } }
		    ]).toArray(function(err, result){
		        if(err){
		            var res_err      = {};
		            res_err.status   = "error";
		            res_err.error    = err;
		            res_err.message  = err;
		            res.send(res_err);
		        }else{

		        	var pedidos_pool = result;

		            collection.aggregate([
						{ $match :  { "status" : 2 , "bookapper_id" : ObjectId(req.body.usuario._id) }},
						{ $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
						{ $lookup: { from: "Rango_Costo", localField: "rango_id", foreignField: "_id", as: "rango" } }
				    ]).toArray(function(err, result){
				        if(err){
				            var res_err      = {};
				            res_err.status   = "error";
				            res_err.error    = err;
				            res_err.message  = err;
				            res.send(res_err);
				        }else{
				            var res_data      		= {};
				            res_data.status   		= "success";
				            res_data.message  		= "Pedidos cerca";
				            res_data.data     		= pedidos_pool;
				            res_data.pedido_activo 	= result;
				            res.send(res_data);
				        }
				    });
		        }
		    });
		}else{
			var res_data      = {};
	        res_data.status   = "success";
	        res_data.message  = "Pedidos cerca";
	        res_data.data     = [];
	        res.send(res_data);
		}
	}else{
		var res_data      = {};
        res_data.status   = "info";
        res_data.message  = "Sin ubicación";
        res_data.data     = [];
        res.send(res_data);
	}
});

router.post("/guardar_galeria_producto",function(req,res){
  var collection	 	 =  datb.collection('Producto_Foto');
	var foto			     =  req.body.imagen.foto;
  var id_foto        =  makeid();


	if(foto.includes("data")){
		req.body.imagen.foto =
		'https://codigeek.app/bookapp/bookapp_fotos/'+id_foto+'_foto_articulo.png';
		var data = foto.replace(/^data:image\/\w+;base64,/, "");
		var buf = new Buffer(data, 'base64');
		fs.writeFile('bookapp_fotos/'+id_foto+'_foto_articulo.png', buf);
	}

  var imagen_producto = {
    foto : req.body.imagen.foto ,
    producto_id : ObjectId(req.body.data._id)
  }

  collection.insert(imagen_producto, function(err, result) {
    if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
    }
    else{
      var res_data      = {};
      res_data.status   = "success";
      res_data.message  = "Galería guardada.";
      res.send(res_data);
    }
  });

});

router.post("/guardar_galeria_negocio",function(req,res){
  var collection	 	 =  datb.collection('Negocio_Foto');
	var foto			     =  req.body.imagen.foto;
  var id_foto        =  makeid();


	if(foto.includes("data")){
		req.body.imagen.foto =
		'https://codigeek.app/bookapp/bookapp_fotos/'+id_foto+'_foto_negocio_galeria.png';
		var data = foto.replace(/^data:image\/\w+;base64,/, "");
		var buf = new Buffer(data, 'base64');
		fs.writeFile('bookapp_fotos/'+id_foto+'_foto_negocio_galeria.png', buf);
	}

  var imagen_producto = {
    foto : req.body.imagen.foto ,
    negocio_id : ObjectId(req.body.data._id)
  }

  collection.insert(imagen_producto, function(err, result) {
    if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
    }
    else{
      var res_data      = {};
      res_data.status   = "success";
      res_data.message  = "Foto guardada.";
      res.send(res_data);
    }
  });

});

router.post("/actualizar_banner",function(req,res){
  var collection	 	 =  datb.collection('Negocio');
	var foto			      =  req.body.data.banner_image;

  	if(foto.includes("data")){
  		req.body.data.banner_image =
  		'https://codigeek.app/bookapp/bookapp_fotos/'+req.body.data._id+'_negocio_banner.png';
  		var data = foto.replace(/^data:image\/\w+;base64,/, "");
  		var buf = new Buffer(data, 'base64');
  		fs.writeFile('bookapp_fotos/'+req.body.data._id+'_negocio_banner.png', buf);
  	}

    collection.update(
		{ '_id' : ObjectId(req.body.data._id) },
        { $set: {
			'banner_image' : req.body.data.banner_image,
		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				var res_err      = {};
				res_err.status   = "success";
				res_err.message  = "Banner actualizado.";
				res_err.foto  	 = 'https://codigeek.app/bookapp/bookapp_fotos/'+req.body.data._id+'_negocio_banner.png'+'?'+makeid();
				res.send(res_err);
			}
	});
});

router.post("/actualizar_logo",function(req,res){
  var collection	 	 =  datb.collection('Negocio');
	var foto			      =  req.body.data.foto;

  	if(foto.includes("data")){
  		req.body.data.foto =
  		'https://codigeek.app/bookapp/bookapp_fotos/'+req.body.data._id+'_negocio_logo.png';
  		var data = foto.replace(/^data:image\/\w+;base64,/, "");
  		var buf = new Buffer(data, 'base64');
  		fs.writeFile('bookapp_fotos/'+req.body.data._id+'_negocio_logo.png', buf);
  	}

    collection.update(
		{ '_id' : ObjectId(req.body.data._id) },
        { $set: {
			'foto' : req.body.data.foto,
		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				var res_err      = {};
				res_err.status   = "success";
				res_err.message  = "Logo actualizado.";
				res_err.foto  	 = 'https://codigeek.app/bookapp/bookapp_fotos/'+req.body.data._id+'_negocio_logo.png'+'?'+makeid();
				res.send(res_err);
			}
	});
});

router.post("/solicitud_bookapper",function(req,res){
    var collection	 					=  datb.collection('Usuario');
	var foto							=  req.body.usuario.foto;
	var foto_frontal_identificacion		=  req.body.usuario.foto_frontal_identificacion;
	var foto_posterior_identificacion	=  req.body.usuario.foto_posterior_identificacion;
	var foto_frontal_licencia			=  req.body.usuario.foto_frontal_licencia;
	var foto_posterior_licencia			=  req.body.usuario.foto_posterior_licencia;
	var foto_frontal_seguro				=  req.body.usuario.foto_frontal_seguro;
	var foto_posterior_seguro			=  req.body.usuario.foto_posterior_seguro;
	var foto_frontal_propiedad			=  req.body.usuario.foto_frontal_propiedad;
	var foto_posterior_propiedad		=  req.body.usuario.foto_posterior_propiedad;

	if(foto.includes("data")){
		req.body.usuario.foto =
		'https://codigeek.app/bookapp/bookapp_bookapper_info/'+req.body.usuario._id+'foto_bookapper.png';
		var data = foto.replace(/^data:image\/\w+;base64,/, "");
		var buf = new Buffer(data, 'base64');
		fs.writeFile('bookapp_bookapper_info/'+req.body.usuario._id+'foto_bookapper.png', buf);
	}
	if(foto_frontal_identificacion.includes("data")){
		req.body.usuario.foto_frontal_identificacion =
		'https://codigeek.app/bookapp/bookapp_bookapper_info/'+req.body.usuario._id+'foto_frontal_identificacion.png';
		var data = foto_frontal_identificacion.replace(/^data:image\/\w+;base64,/, "");
		var buf = new Buffer(data, 'base64');
		fs.writeFile('bookapp_bookapper_info/'+req.body.usuario._id+'foto_frontal_identificacion.png', buf);
	}
	if(foto_posterior_identificacion.includes("data")){
		req.body.usuario.foto_posterior_identificacion =
		'https://codigeek.app/bookapp/bookapp_bookapper_info/'+req.body.usuario._id+'foto_posterior_identificacion.png';
		var data = foto_posterior_identificacion.replace(/^data:image\/\w+;base64,/, "");
		var buf = new Buffer(data, 'base64');
		fs.writeFile('bookapp_bookapper_info/'+req.body.usuario._id+'foto_posterior_identificacion.png', buf);
	}
	if(foto_frontal_licencia.includes("data")){
		req.body.usuario.foto_frontal_licencia =
		'https://codigeek.app/bookapp/bookapp_bookapper_info/'+req.body.usuario._id+'foto_frontal_licencia.png';
		var data = foto_frontal_licencia.replace(/^data:image\/\w+;base64,/, "");
		var buf = new Buffer(data, 'base64');
		fs.writeFile('bookapp_bookapper_info/'+req.body.usuario._id+'foto_frontal_licencia.png', buf);
	}
	if(foto_posterior_licencia.includes("data")){
		req.body.usuario.foto_posterior_licencia =
		'https://codigeek.app/bookapp/bookapp_bookapper_info/'+req.body.usuario._id+'foto_posterior_licencia.png';
		var data = foto_posterior_licencia.replace(/^data:image\/\w+;base64,/, "");
		var buf = new Buffer(data, 'base64');
		fs.writeFile('bookapp_bookapper_info/'+req.body.usuario._id+'foto_posterior_licencia.png', buf);
	}
	if(foto_frontal_seguro.includes("data")){
		req.body.usuario.foto_frontal_seguro =
		'https://codigeek.app/bookapp/bookapp_bookapper_info/'+req.body.usuario._id+'foto_frontal_seguro.png';
		var data = foto_frontal_seguro.replace(/^data:image\/\w+;base64,/, "");
		var buf = new Buffer(data, 'base64');
		fs.writeFile('bookapp_bookapper_info/'+req.body.usuario._id+'foto_frontal_seguro.png', buf);
	}
	if(foto_posterior_seguro.includes("data")){
		req.body.usuario.foto_posterior_seguro =
		'https://codigeek.app/bookapp/bookapp_bookapper_info/'+req.body.usuario._id+'foto_posterior_seguro.png';
		var data = foto_posterior_seguro.replace(/^data:image\/\w+;base64,/, "");
		var buf = new Buffer(data, 'base64');
		fs.writeFile('bookapp_bookapper_info/'+req.body.usuario._id+'foto_posterior_seguro.png', buf);
	}
	if(foto_frontal_propiedad.includes("data")){
		req.body.usuario.foto_frontal_propiedad =
		'https://codigeek.app/bookapp/bookapp_bookapper_info/'+req.body.usuario._id+'foto_frontal_propiedad.png';
		var data = foto_frontal_propiedad.replace(/^data:image\/\w+;base64,/, "");
		var buf = new Buffer(data, 'base64');
		fs.writeFile('bookapp_bookapper_info/'+req.body.usuario._id+'foto_frontal_propiedad.png', buf);
	}
	if(foto_posterior_propiedad.includes("data")){
		req.body.usuario.foto_posterior_propiedad =
		'https://codigeek.app/bookapp/bookapp_bookapper_info/'+req.body.usuario._id+'foto_posterior_propiedad.png';
		var data = foto_posterior_propiedad.replace(/^data:image\/\w+;base64,/, "");
		var buf = new Buffer(data, 'base64');
		fs.writeFile('bookapp_bookapper_info/'+req.body.usuario._id+'foto_posterior_propiedad.png', buf);
	}

    collection.update(
		{ '_id' : ObjectId(req.body.usuario._id) },
        { $set: {
			'foto' : req.body.usuario.foto,
			'foto_frontal_identificacion' : req.body.usuario.foto_frontal_identificacion,
			'foto_posterior_identificacion' : req.body.usuario.foto_posterior_identificacion,
			'foto_frontal_licencia' : req.body.usuario.foto_frontal_licencia,
			'foto_posterior_licencia' : req.body.usuario.foto_posterior_licencia,
			'foto_frontal_seguro' : req.body.usuario.foto_frontal_seguro,
			'foto_posterior_seguro' : req.body.usuario.foto_posterior_seguro,
			'foto_frontal_propiedad' : req.body.usuario.foto_frontal_propiedad,
			'foto_posterior_propiedad' : req.body.usuario.foto_posterior_propiedad,
			'nombre_completo' : req.body.usuario.nombre_completo,
			'fecha_nacimiento' : req.body.usuario.fecha_nacimiento,
			'tipo_vehiculo_id' : ObjectId(req.body.usuario.tipo_vehiculo_id),
			'marca_vehiculo' : req.body.usuario.marca_vehiculo,
			'modelo_vehiculo' : req.body.usuario.modelo_vehiculo,
			'placa_vehiculo' : req.body.usuario.placa_vehiculo,
			'identificacion_oficial' : req.body.usuario.identificacion_oficial,
			'direccion_identificacion_oficial' : req.body.usuario.direccion_identificacion_oficial,
			'solicitud_bookapper' : 1, // Solicitud por aprobar
			'fecha_solicitud' : req.body.usuario.fecha_solicitud
		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				var res_err      = {};
				res_err.status   = "success";
				res_err.message  = "Solicitud realizada.";
				res_err.foto  	 = req.body.usuario.foto+'?'+makeid();
				res.send(res_err);
			}
	});
});

router.post("/registrar_usuario",function(req,res){
    var collection                  = datb.collection('Usuario');
    var email_register              = req.body.data.email;
	req.body.data.tipo_usuario_id	= ObjectId(req.body.data.tipo_usuario_id);
	req.body.data.codigo_inv		= makeid();

	var foto 						= req.body.data.foto;
	req.body.data.foto 				= "";

    collection.find( { "email" : email_register } ).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            if(result.length === 0){
				// mercadopago.customers.create({"email" : req.body.data.correo} , function (err, customer) {
					// if(err){
						// var res_err      = {};
						// res_err.status   = "error";
						// res_err.error    = err;
						// res_err.message  = err;
						// res.send(res_err);
					// }
					// console.log(customer);
					// console.log(customer.id);
					// console.log(customer.body.id);
					// req.body.data.customer_id = customer.body.id;
					collection.insert(req.body.data, function(err, result_usuario) {
						if(err){
							var res_err      = {};
							res_err.status   = "error";
							res_err.error    = err;
							res_err.message  = err;
							res.send(res_err);
						}
						else{

							var usuario_insertado = result_usuario;

							if(foto.includes("data")){
								req.body.data.foto =
								'https://codigeek.app/bookapp/bookapp_fotos/'+usuario_insertado.ops[0]._id+'_usuario_foto.png';
								var data = foto.replace(/^data:image\/\w+;base64,/, "");
								var buf = new Buffer(data, 'base64');
								fs.writeFile('bookapp_fotos/'+usuario_insertado.ops[0]._id+'_usuario_foto.png', buf);
							}

							collection.update(
								{ '_id' : ObjectId(usuario_insertado.ops[0]._id) },
								{ $set: {
									'foto' : req.body.data.foto
								} },
								function(err, result){
									if(err){
										var res_err      = {};
										res_err.status   = "error";
										res_err.error    = err;
										res_err.message  = err;
										res.send(res_err);
									}
									else{
										collection.aggregate([
											{ $match :  { "_id": usuario_insertado.ops[0]._id } },
											{ $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } }
										]).toArray(function(err, result){
											if(err){
												var res_err      = {};
												res_err.status   = "error";
												res_err.error    = err;
												res_err.message  = err;
												res.send(res_err);
											}else{
												enviar_correo_registro_pass(email_register);
												var res_data      = {};
												res_data.status   = "success";
												res_data.message  = "Usuario";
												res_data.data     = result;
												res.send(res_data);
											}
										});
									}
							});
						}
					});
				// })
            }else{
                var res_err      = {};
                res_err.status   = "info";
                res_err.message  = "Este correo electrónico ya fue registrado anteriormente.";
                res.send(res_err);
            }
        }
    });
});

router.post("/actualizar_hacienda",function(req,res){
    var collection						=  datb.collection('Hacienda');
    collection.update(
		{ '_id' : ObjectId(req.body.data._id) },
        { $set: {
			'nombre' : req.body.data.nombre
		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				var res_err      = {};
				res_err.status   = "success";
				res_err.message  = "Hacienda actualizada.";
				res.send(res_err);
			}
	});
});

router.post("/actualizar_general",function(req,res){
    var collection						=  datb.collection('Rotacion');
	var usuarios = [];
	for(var i = 0; i<req.body.rotacion.usuarios.length; i++){
		usuarios.push( { "_id" : ObjectId(req.body.rotacion.usuarios[i]._id) });
	}
	req.body.rotacion.usuarios = usuarios;
    collection.update(
		{ '_id' : ObjectId(req.body.rotacion._id) },
        { $set: {
			'usuarios' : req.body.rotacion.usuarios
		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				collection.aggregate([
					{ $match :  { "_id": ObjectId(req.body.rotacion._id) }},
					{ $lookup: { from: "Hacienda", localField: "hacienda_id", foreignField: "_id", as: "hacienda" } },
					{ $unwind: { path: "$usuarios" } },
					{ $lookup: { from: "Usuario", localField: "usuarios._id", foreignField: "_id", as: "usuarios_rotacion" } },
					{ $unwind: { path: "$usuarios_rotacion" } },
					{
						$group: {
							"_id" : "$_id",
							"hacienda" : { "$first": "$hacienda" },
							"hora_inicio" : { "$first": "$hora_inicio" },
							"hora_fin" : { "$first": "$hora_fin" },
							"potreros" : { "$first": "$potreros" },
							"fechas_rotaciones" : { "$first": "$fechas_rotaciones" },
							"titulo" : { "$first": "$titulo" },
							"descripcion" : { "$first": "$descripcion" },
							"dias_descanso" : { "$first": "$dias_descanso" },
							"numero_animales" : { "$first": "$numero_animales" },
							"peso_promedio" : { "$first": "$peso_promedio" },
							"consumo" : { "$first": "$consumo" },
							"fecha_rotacion" : { "$first": "$fecha_rotacion" },
							"fechas_rotaciones" : { "$first": "$fechas_rotaciones" },
							"consumo_pasto_ugg" : { "$first": "$consumo_pasto_ugg" },
							"porcentaje_consumo_animal_dia" : { "$first": "$porcentaje_consumo_animal_dia" },
							"hacienda_id" : { "$first": "$hacienda_id" },
							"usuario_id" : { "$first": "$usuario_id" },
							"usuarios" : { "$push": "$usuarios_rotacion" }
						}
					},
				]).toArray(function(err, rotaciones){
					if(err){
						var res_err      = {};
						res_err.status   = "error";
						res_err.error    = err;
						res_err.message  = err;
						res.send(res_err);
					}else{
						var res_data      = {};
						res_data.status   = "success";
						res_data.message  = "Rotación actualizada";
						res_data.data     = rotaciones;
						res.send(res_data);
					}
				});
			}
	});
});

router.post("/actualizar_fechas",function(req,res){
    var collection						=  datb.collection('Rotacion');
	for(var i = 0; i<req.body.rotacion.fechas_rotaciones.length; i++){
		req.body.rotacion.fechas_rotaciones[i].potrero_id = ObjectId(req.body.rotacion.fechas_rotaciones[i].potrero_id);
		req.body.rotacion.fechas_rotaciones[i]._id = new ObjectId();
	}
    collection.update(
		{ '_id' : ObjectId(req.body.rotacion._id) },
        { $set: {
			'fechas_rotaciones' : req.body.rotacion.fechas_rotaciones
		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				collection.aggregate([
					{ $match :  { "_id": ObjectId(req.body.rotacion._id) }},
					{ $lookup: { from: "Hacienda", localField: "hacienda_id", foreignField: "_id", as: "hacienda" } },
					{ $unwind: { path: "$usuarios" } },
					{ $lookup: { from: "Usuario", localField: "usuarios._id", foreignField: "_id", as: "usuarios_rotacion" } },
					{ $unwind: { path: "$usuarios_rotacion" } },
					{
						$group: {
							"_id" : "$_id",
							"hacienda" : { "$first": "$hacienda" },
							"hora_inicio" : { "$first": "$hora_inicio" },
							"hora_fin" : { "$first": "$hora_fin" },
							"potreros" : { "$first": "$potreros" },
							"fechas_rotaciones" : { "$first": "$fechas_rotaciones" },
							"titulo" : { "$first": "$titulo" },
							"descripcion" : { "$first": "$descripcion" },
							"dias_descanso" : { "$first": "$dias_descanso" },
							"numero_animales" : { "$first": "$numero_animales" },
							"peso_promedio" : { "$first": "$peso_promedio" },
							"consumo" : { "$first": "$consumo" },
							"fecha_rotacion" : { "$first": "$fecha_rotacion" },
							"fechas_rotaciones" : { "$first": "$fechas_rotaciones" },
							"consumo_pasto_ugg" : { "$first": "$consumo_pasto_ugg" },
							"porcentaje_consumo_animal_dia" : { "$first": "$porcentaje_consumo_animal_dia" },
							"hacienda_id" : { "$first": "$hacienda_id" },
							"usuario_id" : { "$first": "$usuario_id" },
							"usuarios" : { "$push": "$usuarios_rotacion" }
						}
					},
				]).toArray(function(err, rotaciones){
					if(err){
						var res_err      = {};
						res_err.status   = "error";
						res_err.error    = err;
						res_err.message  = err;
						res.send(res_err);
					}else{
						var res_data      = {};
						res_data.status   = "success";
						res_data.message  = "Rotación actualizada";
						res_data.data     = rotaciones;
						res.send(res_data);
					}
				});
			}
	});
});

router.post("/solicitud_negocio",function(req,res){

    var collection                  = datb.collection('Negocio');

	req.body.negocio.usuario_id		=  ObjectId(req.body.negocio.usuario_id);

	var foto 						= req.body.negocio.foto;
	req.body.negocio.foto 			= "";

    collection.insert(req.body.negocio, function(err, result) {
		if(err){
			var res_err      = {};
			res_err.status   = "error";
			res_err.error    = err;
			res_err.message  = err;
			res.send(res_err);
		}
		else{

			var negocio_t  = result;
			var negocio_id = result.insertedIds[0];

			req.body.negocio.foto =
			'https://codigeek.app/bookapp/bookapp_fotos/'+negocio_id+'_negocio_foto.png';
			var data = foto.replace(/^data:image\/\w+;base64,/, "");
			var buf = new Buffer(data, 'base64');
			fs.writeFile('bookapp_fotos/'+negocio_id+'_negocio_foto.png', buf);

			collection.update(
				{ '_id' : ObjectId(negocio_id) },
				{ $set: { 'foto' : req.body.negocio.foto } },
				function(err, result2){
					if(err){
						var res_err      = {};
						res_err.status   = "error";
						res_err.error    = err;
						res_err.message  = err;
						res.send(res_err);
					}
					else{

						req.body.negocio._id = negocio_id;

						collection	= datb.collection('Usuario_Tipo_Usuario');
						var nuev_usuario_tipo_usuario = {
			        		"usuario_id" : req.body.negocio.usuario_id,
		        			"tipo_usuario_id" : ObjectId("5c4050fa58209844a83c8623")
			        	};
			            collection.insert(nuev_usuario_tipo_usuario, function(err, result) {
					        if(err){
					            var res_err      = {};
					            res_err.status   = "error";
					            res_err.error    = err;
					            res_err.message  = err;
					            res.send(res_err);
					        }
					        else{
					        	var res_data      = {};
								res_data.status   = "success";
								res_data.message  = "Solicitud enviada, estaremos en contacto contigo.";
								res_data.data     = req.body.negocio;
								res.send(res_data);
					        }
					    });
					}
			});
		}
	});
});

router.post("/get_rotaciones",function(req,res){
    var collection    =  datb.collection('Rotacion');
    collection.aggregate([
		{ $lookup: { from: "Hacienda", localField: "hacienda_id", foreignField: "_id", as: "hacienda" } },
		{ $lookup: { from: "Animal", localField: "_id", foreignField: "modulo_id", as: "animales" } },
		{ $lookup: { from: "Rotacion_Detalle", localField: "_id", foreignField: "rotacion_id", as: "detalle" } },
		{ $unwind: { path: "$usuarios" } },
		{ $lookup: { from: "Usuario", localField: "usuarios._id", foreignField: "_id", as: "usuarios_rotacion" } },
		{ $unwind: { path: "$usuarios_rotacion" } },
		{
			$group: {
				"_id" : "$_id",
				"hacienda" : { "$first": "$hacienda" },
				"animales" : { "$first": "$animales" },
				"detalle" : { "$first": "$detalle" },
				"hora_inicio" : { "$first": "$hora_inicio" },
				"hora_fin" : { "$first": "$hora_fin" },
				"potreros" : { "$first": "$potreros" },
				"fechas_rotaciones" : { "$first": "$fechas_rotaciones" },
				"titulo" : { "$first": "$titulo" },
				"descripcion" : { "$first": "$descripcion" },
				"dias_descanso" : { "$first": "$dias_descanso" },
				"numero_animales" : { "$first": "$numero_animales" },
				"peso_promedio" : { "$first": "$peso_promedio" },
				"consumo" : { "$first": "$consumo" },
				"fecha_rotacion" : { "$first": "$fecha_rotacion" },
				"fechas_rotaciones" : { "$first": "$fechas_rotaciones" },
				"consumo_pasto_ugg" : { "$first": "$consumo_pasto_ugg" },
				"porcentaje_consumo_animal_dia" : { "$first": "$porcentaje_consumo_animal_dia" },
				"hacienda_id" : { "$first": "$hacienda_id" },
				"usuario_id" : { "$first": "$usuario_id" },
				"usuarios" : { "$push": "$usuarios_rotacion" }
			}
		},
		// { $unwind: { path: "$animales" } },
		// { $lookup: { from: "Pesaje", localField: "animales_id", foreignField: "animal_id", as: "animales.pesajes" } },
		// {
			// $group: {
				// "_id" : "$_id",
				// "hacienda" : { "$first": "$hacienda" },
				// "animales" : { "$push": "$animales" },
				// "hora_inicio" : { "$first": "$hora_inicio" },
				// "hora_fin" : { "$first": "$hora_fin" },
				// "potreros" : { "$first": "$potreros" },
				// "fechas_rotaciones" : { "$first": "$fechas_rotaciones" },
				// "titulo" : { "$first": "$titulo" },
				// "descripcion" : { "$first": "$descripcion" },
				// "dias_descanso" : { "$first": "$dias_descanso" },
				// "numero_animales" : { "$first": "$numero_animales" },
				// "peso_promedio" : { "$first": "$peso_promedio" },
				// "consumo" : { "$first": "$consumo" },
				// "fecha_rotacion" : { "$first": "$fecha_rotacion" },
				// "fechas_rotaciones" : { "$first": "$fechas_rotaciones" },
				// "consumo_pasto_ugg" : { "$first": "$consumo_pasto_ugg" },
				// "porcentaje_consumo_animal_dia" : { "$first": "$porcentaje_consumo_animal_dia" },
				// "hacienda_id" : { "$first": "$hacienda_id" },
				// "usuario_id" : { "$first": "$usuario_id" },
				// "usuarios" : { "$first": "$usuarios_rotacion" }
			// }
		// }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Rotaciones";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_rotacion_by_id",function(req,res){
    var collection    =  datb.collection('Rotacion');
    collection.aggregate([
		{ $match :  { "_id": ObjectId(req.body.rotacion._id) }},
		{ $lookup: { from: "Hacienda", localField: "hacienda_id", foreignField: "_id", as: "hacienda" } },
		{ $lookup: { from: "Animal", localField: "_id", foreignField: "modulo_id", as: "animales" } },
		{ $lookup: { from: "Rotacion_Detalle", localField: "_id", foreignField: "rotacion_id", as: "detalle" } },
		{ $unwind: { path: "$usuarios" } },
		{ $lookup: { from: "Usuario", localField: "usuarios._id", foreignField: "_id", as: "usuarios_rotacion" } },
		{ $unwind: { path: "$usuarios_rotacion" } },
		{
			$group: {
				"_id" : "$_id",
				"hacienda" : { "$first": "$hacienda" },
				"animales" : { "$first": "$animales" },
				"detalle" : { "$first": "$detalle" },
				"hora_inicio" : { "$first": "$hora_inicio" },
				"hora_fin" : { "$first": "$hora_fin" },
				"potreros" : { "$first": "$potreros" },
				"fechas_rotaciones" : { "$first": "$fechas_rotaciones" },
				"titulo" : { "$first": "$titulo" },
				"descripcion" : { "$first": "$descripcion" },
				"dias_descanso" : { "$first": "$dias_descanso" },
				"numero_animales" : { "$first": "$numero_animales" },
				"peso_promedio" : { "$first": "$peso_promedio" },
				"consumo" : { "$first": "$consumo" },
				"fecha_rotacion" : { "$first": "$fecha_rotacion" },
				"fechas_rotaciones" : { "$first": "$fechas_rotaciones" },
				"consumo_pasto_ugg" : { "$first": "$consumo_pasto_ugg" },
				"porcentaje_consumo_animal_dia" : { "$first": "$porcentaje_consumo_animal_dia" },
				"hacienda_id" : { "$first": "$hacienda_id" },
				"usuario_id" : { "$first": "$usuario_id" },
				"usuarios" : { "$push": "$usuarios_rotacion" }
			}
		},
		// { $unwind: { path: "$animales" } },
		// { $lookup: { from: "Pesaje", localField: "animales_id", foreignField: "animal_id", as: "pesajes" } },
		// {
			// $group: {
				// "_id" : "$_id",
				// "hacienda" : { "$first": "$hacienda" },
				// "animales" : { "$push": "$animales" },
				// "hora_inicio" : { "$first": "$hora_inicio" },
				// "hora_fin" : { "$first": "$hora_fin" },
				// "potreros" : { "$first": "$potreros" },
				// "fechas_rotaciones" : { "$first": "$fechas_rotaciones" },
				// "titulo" : { "$first": "$titulo" },
				// "descripcion" : { "$first": "$descripcion" },
				// "dias_descanso" : { "$first": "$dias_descanso" },
				// "numero_animales" : { "$first": "$numero_animales" },
				// "peso_promedio" : { "$first": "$peso_promedio" },
				// "consumo" : { "$first": "$consumo" },
				// "fecha_rotacion" : { "$first": "$fecha_rotacion" },
				// "fechas_rotaciones" : { "$first": "$fechas_rotaciones" },
				// "consumo_pasto_ugg" : { "$first": "$consumo_pasto_ugg" },
				// "porcentaje_consumo_animal_dia" : { "$first": "$porcentaje_consumo_animal_dia" },
				// "hacienda_id" : { "$first": "$hacienda_id" },
				// "usuario_id" : { "$first": "$usuario_id" },
				// "usuarios" : { "$first": "$usuarios_rotacion" }
			// }
		// }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Rotaciones";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_detalle_rotacion_by_rotacion_id",function(req,res){
    var collection    =  datb.collection('Rotacion_Detalle');
    collection.aggregate([
		{ $match :  { "rotacion_id": ObjectId(req.body.rotacion._id) }},
		{ $lookup: { from: "Tipo_Movimiento", localField: "movimiento_id", foreignField: "_id", as: "movimiento" } },
		{ $unwind: { path: "$movimiento" } },
		{
			$group: {
				"_id" : "$_id",
				"fecha_rotacion" : { "$first": "$fecha_rotacion" },
				"activo" : { "$first": "$activo" },
				"fecha_termino_ocupacion" : { "$first": "$fecha_termino_ocupacion" },
				"movimiento" : { "$first": "$movimiento" },
				"potrero_det" : { "$first": "$potrero_det" }
			}
		},
		{ $lookup: { from: "Potrero", localField: "potrero_det._id", foreignField: "_id", as: "potrero_det.potrero" } },
		{ $unwind: { path: "$potrero_det.potrero" } },
		{
			$group: {
				"_id" : "$_id",
				"fecha_rotacion" : { "$first": "$fecha_rotacion" },
				"activo" : { "$first": "$activo" },
				"fecha_termino_ocupacion" : { "$first": "$fecha_termino_ocupacion" },
				"movimiento" : { "$first": "$movimiento" },
				"potrero_det" : { "$first": "$potrero_det" }
			}
		},
		{
			$project: {
				"_id" : 1,
				"fecha_rotacion" : 1,
				"activo" : 1,
				"fecha_termino_ocupacion" : 1,
				"movimiento" : 1,
				"potrero" : {
					"nombre" : "$potrero_det.potrero.nombre",
					"hectareas" : "$potrero_det.potrero.hectareas",
					"status" : "$potrero_det.potrero.status",
					"aforo" : "$potrero_det.aforo",
					"prctg_improductivo" : "$potrero_det.prctg_improductivo"
				}
			}
		}
		// {
			// $group: {
				// "_id" : "$_id",
				// "fecha_rotacion" : { "$first": "$fecha_rotacion" },
				// "fecha_termino_ocupacion" : { "$first": "$fecha_termino_ocupacion" },
				// "movimiento" : { "$first": "$movimiento" },
				// "potrero" : {
					// "nombre" : { "$first" : "$potrero_det.potrero.nombre" },
					// "hectareas" : { "$first" : "$potrero_det.potrero.hectareas" },
					// "status" : { "$first" : "$potrero_det.potrero.status" },
					// "aforo" : { "$first" : "$potrero_det.aforo" },
					// "prctg_improductivo" : { "$first" : "$potrero_det.prctg_improductivo" }
				// }
			// }
		// },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Rotaciones";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/actualizar_potrero",function(req,res){
    var collection						=  datb.collection('Potrero');
    collection.update(
		{ '_id' : ObjectId(req.body.data._id) },
        { $set: {
			'nombre' : req.body.data.nombre,
			'hectareas' : req.body.data.hectareas
		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				var res_err      = {};
				res_err.status   = "success";
				res_err.message  = "Potrero actualizado.";
				res.send(res_err);
			}
	});
});

router.post("/actualizar_rotacion",function(req,res){
    var collection						=  datb.collection('Rotacion');
	for(var i = 0; i<req.body.potreros_todos.length; i++){
		req.body.potreros_todos[i]._id = ObjectId(req.body.potreros_todos[i]._id);
		req.body.potreros_todos[i].detalle = false;
	}
    collection.update(
		{ '_id' : ObjectId(req.body.rotacion._id) },
        { $set: {
			'potreros' : req.body.potreros_todos
		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				collection.aggregate([
					{ $match :  { "_id": ObjectId(req.body.rotacion._id) }},
					{ $lookup: { from: "Hacienda", localField: "hacienda_id", foreignField: "_id", as: "hacienda" } },
					{ $unwind: { path: "$usuarios" } },
					{ $lookup: { from: "Usuario", localField: "usuarios._id", foreignField: "_id", as: "usuarios_rotacion" } },
					{ $unwind: { path: "$usuarios_rotacion" } },
					{
						$group: {
							"_id" : "$_id",
							"hacienda" : { "$first": "$hacienda" },
							"hora_inicio" : { "$first": "$hora_inicio" },
							"hora_fin" : { "$first": "$hora_fin" },
							"potreros" : { "$first": "$potreros" },
							"fechas_rotaciones" : { "$first": "$fechas_rotaciones" },
							"titulo" : { "$first": "$titulo" },
							"descripcion" : { "$first": "$descripcion" },
							"dias_descanso" : { "$first": "$dias_descanso" },
							"numero_animales" : { "$first": "$numero_animales" },
							"peso_promedio" : { "$first": "$peso_promedio" },
							"consumo" : { "$first": "$consumo" },
							"fecha_rotacion" : { "$first": "$fecha_rotacion" },
							"fechas_rotaciones" : { "$first": "$fechas_rotaciones" },
							"consumo_pasto_ugg" : { "$first": "$consumo_pasto_ugg" },
							"porcentaje_consumo_animal_dia" : { "$first": "$porcentaje_consumo_animal_dia" },
							"hacienda_id" : { "$first": "$hacienda_id" },
							"usuario_id" : { "$first": "$usuario_id" },
							"usuarios" : { "$push": "$usuarios_rotacion" }
						}
					},
				]).toArray(function(err, rotaciones){
					if(err){
						var res_err      = {};
						res_err.status   = "error";
						res_err.error    = err;
						res_err.message  = err;
						res.send(res_err);
					}else{
						var res_data      = {};
						res_data.status   = "success";
						res_data.message  = "Rotación actualizada";
						res_data.data     = rotaciones;
						res.send(res_data);
					}
				});
			}
	});
});

router.post("/activar_usuario",function(req,res){
    var collection =  datb.collection('Usuario');
    collection.update(
		{ '_id' : ObjectId(req.body.usuario._id) },
		{ $set: {
			"status" : 1
		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				var res_err      = {};
				res_err.status   = "success";
				res_err.message  = "Se activó el usuario.";
				res.send(res_err);
			}
	});
});

router.post("/desactivar_usuario",function(req,res){
    var collection =  datb.collection('Usuario');
    collection.update(
		{ '_id' : ObjectId(req.body.usuario._id) },
		{ $set: {
			"status" : 2
		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				var res_err      = {};
				res_err.status   = "success";
				res_err.message  = "Se desactivó el usuario.";
				res.send(res_err);
			}
	});
});

router.post("/get_pedidos_pendientes_administracion",function(req,res){
    var collection    =  datb.collection('Pedido');
    collection.aggregate([
    { $match:  { 'status' : { $in:  [1,2,3,10]  } } },
    { $sort : { 'fecha_alta' : -1 } },
    { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
		{ $lookup: { from: "Usuario", localField: "motofast_id", foreignField: "_id", as: "motofast" } },
		{ $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
    { $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

            for( var i = 0; i<result.length; i++ ){
                if( result[i].usuario.length > 0 ){
                    result[i].usuario = result[i].usuario[0];
                }else{
                  delete result[i].usuario;
                }
                if( result[i].motofast.length > 0 ){
                    result[i].motofast = result[i].motofast[0];
                }else{
                  delete result[i].motofast;
                }
                if( result[i].negocio.length > 0 ){
                    result[i].negocio = result[i].negocio[0];
                }else{
                  delete result[i].negocio;
                }
                if( result[i].categoria.length > 0 ){
                    result[i].categoria = result[i].categoria[0];
                }else{
                  delete result[i].categoria;
                }
            }

            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Pedidos en Curso";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_pedidos_pendientes_negocio",function(req,res){
    var collection    =  datb.collection('Pedido');
    collection.aggregate([
    { $match:  { 'negocio_id' : ObjectId(req.body.data.negocio_id), 'status' : { $in:  [1,2,3,10]  } } },
    { $sort : { 'fecha_alta' : -1 } },
    { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
		{ $lookup: { from: "Usuario", localField: "motofast_id", foreignField: "_id", as: "motofast" } },
		{ $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
    { $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

            for( var i = 0; i<result.length; i++ ){
                if( result[i].usuario.length > 0 ){
                    result[i].usuario = result[i].usuario[0];
                }else{
                  delete result[i].usuario;
                }
                if( result[i].motofast.length > 0 ){
                    result[i].motofast = result[i].motofast[0];
                }else{
                  delete result[i].motofast;
                }
                if( result[i].negocio.length > 0 ){
                    result[i].negocio = result[i].negocio[0];
                }else{
                  delete result[i].negocio;
                }
                if( result[i].categoria.length > 0 ){
                    result[i].categoria = result[i].categoria[0];
                }else{
                  delete result[i].categoria;
                }
            }

            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Pedidos en Curso";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_pedidos_pendientes_motofast",function(req,res){
    var collection    =  datb.collection('Pedido');
    collection.aggregate([
    { $match:  { 'motofast_id' : ObjectId(req.body.data._id), 'status' : { $in:  [1,2,3,10]  } } },
    { $sort : { 'fecha_alta' : -1 } },
    { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
		{ $lookup: { from: "Usuario", localField: "motofast_id", foreignField: "_id", as: "motofast" } },
		{ $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
    { $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

            for( var i = 0; i<result.length; i++ ){
                if( result[i].usuario.length > 0 ){
                    result[i].usuario = result[i].usuario[0];
                }else{
                  delete result[i].usuario;
                }
                if( result[i].motofast.length > 0 ){
                    result[i].motofast = result[i].motofast[0];
                }else{
                  delete result[i].motofast;
                }
                if( result[i].negocio.length > 0 ){
                    result[i].negocio = result[i].negocio[0];
                }else{
                  delete result[i].negocio;
                }

                if( result[i].categoria.length > 0 ){
                    result[i].categoria = result[i].categoria[0];
                }else{
                  delete result[i].categoria;
                }
            }

            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Pedidos en Curso";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_pedidos_pendientes_usuario",function(req,res){
    var collection    =  datb.collection('Pedido');
    collection.aggregate([
    	// Status 8 - Pedido Terminado
		{ $match:  { 'usuario_id' : ObjectId(req.body.data._id), 'status' : { $in:  [1,2,3,10]  } } },
    { $sort : { 'fecha_alta' : -1 } },
    { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
		{ $lookup: { from: "Usuario", localField: "motofast_id", foreignField: "_id", as: "motofast" } },
    { $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Pedidos en Curso";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

function guardarTelefonoUsuario( usuario_id_t, telefono_t ) {
  var collection	=  datb.collection('Usuario');
  collection.update(
    { '_id' : usuario_id_t },
    { $set: {
      'telefono' : telefono_t
    }},
    function(err, result2){
      //usuario actualizado
  });
}

router.get("/test_socket_pedido",function(req,res){
  io.sockets.in("5dab6af7d887780d17a5fd94").emit('actualizar_pedidos_pendientes', { data : { tipo : 1, cantidad : 1, mensaje : "Test" } });
});

function format_two_digits(n) {
    return n < 10 ? '0' + n : n;
}

router.post("/nuev_pedido",function(req,res){
  var collection	=  datb.collection('Pedido');

  var usuario_t = req.body.data.usuario_id;

  var negocio_id_t = req.body.data.negocio_id;

  var marca_id_t = req.body.negocio.marca_id;

  var servicio_t = req.body.data.servicio.servicio;
  console.log(servicio_t);

  req.body.data.usuario_id
		= new ObjectId(req.body.data.usuario_id);

  req.body.data.servicio_id
		= new ObjectId(req.body.data.servicio_id);

  req.body.data.servicio_general_id
		= new ObjectId(req.body.data.servicio.servicio_id);

  req.body.data.categoria_id
		= new ObjectId(req.body.negocio.categoria_id);

  req.body.data.negocio_id
    = new ObjectId(req.body.data.negocio_id);

  req.body.data.marca_id
    = new ObjectId(req.body.negocio.marca_id);

  if( req.body.data.motofast_id ){
    req.body.data.motofast_id
      = new ObjectId(req.body.data.motofast_id);
  }

  req.body.data.origen_latitude =
      req.body.negocio.location.coordinates[1];

  req.body.data.origen_longitude =
        req.body.negocio.location.coordinates[0];

  req.body.data.origen = { type: "Point",
    coordinates: [
      req.body.negocio.location.coordinates[0],
      req.body.negocio.location.coordinates[1]
    ]
  }

  req.body.data.status = 1;

  req.body.data.destino = { type: "Point",
    coordinates: [
      req.body.data.destino_longitude,
      req.body.data.destino_latitude
    ]
  }

	var foto							=  req.body.data.foto ? req.body.data.foto : "";
	req.body.data.foto    =  "";

  delete req.body.data._id;
  delete req.body.data.repartidor_direccion;
  delete req.body.data.repartidor_latitude;
  delete req.body.data.repartidor_longitude;
  delete req.body.data.servicio;

  if(req.body.data.fecha_asignar_motofast){
    delete req.body.data.fecha_asignar_motofast;
  }
  if(req.body.data.fecha_recogi_productos){
    delete req.body.data.fecha_recogi_productos;
  }
  if(req.body.data.fecha_entregue_productos){
    delete req.body.data.fecha_entregue_productos;
  }
  if(req.body.data.fecha_platillos_listos){
    delete req.body.data.fecha_platillos_listos;
  }
  if(req.body.data.fecha_cancelacion){
    delete req.body.data.fecha_cancelacion;
  }
  if(req.body.data.fecha_pedido_listo){
    delete req.body.data.fecha_pedido_listo;
  }
  if(req.body.data.fecha_cancelacion_vendedor){
    delete req.body.data.fecha_cancelacion_vendedor;
  }

  collection = datb.collection('Usuario');
  collection.aggregate([
    { $match :  { '_id' : req.body.data.usuario_id }}
  ]).toArray(function(err, result){
      if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
      }
      else{

        var usuario_t = result[0];

        delete req.body.data.usuario;
        delete req.body.data.negocio;

        if( req.body.data.motofast ){
          delete req.body.data.motofast;
        }

        collection	=  datb.collection('Pedido');
        collection.insert(req.body.data, function(err, result) {
            if(err){
                var res_err      = {};
                res_err.status   = "error";
                res_err.error    = err;
                res_err.message  = err;
                res.send(res_err);
            }
            else{

              var pedido_id = result.insertedIds[0];

              tiempoRealPedidosNuevosYPendientes_AdminYNegocios( negocio_id_t );

              enviar_push_usuario_admin_negocio(negocio_id_t, "Reserva registrada.");
              enviar_push_usuario("5dab6af7d887780d17a5fd94", "Reserva registrada.");

              var fecha_ticket = new Date(req.body.data.fecha_cita);
              var dd = String(fecha_ticket.getDate()).padStart(2, '0');
              var mm = String(fecha_ticket.getMonth() + 1).padStart(2, '0'); //January is 0!
              var yyyy = fecha_ticket.getFullYear();

              fecha_ticket = mm + '/' + dd + '/' + yyyy;

              var hora_ticket = new Date(req.body.data.fecha_cita);
              hours = format_two_digits(hora_ticket.getHours());
              minutes = format_two_digits(hora_ticket.getMinutes());
              seconds = format_two_digits(hora_ticket.getSeconds());
              var hora_ticket_texto =  hours + ":" + minutes;

              enviar_correo_confirmacion_cita(
                usuario_t.correo,
                usuario_t.nombre,
                fecha_ticket,
                hora_ticket_texto,
                req.body.negocio.nombre,
                servicio_t.nombre
              );

              enviar_correo_confirmacion_cita_negocio(
                usuario_t.correo,
                usuario_t.nombre,
                fecha_ticket,
                hora_ticket_texto,
                req.body.negocio.nombre,
                servicio_t.nombre,
                marca_id_t
              );

              var result_return      = {};
              result_return.status   = "success";
              result_return.message  = "Reservaste tu cita con éxito.";
              result_return._id      = pedido_id;
              res.send(result_return);

            }
        });

        // if( req.body.data.forma_pago._id === "5e0a904ece07baeb91675dbe" ){
        //
        //   req.body.data.total = Math.round(req.body.data.total * 100) / 100;
        //
        //   paypal.configure({
        //     'mode': 'live', //sandbox or live
        //     'client_id': 'Ad7rmF5RnUwGmb2MhOxqE90l3ktyY8DFQ7bvjvGyKkTV0QNo8LMUhlQJavKsYxT7Jro466ybH_4Gtn10',
        //     'client_secret': 'EF838Can3yN7qksllCAgHh8Ve2dS3axE-XRiTWt07xD2gDxUgeZMeEe0Ahi_bSrmJ_LypRSclfMN2GZC',
        //     'headers': {
        //     'custom': 'header'
        //     }
        //   });
        //   var cardData = {
        //     "intent": "sale",
        //     "payer": {
        //       "payment_method": "paypal",
        //       "funding_instruments": [{
        //         "credit_card_token": {
        //           "credit_card_id": req.body.data.tarjeta.id,
        //           "external_customer_id": req.body.data.tarjeta.external_customer_id
        //           }
        //       }]
        //     },
        //     "transactions": [{
        //       "amount": {
        //       "total": req.body.data.total,
        //       "currency": "USD"
        //       },
        //       "description": "Pago de pedido Ebixteam Express."
        //     }]
        //   };
        //   console.log("paso1");
        //   paypal.payment.create(cardData, function(error, payment){
        //     if(error){
        //     console.log("paso2");
        //     console.log(error.response);
        //         var result_return      = {};
        //         result_return.status   = "error";
        //         result_return.message  = error.response.message;
        //         res.send(result_return);
        //     } else {
        //     console.log("paso3");
        //
        //     }
        //   });
        //
        //   // paypal.configure({
        //   //   'mode': 'live', //sandbox or live
        //   //   'client_id': 'Ad7rmF5RnUwGmb2MhOxqE90l3ktyY8DFQ7bvjvGyKkTV0QNo8LMUhlQJavKsYxT7Jro466ybH_4Gtn10',
        //   //   'client_secret': 'EF838Can3yN7qksllCAgHh8Ve2dS3axE-XRiTWt07xD2gDxUgeZMeEe0Ahi_bSrmJ_LypRSclfMN2GZC',
        //   //   'headers': {
        //   //   'custom': 'header'
        //   //   }
        //   // });
        //   // var cardData = {
        //   //   "intent": "sale",
        //   //   "payer": {
        //   //     "payment_method": "paypal",
        //   //     "funding_instruments": [{
        //   //       "credit_card_token": {
        //   //         "credit_card_id": req.body.data.tarjeta.id,
        //   //         "external_customer_id": req.body.data.tarjeta.external_customer_id
        //   //         }
        //   //     }]
        //   //   },
        //   //   "transactions": [{
        //   //     "amount": {
        //   //     "total": req.body.data.total,
        //   //     "currency": "USD"
        //   //     },
        //   //     "description": "Pago de pedido Ebixteam Express."
        //   //   }]
        //   // };
        //   // console.log("paso1");
        //   // paypal.payment.create(cardData, function(error, payment){
        //   //   if(error){
        //   //   console.log("paso2");
        //   //   console.log(error.response);
        //   //       var result_return      = {};
        //   //       result_return.status   = "error";
        //   //       result_return.message  = error.response.message;
        //   //       res.send(result_return);
        //   //   } else {
        //   //   console.log("paso3");
        //
        //   //   }
        //   // });
        //
        //   // stripe.charges.create(
        //   //   {
        //   //     amount: req.body.data.total*100,
        //   //     currency: "mxn",
        //   //     source: req.body.data.tarjeta_id,
        //   //     customer: usuario_t.customer_id_prod,
        //   //     statement_descriptor_suffix: "bookapp",
        //   //     description: "Pedido bookapp",
        //   //   },
        //   //   function(err, charge) {
        //   //     if(err){
        //   //       console.log("error se fue por aqui");
        //   //       console.log(err);
        //   //       enviar_push_usuario(req.body.data.usuario_id, err.message);
        //   //         var res_err      = {};
        //   //         res_err.status   = "error";
        //   //         res_err.error    = err;
        //   //         res_err.message  = err.message;
        //   //         res.send(res_err);
        //   //     }else{
        //   //
        //   //       collection	=  datb.collection('Pedido');
        //   //
        //   //       req.body.data.charge_id = charge.id;
        //   //       req.body.data.paid = true;
        //   //
        //   //       collection.insert(req.body.data, function(err, result) {
        //   //           if(err){
        //   //               var res_err      = {};
        //   //               res_err.status   = "error";
        //   //               res_err.error    = err;
        //   //               res_err.message  = err;
        //   //               res.send(res_err);
        //   //           }
        //   //           else{
        //   //
        //   //           	var pedido_id = result.insertedIds[0];
        //   //
        //   //             tiempoRealPedidosNuevosYPendientes_AdminYNegocios( negocio_id_t );
        //   //
        //   //             enviar_push_usuario_admin_negocio(negocio_id_t, "Nuevo pedido registrado.");
        //   //             enviar_push_usuario("5dab6af7d887780d17a5fd94", "Nuevo pedido registrado.");
        //   //
        //   //             var result_return      = {};
        //   //             result_return.status   = "success";
        //   //             result_return.message  = "Hiciste tu pedido con éxito.";
        //   //             result_return._id      = pedido_id;
        //   //             res.send(result_return);
        //   //
        //   //           }
        //   //       });
        //   //
        //   //     }
        //   //   }
        //   // );
        //
        //
        // }else{
        //   collection	=  datb.collection('Pedido');
        //   collection.insert(req.body.data, function(err, result) {
        //       if(err){
        //           var res_err      = {};
        //           res_err.status   = "error";
        //           res_err.error    = err;
        //           res_err.message  = err;
        //           res.send(res_err);
        //       }
        //       else{
        //
        //       	var pedido_id = result.insertedIds[0];
        //
        //         tiempoRealPedidosNuevosYPendientes_AdminYNegocios( negocio_id_t );
        //
        //         enviar_push_usuario_admin_negocio(negocio_id_t, "Nuevo pedido registrado.");
        //         enviar_push_usuario("5dab6af7d887780d17a5fd94", "Nuevo pedido registrado.");
        //
        //         var result_return      = {};
        //         result_return.status   = "success";
        //         result_return.message  = "Hiciste tu pedido con éxito.";
        //         result_return._id      = pedido_id;
        //         res.send(result_return);
        //
        //       }
        //   });
        // }
      }
    });

});

router.post("/nuev_pedido_negocio",function(req,res){
  var collection	=  datb.collection('Pedido');

  var usuario_t = req.body.data.usuario_id;

  var negocio_id_t = req.body.data.negocio_id;

  var servicio_t = req.body.data.servicio.servicio;

  req.body.data.servicio_id
		= new ObjectId(req.body.data.servicio_id);

  req.body.data.servicio_general_id
		= new ObjectId(req.body.data.servicio.servicio_id);

  req.body.data.categoria_id
		= new ObjectId(req.body.negocio.categoria_id);

  req.body.data.negocio_id
    = new ObjectId(req.body.data.negocio_id);

  req.body.data.marca_id
    = new ObjectId(req.body.negocio.marca_id);

  if( req.body.data.motofast_id ){
    req.body.data.motofast_id
      = new ObjectId(req.body.data.motofast_id);
  }

  req.body.data.origen_latitude =
      req.body.negocio.location.coordinates[1];

  req.body.data.origen_longitude =
        req.body.negocio.location.coordinates[0];

  req.body.data.origen = { type: "Point",
    coordinates: [
      req.body.negocio.location.coordinates[0],
      req.body.negocio.location.coordinates[1]
    ]
  }

  req.body.data.status = 1;

  req.body.data.destino = { type: "Point",
    coordinates: [
      req.body.data.destino_longitude,
      req.body.data.destino_latitude
    ]
  }

	var foto							=  req.body.data.foto ? req.body.data.foto : "";
	req.body.data.foto    =  "";

  delete req.body.data._id;
  delete req.body.data.repartidor_direccion;
  delete req.body.data.repartidor_latitude;
  delete req.body.data.repartidor_longitude;
  delete req.body.data.servicio;

  if(req.body.data.fecha_asignar_motofast){
    delete req.body.data.fecha_asignar_motofast;
  }
  if(req.body.data.fecha_recogi_productos){
    delete req.body.data.fecha_recogi_productos;
  }
  if(req.body.data.fecha_entregue_productos){
    delete req.body.data.fecha_entregue_productos;
  }
  if(req.body.data.fecha_platillos_listos){
    delete req.body.data.fecha_platillos_listos;
  }
  if(req.body.data.fecha_cancelacion){
    delete req.body.data.fecha_cancelacion;
  }
  if(req.body.data.fecha_pedido_listo){
    delete req.body.data.fecha_pedido_listo;
  }
  if(req.body.data.fecha_cancelacion_vendedor){
    delete req.body.data.fecha_cancelacion_vendedor;
  }

  collection = datb.collection('Usuario');
  collection.aggregate([
    { $match :  { "correo" : req.body.cliente.correo.toString().trim() }}
  ]).toArray(function(err, result){
      if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
      }
      else{

        if( result.length > 0 ){

          console.log(result[0]);
          var usuario_t = result[0];
          req.body.data.usuario_id = new ObjectId(usuario_t._id);

          delete req.body.data.usuario;
          delete req.body.data.negocio;

          if( req.body.data.motofast ){
            delete req.body.data.motofast;
          }

          collection	=  datb.collection('Pedido');
          collection.insert(req.body.data, function(err, result) {
              if(err){
                  var res_err      = {};
                  res_err.status   = "error";
                  res_err.error    = err;
                  res_err.message  = err;
                  res.send(res_err);
              }
              else{

                var pedido_id = result.insertedIds[0];

                tiempoRealPedidosNuevosYPendientes_AdminYNegocios( negocio_id_t );

                enviar_push_usuario_admin_negocio(negocio_id_t, "Reserva registrada.");
                enviar_push_usuario("5dab6af7d887780d17a5fd94", "Reserva registrada.");

                enviar_correo_confirmacion_cita(
                  usuario_t.correo,
                  usuario_t.nombre,
                  fecha_ticket,
                  hora_ticket_texto,
                  req.body.negocio.nombre,
                  servicio_t.nombre
                );

                var result_return      = {};
                result_return.status   = "success";
                result_return.message  = "Reservaste tu cita con éxito.";
                result_return._id      = pedido_id;
                res.send(result_return);

              }
          });

        }else{

          collection	= datb.collection('Usuario');
          req.body.cliente.tipo_usuario_id = ObjectId("5c40513258209844a83c8629");
          delete req.body.cliente._id;
          req.body.cliente.contrasena = "123";
          console.log(req.body.cliente.tipo_usuario_id);
          collection.insert(req.body.cliente, function(err, result) {
            if(err){
              var res_err      = {};
              res_err.status   = "error";
              res_err.error    = err;
              res_err.message  = err;
              res.send(res_err);
            }
            else{

              console.log(result.insertedIds[0]);

              req.body.data.usuario_id = new ObjectId(result.insertedIds[0]);
              delete req.body.data.usuario;
              delete req.body.data.negocio;

              if( req.body.data.motofast ){
                delete req.body.data.motofast;
              }

              collection	=  datb.collection('Pedido');
              collection.insert(req.body.data, function(err, result) {
                  if(err){
                      var res_err      = {};
                      res_err.status   = "error";
                      res_err.error    = err;
                      res_err.message  = err;
                      res.send(res_err);
                  }
                  else{

                    var pedido_id = result.insertedIds[0];

                    tiempoRealPedidosNuevosYPendientes_AdminYNegocios( negocio_id_t );

                    enviar_push_usuario_admin_negocio(negocio_id_t, "Reserva registrada.");
                    enviar_push_usuario("5dab6af7d887780d17a5fd94", "Reserva registrada.");

                    var fecha_ticket = new Date(req.body.data.fecha_cita);
                    var dd = String(fecha_ticket.getDate()).padStart(2, '0');
                    var mm = String(fecha_ticket.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = fecha_ticket.getFullYear();

                    fecha_ticket = mm + '/' + dd + '/' + yyyy;

                    var hora_ticket = new Date(req.body.data.fecha_cita);
                    hours = format_two_digits(hora_ticket.getHours());
                    minutes = format_two_digits(hora_ticket.getMinutes());
                    seconds = format_two_digits(hora_ticket.getSeconds());
                    var hora_ticket_texto =  hours + ":" + minutes;

                    enviar_correo_confirmacion_cita(
                      req.body.cliente.correo,
                      req.body.cliente.nombre,
                      fecha_ticket,
                      hora_ticket_texto,
                      req.body.negocio.nombre,
                      servicio_t.nombre
                    );

                    var result_return      = {};
                    result_return.status   = "success";
                    result_return.message  = "Reservaste tu cita con éxito.";
                    result_return._id      = pedido_id;
                    res.send(result_return);

                  }
              });


            }
          });

        }

        // if( req.body.data.forma_pago._id === "5e0a904ece07baeb91675dbe" ){
        //
        //   req.body.data.total = Math.round(req.body.data.total * 100) / 100;
        //
        //   paypal.configure({
        //     'mode': 'live', //sandbox or live
        //     'client_id': 'Ad7rmF5RnUwGmb2MhOxqE90l3ktyY8DFQ7bvjvGyKkTV0QNo8LMUhlQJavKsYxT7Jro466ybH_4Gtn10',
        //     'client_secret': 'EF838Can3yN7qksllCAgHh8Ve2dS3axE-XRiTWt07xD2gDxUgeZMeEe0Ahi_bSrmJ_LypRSclfMN2GZC',
        //     'headers': {
        //     'custom': 'header'
        //     }
        //   });
        //   var cardData = {
        //     "intent": "sale",
        //     "payer": {
        //       "payment_method": "paypal",
        //       "funding_instruments": [{
        //         "credit_card_token": {
        //           "credit_card_id": req.body.data.tarjeta.id,
        //           "external_customer_id": req.body.data.tarjeta.external_customer_id
        //           }
        //       }]
        //     },
        //     "transactions": [{
        //       "amount": {
        //       "total": req.body.data.total,
        //       "currency": "USD"
        //       },
        //       "description": "Pago de pedido Ebixteam Express."
        //     }]
        //   };
        //   console.log("paso1");
        //   paypal.payment.create(cardData, function(error, payment){
        //     if(error){
        //     console.log("paso2");
        //     console.log(error.response);
        //         var result_return      = {};
        //         result_return.status   = "error";
        //         result_return.message  = error.response.message;
        //         res.send(result_return);
        //     } else {
        //     console.log("paso3");
        //
        //     }
        //   });
        //
        //   // paypal.configure({
        //   //   'mode': 'live', //sandbox or live
        //   //   'client_id': 'Ad7rmF5RnUwGmb2MhOxqE90l3ktyY8DFQ7bvjvGyKkTV0QNo8LMUhlQJavKsYxT7Jro466ybH_4Gtn10',
        //   //   'client_secret': 'EF838Can3yN7qksllCAgHh8Ve2dS3axE-XRiTWt07xD2gDxUgeZMeEe0Ahi_bSrmJ_LypRSclfMN2GZC',
        //   //   'headers': {
        //   //   'custom': 'header'
        //   //   }
        //   // });
        //   // var cardData = {
        //   //   "intent": "sale",
        //   //   "payer": {
        //   //     "payment_method": "paypal",
        //   //     "funding_instruments": [{
        //   //       "credit_card_token": {
        //   //         "credit_card_id": req.body.data.tarjeta.id,
        //   //         "external_customer_id": req.body.data.tarjeta.external_customer_id
        //   //         }
        //   //     }]
        //   //   },
        //   //   "transactions": [{
        //   //     "amount": {
        //   //     "total": req.body.data.total,
        //   //     "currency": "USD"
        //   //     },
        //   //     "description": "Pago de pedido Ebixteam Express."
        //   //   }]
        //   // };
        //   // console.log("paso1");
        //   // paypal.payment.create(cardData, function(error, payment){
        //   //   if(error){
        //   //   console.log("paso2");
        //   //   console.log(error.response);
        //   //       var result_return      = {};
        //   //       result_return.status   = "error";
        //   //       result_return.message  = error.response.message;
        //   //       res.send(result_return);
        //   //   } else {
        //   //   console.log("paso3");
        //
        //   //   }
        //   // });
        //
        //   // stripe.charges.create(
        //   //   {
        //   //     amount: req.body.data.total*100,
        //   //     currency: "mxn",
        //   //     source: req.body.data.tarjeta_id,
        //   //     customer: usuario_t.customer_id_prod,
        //   //     statement_descriptor_suffix: "bookapp",
        //   //     description: "Pedido bookapp",
        //   //   },
        //   //   function(err, charge) {
        //   //     if(err){
        //   //       console.log("error se fue por aqui");
        //   //       console.log(err);
        //   //       enviar_push_usuario(req.body.data.usuario_id, err.message);
        //   //         var res_err      = {};
        //   //         res_err.status   = "error";
        //   //         res_err.error    = err;
        //   //         res_err.message  = err.message;
        //   //         res.send(res_err);
        //   //     }else{
        //   //
        //   //       collection	=  datb.collection('Pedido');
        //   //
        //   //       req.body.data.charge_id = charge.id;
        //   //       req.body.data.paid = true;
        //   //
        //   //       collection.insert(req.body.data, function(err, result) {
        //   //           if(err){
        //   //               var res_err      = {};
        //   //               res_err.status   = "error";
        //   //               res_err.error    = err;
        //   //               res_err.message  = err;
        //   //               res.send(res_err);
        //   //           }
        //   //           else{
        //   //
        //   //           	var pedido_id = result.insertedIds[0];
        //   //
        //   //             tiempoRealPedidosNuevosYPendientes_AdminYNegocios( negocio_id_t );
        //   //
        //   //             enviar_push_usuario_admin_negocio(negocio_id_t, "Nuevo pedido registrado.");
        //   //             enviar_push_usuario("5dab6af7d887780d17a5fd94", "Nuevo pedido registrado.");
        //   //
        //   //             var result_return      = {};
        //   //             result_return.status   = "success";
        //   //             result_return.message  = "Hiciste tu pedido con éxito.";
        //   //             result_return._id      = pedido_id;
        //   //             res.send(result_return);
        //   //
        //   //           }
        //   //       });
        //   //
        //   //     }
        //   //   }
        //   // );
        //
        //
        // }else{
        //   collection	=  datb.collection('Pedido');
        //   collection.insert(req.body.data, function(err, result) {
        //       if(err){
        //           var res_err      = {};
        //           res_err.status   = "error";
        //           res_err.error    = err;
        //           res_err.message  = err;
        //           res.send(res_err);
        //       }
        //       else{
        //
        //       	var pedido_id = result.insertedIds[0];
        //
        //         tiempoRealPedidosNuevosYPendientes_AdminYNegocios( negocio_id_t );
        //
        //         enviar_push_usuario_admin_negocio(negocio_id_t, "Nuevo pedido registrado.");
        //         enviar_push_usuario("5dab6af7d887780d17a5fd94", "Nuevo pedido registrado.");
        //
        //         var result_return      = {};
        //         result_return.status   = "success";
        //         result_return.message  = "Hiciste tu pedido con éxito.";
        //         result_return._id      = pedido_id;
        //         res.send(result_return);
        //
        //       }
        //   });
        // }
      }
    });

});

router.post("/nuev_pedido_pideloquequieras",function(req,res){
  var collection	=  datb.collection('Pedido');

  var usuario_t = req.body.data.usuario_id;

	req.body.data.usuario_id
		= new ObjectId(req.body.data.usuario_id);

  req.body.data.origen = { type: "Point",
    coordinates: [
      req.body.data.origen_longitude,
      req.body.data.origen_latitude
    ]
  }

  req.body.data.destino = { type: "Point",
    coordinates: [
      req.body.data.destino_longitude,
      req.body.data.destino_latitude
    ]
  }

  req.body.data.pideloquequieras = true;

	var foto							=  req.body.data.foto ? req.body.data.foto : "";
	req.body.data.foto    =  "";

  delete req.body.data._id;
  delete req.body.data.repartidor_direccion;
  delete req.body.data.repartidor_latitude;
  delete req.body.data.repartidor_longitude;

  if(req.body.data.fecha_asignar_motofast){
    delete req.body.data.fecha_asignar_motofast;
  }
  if(req.body.data.fecha_recogi_productos){
    delete req.body.data.fecha_recogi_productos;
  }
  if(req.body.data.fecha_entregue_productos){
    delete req.body.data.fecha_entregue_productos;
  }
  if(req.body.data.fecha_platillos_listos){
    delete req.body.data.fecha_platillos_listos;
  }
  if(req.body.data.fecha_cancelacion){
    delete req.body.data.fecha_cancelacion;
  }
  if(req.body.data.fecha_pedido_listo){
    delete req.body.data.fecha_pedido_listo;
  }
  if(req.body.data.fecha_cancelacion_vendedor){
    delete req.body.data.fecha_cancelacion_vendedor;
  }

  collection = datb.collection('Usuario');
  collection.aggregate([
    { $match :  { '_id' : req.body.data.usuario_id }}
  ]).toArray(function(err, result){
      if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
      }
      else{

        var usuario_t = result[0];

        delete req.body.data.usuario;
        delete req.body.data.negocio;

        req.body.data.tipo_servicio = 2;

        if( req.body.data.forma_pago._id === "5e0a904ece07baeb91675dbe" ){

          req.body.data.total = Math.round(req.body.data.total * 100) / 100;

          paypal.configure({
            'mode': 'live', //sandbox or live
            'client_id': 'Ad7rmF5RnUwGmb2MhOxqE90l3ktyY8DFQ7bvjvGyKkTV0QNo8LMUhlQJavKsYxT7Jro466ybH_4Gtn10',
            'client_secret': 'EF838Can3yN7qksllCAgHh8Ve2dS3axE-XRiTWt07xD2gDxUgeZMeEe0Ahi_bSrmJ_LypRSclfMN2GZC',
            'headers': {
            'custom': 'header'
            }
          });
          var cardData = {
            "intent": "sale",
            "payer": {
              "payment_method": "paypal",
              "funding_instruments": [{
                "credit_card_token": {
                  "credit_card_id": req.body.data.tarjeta.id,
                  "external_customer_id": req.body.data.tarjeta.external_customer_id
                  }
              }]
            },
            "transactions": [{
              "amount": {
              "total": req.body.data.total,
              "currency": "USD"
              },
              "description": "Pago de pedido Ebixteam Express."
            }]
          };
          console.log("paso1");
          paypal.payment.create(cardData, function(error, payment){
            if(error){
            console.log("paso2");
            console.log(error.response);
                var result_return      = {};
                result_return.status   = "error";
                result_return.message  = error.response.message;
                res.send(result_return);
            } else {
            console.log("paso3");

            }
          });

        }else{
          collection	=  datb.collection('Pedido');
          collection.insert(req.body.data, function(err, result) {
              if(err){
                  var res_err      = {};
                  res_err.status   = "error";
                  res_err.error    = err;
                  res_err.message  = err;
                  res.send(res_err);
              }
              else{

              	var pedido_id = result.insertedIds[0];

                enviar_push_usuario("5dab6af7d887780d17a5fd94", "Nuevo pedido registrado.");

                var result_return      = {};
                result_return.status   = "success";
                result_return.message  = "Hiciste tu pedido con éxito.";
                result_return._id      = pedido_id;
                res.send(result_return);

              }
          });
        }
      }
    });

});

router.post("/get_pedidos_administracion_dashboard",function(req,res){
    var collection    =  datb.collection('Pedido');
    collection.aggregate([
    { $match:  {
        'fecha_alta' :
          {
            $gte : req.body.filtro.de_fecha,
            $lte : req.body.filtro.hasta_fecha
          }
      }
    },
    { $sort : { 'fecha_alta' : -1 } },
    { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
		{ $lookup: { from: "Usuario", localField: "motofast_id", foreignField: "_id", as: "motofast" } },
		{ $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
    { $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
    { $lookup: { from: "Servicio", localField: "servicio_general_id", foreignField: "_id", as: "servicio" } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

            for( var i = 0; i<result.length; i++ ){
                if( result[i].usuario.length > 0 ){
                    result[i].usuario = result[i].usuario[0];
                }else{
                  delete result[i].usuario;
                }
                if( result[i].motofast.length > 0 ){
                    result[i].motofast = result[i].motofast[0];
                }else{
                  delete result[i].motofast;
                }
                if( result[i].negocio.length > 0 ){
                    result[i].negocio = result[i].negocio[0];
                }else{
                  delete result[i].negocio;
                }

                if( result[i].categoria.length > 0 ){
                    result[i].categoria = result[i].categoria[0];
                }else{
                  delete result[i].categoria;
                }
                if( result[i].servicio.length > 0 ){
                    result[i].servicio = result[i].servicio[0];
                }else{
                  delete result[i].servicio;
                }
            }

            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Pedidos en Curso";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_pedidos_negocio_dashboard",function(req,res){
    var collection    =  datb.collection('Pedido');
    collection.aggregate([
    { $match:  {
        'fecha_alta' :
          {
            $gte : req.body.filtro.de_fecha,
            $lte : req.body.filtro.hasta_fecha
          },
        'marca_id' : ObjectId(req.body.data.negocio_id)
      }
    },
    { $sort : { 'fecha_alta' : -1 } },
    { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
		{ $lookup: { from: "Usuario", localField: "motofast_id", foreignField: "_id", as: "motofast" } },
		{ $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
    { $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
    { $lookup: { from: "Servicio", localField: "servicio_general_id", foreignField: "_id", as: "servicio" } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

            for( var i = 0; i<result.length; i++ ){
                if( result[i].usuario.length > 0 ){
                    result[i].usuario = result[i].usuario[0];
                }else{
                  delete result[i].usuario;
                }
                if( result[i].motofast.length > 0 ){
                    result[i].motofast = result[i].motofast[0];
                }else{
                  delete result[i].motofast;
                }
                if( result[i].negocio.length > 0 ){
                    result[i].negocio = result[i].negocio[0];
                }else{
                  delete result[i].negocio;
                }

                if( result[i].categoria.length > 0 ){
                    result[i].categoria = result[i].categoria[0];
                }else{
                  delete result[i].categoria;
                }
                if( result[i].servicio.length > 0 ){
                    result[i].servicio = result[i].servicio[0];
                }else{
                  delete result[i].servicio;
                }
            }

            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Pedidos en Curso";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_pedidos_sucursal_dashboard",function(req,res){
    var collection    =  datb.collection('Pedido');
    collection.aggregate([
    { $match:  {
        'fecha_alta' :
          {
            $gte : req.body.filtro.de_fecha,
            $lte : req.body.filtro.hasta_fecha
          },
        'negocio_id' : ObjectId(req.body.data.negocio_id)
      }
    },
    { $sort : { 'fecha_alta' : -1 } },
    { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
		{ $lookup: { from: "Usuario", localField: "motofast_id", foreignField: "_id", as: "motofast" } },
		{ $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
    { $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
		{ $lookup: { from: "Servicio", localField: "servicio_general_id", foreignField: "_id", as: "servicio" } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

            for( var i = 0; i<result.length; i++ ){
                if( result[i].usuario.length > 0 ){
                    result[i].usuario = result[i].usuario[0];
                }else{
                  delete result[i].usuario;
                }
                if( result[i].motofast.length > 0 ){
                    result[i].motofast = result[i].motofast[0];
                }else{
                  delete result[i].motofast;
                }
                if( result[i].negocio.length > 0 ){
                    result[i].negocio = result[i].negocio[0];
                }else{
                  delete result[i].negocio;
                }

                if( result[i].categoria.length > 0 ){
                    result[i].categoria = result[i].categoria[0];
                }else{
                  delete result[i].categoria;
                }
                if( result[i].servicio.length > 0 ){
                    result[i].servicio = result[i].servicio[0];
                }else{
                  delete result[i].servicio;
                }
            }

            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Pedidos en Curso";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_usuarios_clientes",function(req,res){
    var collection    =  datb.collection('Usuario');
    collection.aggregate([
    { $match :  { "status" : { $ne : 5 }, "tipo_usuario_id" : ObjectId("5c40513258209844a83c8629")  }},
		{ $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

            for( var i = 0; i<result.length; i++ ){

                if(result[i].foto){
                  result[i].foto = result[i].foto+'?'+makeid();
                }

                if( result[i].tipo_usuario.length > 0 ){
                    result[i].tipo_usuario = result[i].tipo_usuario[0];
                }else{
                  delete result[i].tipo_usuario;
                }
            }

            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Usuarios";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/nuev_direccion",function(req,res){
    var collection				=  datb.collection('Direccion');
	req.body.direccion.usuario_id	= new ObjectId(req.body.direccion.usuario_id);
    collection.insert(req.body.direccion, function(err, result) {
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            result.status  	= "success";
			result.message 	= "Dirección agregada.";
			res.send(result);
        }
    });
});

router.post("/eliminar_direccion",function(req,res){
    var collection	=  datb.collection('Direccion');
    collection.deleteOne(
        { '_id' : ObjectId(req.body.direccion._id) },
        function(err, result){
            if(err){
                var res_err      = {};
                res_err.status   = "error";
                res_err.error    = err;
                res_err.message  = err;
                res.send(res_err);
            }
            else{
                var res_data    = {};
                res_data.status  = "success";
                res_data.message = "Dirección eliminada.";
                res.send(res_data);
            }
    });
});

router.post("/actualizar_direccion_usuario",function(req,res){
    var collection						=  datb.collection('Usuario');
    collection.update(
  		{ '_id' : ObjectId(req.body.usuario._id) },
      { $set: {
  			'direccion' : req.body.direccion.direccion,
        'latitude' : req.body.direccion.latitude,
        'longitude' : req.body.direccion.longitude,
        'direccion_id' : ObjectId(req.body.direccion._id),
        'location'      :
          {
            type: "Point",
            coordinates: [ req.body.direccion.longitude, req.body.direccion.latitude ]
          }
  		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Dirección actualizada.";
        res.send(res_data);
			}
	});
});



router.post("/get_pedidos_en_curso",function(req,res){
    var collection    =  datb.collection('Pedido');
    collection.aggregate([
    	// Status 8 - Pedido Terminado
		{ $match:  { 'usuario_id' : ObjectId(req.body.usuario._id), 'status' : { $nin:  [5,6]  } } },
    { $sort : { 'fecha_alta' : -1 } },
		{ $lookup: { from: "Rango_Costo", localField: "rango_id", foreignField: "_id", as: "rango" } },
		{ $lookup: { from: "Direccion", localField: "ubicacion_entrega_id", foreignField: "_id", as: "ubicacion_entrega" } },
		{ $lookup: { from: "Usuario", localField: "bookapper_id", foreignField: "_id", as: "bookapper" } },
		{ $unwind: { path: "$bookapper", preserveNullAndEmptyArrays: true } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Pedidos en Curso";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_pedidos_en_curso_by_id",function(req,res){
    var collection    =  datb.collection('Pedido');
    collection.aggregate([
    	// Status 8 - Pedido Terminado
		{ $match:  { '_id' : ObjectId(req.body.pedido._id), 'status' : { $nin:  [5,6]  } } },
    { $sort : { 'fecha_alta' : -1 } },
		{ $lookup: { from: "Rango_Costo", localField: "rango_id", foreignField: "_id", as: "rango" } },
		{ $lookup: { from: "Direccion", localField: "ubicacion_entrega_id", foreignField: "_id", as: "ubicacion_entrega" } },
		{ $lookup: { from: "Usuario", localField: "bookapper_id", foreignField: "_id", as: "bookapper" } },
		{ $unwind: { path: "$bookapper", preserveNullAndEmptyArrays: true } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Pedidos en Curso";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_pedidos_autocancelados_usuario",function(req,res){
    var collection    =  datb.collection('Pedido');
    collection.aggregate([
		{ $match:  { 'usuario_id' : ObjectId(req.body.usuario._id), 'autocancelado_modal' : true } },
    { $sort : { 'fecha_alta' : -1 } },
		{ $lookup: { from: "Rango_Costo", localField: "rango_id", foreignField: "_id", as: "rango" } },
		{ $lookup: { from: "Direccion", localField: "ubicacion_entrega_id", foreignField: "_id", as: "ubicacion_entrega" } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Pedidos Autocancelados";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/update_pedido_autocancelado_visto",function(req,res){

    var collection	=  datb.collection('Pedido');

    var pedidos_ids =  [];
    for(var i = 0; i<req.body.pedidos.length; i++){
    	pedidos_ids.push(ObjectId(req.body.pedidos[i]._id));
    }

    collection.update(
		{ '_id' : { $in : pedidos_ids } },
        { $set: {
			'autocancelado_modal' : false
		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				var res_err      = {};
				res_err.status   = "success";
				res_err.message  = "OK";
				res.send(res_err);
			}
	});
});

router.post("/get_pedidos_todos_usuario",function(req,res){
    var collection    =  datb.collection('Pedido');
    collection.aggregate([
		{ $match:  { 'usuario_id' : ObjectId(req.body.usuario._id) } },
    { $sort : { 'fecha_alta' : -1 } },
		{ $lookup: { from: "Rango_Costo", localField: "rango_id", foreignField: "_id", as: "rango" } },
		{ $lookup: { from: "Direccion", localField: "ubicacion_entrega_id", foreignField: "_id", as: "ubicacion_entrega" } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Pedidos";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_categorias_negocio_sin_platillos",function(req,res){
    var collection	=  datb.collection('Categoria_Negocio');
    collection.aggregate([
      { $match :  { "status" : { $ne : 5 }, "negocio_id" : ObjectId(req.body.data._id)  }}
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            for( var i = 0; i<result.length; i++ ){

                result[i].foto = result[i].foto+'?'+makeid();
                result[i].platillos = [];
            }

            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Categorias";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_platillos_by_categoria_id",function(req,res){
    var collection	=  datb.collection('Platillo');
    collection.aggregate([
      { $match :  { "status" : { $ne : 5 }, "categoria_id" : ObjectId(req.body.data._id)  }},
  		{ $lookup: { from: "Producto_Foto", localField: "_id", foreignField: "producto_id", as: "galeria" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Platillos";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_direcciones_usuario",function(req,res){
    var collection    =  datb.collection('Direccion');
    collection.aggregate([
		{ $match:  { "usuario_id" : ObjectId(req.body.usuario._id) } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Direcciones";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_rango_costo",function(req,res){
    var collection    =  datb.collection('Rango_Costo');
    collection.aggregate([
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Rango_Costo";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/nuev_hacienda",function(req,res){
    var collection				=  datb.collection('Hacienda');
	req.body.data.usuario_alta	= new ObjectId(req.body.data.usuario_alta);
    collection.insert(req.body.data, function(err, result) {
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            result.status  = "success";
			result.message = "Hacienda agregada :)";
			res.send(result);
        }
    });
});

router.post("/get_servicios",function(req,res){
    var collection    =  datb.collection('Servicio');
    collection.aggregate([
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Servicios";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_servicios_by_categoria",function(req,res){
    var collection    =  datb.collection('Servicio');
    collection.aggregate([
      { $match : { "categoria_id" : ObjectId(req.body.data.categoria_id) , "status" : { $ne : 5 } } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Servicios";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_especialidades",function(req,res){
    var collection    =  datb.collection('Especialidad');
    collection.aggregate([
      { $match : { "status" : { $ne : 5 } } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Especialidades";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_especialidades_negocio",function(req,res){
    var collection    =  datb.collection('Especialidad_Negocio');
    collection.aggregate([
      { $match : { "status" : { $ne : 5 }, "negocio_id" : ObjectId(req.body.data._id) } },
      { $lookup: { from: "Especialidad", localField: "especialidad_id", foreignField: "_id", as: "especialidad" } },
      { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            for( var i = 0; i<result.length; i++ ){
              if( result[i].especialidad.length > 0 ){
                  result[i].especialidad = result[i].especialidad[0];
              }else{
                delete result[i].especialidad;
              }
              if( result[i].negocio.length > 0 ){
                  result[i].negocio = result[i].negocio[0];
              }else{
                delete result[i].negocio;
              }
            }
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Especialidades";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});


router.post("/get_formas_de_pago",function(req,res){
    var collection    =  datb.collection('Forma_Pago');
    collection.aggregate([
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Formas de pago";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/nuev_mensaje",function(req,res){
    var collection				=  datb.collection('Mensaje');
	req.body.data.usuario_alta	= new ObjectId(req.body.data.usuario_alta);
	req.body.data.rotacion_id	= new ObjectId(req.body.data.rotacion_id);
    collection.insert(req.body.data, function(err, result) {
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            result.status  = "success";
			result.message = "Mensaje enviado.";
			res.send(result);
        }
    });
});

router.post("/get_tipos_restaurantes",function(req,res){
    var collection    =  datb.collection('Tipo_Restaurante');
    collection.aggregate([
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Tipo_Restaurante";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_tipos_pedidos",function(req,res){
    var collection    =  datb.collection('Tipo_Pedido');
    collection.aggregate([
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Tipo_Pedido";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_tipos_facturacion",function(req,res){
    var collection    =  datb.collection('Tipo_Facturacion');
    collection.aggregate([
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Tipo_Facturacion";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_pagos_delivery",function(req,res){
    var collection    =  datb.collection('Pagos_Delivery');
    collection.aggregate([
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Pagos_Delivery";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_pagos_restaurante",function(req,res){
    var collection    =  datb.collection('Pagos_Restaurante');
    collection.aggregate([
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Pagos_Restaurante";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/update_logo_restaurante",function(req,res){
    var collection           =  datb.collection('Restaurante');
    var rest_id           	 =  ObjectId(req.body.data._id);
	var foto_rest     	 	 =  req.body.data.logo;

	var data = foto_rest.replace(/^data:image\/\w+;base64,/, "");
	var buf = new Buffer(data, 'base64');
	fs.writeFile('appgen/'+req.body.data._id+'_logo.png', buf);

    collection.update(
		{ '_id' : rest_id },
        { $set: { 'logo' :  'http://165.227.30.166:3025/appgen/'+req.body.data._id+'_logo.png' } },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				var res_err      = {};
				res_err.status   = "success";
				res_err.foto   	 = 'http://165.227.30.166:3025/appgen/'+req.body.data._id+'_logo.png'
				res_err.message  = "Actualizaste tu logo";
				res_err.result	 = result;
				res.send(res_err);
			}
	});
});

router.post("/aprobar_revision",function(req,res){
    var collection           =  datb.collection('Restaurante');
    var rest_id           	 =  ObjectId(req.body.restaurante._id);
	var rev_id           	 =  ObjectId(req.body.revision._id);
	req.body.revision.tipo_restaurante_id 		= ObjectId(req.body.revision.tipo_restaurante_id);
	req.body.revision.moneda_id 			 	= ObjectId(req.body.revision.moneda_id);
    collection.update(
		{ '_id' : rest_id },
        { $set: {
			'nombre' : req.body.revision.nombre,
			'logo' : req.body.revision.logo,
			'cover' : req.body.revision.cover,
			'tipo_revision_id' : req.body.revision.tipo_revision_id,
			'descripcion' : req.body.revision.descripcion,
			'envio' : req.body.revision.envio,
			'costo_envio' : req.body.revision.costo_envio,
			'radio_entrega' : req.body.revision.radio_entrega,
			'moneda' : req.body.revision.moneda_id,
			'metodo_de_pago' : req.body.revision.metodo_de_pago,
			'tags' : req.body.revision.tags,
			'direccion' : req.body.revision.direccion,
			'latitude' : req.body.revision.latitude,
			'longitude' : req.body.revision.longitude,
			'coordenadas' : req.body.revision.coordenadas,
			'lunes' : req.body.revision.lunes,
			'martes' : req.body.revision.martes,
			'miercoles' : req.body.revision.miercoles,
			'jueves' : req.body.revision.jueves,
			'viernes' : req.body.revision.viernes,
			'sabado' : req.body.revision.sabado,
			'domingo' : req.body.revision.domingo,
			'facilidades' : req.body.revision.facilidades,
			'tipos_comida' : req.body.revision.tipos_comida,
			'tipos_pedido' : req.body.revision.tipos_pedido,
			'tipos_facturacion' : req.body.revision.tipos_facturacion,
			'pagos_delivery' : req.body.revision.pagos_delivery,
			'pagos_en_restaurante' : req.body.revision.pagos_en_restaurante,
			'status' : 2
		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				collection           =  datb.collection('Revision');
				collection.update(
					{ '_id' : rev_id },
					{ $set: {
						'revision_status' : 2
					} },
					function(err, result){
						if(err){
							var res_err      = {};
							res_err.status   = "error";
							res_err.error    = err;
							res_err.message  = err;
							res.send(res_err);
						}
						else{
							var res_data      = {};
							res_data.status   = "success";
							res_data.message  = "Revisión aprobada";
							res_data.data     = result;
							res.send(res_data);
						}
				});
			}
	});
});

router.post("/update_cover_restaurante",function(req,res){
    var collection           =  datb.collection('Restaurante');
    var rest_id           	 =  ObjectId(req.body.data._id);
	var foto_rest     	 	 =  req.body.data.cover;

	var data = foto_rest.replace(/^data:image\/\w+;base64,/, "");
	var buf = new Buffer(data, 'base64');
	fs.writeFile('appgen/'+req.body.data._id+'_cover.png', buf);

    collection.update(
		{ '_id' : rest_id },
        { $set: { 'cover' :  'http://165.227.30.166:3025/appgen/'+req.body.data._id+'_cover.png' } },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				var res_err      = {};
				res_err.status   = "success";
				res_err.foto   	 = 'http://165.227.30.166:3025/appgen/'+req.body.data._id+'_cover.png'
				res_err.message  = "Actualizaste la foto";
				res_err.result	 = result;
				res.send(res_err);
			}
	});
});

router.post("/get_monedas",function(req,res){
    var collection    =  datb.collection('Moneda');
    collection.aggregate([
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Monedas";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_tags_platillos",function(req,res){
    var collection    =  datb.collection('Tags_Platillos');
    collection.aggregate([
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Tags_Platillos";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_metodos_pagos",function(req,res){
    var collection    =  datb.collection('Metodo_Pago');
    collection.aggregate([
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Metodo_Pago";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});


/// bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp
/// bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp
/// bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp
/// bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp
/// bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp
/// bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp
/// bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp bookapp


router.post("/autenticacion",function(req,res){
	Accountkit.getAccountInfo (req.body.data.code, function(err, resp) {
	    var collection      = datb.collection('Usuario');
	    console.log(resp.phone.number);
	    collection.aggregate([
	        { $match : { "telefono" : resp.phone.number } },
			{ $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } },
			{ $lookup: { from: "Negocio", localField: "_id", foreignField: "usuario_id", as: "negocio" } },
			{ $lookup: { from: "Modulo", localField: "tipo_usuario_id", foreignField: "tipo_usuario_id", as: "modulos" } },
			{ $lookup: { from: "Direccion", localField: "direccion_id", foreignField: "_id", as: "direccion" } },
			{ $lookup: { from: "Usuario_Tipo_Usuario", localField: "_id", foreignField: "usuario_id", as: "tipos_usuario" } }
	    ]).toArray(function(err, result){
	        if(err){
	            var res_err      = {};
	            res_err.status   = "error";
	            res_err.error    = err;
	            res_err.message  = err;
	            res.send(res_err);
	        }
			console.log(result);
	        if(result.length === 0){
	        	var nuev_usuario = {
	        		"telefono" 			: resp.phone.number,
	        		"nombre" 			: "Agregar mi nombre",
	        		"tipo_usuario_id" 	: ObjectId("5c40513258209844a83c8629"),
	        		"status"			: 1,
	        		"fecha_alta"		: new Date()
	        	};
	            collection.insert(nuev_usuario, function(err, result) {
			        if(err){
			            var res_err      = {};
			            res_err.status   = "error";
			            res_err.error    = err;
			            res_err.message  = err;
			            res.send(res_err);
			        }
			        else{
			        	console.log(resp.phone.number);
			            collection.aggregate([
					        { $match : { "telefono" : resp.phone.number } },
							{ $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } },
							{ $lookup: { from: "Modulo", localField: "tipo_usuario_id", foreignField: "tipo_usuario_id", as: "modulos" } }
					    ]).toArray(function(err, result){
					    	if(err){
					            var res_err      = {};
					            res_err.status   = "error";
					            res_err.error    = err;
					            res_err.message  = err;
					            res.send(res_err);
					        }else{

					        	var usuario_encontrado = result[0];

					        	collection = datb.collection('Usuario_Tipo_Usuario');
							    collection.aggregate([
							        { $match :
							        	{
							        		"usuario_id" : ObjectId(usuario_encontrado._id),
							        		"tipo_usuario_id" : ObjectId(usuario_encontrado.tipo_usuario_id)
							        	}
							        }
							    ]).toArray(function(err, result2){
							        if(err){
							            var res_err      = {};
							            res_err.status   = "error";
							            res_err.error    = err;
							            res_err.message  = err;
							            res.send(res_err);
							        }else{
							        	if(result2.length === 0){
								        	var nuev_usuario_tipo_usuario = {
								        		"usuario_id" : ObjectId(usuario_encontrado._id),
							        			"tipo_usuario_id" : ObjectId(usuario_encontrado.tipo_usuario_id)
								        	};
								            collection.insert(nuev_usuario_tipo_usuario, function(err, result) {
										        if(err){
										            var res_err      = {};
										            res_err.status   = "error";
										            res_err.error    = err;
										            res_err.message  = err;
										            res.send(res_err);
										        }
										        else{
										        	var res_data      = {};
									                res_data.status   = "success";
									                res_data.message  = "Bienvenido.";
									                res_data.data     = usuario_encontrado;
									                res.send(res_data);
										        }
										    });
								        }else{
								        	var res_data      = {};
							                res_data.status   = "success";
							                res_data.message  = "Bienvenido.";
							                res_data.data     = usuario_encontrado;
							                res.send(res_data);
								        }
						            }
							    });
				            }
					    });
			        }
			    });
	        }else{

	        	var usuario_encontrado = result[0];

	            if(usuario_encontrado.status != 1){
	                var res_data      = {};
	                res_data.status   = "info";
	                res_data.message  = "Tu cuenta esta inactiva, para mas información contacta soporte bookapp.";
	                res.send(res_data);
	            }else{
	            	collection = datb.collection('Usuario_Tipo_Usuario');
				    collection.aggregate([
				        { $match :
				        	{
				        		"usuario_id" : ObjectId(usuario_encontrado._id),
				        		"tipo_usuario_id" : ObjectId(usuario_encontrado.tipo_usuario_id)
				        	}
				        }
				    ]).toArray(function(err, result2){
				        if(err){
				            var res_err      = {};
				            res_err.status   = "error";
				            res_err.error    = err;
				            res_err.message  = err;
				            res.send(res_err);
				        }else{
				        	if(result2.length === 0){
					        	var nuev_usuario_tipo_usuario = {
					        		"usuario_id" : ObjectId(usuario_encontrado._id),
				        			"tipo_usuario_id" : ObjectId(usuario_encontrado.tipo_usuario_id)
					        	};
					            collection.insert(nuev_usuario_tipo_usuario, function(err, result) {
							        if(err){
							            var res_err      = {};
							            res_err.status   = "error";
							            res_err.error    = err;
							            res_err.message  = err;
							            res.send(res_err);
							        }
							        else{
							        	var res_data      = {};
						                res_data.status   = "success";
						                res_data.message  = "Bienvenido.";
						                res_data.data     = usuario_encontrado;
						                res.send(res_data);
							        }
							    });
					        }else{
					        	var res_data      = {};
				                res_data.status   = "success";
				                res_data.message  = "Bienvenido.";
				                res_data.data     = usuario_encontrado;
				                res.send(res_data);
					        }
			            }
				    });
	            }
	        }
	    });
	});
});

router.post("/autenticacion_prueba",function(req,res){
    var collection      = datb.collection('Usuario');
    collection.aggregate([
    { $match : { "telefono" : req.body.data.celular_prueba } },
		{ $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } },
    { $lookup: { from: "Negocio", localField: "_id", foreignField: "usuario_id", as: "negocio" } },
		{ $lookup: { from: "Modulo", localField: "tipo_usuario_id", foreignField: "tipo_usuario_id", as: "modulos" } },
		{ $lookup: { from: "Direccion", localField: "direccion_id", foreignField: "_id", as: "direccion" } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

          var usuario_t = result[0];

          if(usuario_t.negocio.length > 0){
            usuario_t.negocio = usuario_t.negocio[0];
            usuario_t.negocio_id = usuario_t.negocio._id;
          }

          var res_data      = {};
          res_data.status   = "success";
          res_data.message  = "Bienvenido.";
          res_data.data     = usuario_t;
          res.send(res_data);
        }
    });
});

router.post("/autenticacion_repartidor_prueba",function(req,res){
    var collection      = datb.collection('Usuario');
    collection.aggregate([
    { $match : { "telefono" : "+528118949132" } },
		{ $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } },
		{ $lookup: { from: "Modulo", localField: "tipo_usuario_id", foreignField: "tipo_usuario_id", as: "modulos" } },
		{ $lookup: { from: "Direccion", localField: "direccion_id", foreignField: "_id", as: "direccion" } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
          var res_data      = {};
          res_data.status   = "success";
          res_data.message  = "Bienvenido.";
          res_data.data     = result[0];
          res.send(res_data);
        }
    });
});

router.post("/autolog",function(req,res){
	var collection      = datb.collection('Usuario');
    collection.aggregate([
        { $match : { "telefono" : req.body.data.telefono } },
		{ $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } },
		{ $lookup: { from: "Modulo", localField: "tipo_usuario_id", foreignField: "tipo_usuario_id", as: "modulos" } },
		{ $lookup: { from: "Negocio", localField: "_id", foreignField: "usuario_id", as: "negocio" } },
		{ $lookup: { from: "Direccion", localField: "direccion_id", foreignField: "_id", as: "direccion" } },
		{ $lookup: { from: "Usuario_Tipo_Usuario", localField: "_id", foreignField: "usuario_id", as: "tipos_usuario" } },
		{ $unwind: { path: "$tipos_usuario", preserveNullAndEmptyArrays: true } },
		{ $lookup: { from: "Tipo_Usuario", localField: "tipos_usuario.tipo_usuario_id", foreignField: "_id", as: "tipos_usuario.descripcion" } },
		{
			$group: {
				"_id" : "$_id",
				"correo" : { "$first": "$correo" },
				"telefono" : { "$first": "$telefono" },
		        "nombre" : { "$first": "$nombre" },
		        "tipo_usuario_id" : { "$first": "$tipo_usuario_id" },
		        "status" : { "$first": "$status" },
		        "fecha_alta" : { "$first": "$fecha_alta" },
		        "direccion_id" : { "$first": "$direccion_id" },
		        "customer_id" : { "$first": "$customer_id" },
		        "location" : { "$first": "$location" },
		        "foto" : { "$first": "$foto" },
		        "foto_frontal_identificacion" : { "$first": "$foto_frontal_identificacion" },
		        "foto_posterior_identificacion" : { "$first": "$foto_posterior_identificacion" },
		        "foto_frontal_licencia" : { "$first": "$foto_frontal_licencia" },
		        "foto_posterior_licencia" : { "$first": "$foto_posterior_licencia" },
		        "foto_frontal_seguro" : { "$first": "$foto_frontal_seguro" },
		        "foto_posterior_seguro" : { "$first": "$foto_posterior_seguro" },
		        "foto_frontal_propiedad" : { "$first": "$foto_frontal_propiedad" },
		        "foto_posterior_propiedad" : { "$first": "$foto_posterior_propiedad" },
		        "nombre_completo" : { "$first": "$nombre_completo" },
		        "fecha_nacimiento" : { "$first": "$fecha_nacimiento" },
		        "tipo_vehiculo_id" : { "$first": "$tipo_vehiculo_id" },
		        "marca_vehiculo" : { "$first": "$marca_vehiculo" },
		        "modelo_vehiculo" : { "$first": "$modelo_vehiculo" },
		        "placa_vehiculo" : { "$first": "$placa_vehiculo" },
		        "identificacion_oficial" : { "$first": "$identificacion_oficial" },
		        "direccion_identificacion_oficial" : { "$first": "$direccion_identificacion_oficial" },
		        "solicitud_bookapper" : { "$first": "$solicitud_bookapper" },
		        "fecha_solicitud" : { "$first": "$fecha_solicitud" },

		        "tipo_usuario" : { "$first": "$tipo_usuario" },
		        "modulos" : { "$first": "$modulos" },
		        "direccion" : { "$first": "$direccion" },
		        "negocio" : { "$first": "$negocio" },

				"tipos_usuario" : { "$push": "$tipos_usuario" }
			}
		},
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        if(result.length === 0){
        	var res_data      = {};
            res_data.status   = "info";
            res_data.message  = "Cuenta no encontrada.";
            res.send(res_data);
        }else{
            if(result[0].status != 1){
                var res_data      = {};
                res_data.status   = "info";
                res_data.message  = "Tu cuenta esta inactiva, para mas información contacta soporte bookapp.";
                res.send(res_data);
            }else{

            	if(result[0].tipos_usuario){
            		if(result[0].tipos_usuario[0]._id === undefined){
            			result[0].tipos_usuario = [];
            		}
            	}

                var res_data      = {};
                res_data.status   = "success";
                res_data.message  = "Bienvenido.";
                res_data.data     = result[0];
                res.send(res_data);
            }
        }
    });
});

router.post("/actualizar_perfil",function(req,res){
    var collection						=  datb.collection('Usuario');
    mercadopago.customers.create({"email" : req.body.data.correo} , function (err, customer) {
		if(err){
			var res_err      = {};
			res_err.status   = "error";
			res_err.error    = err;
			res_err.message  = err;
			if(res_err.error){
				if(res_err.error.cause){
					if( res_err.error.cause[0].code === "101" ){
						collection.update(
							{ '_id' : ObjectId(req.body.data._id) },
					        { $set: {
								'nombre' : req.body.data.nombre,
								'correo' : req.body.data.correo,
								'direccion_id' : ObjectId(req.body.data.direccion_id)
							} },
							function(err, result){
								if(err){
									var res_err      = {};
									res_err.status   = "error";
									res_err.error    = err;
									res_err.message  = err;
									res.send(res_err);
								}
								else{
									var res_err      = {};
									res_err.status   = "success";
									res_err.message  = "Bienvenido.";
									res.send(res_err);
								}
						});
					}else{
						res.send(res_err);
					}
				}else{
					res.send(res_err);
				}
			}else{
				res.send(res_err);
			}
		}
		req.body.data.customer_id = customer.body.id;
	    collection.update(
			{ '_id' : ObjectId(req.body.data._id) },
	        { $set: {
				'nombre' : req.body.data.nombre,
				'correo' : req.body.data.correo,
				'direccion_id' : ObjectId(req.body.data.direccion_id),
				'customer_id' : req.body.data.customer_id
			} },
			function(err, result){
				if(err){
					var res_err      = {};
					res_err.status   = "error";
					res_err.error    = err;
					res_err.message  = err;
					res.send(res_err);
				}
				else{
					var res_err      = {};
					res_err.status   = "success";
					res_err.message  = "Bienvenido.";
					res.send(res_err);
				}
		});
	});
});

router.post("/get_tarjetas",function(req,res){
    mercadopago.customers.cards.all(req.body.customer.customer_id).then(function (cards) {
		console.log(cards);
		var res_data      = {};
		res_data.status   = "success";
		res_data.message  = "Tarjetas.";
		res_data.data  = cards;
		res.send(res_data);
	}).catch(function (error) {
		console.log(error);
		var res_data      = {};
		res_data.status   = "success";
		res_data.message  = "Error al actualizar la información.";
		res_data.data     = error;
		res.send(res_data);
	});
});

router.post("/nuev_tarjeta",function(req,res){
    mercadopago.customers.cards.create(req.body.tarjeta).then(function (card) {
		console.log(card);
		var res_data      = {};
		res_data.status   = "success";
		res_data.message  = "Tarjeta actualizada.";
		res.send(res_data);
	}).catch(function (error) {
		console.log(error);
		var res_data      = {};
		res_data.status   = "success";
		res_data.message  = "Error al actualizar la información.";
		res_data.data     = error;
		res.send(res_data);
	});
});


///////////////////////////////////////// R E C E N T

router.post("/nuev_negocio",function(req,res){
    var collection						=  datb.collection('Negocio');
    req.body.data.status = 4;
    req.body.data.location =  { type: "Point",
      coordinates: [
        0,0
      ]
    };
    req.body.data.main = true;
    req.body.data.categoria_id = ObjectId(req.body.data.categoria_id);
    delete req.body.data.categoria;
    delete req.body.data.usuario;
    collection.insert(req.body.data, function(err, result) {
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
			var res_data      = {};
			res_data.status   = "success";
			res_data.message  = "¡Negocio registrado!";
			res_data.data     = result;
			res.send(res_data);
        }
    });
});

router.post("/nuev_sucursal",function(req,res){
    var collection						=  datb.collection('Negocio');
    req.body.data.status = 4;
    req.body.data.location =  { type: "Point",
      coordinates: [
        0,0
      ]
    };
    req.body.data.main = false;
    req.body.data.marca_id = ObjectId(req.body.negocio._id);
    req.body.data.categoria_id = ObjectId(req.body.negocio.categoria_id);
    if( req.body.negocio.foto ){
      req.body.data.foto = req.body.negocio.foto;
    }
    req.body.data.sucursal = true;
    delete req.body.data.categoria;
    delete req.body.data.usuario;
    collection.insert(req.body.data, function(err, result) {
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
      			var res_data      = {};
      			res_data.status   = "success";
      			res_data.message  = "¡Sucursal registrada!";
      			res_data.data     = result;
      			res.send(res_data);
        }
    });
});

// router.post("/borrar_negocio",function(req,res){
//     var collection	=  datb.collection('Negocio');
//     collection.deleteOne(
//         { '_id' : ObjectId(req.body.data._id) },
//         function(err, result){
//             if(err){
//                 var res_err      = {};
//                 res_err.status   = "error";
//                 res_err.error    = err;
//                 res_err.message  = err;
//                 res.send(res_err);
//             }
//             else{
//                 var res_data    = {};
//                 res_data.status  = "success";
//                 res_data.message = "Negocio eliminado.";
//                 res.send(res_data);
//             }
//     });
// });

router.post("/actualizar_negocio",function(req,res){
    var collection	=  datb.collection('Negocio');
    collection.update(
		{ '_id' : ObjectId(req.body.data._id) },
        { $set: {
      'entrega_en_tienda' : req.body.data.entrega_en_tienda,
			'delivery' : req.body.data.delivery,
      'tipo_delivery' : req.body.data.tipo_delivery,
      'tipo_costo_envio' : req.body.data.tipo_costo_envio,
      'costo_delivery' : req.body.data.costo_delivery,
      'asignacion_delivery' : req.body.data.asignacion_delivery,
      'kms_delivery' : req.body.data.kms_delivery,
      'rfc' : req.body.data.rfc,
      'nombre' : req.body.data.nombre,
      'descripcion' : req.body.data.descripcion,
      'telefono' : req.body.data.telefono,
      'comision' : req.body.data.comision,
      'categoria_id' : ObjectId(req.body.data.categoria_id),
      'usuario_id' :  ObjectId(req.body.data.usuario_id),
      'costo_cancelacion' : req.body.data.costo_cancelacion,
      'direccion' : req.body.data.direccion,
      'latitude' : req.body.data.latitude,
      'longitude' : req.body.data.longitude,
      'location' : { type: "Point",
        coordinates: [
          req.body.data.longitude,
          req.body.data.latitude
        ]
      },
      'fecha_nacimiento' : req.body.data.fecha_nacimiento,
      'id_personal' : req.body.data.id_personal,
      'id_foto_anverso_url' : req.body.data.id_foto_anverso_url,
      'id_foto_inverso_url' : req.body.data.id_foto_inverso_url,
      'id_foto_ruc_url' : req.body.data.id_foto_ruc_url,
      'estado' : req.body.data.estado,
      'sitio_web' : req.body.data.sitio_web,
      'clabe_bancaria' : req.body.data.clabe_bancaria,
      'pago_efectivo' : req.body.data.pago_efectivo,
      'pago_tarjeta' : req.body.data.pago_tarjeta,

      'impuesto' : req.body.data.impuesto,
      'costo_envio' : req.body.data.costo_envio,

      'titular_cuenta' : req.body.data.titular_cuenta,
      'numero_cuenta' : req.body.data.numero_cuenta,
      'tipo_cuenta_bancaria' : req.body.data.tipo_cuenta_bancaria,
      'banco' : req.body.data.banco,
      'cedula' : req.body.data.cedula,
      'costo_minimo' : req.body.data.costo_minimo,
      'tiempo_estimado' : req.body.data.tiempo_estimado,
      'perfil_completo' : true

		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
        collection    =  datb.collection('Usuario');
        collection.aggregate([
          { $match :  { "tipo_usuario_id" : ObjectId("5c4050f358209844a83c8622") }}
        ]).toArray(function(err, result){
            if(err){
                var res_err      = {};
                res_err.status   = "error";
                res_err.error    = err;
                res_err.message  = err;
                res.send(res_err);
            }else{

                for( var i = 0; i<result.length; i++ ){
                  nueva_notificacion(
                    req.body.data._id,
                    result[i]._id,
                    new Date(),
                    "El negocio: " + req.body.data.nombre + " actualizo su información."
                  );
                }

                var res_err      = {};
                res_err.status   = "success";
                res_err.message  = "Negocio actualizado.";
                res.send(res_err);
            }
        });
			}
	});
});

router.post("/actualizar_sucursal",function(req,res){
    var collection	=  datb.collection('Negocio');

    var usuario_id_t = "";
    if( req.body.data.usuario_id ){
      usuario_id_t = ObjectId(req.body.data.usuario_id);
    }

    collection.update(
		{ '_id' : ObjectId(req.body.data._id) },
        { $set: {
      'entrega_en_tienda' : req.body.data.entrega_en_tienda,
			'delivery' : req.body.data.delivery,
      'tipo_delivery' : req.body.data.tipo_delivery,
      'tipo_costo_envio' : req.body.data.tipo_costo_envio,
      'costo_delivery' : req.body.data.costo_delivery,
      'asignacion_delivery' : req.body.data.asignacion_delivery,
      'kms_delivery' : req.body.data.kms_delivery,
      'categoria_id' :  ObjectId(req.body.data.categoria_id),
      'usuario_id' :  usuario_id_t,
      'foto' : req.body.negocio.foto,
      'rfc' : req.body.data.rfc,
      'nombre' : req.body.data.nombre,
      'descripcion' : req.body.data.descripcion,
      'telefono' : req.body.data.telefono,
      'comision' : req.body.data.comision,
      'costo_cancelacion' : req.body.data.costo_cancelacion,
      'direccion' : req.body.data.direccion,
      'latitude' : req.body.data.latitude,
      'longitude' : req.body.data.longitude,
      'location' : { type: "Point",
        coordinates: [
          req.body.data.longitude,
          req.body.data.latitude
        ]
      },
      'fecha_nacimiento' : req.body.data.fecha_nacimiento,
      'id_personal' : req.body.data.id_personal,
      'id_foto_anverso_url' : req.body.data.id_foto_anverso_url,
      'id_foto_inverso_url' : req.body.data.id_foto_inverso_url,
      'id_foto_ruc_url' : req.body.data.id_foto_ruc_url,
      'estado' : req.body.data.estado,
      'sitio_web' : req.body.data.sitio_web,
      'clabe_bancaria' : req.body.data.clabe_bancaria,
      'pago_efectivo' : req.body.data.pago_efectivo,
      'pago_tarjeta' : req.body.data.pago_tarjeta,

      'impuesto' : req.body.data.impuesto,
      'costo_envio' : req.body.data.costo_envio,

      'titular_cuenta' : req.body.data.titular_cuenta,
      'numero_cuenta' : req.body.data.numero_cuenta,
      'tipo_cuenta_bancaria' : req.body.data.tipo_cuenta_bancaria,
      'banco' : req.body.data.banco,
      'cedula' : req.body.data.cedula,
      'costo_minimo' : req.body.data.costo_minimo,
      'tiempo_estimado' : req.body.data.tiempo_estimado,
      'perfil_completo' : true,

      'lunes_trabaja' : req.body.data.lunes_trabaja,
      'martes_trabaja' : req.body.data.martes_trabaja,
      'miercoles_trabaja' : req.body.data.miercoles_trabaja,
      'jueves_trabaja' : req.body.data.jueves_trabaja,
      'viernes_trabaja' : req.body.data.viernes_trabaja,
      'sabado_trabaja' : req.body.data.sabado_trabaja,
      'domingo_trabaja' : req.body.data.domingo_trabaja,

      'lunes_inicia' : req.body.data.lunes_inicia,
      'martes_inicia' : req.body.data.martes_inicia,
      'miercoles_inicia' : req.body.data.miercoles_inicia,
      'jueves_inicia' : req.body.data.jueves_inicia,
      'viernes_inicia' : req.body.data.viernes_inicia,
      'sabado_inicia' : req.body.data.sabado_inicia,
      'domingo_inicia' : req.body.data.domingo_inicia,

      'lunes_termina' : req.body.data.lunes_termina,
      'martes_termina' : req.body.data.martes_termina,
      'miercoles_termina' : req.body.data.miercoles_termina,
      'jueves_termina' : req.body.data.jueves_termina,
      'viernes_termina' : req.body.data.viernes_termina,
      'sabado_termina' : req.body.data.sabado_termina,
      'domingo_termina' : req.body.data.domingo_termina,

      'numero_de_mesas' : req.body.data.numero_de_mesas,

		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
        collection    =  datb.collection('Usuario');
        collection.aggregate([
          { $match :  { "tipo_usuario_id" : ObjectId("5c4050f358209844a83c8622") }}
        ]).toArray(function(err, result){
            if(err){
                var res_err      = {};
                res_err.status   = "error";
                res_err.error    = err;
                res_err.message  = err;
                res.send(res_err);
            }else{

                for( var i = 0; i<result.length; i++ ){
                  nueva_notificacion(
                    req.body.data._id,
                    result[i]._id,
                    new Date(),
                    "La sucursal: " + req.body.data.nombre + " actualizo su información."
                  );
                }

                var res_err      = {};
                res_err.status   = "success";
                res_err.message  = "Sucursal actualizada.";
                res.send(res_err);
            }
        });
			}
	});
});

router.post("/get_horarios_disponibles",function(req,res){
  var collection    =  datb.collection('Negocio');
  collection.aggregate([
    { $match :  { "_id" : ObjectId(req.body.negocio._id) }},
    { $lookup: { from: "Pedido", localField: "_id", foreignField: "negocio_id", as: "citas" } }
  ]).toArray(function(err, result){
    if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
    }else{

      var negocio_t = result[0];

      var start_date    = new Date(
        req.body.data.anio,
        req.body.data.mes,
        1
      );
      var end_date      = new Date(
        req.body.data.anio,
        req.body.data.mes + 1,
        0
      );

      var horarios  = [];
      var day_t  = new Date(req.body.data.fecha_cita).getDay();
      var date_t = new Date(req.body.data.fecha_cita).getDate();

      console.log("get_horarios_disponibles -----------------------------------------------------------------");
      console.log(req.body.data.fecha_cita);

      switch(day_t){
        //Domingo
        case 0:
          if( negocio_t.domingo_trabaja ){
            if( negocio_t.domingo_inicia ){
              if( negocio_t.domingo_termina ){
                var citas_inicio = new Date(
                  req.body.data.anio,
                  req.body.data.mes,
                  date_t
                );
                citas_inicio.setHours( negocio_t.domingo_inicia.hour );
                citas_inicio.setMinutes( negocio_t.domingo_inicia.minute );
                var citas_fin    = new Date(
                  req.body.data.anio,
                  req.body.data.mes,
                  date_t
                );
                citas_fin.setHours( negocio_t.domingo_termina.hour );
                citas_fin.setMinutes( negocio_t.domingo_termina.minute );
                horarios.push({
                  "start"     : new Date( citas_inicio ),
                  "end"       : new Date( citas_inicio.setMinutes( citas_inicio.getMinutes()
                                + parseInt(req.body.data.servicio.tiempo_alquilacion.minutos) ) ),
                  "title"     : "Cita: ",
                  "color"     : {
                                  primary: '#0cb43f',
                                  secondary: '#0cb43f'
                                },
                  "allDay"    : false,
                  "resizable" : {
                                  beforeStart: false,
                                  afterEnd: false
                                },
                  "draggable" : false,
                  "disponible" : true
                });
                while( citas_inicio < citas_fin ){
                  horarios.push({
                    "start"     : new Date( citas_inicio ),
                      "end"     : new Date( citas_inicio.setMinutes( citas_inicio.getMinutes()
                                    + parseInt(req.body.data.servicio.tiempo_alquilacion.minutos) ) ),
                    "title"     : "Cita: ",
                    "color"     : {
                                    primary: '#0cb43f',
                                    secondary: '#0cb43f'
                                  },
                    "allDay"    : false,
                    "resizable" : {
                                    beforeStart: false,
                                    afterEnd: false
                                  },
                    "draggable" : false,
                    "disponible" : true
                  });
                }
              }
            }
          }
        break;
        //Lunes
        case 1:
          if( negocio_t.lunes_trabaja ){
            console.log(2);
            if( negocio_t.lunes_inicia ){
              if( negocio_t.lunes_termina ){

                var citas_inicio = new Date(
                  req.body.data.anio,
                  req.body.data.mes,
                  date_t
                );
                citas_inicio.setHours( negocio_t.lunes_inicia.hour );
                citas_inicio.setMinutes( negocio_t.lunes_inicia.minute );

                var citas_fin    = new Date(
                  req.body.data.anio,
                  req.body.data.mes,
                  date_t
                );
                citas_fin.setHours( negocio_t.lunes_termina.hour );
                citas_fin.setMinutes( negocio_t.lunes_termina.minute );

                horarios.push({
                  "start"     : new Date( citas_inicio ),
                  "end"       : new Date( citas_inicio.setMinutes( citas_inicio.getMinutes()
                                + parseInt(req.body.data.servicio.tiempo_alquilacion.minutos) ) ),
                  "title"     : "Cita: ",
                  "color"     : {
                                  primary: '#0cb43f',
                                  secondary: '#0cb43f'
                                },
                  "allDay"    : false,
                  "resizable" : {
                                  beforeStart: false,
                                  afterEnd: false
                                },
                  "draggable" : false,
                  "disponible" : true,
                  "disponible" : true
                });

                while( citas_inicio < citas_fin ){
                  horarios.push({
                    "start"     : new Date( citas_inicio ),
                    "end"       : new Date( citas_inicio.setMinutes( citas_inicio.getMinutes()
                                  + parseInt(req.body.data.servicio.tiempo_alquilacion.minutos) ) ),
                    "title"     : "Cita: ",
                    "color"     : {
                                    primary: '#0cb43f',
                                    secondary: '#0cb43f'
                                  },
                    "allDay"    : false,
                    "resizable" : {
                                    beforeStart: false,
                                    afterEnd: false
                                  },
                    "draggable" : false,
                    "disponible" : true
                  });
                }

              }
            }
          }
        break;
        //Martes
        case 2:
          if( negocio_t.martes_trabaja ){
            console.log(3);
            if( negocio_t.martes_inicia ){
              if( negocio_t.martes_termina ){

                var citas_inicio = new Date(
                  req.body.data.anio,
                  req.body.data.mes,
                  date_t
                );
                citas_inicio.setHours( negocio_t.martes_inicia.hour );
                citas_inicio.setMinutes( negocio_t.martes_inicia.minute );

                console.log(citas_inicio);

                var citas_fin    = new Date(
                  req.body.data.anio,
                  req.body.data.mes,
                  date_t
                );
                citas_fin.setHours( negocio_t.martes_termina.hour );
                citas_fin.setMinutes( negocio_t.martes_termina.minute );

                console.log(citas_fin);

                horarios.push({
                  "start"     : new Date( citas_inicio ),
                  "end"       : new Date( citas_inicio.setMinutes( citas_inicio.getMinutes()
                                + parseInt(req.body.data.servicio.tiempo_alquilacion.minutos) ) ),
                  "title"     : "Cita: ",
                  "color"     : {
                                  primary: '#0cb43f',
                                  secondary: '#0cb43f'
                                },
                  "allDay"    : false,
                  "resizable" : {
                                  beforeStart: false,
                                  afterEnd: false
                                },
                  "draggable" : false,
                  "disponible" : true
                });

                console.log("------------------------------------");
                console.log(horarios[horarios.length-1].start);
                console.log(horarios[horarios.length-1].end);

                while( citas_inicio < citas_fin ){
                  horarios.push({
                    "start"     : new Date( citas_inicio ),
                    "end"       : new Date( citas_inicio.setMinutes( citas_inicio.getMinutes()
                                  + parseInt(req.body.data.servicio.tiempo_alquilacion.minutos) ) ),
                    "title"     : "Cita: ",
                    "color"     : {
                                    primary: '#0cb43f',
                                    secondary: '#0cb43f'
                                  },
                    "allDay"    : false,
                    "resizable" : {
                                    beforeStart: false,
                                    afterEnd: false
                                  },
                    "draggable" : false,
                    "disponible" : true
                  });
                  console.log("------------------------------------");
                  console.log(horarios[horarios.length-1].start);
                  console.log(horarios[horarios.length-1].end);
                }

              }
            }
          }
        break;
        //Miércoles
        case 3:
          if( negocio_t.miercoles_trabaja ){
            console.log(4);
            if( negocio_t.miercoles_inicia ){
              if( negocio_t.miercoles_termina ){

                var citas_inicio = new Date(
                  req.body.data.anio,
                  req.body.data.mes,
                  date_t
                );
                citas_inicio.setHours( negocio_t.miercoles_inicia.hour );
                citas_inicio.setMinutes( negocio_t.miercoles_inicia.minute );

                var citas_fin    = new Date(
                  req.body.data.anio,
                  req.body.data.mes,
                  date_t
                );
                citas_fin.setHours( negocio_t.miercoles_termina.hour );
                citas_fin.setMinutes( negocio_t.miercoles_termina.minute );

                horarios.push({
                  "start"     : new Date( citas_inicio ),
                  "end"       : new Date( citas_inicio.setMinutes( citas_inicio.getMinutes()
                                + parseInt(req.body.data.servicio.tiempo_alquilacion.minutos) ) ),
                  "title"     : "Cita: ",
                  "color"     : {
                                  primary: '#0cb43f',
                                  secondary: '#0cb43f'
                                },
                  "allDay"    : false,
                  "resizable" : {
                                  beforeStart: false,
                                  afterEnd: false
                                },
                  "draggable" : false,
                  "disponible" : true
                });

                while( citas_inicio < citas_fin ){
                  horarios.push({
                    "start"     : new Date( citas_inicio ),
                    "end"       : new Date( citas_inicio.setMinutes( citas_inicio.getMinutes()
                                  + parseInt(req.body.data.servicio.tiempo_alquilacion.minutos) ) ),
                    "title"     : "Cita: ",
                    "color"     : {
                                    primary: '#0cb43f',
                                    secondary: '#0cb43f'
                                  },
                    "allDay"    : false,
                    "resizable" : {
                                    beforeStart: false,
                                    afterEnd: false
                                  },
                    "draggable" : false,
                    "disponible" : true
                  });
                }

              }
            }
          }
        break;
        //Jueves
        case 4:
          if( negocio_t.jueves_trabaja ){
            console.log(5);
            if( negocio_t.jueves_inicia ){
              if( negocio_t.jueves_termina ){

                var citas_inicio = new Date(
                  req.body.data.anio,
                  req.body.data.mes,
                  date_t
                );
                citas_inicio.setHours( negocio_t.jueves_inicia.hour );
                citas_inicio.setMinutes( negocio_t.jueves_inicia.minute );

                var citas_fin    = new Date(
                  req.body.data.anio,
                  req.body.data.mes,
                  date_t
                );
                citas_fin.setHours( negocio_t.jueves_termina.hour );
                citas_fin.setMinutes( negocio_t.jueves_termina.minute );

                horarios.push({
                  "start"     : new Date( citas_inicio ),
                  "end"       : new Date( citas_inicio.setMinutes( citas_inicio.getMinutes()
                                + parseInt(req.body.data.servicio.tiempo_alquilacion.minutos) ) ),
                  "title"     : "Cita: ",
                  "color"     : {
                                  primary: '#0cb43f',
                                  secondary: '#0cb43f'
                                },
                  "allDay"    : false,
                  "resizable" : {
                                  beforeStart: false,
                                  afterEnd: false
                                },
                  "draggable" : false,
                  "disponible" : true
                });

                while( citas_inicio < citas_fin ){
                  horarios.push({
                    "start"     : new Date( citas_inicio ),
                    "end"       : new Date( citas_inicio.setMinutes( citas_inicio.getMinutes()
                                  + parseInt(req.body.data.servicio.tiempo_alquilacion.minutos) ) ),
                    "title"     : "Cita: ",
                    "color"     : {
                                    primary: '#0cb43f',
                                    secondary: '#0cb43f'
                                  },
                    "allDay"    : false,
                    "resizable" : {
                                    beforeStart: false,
                                    afterEnd: false
                                  },
                    "draggable" : false,
                    "disponible" : true
                  });
                }

              }
            }
          }
        break;
        //Viernes
        case 5:
          if( negocio_t.viernes_trabaja ){
            console.log(6);
            if( negocio_t.viernes_inicia ){
              if( negocio_t.viernes_termina ){

                var citas_inicio = new Date(
                  req.body.data.anio,
                  req.body.data.mes,
                  date_t
                );
                citas_inicio.setHours( negocio_t.viernes_inicia.hour );
                citas_inicio.setMinutes( negocio_t.viernes_inicia.minute );

                var citas_fin    = new Date(
                  req.body.data.anio,
                  req.body.data.mes,
                  date_t
                );
                citas_fin.setHours( negocio_t.viernes_termina.hour );
                citas_fin.setMinutes( negocio_t.viernes_termina.minute );

                horarios.push({
                  "start"     : new Date( citas_inicio ),
                  "end"       : new Date( citas_inicio.setMinutes( citas_inicio.getMinutes()
                                + parseInt(req.body.data.servicio.tiempo_alquilacion.minutos) ) ),
                  "title"     : "Cita: ",
                  "color"     : {
                                  primary: '#0cb43f',
                                  secondary: '#0cb43f'
                                },
                  "allDay"    : false,
                  "resizable" : {
                                  beforeStart: false,
                                  afterEnd: false
                                },
                  "draggable" : false,
                  "disponible" : true
                });

                while( citas_inicio < citas_fin ){
                  horarios.push({
                    "start"     : new Date( citas_inicio ),
                    "end"       : new Date( citas_inicio.setMinutes( citas_inicio.getMinutes()
                                  + parseInt(req.body.data.servicio.tiempo_alquilacion.minutos) ) ),
                    "title"     : "Cita: ",
                    "color"     : {
                                    primary: '#0cb43f',
                                    secondary: '#0cb43f'
                                  },
                    "allDay"    : false,
                    "resizable" : {
                                    beforeStart: false,
                                    afterEnd: false
                                  },
                    "draggable" : false,
                    "disponible" : true
                  });
                }

              }
            }
          }
        break;
        //Sábado
        case 6:
          if( negocio_t.sabado_trabaja ){
            console.log(7);
            if( negocio_t.sabado_inicia ){
              if( negocio_t.sabado_termina ){

                var citas_inicio = new Date(
                  req.body.data.anio,
                  req.body.data.mes,
                  date_t
                );
                citas_inicio.setHours( negocio_t.sabado_inicia.hour );
                citas_inicio.setMinutes( negocio_t.sabado_inicia.minute );

                var citas_fin    = new Date(
                  req.body.data.anio,
                  req.body.data.mes,
                  date_t
                );
                citas_fin.setHours( negocio_t.sabado_termina.hour );
                citas_fin.setMinutes( negocio_t.sabado_termina.minute );

                console.log("------------------------");
                console.log(citas_inicio);
                console.log(citas_fin);

                horarios.push({
                  "start"     : new Date( citas_inicio ),
                  "end"       : new Date( citas_inicio.setMinutes( citas_inicio.getMinutes()
                                + parseInt(req.body.data.servicio.tiempo_alquilacion.minutos) ) ),
                  "title"     : "Cita: ",
                  "color"     : {
                                  primary: '#0cb43f',
                                  secondary: '#0cb43f'
                                },
                  "allDay"    : false,
                  "resizable" : {
                                  beforeStart: false,
                                  afterEnd: false
                                },
                  "draggable" : false,
                  "disponible" : true
                });

                while( citas_inicio < citas_fin ){
                  console.log("entro while sabado");
                  console.log(citas_inicio);
                  horarios.push({
                    "start"     : new Date( citas_inicio ),
                    "end"       : new Date( citas_inicio.setMinutes( citas_inicio.getMinutes()
                                  + parseInt(req.body.data.servicio.tiempo_alquilacion.minutos) ) ),
                    "title"     : "Cita: ",
                    "color"     : {
                                    primary: '#0cb43f',
                                    secondary: '#0cb43f'
                                  },
                    "allDay"    : false,
                    "resizable" : {
                                    beforeStart: false,
                                    afterEnd: false
                                  },
                    "draggable"  : false,
                    "disponible" : true
                  });
                }

              }
            }
          }
        break;
      }
      for( var j = 0; j<negocio_t.citas.length; j++ ){
        for( var i = 0; i<horarios.length; i++ ){
          if(
            ( new Date(horarios[i].start) >=
              new Date(negocio_t.citas[j].inicio_cita)
            )
            &&
            ( new Date(horarios[i].end) <=
              new Date(negocio_t.citas[j].fin_cita)
            )
            && negocio_t.citas[j].status != 15
          ){
            horarios[i].color = {
              primary: '#d4d4d4',
              secondary: '#d4d4d4'
            };
            horarios[i].disponible = false;
          }
        }
      }
      var res_data      = {};
      res_data.status   = "success";
      res_data.message  = "Usuarios";
      res_data.fechas   = horarios;
      res.send(res_data);
    }
  });
});

router.post("/actualizar_servicio",function(req,res){

  var collection = datb.collection('Servicio');
  if( !(req.body.data._id === "") ){
    collection.update(
      { '_id' : ObjectId(req.body.data._id) },
      { $set: {
        'nombre' : req.body.data.nombre
      }},
      function(err, result2){
        if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
        }
        else{
          var res_data      = {};
          res_data.status   = "success";
          res_data.message  = "Servicio actualizado.";
          res.send(res_data);
        }
    });
  }else{
    delete req.body.data._id;
    req.body.data.categoria_id = ObjectId(req.body.data.categoria_id);
    collection.insert(req.body.data, function(err, result) {
  		if(err){
  			var res_err      = {};
  			res_err.status   = "error";
  			res_err.error    = err;
  			res_err.message  = err;
  			res.send(res_err);
  		}
  		else{
        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Servicio actualizado.";
        res.send(res_data);
      }
    });
  }
});

router.post("/actualizar_especialidad",function(req,res){

  var collection = datb.collection('Especialidad');
  if( !(req.body.data._id === "") ){
    collection.update(
      { '_id' : ObjectId(req.body.data._id) },
      { $set: {
        'nombre' : req.body.data.nombre
      }},
      function(err, result2){
        if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
        }
        else{
          var res_data      = {};
          res_data.status   = "success";
          res_data.message  = "Especialidad actualizada.";
          res.send(res_data);
        }
    });
  }else{
    delete req.body.data._id;
    collection.insert(req.body.data, function(err, result) {
  		if(err){
  			var res_err      = {};
  			res_err.status   = "error";
  			res_err.error    = err;
  			res_err.message  = err;
  			res.send(res_err);
  		}
  		else{
        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Especialidad actualizada.";
        res.send(res_data);
      }
    });
  }
});

router.post("/nuev_especialidad_negocio",function(req,res){
  var collection = datb.collection('Especialidad_Negocio');
  var especialidad_negocio_t = {};
  especialidad_negocio_t.negocio_id = ObjectId(req.body.negocio._id);
  especialidad_negocio_t.especialidad_id = ObjectId(req.body.data._id);
  collection.insert(especialidad_negocio_t, function(err, result) {
    if(err){
      var res_err      = {};
      res_err.status   = "error";
      res_err.error    = err;
      res_err.message  = err;
      res.send(res_err);
    }
    else{
      var res_data      = {};
      res_data.status   = "success";
      res_data.message  = "Especialidad actualizada.";
      res.send(res_data);
    }
  });
});

router.post("/borrar_especialidad_negocio",function(req,res){
    var collection	=  datb.collection('Especialidad_Negocio');
    collection.deleteOne(
        { '_id' : ObjectId(req.body.data._id) },
        function(err, result){
            if(err){
                var res_err      = {};
                res_err.status   = "error";
                res_err.error    = err;
                res_err.message  = err;
                res.send(res_err);
            }
            else{
                var res_data    = {};
                res_data.status  = "success";
                res_data.message = "Especialidad eliminada.";
                res.send(res_data);
            }
    });
});

router.post("/borrar_tiempo",function(req,res){
    var collection	=  datb.collection('Tiempo_Minuto');
    collection.deleteOne(
        { '_id' : ObjectId(req.body.data._id) },
        function(err, result){
            if(err){
                var res_err      = {};
                res_err.status   = "error";
                res_err.error    = err;
                res_err.message  = err;
                res.send(res_err);
            }
            else{
                var res_data    = {};
                res_data.status  = "success";
                res_data.message = "Eliminado.";
                res.send(res_data);
            }
    });
});

router.post("/actualizar_categoria",function(req,res){

  var collection                  = datb.collection('Categoria');

  var foto 						            = req.body.data.foto;
	req.body.data.foto 			        = "";

  console.log(req.body.data._id);

  if( !(req.body.data._id === "") ){

    req.body.data.foto =
    'https://codigeek.app/bookapp/bookapp_fotos/'+req.body.data._id+'_categoria_foto.png';

    if(foto.includes("data")){
      var data = foto.replace(/^data:image\/\w+;base64,/, "");
      var buf = new Buffer(data, 'base64');
      fs.writeFile('bookapp_fotos/'+req.body.data._id+'_categoria_foto.png', buf);
    }

    collection.update(
      { '_id' : ObjectId(req.body.data._id) },
      { $set: {
        'foto' : req.body.data.foto,
        'nombre' : req.body.data.nombre
      }},
      function(err, result2){
        if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
        }
        else{
          var res_data      = {};
          res_data.status   = "success";
          res_data.message  = "Categoría actualizada.";
          res.send(res_data);
        }
    });

  }else{

    delete req.body.data._id;
    collection.insert(req.body.data, function(err, result) {
  		if(err){
  			var res_err      = {};
  			res_err.status   = "error";
  			res_err.error    = err;
  			res_err.message  = err;
  			res.send(res_err);
  		}
  		else{

  			var ins_id = result.insertedIds[0];

        req.body.data.foto =
        'https://codigeek.app/bookapp/bookapp_fotos/'+ins_id+'_categoria_foto.png';
        var data = foto.replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer(data, 'base64');
        fs.writeFile('bookapp_fotos/'+ins_id+'_categoria_foto.png', buf);

        collection.update(
          { '_id' : ObjectId(ins_id) },
          { $set: {
            'foto' : req.body.data.foto
          }},
          function(err, result2){
            if(err){
              var res_err      = {};
              res_err.status   = "error";
              res_err.error    = err;
              res_err.message  = err;
              res.send(res_err);
            }
            else{
              var res_data      = {};
              res_data.status   = "success";
              res_data.message  = "Categoría actualizada.";
              res.send(res_data);
            }
        });

      }
    });

  }
});

router.post("/actualizar_publicidad",function(req,res){

  var collection                  = datb.collection('Publicidad');

  var foto 						            = req.body.data.foto;
	req.body.data.foto 			        = "";
  req.body.data.negocio_id        = ObjectId(req.body.negocio._id);
  req.body.data.fecha_alta        = new Date();

  console.log(req.body.data._id);

  if( !(req.body.data._id === "") ){

    req.body.data.foto =
    'https://codigeek.app/bookapp/bookapp_fotos/'+req.body.data._id+'_publicidad_foto.png';

    if(foto.includes("data")){
      var data = foto.replace(/^data:image\/\w+;base64,/, "");
      var buf = new Buffer(data, 'base64');
      fs.writeFile('bookapp_fotos/'+req.body.data._id+'_publicidad_foto.png', buf);
    }

    collection.update(
      { '_id' : ObjectId(req.body.data._id) },
      { $set: {
        'foto' : req.body.data.foto,
        'nombre' : req.body.data.nombre
      }},
      function(err, result2){
        if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
        }
        else{
          var res_data      = {};
          res_data.status   = "success";
          res_data.message  = "Publicidad solicitada.";
          res.send(res_data);
        }
    });

  }else{

    delete req.body.data._id;
    collection.insert(req.body.data, function(err, result) {
  		if(err){
  			var res_err      = {};
  			res_err.status   = "error";
  			res_err.error    = err;
  			res_err.message  = err;
  			res.send(res_err);
  		}
  		else{

  			var ins_id = result.insertedIds[0];

        req.body.data.foto =
        'https://codigeek.app/bookapp/bookapp_fotos/'+ins_id+'_publicidad_foto.png';
        var data = foto.replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer(data, 'base64');
        fs.writeFile('bookapp_fotos/'+ins_id+'_publicidad_foto.png', buf);

        collection.update(
          { '_id' : ObjectId(ins_id) },
          { $set: {
            'foto' : req.body.data.foto
          }},
          function(err, result2){
            if(err){
              var res_err      = {};
              res_err.status   = "error";
              res_err.error    = err;
              res_err.message  = err;
              res.send(res_err);
            }
            else{
              var res_data      = {};
              res_data.status   = "success";
              res_data.message  = "Publicidad solicitada.";
              res.send(res_data);
            }
        });

      }
    });

  }
});

router.post("/actualizar_categoria_negocio",function(req,res){

  var collection                  = datb.collection('Categoria_Negocio');

  var peluquero_id = undefined;

  if( req.body.data.usuario_id ){
    peluquero_id = ObjectId(req.body.data.usuario_id);
  }

  if( req.body.data.especialidad_id ){
    req.body.data.especialidad_id = ObjectId(req.body.data.especialidad_id);
  }

  var foto 						            = req.body.data.foto_promocion;
	req.body.data.foto_promocion    = "";

  if( !(req.body.data._id === "") ){

    if(foto.includes("data")){

      req.body.data.foto_promocion =
      'https://codigeek.app/bookapp/bookapp_fotos/'+req.body.data._id+'_categoria_negocio_promocion.png';

      var data = foto.replace(/^data:image\/\w+;base64,/, "");
      var buf = new Buffer(data, 'base64');
      fs.writeFile('bookapp_fotos/'+req.body.data._id+'_categoria_negocio_promocion.png', buf);

    }

    collection.update(
      { '_id' : ObjectId(req.body.data._id) },
      { $set: {
        'tiempo_id' : ObjectId(req.body.data.tiempo_id),
        'tiempo_alquilacion_id' : ObjectId(req.body.data.tiempo_alquilacion_id),
        'servicio_id' : ObjectId(req.body.data.servicio_id),
        'especialidad_id' : req.body.data.especialidad_id,
        'costo' : req.body.data.costo,
        'promocion' : req.body.data.promocion,
        'foto_promocion' : req.body.data.foto_promocion,
        'usuario_id' : peluquero_id,
        'porcentaje_descuento' : req.body.data.porcentaje_descuento,
        'anticipo' : req.body.data.anticipo,
        'anticipo_cantidad' : req.body.data.anticipo_cantidad
      }},
      function(err, result2){
        if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
        }
        else{
          var res_data      = {};
          res_data.status   = "success";
          res_data.message  = "Registro actualizado.";
          res.send(res_data);
        }
    });

  }else{

    delete req.body.data._id;
    delete req.body.data.tiempo_alquilacion;
    delete req.body.data.tiempo;
    delete req.body.data.servicio;
    delete req.body.data.categoria;
    delete req.body.data.especialidad;

    req.body.data.negocio_id = ObjectId(req.body.data.negocio_id);
    req.body.data.tiempo_id = ObjectId(req.body.data.tiempo_id);
    req.body.data.tiempo_alquilacion_id = ObjectId(req.body.data.tiempo_alquilacion_id);
    req.body.data.servicio_id = ObjectId(req.body.data.servicio_id);

    if( req.body.data.usuario_id ){
      req.body.data.usuario_id = ObjectId(req.body.data.usuario_id);
    }

    var id_foto = makeid();
    if(foto.includes("data")){

      req.body.data.foto_promocion =
      'https://codigeek.app/bookapp/bookapp_fotos/'+id_foto+'_categoria_negocio_promocion.png';

      var data = foto.replace(/^data:image\/\w+;base64,/, "");
      var buf = new Buffer(data, 'base64');
      fs.writeFile('bookapp_fotos/'+id_foto+'_categoria_negocio_promocion.png', buf);

    }

    collection.insert(req.body.data, function(err, result) {
  		if(err){
  			var res_err      = {};
  			res_err.status   = "error";
  			res_err.error    = err;
  			res_err.message  = err;
  			res.send(res_err);
  		}
  		else{
        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Registro actualizado.";
        res.send(res_data);
      }
    });

  }
});

router.post("/enviar_ayuda",function(req,res){
  var collection	=  datb.collection('Configuracion');
  collection.aggregate([
    { $lookup: { from: "Tipo_Moneda", localField: "tipo_de_moneda_id", foreignField: "_id", as: "tipo_de_moneda" } },
  ]).toArray(function(err, result){
      if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
      }
      else{
          var configuracion_t = result[0];
          for( var i = 0; i<result.length; i++ ){
            if( result[i].tipo_de_moneda.length > 0 ){
                result[i].tipo_de_moneda = result[i].tipo_de_moneda[0];
            }else{
              delete result[i].tipo_de_moneda;
            }
          }
          collection				=  datb.collection('Ayuda');
          req.body.data.fecha_alta = new Date();
          req.body.ayuda.usuario_id	= new ObjectId(req.body.data._id);
          delete req.body.ayuda._id;
          collection.insert(req.body.ayuda, function(err, result) {
              if(err){
                  var res_err      = {};
                  res_err.status   = "error";
                  res_err.error    = err;
                  res_err.message  = err;
                  res.send(res_err);
              }
              else{
                  let transporter = nodemailer.createTransport({
                        host: 'mail.codigeek.com',
                        port: 25,
                        tls: {
                			rejectUnauthorized:false
                		},
                        secure: false, // true for 465, false for other ports
                        auth: {
                            user: 'contacto@codigeek.com', // generated ethereal user // operaciones@chronosingenieros.pe
                            pass: 'Decaene09!1!'  // generated ethereal password
                        }
                    });
                	readHTMLFile('plantillas_correo/bookapp/ayuda.html', function(err, html) {
                		var template = handlebars.compile(html);
                		var replacements = {
                			 nombre_p : req.body.ayuda.nombre,
                       correo_p : req.body.ayuda.correo,
                       mensaje_p : req.body.ayuda.asunto
                		};
                		var htmlToSend = template(replacements);
                		var mailOptions = {
                			from: 'contacto@codigeek.com', // sender address
                			to: 'alanbarreraf@hotmail.com,'+configuracion_t.correo_notificaciones, // list of receivers
                			subject: 'Correo de ayuda', // Subject line
                			text: 'Correo de ayuda', // Subject line
                			html: htmlToSend // html body
                		 };
                		transporter.sendMail(mailOptions, (error, info) => {
                			if (error) {
                				return console.log(error);
                			}
                		});
                	});
                  result.status  	= "success";
                  result.message 	= "Tu mensaje se envió con éxito, recibirás respuesta en tu correo.";
                  res.send(result);
              }
          });
      }
  });
});

router.post("/borrar_categoria",function(req,res){

  var collection = datb.collection('Categoria');

  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'status' : 5
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{
        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Categoría eliminada.";
        res.send(res_data);
      }
  });
});

router.post("/borrar_servicio",function(req,res){

  var collection = datb.collection('Servicio');

  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'status' : 5
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{
        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Servicio eliminadao.";
        res.send(res_data);
      }
  });
});

router.post("/borrar_especialidad",function(req,res){

  var collection = datb.collection('Especialidad');

  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'status' : 5
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{
        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Especialidad eliminada.";
        res.send(res_data);
      }
  });
});

router.post("/borrar_categoria_negocio",function(req,res){

  var collection                  = datb.collection('Categoria_Negocio');

  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'status' : 5
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{
        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Categoría eliminada.";
        res.send(res_data);
      }
  });
});

router.post("/borrar_usuario",function(req,res){

  var collection = datb.collection('Usuario');

  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'status' : 5
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{
        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Usuario eliminado.";
        res.send(res_data);
      }
  });
});

router.post("/get_notificaciones",function(req,res){
    var collection    =  datb.collection('Notificacion');
    collection.aggregate([
      { $match :  { "not_usuario_id" : ObjectId(req.body.data._id) } },
      { $lookup: { from: "Pedido", localField: "pedido_id", foreignField: "_id", as: "pedido" } },
      { $lookup: { from: "Usuario", localField: "not_usuario_id", foreignField: "_id", as: "not_usuario" } },
      { $sort : { 'fecha_alta' : -1 } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            for( var i = 0; i<result.length; i++ ){
              if( result[i].pedido.length > 0 ){
                  result[i].pedido = result[i].pedido[0];
              }else{
                delete result[i].pedido;
              }
              if( result[i].not_usuario.length > 0 ){
                  result[i].not_usuario = result[i].not_usuario[0];
              }else{
                delete result[i].not_usuario;
              }
            }
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Notificacion";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

function desactivar_sucursales ( sucursal_t, status_t ){
  return new Promise(function (resolve, reject) {
    var collection    =  datb.collection('Negocio');
    collection.update(
      { '_id' : ObjectId(sucursal_t._id) },
      { $set: {
        'status' : status_t
      } },
      function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            resolve(result);
        }
    });
  });
}

router.post("/borrar_negocio",function(req,res){
  var collection = datb.collection('Negocio');
  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'status' : 5
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{
          collection = datb.collection('Negocio');
		  collection.aggregate([
			{ $match :  { "marca_id" : ObjectId(req.body.data._id) }},
		  ]).toArray(function(err, result){
			  if(err){
				  var res_err      = {};
				  res_err.status   = "error";
				  res_err.error    = err;
				  res_err.message  = err;
				  res.send(res_err);
			  }
			  else{
				  for( var i = 0; i<result.length; i++ ){
					desactivar_sucursales( result[i], 5 ).then(function (vals) { });
				  }
				  var res_data      		= {};
				  res_data.status   		= "success";
				  res_data.message  		= "Negocios";
				  res_data.data     		= result;
				  res.send(res_data);
			  }
		  });
      }
    });
});

router.post("/borrar_sucursal",function(req,res){

  var collection = datb.collection('Negocio');

  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'status' : 5
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{
        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Sucursal eliminada.";
        res.send(res_data);
      }
  });
});

router.post("/get_tipos_usuario",function(req,res){
    var collection    =  datb.collection('Tipo_Usuario');
    collection.aggregate([
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Tipo_Usuario";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_tiempos_hora",function(req,res){
    var collection    =  datb.collection('Tiempo_Hora');
    collection.aggregate([
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Tiempo_Hora";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_tiempos_minuto",function(req,res){
    var collection    =  datb.collection('Tiempo_Minuto');
    collection.aggregate([
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Tiempo_Minuto";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_tiempos_minuto_por_negocio",function(req,res){
    var busqueda = {};
    if( req.body.data.categoria_id === "5ee410dc31a9c57966bf37c2" ){
      busqueda = {
        medico : true
      }
    }
    if( req.body.data.categoria_id === "5ee410ec31a9c57966bf37c3" ){
      busqueda = {
        cancha : true
      }
    }
    if( req.body.data.categoria_id === "5ee410fe31a9c57966bf37c4" ){
      busqueda = {
        peluqueria : true
      }
    }
    if( req.body.data.categoria_id === "5ee4110b31a9c57966bf37c5" ){
      busqueda = {
        restaurante : true
      }
    }
    var collection    =  datb.collection('Tiempo_Minuto');
    collection.aggregate([
      { $match :  busqueda }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Tiempo_Minuto";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_tiempos_minuto_tolerancia",function(req,res){
    var collection    =  datb.collection('Tiempo_Minuto');
    collection.aggregate([
      { $match :  { tolerancia : true } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Tiempo_Minuto";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_tipos_usuario_negocio",function(req,res){
    var collection    =  datb.collection('Tipo_Usuario');
    collection.aggregate([
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Tipo_Usuario";
            res_data.data     = [
              {
                "_id" : "5c4050fa58209844a83c8623",
                "descripcion" : "Administrador Sucursal"
              }
            ];
            if( req.body.negocio.categoria_id === '5ee410fe31a9c57966bf37c4' ){
              res_data.data.push({
                "_id" : "5c40513658209844a83c862a",
                "descripcion" : "Profesional"
              });
            }
            res.send(res_data);
        }
    });
});

router.post("/actualizar_usuario",function(req,res){

  var collection                  = datb.collection('Usuario');

  var foto 						            = req.body.data.foto;
	req.body.data.foto 			        = undefined;

  collection.find( { "correo" : req.body.data.correo.toString().trim() } ).toArray(function(err, result){
      if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
      }else{
          if(result.length === 0){
            if( !(req.body.data._id === "") ){
              if( req.body.data.foto ){
                req.body.data.foto =
                'https://codigeek.app/bookapp/bookapp_fotos/'+req.body.data._id+'_usuario_foto.png';

                if(foto.includes("data")){
                  var data = foto.replace(/^data:image\/\w+;base64,/, "");
                  var buf = new Buffer(data, 'base64');
                  fs.writeFile('bookapp_fotos/'+req.body.data._id+'_usuario_foto.png', buf);
                }

                collection.update(
                  { '_id' : ObjectId(req.body.data._id) },
                  { $set: {
                    'foto' : req.body.data.foto,
                    'nombre' : req.body.data.nombre,
                    'telefono' : req.body.data.telefono,
                    'contrasena' : req.body.data.contrasena,
                    'comision' : req.body.data.comision,
                    'tipo_usuario_id' : ObjectId(req.body.data.tipo_usuario._id),
                    'correo' : req.body.data.correo
                  }},
                  function(err, result2){
                    if(err){
                      var res_err      = {};
                      res_err.status   = "error";
                      res_err.error    = err;
                      res_err.message  = err;
                      res.send(res_err);
                    }
                    else{
                      var res_data      = {};
                      res_data.status   = "success";
                      res_data.message  = "Usuario actualizado.";
                      res.send(res_data);
                    }
                });
              }else{
                collection.update(
                  { '_id' : ObjectId(req.body.data._id) },
                  { $set: {
                    'nombre' : req.body.data.nombre,
                    'telefono' : req.body.data.telefono,
                    'contrasena' : req.body.data.contrasena,
                    'comision' : req.body.data.comision,
                    'tipo_usuario_id' : ObjectId(req.body.data.tipo_usuario._id),
                    'correo' : req.body.data.correo
                  }},
                  function(err, result2){
                    if(err){
                      var res_err      = {};
                      res_err.status   = "error";
                      res_err.error    = err;
                      res_err.message  = err;
                      res.send(res_err);
                    }
                    else{
                      var res_data      = {};
                      res_data.status   = "success";
                      res_data.message  = "Usuario actualizado.";
                      res.send(res_data);
                    }
                });
              }
            }else{
              delete req.body.data._id;
              req.body.data.tipo_usuario_id = ObjectId(req.body.data.tipo_usuario._id);
              delete req.body.data.tipo_usuario;
              collection.insert(req.body.data, function(err, result) {
            		if(err){
            			var res_err      = {};
            			res_err.status   = "error";
            			res_err.error    = err;
            			res_err.message  = err;
            			res.send(res_err);
            		}
            		else{

            			var ins_id = result.insertedIds[0];

                  if( foto.includes("data") ){
                    req.body.data.foto =
                    'https://codigeek.app/bookapp/bookapp_fotos/'+ins_id+'_usuario_foto.png';
                    var data = foto.replace(/^data:image\/\w+;base64,/, "");
                    var buf = new Buffer(data, 'base64');
                    fs.writeFile('bookapp_fotos/'+ins_id+'_usuario_foto.png', buf);

                    collection.update(
                      { '_id' : ObjectId(ins_id) },
                      { $set: {
                        'foto' : req.body.data.foto
                      }},
                      function(err, result2){
                        if(err){
                          var res_err      = {};
                          res_err.status   = "error";
                          res_err.error    = err;
                          res_err.message  = err;
                          res.send(res_err);
                        }
                        else{
                          var res_data      = {};
                          res_data.status   = "success";
                          res_data.message  = "Usuario actualizado.";
                          res.send(res_data);
                        }
                    });
                  }else{
                    var res_data      = {};
                    res_data.status   = "success";
                    res_data.message  = "Usuario actualizado.";
                    res.send(res_data);
                  }

                }
              });
            }
          }else{
            if( !(req.body.data._id === "") ){
              if( result[0]._id.toString().trim() === req.body.data._id.toString().trim() ){

                if(foto){
                  if(foto.includes("data")){
                    req.body.data.foto =
                    'https://codigeek.app/bookapp/bookapp_fotos/'+req.body.data._id+'_usuario_foto.png';
                    var data = foto.replace(/^data:image\/\w+;base64,/, "");
                    var buf = new Buffer(data, 'base64');
                    fs.writeFile('bookapp_fotos/'+req.body.data._id+'_usuario_foto.png', buf);
                  }
                }

                collection.update(
                  { '_id' : ObjectId(req.body.data._id) },
                    { $set: {
                      'foto' : req.body.data.foto,
                      'nombre' : req.body.data.nombre,
                      'telefono' : req.body.data.telefono,
                      'contrasena' : req.body.data.contrasena,
                      'comision' : req.body.data.comision,
                      'tipo_usuario_id' : ObjectId(req.body.data.tipo_usuario._id),
                      'correo' : req.body.data.correo
                  } },
                  function(err, result){
                    if(err){
                      var res_err      = {};
                      res_err.status   = "error";
                      res_err.error    = err;
                      res_err.message  = err;
                      res.send(res_err);
                    }
                    else{
                      var res_err      = {};
                      res_err.status   = "success";
                      res_err.message  = "Usuario actualizado.";
                      res.send(res_err);
                    }
                });

              }else{
                var res_err      = {};
                res_err.status   = "info";
                res_err.message  = "Este correo ya fue registrado anteriormente.";
                res.send(res_err);
              }
            }else{
              var res_err      = {};
              res_err.status   = "info";
              res_err.message  = "Este correo ya fue registrado anteriormente.";
              res.send(res_err);
            }
          }
      }
  });
});

router.post("/actualizar_usuario_negocio",function(req,res){

  var collection                  = datb.collection('Usuario');

  var foto 						            = req.body.data.foto;
	req.body.data.foto 			        = undefined;

  collection.find( { "correo" : req.body.data.correo.toString().trim(), "status" : { $ne : 5 } } ).toArray(function(err, result){
      if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
      }else{
          if(result.length === 0){
            if( !(req.body.data._id === "") ){
              if( req.body.data.foto ){
                req.body.data.foto =
                'https://codigeek.app/bookapp/bookapp_fotos/'+req.body.data._id+'_usuario_foto.png';

                if(foto.includes("data")){
                  var data = foto.replace(/^data:image\/\w+;base64,/, "");
                  var buf = new Buffer(data, 'base64');
                  fs.writeFile('bookapp_fotos/'+req.body.data._id+'_usuario_foto.png', buf);
                }

                collection.update(
                  { '_id' : ObjectId(req.body.data._id) },
                  { $set: {
                    'foto' : req.body.data.foto,
                    'nombre' : req.body.data.nombre,
                    'telefono' : req.body.data.telefono,
                    'contrasena' : req.body.data.contrasena,
                    'comision' : req.body.data.comision,
                    'tipo_usuario_id' : ObjectId(req.body.data.tipo_usuario._id),
                    'correo' : req.body.data.correo
                  }},
                  function(err, result2){
                    if(err){
                      var res_err      = {};
                      res_err.status   = "error";
                      res_err.error    = err;
                      res_err.message  = err;
                      res.send(res_err);
                    }
                    else{
                      var res_data      = {};
                      res_data.status   = "success";
                      res_data.message  = "Usuario actualizado.";
                      res.send(res_data);
                    }
                });
              }else{
                collection.update(
                  { '_id' : ObjectId(req.body.data._id) },
                  { $set: {
                    'nombre' : req.body.data.nombre,
                    'telefono' : req.body.data.telefono,
                    'contrasena' : req.body.data.contrasena,
                    'comision' : req.body.data.comision,
                    'tipo_usuario_id' : ObjectId(req.body.data.tipo_usuario._id),
                    'correo' : req.body.data.correo
                  }},
                  function(err, result2){
                    if(err){
                      var res_err      = {};
                      res_err.status   = "error";
                      res_err.error    = err;
                      res_err.message  = err;
                      res.send(res_err);
                    }
                    else{
                      var res_data      = {};
                      res_data.status   = "success";
                      res_data.message  = "Usuario actualizado.";
                      res.send(res_data);
                    }
                });
              }
            }else{
              delete req.body.data._id;
              req.body.data.tipo_usuario_id = ObjectId(req.body.data.tipo_usuario._id);
              req.body.data.negocio_id = ObjectId(req.body.data.negocio_id);
              if( req.body.data.sucursal_id ){
                req.body.data.sucursal_id = ObjectId(req.body.data.sucursal_id);
              }
              delete req.body.data.tipo_usuario;
              collection.insert(req.body.data, function(err, result) {
            		if(err){
            			var res_err      = {};
            			res_err.status   = "error";
            			res_err.error    = err;
            			res_err.message  = err;
            			res.send(res_err);
            		}
            		else{

            			var ins_id = result.insertedIds[0];

                  if( foto.includes("data") ){
                    req.body.data.foto =
                    'https://codigeek.app/bookapp/bookapp_fotos/'+ins_id+'_usuario_foto.png';
                    var data = foto.replace(/^data:image\/\w+;base64,/, "");
                    var buf = new Buffer(data, 'base64');
                    fs.writeFile('bookapp_fotos/'+ins_id+'_usuario_foto.png', buf);

                    collection.update(
                      { '_id' : ObjectId(ins_id) },
                      { $set: {
                        'foto' : req.body.data.foto
                      }},
                      function(err, result2){
                        if(err){
                          var res_err      = {};
                          res_err.status   = "error";
                          res_err.error    = err;
                          res_err.message  = err;
                          res.send(res_err);
                        }
                        else{
                          var res_data      = {};
                          res_data.status   = "success";
                          res_data.message  = "Usuario actualizado.";
                          res.send(res_data);
                        }
                    });
                  }else{
                    var res_data      = {};
                    res_data.status   = "success";
                    res_data.message  = "Usuario actualizado.";
                    res.send(res_data);
                  }

                }
              });
            }
          }else{
            if( !(req.body.data._id === "") ){
              if( result[0]._id.toString().trim() === req.body.data._id.toString().trim() ){

                if(foto){
                  if(foto.includes("data")){
                    req.body.data.foto =
                    'https://codigeek.app/bookapp/bookapp_fotos/'+req.body.data._id+'_usuario_foto.png';
                    var data = foto.replace(/^data:image\/\w+;base64,/, "");
                    var buf = new Buffer(data, 'base64');
                    fs.writeFile('bookapp_fotos/'+req.body.data._id+'_usuario_foto.png', buf);
                  }
                }

                collection.update(
                  { '_id' : ObjectId(req.body.data._id) },
                    { $set: {
                      'foto' : req.body.data.foto,
                      'nombre' : req.body.data.nombre,
                      'telefono' : req.body.data.telefono,
                      'contrasena' : req.body.data.contrasena,
                      'comision' : req.body.data.comision,
                      'tipo_usuario_id' : ObjectId(req.body.data.tipo_usuario._id),
                      'correo' : req.body.data.correo
                  } },
                  function(err, result){
                    if(err){
                      var res_err      = {};
                      res_err.status   = "error";
                      res_err.error    = err;
                      res_err.message  = err;
                      res.send(res_err);
                    }
                    else{
                      var res_err      = {};
                      res_err.status   = "success";
                      res_err.message  = "Usuario actualizado.";
                      res.send(res_err);
                    }
                });

              }else{
                var res_err      = {};
                res_err.status   = "info";
                res_err.message  = "Este correo ya fue registrado anteriormente.";
                res.send(res_err);
              }
            }else{
              var res_err      = {};
              res_err.status   = "info";
              res_err.message  = "Este correo ya fue registrado anteriormente.";
              res.send(res_err);
            }
          }
      }
  });
});

router.post("/actualizar_configuracion",function(req,res){

  var foto 						            = req.body.data.foto;
	req.body.data.foto 			        = "";

  req.body.data.foto =
    'https://codigeek.app/bookapp/bookapp_fotos/'+req.body.data._id+'_configuracion_foto.png';

  if(foto.includes("data")){
    var data = foto.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    fs.writeFile('bookapp_fotos/'+req.body.data._id+'_configuracion_foto.png', buf);
  }

  var collection = datb.collection('Configuracion');
  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'pide_lo_que_quieras'     : req.body.data.pide_lo_que_quieras,
      'negocio_propio_delivery' : req.body.data.negocio_propio_delivery,
      'tracking_de_pedidos'     : req.body.data.tracking_de_pedidos,
      'tipo_de_moneda_id'       : ObjectId(req.body.data.tipo_de_moneda_id),
      'incentivos_repartidores' : req.body.data.incentivos_repartidores,
      'terminos_archivo_url' : req.body.data.terminos_archivo_url,
      'politicas_archivo_url' : req.body.data.politicas_archivo_url,
      'correo_notificaciones' : req.body.data.correo_notificaciones,
      'foto' : req.body.data.foto,
      'mensaje_inicio' : req.body.data.mensaje_inicio,
      'activar_promo_inicio' : req.body.data.activar_promo_inicio,
      'costo_publicidad' : req.body.data.costo_publicidad
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{
        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Configuración actualizada.";
        res.send(res_data);
      }
  });
});

router.post("/actualizar_distancia",function(req,res){

  var collection                  = datb.collection('Distancia');
  req.body.data.negocio_id = ObjectId(req.body.data.negocio_id);
  if( !(req.body.data._id === "") ){
    collection.update(
      { '_id' : ObjectId(req.body.data._id) },
      { $set: {
        'minimo' : req.body.data.minimo,
        'maximo' : req.body.data.maximo,
        'costo'  : req.body.data.costo,
      }},
      function(err, result2){
        if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
        }
        else{
          var res_data      = {};
          res_data.status   = "success";
          res_data.message  = "Distancia actualizada.";
          res.send(res_data);
        }
    });
  }else{
    delete req.body.data._id;
    collection.insert(req.body.data, function(err, result) {
  		if(err){
  			var res_err      = {};
  			res_err.status   = "error";
  			res_err.error    = err;
  			res_err.message  = err;
  			res.send(res_err);
  		}
  		else{
        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Distancia actualizada.";
        res.send(res_data);
      }
    });
  }
});

router.post("/actualizar_estatus_negocio",function(req,res){
  var nuevo_estatus_t = req.body.data.status === 4 ? 1 : 4;
  var collection = datb.collection('Negocio');
  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'status' : nuevo_estatus_t
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{		
		collection = datb.collection('Negocio');
		collection.aggregate([
		  { $match :  { "marca_id" : ObjectId(req.body.data._id) }},
		]).toArray(function(err, result){
		  if(err){
			  var res_err      = {};
			  res_err.status   = "error";
			  res_err.error    = err;
			  res_err.message  = err;
			  res.send(res_err);
		  }
		  else{
			  for( var i = 0; i<result.length; i++ ){
			    desactivar_sucursales( result[i], nuevo_estatus_t ).then(function (vals) { });
			  }
			  var res_data      = {};
			  res_data.status   = "success";
			  res_data.message  = "Registro actualizado.";
			  res.send(res_data);
		  }
		});        
      }
  });
});

router.post("/actualizar_publicidad_estatus",function(req,res){
  var collection = datb.collection('Publicidad');
  collection.update(
    { '_id' : ObjectId(req.body.publicidad._id) },
    { $set: {
      'status' : req.body.data.status,
      'fecha_actualizacion' : req.body.data.fecha
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{
        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Publicidad actualizada.";
        res.send(res_data);
      }
  });
});

router.post("/borrar_distancia",function(req,res){
    var collection	=  datb.collection('Distancia');
    collection.deleteOne(
        { '_id' : ObjectId(req.body.data._id) },
        function(err, result){
            if(err){
                var res_err      = {};
                res_err.status   = "error";
                res_err.error    = err;
                res_err.message  = err;
                res.send(res_err);
            }
            else{
                var res_data    = {};
                res_data.status  = "success";
                res_data.message = "Distancia eliminada.";
                res.send(res_data);
            }
    });
});

router.post("/borrar_galeria",function(req,res){
    var collection	=  datb.collection('Producto_Foto');
    collection.deleteOne(
        { '_id' : ObjectId(req.body.data._id) },
        function(err, result){
            if(err){
                var res_err      = {};
                res_err.status   = "error";
                res_err.error    = err;
                res_err.message  = err;
                res.send(res_err);
            }
            else{
                var res_data    = {};
                res_data.status  = "success";
                res_data.message = "Foto eliminada.";
                res.send(res_data);
            }
    });
});

router.post("/borrar_galeria_negocio",function(req,res){
    var collection	=  datb.collection('Negocio_Foto');
    collection.deleteOne(
        { '_id' : ObjectId(req.body.data._id) },
        function(err, result){
            if(err){
                var res_err      = {};
                res_err.status   = "error";
                res_err.error    = err;
                res_err.message  = err;
                res.send(res_err);
            }
            else{
                var res_data    = {};
                res_data.status  = "success";
                res_data.message = "Foto eliminada.";
                res.send(res_data);
            }
    });
});

router.post("/get_distancias",function(req,res){
    var collection	=  datb.collection('Distancia');
    collection.aggregate([
      { $match :  { "status" : { $ne : 5 }, "negocio_id" : ObjectId(req.body.data._id)  } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Distancias";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_indicador_apple_foto",function(req,res){
  var res_data      		= {};
  res_data.status   		= "success";
  res_data.data     		= false;
  res.send(res_data);
});

router.post("/actualizar_platillo_negocio",function(req,res){

  var collection                  = datb.collection('Platillo');

  var foto 						            = req.body.data.foto;
	req.body.data.foto 			        = "";

  console.log(req.body.data._id);

  if( !(req.body.data._id === "") ){

    if(foto){
      if(foto.includes("data")){

        req.body.data.foto =
        'https://codigeek.app/bookapp/bookapp_fotos/'+req.body.data._id+'_categoria_platillo.png';

        var data = foto.replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer(data, 'base64');
        fs.writeFile('bookapp_fotos/'+req.body.data._id+'_categoria_platillo.png', buf);

      }else{
        req.body.data.foto = foto;
      }
    }

    collection.update(
      { '_id' : ObjectId(req.body.data._id) },
      { $set: {
        'foto' : req.body.data.foto,
        'nombre' : req.body.data.nombre,
        'descripcion' : req.body.data.descripcion,
        'costo' : req.body.data.costo,
        'categoria_id' : ObjectId(req.body.data.categoria_id),
        'disponible' : req.body.data.disponible,
        'promocion' : req.body.data.promocion,
        'promocion_total' : req.body.data.promocion_total,
        'grupo_ingrediente' : req.body.data.grupo_ingrediente
      }},
      function(err, result2){
        if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
        }
        else{
          var res_data      = {};
          res_data.status   = "success";
          res_data.message  = "Producto actualizado";
          res.send(res_data);
        }
    });

  }else{

    delete req.body.data._id;
    delete req.body.data.categoria;

    req.body.data.negocio_id = ObjectId(req.body.data.negocio_id);
    req.body.data.categoria_id = ObjectId(req.body.data.categoria_id);

    collection.insert(req.body.data, function(err, result) {
  		if(err){
  			var res_err      = {};
  			res_err.status   = "error";
  			res_err.error    = err;
  			res_err.message  = err;
  			res.send(res_err);
  		}
  		else{

  			var ins_id = result.insertedIds[0];

        if(foto){
          if(foto.includes("data")){

            req.body.data.foto =
            'https://codigeek.app/bookapp/bookapp_fotos/'+ins_id+'_categoria_platillo.png';

            var data = foto.replace(/^data:image\/\w+;base64,/, "");
            var buf = new Buffer(data, 'base64');
            fs.writeFile('bookapp_fotos/'+ins_id+'_categoria_platillo.png', buf);

          }else{
            req.body.data.foto = undefined;
          }
        }

        collection.update(
          { '_id' : ObjectId(ins_id) },
          { $set: {
            'foto' : req.body.data.foto
          }},
          function(err, result2){
            if(err){
              var res_err      = {};
              res_err.status   = "error";
              res_err.error    = err;
              res_err.message  = err;
              res.send(res_err);
            }
            else{
              var res_data      = {};
              res_data.status   = "success";
              res_data.message  = "Producto agregado.";
              res.send(res_data);
            }
        });

      }
    });

  }
});

router.post("/borrar_platillo_negocio",function(req,res){

  var collection = datb.collection('Platillo');

  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'status' : 5
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{
        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Producto eliminado.";
        res.send(res_data);
      }
  });
});

router.post("/get_platillos_negocio",function(req,res){
    var collection	=  datb.collection('Platillo');
    collection.aggregate([
      { $match :  { "status" : { $ne : 5 }, "negocio_id" : ObjectId(req.body.data._id)  }},
  		{ $lookup: { from: "Categoria_Negocio", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
  		{ $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
  		{ $lookup: { from: "Producto_Foto", localField: "_id", foreignField: "producto_id", as: "galeria" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{

          for( var i = 0; i<result.length; i++ ){
              if( result[i].categoria.length > 0 ){
                  result[i].categoria = result[i].categoria[0];
              }else{
                delete result[i].categoria;
              }
              if( result[i].negocio.length > 0 ){
                  result[i].negocio = result[i].negocio[0];
              }else{
                delete result[i].negocio;
              }
          }

            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Platillos";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_platillo_by_id",function(req,res){
    var collection	=  datb.collection('Platillo');
    collection.aggregate([
      { $match :  { "_id" : ObjectId(req.body.data._id), "status" : { $ne : 5 } }},
  		{ $lookup: { from: "Categoria_Negocio", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
  		{ $lookup: { from: "Producto_Foto", localField: "_id", foreignField: "producto_id", as: "galeria" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{

          for( var i = 0; i<result.length; i++ ){
              if( result[i].categoria.length > 0 ){
                  result[i].categoria = result[i].categoria[0];
              }else{
                delete result[i].categoria;
              }
          }

            var res_data      		= {};
            res_data.status   		= "success";
            res_data.message  		= "Platillos";
            res_data.data     		= result;
            res.send(res_data);
        }
    });
});

router.post("/get_pedidos_motofast",function(req,res){
    var filtros_fechas_t = {};
    if( req.body.filtro ){
      if( req.body.filtro.filtrar_por_fechas ){
        filtros_fechas_t = {
          'inicio_cita' :
            {
              $gte : req.body.filtro.de_fecha,
              $lte : req.body.filtro.hasta_fecha
            }
        }
      }
    }
    var collection    =  datb.collection('Pedido');
    collection.aggregate([
    	// Status 8 - Pedido Terminado
    { $match :  filtros_fechas_t },
		{ $match:  { 'motofast_id' : ObjectId(req.body.data._id), "status" : { $in : req.body.condiciones.status } } },
    { $sort : { 'fecha_alta' : -1 } },
    { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
		{ $lookup: { from: "Usuario", localField: "motofast_id", foreignField: "_id", as: "motofast" } },
		{ $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
    { $lookup: { from: "Historial_Pedido", localField: "_id", foreignField: "pedido_id", as: "historial" } },
    { $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
    { $lookup: { from: "Servicio", localField: "servicio_general_id", foreignField: "_id", as: "servicio" } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

          var total_registros = result.length;

          collection.aggregate([
            // Status 8 - Pedido Terminado
          { $match :  filtros_fechas_t },
          { $match:  { 'motofast_id' : ObjectId(req.body.data._id), "status" : { $in : req.body.condiciones.status } } },
          { $sort : { 'fecha_alta' : -1 } },
          { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
          { $lookup: { from: "Usuario", localField: "motofast_id", foreignField: "_id", as: "motofast" } },
          { $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
          { $lookup: { from: "Historial_Pedido", localField: "_id", foreignField: "pedido_id", as: "historial" } },
          { $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
          { $lookup: { from: "Servicio", localField: "servicio_general_id", foreignField: "_id", as: "servicio" } },
          { $limit  : req.body.parametros.limit },
          { $skip   : req.body.parametros.skip },
          ]).toArray(function(err, result){
              if(err){
                  var res_err      = {};
                  res_err.status   = "error";
                  res_err.error    = err;
                  res_err.message  = err;
                  res.send(res_err);
              }else{

                  for( var i = 0; i<result.length; i++ ){
                      if( result[i].usuario.length > 0 ){
                          result[i].usuario = result[i].usuario[0];
                      }else{
                        delete result[i].usuario;
                      }
                      if( result[i].motofast.length > 0 ){
                          result[i].motofast = result[i].motofast[0];
                      }else{
                        delete result[i].motofast;
                      }
                      if( result[i].negocio.length > 0 ){
                          result[i].negocio = result[i].negocio[0];
                      }else{
                        delete result[i].negocio;
                      }
                      if( result[i].categoria.length > 0 ){
                          result[i].categoria = result[i].categoria[0];
                      }else{
                        delete result[i].categoria;
                      }
                      if( result[i].servicio.length > 0 ){
                          result[i].servicio = result[i].servicio[0];
                      }else{
                        delete result[i].servicio;
                      }
                  }

                  var res_data      = {};
                  res_data.status   = "success";
                  res_data.message  = "Pedidos en Curso";
                  res_data.data     = result;
                  res_data.total_registros = total_registros;
                  res.send(res_data);
              }
          });
        }
    });
});

router.post("/get_pedidos_usuario",function(req,res){
    var filtros_fechas_t = {};
    if( req.body.filtro ){
      if( req.body.filtro.filtrar_por_fechas ){
        filtros_fechas_t = {
          'inicio_cita' :
            {
              $gte : req.body.filtro.de_fecha,
              $lte : req.body.filtro.hasta_fecha
            }
        }
      }
    }
    var collection    =  datb.collection('Pedido');
    collection.aggregate([
    	// Status 8 - Pedido Terminado
    { $match :  filtros_fechas_t },
		{ $match:  { 'usuario_id' : ObjectId(req.body.data._id), "status" : { $in : req.body.condiciones.status } } },
    { $sort : { 'fecha_alta' : -1 } },
    { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
		{ $lookup: { from: "Usuario", localField: "motofast_id", foreignField: "_id", as: "motofast" } },
		{ $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
    { $lookup: { from: "Historial_Pedido", localField: "_id", foreignField: "pedido_id", as: "historial" } },
    { $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
    { $lookup: { from: "Servicio", localField: "servicio_general_id", foreignField: "_id", as: "servicio" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

          var total_registros = result.length;

          collection.aggregate([
            // Status 8 - Pedido Terminado
          { $match :  filtros_fechas_t },
          { $match:  { 'usuario_id' : ObjectId(req.body.data._id), "status" : { $in : req.body.condiciones.status } } },
          { $sort : { 'fecha_alta' : -1 } },
          { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
          { $lookup: { from: "Usuario", localField: "motofast_id", foreignField: "_id", as: "motofast" } },
          { $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
          { $lookup: { from: "Historial_Pedido", localField: "_id", foreignField: "pedido_id", as: "historial" } },
          { $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
          { $lookup: { from: "Servicio", localField: "servicio_general_id", foreignField: "_id", as: "servicio" } },
          { $limit  : req.body.parametros.limit },
          { $skip   : req.body.parametros.skip },
          ]).toArray(function(err, result){
              if(err){
                  var res_err      = {};
                  res_err.status   = "error";
                  res_err.error    = err;
                  res_err.message  = err;
                  res.send(res_err);
              }else{

                  for( var i = 0; i<result.length; i++ ){
                      if( result[i].usuario.length > 0 ){
                          result[i].usuario = result[i].usuario[0];
                      }else{
                        delete result[i].usuario;
                      }
                      if( result[i].motofast.length > 0 ){
                          result[i].motofast = result[i].motofast[0];
                      }else{
                        delete result[i].motofast;
                      }
                      if( result[i].negocio.length > 0 ){
                          result[i].negocio = result[i].negocio[0];
                      }else{
                        delete result[i].negocio;
                      }
                      if( result[i].categoria.length > 0 ){
                          result[i].categoria = result[i].categoria[0];
                      }else{
                        delete result[i].categoria;
                      }
                      if( result[i].servicio.length > 0 ){
                          result[i].servicio = result[i].servicio[0];
                      }else{
                        delete result[i].servicio;
                      }
                  }

                  var res_data      = {};
                  res_data.status   = "success";
                  res_data.message  = "Pedidos en Curso";
                  res_data.data     = result;
                  res_data.total_registros = total_registros;
                  res.send(res_data);
              }
          });
        }
    });
});

router.post("/get_pedidos_negocio",function(req,res){
  var filtros_fechas_t = {};
  if( req.body.filtro ){
    if( req.body.filtro.filtrar_por_fechas ){
      filtros_fechas_t = {
        'inicio_cita' :
          {
            $gte : req.body.filtro.de_fecha,
            $lte : req.body.filtro.hasta_fecha
          }
      }
    }
  }
  console.log(filtros_fechas_t);
  var collection    =  datb.collection('Pedido');
  collection.aggregate([
    // Status 8 - Pedido Terminado
  { $match :  filtros_fechas_t },
  { $match:  { 'marca_id' : ObjectId(req.body.data.negocio_id), "status" : { $in : req.body.condiciones.status } } },
  { $sort : { 'fecha_alta' : -1 } },
  { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
  { $lookup: { from: "Usuario", localField: "motofast_id", foreignField: "_id", as: "motofast" } },
  { $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
  { $lookup: { from: "Historial_Pedido", localField: "_id", foreignField: "pedido_id", as: "historial" } },
  { $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
  { $lookup: { from: "Servicio", localField: "servicio_general_id", foreignField: "_id", as: "servicio" } }
  ]).toArray(function(err, result){
      if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
      }else{

        var total_registros = result.length;

        collection.aggregate([
          // Status 8 - Pedido Terminado
        { $match :  filtros_fechas_t },
        { $match:  { 'marca_id' : ObjectId(req.body.data.negocio_id), "status" : { $in : req.body.condiciones.status } } },
        { $sort : { 'fecha_alta' : -1 } },
        { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
        { $lookup: { from: "Usuario", localField: "motofast_id", foreignField: "_id", as: "motofast" } },
        { $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
        { $lookup: { from: "Historial_Pedido", localField: "_id", foreignField: "pedido_id", as: "historial" } },
        { $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
        { $lookup: { from: "Servicio", localField: "servicio_general_id", foreignField: "_id", as: "servicio" } }
        ]).toArray(function(err, result){
            if(err){
                var res_err      = {};
                res_err.status   = "error";
                res_err.error    = err;
                res_err.message  = err;
                res.send(res_err);
            }else{

                for( var i = 0; i<result.length; i++ ){
                    if( result[i].usuario.length > 0 ){
                        result[i].usuario = result[i].usuario[0];
                    }else{
                      delete result[i].usuario;
                    }
                    if( result[i].motofast.length > 0 ){
                        result[i].motofast = result[i].motofast[0];
                    }else{
                      delete result[i].motofast;
                    }
                    if( result[i].negocio.length > 0 ){
                        result[i].negocio = result[i].negocio[0];
                    }else{
                      delete result[i].negocio;
                    }
                    if( result[i].categoria.length > 0 ){
                        result[i].categoria = result[i].categoria[0];
                    }else{
                      delete result[i].categoria;
                    }
                    if( result[i].servicio.length > 0 ){
                        result[i].servicio = result[i].servicio[0];
                    }else{
                      delete result[i].servicio;
                    }
                }

                var res_data      = {};
                res_data.status   = "success";
                res_data.message  = "Pedidos en Curso";
                res_data.data     = result;
                res_data.total_registros = total_registros;
                res.send(res_data);
            }
        });
      }
  });
});
router.post("/get_pedidos_sucursal",function(req,res){
  var filtros_fechas_t = {};
  if( req.body.filtro ){
    if( req.body.filtro.filtrar_por_fechas ){
      filtros_fechas_t = {
        'inicio_cita' :
          {
            $gte : req.body.filtro.de_fecha,
            $lte : req.body.filtro.hasta_fecha
          }
      }
    }
  }
  console.log(filtros_fechas_t);
  var collection    =  datb.collection('Pedido');
  collection.aggregate([
    // Status 8 - Pedido Terminado
  { $match :  filtros_fechas_t },
  { $match:  { 'negocio_id' : ObjectId(req.body.data.negocio_id), "status" : { $in : req.body.condiciones.status } } },
  { $sort : { 'fecha_alta' : -1 } },
  { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
  { $lookup: { from: "Usuario", localField: "motofast_id", foreignField: "_id", as: "motofast" } },
  { $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
  { $lookup: { from: "Historial_Pedido", localField: "_id", foreignField: "pedido_id", as: "historial" } },
  { $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
  { $lookup: { from: "Servicio", localField: "servicio_general_id", foreignField: "_id", as: "servicio" } }
  ]).toArray(function(err, result){
      if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
      }else{

        var total_registros = result.length;

        collection.aggregate([
          // Status 8 - Pedido Terminado
        { $match :  filtros_fechas_t },
        { $match:  { 'negocio_id' : ObjectId(req.body.data.negocio_id), "status" : { $in : req.body.condiciones.status } } },
        { $sort : { 'fecha_alta' : -1 } },
        { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
        { $lookup: { from: "Usuario", localField: "motofast_id", foreignField: "_id", as: "motofast" } },
        { $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
        { $lookup: { from: "Historial_Pedido", localField: "_id", foreignField: "pedido_id", as: "historial" } },
        { $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
    		{ $lookup: { from: "Servicio", localField: "servicio_general_id", foreignField: "_id", as: "servicio" } }
        ]).toArray(function(err, result){
            if(err){
                var res_err      = {};
                res_err.status   = "error";
                res_err.error    = err;
                res_err.message  = err;
                res.send(res_err);
            }else{

                for( var i = 0; i<result.length; i++ ){
                    if( result[i].usuario.length > 0 ){
                        result[i].usuario = result[i].usuario[0];
                    }else{
                      delete result[i].usuario;
                    }
                    if( result[i].motofast.length > 0 ){
                        result[i].motofast = result[i].motofast[0];
                    }else{
                      delete result[i].motofast;
                    }
                    if( result[i].negocio.length > 0 ){
                        result[i].negocio = result[i].negocio[0];
                    }else{
                      delete result[i].negocio;
                    }
                    if( result[i].categoria.length > 0 ){
                        result[i].categoria = result[i].categoria[0];
                    }else{
                      delete result[i].categoria;
                    }
                    if( result[i].servicio.length > 0 ){
                        result[i].servicio = result[i].servicio[0];
                    }else{
                      delete result[i].servicio;
                    }
                }

                var res_data      = {};
                res_data.status   = "success";
                res_data.message  = "Pedidos en Curso";
                res_data.data     = result;
                res_data.total_registros = total_registros;
                res.send(res_data);
            }
        });
      }
  });
});

router.post("/get_pedido_by_id",function(req,res){
    var collection    =  datb.collection('Pedido');
    collection.aggregate([
    { $match : { "_id" : ObjectId(req.body.data._id) } },
    { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
		{ $lookup: { from: "Usuario", localField: "motofast_id", foreignField: "_id", as: "motofast" } },
		{ $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
    { $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
    { $lookup: { from: "Servicio", localField: "servicio_general_id", foreignField: "_id", as: "servicio" } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

            for( var i = 0; i<result.length; i++ ){
                if( result[i].usuario.length > 0 ){
                    result[i].usuario = result[i].usuario[0];
                }else{
                  delete result[i].usuario;
                }
                if( result[i].motofast.length > 0 ){
                    result[i].motofast = result[i].motofast[0];
                }else{
                  delete result[i].motofast;
                }
                if( result[i].negocio.length > 0 ){
                    result[i].negocio = result[i].negocio[0];
                }else{
                  delete result[i].negocio;
                }
                if( result[i].categoria.length > 0 ){
                    result[i].categoria = result[i].categoria[0];
                }else{
                  delete result[i].categoria;
                }
                if( result[i].servicio.length > 0 ){
                    result[i].servicio = result[i].servicio[0];
                }else{
                  delete result[i].servicio;
                }
            }

            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Pedidos en Curso";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_pedidos_administracion",function(req,res){
    var filtros_fechas_t = {};
    if( req.body.filtro ){
      if( req.body.filtro.filtrar_por_fechas ){
        filtros_fechas_t = {
          'inicio_cita' :
            {
              $gte : req.body.filtro.de_fecha,
              $lte : req.body.filtro.hasta_fecha
            }
        }
      }
    }
    console.log(filtros_fechas_t);
    var collection    =  datb.collection('Pedido');
    collection.aggregate([
    	// Status 8 - Pedido Terminado
    { $match :  filtros_fechas_t },
    { $match :  { "status" : { $in : req.body.condiciones.status } } },
    { $sort : { 'fecha_alta' : -1 } },
    { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
		{ $lookup: { from: "Usuario", localField: "motofast_id", foreignField: "_id", as: "motofast" } },
		{ $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
		{ $lookup: { from: "Servicio", localField: "servicio_general_id", foreignField: "_id", as: "servicio" } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

          var total_registros = result.length;

          collection.aggregate([
            // Status 8 - Pedido Terminado
            { $match :  filtros_fechas_t },
            { $match :  { "status" : { $in : req.body.condiciones.status } } },
            { $sort : { 'fecha_alta' : -1 } },
            { $lookup: { from: "Negocio", localField: "negocio_id", foreignField: "_id", as: "negocio" } },
        		{ $lookup: { from: "Usuario", localField: "motofast_id", foreignField: "_id", as: "motofast" } },
            { $lookup: { from: "Usuario", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
            { $lookup: { from: "Usuario", localField: "cliente_id", foreignField: "_id", as: "cliente" } },
            { $lookup: { from: "Categoria", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
        		{ $lookup: { from: "Servicio", localField: "servicio_general_id", foreignField: "_id", as: "servicio" } },
            { $limit  : req.body.parametros.limit },
            { $skip   : req.body.parametros.skip },
          ]).toArray(function(err, result){
              if(err){
                  var res_err      = {};
                  res_err.status   = "error";
                  res_err.error    = err;
                  res_err.message  = err;
                  res.send(res_err);
              }else{

                for( var i = 0; i<result.length; i++ ){
                    if( result[i].usuario.length > 0 ){
                        result[i].usuario = result[i].usuario[0];
                    }else{
                      delete result[i].usuario;
                    }
                    if( result[i].motofast.length > 0 ){
                        result[i].motofast = result[i].motofast[0];
                    }else{
                      delete result[i].motofast;
                    }
                    if( result[i].cliente.length > 0 ){
                        result[i].cliente = result[i].cliente[0];
                    }else{
                      delete result[i].cliente;
                    }
                    if( result[i].negocio.length > 0 ){
                        result[i].negocio = result[i].negocio[0];
                    }else{
                      delete result[i].negocio;
                    }
                    if( result[i].categoria.length > 0 ){
                        result[i].categoria = result[i].categoria[0];
                    }else{
                      delete result[i].categoria;
                    }
                    if( result[i].servicio.length > 0 ){
                        result[i].servicio = result[i].servicio[0];
                    }else{
                      delete result[i].servicio;
                    }
                }

                var res_data      = {};
                res_data.status   = "success";
                res_data.message  = "Pedidos en Curso";
                res_data.data     = result;
                res_data.total_registros = total_registros;
                res.send(res_data);
            }
          });
        }
    });
});

router.post("/actualizar_pedido_reprogramar",function(req,res){

  var collection = datb.collection('Pedido');

  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'programar' : true,
      "fecha_pedido" : req.body.data.fecha_pedido,
      "hora_pedido" : req.body.data.hora_pedido
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{
        console.log(req.body.data.usuario_id);
        io.sockets.in(req.body.data.usuario_id).emit('actualizar_pedido', {});

        enviar_push_usuario_admin_negocio(req.body.data.negocio_id, "Reserva reprogramada.");
        enviar_push_usuario(req.body.data.usuario_id, "Reserva reprogramada.");
        enviar_push_usuario("5dab6af7d887780d17a5fd94", "Reserva reprogramada.");

        // io.sockets.emit('actualizar_pedidos_pendientes', {});

        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Reserva reprogramada";
        res.send(res_data);
      }
  });
});

router.post("/actualizar_pedido_total_confirmacion_adminneg",function(req,res){

  var collection = datb.collection('Pedido');

  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'solicitar_confirmacion_cliente' : true,
      'total' : parseFloat(req.body.data.total) + parseFloat(req.body.data.costo_envio)
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{

        console.log(req.body.data.usuario_id);
        io.sockets.in(req.body.data.usuario_id).emit('actualizar_pedido', {});

        enviar_push_usuario(req.body.data.usuario_id, "Reserva esperando confirmación.");
        enviar_push_usuario("5dab6af7d887780d17a5fd94", "Reserva esperando confirmación.");

        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Reserva actualizada";
        res.send(res_data);
      }
  });
});

router.post("/actualizar_pedido_total_confirmacion_cliente",function(req,res){

  var collection = datb.collection('Pedido');

  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'confirmacion_total' : true
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{

        console.log(req.body.data.usuario_id);
        io.sockets.in(req.body.data.usuario_id).emit('actualizar_pedido', {});

        enviar_push_usuario(req.body.data.usuario_id, "Cliente confirmó la reserva.");
        enviar_push_usuario("5dab6af7d887780d17a5fd94", "Cliente confirmó la reserva.");

        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Reserva actualizada";
        res.send(res_data);
      }
  });
});

router.post("/actualizar_cancelacion_vendedor",function(req,res){

  var collection = datb.collection('Pedido');

  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
        'status' : 1,
        'fecha_cancelacion_vendedor' : req.body.data.fecha_cancelacion_vendedor
      },
      $unset: {
        "motofast_id" : "",
        "fecha_platillos_listos" : "",
        "fecha_asignar_motofast" : "",
        "solicitar_confirmacion_cliente" : "",
        "total" : "",
        "confirmacion_total" : "",
      }
    },
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{
        console.log(req.body.data.usuario_id);
        io.sockets.in(req.body.data.usuario_id).emit('actualizar_pedido', {});

        if(req.body.data.negocio_id){
          enviar_push_usuario_admin_negocio(req.body.data.negocio_id, "Buscando nuevo repartidor.");
        }

        enviar_push_usuario(req.body.data.usuario_id, "Buscando nuevo repartidor.");
        enviar_push_usuario("5dab6af7d887780d17a5fd94", "Buscando nuevo repartidor.");

        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Cita actualizada";
        res.send(res_data);
      }
  });
});

router.post("/actualizar_pedido_cancelar",function(req,res){

  var collection = datb.collection('Pedido');

  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'status' : 15,
      "fecha_cancelacion" : req.body.data.fecha_cancelacion
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{
        console.log(req.body.data.usuario_id);
        io.sockets.in(req.body.data.usuario_id).emit('actualizar_pedido', {});

        if(req.body.data.negocio_id){
          enviar_push_usuario_admin_negocio(req.body.data.negocio_id, "Reserva cancelada.");
        }

        enviar_push_usuario(req.body.data.usuario_id, "Reserva cancelada.");
        enviar_push_usuario("5dab6af7d887780d17a5fd94", "Reserva cancelada.");

        // io.sockets.emit('actualizar_pedidos_pendientes', {});

        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Reserva cancelada";
        res.send(res_data);
      }
  });
});

function get_repartidor ( pedido_t, negocio_t ){
    return new Promise(function (resolve, reject) {
        var collection =  datb.collection('Usuario');
        console.log("get_repartidor");
        console.log(pedido_t.destino_longitude);
        console.log(pedido_t.destino_latitude);
        console.log(negocio_t);
        collection.aggregate([
          { $geoNear: {
            near: {
              type: "Point",
              coordinates: [pedido_t.destino_longitude, pedido_t.destino_latitude]
            },
            distanceField: "distance",
            maxDistance: 1500000000,
            spherical: true
          }},
          { $match : { "status" : 1, "tipo_usuario_id" : ObjectId("5c40513658209844a83c862a"), "negocio_id" : ObjectId(negocio_t) } }
        ]).toArray(function(err, result){
            if(err){
                console.log(err);
            }else{
                console.log("Repartidores");
                console.log(result.length);
                if(result.length>0){
                  resolve(result[0]);
                }else{
                  resolve("NONE");
                }
            }
        });
    });
}

router.post("/actualizar_pedido_platillos_listos",function(req,res){

  var collection = datb.collection('Pedido');

  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'status' : 1,
      'tiempo_texto' : req.body.data.tiempo_texto,
      'costo_envio' : req.body.data.costo_envio,
      "fecha_platillos_listos" : req.body.data.fecha_platillos_listos
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{

        var pedido_id_t = req.body.data._id;

        console.log(req.body.data.usuario_id);
        io.sockets.in(req.body.data.usuario_id).emit('actualizar_pedido', {});

        if(req.body.data.negocio_id){
          enviar_push_usuario_admin_negocio(req.body.data.negocio_id, "Reserva confirmada.");
        }

        enviar_push_usuario(req.body.data.usuario_id, "Reserva confirmada.");
        enviar_push_usuario("5dab6af7d887780d17a5fd94", "Reserva confirmada.");

        // io.sockets.emit('actualizar_pedidos_pendientes', {});
        if( req.body.data.negocio_id && req.body.data.tipo_servicio === 2 ){
          collection = datb.collection('Negocio');
          collection.aggregate([
            { $match :  { "_id" : ObjectId(req.body.data.negocio_id) }}
          ]).toArray(function(err, result){
              if(err){
                  var res_err      = {};
                  res_err.status   = "error";
                  res_err.error    = err;
                  res_err.message  = err;
                  res.send(res_err);
              }
              else{
                if( result[0].asignacion_delivery === 1 ){
                  get_repartidor( req.body.data, req.body.data.negocio_id ).then(function (vals) {
                    console.log(vals);
                    if( vals === "NONE" ){
                      var result_return      = {};
                      result_return.status   = "info";
                      result_return.message  = "Lo sentimos no hay repartidores cerca de tu zona, la asignación deberá ser manual.";
                      res.send(result_return);
                      return;
                    }else{
                      collection = datb.collection('Pedido');
                      collection.update(
                        { '_id' : ObjectId(pedido_id_t) },
                        { $set: {
                          'status' : 2,
                          "fecha_asignar_motofast" : req.body.data.fecha_platillos_listos,
                          "motofast_id" : ObjectId(vals._id)
                        }},
                        function(err, result2){
                          if(err){
                            var res_err      = {};
                            res_err.status   = "error";
                            res_err.error    = err;
                            res_err.message  = err;
                            res.send(res_err);
                          }
                          else{
                            var res_data      = {};
                            res_data.status   = "success";
                            res_data.message  = "Reserva actualizada";
                            res.send(res_data);
                          }
                      });
                    }
                  });
                }else{
                  var res_data      = {};
                  res_data.status   = "success";
                  res_data.message  = "Reserva actualizada";
                  res.send(res_data);
                }
              }
          });
        }else{
          var res_data      = {};
          res_data.status   = "success";
          res_data.message  = "Reserva actualizada";
          res.send(res_data);
        }
      }
  });
});

router.post("/actualizar_asignar_motofast",function(req,res){

  var collection = datb.collection('Pedido');

  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'status' : 2,
      "fecha_asignar_motofast" : req.body.data.fecha_asignar_motofast,
      "motofast_id" : ObjectId(req.body.data.motofast_id)
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{
        console.log(req.body.data.usuario_id);
        io.sockets.in(req.body.data.usuario_id).emit('actualizar_pedido', {});
        // io.sockets.emit('actualizar_pedidos_pendientes', {});

        if(req.body.data.negocio_id){
          enviar_push_usuario_admin_negocio(req.body.data.negocio_id, "Repartidor asignado.");
        }

        enviar_push_usuario(req.body.data.usuario_id, "bookapp asignado.");
        enviar_push_usuario("5dab6af7d887780d17a5fd94", "bookapp asignado.");

        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Cita actualizada";
        res.send(res_data);
      }
  });
});

router.post("/actualizar_pedido_listo",function(req,res){

  var collection = datb.collection('Pedido');

  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'status' : 2,
      "fecha_pedido_listo" : req.body.data.fecha_pedido_listo
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{
        console.log(req.body.data.usuario_id);
        io.sockets.in(req.body.data.usuario_id).emit('actualizar_pedido', {});

        // io.sockets.emit('actualizar_pedidos_pendientes', {});

        if(req.body.data.negocio_id){
          enviar_push_usuario_admin_negocio(req.body.data.negocio_id, "Pedido listo.");
        }

        enviar_push_usuario(req.body.data.usuario_id, "bookapp asignado.");
        enviar_push_usuario("5dab6af7d887780d17a5fd94", "bookapp asignado.");

        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Cita actualizada";
        res.send(res_data);
      }
  });
});

router.post("/actualizar_pedido_recogi_productos",function(req,res){

  var collection = datb.collection('Pedido');

  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'status' : 3,
      'total' : req.body.data.total,
      "fecha_recogi_productos" : req.body.data.fecha_recogi_productos
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{
        console.log(req.body.data.usuario_id);
        io.sockets.in(req.body.data.usuario_id).emit('actualizar_pedido', {});

        // io.sockets.emit('actualizar_pedidos_pendientes', {});

        enviar_push_usuario_admin_negocio(req.body.data.negocio_id, "Pedido recogido.");
        enviar_push_usuario(req.body.data.usuario_id, "Pedido recogido.");
        enviar_push_usuario("5dab6af7d887780d17a5fd94", "Pedido recogido.");

        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Cita actualizada";
        res.send(res_data);
      }
  });
});

router.post("/calificar_pedido_negocio",function(req,res){

  var collection = datb.collection('Pedido');

  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'calificado_negocio' : true,
      'calificacion_negocio' : req.body.data.calificacion_negocio,
      'calificacion_comentarios_negocio' : req.body.data.calificacion_comentarios_negocio
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{
        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Reserva calificada";
        res.send(res_data);
      }
  });
});

router.post("/calificar_pedido_cliente",function(req,res){

  var collection = datb.collection('Pedido');

  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'calificado_cliente' : true,
      'calificacion_cliente' : req.body.data.calificacion_cliente,
      'calificacion_comentarios_cliente' : req.body.data.calificacion_comentarios_cliente
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{
        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Reserva calificada";
        res.send(res_data);
      }
  });
});

router.post("/actualizar_pedido_entregue_productos",function(req,res){

  var collection = datb.collection('Pedido');

  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'status' : 3,
      "fecha_entregue_productos" : req.body.data.fecha_entregue_productos
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{
        console.log(req.body.data.usuario_id);
        io.sockets.in(req.body.data.usuario_id).emit('actualizar_pedido', {});

        // io.sockets.emit('actualizar_pedidos_pendientes', {});

        if(req.body.data.negocio_id){
          enviar_push_usuario_admin_negocio(req.body.data.negocio_id, "Pedido entregado.");
        }

        enviar_push_usuario(req.body.data.usuario_id, "Pedido entregado.");
        enviar_push_usuario("5dab6af7d887780d17a5fd94", "Pedido entregado.");

        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Cita actualizada";
        res.send(res_data);
      }
  });
});

router.post("/autenticacion_prueba",function(req,res){
    var collection      = datb.collection('Usuario');
    collection.aggregate([
    { $match : { "telefono" : req.body.data.celular_prueba } },
		{ $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } },
    { $lookup: { from: "Negocio", localField: "_id", foreignField: "usuario_id", as: "negocio" } },
		{ $lookup: { from: "Modulo", localField: "tipo_usuario_id", foreignField: "tipo_usuario_id", as: "modulos" } },
		{ $lookup: { from: "Direccion", localField: "direccion_id", foreignField: "_id", as: "direccion" } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{

          var usuario_t = result[0];

          if(usuario_t.negocio.length > 0){
            usuario_t.negocio = usuario_t.negocio[0];
            usuario_t.negocio_id = usuario_t.negocio._id;
          }

          var res_data      = {};
          res_data.status   = "success";
          res_data.message  = "Bienvenido.";
          res_data.data     = usuario_t;
          res.send(res_data);
        }
    });
});

router.post("/autenticacion_correo",function(req,res){

    console.log("aut_correo");
    var name_collection = "Usuario";
    var email_login     =  req.body.data.correo.toString().toLowerCase();
    var password_login  =  req.body.data.contrasena;

    console.log("autenticacion_correo");
    console.log(email_login);
    console.log(password_login);

    var collection      = datb.collection('Usuario');
    collection.aggregate([
        { $match : { "status" : { $ne : 5 }, "correo" : email_login.toString().trim(), "contrasena" : password_login.toString().trim() } },
        { $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } },
        { $lookup: { from: "Negocio", localField: "_id", foreignField: "usuario_id", as: "negocio" } },
    		{ $lookup: { from: "Modulo", localField: "tipo_usuario_id", foreignField: "tipo_usuario_id", as: "modulos" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        if(result.length === 0){
            var res_err      = {};
            res_err.status   = "error";
            res_err.message  = "Correo electrónico o contraseña equivocada.";
            res.send(res_err);
        }else{
            var usuario_t = result[0];

            if(usuario_t.negocio.length > 0){
              usuario_t.negocio = usuario_t.negocio[0];
              usuario_t.negocio_id = usuario_t.negocio._id;
            }

            if( !usuario_t.customer_id_prod ){
              _stripe_CreateCustomerID( usuario_t );
            }

            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Bienvenido.";
            res_data.data     = usuario_t;
            res.send(res_data);
        }
    });
});

router.post("/autenticacion_correo_negocio",function(req,res){

    console.log("aut_correo");
    var name_collection = "Usuario";
    var email_login     =  req.body.data.correo.toString().toLowerCase();
    var password_login  =  req.body.data.contrasena;

    console.log("autenticacion_correo");
    console.log(email_login);
    console.log(password_login);

    var collection      = datb.collection('Usuario');
    collection.aggregate([
        { $match : { "status" : { $ne : 5 }, "correo" : email_login.toString().trim(), "contrasena" : password_login.toString().trim(), $or : [ { "tipo_usuario_id" : ObjectId("5c4050fa58209844a83c8623") }, { "tipo_usuario_id" : ObjectId("5c4050f358209844a83c8622") } ] } },
        { $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } },
        { $lookup: { from: "Negocio", localField: "_id", foreignField: "usuario_id", as: "negocio" } },
    		{ $lookup: { from: "Modulo", localField: "tipo_usuario_id", foreignField: "tipo_usuario_id", as: "modulos" } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
		console.log("auth - negocio");
		console.log(result.length);
        if(result.length === 0){
            var res_err      = {};
            res_err.status   = "error";
            res_err.message  = "Correo electrónico o contraseña equivocada.";
            res.send(res_err);
        }else{
            var usuario_t = result[0];

            if(usuario_t.negocio.length > 0){
              usuario_t.negocio = usuario_t.negocio[0];
              usuario_t.negocio_id = usuario_t.negocio._id;
            }

            if( !usuario_t.customer_id_prod ){
              _stripe_CreateCustomerID( usuario_t );
            }

			if( usuario_t.tipo_usuario_id === "5c4050fa58209844a83c8623" ){
				collection      = datb.collection('Categoria');
				collection.aggregate([
					{ $match : { "_id" : ObjectId(usuario_t.negocio.categoria_id) } },
				]).toArray(function(err, result){
					if(err){
						var res_err      = {};
						res_err.status   = "error";
						res_err.error    = err;
						res_err.message  = err;
						res.send(res_err);
					}
					if(result.length === 0){
						var res_err      = {};
						res_err.status   = "error";
						res_err.message  = "Correo electrónico o contraseña equivocada.";
						res.send(res_err);
					}else{
						usuario_t.negocio.categoria = result[0];
						var res_data      = {};
						res_data.status   = "success";
						res_data.message  = "Bienvenido.";
						res_data.data     = usuario_t;
						res.send(res_data);
					}
				});
			}else{
				var res_data      = {};
				res_data.status   = "success";
				res_data.message  = "Bienvenido.";
				res_data.data     = usuario_t;
				res.send(res_data);
			}
        }
    });
});

function _stripe_CreateCustomerID(usuario){
  var stripe = require('stripe')('sk_test_51HFV6DE5oHFxR7sy3xGadvegSNz9WxmVDc4zZnbEVOMhDSv5I0Htv78ApH4nzaV1y1AlbKrzd7JJvTulixaG71mJ00Z2yFtGSK');
  console.log(usuario);
  stripe.customers.create(
    {
      phone : usuario.telefono,
      name : usuario.nombre,
      email : usuario.correo,
      description: 'Nuevo usuario: ' +usuario.correo,
    },
    function(err, customer) {

      console.log("_stripe_CreateCustomerID");
      console.log(err);
      console.log(customer);

      var collection = datb.collection('Usuario');
      collection.update(
        { '_id' : ObjectId(usuario._id) },
          { $set: {
            'customer_id_prod' : customer.id
          } },
        function(err, result){
        }
      );

    }
  );
}

function crearDireccion( usuario_id , ubicacion_t ){
	var collection    =  datb.collection('Direccion');
	return new Promise(function (resolve, reject) {
		delete ubicacion_t._id;
	    ubicacion_t.usuario_id	= new ObjectId(usuario_id);
		collection.insert( ubicacion_t , function(err, result) {
			if(err){
			  console.log(err);
			  console.log("Error al crear la dirección");
			}else{
			  collection =  datb.collection('Usuario');
			  collection.update(
					{ '_id' : ObjectId(usuario_id) },
				  { $set: {
						'direccion_id' : ObjectId(result.insertedIds[0])
					} },
					function(err, result){
						if(err){
							var res_err      = {};
							res_err.status   = "error";
							res_err.error    = err;
							res_err.message  = err;
							res.send(res_err);
						}
						else{
					resolve();
						}
				});
			}
		});
	});
}

router.post("/registro",function(req,res){
    var collection                  = datb.collection('Usuario');
    var email_register              = req.body.data.correo.toString().toLowerCase().trim();
	  req.body.data.tipo_usuario_id	  = ObjectId("5c40513258209844a83c8629");

    delete req.body.data.tipo_usuario;
    delete req.body.data._id;
	var collection      = datb.collection('Usuario');
    collection.aggregate([
        { $match : { "status" : { $ne : 5 }, "correo" : email_register } },
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            if(result.length === 0){
              collection.insert(req.body.data, function(err, result_usuario) {
					if(err){
						var res_err      = {};
						res_err.status   = "error";
						res_err.error    = err;
						res_err.message  = err;
						res.send(res_err);
					}
					else{
						collection.aggregate([
							{ $match :  { "_id": result_usuario.ops[0]._id } },
							{ $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } },
							{ $lookup: { from: "Negocio", localField: "_id", foreignField: "usuario_id", as: "negocio" } },
							{ $lookup: { from: "Modulo", localField: "tipo_usuario_id", foreignField: "tipo_usuario_id", as: "modulos" } },
							{ $lookup: { from: "Direccion", localField: "direccion_id", foreignField: "_id", as: "direccion" } }
						]).toArray(function(err, result){
							if(err){
								var res_err      = {};
								res_err.status   = "error";
								res_err.error    = err;
								res_err.message  = err;
								res.send(res_err);
							}else{
								  delete result[0].contrasena;
								  var usuario_t = result[0];

								  if(usuario_t.negocio.length > 0){
									usuario_t.negocio = usuario_t.negocio[0];
									usuario_t.negocio_id = usuario_t.negocio._id;
								  }

								  if( !usuario_t.customer_id_prod ){
									_stripe_CreateCustomerID( usuario_t );
								  }
								  
								  if( req.body.ubicacion ){
									if( req.body.ubicacion.latitude ){
									  usuario_t.direccion = req.body.ubicacion.direccion;
									  usuario_t.latitude  = req.body.ubicacion.latitude;
									  usuario_t.longitude = req.body.ubicacion.longitude;
									  crearDireccion( usuario_t._id, req.body.ubicacion );
									}
								  }

								  var res_data      = {};
								  res_data.status   = "success";
								  res_data.message  = "Gracias por usar BookApp.";
								  res_data.submensaje  = "Tu registro fue exitoso.";
								  res_data.data     = usuario_t;
								  res.send(res_data);
							}
						});
					}
				});
            }else{
                var res_err      = {};
                res_err.status   = "info";
                res_err.message  = "Este correo electrónico ya fue registrado anteriormente.";
                res.send(res_err);
            }
        }
    });
});

router.post("/registro_negocio",function(req,res){
    var collection                  = datb.collection('Usuario');
    var email_register              = req.body.data.correo.toString().toLowerCase().trim();

    delete req.body.data.tipo_usuario;
    delete req.body.data._id;

    var usuario_t = {
      nombre : req.body.data.nombre,
      telefono : req.body.data.telefono,
      correo : req.body.data.correo,
      contrasena : req.body.data.contrasena,
      tipo_usuario_id : ObjectId("5c4050fa58209844a83c8623")
    }

    collection.find( { "correo" : email_register } ).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            if(result.length === 0){
              collection.insert(usuario_t, function(err, result) {
                if(err){
                  var res_err      = {};
                  res_err.status   = "error";
                  res_err.error    = err;
                  res_err.message  = err;
                  res.send(res_err);
                }
                else{

                  var usuario_id_t = result.insertedIds[0];

                  collection = datb.collection('Negocio');
                  var negocio_t = {
                    "nombre" : req.body.data.nombre_negocio,
                    "telefono" : req.body.data.telefono_whatsapp,
                    "usuario_id" : ObjectId(usuario_id_t),
                    "categoria_id" : ObjectId(req.body.data.categoria_id),
                    "main" : true,
                    "status" : 4
                  };
                  collection.insert(negocio_t, function(err, result) {
                    if(err){
                      var res_err      = {};
                      res_err.status   = "error";
                      res_err.error    = err;
                      res_err.message  = err;
                      res.send(res_err);
                    }
                    else{

                      var negocio_id_t = result.insertedIds[0];

                      collection = datb.collection('Usuario');
                      collection.update(
                        { '_id' : ObjectId(usuario_id_t) },
                        { $set: {
                          'negocio_id' : ObjectId(negocio_id_t)
                        } },
                        function(err, result){
                          if(err){
                              var res_err      = {};
                              res_err.status   = "error";
                              res_err.error    = err;
                              res_err.message  = err;
                              res.send(res_err);
                          }else{
                              collection = datb.collection('Usuario');
                              collection.aggregate([
                                { $match :  { "_id": ObjectId(usuario_id_t) } },
                                { $lookup: { from: "Tipo_Usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo_usuario" } },
                                { $lookup: { from: "Negocio", localField: "_id", foreignField: "usuario_id", as: "negocio" } },
                                { $lookup: { from: "Modulo", localField: "tipo_usuario_id", foreignField: "tipo_usuario_id", as: "modulos" } },
                                { $lookup: { from: "Direccion", localField: "direccion_id", foreignField: "_id", as: "direccion" } }
                              ]).toArray(function(err, result){
                                if(err){
                                  var res_err      = {};
                                  res_err.status   = "error";
                                  res_err.error    = err;
                                  res_err.message  = err;
                                  res.send(res_err);
                                }else{
                                  delete result[0].contrasena;
                                  var usuario_t = result[0];

                                  if(usuario_t.negocio.length > 0){
                                    usuario_t.negocio = usuario_t.negocio[0];
                                    usuario_t.negocio_id = usuario_t.negocio._id;
                                  }

                                  if( !usuario_t.customer_id_prod ){
                                    _stripe_CreateCustomerID( usuario_t );
                                  }

                                  var res_data      = {};
                                  res_data.status   = "success";
                                  res_data.message  = "Bienvenido.";
                                  res_data.data     = usuario_t;
                                  res.send(res_data);
                                }
                              });
                          }
                      });
                    }
                  });
                }
              });
            }else{
                var res_err      = {};
                res_err.status   = "info";
                res_err.message  = "Este correo electrónico ya fue registrado anteriormente.";
                res.send(res_err);
            }
        }
    });
});

router.post("/actualizar_usuario_contrasena",function(req,res){

  var collection = datb.collection('Usuario');
  collection.aggregate([
  { $match :  { "_id" : ObjectId(req.body.data._id), "contrasena" : req.body.data.contrasena_actual.toString().trim() } }
  ]).toArray(function(err, result){
      if(err){
          var res_err      = {};
          res_err.status   = "error";
          res_err.error    = err;
          res_err.message  = err;
          res.send(res_err);
      }else{
        if( result.length > 0 ){
          collection.update(
            { '_id' : ObjectId(req.body.data._id) },
            { $set: {
              'contrasena' : req.body.data.nueva_contrasena
            }},
            function(err, result2){
              if(err){
                var res_err      = {};
                res_err.status   = "error";
                res_err.error    = err;
                res_err.message  = err;
                res.send(res_err);
              }
              else{
                var res_data      = {};
                res_data.status   = "success";
                res_data.message  = "Actualizaste tu contraseña.";
                res.send(res_data);
              }
          });
        }else{
          var res_data      = {};
          res_data.status   = "error";
          res_data.message  = "Tu contraseña actual es incorrecta.";
          res.send(res_data);
        }
      }
  });
});

router.post("/actualizar_usuario_perfil",function(req,res){

  var collection = datb.collection('Usuario');
  collection.update(
    { '_id' : ObjectId(req.body.data._id) },
    { $set: {
      'telefono' : req.body.data.telefono,
      'nombre' : req.body.data.nombre,
      'correo' : req.body.data.correo,
      'fecha_nacimiento' : req.body.data.fecha_nacimiento
    }},
    function(err, result2){
      if(err){
        var res_err      = {};
        res_err.status   = "error";
        res_err.error    = err;
        res_err.message  = err;
        res.send(res_err);
      }
      else{
        var res_data      = {};
        res_data.status   = "success";
        res_data.message  = "Actualizaste tu perfil.";
        res.send(res_data);
      }
  });
});

router.post("/actualizar_foto_usuario",function(req,res){
  var collection	 	 =  datb.collection('Usuario');
	var foto			      =  req.body.data.foto;

  	if(foto.includes("data")){
  		req.body.data.foto =
  		'https://codigeek.app/robertodelivery/robertodelivery_fotos/'+req.body.data._id+'_usuario_foto.png';
  		var data = foto.replace(/^data:image\/\w+;base64,/, "");
  		var buf = new Buffer(data, 'base64');
  		fs.writeFile('robertodelivery_fotos/'+req.body.data._id+'_usuario_foto.png', buf);
  	}

    collection.update(
		{ '_id' : ObjectId(req.body.data._id) },
        { $set: {
			'foto' : req.body.data.foto,
		} },
		function(err, result){
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				var res_err      = {};
				res_err.status   = "success";
				res_err.message  = "Actualizaste tu foto.";
				res_err.foto  	 = 'https://codigeek.app/robertodelivery/robertodelivery_fotos/'+req.body.data._id+'_usuario_foto.png'+'?'+makeid();
				res.send(res_err);
			}
	});
});

router.post("/recuperar_contrasena",function(req,res){
    var collection                  = datb.collection('Usuario');
    var email_register              = req.body.data.correo.toString().trim();
    collection.find( { "correo" : email_register } ).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            if(result.length === 0){
              var res_data      = {};
              res_data.status   = "info";
              res_data.message  = "Correo electrónico no encontrado.";
              res.send(res_data);
            }else{
                var usuario_t = result[0];
                var codigo_recuperacion = makeid();
                collection.update(
          				{ '_id' : ObjectId(usuario_t._id) },
          		        { $set: {
          					'codigo_recuperacion' : codigo_recuperacion
          				} },
          				function(err, result){
                    enviar_correo_recuperar_contrasena( usuario_t.correo, codigo_recuperacion );
                    var res_err      = {};
                    res_err.status   = "success";
                    res_err.message  = "Código de seguridad enviado.";
                    res.send(res_err);
          			});
            }
        }
    });
});

router.post("/validar_codigo_seguridad",function(req,res){
    var collection = datb.collection('Usuario');
    var email_register = req.body.data.correo.toString().trim();
    var codigo_p = req.body.data.codigo_seguridad.toString().trim();
    console.log(email_register);
    console.log(codigo_p);
    collection.aggregate([
		    { $match :  { "correo" : email_register, "codigo_recuperacion" : codigo_p } }
    ]).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            if(result.length === 0){
              var res_data      = {};
              res_data.status   = "info";
              res_data.message  = "El código de seguridad es incorrecto.";
              res.send(res_data);
            }else{
              var res_err      = {};
              res_err.status   = "success";
              res_err.message  = "Código de seguridad correcto.";
              res.send(res_err);
            }
        }
    });
});

router.post("/cambiar_contrasena",function(req,res){
    var collection = datb.collection('Usuario');
    var email_register = req.body.data.correo.toString().trim();
    collection.find( { "correo" : email_register } ).toArray(function(err, result){
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            if(result.length === 0){
              var res_data      = {};
              res_data.status   = "info";
              res_data.message  = "Correo electrónico no encontrado.";
              res.send(res_data);
            }else{
                var usuario_t = result[0];
                collection.update(
          				{ '_id' : ObjectId(usuario_t._id) },
          		        { $set: {
          					'contrasena' : req.body.data.contrasena
          				} },
          				function(err, result){
                    var res_err      = {};
                    res_err.status   = "success";
                    res_err.message  = "Cambiaste tu contraseña con éxito.";
                    res.send(res_err);
          			});
            }
        }
    });
});

app.use('/',router);
