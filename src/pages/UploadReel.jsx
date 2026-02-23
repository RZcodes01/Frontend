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
            <div className="min-h-[calc(100vh-72px)] bg-neutral-950 flex items-center justify-center text-white">
                <div className="text-center space-y-4 animate-in zoom-in duration-300">
                    <CheckCircle2 size={80} className="text-emerald-500 mx-auto" />
                    <h2 className="text-3xl font-black">Skill Uploaded!</h2>
                    <p className="text-neutral-400">Processing on Cloudinary...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-72px)] bg-neutral-950 text-white p-6">
            <div className="max-w-5xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-500 hover:text-cyan-400 mb-6 font-bold transition-colors">
                    <ArrowLeft size={20} /> Back
                </button>

                <form onSubmit={handleUpload} className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Left: Video Preview */}
                    <div
                        onClick={() => !file && fileInputRef.current.click()}
                        className={`aspect-[9/16] rounded-3xl border-2 border-dashed flex items-center justify-center relative overflow-hidden transition-all ${file ? "border-neutral-800" : "border-neutral-700 hover:border-cyan-500/50 bg-neutral-900/40 cursor-pointer"
                            }`}
                    >
                        {preview ? (
                            <>
                                <video src={preview} className="w-full h-full object-cover" autoPlay loop muted />
                                <button onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(""); }} className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-xl rounded-full hover:bg-red-500 transition-all">
                                    <X size={20} />
                                </button>
                            </>
                        ) : (
                            <div className="text-center space-y-3">
                                <div className="w-14 h-14 bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto"><Upload className="text-cyan-400" /></div>
                                <p className="font-bold">Choose Video</p>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
                    </div>

                    {/* Right: Metadata */}
                    <div className="space-y-6">
                        <h1 className="text-3xl font-black">Reel Details</h1>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block mb-2">Title</label>
                                <input name="title" type="text" value={form.title} onChange={handleChange} placeholder="Give your reel a name" className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 focus:border-cyan-500 outline-none transition-all" required />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block mb-2">Category</label>
                                <select name="category" value={form.category} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 focus:border-cyan-500 outline-none transition-all appearance-none">
                                    <option>Coding</option>
                                    <option>Design</option>
                                    <option>Marketing</option>
                                    <option>Soft Skills</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block mb-2">Description</label>
                                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the skill you're sharing..." rows={4} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 focus:border-cyan-500 outline-none transition-all resize-none" />
                            </div>
                        </div>

                        <div className="p-4 bg-neutral-900 rounded-2xl flex items-start gap-3 border border-neutral-800">
                            <Info size={18} className="text-cyan-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-neutral-500 leading-relaxed">
                                By uploading, you agree that this video follows our community guidelines. Videos are optimized for mobile view automatically.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !file}
                            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-neutral-800 disabled:text-neutral-600 text-slate-950 font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10"
                        >
                            {loading ? <><Loader2 className="animate-spin" size={20} /> Posting Skill...</> : "Publish Reel"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}