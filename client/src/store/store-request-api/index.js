/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
export const createTop5List = (newListName, newItems, userEmail, userName, 
                                published, likeCount,
                                dislikeCount, communityList, 
                                viewCount) => {
    return api.post(`/top5list/`, {
        // SPECIFY THE PAYLOAD
        name: newListName,
        items: newItems,
        ownerEmail: userEmail,
        userName: userName,
        published: published,
        likeCount: likeCount,
        dislikeCount: dislikeCount,
        communityList: communityList,
        viewCount: viewCount
    })
}
export const deleteTop5ListById = (id) => api.delete(`/top5list/${id}`)
export const getTop5ListById = (id) => api.get(`/top5list/${id}`)
//export const getTop5ListPairs = () => api.get(`/top5listpairs/`)
export const getTop5ListPairs = (ownerEmail, communityList, nameSearch, sorting, published) => {
    return api.post(`/top5listpairs/`, {
        // SPECIFY THE PAYLOAD
        ownerEmail: ownerEmail,
        communityList: communityList,
        nameSearch: nameSearch,
        sorting: sorting,
        published: published
    })
}

export const getTop5ListPairsAll = (ownerEmail, communityList, nameSearch, sorting, published) => {
    return api.post(`/top5listpairsAll/`, {
        // SPECIFY THE PAYLOAD
        ownerEmail: ownerEmail,
        communityList: communityList,
        nameSearch: nameSearch,
        sorting: sorting,
        published: published
    })
}

export const getTop5ListPairsUser = (ownerEmail, communityList, nameSearch, sorting, published) => {
    return api.post(`/top5listpairsUser/`, {
        // SPECIFY THE PAYLOAD
        ownerEmail: ownerEmail,
        communityList: communityList,
        nameSearch: nameSearch,
        sorting: sorting,
        published: published
    })
}

export const getTop5ListPairsComm = (ownerEmail, communityList, nameSearch, sorting, published) => {
    return api.post(`/top5listpairsComm/`, {
        // SPECIFY THE PAYLOAD
        ownerEmail: ownerEmail,
        communityList: communityList,
        nameSearch: nameSearch,
        sorting: sorting,
        published: published
    })
}

export const updateTop5ListById = (id, top5List) => {
    return api.put(`/top5list/${id}`, {
        // SPECIFY THE PAYLOAD
        top5List : top5List
    })
}

export const publishTop5ListById = (id, top5List) => {
    return api.put(`/top5listPublish/${id}`, {
        // SPECIFY THE PAYLOAD
        top5List : top5List
    })
}

export const addTop5ListCommentById = (id, commentText) => {
    return api.put(`/top5listComment/${id}`, {
        // SPECIFY THE PAYLOAD
        commentText : commentText
    })
}


/*
export const LikeTop5ListById = (id, userEmail, like) => {
    return api.put(`/top5listLike/${id}`, {
        top5listid: id,
        Email: userEmail,
        like: like
    })
}
*/
export const LikeTop5ListById = (id) => api.get(`/top5listLike/${id}`)

export const UndoLikeTop5ListById = (id) => api.get(`/top5listUndoLike/${id}`)

export const DislikeTop5ListById = (id) => api.get(`/top5listDislike/${id}`)

export const UndoDislikeTop5ListById = (id) => api.get(`/top5listUndoDislike/${id}`)

export const addTop5ListViewById = (id) => api.get(`/top5listView/${id}`)

const apis = {
    createTop5List,
    deleteTop5ListById,
    getTop5ListById,
    getTop5ListPairs,
    updateTop5ListById,
    getTop5ListPairsAll,
    getTop5ListPairsUser,
    getTop5ListPairsComm,
    LikeTop5ListById,
    UndoLikeTop5ListById,
    DislikeTop5ListById,
    UndoDislikeTop5ListById,
    addTop5ListCommentById,
    addTop5ListViewById,
    publishTop5ListById
}

export default apis
