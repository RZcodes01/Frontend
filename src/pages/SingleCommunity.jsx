import { Video, Users, BookOpen, Trophy, Sparkles, Crown, Code, Database, Globe, Layers } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchCommunityById } from '../api/community.api';
import { useParams } from 'react-router-dom';

export default function App() {
    const [course, setCourse] = useState([])
    const { communityId } = useParams()
    useEffect(() => {
        const fetchCommunity = async (req, res) => {
            try {
                const res = await fetchCommunityById(communityId)
                setCourse(res.data.community)
                console.log(res.data)
            } catch (error) {
                console.error(error)
            }
        }

        fetchCommunity()
    }, [])
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
            {/* Banner */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <img src={course.bannerImage} alt="Community Banner" className="w-full h-64 object-cover rounded-xl shadow-lg" />
                </div>
            </div>

            {/* Community Information */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="w-8 h-8 text-orange-600" />
                        <h2 className="text-3xl font-bold text-gray-900">{course.name || ""}</h2>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">{course.description}</p>
                </div>

                {/* Syllabus Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <BookOpen className="w-8 h-8 text-orange-600" />
                        <h2 className="text-3xl font-bold text-gray-900">Course Syllabus</h2>
                    </div>
                    <p className="text-gray-600 mb-8">
                        Comprehensive curriculum designed to take you from beginner to advanced Java developer
                    </p>

                    <div className="space-y-4">
                        {/* Module 1 */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Code className="w-6 h-6 text-orange-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Module 1: Java Fundamentals</h3>
                                    <p className="text-gray-600 mb-3">
                                        Master the basics of Java programming and object-oriented concepts
                                    </p>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                                            Variables, Data Types & Operators
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                                            Control Flow & Loops
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                                            Object-Oriented Programming (Classes, Objects, Inheritance)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                                            Exception Handling & File I/O
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Module 2 */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Layers className="w-6 h-6 text-amber-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Module 2: Advanced Java Concepts</h3>
                                    <p className="text-gray-600 mb-3">
                                        Deep dive into advanced programming techniques and patterns
                                    </p>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                                            Collections Framework & Generics
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                                            Multithreading & Concurrency
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                                            Lambda Expressions & Stream API
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                                            Design Patterns & Best Practices
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Module 3 */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Database className="w-6 h-6 text-orange-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Module 3: Database & Backend Development</h3>
                                    <p className="text-gray-600 mb-3">
                                        Learn to build robust backend applications with databases
                                    </p>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                                            JDBC & Database Connectivity
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                                            Hibernate & JPA
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                                            Spring Framework & Spring Boot
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                                            RESTful APIs & Microservices
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Module 4 */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Globe className="w-6 h-6 text-amber-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Module 4: Web Development & Deployment</h3>
                                    <p className="text-gray-600 mb-3">
                                        Build and deploy full-stack Java web applications
                                    </p>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                                            Servlets & JSP
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                                            Spring MVC & Thymeleaf
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                                            Security & Authentication
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                                            Testing, CI/CD & Cloud Deployment
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pro Features Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Crown className="w-8 h-8 text-amber-500" />
                        <h2 className="text-3xl font-bold text-gray-900">Pro Features</h2>
                    </div>
                    <p className="text-gray-600 mb-8">
                        Unlock premium benefits and accelerate your Java learning journey
                    </p>

                    <div className="space-y-3">
                        {/* Live Classes */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                            <div className="flex items-center gap-4 p-4 cursor-pointer">
                                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Video className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Live Classes</h3>
                            </div>
                            <div className="max-h-0 group-hover:max-h-40 transition-all duration-300 overflow-hidden">
                                <p className="text-gray-600 px-4 pb-4">
                                    Attend interactive live sessions with industry experts. Ask questions in real-time
                                    and learn advanced Java concepts through hands-on coding.
                                </p>
                            </div>
                        </div>

                        {/* Exclusive Resources */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                            <div className="flex items-center gap-4 p-4 cursor-pointer">
                                <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <BookOpen className="w-6 h-6 text-amber-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Exclusive Resources</h3>
                            </div>
                            <div className="max-h-0 group-hover:max-h-40 transition-all duration-300 overflow-hidden">
                                <p className="text-gray-600 px-4 pb-4">
                                    Access premium tutorials, code samples, and project templates. Download comprehensive
                                    guides and cheat sheets curated by experts.
                                </p>
                            </div>
                        </div>

                        {/* Certification Prep */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                            <div className="flex items-center gap-4 p-4 cursor-pointer">
                                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Trophy className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Certification Prep</h3>
                            </div>
                            <div className="max-h-0 group-hover:max-h-40 transition-all duration-300 overflow-hidden">
                                <p className="text-gray-600 px-4 pb-4">
                                    Prepare for Oracle Java certifications with mock tests, study materials,
                                    and personalized guidance from certified professionals.
                                </p>
                            </div>
                        </div>

                        {/* Priority Support */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                            <div className="flex items-center gap-4 p-4 cursor-pointer">
                                <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-6 h-6 text-amber-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Priority Support</h3>
                            </div>
                            <div className="max-h-0 group-hover:max-h-40 transition-all duration-300 overflow-hidden">
                                <p className="text-gray-600 px-4 pb-4">
                                    Get your questions answered faster with dedicated support channels.
                                    Receive code reviews and personalized feedback on your projects.
                                </p>
                            </div>
                        </div>

                        {/* Project Mentorship */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                            <div className="flex items-center gap-4 p-4 cursor-pointer">
                                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Users className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Project Mentorship</h3>
                            </div>
                            <div className="max-h-0 group-hover:max-h-40 transition-all duration-300 overflow-hidden">
                                <p className="text-gray-600 px-4 pb-4">
                                    Work on real-world projects with guidance from experienced mentors.
                                    Build your portfolio while learning industry best practices.
                                </p>
                            </div>
                        </div>

                        {/* Early Access */}

                    </div>
                </div>

                {/* CTA Button */}
                <div className="text-center mt-12">
                    <button className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-orange-700 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl">
                        Upgrade to Pro
                    </button>
                </div>
            </div>
        </div>
    );
}