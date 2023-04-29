const mongoose= require("mongoose")

const taskSchema = new mongoose.Schema({
    name:{
        type: String,
        default:""
        
    },
    email:{
        type: String,
        default:""
        
    },
    pnum:{
        type: String,
        default:""
        
    },
    company_name:{
        type:String,
        default:""
    },
    company_location:{
        type:String,
        default:""
    },
    weight:{
        type: String,
        default:""
        
    },
    from:{
        type: String,
        default:""
        
    },
    to:{
        type: String,
        default:""
        
    },
    message:{
        type: String,
        default:""
        
    },
})

const Service=mongoose.model("Service",taskSchema);

module.exports=Service;