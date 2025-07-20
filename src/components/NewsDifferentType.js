import React, { useState } from 'react';
import ShowSixNews from './ShowSixNews';
import '../index.css';
export default function NewsDifferentType() {
    const [selectedType, setSelectedType] = useState('World');
    return (
        <>
            <section className="news-type-section">
                <ul className="news-type-list">
                    <li onClick={() => setSelectedType('World')} className={selectedType === 'World' ? 'active' : ''}>World</li>
                    <li onClick={() => setSelectedType('India')} className={selectedType === 'India' ? 'active' : ''}>India</li>
                    <li onClick={() => setSelectedType('Tech')} className={selectedType === 'Tech' ? 'active' : ''}>Tech</li>
                    <li onClick={() => setSelectedType('Politics')} className={selectedType === 'Politics' ? 'active' : ''}>Politics</li>
                    <li onClick={() => setSelectedType('Sports')} className={selectedType === 'Sports' ? 'active' : ''}>Sports</li>
                    <li onClick={() => setSelectedType('Entertainment')} className={selectedType === 'Entertainment' ? 'active' : ''}>Entertainment</li>
                    <li onClick={() => setSelectedType('Health')} className={selectedType === 'Health' ? 'active' : ''}>Health</li>
                    <li onClick={() => setSelectedType('Finance')} className={selectedType === 'Finance' ? 'active' : ''}>Finance</li>
                    <li onClick={() => setSelectedType('Education')} className={selectedType === 'Education' ? 'active' : ''}>Education</li>
                </ul>
            </section>
            <ShowSixNews category={selectedType} />

        </>
    );
}   