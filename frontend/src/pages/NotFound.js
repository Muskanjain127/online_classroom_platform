import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <span className="font-serif italic text-gold text-sm mb-3">Page not found</span>
        <h1 className="font-serif text-5xl text-parchment mb-4">Nothing on this page.</h1>
        <p className="text-mist max-w-sm mb-8">
            The classroom or page you're looking for doesn't exist, or the link is out of date.
        </p>
        <Link to="/" className="bg-parchment text-ink font-semibold px-6 py-3 rounded hover:bg-gold transition-colors">
            Back to homepage
        </Link>
    </div>
);

export default NotFound;
