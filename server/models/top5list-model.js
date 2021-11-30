const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        ownerEmail: { type: String },
        userName: { type: String },
        published: { type: Boolean  },
        publishedDate: { type: Date  },
        like: { type: Boolean },
        likeList: { type: [String] },
        likeCount: { type: Number  },
        dislike: { type: Boolean  },
        dislikeList: { type: [String] },
        dislikeCount: { type: Number  },
        comment: [{ 
                    commentText: {type: String},
                    userName:  {type:String}
                 }],
        communityList: { type: Boolean  },
        viewCount: { type: Number  },
        communityItems: [{ 
                    itemName: {type: String},
                    score:  {type: Number}
                  }],
        updatedDate: { type: Date }     
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
