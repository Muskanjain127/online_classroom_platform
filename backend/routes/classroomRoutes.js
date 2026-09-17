const express = require('express');
const Classroom = require('../models/classroomModel');
const User = require('../models/userModel')
const Post = require('../models/postModel');
const ClassroomJoin = require('../models/classroomJoinModel');
const responseFunction = require('../utils/responseFunction');
const authTokenHandler = require('../middlewares/checkAuthToken');
const router = express.Router();
const nodemailer = require('nodemailer');

// Utility function to send email
const mailer = async (receiverEmail, code) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.COMPANY_EMAIL,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });

    let info = await transporter.sendMail({
        from: "Team MastersGang",
        to: receiverEmail,
        subject: "OTP for MastersGang",
        text: "Your OTP is " + code,
        html: "<b>Your OTP is " + code + "</b>",
    })
    console.log("Message sent: %s", info.messageId);
    return info.messageId ? true : false;
};

router.post('/create', authTokenHandler, async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return responseFunction(res, 400, 'Classroom name is required', null, false);
    }

    try {
        const newClassroom = new Classroom({
            name,
            description,
            owner: req.userId,
        });

        await newClassroom.save();
        return responseFunction(res, 201, 'Classroom created successfully', newClassroom, true);

    }
    catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }

})

router.get('/classroomscreatedbyme', authTokenHandler, async (req, res) => {
    try {
        const classrooms = await Classroom.find({ owner: req.userId }).sort({ createdAt: -1 });

        return responseFunction(res, 200, 'Classrooms fetched successfully', classrooms, true);
    } catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
})

router.get('/getclassbyid/:classid', authTokenHandler, async (req, res) => {
    const { classid } = req.params;

    try {
        const classroom = await Classroom.findById(classid).populate({
            path: 'posts',
            options: { sort: { createdAt: -1 } }
        });
        if (!classroom) {
            return responseFunction(res, 404, 'Classroom not found', null, false);
        }

        return responseFunction(res, 200, 'Classroom fetched successfully', classroom, true);
    }
    catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
})

router.post('/addpost', authTokenHandler, async (req, res) => {
    const { title, description, classId, type, dueDate } = req.body;
    if (!title || !description || !classId) {
        return responseFunction(res, 400, 'Title, description and classId are required', null, false);
    }
    try {
        const classroom = await Classroom.findById(classId);
        if (!classroom) {
            return responseFunction(res, 404, 'Classroom not found', null, false);
        }

        if (classroom.owner.toString() !== req.userId) {
            return responseFunction(res, 403, 'Only the classroom owner can post', null, false);
        }

        const newPost = new Post({
            title,
            description,
            classId,
            type: type === 'assignment' ? 'assignment' : 'announcement',
            dueDate: dueDate || undefined,
            createdBy: req.userId,
        });
        await newPost.save();

        classroom.posts.push(newPost._id);
        await classroom.save();

        return responseFunction(res, 201, 'Post created successfully', newPost, true);
    }
    catch (error) {
        return responseFunction(res, 500, 'Internal server error', error, false);
    }
})

// Delete a post - only the classroom owner (post creator) can delete
router.delete('/deletepost/:postId', authTokenHandler, async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return responseFunction(res, 404, 'Post not found', null, false);
        }
        if (post.createdBy.toString() !== req.userId) {
            return responseFunction(res, 403, 'Not allowed to delete this post', null, false);
        }

        await Classroom.findByIdAndUpdate(post.classId, { $pull: { posts: post._id } });
        await Post.findByIdAndDelete(postId);

        return responseFunction(res, 200, 'Post deleted successfully', null, true);
    }
    catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
})

// Delete an entire classroom - owner only
router.delete('/deleteclassroom/:classroomId', authTokenHandler, async (req, res) => {
    const { classroomId } = req.params;
    try {
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return responseFunction(res, 404, 'Classroom not found', null, false);
        }
        if (classroom.owner.toString() !== req.userId) {
            return responseFunction(res, 403, 'Only the owner can delete this classroom', null, false);
        }

        await Post.deleteMany({ classId: classroomId });
        await ClassroomJoin.deleteMany({ classroomId });
        await Classroom.findByIdAndDelete(classroomId);

        return responseFunction(res, 200, 'Classroom deleted successfully', null, true);
    }
    catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
})

