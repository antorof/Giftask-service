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
 * seguidores: [{id, nombre, username, image}]
 * siguiendo: [{id, nombre, username, image}]
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

  if(id.length==24)
    usersC.findById(id,maskUser,function(e,userFnd){
      if(userFnd){
        var idsFwrs = toObjectID(userFnd.followers,usersC);
        if(idsFwrs.length>0) {
          matchUsuarios(usersC,userFnd.followers,idsFwrs,maskUserStub,function(e,result){
            var idsFwng = toObjectID(userFnd.following,usersC);
            if(idsFwng.length>0) {
              matchUsuarios(usersC,userFnd.following,idsFwng,maskUserStub,function(e,result){
                res.json({error:0,response:userFnd});
              });
            } else {
              res.json({error:0,response:userFnd});
            }
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
  var email = req.body.email;

  //collection.findOne({username:username,password:password,email:email},{},function(e,docs){
  collection.findOne({$or: [{username:username,password:password}, {email:email,password:password}]},{},function(e,docs){
    console.log(docs);
    if (e)
      res.json({error:-2,message:"Internal error"});
    //else if(docs.length>0)
    //  res.json({error:0,response:docs});
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
 * Actualiza la imagen del usuario identificado por el id
 */
router.put('/:id/image', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  var id = req.params.id;
  var basePath = process.env.OPENSHIFT_DATA_DIR?process.env.OPENSHIFT_DATA_DIR:"./";
  var upath = basePath+"uploads/uimages";
  console.log(upath);

  console.log(req.params);
  console.log(req.body);
  console.log(req.query);
  console.log(req.files);

  var auth = req.get('Authorization');
  // ToDo validate auth

  var image = req.body.image;

  // ToDo Validate params

  //if(id.length==24)
  //  collection.update(
  //      {"_id" : id},
  //      {
  //        image: image
  //      },
  //      function(e,docs){
  //        console.log(docs);
  //        res.json({error:0,response:docs});
  //      });
  //else
    res.json({error:1,message:"Incorrect param",other:[
      req.params,
      req.body,
      req.query,
      req.files
    ]});
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

/* --------------------------------------------------------------- */
/* --------------------FUNCIONES Y VARIABLES---------------------- */

/**
 * Busca la informacion de los usuarios cuyas IDs se proveen y las
 * introduce en su lugar correspondiente (sustituye) en el array
 * actual de IDs (current).
 * @param collection Collection en la que se busca
 * @param current Array actual, en el que se volcaran los datos utilizando matching
 * @param ids Array con los IDs de los usuario que queremos buscar
 * @param mask Mascara de seleccion de campos
 * @param callback Callback llamado al terminar con los parametros 'e' y
 *                 el resultado de la consulta
 */
function matchUsuarios(collection, current, ids, mask, callback) {
  collection.find({_id:{ $in : ids }},{fields:mask},function(e,result){
    for (var i = 0, len = result.length; i < len; i++) {
      var ix = current.indexOf(result[i]._id+"");
      current[ix] = result[i];
    }
    callback(e,result);
  });
}

function toObjectID(obj, collection) {
  var res = Array();
  if(is('Array',obj)) {
    for (var i = 0, len = obj.length; i < len; i++) {
      res.push( collection.id(obj[i]) );
    }
  } else {
    res = collection.id(obj);
  }
  return res;
}

/**
 * Clona el objeto pasado mediante serializacion
 * @param a Objecto a clonar
 */
function clone(a) {
  return JSON.parse(JSON.stringify(a));
}

function is(type, obj) {
  var clas = Object.prototype.toString.call(obj).slice(8, -1);
  return obj !== undefined && obj !== null && clas === type;
}

var maskUserStub = {
  //_id:0,
  //username: 0,
  //name: 0,
  //email:0,
  password: 0,
  isMale: 0,
  town: 0,
  birthday: 0,
  //image: 0,
  gifts: 0,
  followers: 0,
  following: 0
};

var maskUser = {
  //_id:0,
  //username: 0,
  //name: 0,
  //email:0,
  //password: 0,
  //isMale: 0,
  //town: 0,
  //birthday: 0,
  //image: 0,
  gifts: 0,
  //followers: 0,
  //following: 0
};