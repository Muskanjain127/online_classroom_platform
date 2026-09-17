import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    Plus,
    Trash2,
    Users,
    Megaphone,
    ClipboardList,
    CalendarClock,
    LogOut,
    KeyRound,
    Mail,
} from 'lucide-react';
import Modal from '../components/Modal';

const PostCard = ({ post, canDelete, onDelete }) => {
    const isAssignment = post.type === 'assignment';
    return (
        <div className="bg-panel border border-parchment/10 rounded-md p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
                <span
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
                        isAssignment
                            ? 'border-gold/45 text-gold bg-gold/5'
                            : 'border-brand/40 text-violet-200 bg-brand/10'
                    }`}
                >
                    {isAssignment ? <ClipboardList size={12} /> : <Megaphone size={12} />}
                    {isAssignment ? 'Assignment' : 'Announcement'}
                </span>
                {canDelete && (
                    <button
                        onClick={() => onDelete(post)}
                        className="text-mistdim hover:text-red-400 transition-colors p-1"
                        aria-label="Delete post"
                    >
                        <Trash2 size={15} />
                    </button>
                )}
            </div>
            <h3 className="font-serif text-lg text-parchment mb-2">{post.title}</h3>
            <p className="text-mist text-sm leading-relaxed whitespace-pre-wrap">{post.description}</p>
            <div className="flex items-center gap-4 mt-4 text-mistdim text-xs">
                <span>{new Date(post.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                {post.dueDate && (
                    <span className="flex items-center gap-1">
                        <CalendarClock size={12} />
                        Due {new Date(post.dueDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </span>
                )}
            </div>
        </div>
    );
};

const ClassesDetails = () => {
    const { classid } = useParams();
    const [classroom, setClassroom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const [showPostPopup, setShowPostPopup] = useState(false);
    const [postTitle, setPostTitle] = useState('');
    const [postDescription, setPostDescription] = useState('');
    const [postType, setPostType] = useState('announcement');
    const [postDueDate, setPostDueDate] = useState('');

    const [showJoinPopup, setShowJoinPopup] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [otpError, setOtpError] = useState('');

    const [showRoster, setShowRoster] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [confirmLeave, setConfirmLeave] = useState(false);

    const navigate = useNavigate();
    const API = process.env.REACT_APP_API_BASE_URL;

    const fetchClassDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API}/class/getclassbyid/${classid}`, { credentials: 'include' });
            const data = await response.json();
            if (response.ok) {
                setClassroom(data.data);
            } else {
                toast.error(data.message || 'Failed to fetch class details');
            }
        } catch (error) {
            toast.error('Error fetching class details');
        } finally {
            setLoading(false);
        }
    }, [API, classid]);

    useEffect(() => { fetchClassDetails(); }, [fetchClassDetails]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${API}/auth/getuser`, { credentials: 'include' });
                const data = await response.json();
                if (response.ok) setUser(data.data);
            } catch (error) {
                toast.error('An error occurred while fetching user data');
            }
        };
        fetchUser();
    }, [API]);

    const handleSubmitPost = async () => {
        if (!postTitle.trim() || !postDescription.trim()) {
            toast.error('Title and description are required');
            return;
        }
        try {
            const response = await fetch(`${API}/class/addpost`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: postTitle,
                    description: postDescription,
                    classId: classid,
                    type: postType,
                    dueDate: postType === 'assignment' && postDueDate ? postDueDate : undefined,
                }),
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Post created successfully');
                setPostTitle('');
                setPostDescription('');
                setPostType('announcement');
                setPostDueDate('');
                setShowPostPopup(false);
                fetchClassDetails();
            } else {
                toast.error(data.message || 'Failed to create post');
            }
        } catch (error) {
            toast.error('An error occurred while creating the post');
        }
    };

    const handleDeletePost = async () => {
        if (!postToDelete) return;
        try {
            const response = await fetch(`${API}/class/deletepost/${postToDelete._id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Post deleted');
                fetchClassDetails();
            } else {
                toast.error(data.message || 'Failed to delete post');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the post');
        } finally {
            setPostToDelete(null);
        }
    };

    const handleJoinRequest = async () => {
        try {
            const response = await fetch(`${API}/class/request-to-join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ classroomId: classid, studentEmail: user?.email }),
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setShowJoinPopup(false);
                setShowOtpPopup(true);
                toast.success('OTP sent to the class owner');
            } else {
                toast.error(data.message || 'Failed to send join request');
            }
        } catch (error) {
            toast.error('An error occurred while sending join request');
        }
    };

    const handleSubmitOtp = async () => {
        try {
            const response = await fetch(`${API}/class/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ classroomId: classid, studentEmail: user?.email, otp }),
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setOtp('');
                setShowOtpPopup(false);
                toast.success('Successfully joined the class');
                fetchClassDetails();
            } else {
                setOtpError(data.message || 'Failed to verify OTP');
            }
        } catch (error) {
            toast.error('An error occurred while verifying OTP');
        }
    };

    const handleLeaveClassroom = async () => {
        try {
            const response = await fetch(`${API}/class/leaveclassroom`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ classroomId: classid }),
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('You left the classroom');
                navigate('/profile');
            } else {
                toast.error(data.message || 'Failed to leave classroom');
            }
        } catch (error) {
            toast.error('An error occurred while leaving the classroom');
        } finally {
            setConfirmLeave(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-mist">
                <div className="w-8 h-8 border-2 border-parchment/20 border-t-brand rounded-full animate-spin" />
                <p className="text-sm">Loading classroom…</p>
            </div>
        );
    }

    const isStudent = classroom?.students?.includes(user?.email);
    const isOwner = classroom?.owner === user?._id;

    return (
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-14">
            {/* Header */}
            <div className="bg-gradient-to-b from-panel2 to-panel border border-parchment/10 rounded-md p-8 mb-10">
                <div className="flex flex-wrap items-start justify-between gap-6">
                    <div>
                        <span className="font-serif italic text-gold text-sm">Classroom</span>
                        <h1 className="font-serif text-3xl text-parchment mt-1">{classroom?.name}</h1>
                        <p className="text-mist text-sm mt-3 max-w-lg leading-relaxed">
                            {classroom?.description || 'No description provided.'}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {isOwner && (
                            <>
                                <button
                                    onClick={() => setShowRoster(true)}
                                    className="flex items-center gap-2 border border-parchment/20 px-4 py-2.5 rounded text-sm hover:border-gold hover:text-gold transition-colors"
                                >
                                    <Users size={16} /> Roster ({classroom?.students?.length || 0})
                                </button>
                                <button
                                    onClick={() => setShowPostPopup(true)}
                                    className="flex items-center gap-2 bg-parchment text-ink font-semibold px-4 py-2.5 rounded hover:bg-gold transition-colors"
                                >
                                    <Plus size={16} /> Add post
                                </button>
                            </>
                        )}
                        {!isStudent && !isOwner && (
                            <button
                                onClick={() => setShowJoinPopup(true)}
                                className="flex items-center gap-2 bg-parchment text-ink font-semibold px-4 py-2.5 rounded hover:bg-gold transition-colors"
                            >
                                <Plus size={16} /> Join class
                            </button>
                        )}
                        {isStudent && (
                            <button
                                onClick={() => setConfirmLeave(true)}
                                className="flex items-center gap-2 border border-parchment/20 px-4 py-2.5 rounded text-sm hover:border-red-400 hover:text-red-400 transition-colors"
                            >
                                <LogOut size={16} /> Leave class
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Posts */}
            {(isStudent || isOwner) ? (
                classroom?.posts?.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                        {classroom.posts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                canDelete={isOwner}
                                onDelete={setPostToDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-mistdim italic font-serif">No posts yet — nothing has been shared here.</p>
                )
            ) : (
                <p className="text-mistdim italic font-serif">Join this classroom to see its posts.</p>
            )}

            {/* Add post modal */}
            {showPostPopup && (
                <Modal title="Add post" icon={<Megaphone size={18} className="text-gold" />} onClose={() => setShowPostPopup(false)}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setPostType('announcement')}
                                className={`flex items-center justify-center gap-2 py-2.5 rounded border text-sm transition-colors ${
                                    postType === 'announcement'
                                        ? 'border-brand bg-brand/10 text-parchment'
                                        : 'border-parchment/15 text-mist hover:border-parchment/30'
                                }`}
                            >
                                <Megaphone size={15} /> Announcement
                            </button>
                            <button
                                type="button"
                                onClick={() => setPostType('assignment')}
                                className={`flex items-center justify-center gap-2 py-2.5 rounded border text-sm transition-colors ${
                                    postType === 'assignment'
                                        ? 'border-brand bg-brand/10 text-parchment'
                                        : 'border-parchment/15 text-mist hover:border-parchment/30'
                                }`}
                            >
                                <ClipboardList size={15} /> Assignment
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Title"
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                            className="w-full bg-ink border border-parchment/15 rounded px-3 py-3 text-[14.5px] text-parchment placeholder:text-mistdim outline-none focus:border-brand"
                        />
                        <textarea
                            placeholder="Description"
                            value={postDescription}
                            onChange={(e) => setPostDescription(e.target.value)}
                            rows="4"
                            className="w-full bg-ink border border-parchment/15 rounded px-3 py-3 text-[14.5px] text-parchment placeholder:text-mistdim outline-none focus:border-brand resize-none"
                        />
                        {postType === 'assignment' && (
                            <div>
                                <label className="text-mistdim text-xs block mb-2">Due date (optional)</label>
                                <input
                                    type="date"
                                    value={postDueDate}
                                    onChange={(e) => setPostDueDate(e.target.value)}
                                    className="w-full bg-ink border border-parchment/15 rounded px-3 py-3 text-[14.5px] text-parchment outline-none focus:border-brand"
                                />
                            </div>
                        )}
                        <div className="flex gap-3 pt-1">
                            <button
                                onClick={() => setShowPostPopup(false)}
                                className="flex-1 border border-parchment/20 py-2.5 rounded text-sm hover:border-parchment/40 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitPost}
                                className="flex-1 bg-parchment text-ink font-semibold py-2.5 rounded text-sm hover:bg-gold transition-colors"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Delete post confirm */}
            {postToDelete && (
                <Modal title="Delete post" icon={<Trash2 size={18} className="text-red-400" />} onClose={() => setPostToDelete(null)}>
                    <p className="text-mist text-sm leading-relaxed mb-6">
                        Delete "{postToDelete.title}"? This can't be undone.
                    </p>
                    <div className="flex gap-3">
                        <button onClick={() => setPostToDelete(null)} className="flex-1 border border-parchment/20 py-2.5 rounded text-sm hover:border-parchment/40 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleDeletePost} className="flex-1 bg-red-500/90 text-white font-semibold py-2.5 rounded text-sm hover:bg-red-500 transition-colors">
                            Delete
                        </button>
                    </div>
                </Modal>
            )}

            {/* Roster modal */}
            {showRoster && (
                <Modal title="Classroom roster" icon={<Users size={18} className="text-gold" />} onClose={() => setShowRoster(false)}>
                    {classroom?.students?.length > 0 ? (
                        <ul className="space-y-2 max-h-80 overflow-y-auto">
                            {classroom.students.map((email, i) => (
                                <li key={email} className="flex items-center gap-3 bg-ink border border-parchment/10 rounded px-4 py-3 text-sm text-parchment">
                                    <Mail size={14} className="text-mistdim" />
                                    {email}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-mistdim italic font-serif">No students enrolled yet.</p>
                    )}
                </Modal>
            )}

            {/* Join request modal */}
            {showJoinPopup && (
                <Modal title="Join request" icon={<Plus size={18} className="text-gold" />} onClose={() => setShowJoinPopup(false)}>
                    <p className="text-mist text-sm leading-relaxed mb-6">
                        A one-time code will be sent to the classroom owner. Ask them for it to confirm your enrollment.
                    </p>
                    <div className="flex gap-3">
                        <button onClick={() => setShowJoinPopup(false)} className="flex-1 border border-parchment/20 py-2.5 rounded text-sm hover:border-parchment/40 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleJoinRequest} className="flex-1 bg-parchment text-ink font-semibold py-2.5 rounded text-sm hover:bg-gold transition-colors">
                            Send request
                        </button>
                    </div>
                </Modal>
            )}

            {/* OTP modal */}
            {showOtpPopup && (
                <Modal title="Enter the code" icon={<KeyRound size={18} className="text-gold" />} onClose={() => { setShowOtpPopup(false); setOtpError(''); }}>
                    <input
                        type="text"
                        placeholder="6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-ink border border-parchment/15 rounded px-3 py-3 text-[14.5px] text-parchment placeholder:text-mistdim outline-none focus:border-brand mb-3"
                    />
                    {otpError && <p className="text-red-400 text-sm mb-4">{otpError}</p>}
                    <div className="flex gap-3">
                        <button onClick={() => { setShowOtpPopup(false); setOtpError(''); }} className="flex-1 border border-parchment/20 py-2.5 rounded text-sm hover:border-parchment/40 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSubmitOtp} className="flex-1 bg-parchment text-ink font-semibold py-2.5 rounded text-sm hover:bg-gold transition-colors">
                            Confirm
                        </button>
                    </div>
                </Modal>
            )}

            {/* Leave confirm */}
            {confirmLeave && (
                <Modal title="Leave classroom" icon={<LogOut size={18} className="text-red-400" />} onClose={() => setConfirmLeave(false)}>
                    <p className="text-mist text-sm leading-relaxed mb-6">
                        You'll lose access to posts here until you rejoin with a new code. Continue?
                    </p>
                    <div className="flex gap-3">
                        <button onClick={() => setConfirmLeave(false)} className="flex-1 border border-parchment/20 py-2.5 rounded text-sm hover:border-parchment/40 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleLeaveClassroom} className="flex-1 bg-red-500/90 text-white font-semibold py-2.5 rounded text-sm hover:bg-red-500 transition-colors">
                            Leave
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ClassesDetails;