// A student leaves a classroom they've joined
router.post('/leaveclassroom', authTokenHandler, async (req, res) => {
    const { classroomId } = req.body;
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return responseFunction(res, 404, 'User not found', null, false);
        }
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return responseFunction(res, 404, 'Classroom not found', null, false);
        }

        classroom.students = classroom.students.filter((email) => email !== user.email);
        await classroom.save();

        return responseFunction(res, 200, 'Left classroom successfully', null, true);
    }
    catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
})

// Dashboard stats for the logged-in user
router.get('/mystats', authTokenHandler, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return responseFunction(res, 404, 'User not found', null, false);
        }

        const createdClassrooms = await Classroom.find({ owner: req.userId });
        const joinedClassrooms = await Classroom.find({ students: user.email });

        const totalStudentsTaught = createdClassrooms.reduce(
            (sum, c) => sum + (c.students ? c.students.length : 0), 0
        );
        const totalPostsCreated = createdClassrooms.reduce(
            (sum, c) => sum + (c.posts ? c.posts.length : 0), 0
        );

        return responseFunction(res, 200, 'Stats fetched successfully', {
            classroomsCreated: createdClassrooms.length,
            classroomsJoined: joinedClassrooms.length,
            totalStudentsTaught,
            totalPostsCreated,
        }, true);
    }
    catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
})

router.get('/classrooms/search', async (req, res) => {
    try {
        const term = req.query.term;
        if (!term) {
            return responseFunction(res, 400, 'Search term is required', null, false);
        }

        const results = await Classroom.find({
            name: { $regex: new RegExp(term, 'i') }
        })

        if (results.length === 0) {
            return responseFunction(res, 404, 'Classroom not found', null, false);
        }
        responseFunction(res, 200, 'Search results', results, true);

    }
    catch (error) {
        console.error(error);
        responseFunction(res, 500, 'Internal server error', error, false);
    }

})

router.post('/request-to-join', async (req, res) => {
    const { classroomId, studentEmail } = req.body;

    if (!classroomId || !studentEmail) {
        return responseFunction(res, 400, 'Classroom ID and student email are required', null, false);
    }

    try {
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return responseFunction(res, 404, 'Classroom not found', null, false);
        }

        if (classroom.students.includes(studentEmail)) {
            return responseFunction(res, 400, 'You are already enrolled in this classroom', null, false);
        }

        const classOwnerId = classroom.owner;

        const classOwner = await User.findById(classOwnerId);
        if (!classOwner) {
            return responseFunction(res, 404, 'Class owner not found', null, false);
        }

        const classOwnerEmail = classOwner.email;

        const code = Math.floor(100000 + Math.random() * 900000);
        const isSent = await mailer(classOwnerEmail, code);
        if (!isSent) {
            return responseFunction(res, 500, 'Failed to send OTP', null, false);
        }
        const newClassroomJoin = new ClassroomJoin({
            classroomId,
            studentEmail,
            code,
            classOwnerEmail
        });
        await newClassroomJoin.save();
        return responseFunction(res, 200, 'OTP sent to the class owner', null, true);


    }
    catch (err) {
        console.log(err)
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
})

router.post('/verify-otp', authTokenHandler, async (req, res) => {
    const { classroomId, studentEmail, otp } = req.body;

    if (!classroomId || !studentEmail || !otp) {
        return responseFunction(res, 400, 'Classroom ID, student email, and OTP are required', null, false);
    }

    try {
        const joinRequest = await ClassroomJoin.findOne({
            classroomId,
            studentEmail,
            code: otp
        });

        if (!joinRequest) {
            return responseFunction(res, 400, 'Invalid OTP or join request not found', null, false);
        }
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return responseFunction(res, 404, 'Classroom not found', null, false);
        }

        if (!classroom.students.includes(studentEmail)) {
            classroom.students.push(studentEmail);
            await classroom.save();
        }

        await ClassroomJoin.deleteOne({ _id: joinRequest._id });

        return responseFunction(res, 200, 'Successfully joined the class', null, true);

    }
    catch (err) {
        console.log(err)
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
})

router.get('/classroomsforstudent', authTokenHandler, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return responseFunction(res, 404, 'User not found', null, false);
        }
        const studentEmail = user.email;
        const classrooms = await Classroom.find({ students: studentEmail }).sort({ createdAt: -1 });

        return responseFunction(res, 200, 'Classrooms fetched successfully', classrooms, true);

    }
    catch (err) {
        console.log(err)
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
})

module.exports = router;
