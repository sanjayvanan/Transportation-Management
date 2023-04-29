const mongoose= require("mongoose")

const rfqSchema = new mongoose.Schema({

    company_name:{
        type:String,
        default:""
    },
    company_location:{
        type:String,
        default:""
    },
    dest_company:{
        type:String,
        default:""
    },
    contain:{
        type:String,
        default:""
    },
    Valofgoods:{
        type:String,
        default:""
    },
    weight:{
        type: String,
        default:""
        
    },
    orgin:{
        type: String,
        default:""
        
    },
    orgin_pincode:{
        type:String,
        default:""

    },
    destination:{
        type: String,
        default:""
        
    },
    destination_pincode:{
        type:String,
        default:""
    },
    message:{
        type: String,
        default:""
        
    },
    isDeclined:{
        type:Boolean,
        default:false
    }
})

const RFQ=mongoose.model("rfq",rfqSchema);

module.exports=RFQ;