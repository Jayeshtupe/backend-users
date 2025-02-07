const { Double } = require("bson")
const mongoose = require("mongoose")
const { float } = require("webidl-conversions")

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publishedYear: {
        type: String,
        required: true
    } ,
    genre: [{
        type: String
    }],

    language: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    coverImageUrl: {
        type: String,
        required: true
    },
},

    {
        timestamps: true
    }
)

module.exports = mongoose.model("Book", bookSchema)