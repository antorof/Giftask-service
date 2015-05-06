/**
 * Regalo: {
 *    id,
 *    titulo - title,
 *    imagen - image, // URL
 *    precio - price,
 *    loTengo - iHaveIt,
 *    usuarioPropietario - owner,
 *    usuarioReserva - userReserved,
 *    idTienda - shop,
 *    nombreTienda - shopName,
 *    fechaInsercion - insertionDate,
 *    idOrigen - originId,
 *    ~numLikes,~ // Nos quedamos solo con usuariosMeGusta
 *    usuariosMeGusta: {} - likes
 * }
 */
var express = require('express');
var router = express.Router();

/**
 * Devuelve todos los regalos de un usuario
 */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('giftcollection');

  console.log(req.query);

  var auth = req.get('Authorization');
  // ToDo validate auth
  var token = auth;

  collection.find({/*owner:token*/},{},function(e,docs){
    console.log(docs);
    if (e)
      res.json({error:1,message:"Internal error"});
    else
      res.json({error:0,response:docs});
  });
});

/**
 * Devuelve el regalo identificado por el <tt>id</tt>
 */
router.get('/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('giftcollection');

  console.log(req.query);

  var id = req.params.id;

  var auth = req.get('Authorization');
  // ToDo validate auth
  var token = auth;

  if(id.length==24)
    collection.findById(id,{},function(e,docs){
      console.log(docs);
      if(docs!=null) {
        if (docs.owner == token)
          res.json({error: 0, response: docs});
        else
          res.json({error: -2, message: "Authentication error"});
      }
    });
  else
    res.json({error:1,message:"Incorrect param"});
});

/**
 * Crea un nuevo regalo
 */
router.post('/', function(req, res) {
  var db = req.db,
      collection = db.get('giftcollection');

  console.log("POST Params, Body and Query:");
  console.log(req.params);
  console.log(req.body);
  console.log(req.query);

  var auth = req.get('Authorization');
  // ToDo validate auth
  var token = auth;

  var title = req.body.title;
  var image = req.body.image;
  var price = req.body.price;
  var iHaveIt = undefined;
  var owner = token;
  var userReserved = undefined;
  var shop = req.body.shop;
  var shopName = req.body.shopName;
  var insertionDate = req.body.insertionDate;
  var originId = req.body.originId;
  var likes = undefined; // ToDo Se heredan los likes?

  // ToDo Validate params

  collection.insert(
    {
      title: title,
      image: image,
      price: price,
      iHaveIt: iHaveIt,
      owner: owner,
      userReserved: userReserved,
      shop: shop,
      shopName: shopName,
      insertionDate: insertionDate,
      originId: originId,
      likes: likes
    },
    function (err, doc) {
      if (err) {
        res.send({error:2,message:"Error while adding"});
      }
      else {
        console.log(doc);
        res.json({error:0,response:doc});
      }
    }
  );
});

/**
 * Actualiza el regalo identificado por el <tt>id</tt>
 */
router.put('/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('giftcollection');

  console.log("PUT Body:");
  console.log(req.params);
  console.log(req.body);
  console.log(req.query);

  var auth = req.get('Authorization');
  // ToDo validate auth
  var token = auth;

  var id = req.params.id;
  var title = req.body.title;
  var image = req.body.image;
  var price = req.body.price;
  var iHaveIt = req.body.iHaveIt;
  var owner = token;
  var userReserved = req.body.userReserved;
  var shop = req.body.shop;
  var shopName = req.body.shopName;
  var insertionDate = req.body.insertionDate;
  var originId = req.body.originId;
  var likes = req.body.likes;

  // ToDo Validate params

  if(id.length==24)
    collection.update(
      {"_id" : id},
      {
        title: title,
        image: image,
        price: price,
        iHaveIt: iHaveIt,
        owner: owner,
        userReserved: userReserved,
        shop: shop,
        shopName: shopName,
        insertionDate: insertionDate,
        originId: originId,
        likes: likes
      },
      function(e,docs){
        console.log(docs);
        res.json({error:0,response:docs});
    });
  else
    res.json({error:1,message:"Incorrect param"});
});

/**
 * Elimina el regalo identificado por el <tt>id</tt>
 */
router.delete('/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('giftcollection');

  console.log("DELETE Body:");
  console.log(req.query);

  var id = req.params.id;

  var auth = req.get('Authorization');
  // ToDo validate auth
  var token = auth;
  
  if(id.length==24)
    collection.findById(id,{},function(e,docs){
      console.log(docs);
      if(docs!=null) {
        if (docs.owner == token)
          collection.removeById(id,{},function(e,docs){
            console.log(docs);
            res.json({error:0,response:docs});
          });
        else
          res.json({error: -2, message: "Authentication error"});
      }
    });
  else
    res.json({error:1,message:"Incorrect param"});
});

module.exports = router;
