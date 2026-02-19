import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import LearningOptions from '../components/LearningOptions'
import TrendingCommunities from '../components/TrendingCommunities';
import Footer from '../components/Footer'
import QuickSkillPreview from '../components/QuickSkillPreview';

const Homepage = () => {
    return (
        <div className="font-sans scroll-smooth">
            <Navbar />
            <Hero />
            <LearningOptions />
            <TrendingCommunities />
            <QuickSkillPreview/>
            <Footer />
        </div>
    )
}

export default Homepage