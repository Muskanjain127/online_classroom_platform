import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const steps = [
    {
        n: '01',
        title: 'A teacher opens a classroom',
        body: "Name it, describe it, and it's live — ready to hold announcements, assignments, and a roll of students the teacher has actually approved.",
    },
    {
        n: '02',
        title: 'A student finds it and knocks',
        body: 'Search by name and send a request to join. Nothing is granted automatically — the request simply lets the teacher know someone’s asking.',
    },
    {
        n: '03',
        title: 'A code confirms it’s really them',
        body: 'A one-time code lands with the teacher; the student enters it to confirm. Only then are they added to the roll and the class posts unlock.',
    },
];

const features = [
    {
        title: 'Verified enrollment',
        body: 'Every join request is confirmed by a one-time code sent straight to the teacher — the roll only ever reflects students who were actually let in.',
    },
    {
        title: 'A record, not a feed',
        body: 'Posts live inside their classroom, dated and attributed — announcements or assignments with a due date, building a plain paper trail.',
    },
    {
        title: 'Role by design',
        body: 'Teachers and students see different classrooms from the start: one creates and posts, the other finds, requests, and reads.',
    },
    {
        title: 'Search, not scroll',
        body: 'Students find a class by its name rather than hunting through invite links — the classroom they need is always one search away.',
    },
    {
        title: 'A profile that’s actually useful',
        body: 'One page holding everything a person is party to — classes they run, classes they’ve joined, and a running stat sheet of both.',
    },
];

