import mongoose from "mongoose";

//first we create a schema
const noteSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required: true
        },
        content:{
            type:String,
            required:true
        }
    },
    {timestamps: true} //Mongo will automatically add the created date and the modified dates
)

//then we create a model made from the schema above (noteSchema)
const Note = mongoose.model("Note",noteSchema)

export default Note