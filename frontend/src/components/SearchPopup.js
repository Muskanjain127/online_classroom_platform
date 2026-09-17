import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, BookOpen } from 'lucide-react';

const SearchPopup = ({ onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const navigate = useNavigate();

    const handleSearchChange = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term) {
            setSearched(true);
            try {
                const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/classrooms/search?term=${encodeURIComponent(term)}`);
                if (!res.ok) throw new Error('Network response was not ok');
                const data = await res.json();
                setResults(data.data || []);
            } catch (error) {
                setResults([]);
            }
        } else {
            setSearched(false);
            setResults([]);
        }
    };

    const handleItemClick = (id) => {
        navigate(`/classes/${id}`);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-[14vh] px-5"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg bg-panel2 border border-parchment/20 rounded-md shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-2 border-b border-parchment/10 p-2">
                    <input
                        type="text"
                        autoFocus
                        placeholder="Search classrooms by name…"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="flex-1 bg-transparent border-none outline-none text-parchment placeholder:text-mistdim px-3 py-3 text-[15px]"
                    />
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="p-2 text-mist hover:text-gold rounded transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
                {searched && (
                    <ul className="max-h-80 overflow-y-auto p-2">
                        {results.length > 0 ? (
                            results.map((result) => (
                                <li
                                    key={result._id}
                                    onClick={() => handleItemClick(result._id)}
                                    className="flex items-center gap-3 px-4 py-3 rounded text-parchment text-[14.5px] cursor-pointer hover:bg-panel3 transition-colors"
                                >
                                    <BookOpen size={15} className="text-mist" />
                                    <span>{result.name}</span>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-3 text-mistdim italic font-serif">
                                No classrooms match "{searchTerm}"
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SearchPopup;
