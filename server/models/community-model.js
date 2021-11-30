const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CommunityListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: String, required: true },
        score: { type: Number  }
    },
    { timestamps: true },
)

module.exports = mongoose.model('CommunityList', CommunityListSchema)