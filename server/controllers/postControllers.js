const Post = require('../models/postModel')
const User = require('../models/userModel')
const path = require('path')
const fs = require('fs')
const {v4:uuid} = require('uuid')
const HttpError = require('../models/errorModel')



// Create Post 
// POST : api/posts
// protected
const createPost = async (req, res, next) => {
    try {
        let { title, category, description } = req.body;
        if (!title || !category || !description || !req.files) {
            return next(new HttpError("Fill all the fields"));
        }
        const { thumbnail } = req.files;
        // check the file size
        if (thumbnail.size > 2000000) {
            return next(new HttpError("Thumbnail is too big. File should be less than 2mb"));
        }
        let fileName = thumbnail.name;  // Update this line
        let splittedFileName = fileName.split('.');
        let newFileName = splittedFileName[0] + uuid() + "." + splittedFileName[splittedFileName.length - 1];
        thumbnail.mv(path.join(__dirname, '..', '/uploads', newFileName), async (err) => {
            if (err) {
                return next(new HttpError(err));
            } else {
                const newPost = await Post.create({
                    title,
                    category,
                    description,
                    thumbnail: newFileName,
                    creator: req.user.id
                });
                if (!newPost) {
                    return next(new HttpError("Post could not be created.", 422));
                }
                // find the user and increase post count
                const currentUser = await User.findById(req.user.id);
                const userPostCount = currentUser.posts + 1;
                await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });

                res.status(201).json(newPost);
            }
        });
    } catch (error) {
        return next(new HttpError(error));
    }
};








// get single Post 
// GET : api/posts/:id
// unprotected
const getPosts = async(req , res , next) => {
    try {
        const posts = await Post.find().sort({updatedAt:-1})
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}

// Get Post 
// get : api/posts
// unprotected
const getPost = async(req , res , next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post){
            return next(new HttpError("Post not found" , 404))
        }
        res.status(200).json(post)
    } catch (error) {
        return next(new HttpError(error))
    }
}


// get post ny category 
// GET : api/posts/categories/:category
// protected
const getCatPosts = async(req , res , next) => {
    try {
        const {category} = req.params;
        const catPosts = await Post.find({category}).sort({createdAt:-1});
        res.status(200).json(catPosts);

    } catch (error) {
        return next(new HttpError(error))
    }
}



// get author post 
// GET : api/posts/users/:id
// unprotected
const getUserPosts = async(req , res , next) => {
   try {
     const {id} = req.params;
     const posts = await Post.find({creator: id}).sort({createdAt:-1})
     res.status(200).json(posts)
   } catch (error) {
        return next(new HttpError(error))
   }
}



// Edit Post 
// PATCH : api/posts
// protected
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

const editPost = async (req, res, next) => {
    try {
        let fileName;
        let newFileName;
        let updatedPost;
        const postId = req.params.id;
        let { title, category, description } = req.body;

        if (!title || !category || description.length < 12) {
            return next(new HttpError("Fill in all the fields.", 422));
        }

        if (!req.files) {
            updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description }, { new: true });
        } else {
            const oldPost = await Post.findById(postId);

            if(req.user.id == oldPost.creator){
                // Delete old thumbnail
            await unlinkAsync(path.join(__dirname, '..', 'uploads', oldPost.thumbnail));

            const { thumbnail } = req.files;

            if (thumbnail.size > 2000000) {
                return next(new HttpError("Thumbnail too big", 422));
            }

            fileName = thumbnail.name;
            let splittedFileName = fileName.split('.');

            newFileName = splittedFileName[0] + uuid() + '.' + splittedFileName[splittedFileName.length - 1];

            // Promisify thumbnail.mv
            const mvAsync = promisify(thumbnail.mv);

            await mvAsync(path.join(__dirname, '..', 'uploads', newFileName));

            updatedPost = await Post.findByIdAndUpdate(
                postId,
                { title, category, description, thumbnail: newFileName },
                { new: true });
        }}

        if (!updatedPost) {
            return next(new HttpError("Couldn't update post", 400));
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        return next(new HttpError(error));
    }
};


// Delete Post 
// DELETE : api/posts/:id
// protected
const deletePost = async(req , res , next) => {
    try {
        const postId = req.params.id;
        if(!postId){
            return next(new HttpError("post unavailable." , 400))
        }
        const post = await Post.findById(postId);
        const fileName = post?.thumbnail;
        // delete thumbnail from uploads folder
        if(req.user.id == post.creator){
        fs.unlink(path.join(__dirname , '..' , 'uploads' , fileName) , async(err) => {
            if(err){
                return next(new HttpError(err))
            }
            else{
                await Post.findByIdAndDelete(postId);
                // find user and reduce post count by 1
                const currentUser = await User.findById(req.user.id);
                const userPostCount = currentUser?.posts-1;
                await User.findByIdAndUpdate(req.user.id , {posts:userPostCount})
            }
            res.json(`Post ${postId} deleted successfully.`)
        })
    }
    else{
        return next(new HttpError("Post couldn't be deleted ." , 403))
    }
    } catch (error) {
        return next(new HttpError(error))
    }
}

module.exports = {createPost , getPosts , getPost , getCatPosts , getUserPosts , editPost , deletePost}

