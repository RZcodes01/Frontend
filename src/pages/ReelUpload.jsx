import React, { useState } from "react";
import { uploadReel } from "../api/reels.api";

const ReelUpload = () => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        tags: "",
        category: "",
    });

    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleVideoChange = (e) => {
        setVideo(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!video) {
            alert("Please select a video");
            return;
        }

        try {
            setLoading(true);

            const data = new FormData();
            data.append("video", video);
            data.append("title", form.title);
            data.append("description", form.description);
            data.append("tags", form.tags);
            data.append("category", form.category);

            await uploadReel(data);

            alert("Reel uploaded successfully");

            setForm({
                title: "",
                description: "",
                tags: "",
                category: "",
            });
            setVideo(null);
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-zinc-900 p-6 rounded-xl w-full max-w-md space-y-4"
            >
                <h2 className="text-xl font-semibold text-center">
                    Upload Reel
                </h2>

                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full p-2 bg-zinc-800 rounded"
                    required
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full p-2 bg-zinc-800 rounded"
                />

                <input
                    type="text"
                    name="tags"
                    placeholder="Tags (comma separated)"
                    value={form.tags}
                    onChange={handleChange}
                    className="w-full p-2 bg-zinc-800 rounded"
                />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full p-2 bg-zinc-800 rounded"
                />

                <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="w-full"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black py-2 rounded font-semibold hover:bg-gray-300 transition"
                >
                    {loading ? "Uploading..." : "Upload Reel"}
                </button>
            </form>
        </div>
    );
};

export default ReelUpload;
