const Top5List = require('../models/top5list-model');
const User = require('../models/user-model');
const LikeList = require('../models/like-model');

createTop5List = (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }

    const top5List = new Top5List(body);
    console.log("creating top5List: " + JSON.stringify(top5List));
    if (!top5List) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }

    // REMEMBER THAT OUR AUTH MIDDLEWARE GAVE THE userId TO THE req
    console.log("top5List created for " + req.userId);
    User.findOne({ _id: req.userId }, (err, user) => {
        console.log("user found: " + JSON.stringify(user));
        user.top5Lists.push(top5List._id);
        user
            .save()
            .then(() => {
                top5List
                    .save()
                    .then(() => {
                        return res.status(201).json({
                            top5List: top5List
                        })
                    })
                    .catch(error => {
                        return res.status(400).json({
                            errorMessage: 'Top 5 List Not Created!'
                        })
                    })
            });
    })
}
deleteTop5List = async (req, res) => {
    console.log("delete Top 5 List with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    Top5List.findById({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Top 5 List not found!',
            })
        }

        if (!top5List.published) {

            // DOES THIS LIST BELONG TO THIS USER?
            async function asyncFindUser(list) {
                User.findOne({ email: list.ownerEmail }, (err, user) => {
                    console.log("user._id: " + user._id);
                    console.log("req.userId: " + req.userId);
                    if (user._id == req.userId) {
                        console.log("correct user!");
                        Top5List.findOneAndDelete({ _id: req.params.id }, () => {
                            return res.status(200).json({});
                        }).catch(err => console.log(err))
                    }
                    else {
                        console.log("incorrect user!");
                        return res.status(400).json({ 
                            errorMessage: "authentication error" 
                        });
                    }
                });
            }
            asyncFindUser(top5List);

        }
        else {

            async function asyncFindCommList(top5List) {
                console.log('top5List.name: ' + top5List.name);
        
                await Top5List.findOne({ name: top5List.name, communityList: true }, (err, top5ListComm) => {
                    if (err) {
                        console.log('find commList error');
                    }
                    else {
                        console.log('find commList no error');
                        console.log('2 commList found: ' + JSON.stringify(top5ListComm));
                    }

                    if(top5ListComm) {
                        
                        console.log('community list exist');
                        for(let i = 0; i < top5List.items.length; i++) {
                            console.log('i ' + top5List.items[i]); 

                            for(let j = 0; j < top5ListComm.communityItems.length; j++) {
                                console.log('j ' + top5ListComm.communityItems[j].itemName);  
        
                                if (top5List.items[i] == top5ListComm.communityItems[j].itemName) {
                                    top5ListComm.communityItems[j].score = top5ListComm.communityItems[j].score - (5-i);   
                                }
                            }                                    
                        }   
        
                        top5ListComm.communityItems.sort((listA, listB) => {
                            if(listA.score > listB.score) {
                                return -1;
                            } 
                            else if(listA.score === listB.score) {
                                return 0;
                            }
                            else {
                                return 1;
                            }
                        });
        
                        console.log(top5ListComm.communityItems[0].itemName);
                        console.log(top5ListComm.communityItems[1].itemName);
                        console.log(top5ListComm.communityItems[2].itemName);
                        console.log(top5ListComm.communityItems[3].itemName);
                        console.log(top5ListComm.communityItems[4].itemName);
                        
                        if(top5ListComm.communityItems[0].score != 0) {      
                            top5ListComm.items = [top5ListComm.communityItems[0].itemName, 
                                                top5ListComm.communityItems[1].itemName,
                                                top5ListComm.communityItems[2].itemName,
                                                top5ListComm.communityItems[3].itemName,
                                                top5ListComm.communityItems[4].itemName];
                        } else {
                            top5ListComm.items = ["", 
                                                "",
                                                "",
                                                "",
                                                ""];                   
                        }
                        
               
                        //console.log(top5ListComm.items[0]);
                        //console.log(top5ListComm.items[1]);
                        //console.log(top5ListComm.items[2]);
                        //console.log(top5ListComm.items[3]);
                        //console.log(top5ListComm.items[4]);
        
                        //top5ListComm.items.push('test');       
                    }    

            // DOES THIS LIST BELONG TO THIS USER?
            async function asyncFindUser(list) {
                User.findOne({ email: list.ownerEmail }, (err, user) => {
                    console.log("user._id: " + user._id);
                    console.log("req.userId: " + req.userId);
                    if (user._id == req.userId) {
                        console.log("correct user!");
                        
                        //Top5List.findOneAndDelete({ _id: req.params.id }, () => {
                        //    return res.status(200).json({});
                        //}).catch(err => console.log(err))
                        
                        top5ListComm.save()
                                        .then(() => {

                        Top5List.findOneAndDelete({ _id: req.params.id }, () => {
                            return res.status(200).json({});
                        }).catch(err => console.log(err))

                        })

                    }
                    else {
                        console.log("incorrect user!");
                        return res.status(400).json({ 
                            errorMessage: "authentication error" 
                        });
                    }
                });
            }
            asyncFindUser(top5List);

                });
            }
            asyncFindCommList(top5List);

        }

    })
}

