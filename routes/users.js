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
        var position = req.body.position;

        mongoose.model('User').create({
            name : name,
            position : position
        }, function (err, user) {
              if (err) {
                  res.send("Locho!");
              } else {
                  console.log('Success POST ' + user);
                  res.format({
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
                json: function(){
                       res.json({messposition : err.status  + ' ' + err});
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
        res.format({
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
	            res.format({
	                json: function(){
	                       res.json(user);
	                 }
	            });
	        }
	    });
	})
	 .put(function(req, res) {
      var data = req.body;
      mongoose.model('User').findById(req.id, function (err, user) {
          var updatables = ['name','position'];
          updatables.forEach(function(updatable){
            if(data[updatable]){
              user[updatable] = data[updatable];
            }
          });
          user.save(function(err){
            if(err){
              console.log(err);
            }
            else{
              res.format({
                     json: function(){
                            res.json(user);
                      }
                   });
            }
          });
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
	                        json: function(){
	                               res.json({messposition : 'deleted',
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