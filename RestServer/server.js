// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');

mongoose.connect('mongodb://admin_lifemoments:admin$$$@ds047742.mlab.com:47742/life_moments_db'); // connect to our database

var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function () {
    console.log('connected');
});

var User = require('./app/models/user');
var Story = require('./app/models/story');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.sendfile('doc.txt');
});

// on routes that end in /users
// ----------------------------------------------------
router.route('/users')

	// create a bear (accessed at POST http://localhost:8080/api/users)
	.post(function(req, res) {
		        
	    if (typeof req.body.name === 'undefined') {
	        res.json({ message: 'Input is undefined' });
	    };
	    
	    var user = new User();		// create a new instance of the user model

	    user.name = req.body.name;  // set the user's name (comes from the request)
	    user.password = req.body.password;

		user.save(function(err) {
			if (err)
			    res.json({ message: 'User Exist!' });

			res.json({ message: 'User Created!' });
		});

	})

	// get all the bears (accessed at GET http://localhost:8080/api/users)
	.get(function(req, res) {
		User.find(function(err, user) {
			if (err)
				res.send(err);

			res.json(user);
	    });
	});



//// on routes that end in /doc
//// ----------------------------------------------------
router.route('/doc')
.get(function (req, res) {
    res.sendfile('doc.txt');   //send documentation for API usage
});


//// on routes that end in /story
//// ----------------------------------------------------
router.route('/story')

	// create a bear (accessed at POST http://localhost:8080/api/story)
	//.post(function (req, res) {
	//    console.log(req.body);      // your JSON
	//    res.send(req.body);    // echo the result back
	//    });

    .post(function (req, res) {
         //new itemModel(req.body.formContents).save(function (e) {
         //   res.send('item saved');
        
        if (typeof req.body.username === 'undefined') {
            res.json({ message: 'Input is undefined' });
        };

        var story = new Story();
        story.username = req.body.username;
        story.storyID = req.body.storyID;
        story.startLocation = req.body.startLocation;
        story.endLocation = req.body.endLocation;
        story.style = req.body.style;
        story.sharedFlag = req.body.sharedFlag;

        story.save(function (err) {
            if (err)
                res.json({ message: 'Story Exist!' }); //if story is re-shared we won't save another copy but use the origin

            res.json({ message: 'Story Saved!' });
        })
    })

   .get(function (req, res) {
          Story.find(function (err, user) {
              if (err)
                  res.send(err);

              res.json(user);
          });
      });


//// on routes that end in /bears/:bear_id
//// ----------------------------------------------------
//router.route('/bears/:bear_id')

//	// get the bear with that id
//	.get(function(req, res) {
//		Bear.findById(req.params.bear_id, function(err, bear) {
//			if (err)
//				res.send(err);
//			res.json(bear);
//		});
//	})

//	// update the bear with this id
//	.put(function(req, res) {
//		Bear.findById(req.params.bear_id, function(err, bear) {

//			if (err)
//				res.send(err);

//			bear.name = req.body.name;
//			bear.save(function(err) {
//				if (err)
//					res.send(err);

//				res.json({ message: 'Bear updated!' });
//			});

//		});
//	})

//	// delete the bear with this id
//	.delete(function(req, res) {
//		Bear.remove({
//			_id: req.params.bear_id
//		}, function(err, bear) {
//			if (err)
//				res.send(err);

//			res.json({ message: 'Successfully deleted' });
//		});
//	});


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
