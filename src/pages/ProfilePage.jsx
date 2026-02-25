import React from "react";

const dummyUser = {
    name: "Manjunath Madar",
    email: "manju@example.com",
    role: "mentor", // change to: "admin", "mentor", "company", "student"
    plan: "pro",
    phone: "9876543210",
    username: "manju_dev",
    fullName: "manjunath madar",
    bio: "Full Stack Developer | MERN Stack | AI in Education",
    profileImage: "https://via.placeholder.com/150",
    coverImage: "https://via.placeholder.com/1200x300",
    experience_years: 5,
    expertise: ["React", "Node.js", "MongoDB"],
    friends: [
        { _id: 1, name: "Rahul" },
        { _id: 2, name: "Sneha" }
    ]
};

const ProfilePage = () => {
    const user = dummyUser;

    const renderRoleBadge = () => {
        const colors = {
            student: "bg-blue-500",
            mentor: "bg-green-500",
            admin: "bg-red-500",
            company: "bg-purple-500"
        };

        return (
            <span className={`text-white px-3 py-1 rounded-full text-sm ${colors[user.role]}`}>
                {user.role.toUpperCase()}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Cover Image */}
            <div className="relative">
                <img
                    src={user.coverImage}
                    alt="cover"
                    className="w-full h-60 object-cover"
                />
                <div className="absolute -bottom-16 left-10">
                    <img
                        src={user.profileImage}
                        alt="profile"
                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                    />
                </div>
            </div>

            {/* Profile Content */}
            <div className="mt-20 px-10 pb-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <p className="text-gray-600">@{user.username}</p>
                    </div>
                    {renderRoleBadge()}
                </div>

                {/* Bio */}
                {user.bio && (
                    <p className="mt-4 text-gray-700">{user.bio}</p>
                )}

                {/* Basic Information */}
                <div className="mt-6 bg-white p-6 rounded-xl shadow">
                    <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                    <p><strong>Plan:</strong> {user.plan}</p>
                </div>

                {/* Student Section */}
                {user.role === "student" && (
                    <div className="mt-6 bg-white p-6 rounded-xl shadow">
                        <h2 className="text-lg font-semibold mb-4">Student Profile</h2>
                        <p><strong>Resume:</strong> {user.resume || "Not uploaded"}</p>
                        <p><strong>Friends:</strong> {user.friends.length}</p>
                    </div>
                )}

                {/* Mentor Section */}
                {user.role === "mentor" && (
                    <div className="mt-6 bg-white p-6 rounded-xl shadow">
                        <h2 className="text-lg font-semibold mb-4">Mentor Profile</h2>
                        <p><strong>Experience:</strong> {user.experience_years} years</p>
                        <p><strong>Expertise:</strong> {user.expertise.join(", ")}</p>
                    </div>
                )}

                {/* Company Section */}
                {user.role === "company" && (
                    <div className="mt-6 bg-white p-6 rounded-xl shadow">
                        <h2 className="text-lg font-semibold mb-4">Company Profile</h2>
                        <p><strong>Company Email:</strong> {user.email}</p>
                        <p><strong>Hiring Plan:</strong> {user.plan}</p>
                    </div>
                )}

                {/* Admin Section */}
                {user.role === "admin" && (
                    <div className="mt-6 bg-white p-6 rounded-xl shadow">
                        <h2 className="text-lg font-semibold mb-4">Admin Panel Access</h2>
                        <p>✔ Manage Users</p>
                        <p>✔ Manage Communities</p>
                        <p>✔ Platform Control</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;