const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LikeListSchema = new Schema(
    {
        top5listid: { type: String, required: true },
        Email: { type: String, required: true  },
        like: { type: Boolean, required: true }     
    },
    { timestamps: true },
)

module.exports = mongoose.model('LikeList', LikeListSchema)
