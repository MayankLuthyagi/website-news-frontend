import React, { useState } from 'react';
import ShowSixNews from './ShowSixNews';
import '../index.css';

export default function NewsDifferentType() {
    const [selectedType, setSelectedType] = useState('AI');

    return (
        <>
            <section className="news-type-section">
                <ul className="news-type-list">
                    <li onClick={() => setSelectedType('AI')} className={selectedType === 'AI' ? 'active' : ''}>AI</li>
                    <li onClick={() => setSelectedType('Cybersecurity')} className={selectedType === 'Cybersecurity' ? 'active' : ''}>Cybersecurity</li>
                    <li onClick={() => setSelectedType('Quantum Computing')} className={selectedType === 'Quantum Computing' ? 'active' : ''}>Quantum Computing</li>
                    <li onClick={() => setSelectedType('AR/VR')} className={selectedType === 'AR/VR' ? 'active' : ''}>AR/VR</li>
                    <li onClick={() => setSelectedType('Edge Computing')} className={selectedType === 'Edge Computing' ? 'active' : ''}>Edge Computing</li>
                    <li onClick={() => setSelectedType('6G & IoT')} className={selectedType === '6G & IoT' ? 'active' : ''}>6G & IoT</li>
                    <li onClick={() => setSelectedType('Sustainable Tech')} className={selectedType === 'Sustainable Tech' ? 'active' : ''}>Sustainable Tech</li>
                    <li onClick={() => setSelectedType('Gadgets')} className={selectedType === 'Gadgets' ? 'active' : ''}>Gadgets</li>
                    <li onClick={() => setSelectedType('Internet')} className={selectedType === 'Internet' ? 'active' : ''}>Internet</li>
                    <li onClick={() => setSelectedType('Gaming')} className={selectedType === 'Gaming' ? 'active' : ''}>Gaming</li>
                    <li onClick={() => setSelectedType('Cloud')} className={selectedType === 'Cloud' ? 'active' : ''}>Cloud</li>
                    <li onClick={() => setSelectedType('Semiconductors')} className={selectedType === 'Semiconductors' ? 'active' : ''}>Semiconductors</li>
                    <li onClick={() => setSelectedType('Web3')} className={selectedType === 'Web3' ? 'active' : ''}>Web3</li>
                    <li onClick={() => setSelectedType('Green Tech')} className={selectedType === 'Green Tech' ? 'active' : ''}>Green Tech</li>
                    <li onClick={() => setSelectedType('EdTech')} className={selectedType === 'EdTech' ? 'active' : ''}>EdTech</li>
                    <li onClick={() => setSelectedType('HealthTech')} className={selectedType === 'HealthTech' ? 'active' : ''}>HealthTech</li>
                    <li onClick={() => setSelectedType('Autotech')} className={selectedType === 'Autotech' ? 'active' : ''}>Autotech</li>
                    <li onClick={() => setSelectedType('Space Tech')} className={selectedType === 'Space Tech' ? 'active' : ''}>Space Tech</li>
                </ul>
            </section>
            <ShowSixNews category={selectedType} />
        </>
    );
}   