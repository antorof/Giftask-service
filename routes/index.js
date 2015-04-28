var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', {});
});

router.get('/registro', function(req, res) {
	res.render('index', {});
});

/**
 * Muestra el panel modal para editar usuario
 */
router.get('/modalUsuario', function(req, res) {
	res.render('editUserModal', {});
});

/**
 * Edita un usuario en la base de datos y vuelve al panel de usuarios.
 * No renderiza una vista
 */
router.post('/modalUsuario', function(req, res) {
	// Obtenemos la db
	var db = req.db;

	//Obtenemos los atributos enviados en el post
	var idEdit = req.body.idEdit;
	var usuarioEdit = req.body.usuarioEdit;
	var emailEdit = req.body.emailEdit;
	var passwordEdit = req.body.passwordEdit;

	//Obtenemos la coleccion
	var collection = db.get('usercollection');
	//Actualizamos la funcion
	collection.update(
		{"_id" : idEdit},
		{
			"usuario":usuarioEdit,
			"email":emailEdit,
			"password":passwordEdit
		},
		function(err){
			res.sendStatus(200)
		}
	);

});


/**
 * RUTA PARA AÑADIR UN NUEVO USUARIO
 */
router.post('/addUsuario', function(req, res) {
	//obtenemos la db
	var db = req.db;

	//obtenemos el contenido del form por los name
	var usuario = req.body.usuario;
	var email = req.body.email;
	var password = req.body.password;

	//obtenemos la coleccion donde vamos a insertar
	var collection = db.get('usercollection');

	//Insertamos en la base de datos el nuevo usuario
	collection.insert({
		"usuario" : usuario,
		"email" : email,
		"password" : password

	}, function (err, doc) {
		console.log("dentro");
		if (err) {
			console.log("cagada");
			//Si hay algun problema
			res.send("Ha habido un problema añadiendo el campo a la base de datos");
		}
		else {
			console.log("ha ido bien");
			//Si funciona, indicamos que seguimos estando en /registro y no en /anadirUsuario
			res.location("registro");
			//y redireaccionamos a esa pagina
			res.redirect('/registro');
		}
	});
});

/**
 * RUTA PARA OBTENER LOS USUARIOS DE LA BASE DE DATOS
 */
router.get('/usuarios', function(req, res) {
	var db = req.db;
	var collection = db.get('usercollection');
	collection.find({},{},function(e,docs){
		res.render('usuarios', {
			"usuarios" : docs
		});
	});
});



module.exports = router;
