/**
 * Ejemplo de API Rest
 * http://en.wikipedia.org/wiki/Representational_state_transfer#Example
 *
 * Referencias sobre el uso de los metodos:
 * http://restcookbook.com/HTTP%20Methods/put-vs-post/
 *
 */
var express = require('express');
var router = express.Router();

/**
 * Devuelve todos los usuarios
 */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');

  console.log(collection);
  collection.find({},{},function(e,docs){
    console.log(docs);
    if (e)
      res.json({error:1,message:"Internal error"});
    else
      res.json({error:0,response:docs});
  });
});

/**
 * Devuelve el usuario identificado por el <tt>id</tt>
 */
router.get('/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  var id = req.params.id;

  console.log("GET Body:");
  console.log(req.query);
  if(id.length==24)
    collection.findById(id,{},function(e,docs){
      console.log(docs);
      res.json({error:0,response:docs});
    });
  else
    res.json({error:1,message:"Incorrect param"});
});

/**
 * Crea un nuevo usuario
 */
router.post('/', function(req, res) {
  var db = req.db,
      collection = db.get('usercollection');

  console.log("POST Params, Body and Query:");
  console.log(req.params);
  console.log(req.body);
  console.log(req.query);

  var username = req.body.username;
  var email    = req.body.email;
  var password = req.body.password;
  var sex      = req.body.sex;
  var birthday = req.body.birthday;
  var image    = req.body.image;

  // ToDo Validate params

  collection.insert(
    {
      username: username,
      email: email,
      password: password,
      sex: sex,
      birthday: birthday,
      image: image
    },
    function (err, doc) {
      if (err) {
        res.send({error:1,message:"Ha habido un problema añadiendo el campo a la base de datos"});
      }
      else {
        console.log(doc);
        res.json({error:0,response:doc});
      }
    }
  );
});

/**
 * Actualiza el usuario identificado por el <tt>id</tt>
 */
router.put('/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  var id = req.params.id;

  console.log("PUT Body:");
  console.log(req.params);
  console.log(req.body);
  console.log(req.query);

  var username = req.body.username;
  var email    = req.body.email;
  var password = req.body.password;
  var sex      = req.body.sex;
  var birthday = req.body.birthday;
  var image    = req.body.image;

  // ToDo Validate params

  if(id.length==24)
    collection.update(
      {"_id" : id},
      {
        username: username,
        email: email,
        password: password,
        sex: sex,
        birthday: birthday,
        image: image
      },
      function(e,docs){
        console.log(docs);
        res.json({error:0,response:docs});
    });
  else
    res.json({error:1,message:"Incorrect param"});
});

module.exports = router;
