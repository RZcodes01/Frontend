import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, Film, CheckCircle2, Loader2, ArrowLeft, Info } from "lucide-react";
import { uploadReel } from "../api/reels.api";

export default function UploadReel() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "Coding",
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("idle");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith("video/")) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !form.title) return;

        const formData = new FormData();
        formData.append("video", file); // Must match req.file
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("category", form.category);

        try {
            setLoading(true);
            setStatus("uploading");
            await uploadReel(formData);
            setStatus("success");
            setTimeout(() => navigate("/quickskills"), 2000);
        } catch (err) {
            console.error("Upload failed:", err);
            setStatus("idle");
            alert("Failed to upload. Check your connection.");
        } finally {
            setLoading(false);
        }
    };

    if (status === "success") {
        return (
            <div className="min-h-[calc(100vh-72px)] bg-gray-50 flex items-center justify-center text-gray-800">
                <div className="text-center space-y-4 animate-in zoom-in duration-300">
                    <CheckCircle2 size={80} className="text-emerald-500 mx-auto" />
                    <h2 className="text-3xl font-black text-gray-900">Skill Uploaded!</h2>
                    <p className="text-gray-500">Processing on Cloudinary...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-72px)] bg-gray-50 text-gray-800 p-6">
            <div className="max-w-5xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-blue-600 mb-6 font-bold transition-colors">
                    <ArrowLeft size={20} /> Back
                </button>

                <form onSubmit={handleUpload} className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Left: Video Preview */}
                    <div
                        onClick={() => !file && fileInputRef.current.click()}
                        className={`aspect-[9/16] rounded-3xl border-2 border-dashed flex items-center justify-center relative overflow-hidden transition-all ${file ? "border-gray-200" : "border-gray-300 hover:border-blue-400 bg-white cursor-pointer shadow-sm"
                            }`}
                    >
                        {preview ? (
                            <>
                                <video src={preview} className="w-full h-full object-cover" autoPlay loop muted />
                                <button onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(""); }} className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-xl rounded-full hover:bg-red-500 hover:text-white transition-all shadow-md text-gray-600">
                                    <X size={20} />
                                </button>
                            </>
                        ) : (
                            <div className="text-center space-y-3">
                                <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto"><Upload className="text-blue-500" /></div>
                                <p className="font-bold text-gray-700">Choose Video</p>
                                <p className="text-xs text-gray-400">MP4, MOV or WebM</p>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
                    </div>

                    {/* Right: Metadata */}
                    <div className="space-y-6">
                        <h1 className="text-3xl font-black text-gray-900">Reel Details</h1>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Title</label>
                                <input name="title" type="text" value={form.title} onChange={handleChange} placeholder="Give your reel a name" className="w-full bg-white border border-gray-300 rounded-xl p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 placeholder-gray-400" required />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Category</label>
                                <select name="category" value={form.category} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-xl p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none text-gray-900 cursor-pointer">
                                    <option>Coding</option>
                                    <option>Design</option>
                                    <option>Marketing</option>
                                    <option>Soft Skills</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Description</label>
                                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the skill you're sharing..." rows={4} className="w-full bg-white border border-gray-300 rounded-xl p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none text-gray-900 placeholder-gray-400" />
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-2xl flex items-start gap-3 border border-blue-100">
                            <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-500 leading-relaxed">
                                By uploading, you agree that this video follows our community guidelines. Videos are optimized for mobile view automatically.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !file}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            {loading ? <><Loader2 className="animate-spin" size={20} /> Posting Skill...</> : "Publish Reel"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}