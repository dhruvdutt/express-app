var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

router.route('/')
    .get(function(req, res, next) {
        mongoose.model('User').find({}, function (err, users) {
              if (err) {
                  return console.error(err);
              } else {
                  res.format({
                    html: function(){
                        res.render('users/index', {
                              title: 'Users',
                              "users" : users
                          });
                    },
                    json: function(){
                        res.json(users);
                    }
                });
              }     
        });
    })
    .post(function(req, res) {
        var name = req.body.name;
        var age = req.body.age;
        var dob = req.body.dob;

        mongoose.model('User').create({
            name : name,
            age : age,
            dob : dob
        }, function (err, user) {
              if (err) {
                  res.send("Locho!");
              } else {
                  console.log('Success POST ' + user);
                  res.format({
                    html: function(){
                        res.location("users");
                        res.redirect("/users");
                    },
                    json: function(){
                        res.json(user);
                    }
                });
              }
        })
    });

router.get('/new', function(req, res) {
    res.render('users/new', { title: 'Add New User' });
});

router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    mongoose.model('User').findById(id, function (err, user) {
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        } else {
            //console.log(user);
            req.id = id;
            next(); 
        } 
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('User').findById(req.id, function (err, user) {
      if (err) {
        console.log('GET Error ' + err);
      } else {
        console.log('GET Retrieving ID: ' + user._id);
        var userdob = user.dob.toISOString();
        userdob = userdob.substring(0, userdob.indexOf('T'))
        res.format({
          html: function(){
              res.render('users/show', {
                "userdob" : userdob,
                "user" : user
              });
          },
          json: function(){
              res.json(user);
          }
        });
      }
    });
  });

router.route('/:id/edit')
	.get(function(req, res) {
	    mongoose.model('User').findById(req.id, function (err, user) {
	        if (err) {
	            console.log('GET Error ' + err);
	        } else {
	            console.log('GET Retrieving ID: ' + user._id);
              var userdob = user.dob.toISOString();
              userdob = userdob.substring(0, userdob.indexOf('T'))
	            res.format({
	                html: function(){
	                       res.render('users/edit', {
	                          title: 'User' + user._id,
                            "userdob" : userdob,
	                          "user" : user
	                      });
	                 },
	                json: function(){
	                       res.json(user);
	                 }
	            });
	        }
	    });
	})
	.put(function(req, res) {
	    var name = req.body.name;
	    var age = req.body.age;
	    var dob = req.body.dob;

	    mongoose.model('User').findById(req.id, function (err, user) {
	        //update it
	        user.update({
	            name : name,
	            age : age,
	            dob : dob
	        }, function (err, userID) {
	          if (err) {
	              res.send("There was a problem updating the information to the database: " + err);
	          } 
	          else {
	                  res.format({
	                      html: function(){
	                           res.redirect("/users/" + user._id);
	                     },
	                    json: function(){
	                           res.json(user);
	                     }
	                  });
	           }
	        })
	    });
	})
	.delete(function (req, res){
	    mongoose.model('User').findById(req.id, function (err, user) {
	        if (err) {
	            return console.error(err);
	        } else {
	            user.remove(function (err, user) {
	                if (err) {
	                    return console.error(err);
	                } else {
	                    console.log('DELETE removing ID: ' + user._id);
	                    res.format({
	                          html: function(){
	                               res.redirect("/users");
	                         },
	                        json: function(){
	                               res.json({message : 'deleted',
	                                   item : user
	                               });
	                         }
	                      });
	                }
	            });
	        }
	    });
	});

module.exports = router;