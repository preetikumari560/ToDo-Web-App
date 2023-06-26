require('dotenv').config()   // for .env file

const express = require('express')

const bodyParser = require('body-parser')

const dateMonthYear = require(__dirname+"/date.js") // requiring a created inbuilt module

const _ = require('lodash')

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"))


//requiring mongoose 
const mongoose = require("mongoose")
mongoose.set('strictQuery', false)

//create new database inside mongodb
 mongoose.connect('mongodb://127.0.0.1:27017/todoDb');  //(it's a local)

// const url=`mongodb+srv://${process.env.CLIENT_ID}/todoDb`

// mongoose.connect(url);


// collection schema
 const itemSchema =   {
        name:String
        }


  // using desgined model/structure
const Item = mongoose.model("Item",itemSchema) //Item is a model name


// creating document for collection

const item1= new Item ({
        name :" Let's plan our day  ✍!"
})
 

const defaultItems = [item1]

const listSchema={
        name: String,
        item:[itemSchema]

}

// using desgined model/structure
const List = mongoose.model("List",listSchema)

// accessing inbuilt created module i.e(date.js) function
// const date= dateMonthYear.getsDay()    
const date= dateMonthYear.getsDate()


///////////////////////////////////////////////////////////////////////////////////////
// when user try to access home route i.e,"/", "hello" will  print
// app.get("/", (req, res) => {

//     // res.send("hello")
    

//     Item.find({},(err,foundItems)=>{
//         // console.log(foundItems)
//         if(foundItems.length===0)
//         {
//            Item.insertMany(defaultItems,(err)=>{
            
//             if(err)
//                 {
//                     console.log(err)
//                 }
//             else{
//                 // console.log("successfully added")
//             }
//     })
//             res.redirect("/")
//         }
//         else{
     
//             res.render("list", { keyHead: date, listTitle: foundItems })
               
//         }

// })
    
// })
app.get("/", async (req, res) => {
  try {
    const foundItems = await Item.find({});
    
    if (foundItems.length === 0) {
      await Item.insertMany(defaultItems);
      res.redirect("/");
    } else {
      res.render("list", { keyHead: date, listTitle: foundItems });
    }
  } catch (err) {
    console.log(err);
  }
});



///////////////////////////////////////////////////////////////////////////////
// app.post("/", (req, res)=> {

//     const list_Name = req.body.list
//     const item_Name = req.body.itemNew
//     // console.log(req.body)
//     console.log( item_Name)
//     console.log( list_Name)
//     console.log( date)

//     if (!item_Name) {
//         // If item_Name is empty, redirect it to homepage
//         if(list_Name=== date){
//         res.redirect('/')
    
//         }
//             // If item_Name is empty, redirect it to custom_list page
//         else{
//             res.redirect('/'+list_Name)
//         }
        
//       }

//     else{

//     const item_new = new Item(
//         {
//             name: item_Name
//         }
//     )

//     if( list_Name=== date)
//     {

//             item_new.save()
//             res.redirect("/")

