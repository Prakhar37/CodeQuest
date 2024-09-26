// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//     username: {type:String, required: true,unique:true},
//     email: {type:String, required: true,unique:true},
//     password: {type:String, required: true},
//     solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }], // Track solved problems
//     solvedAt: [{ type: Date }],
//     score: { type: Number, default: 0 } // User score

// }, { timestamps: true });

// const UserModel = mongoose.model("User",UserSchema)

// export {UserModel as User}




import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    solvedProblems: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Problem'  // This will reference the Problem model
    }], 
    solvedAt: [{ 
        type: Date  // Array to track when each problem was solved
    }],
    score: { 
        type: Number, 
        default: 0  // Default score starts at 0
    }
}, { timestamps: true });  // Automatically adds createdAt and updatedAt timestamps

const UserModel = mongoose.model("User", UserSchema);

export { UserModel as User };
