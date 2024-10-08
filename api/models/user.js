// structure of user model 

const mongoose=require("mongoose") 

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    verified:{
        type:Boolean,
        default:false,
    },
    verificationToken:String,
    addresses:[
        {
            name:String,
            mobileNo:String,
            houseNo:String,
            street:String,
            landmark:String,
            city:String, 
            country:String,
            postalCode:String

        }
    ], 

    // It tells Mongoose that the ObjectIds stored here refer to documents in the "Order" collection.
    orders:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Order"
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
}) 

const User=mongoose.model("User",userSchema);

module.exports=User