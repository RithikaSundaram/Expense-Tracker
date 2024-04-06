//this should be outside the static files since static files should contain only the
//frontend files
//Express --> Live server
//when we use live server if we update the code it will automatically updates in the browser
//but with express if we want to use that -->nodemon (npm package)
//nodemon-->automatically updates

// http://127.0.0.1.3000/hi?phone=12
//while passing the parameters give it with ?

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Expense = require("./models/expense");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require("cors");
const static = express.static("static");
app.use(cors());

app.use("/", static); // if we use /forms instead of / --> cannot GET/
// we can serve ststic files in any path here we are using /
//app.use -- > app.get

//to connect with mongodb
mongoose
  .connect("mongodb://127.0.0.1:27017/expense")
  .then(() => console.log("MongoDB connected"))
  .catch(() => console.log("DB connection failed"));

/*const author = new Author({
  name: Math.random().toString(),
  email: Math.random().toString(),
});
author.save().then(() => console.log("Author Created"));
console.log(Author.find({}).then((data) => console.log(data)));
*/

// app.post("/authors", async (req, res) => {
//   try {
//     const { name, email } = req.body;
//     const newAuthor = new Author({
//       name: name,
//       email: email,
//     });
//     await newAuthor.save();

//     res.status(201).json(newAuthor);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to save author to database" });
//   }
// });

// to update the user name
// app.post("/authors/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Find the author by id
//     const author = await Author.findById(id);

//     if (!author) {
//       return res.status(404).json({ error: "Author not found" });
//     }

//     // Update the name if provided in the request body
//     if (req.body.name) {
//       author.name = req.body.name;
//       author.email = req.body.email;
//     }

//alternate method
// author.name=name?name:author.name;
// author.email=email?email?author.email;

// Save the updated author to the database
//     await author.save();

//     res.json(author);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to update author" });
//   }
// });

// app.get("/hi", (req, res) => {
//   console.log(req.query);
//   res.json(req.query);
// }); //post -- >body in postman
//get params in postman
//if we give params it will automatically updates the url

//get method --> query
//post method --> body

// app.post("/hi", (req, res) => {
//   console.log(req.body);
//   //res.send("Hello");
//   res.json({
//     name: req.body.name,
//     description: req.body.description,
//     date: req.body.date,
//     amount: req.body.amount,
//   });
// });

//fetch is an package
//todos is an third party api
/*app.get("/todos", async(req,res) => {
    //fetch('https://jsonplaceholder.typicode.com/todos/1')
   //.then((response)=>response.json())
   //.then((json)=>res.json(json));
   const response = await fetch("https://jsonplaceholder.typicode.com/todos")
   const todos = await response.json()
   res.json(todos)
});*/

/*app.get("/todos/2", async(req,res) => {
    //fetch('https://jsonplaceholder.typicode.com/todos/1')
   //.then((response)=>response.json())
   //.then((json)=>res.json(json));
   const response = await fetch("https://jsonplaceholder.typicode.com/todos/2")
   const todos = await response.json()
   res.json(todos)
});*/

//to generate the todos for many times
//to create dynamically
//id-->key(here)
//Network failed (error handling)
/*app.get("/todos",async(req,res) => {
    try{
    const response = await fetch("https://jsonplaceholder.typicode.com/todos")    
    const todos = await response.json()
    res.json(todos)
    }catch(err){
        res.status(503).json({
            error:'API call failed',
        })
    }
})*/

// app.get("/todos/:todoId", async (req, res) => {
//   const todoId = parseInt(req.params.todoId);
//   try {
//     const response = await fetch("https://jsonplaceholder.typicode.com/todos");
//     const todos = await response.json();
//     const todo = todos.find((todo) => todo.id === todoId);
//     if (todo) {
//       res.json(todo);
//     } else {
//       res.status(404).json({
//         error: "User not found",
//       });
//     }
//   } catch (err) {
//     res.status(503).json({
//       error: "API call failed",
//     });
//   }
// });

// //wildcard enpoint-->if other than above paths then this will be run
// app.get("*", (req, res) => {
//   res.json({});
// });

app.post("/expenses", (req, res) => {
  const { name, desc, date, amt } = req.body;
  const expense = new Expense({
    name,
    desc,
    date,
    amt,
  });

  expense
    .save()
    .then((data) => res.status(201).json(data))
    .catch((error) =>
      res.json({
        error: error.message,
      })
    );
});

//post method
app.post("/expenses/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by id
    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ error: "Expense not recorded" });
    }
    if (req.body.name) {
      expense.name = req.body.name;
      expense.desc = req.body.desc;
      expense.date = req.body.date;
      expense.amt = req.body.amt;
    }
    await expense.save();

    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update expense of the user" });
  }
});

//get

app.get("/expenses", async (req, res) => {
  const expenses = await Expense.find({});
  res.json(expenses);
});

app.get("/expenses/:id", async (req, res) => {
  const { id } = req.params;
  const expense = await Expense.findById(id);
  res.json(expense);
});

//put
app.put("/expenses/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ error: "Expense not recorded" });
    }

    expense.name = req.body.name ? req.body.name : expense.name;
    expense.desc = req.body.desc ? req.body.desc : expense.desc;
    expense.date = req.body.date ? req.body.date : expense.date;
    expense.amt = req.body.amt ? req.body.amt : expense.amt;

    // Save the updated author to the database
    await expense.save();

    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update expenses" });
  }
});
//delete the User
app.delete("/expenses/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

app.listen(5001, () => {
  console.log("App Running");
});
