import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import LearningOptions from '../components/LearningOptions'
import Skills from './Skills'
import Projects from '../components/Projects'
import Footer from '../components/Footer'

const Homepage = () => {
    return (
        <div className="font-sans scroll-smooth">
            <Navbar />
            <Hero />
            <LearningOptions />
            {/* <Skills /> */}
            <Projects />
            {/* <Community /> */}
            <Footer />
        </div>
    )
}

export default Homepage