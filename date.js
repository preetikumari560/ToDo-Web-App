// a inbuilt module created to export its function/variable to another file by requiring it

console.log(module)
console.log(module.exports)


exports.getsDate = function ()   
{
    const d = new Date  // Date is a javascript object  which has number of properties & method

    const options = {
        weekday: "long",
        month: "long",
        day: "numeric"
    }
    return d.toLocaleDateString("en-US", options)
     
}


exports.getsDay= function()
{
    const d = new Date  // Date is a javascript object  which has number of properties & method

    const options = {
        weekday: "long",
      
    }
    return d.toLocaleDateString("en-US", options)
     
}

