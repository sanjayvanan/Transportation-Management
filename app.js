require("dotenv").config()

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const Service = require("./models/Service")

const RFQ = require("./models/RFQ")

const app = express();

// Passport Config
require('./config/passport')(passport);




// Connect to MongoDB
mongoose
  .connect(
    "mongodb://localhost:27017/Mydb1",
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected ✅'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));


// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

const { ensureAuthenticated , forwardAuthenticated }  = require("./config/auth")




// Routes
app.get('/',(req,res)=>{
  const limit=4;
  const user = req.user;
  Service.find({}, (err, service) => {
    if (err) {
      console.log(err);
      return;
    }
    res.render("index", { service: service, user:user});
  }).limit(limit);
});


app.get("/contact" , (req,res)=>{
  const user = req.user;
  res.render("Contact_us",{user:user})

})
app.get("/services", ensureAuthenticated , (req, res) => {
  
  const user = req.user;
  Service.find({}, (err, service) => {
    if (err) {
      console.log(err);
      return;
    }
    res.render("Services", { service: service,user:user });
  });
});

app.get("/about_us", (req,res)=>{
  const user = req.user;
  res.render("About_us",{user:user})
})

app.get("/Addservice",ensureAuthenticated ,(req,res)=>{
  const user = req.user;
  res.render("Addservice",{user:user})

})

app.post("/createdservice",ensureAuthenticated ,(req,res)=>{

  const data = { name:req.body.name,email:req.body.email,pnum : req.body.phonenum ,company_name: req.body.company_name,location:req.body.location,weight:req.body.weight,from:req.body.from,to:req.body.to,message:req.body.message }
  const user = req.user;
  Service.create(data,(err,service)=>{
      if(err){
          console.log(err);
      }else{
          console.log(service);
          res.redirect("/services")
      }
  })
})



app.get('/service/:id/update',ensureAuthenticated , (req, res) => {
  const id = req.params.id;
  const user = req.user;
  Service.findById(id, (err, service) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error finding service');
    } else {
      res.render('update_service', { service: service,user:user });
    }
  });
});



app.post('/service/update/:id', ensureAuthenticated , (req, res) => {
  const id = req.params.id;
  const user = req.user;
  const updatedService = {
    name: req.body.name,
    email: req.body.email,
    pnum: req.body.phonenum,
    company_name: req.body.company_name,
    location: req.body.location,
    weight: req.body.weight,
    from: req.body.from,
    to: req.body.to,
    message: req.body.message
  };

  Service.findByIdAndUpdate(id, updatedService, { new: true }, (err, service) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error updating service');
    } else {
      res.redirect('/services');
    }
  });
});



app.get('/service/(:id)',ensureAuthenticated , function(req, res, next) {
  Service.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
          res.redirect('/Services');
      } else {
          console.log('Failed to Delete user Details: ' + err);
      }
  });
})


app.get("/order-reservation",ensureAuthenticated ,(req,res)=>{
  const user = req.user;
  res.render("order",{user:user})

})

app.post("/order-reservation",ensureAuthenticated,(req,res)=>{
  const { company_name, company_location , dest_company , contain,Valofgoods,weight,orgin,orgin_pincode,destination,destination_pincode } = req.body;
  RFQ.create({company_name, company_location,dest_company , contain,Valofgoods,weight,orgin,orgin_pincode,destination,destination_pincode})
    .then((data)=>{
      console.log(data);
      return res.redirect("/");
    })

})


app.get("/Reservations",ensureAuthenticated ,(req,res)=>{
  const user = req.user;
  RFQ.find((err, rfq) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error finding service');
    } else {
      res.render('Reservations', { rfq: rfq,user:user });
    }
  });
  
})


app.get('/Reservations/(:id)',ensureAuthenticated , function(req, res) {
  const _id = req.params.id;
  
        RFQ.updateOne({_id},{$set:{isDeclined:true}})
            .then((data)=>{
              console.log(data);
              res.redirect("/Reservations")
            })
            .catch((err)=>{
              console.log(err);
            })

          }
)

app.get('/myOrders',ensureAuthenticated , function(req, res) {
  const _id = req.params.id;
  
        RFQ.find({isDeclined : true})
            .then((data)=>{
              console.log(data);
              res.render("myOrders",{data:data,user:req.user})
            })
            .catch((err)=>{
              console.log(err);
            })

          }
)


//mongoose update ?



// Sample invoice



// Sample data for invoice
const invoice = {
  invoiceNumber: 123456,
  date: '2023-04-29',
  customer: {
    name: 'John Doe',
    address: '123 Main St, Anytown, USA',
    email: 'johndoe@email.com',
  },
  items: [
    {
      description: 'Delivery of package',
      quantity: 1,
      price: 50,
    },
    {
      description: 'Freight charges',
      quantity: 1,
      price: 25,
    },
  ],
  total: 75,
};

// Route to generate the invoice
app.get('/invoice', (req, res) => {
  res.render('invoice', { invoice });
});


// Invoice template using EJS
// This template can be modified as per your requirements
app.get('/invoice', (req, res) => {
  res.render('invoice', { invoice });
});








app.use('/users', require('./routes/users.js'));

app.use((req,res)=>{
  
 res.status(404).render("404");
})


const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));
