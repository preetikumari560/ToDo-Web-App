const express = require('express')

const bodyParser = require('body-parser')

const dateMonthYear = require(__dirname+"/date.js") // requiring a created inbuilt module

// console.log(dateMonthYear.getsDay())

// console.log(dateMonthYear.getsDate())

const taskItems = []

const workItem=[]

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"))



// when use try to access home route i.e,"/", "hello" will  print
app.get("/", (req, res) => {

    // res.send("hello")

     

    // const date= dateMonthYear.getsDay() // accessing inbuilt created module (date.js) function
    const date= dateMonthYear.getsDate()
    
    res.render("list", { keyHead: date, listTitle: taskItems })

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
})

app.post("/", (req, res) => {

    console.log( req.body)
    const item = req.body.newItem

    if (req.body.list==="work")
    {
        workItem.push(item)
        res.redirect("/work")
    }

    else
    {
        taskItems.push(item)
        res.redirect("/")
    }
    

})

// localhost:3000/work ,another template page by sharing same html and css just render value get changed

// it's post function is included inside "/" home route post method
app.get("/work",(req,res)=>{
    res.render("list",{keyHead: "work title",listTitle: workItem})

})

app.get("/about",(req,res)=>{

    res.render("about")
})


app.listen("3000", () => {
    console.log("server is running at port 4000")
})