getTop5ListById = async (req, res) => {
    console.log("Find Top 5 List with id: " + JSON.stringify(req.params.id));

    await Top5List.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        console.log("Found list: " + JSON.stringify(list));

        // >> modified 120221
        if (!list.communityList) {
            // DOES THIS LIST BELONG TO THIS USER?
            async function asyncFindUser(list) {
                await User.findOne({ email: list.ownerEmail }, (err, user) => {
                    console.log("user._id: " + user._id);
                    console.log("req.userId: " + req.userId);
                    if (user._id == req.userId) {
                        console.log("correct user!");
                        return res.status(200).json({ success: true, top5List: list })
                    }
                    else {
                        console.log("incorrect user!");
                        return res.status(400).json({ success: false, description: "authentication error" });
                    }
                });
            }
            asyncFindUser(list);
        }
        // << modified 120221
    }).catch(err => console.log(err))
}

getTop5ListPairs = async (req, res) => {
    //console.log("getTop5ListPairs");
    const body = req.body;
    console.log("getTop5ListPairs: " + JSON.stringify(body));
    console.log("req.body.filteredString, req.body.sortedString: " + req.body.ownerEmail + '*' + req.body.communityList + '*' + req.body.nameSearch + '*' + req.body.sorting + '*' + req.body.published);

    //let filteredString = 'ownerEmail: "h@i.com", communityList:false, name: {$regex: /^U/i}';
    //let ownerEmailStr = "h@i.com";
    //let communityListStr = false;
    //let nameFind = 'U';
    //console.log("nameFind: " + nameFind);
    //let filteredString = req.body.filteredString;

    //let sortStr = '{publishedDate: 1}';
    //let sortStr1 = {publishedDate: -1};

    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindList(email) {
            console.log("find all Top5Lists owned by " + email);
            //await Top5List.find({ ownerEmail: email }, (err, top5Lists) => {
            //await Top5List.find({ ownerEmail: email }, (err, top5Lists) => {

            //ownerEmail: req.body.ownerEmail,
            
            await Top5List.find({ 
                                ownerEmail: req.body.ownerEmail,
                                communityList: req.body.communityList, 
                                name: new RegExp('^'+req.body.nameSearch,'i')}, (err, top5Lists) => {    
            //await Top5List.find({filteredString}, (err, top5Lists) => {
                console.log("found Top5Lists: " + JSON.stringify(top5Lists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!top5Lists) {
                    console.log("!top5Lists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Top 5 Lists not found' })
                }
                else {
                    console.log("Send the Top5List pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let pairs = [];
                    let like = false;
                    for (let key in top5Lists) {
                        let list = top5Lists[key];
                        // >> modified
                        //let pair = {
                        //    _id: list._id,
                        //    name: list.name
                        //};
                        
                        // >> modified                   

                        /*
                        async function asyncFindLike(list, email, like) { 
                            try {  
                               
                              const existingLike = await LikeList.findOne({ top5listid: list._id,  Email: email, like: true});
                              if (existingLike) {
                                list.like = true;
                                //console.log('like true');
                              }
                              else {
                                list.like = false;     
                                //console.log('like false');     
                              }
                             
                              const existingDisLike = await LikeList.findOne({ top5listid: list._id,  Email: email, like: false});
                              if (existingDisLike) {
                                list.dislike = true;
                                //console.log('dislike true');
                              }
                              else {
                                list.dislike = false; 
                                //console.log('dislike false');     
                             } 

                             //let pair = {
                             //   _id: list._id,
                             //   top5List: list
                             //};
                             //pairs.push(pair);

                            } catch (err) {
                                console.error(err);
                                res.status(500).send();
                            }                            
                        }
                        asyncFindLike(list,email,like);
                        */

                        //const existingDisLike = LikeList.findOne({ top5listid: list._id,  Email: email, like: false});
                        //list.dislike = true; 

                        //console.log('getTop5ListPairs: ' + list._id + '*' + email + '*' + list.like + '*' + list.dislike);                                              

                        let pair = {
                            _id: list._id,
                            top5List: list
                        };
                        
                        pairs.push(pair);
                        // << modified
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).sort(req.body.sorting).catch(err => console.log(err))
        }
        asyncFindList(user.email);
    }).catch(err => console.log(err))
}

getTop5ListPairsAll = async (req, res) => {
    //console.log("getTop5ListPairs");
    const body = req.body;
    console.log("getTop5ListPairsAll: " + JSON.stringify(body));
    console.log("req.body.filteredString, req.body.sortedString: " + req.body.ownerEmail + '*' + req.body.communityList + '*' + req.body.nameSearch + '*' + req.body.sorting + '*' + req.body.published);

    //let filteredString = 'ownerEmail: "h@i.com", communityList:false, name: {$regex: /^U/i}';
    //let ownerEmailStr = "h@i.com";
    //let communityListStr = false;
    //let nameFind = 'U';
    //console.log("nameFind: " + nameFind);
    //let filteredString = req.body.filteredString;

    //let sortStr = '{publishedDate: 1}';
    //let sortStr1 = {publishedDate: -1};

    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindList() {
            //console.log("find all Top5Lists owned by " + email);
            //await Top5List.find({ ownerEmail: email }, (err, top5Lists) => {
            //await Top5List.find({ ownerEmail: email }, (err, top5Lists) => {

            //ownerEmail: req.body.ownerEmail,
            await Top5List.find({ 
                                published: req.body.published,
                                communityList: req.body.communityList, 
                                name: new RegExp('^'+req.body.nameSearch,'i')}, (err, top5Lists) => {    
            //await Top5List.find({filteredString}, (err, top5Lists) => {
                console.log("found Top5Lists: " + JSON.stringify(top5Lists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!top5Lists) {
                    console.log("!top5Lists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Top 5 Lists not found' })
                }
                else {
                    console.log("Send the Top5List pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let pairs = [];
                    for (let key in top5Lists) {
                        let list = top5Lists[key];
                        // >> modified
                        //let pair = {
                        //    _id: list._id,
                        //    name: list.name
                        //};
                        let pair = {
                            _id: list._id,
                            top5List: list
                        };
                        // << modified
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).sort(req.body.sorting).catch(err => console.log(err))
        }
        asyncFindList();
    }).catch(err => console.log(err))
}

getTop5ListPairsUser = async (req, res) => {
    //console.log("getTop5ListPairs");
    const body = req.body;
    console.log("getTop5ListPairsUser: " + JSON.stringify(body));
    console.log("req.body.filteredString, req.body.sortedString: " + req.body.ownerEmail + '*' + req.body.communityList + '*' + req.body.nameSearch + '*' + req.body.sorting + '*' + req.body.published);

    //let filteredString = 'ownerEmail: "h@i.com", communityList:false, name: {$regex: /^U/i}';
    //let ownerEmailStr = "h@i.com";
    //let communityListStr = false;
    //let nameFind = 'U';
    //console.log("nameFind: " + nameFind);
    //let filteredString = req.body.filteredString;

    //let sortStr = '{publishedDate: 1}';
    //let sortStr1 = {publishedDate: -1};

    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindList() {
            //console.log("find all Top5Lists owned by " + email);
            //await Top5List.find({ ownerEmail: email }, (err, top5Lists) => {
            //await Top5List.find({ ownerEmail: email }, (err, top5Lists) => {

            //ownerEmail: req.body.ownerEmail,
            await Top5List.find({ 
                                published: req.body.published,
                                communityList: req.body.communityList, 
                                userName: new RegExp('^'+req.body.nameSearch,'i')}, (err, top5Lists) => {    
            //await Top5List.find({filteredString}, (err, top5Lists) => {
                console.log("found Top5Lists: " + JSON.stringify(top5Lists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!top5Lists) {
                    console.log("!top5Lists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Top 5 Lists not found' })
                }
                else {
                    console.log("Send the Top5List pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let pairs = [];
                    for (let key in top5Lists) {
                        let list = top5Lists[key];
                        // >> modified
                        //let pair = {
                        //    _id: list._id,
                        //    name: list.name
                        //};
                        let pair = {
                            _id: list._id,
                            top5List: list
                        };
                        // << modified
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).sort(req.body.sorting).catch(err => console.log(err))
        }
        asyncFindList();
    }).catch(err => console.log(err))
}

getTop5ListPairsComm = async (req, res) => {
    //console.log("getTop5ListPairs");
    const body = req.body;
    console.log("getTop5ListPairsComm: " + JSON.stringify(body));
    console.log("req.body.filteredString, req.body.sortedString: " + req.body.ownerEmail + '*' + req.body.communityList + '*' + req.body.nameSearch + '*' + req.body.sorting + '*' + req.body.published);

    //let filteredString = 'ownerEmail: "h@i.com", communityList:false, name: {$regex: /^U/i}';
    //let ownerEmailStr = "h@i.com";
    //let communityListStr = false;
    //let nameFind = 'U';
    //console.log("nameFind: " + nameFind);
    //let filteredString = req.body.filteredString;

    //let sortStr = '{publishedDate: 1}';
    //let sortStr1 = {publishedDate: -1};

    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindList() {
            //console.log("find all Top5Lists owned by " + email);
            //await Top5List.find({ ownerEmail: email }, (err, top5Lists) => {
            //await Top5List.find({ ownerEmail: email }, (err, top5Lists) => {

            //ownerEmail: req.body.ownerEmail,
            await Top5List.find({ 
                                communityList: req.body.communityList, 
                                name: new RegExp('^'+req.body.nameSearch,'i')}, (err, top5Lists) => {    
            //await Top5List.find({filteredString}, (err, top5Lists) => {
                console.log("found Top5Lists: " + JSON.stringify(top5Lists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!top5Lists) {
                    console.log("!top5Lists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Top 5 Lists not found' })
                }
                else {
                    console.log("Send the Top5List pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let pairs = [];
                    for (let key in top5Lists) {
                        let list = top5Lists[key];
                        // >> modified
                        //let pair = {
                        //    _id: list._id,
                        //    name: list.name
                        //};
                        let pair = {
                            _id: list._id,
                            top5List: list
                        };
                        // << modified
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).sort(req.body.sorting).catch(err => console.log(err))
        }
        asyncFindList();
    }).catch(err => console.log(err))
}

getTop5Lists = async (req, res) => {
    await Top5List.find({}, (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!top5Lists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Top 5 Lists not found` })
        }
        return res.status(200).json({ success: true, data: top5Lists })
    }).catch(err => console.log(err))
}

updateTop5List = async (req, res) => {
    const body = req.body
    console.log("updateTop5List: " + JSON.stringify(body));
    console.log("req.body.name, req.body.items: " + req.body.name + ", " + req.body.items);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }

        async function asyncFindTop5List(top5List) {
            console.log('asyncFindTop5List top5List.name: ' + body.top5List.name);
    
            /*await Top5List.findOne({ name: body.top5List.name,  ownerEmail: body.top5List.ownerEmail, published: true}, (err, top5ListDup) => {
                if (top5ListDup) {
                    console.log('duplicated list name');
                    return res.status(404).json({
                        err,
                        message: 'The same List name is being used!',
                    })
                }*/

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    console.log("req.body.name, req.body.items: " + req.body.name + ", " + req.body.items);

                    list.name = body.top5List.name;
                    list.items = body.top5List.items;
                    //list.published = body.top5List.published;
                    //list.publishedDate = body.top5List.publishedDate;
                    list
                        .save()
                        .then(() => {
                            console.log("SUCCESS!!!");
                            return res.status(200).json({
                                success: true,
                                id: list._id,
                                message: 'Top 5 List updated!',
                            })
                        })
                        .catch(error => {
                            console.log("FAILURE: " + JSON.stringify(error));
                            return res.status(404).json({
                                error,
                                message: 'Top 5 List not updated!',
                            })
                        })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(top5List);

            //});
        }
        asyncFindTop5List(top5List);
    })
}

publishTop5ListById = async (req, res) => {
    const body = req.body
    console.log("publishTop5List: " + JSON.stringify(body));
    console.log("req.body.name, req.body.items: " + body.top5List.name + ", " + body.top5List.items);

    // >> modified 120221
    if (body.top5List.name == '' ||
        body.top5List.items[0] == '' ||
        body.top5List.items[1] == '' ||
        body.top5List.items[2] == '' ||
        body.top5List.items[3] == '' ||
        body.top5List.items[4] == '') {
        console.log("Please fill All List name and Item Names.");
           
        return res
        .status(404)
        .json({
            errorMessage: "Missing list name / item name(s)."
        })           
    }
    
    const listInsensitive = [];
    listInsensitive[0] = (body.top5List.items[0] + "").toUpperCase();
    listInsensitive[1] = (body.top5List.items[1] + "").toUpperCase();
    listInsensitive[2] = (body.top5List.items[2] + "").toUpperCase();
    listInsensitive[3] = (body.top5List.items[3] + "").toUpperCase();
    listInsensitive[4] = (body.top5List.items[4] + "").toUpperCase();
    
    const listWithoutDups = new Set(listInsensitive);
    if (listWithoutDups.size != body.top5List.items.length) {
        return res
        .status(404)
        .json({
            errorMessage: "Item names cannot be repeated."
        })  
    }
     // << modified 120221 idNamePair.top5List.dislikeList.indexOf(auth.user.email) < 0
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }
        
        async function asyncFindTop5List(top5List) {
        console.log('asyncFindTop5List top5List.name: ' + body.top5List.name);

        await Top5List.findOne({ name: {$regex: body.top5List.name, $options: 'i'},  ownerEmail: body.top5List.ownerEmail, published: true}, (err, top5ListDup) => {
            // >> modified 120221
            if (top5ListDup) {
                console.log('duplicated list name');
                return res.status(404).json({
                    errorMessage: 'You have a list with that name already.'
                })
            }
            // << modified 120221

async function asyncFindCommList(top5List) {
    console.log('top5List.name: ' + body.top5List.name);
    await Top5List.findOne({ name: {$regex: body.top5List.name, $options: 'i'}, communityList: true }, (err, top5ListComm) => {
        if (err) {
            console.log('find commList error');
        }
        else {
            console.log('find commList no error');
            console.log('2 commList found: ' + JSON.stringify(top5ListComm));
        }

        if(!top5ListComm) {
            console.log('community list not exist');
            top5ListComm = new Top5List({name: body.top5List.name, 
                communityItems: [{itemName: body.top5List.items[0], score: 5},
                                    {itemName: body.top5List.items[1], score: 4},
                                    {itemName: body.top5List.items[2], score: 3},
                                    {itemName: body.top5List.items[3], score: 2},
                                    {itemName: body.top5List.items[4], score: 1}],
                                    items: [body.top5List.items[0],body.top5List.items[1],body.top5List.items[2],body.top5List.items[3],body.top5List.items[4]],
                                    communityList: true,
                                    likeCount: 0,
                                    dislikeCount: 0,
                                    viewCount: 0,
                                    updatedDate: new Date()

            });
        } else {
            console.log('community list exist');
            for(let i = 0; i < body.top5List.items.length; i++) {
                console.log('i ' + body.top5List.items[i]); 
                let found = false;
                for(let j = 0; j < top5ListComm.communityItems.length; j++) {
                    console.log('j ' + top5ListComm.communityItems[j].itemName);  

                    if (body.top5List.items[i] == top5ListComm.communityItems[j].itemName) {
                        top5ListComm.communityItems[j].score = top5ListComm.communityItems[j].score + (5-i);  
                        found = true;  
                    }
                }         
                
                if (!found) {
                    top5ListComm.communityItems.push({itemName: body.top5List.items[i], score: (5-i)});
                }
            }   

            top5ListComm.communityItems.sort((listA, listB) => {
                if(listA.score > listB.score) {
                    return -1;
                } 
                else if(listA.score === listB.score) {
                    // >> modified 120221
                    if(listA.itemName < listB.itemName) {
                        return -1;
                    }
                    else if(listA.itemName > listB.itemName) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                    // << modified 120221
                }
                else {
                    return 1;
                }
            });

            console.log(top5ListComm.communityItems[0].itemName);
            console.log(top5ListComm.communityItems[1].itemName);
            console.log(top5ListComm.communityItems[2].itemName);
            console.log(top5ListComm.communityItems[3].itemName);
            console.log(top5ListComm.communityItems[4].itemName);
            /*
            top5ListComm.items[0] = top5ListComm.communityItems[0].itemName;
            top5ListComm.items[1] = top5ListComm.communityItems[1].itemName;
            top5ListComm.items[2] = top5ListComm.communityItems[2].itemName;
            top5ListComm.items[3] = top5ListComm.communityItems[3].itemName;
            top5ListComm.items[4] = top5ListComm.communityItems[4].itemName;
            */

            
            top5ListComm.items = [top5ListComm.communityItems[0].itemName, 
                                    top5ListComm.communityItems[1].itemName,
                                    top5ListComm.communityItems[2].itemName,
                                    top5ListComm.communityItems[3].itemName,
                                    top5ListComm.communityItems[4].itemName]
            
            top5ListComm.updatedDate = new Date();

            //console.log(top5ListComm.items[0]);
            //console.log(top5ListComm.items[1]);
            //console.log(top5ListComm.items[2]);
            //console.log(top5ListComm.items[3]);
            //console.log(top5ListComm.items[4]);

            //top5ListComm.items.push('test');
    }

    // DOES THIS LIST BELONG TO THIS USER?
    async function asyncFindUser(list) {
        await User.findOne({ email: list.ownerEmail }, (err, user) => {
            console.log("user._id: " + user._id);
            console.log("req.userId: " + req.userId);
            if (user._id == req.userId) {
                console.log("correct user!");
                console.log("req.body.name, req.body.items: " + req.body.name + ", " + req.body.items);

                list.name = body.top5List.name;
                list.items = body.top5List.items;
                list.published = true;
                list.publishedDate = new Date();
                //list.published = body.top5List.published;
                //list.publishedDate = body.top5List.publishedDate;
                list
                    .save()
                    .then(() => {
                        //console.log(top5ListComm.items[0]);
                        //console.log(top5ListComm.items[1]);
                        //console.log(top5ListComm.items[2]);
                        //console.log(top5ListComm.items[3]);
                        //console.log(top5ListComm.items[4]);

                        top5ListComm.save()
                                    .then(() => {    
                                    console.log("SUCCESS!!!");
                                    return res.status(200).json({
                                        success: true,
                                        id: list._id,
                                        message: 'Top 5 List updated!',
                                    })

                                })
                                .catch(error => {
                                    console.log("FAILURE: " + JSON.stringify(error));
                                    return res.status(404).json({
                                        error,
                                        message: 'Top 5 List not updated!',
                                    })
                                })
                            })
            }
            else {
                console.log("incorrect user!");
                return res.status(400).json({ success: false, description: "authentication error" });
            }
        });
    }
    asyncFindUser(top5List);

    });
    }
    asyncFindCommList(top5List);

    });
    }
    asyncFindTop5List(top5List);

    })
}


LikeTop5ListById = async (req, res) => {
    console.log("Like List");

    console.log("Like List id: " + JSON.stringify(req.params.id));
    console.log("Top5List id " + req.params.id);
    Top5List.findById({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Top 5 List not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            //User.findOne({ email: list.ownerEmail }, (err, user) => {
            User.findOne({ _id: req.userId }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user! " + user.email);

                    //user.likeList.push(req.params.id);
                    top5List.likeCount = top5List.likeCount + 1;
                    top5List.likeList.push(user.email);
                    user
                        .save()
                        .then(() => {
                            top5List
                                .save()
                                .then(() => {
                                    return res.status(200).json({
                                        top5List: top5List
                                    })
                                })
                                .catch(error => {
                                    return res.status(400).json({
                                        errorMessage: 'Top 5 List Not Created!'
                                    })
                                })
                        });                 
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ 
                        errorMessage: "authentication error" 
                    });
                }
            });
        }
        asyncFindUser(top5List);
    })   
}

UndoLikeTop5ListById = async (req, res) => {
    console.log("UndoLike List");

    console.log("Like List id: " + JSON.stringify(req.params.id));
    console.log("Top5List id " + req.params.id);
    Top5List.findById({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Top 5 List not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            //User.findOne({ email: list.ownerEmail }, (err, user) => {
            User.findOne({ _id: req.userId }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user! " + user.email);

                    //user.likeList.push(req.params.id);
                    top5List.likeCount = top5List.likeCount - 1;
                    
                    let idx = top5List.likeList.indexOf(user.email);
                    if (idx >= 0) {
                        top5List.likeList.splice(idx,1);
                    }
                    user
                        .save()
                        .then(() => {
                            top5List
                                .save()
                                .then(() => {
                                    return res.status(200).json({
                                        top5List: top5List
                                    })
                                })
                                .catch(error => {
                                    return res.status(400).json({
                                        errorMessage: 'Top 5 List Not Created!'
                                    })
                                })
                        });                 
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ 
                        errorMessage: "authentication error" 
                    });
                }
            });
        }
        asyncFindUser(top5List);
    })   
}

DislikeTop5ListById = async (req, res) => {
    console.log("Disike List");

    console.log("Like List id: " + JSON.stringify(req.params.id));
    console.log("Top5List id " + req.params.id);
    Top5List.findById({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Top 5 List not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            //User.findOne({ email: list.ownerEmail }, (err, user) => {
            User.findOne({ _id: req.userId }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user! " + user.email);

                    //user.likeList.push(req.params.id);
                    top5List.dislikeCount = top5List.dislikeCount + 1;
                    top5List.dislikeList.push(user.email);
                    user
                        .save()
                        .then(() => {
                            top5List
                                .save()
                                .then(() => {
                                    return res.status(200).json({
                                        top5List: top5List
                                    })
                                })
                                .catch(error => {
                                    return res.status(400).json({
                                        errorMessage: 'Top 5 List Not Created!'
                                    })
                                })
                        });                 
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ 
                        errorMessage: "authentication error" 
                    });
                }
            });
        }
        asyncFindUser(top5List);
    })   
}

UndoDislikeTop5ListById = async (req, res) => {
    console.log("UndoDisLike List");

    console.log("Like List id: " + JSON.stringify(req.params.id));
    console.log("Top5List id " + req.params.id);
    Top5List.findById({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Top 5 List not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            //User.findOne({ email: list.ownerEmail }, (err, user) => {
            User.findOne({ _id: req.userId }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user! " + user.email);

                    //user.likeList.push(req.params.id);
                    top5List.dislikeCount = top5List.dislikeCount - 1;
                    
                    let idx = top5List.dislikeList.indexOf(user.email);
                    if (idx >= 0) {
                        top5List.dislikeList.splice(idx,1);
                    }
                    user
                        .save()
                        .then(() => {
                            top5List
                                .save()
                                .then(() => {
                                    return res.status(200).json({
                                        top5List: top5List
                                    })
                                })
                                .catch(error => {
                                    return res.status(400).json({
                                        errorMessage: 'Top 5 List Not Created!'
                                    })
                                })
                        });                 
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ 
                        errorMessage: "authentication error" 
                    });
                }
            });
        }
        asyncFindUser(top5List);
    })   
}

addTop5ListCommentById = async (req, res) => {
    const body = req.body
    console.log("addTop5ListComment: " + JSON.stringify(body));
    console.log("req.body.commentText " + req.body.commentText);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ _id: req.userId }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    console.log("req.body.name, req.body.items: " + req.body.name + ", " + req.body.items);

                    //list.name = body.top5List.name;
                    //list.items = body.top5List.items;
                    //list.published = body.top5List.published;
                    //list.publishedDate = body.top5List.publishedDate;
                    //top5List.comment.push({commentText: req.body.commentText, userName: user.userName});
                    top5List.comment.splice(0,0,{commentText: req.body.commentText, userName: user.userName})
                    list
                        .save()
                        .then(() => {
                            console.log("SUCCESS!!!");
                            return res.status(200).json({
                                success: true,
                                id: list._id,
                                top5List: top5List,
                                message: 'Top 5 List updated!',
                            })
                        })
                        .catch(error => {
                            console.log("FAILURE: " + JSON.stringify(error));
                            return res.status(404).json({
                                error,
                                message: 'Top 5 List not updated!',
                            })
                        })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(top5List);
    })
    
}


AddTop5ListViewById = async (req, res) => {
    console.log("Add List View");

    console.log("Add List View id: " + JSON.stringify(req.params.id));
    console.log("Top5List id " + req.params.id);
    Top5List.findById({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Top 5 List not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {

            //User.findOne({ email: list.ownerEmail }, (err, user) => {
            // >> modified 120221
            //User.findOne({ _id: req.userId }, (err, user) => {
            //    console.log("user._id: " + user._id);
            //    console.log("req.userId: " + req.userId);
            //    if (user._id == req.userId) {
            //        console.log("correct user! " + user.email);

                    //user.likeList.push(req.params.id);

                    top5List.viewCount = top5List.viewCount + 1;

                    top5List
                                .save()
                                .then(() => {
                                    return res.status(200).json({
                                        top5List: top5List
                                    })
                                })
                                .catch(error => {
                                    return res.status(400).json({
                                        errorMessage: 'Top 5 List Not Created!'
                                    })
                                });
                    
                    //user
                    //    .save()
                    //    .then(() => {
                    //        top5List
                    //            .save()
                    //            .then(() => {
                    //                return res.status(200).json({
                    //                    top5List: top5List
                    //                })
                    //            })
                    //            .catch(error => {
                    //                return res.status(400).json({
                    //                    errorMessage: 'Top 5 List Not Created!'
                    //                })
                    //            })
                    //    });   
                                 
            //    }
            //    else {
            //        console.log("incorrect user!");
            //        return res.status(400).json({ 
            //            errorMessage: "authentication error" 
            //        });
            //    }
            //});
        }
        asyncFindUser(top5List);
    })   
}


module.exports = {
    createTop5List,
    deleteTop5List,
    getTop5ListById,
    getTop5ListPairs,
    getTop5Lists,
    updateTop5List,
    getTop5ListPairsAll,
    getTop5ListPairsUser,
    getTop5ListPairsComm,
    LikeTop5ListById,
    UndoLikeTop5ListById,
    DislikeTop5ListById,
    UndoDislikeTop5ListById,
    addTop5ListCommentById,
    AddTop5ListViewById,
    publishTop5ListById
}