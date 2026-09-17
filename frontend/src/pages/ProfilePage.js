import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
    Mail,
    ShieldCheck,
    Plus,
    BookOpen,
    GraduationCap,
    Sparkles,
    ArrowRight,
    Pencil,
    Check,
    X,
    Trash2,
    LogOut,
    Layers,
    Users,
    FileText,
} from 'lucide-react';
import Modal from '../components/Modal';

const StatCard = ({ icon, label, value }) => (
    <div className="bg-panel border border-parchment/10 rounded-md p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center text-brand shrink-0">
            {icon}
        </div>
        <div>
            <div className="font-serif text-2xl text-parchment leading-none">{value}</div>
            <div className="text-mistdim text-xs mt-1">{label}</div>
        </div>
    </div>
);

const ClassroomCard = ({ classroom, onClick, onDelete, onLeave, isOwner }) => (
    <div
        onClick={onClick}
        className="group bg-panel border border-parchment/10 rounded-md p-5 cursor-pointer hover:border-brand/40 transition-colors flex flex-col justify-between min-h-[160px]"
    >
        <div>
            <h4 className="font-serif text-lg text-parchment mb-2">{classroom.name}</h4>
            <p className="text-mist text-sm leading-relaxed line-clamp-2">
                {classroom.description || 'No description provided.'}
            </p>
        </div>
        <div className="flex items-center justify-between mt-5">
            <span className="flex items-center gap-1.5 text-sm text-mistdim group-hover:text-gold transition-colors">
                View class <ArrowRight size={14} />
            </span>
            {isOwner ? (
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(classroom); }}
                    className="text-mistdim hover:text-red-400 transition-colors p-1"
                    aria-label="Delete classroom"
                >
                    <Trash2 size={15} />
                </button>
            ) : (
                <button
                    onClick={(e) => { e.stopPropagation(); onLeave(classroom); }}
                    className="text-mistdim hover:text-red-400 transition-colors p-1"
                    aria-label="Leave classroom"
                >
                    <LogOut size={15} />
                </button>
            )}
        </div>
    </div>
);

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [classroomName, setClassroomName] = useState('');
    const [description, setDescription] = useState('');

    const [classroomsCreatedByMe, setClassroomsCreatedByMe] = useState([]);
    const [classroomsJoinedByMe, setClassroomsJoinedByMe] = useState([]);

    const [editingName, setEditingName] = useState(false);
    const [nameDraft, setNameDraft] = useState('');
    const [savingName, setSavingName] = useState(false);

    const [confirmTarget, setConfirmTarget] = useState(null); // { type: 'delete'|'leave', classroom }

    const navigate = useNavigate();
    const API = process.env.REACT_APP_API_BASE_URL;

    const fetchUser = useCallback(async () => {
        try {
            const response = await fetch(`${API}/auth/getuser`, { credentials: 'include' });
            const data = await response.json();
            if (response.ok) {
                setUser(data.data);
                setNameDraft(data.data.name);
            } else {
                toast.error(data.message || 'Failed to fetch user data');
            }
        } catch (error) {
            toast.error('An error occurred while fetching user data');
        } finally {
            setLoading(false);
        }
    }, [API]);

    const fetchStats = useCallback(async () => {
        try {
            const response = await fetch(`${API}/class/mystats`, { credentials: 'include' });
            const data = await response.json();
            if (response.ok) setStats(data.data);
        } catch (error) {
            // silent — stats are a nice-to-have
        }
    }, [API]);

    const fetchClassrooms = useCallback(async () => {
        try {
            const response = await fetch(`${API}/class/classroomscreatedbyme`, { credentials: 'include' });
            const data = await response.json();
            if (response.ok) setClassroomsCreatedByMe(data.data || []);
        } catch (error) {
            toast.error('An error occurred while fetching classrooms');
        }
    }, [API]);

    const fetchClassroomsJoinedByMe = useCallback(async () => {
        try {
            const response = await fetch(`${API}/class/classroomsforstudent`, { credentials: 'include' });
            const data = await response.json();
            if (response.ok) setClassroomsJoinedByMe(data.data || []);
        } catch (error) {
            // silent
        }
    }, [API]);

    useEffect(() => { fetchUser(); }, [fetchUser]);

    useEffect(() => {
        if (user) {
            fetchStats();
            fetchClassrooms();
            fetchClassroomsJoinedByMe();
        }
    }, [user, fetchStats, fetchClassrooms, fetchClassroomsJoinedByMe]);

    const handleCreateClassroom = async () => {
        if (!classroomName.trim()) {
            toast.error('Classroom name is required');
            return;
        }
        try {
            const response = await fetch(`${API}/class/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: classroomName, description }),
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Classroom created successfully');
                setClassroomName('');
                setDescription('');
                setShowCreatePopup(false);
                fetchClassrooms();
                fetchStats();
            } else {
                toast.error(data.message || 'Failed to create classroom');
            }
        } catch (error) {
            toast.error('An error occurred while creating classroom');
        }
    };

    const handleSaveName = async () => {
        if (!nameDraft.trim()) {
            toast.error('Name cannot be empty');
            return;
        }
        setSavingName(true);
        try {
            const response = await fetch(`${API}/auth/updateprofile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: nameDraft.trim() }),
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data.data);
                toast.success('Name updated');
                setEditingName(false);
            } else {
                toast.error(data.message || 'Failed to update name');
            }
        } catch (error) {
            toast.error('An error occurred while updating name');
        } finally {
            setSavingName(false);
        }
    };

    const handleConfirmAction = async () => {
        if (!confirmTarget) return;
        const { type, classroom } = confirmTarget;
        try {
            if (type === 'delete') {
                const response = await fetch(`${API}/class/deleteclassroom/${classroom._id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    toast.success('Classroom deleted');
                    fetchClassrooms();
                    fetchStats();
                } else {
                    toast.error(data.message || 'Failed to delete classroom');
                }
            } else {
                const response = await fetch(`${API}/class/leaveclassroom`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ classroomId: classroom._id }),
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    toast.success('You left the classroom');
                    fetchClassroomsJoinedByMe();
                } else {
                    toast.error(data.message || 'Failed to leave classroom');
                }
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setConfirmTarget(null);
        }
    };

    const handleRowClick = (classroomId) => navigate(`/classes/${classroomId}`);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-mist">
                <div className="w-8 h-8 border-2 border-parchment/20 border-t-brand rounded-full animate-spin" />
                <p className="text-sm">Loading your profile…</p>
            </div>
        );
    }

    if (!user) {
        return <div className="min-h-[70vh] flex items-center justify-center text-mist">No user data found.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-14">
            {/* Hero card */}
            <div className="bg-gradient-to-b from-panel2 to-panel border border-parchment/10 rounded-md p-8 flex flex-wrap items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-brand/15 border border-brand/40 flex items-center justify-center font-serif text-2xl text-parchment">
                        {user.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            {editingName ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        value={nameDraft}
                                        onChange={(e) => setNameDraft(e.target.value)}
                                        className="bg-ink border border-parchment/20 rounded px-3 py-1.5 text-lg font-serif text-parchment outline-none focus:border-brand"
                                        autoFocus
                                    />
                                    <button onClick={handleSaveName} disabled={savingName} className="text-brand hover:text-gold p-1">
                                        <Check size={18} />
                                    </button>
                                    <button onClick={() => { setEditingName(false); setNameDraft(user.name); }} className="text-mistdim hover:text-red-400 p-1">
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="font-serif text-2xl text-parchment">{user.name}</h2>
                                    <button onClick={() => setEditingName(true)} className="text-mistdim hover:text-gold p-1" aria-label="Edit name">
                                        <Pencil size={14} />
                                    </button>
                                </>
                            )}
                            <span className="flex items-center gap-1 text-xs border border-brand/40 text-brand bg-brand/10 px-2.5 py-1 rounded-full capitalize">
                                <ShieldCheck size={12} /> {user.role}
                            </span>
                        </div>
                        <p className="flex items-center gap-2 text-mist text-sm mt-2">
                            <Mail size={14} /> {user.email}
                        </p>
                    </div>
                </div>

                {user.role === 'teacher' && (
                    <button
                        onClick={() => setShowCreatePopup(true)}
                        className="flex items-center gap-2 bg-parchment text-ink font-semibold px-5 py-3 rounded hover:bg-gold transition-colors"
                    >
                        <Plus size={17} /> Create classroom
                    </button>
                )}
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <StatCard icon={<Layers size={17} />} label="Classrooms created" value={stats.classroomsCreated} />
                    <StatCard icon={<GraduationCap size={17} />} label="Classrooms joined" value={stats.classroomsJoined} />
                    <StatCard icon={<Users size={17} />} label="Students taught" value={stats.totalStudentsTaught} />
                    <StatCard icon={<FileText size={17} />} label="Posts shared" value={stats.totalPostsCreated} />
                </div>
            )}

            {/* Create classroom modal */}
            {showCreatePopup && (
                <Modal
                    title="New classroom"
                    icon={<Sparkles size={18} className="text-gold" />}
                    onClose={() => setShowCreatePopup(false)}
                >
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Classroom name (e.g. Advanced Mathematics)"
                            value={classroomName}
                            onChange={(e) => setClassroomName(e.target.value)}
                            className="w-full bg-ink border border-parchment/15 rounded px-3 py-3 text-[14.5px] text-parchment placeholder:text-mistdim outline-none focus:border-brand"
                        />
                        <textarea
                            placeholder="Brief description about the classroom…"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            className="w-full bg-ink border border-parchment/15 rounded px-3 py-3 text-[14.5px] text-parchment placeholder:text-mistdim outline-none focus:border-brand resize-none"
                        />
                        <div className="flex gap-3 pt-1">
                            <button
                                onClick={() => setShowCreatePopup(false)}
                                className="flex-1 border border-parchment/20 py-2.5 rounded text-sm hover:border-parchment/40 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateClassroom}
                                className="flex-1 bg-parchment text-ink font-semibold py-2.5 rounded text-sm hover:bg-gold transition-colors"
                            >
                                Create classroom
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Confirm delete / leave modal */}
            {confirmTarget && (
                <Modal
                    title={confirmTarget.type === 'delete' ? 'Delete classroom' : 'Leave classroom'}
                    icon={confirmTarget.type === 'delete' ? <Trash2 size={18} className="text-red-400" /> : <LogOut size={18} className="text-gold" />}
                    onClose={() => setConfirmTarget(null)}
                >
                    <p className="text-mist text-sm leading-relaxed mb-6">
                        {confirmTarget.type === 'delete'
                            ? `This permanently deletes "${confirmTarget.classroom.name}" and every post inside it. This can't be undone.`
                            : `You'll lose access to posts in "${confirmTarget.classroom.name}" until you rejoin with a new code.`}
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setConfirmTarget(null)}
                            className="flex-1 border border-parchment/20 py-2.5 rounded text-sm hover:border-parchment/40 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmAction}
                            className="flex-1 bg-red-500/90 text-white font-semibold py-2.5 rounded text-sm hover:bg-red-500 transition-colors"
                        >
                            {confirmTarget.type === 'delete' ? 'Delete' : 'Leave'}
                        </button>
                    </div>
                </Modal>
            )}

            {/* Created classrooms */}
            {user.role === 'teacher' && (
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-5 text-parchment">
                        <BookOpen size={18} />
                        <h3 className="font-serif text-xl">Classrooms created by me</h3>
                    </div>
                    {classroomsCreatedByMe.length === 0 ? (
                        <p className="text-mistdim italic font-serif">You haven't created any classrooms yet.</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {classroomsCreatedByMe.map((classroom) => (
                                <ClassroomCard
                                    key={classroom._id}
                                    classroom={classroom}
                                    isOwner
                                    onClick={() => handleRowClick(classroom._id)}
                                    onDelete={(c) => setConfirmTarget({ type: 'delete', classroom: c })}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Joined classrooms */}
            <div>
                <div className="flex items-center gap-2 mb-5 text-parchment">
                    <GraduationCap size={18} />
                    <h3 className="font-serif text-xl">Classrooms joined by me</h3>
                </div>
                {classroomsJoinedByMe.length === 0 ? (
                    <p className="text-mistdim italic font-serif">You haven't joined any classrooms yet.</p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classroomsJoinedByMe.map((classroom) => (
                            <ClassroomCard
                                key={classroom._id}
                                classroom={classroom}
                                isOwner={false}
                                onClick={() => handleRowClick(classroom._id)}
                                onLeave={(c) => setConfirmTarget({ type: 'leave', classroom: c })}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