const Landing = () => {
    const { auth } = useAuth();

    return (
        <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_500px_at_85%_-5%,rgba(124,92,255,0.16),transparent_60%),radial-gradient(700px_500px_at_8%_15%,rgba(200,164,94,0.08),transparent_55%)]" />

            {/* Hero */}
            <section className="relative px-6 sm:px-10 pt-20 pb-24 max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="flex items-center gap-3 text-mist text-sm mb-6">
                            <span className="w-8 h-px bg-parchment/25" />
                            A register for the modern classroom
                        </div>
                        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight text-parchment">
                            Every class, kept like a{' '}
                            <em className="not-italic italic text-gold">proper register.</em>
                        </h1>
                        <p className="mt-6 text-lg text-mist max-w-md leading-relaxed">
                            MastersGang gives teachers a classroom they actually control — who's enrolled,
                            what's posted, and who asked to join — and gives students one place to find
                            their classes, without a single open door.
                        </p>
                        <div className="mt-9 flex flex-wrap gap-4">
                            {auth.user ? (
                                <Link
                                    to="/profile"
                                    className="bg-parchment text-ink font-semibold px-6 py-3 rounded hover:bg-gold transition-colors"
                                >
                                    Go to your profile
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/signup"
                                        className="bg-parchment text-ink font-semibold px-6 py-3 rounded hover:bg-gold transition-colors"
                                    >
                                        Signup to Create or Join Classroom
                                    </Link>
                                </>
                            )}
                        </div>
                        <div className="mt-7 flex items-center gap-2 text-[13.5px] text-mistdim">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                            Every join request is approved by one-time code — no student joins a class unnoticed.
                        </div>
                    </div>

                    {/* Ledger visual */}
                    <div className="bg-gradient-to-b from-panel2 to-panel border border-parchment/10 rounded-md shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-parchment/10">
                            <span className="font-serif italic text-parchment">Advanced Physics — Roll</span>
                            <span className="font-serif text-gold text-sm tracking-wide">CLS-4417</span>
                        </div>
                        {[
                            { num: '01', name: 'Ananya Verma', email: 'ananya@student.mg', status: 'ok', label: 'Enrolled' },
                            { num: '02', name: 'Rohit Malhotra', email: 'rohit@student.mg', status: 'ok', label: 'Enrolled' },
                            { num: '03', name: 'Saira Khan', email: 'saira@student.mg', status: 'wait', label: 'Awaiting code' },
                        ].map((row) => (
                            <div
                                key={row.num}
                                className="grid grid-cols-[30px_1fr_auto] items-center gap-4 px-6 py-4 border-b border-parchment/10 text-sm"
                            >
                                <span className="font-serif italic text-mistdim">{row.num}</span>
                                <div className="flex flex-col gap-0.5">
                                    <b className="font-medium text-parchment">{row.name}</b>
                                    <span className="text-mistdim text-xs">{row.email}</span>
                                </div>
                                <span
                                    className={`text-xs px-3 py-1 rounded-full border whitespace-nowrap ${
                                        row.status === 'ok'
                                            ? 'border-brand/50 text-violet-200 bg-brand/10'
                                            : 'border-gold/45 text-gold bg-gold/5'
                                    }`}
                                >
                                    {row.label}
                                </span>
                            </div>
                        ))}
                        <div className="px-6 py-4 flex items-center gap-2 text-mistdim text-xs">
                            One-time code sent to teacher
                            <span className="font-serif italic tracking-widest text-parchment bg-ink border border-parchment/25 px-2.5 py-0.5 rounded text-xs">
                                6 · 1 · 9 · 4 · 0 · 2
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="how" className="relative px-6 sm:px-10 py-20 max-w-6xl mx-auto border-t border-parchment/10">
                <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-end border-b border-parchment/10 pb-10 mb-14">
                    <div>
                        <span className="font-serif italic text-gold text-sm block mb-3">The mechanics</span>
                        <h2 className="font-serif text-3xl sm:text-4xl leading-tight text-parchment">
                            Three steps, and the door only opens on your say-so.
                        </h2>
                    </div>
                    <p className="text-mist leading-relaxed max-w-md">
                        No public class lists, no link that anyone can click. A classroom on MastersGang
                        stays exactly as open as its teacher wants it to be.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 border-t border-parchment/10">
                    {steps.map((s, i) => (
                        <div
                            key={s.n}
                            className={`pt-9 pb-0 pr-8 ${i < steps.length - 1 ? 'md:border-r border-parchment/10 md:pb-0 pb-9 border-b md:border-b-0' : ''}`}
                        >
                            <span className="font-serif italic text-mistdim text-sm block mb-5">{s.n}</span>
                            <h3 className="font-serif text-xl text-parchment mb-3">{s.title}</h3>
                            <p className="text-mist text-[14.5px] leading-relaxed">{s.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section id="features" className="relative px-6 sm:px-10 py-20 max-w-6xl mx-auto border-t border-parchment/10">
                <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-end border-b border-parchment/10 pb-10 mb-6">
                    <div>
                        <span className="font-serif italic text-gold text-sm block mb-3">What's inside</span>
                        <h2 className="font-serif text-3xl sm:text-4xl leading-tight text-parchment">
                            Built for the parts of teaching that actually need software.
                        </h2>
                    </div>
                    <p className="text-mist leading-relaxed max-w-md">
                        Nothing ornamental — every feature exists because a real classroom needed it.
                    </p>
                </div>
                {features.map((f, i) => (
                    <div
                        key={f.title}
                        className={`grid md:grid-cols-[260px_1fr] gap-6 py-7 border-t border-parchment/10 ${
                            i === features.length - 1 ? 'border-b' : ''
                        }`}
                    >
                        <h4 className="font-serif italic text-xl text-parchment">{f.title}</h4>
                        <p className="text-mist text-[15px] leading-relaxed max-w-xl">{f.body}</p>
                    </div>
                ))}
            </section>

            {/* Audience split */}
            <section id="audience" className="relative px-6 sm:px-10 py-20 max-w-6xl mx-auto border-t border-parchment/10">
                <div className="mb-14">
                    <span className="font-serif italic text-gold text-sm block mb-3">Two sides of the desk</span>
                    <h2 className="font-serif text-3xl sm:text-4xl leading-tight text-parchment max-w-xl">
                        Same classroom, built differently for who's in the room.
                    </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-px bg-parchment/10 border border-parchment/10 rounded-md overflow-hidden">
                    <div className="bg-panel p-10">
                        <span className="font-serif italic text-gold text-sm block mb-4">For teachers</span>
                        <h3 className="font-serif text-2xl text-parchment mb-4">Run a classroom you actually control.</h3>
                        <p className="text-mist text-[15px] leading-relaxed mb-6">
                            Open a classroom, and it's yours to shape — post announcements, approve who joins,
                            and keep a record of everything that's been shared.
                        </p>
                        <ul className="space-y-0">
                            {[
                                'Create classrooms with a name and description in seconds',
                                'Approve every join request with a code sent to you',
                                'Post assignments and updates the whole roll can see',
                                'Keep one dashboard of every classroom you run, with live stats',
                            ].map((item, i) => (
                                <li
                                    key={item}
                                    className={`flex gap-3 items-start text-[14.5px] text-mist py-3 ${i > 0 ? 'border-t border-parchment/10' : ''}`}
                                >
                                    <span className="font-serif italic text-brand">＋</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-panel p-10">
                        <span className="font-serif italic text-gold text-sm block mb-4">For students</span>
                        <h3 className="font-serif text-2xl text-parchment mb-4">Find your class, and know you're really in it.</h3>
                        <p className="text-mist text-[15px] leading-relaxed mb-6">
                            Search for the classroom you've been told to join, request access, and confirm
                            with a code — then everything posted there is yours to read.
                        </p>
                        <ul className="space-y-0">
                            {[
                                'Search classrooms by name, no invite link needed',
                                'Confirm enrollment with a one-time code',
                                'See every classroom you\'ve joined in one place',
                                'Leave a classroom yourself, any time',
                            ].map((item, i) => (
                                <li
                                    key={item}
                                    className={`flex gap-3 items-start text-[14.5px] text-mist py-3 ${i > 0 ? 'border-t border-parchment/10' : ''}`}
                                >
                                    <span className="font-serif italic text-brand">＋</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative border-t border-parchment/10 py-24 text-center px-6">
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl max-w-2xl mx-auto leading-tight text-parchment">
                    Open your first classroom, or find the one you were told about.
                </h2>
                <p className="text-mist mt-5 mb-9">
                    Free to start. A teacher's account or a student's — MastersGang asks which you are and nothing more.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                    <Link
                        to={auth.user ? '/profile' : '/signup'}
                        className="bg-parchment text-ink font-semibold px-6 py-3 rounded hover:bg-gold transition-colors"
                    >
                        {auth.user ? 'Go to your profile' : 'Create a classroom'}
                    </Link>
                    {!auth.user && (
                        <Link
                            to="/login"
                            className="border border-parchment/25 px-6 py-3 rounded hover:border-gold hover:text-gold transition-colors"
                        >
                            Join a Classroom
                        </Link>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="relative border-t border-parchment/10 px-6 sm:px-10 py-12 max-w-6xl mx-auto">
                <div className="flex flex-wrap justify-between gap-8 pb-8 border-b border-parchment/10">
                    <div>
                        <div className="font-serif text-lg text-parchment">MastersGang(Online Classroom Platform)</div>
                        <p className="text-mistdim text-[13px] max-w-xs mt-2 leading-relaxed">
                            A classroom platform kept honest by verification — every enrollment approved,
                            every post attributed.
                        </p>
                    </div>
                    <div className="flex gap-14">
                        <div>
                            <h5 className="text-mistdim text-xs mb-3">Product</h5>
                            <a href="#how" className="block text-mist text-sm py-1 hover:text-gold transition-colors">How it works</a>
                            <a href="#features" className="block text-mist text-sm py-1 hover:text-gold transition-colors">What's inside</a>
                            <a href="#audience" className="block text-mist text-sm py-1 hover:text-gold transition-colors">Teachers &amp; students</a>
                        </div>
                        <div>
                            <h5 className="text-mistdim text-xs mb-3">Account</h5>
                            <Link to="/login" className="block text-mist text-sm py-1 hover:text-gold transition-colors">Log in</Link>
                            <Link to="/signup" className="block text-mist text-sm py-1 hover:text-gold transition-colors">Signup</Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap justify-between gap-2 pt-6 text-mistdim text-[13px]">
                    <span>© 2026 MastersGang.</span>
                    <span>Built for classrooms that check who's actually in the room.</span>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
