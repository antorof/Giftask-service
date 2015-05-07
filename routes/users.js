/**
 * Ejemplo de API Rest
 * http://en.wikipedia.org/wiki/Representational_state_transfer#Example
 *
 * Referencias sobre el uso de los metodos:
 * http://restcookbook.com/HTTP%20Methods/put-vs-post/
 *
 * Recursos utiles:
 * http://stackoverflow.com/questions/18902293/nodejs-validating-request-type-checking-for-json-or-html
 *
 */
/**
 * seguidores: [{id, nombre, username}]
 * siguiendo: [{id, nombre, username}]
 * regalos: [{}]
 */
var express = require('express');
var router = express.Router();

/**
 * Devuelve todos los usuarios
 */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');

  var auth = req.get('Authorization');
  // ToDo validate auth

  console.log(collection);
  collection.find({},{},function(e,docs){
    console.log(docs);
    if (e)
      res.json({error:-2,message:"Internal error"});
    else
      res.json({error:0,response:docs});
  });
});

/**
 * Devuelve el usuario identificado por el id
 */
router.get('/:id', function(req, res) {
  var db = req.db;
  var usersC = db.get('usercollection');
  var id = req.params.id;

  var auth = req.get('Authorization');
  // ToDo validate auth

  console.log("GET Body:");
  console.log(req.query);
  if(id.length==24)
    usersC.findById(id,{},function(e,userFnd){
      if(userFnd){
        var ids = clone(userFnd.followers);
        for (var i = 0, len = ids.length; i < len; i++) {
          ids[i] = usersC.id(ids[i]);
        }
        if(ids.length>0) {
          usersC.find({_id:{ $in : ids }},{fields:maskUser},function(e,flwrsFnd){
            console.log(flwrsFnd);
            for (var i = 0, len = flwrsFnd.length; i < len; i++) {
              console.log(userFnd.followers);
              var ix = userFnd.followers.indexOf(flwrsFnd[i]._id+"");
              userFnd.followers[ix] = flwrsFnd[i];
            }
            res.json({error:0,response:userFnd});
          });
        } else {
          res.json({error:0,response:userFnd});
        }
      } else {
        res.json({error:0,response:userFnd});
      }
    });
  else
    res.json({error:1,message:"Incorrect param"});
});

/**
 * Login
 */
router.post('/login', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');

  var username = req.body.username;
  var password = req.body.password;

  collection.find({username:username,password:password},{},function(e,docs){
    console.log(docs);
    if (e)
      res.json({error:-2,message:"Internal error"});
    else if(docs.length>0)
      res.json({error:0,response:docs});
    else
      res.json({error:1,message:"Incorrect login",response:docs});
  });
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

  var email    = req.body.email;
  var username = req.body.username;
  var name     = req.body.name;
  var password = req.body.password;
  var isMale   = req.body.isMale;
  var town     = req.body.town;
  var birthday = req.body.birthday;
  var image    = req.body.image;
  var gifts    = req.body.gifts;
  var followers= req.body.followers;
  var following= req.body.following;

  // ToDo Validate params
  var required = [username,password,email];

  if(required.indexOf(undefined)>-1,required.indexOf("")>-1)
    res.json({error:1,message:"Missing params"});
  else
    collection.insert(
      {
        email: email,
        username: username,
        name: name,
        password: password,
        isMale: isMale,
        town: town,
        birthday: birthday,
        image: image,
        gifts: gifts,
        followers:followers,
        following:following
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
  //res.json({error:-2,response:"Unkown error"});
});

/**
 * Actualiza el usuario identificado por el <tt>id</tt>
 */
router.put('/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  var id = req.params.id;

  var auth = req.get('Authorization');
  // ToDo validate auth

  console.log("PUT Body:");
  console.log(req.params);
  console.log(req.body);
  console.log(req.query);

  var email    = req.body.email;
  var username = req.body.username;
  var name     = req.body.name;
  var password = req.body.password;
  var isMale   = req.body.isMale;
  var town     = req.body.town;
  var birthday = req.body.birthday;
  var image    = req.body.image;
  var gifts    = req.body.gifts;
  var followers= req.body.followers;
  var following= req.body.following;

  // ToDo Validate params

  if(id.length==24)
    collection.update(
      {"_id" : id},
      {
        email: email,
        username: username,
        name: name,
        password: password,
        isMale: isMale,
        town: town,
        birthday: birthday,
        image: image,
        gifts: gifts,
        followers:followers,
        following:following
      },
      function(e,docs){
        console.log(docs);
        res.json({error:0,response:docs});
    });
  else
    res.json({error:1,message:"Incorrect param"});
});



/**
 * Elimina el usuario identificado por el <tt>id</tt>
 */
router.delete('/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  var id = req.params.id;

  var auth = req.get('Authorization');
  // ToDo validate auth

  console.log("DELETE Body:");
  console.log(req.query);
  if(id.length==24)
    collection.removeById(id,{},function(e,docs){
      console.log(docs);
      res.json({error:0,response:docs});
    });
  else
    res.json({error:1,message:"Incorrect param"});
});

module.exports = router;
/**
 * Clona el objeto pasado mediante serializacion
 * @param a Objecto a clonar
 */
function clone(a) {
  return JSON.parse(JSON.stringify(a));
}

var maskUser = {
  //_id:0
  //username: 0,
  //name: 0,
  //email:0,
  password: 0,
  isMale: 0,
  town: 0,
  birthday: 0,
  image: 0,
  gifts: 0,
  followers: 0,
  following: 0
}