//     }
//     else{
//         List.findOne({name:list_Name},(err, foundList)=>{
//          console.log(foundList)
//          foundList.item.push(item_new)
//          foundList.save()
//          res.redirect("/"+list_Name)
//         })
//         }
//     }
// })
app.post("/", (req, res) => {
  const list_Name = req.body.list;
  const item_Name = req.body.itemNew;

  console.log(item_Name);
  console.log(list_Name);
  console.log(date);

  if (!item_Name) {
    if (list_Name === date) {
      res.redirect("/");
    } else {
      res.redirect("/" + list_Name);
    }
  } else {
    const item_new = new Item({
      name: item_Name,
    });

    if (list_Name === date) {
      item_new
        .save()
        .then(() => {
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      List.findOne({ name: list_Name })
        .then((foundList) => {
          console.log(foundList);
          foundList.item.push(item_new);
          return foundList.save();
        })
        .then(() => {
          res.redirect("/" + list_Name);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
});

//////////////////////////////////////////////////////////////////

// app.post("/delete",(req,res)=>
// {
//     const listHeading =req.body.listName
//     const checkItemId = req.body.checkBox
    
//     if(listHeading===date)
//         {        
//         // or   Item.deleteOne({_id:checkItemId},(err)=>
//         Item.findByIdAndRemove(checkItemId,(err)=>  
//             { 
//                 if(!err)
//                 {
//                     console.log("item deleted successfully")
//                     res.redirect("/")
//                 }
//                 else
//                 {
//                     console.log(err)  
//                 } 
//             }) 
//         }
//         else
//         {
//         List.findOneAndUpdate({name:listHeading},{$pull:{item:{_id:checkItemId}}},(err,foundOne)=>{
//                 if(!err)
//                     {
//                         res.redirect("/"+listHeading)
//                     }
//                 else
//                     {
//                         console.log(err)
//                     }
//             })
//         }

// })

app.post("/delete", (req, res) => {
  const listHeading = req.body.listName;
  const checkItemId = req.body.checkBox;

  if (listHeading === date) {
    Item.findByIdAndRemove(checkItemId)
      .then(() => {
        console.log("item deleted successfully");
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    List.findOneAndUpdate({ name: listHeading }, { $pull: { item: { _id: checkItemId } } })
      .then(() => {
        res.redirect("/" + listHeading);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});



//////////////////////////////////////////////////////////////////////////////////
// localhost:3000/work ,another template page by sharing same html and css just render value get changed


// app.get("/:customListName",(req,res)=>{

//     const requesTitle =  _.capitalize(req.params.customListName)


//     List.findOne({name:requesTitle},(err,foundList)=>
//     {
//         if(!err)
//         {
//              if(!foundList)
//             {

//                 //create a new list :
//                 const listItem =new List ({
//                     name: requesTitle,
//                     item:defaultItems
//              })

//                 listItem.save();
//                 res.redirect("/"+requesTitle)

//             }
//             else{
//                 // console.log(foundList) 

//                 res.render("list", { keyHead: foundList.name, listTitle: foundList.item })
//             }
//         }
    
//     }
    
//     )


// })


app.get("/:customListName", (req, res) => {
  const requestTitle = _.capitalize(req.params.customListName);

  List.findOne({ name: requestTitle })
    .then((foundList) => {
      if (!foundList) {
        // Create a new list
        const listItem = new List({
          name: requestTitle,
          item: defaultItems,
        });

        return listItem.save();
      } else {
        return foundList;
      }
    })
    .then((list) => {
      res.render("list", { keyHead: list.name, listTitle: list.item });
    })
    .catch((err) => {
      console.log(err);
    });
});


//////////////////////////////////////////////////////////

app.post("/newList",(req,res)=>{

           const createdList = req.body.createdList
           res.redirect("/"+createdList)

})


////////////////////////////////////////////////

app.get("/about",(req,res)=>{

    res.render("about")
})


app.listen("3000", () => {
    console.log("server is running at port 3000")
})

// console.log(dateMonthYear.getsDay())

// console.log(dateMonthYear.getsDate())

// const taskItems = []

// const workItem=[]




// app.get("/", (req, res) => {

    // res.send("hello")
    // const day = d.getDay()  // js inbuilt date method 
    // const dayArray=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]

    // // this line use to pass constiable from server to template file, nd display ejs or template file on browser 
    // res.render("list",{keyDay:dayArray[day]})  //keyDay is a marker in a template file(i.e list.ejs)  which contain html code
    //                                         //& it's value passed as a key value pair

    /*                                                      

    // using switch -case method
    const today="";

    switch(day)
    {
        case 0:
            {
            today="sunday"
            break
            }
            case 1:
        {
    today="Monday"
    break
    }
    case 2:
    {
    today="Tuesday"
    break
     }
     case 3:
    {
   today="Wednesday"
     break
     }
        case 4:
       {
        today="Thursday"
          break
   }
   case 5:
    {
    today="Friday"
    break
    }
    case 6:
        {
        today="Saturday"
        break
        }
        
        default:
            console.log("something wrong !")
    }
    
    res.render("list",{keyDay:today})
*/


// app.post("/", (req, res) => {

//     console.log( req.body)
//     const itemName = req.body.newItem


//     const item_new = new Item(
//         {
//             name:itemName
//         }
//     )

//             item_new.save()
//             res.redirect("/")



    // if (req.body.list==="work")
    // {
    //     workItem.push(item)
    //     res.redirect("/work")
    // }

    // else
    // {
    //     taskItems.push(item)
    //     res.redirect("/")
    // }
    

// })