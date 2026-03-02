import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api";
import {
    ChevronDown,
    ChevronRight,
    PlayCircle,
    FileText,
} from "lucide-react";
import ParticlesBackground from "@/components/ParticlesBackground";

/* ================= TYPES ================= */

type Lesson = {
    id: string;
    title: string;
    type: "VIDEO" | "PDF";
    duration?: string;
    contentUrl?: string;
};

type Module = {
    id: string;
    title: string;
    lessons: Lesson[];
};

type Instructor = {
    id: string;
    name: string;
    title?: string;
    bio?: string;
    avatar?: string;
};

type Objective = {
    id: string;
    text: string;
};

type Course = {
    id: string;
    title: string;
    description: string;
    price: number;
    level?: string;
    duration?: string;
    instructor?: Instructor;
    modules: Module[];
    objectives?: Objective[];
};

/* ================= COMPONENT ================= */

export default function CourseDetail() {
    const { id } = useParams();

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedModules, setExpandedModules] = useState<string[]>([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [enrolling, setEnrolling] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
    });

    /* ================= LOAD ================= */

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            try {
                const data = await api.getCourseContent(id);
                setCourse(data);

                const storedEmail = localStorage.getItem(
                    `course_email_${id}`
                );

                if (storedEmail) {
                    const enrollmentRes = await api.checkEnrollment(
                        id,
                        storedEmail
                    );
                    setIsEnrolled(enrollmentRes.enrolled);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    /* ================= ENROLL ================= */

    const handleEnroll = async () => {
        if (!id) return;

        if (!formData.fullName || !formData.email || !formData.phone) {
            alert("All fields required");
            return;
        }

        try {
            setEnrolling(true);

            const res = await api.initiateEnrollment({
                courseId: id,
                ...formData,
            });

            if (res.message) {
                localStorage.setItem(
                    `course_email_${id}`,
                    formData.email
                );

                setIsEnrolled(true);
                setShowModal(false);
                alert("Enrollment successful 🎉");
            } else {
                alert("Enrollment failed");
            }
        } catch (error: any) {
            alert(error?.message || "Enrollment failed");
        } finally {
            setEnrolling(false);
        }
    };

    const toggleModule = (moduleId: string) => {
        setExpandedModules((prev) =>
            prev.includes(moduleId)
                ? prev.filter((m) => m !== moduleId)
                : [...prev, moduleId]
        );
    };

    /* ================= STATES ================= */

    if (loading) {
        return (
            <div className="relative min-h-screen bg-black text-white flex items-center justify-center">
                <ParticlesBackground />
                <div className="relative z-10">Loading...</div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="relative min-h-screen bg-black text-white flex items-center justify-center">
                <ParticlesBackground />
                <div className="relative z-10">Course not found.</div>
            </div>
        );
    }

    /* ================= UI ================= */

    return (
        <div className="relative min-h-screen bg-black text-gray-300 overflow-hidden">
            <ParticlesBackground />

            <div className="relative z-10 px-6 py-20">
                <div className="max-w-[1280px] mx-auto grid lg:grid-cols-[1fr_380px] gap-16">

                    {/* LEFT SIDE */}
                    <div className="space-y-16">

                        {/* HERO */}
                        <div className="space-y-6">
                            <h1 className="text-5xl font-extrabold text-white">
                                {course.title}
                            </h1>

                            <p className="text-lg text-gray-400 max-w-3xl">
                                {course.description}
                            </p>
                        </div>

                        {/* CURRICULUM */}
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-6">
                                Course Curriculum
                            </h3>

                            <div className="space-y-4">
                                {course.modules.map((module, index) => {
                                    const expanded =
                                        expandedModules.includes(module.id);

                                    return (
                                        <div
                                            key={module.id}
                                            className="bg-[#151e2b] border border-white/10 rounded-xl"
                                        >
                                            <div
                                                className="flex justify-between items-center p-5 cursor-pointer hover:bg-white/5"
                                                onClick={() =>
                                                    toggleModule(module.id)
                                                }
                                            >
                                                <div className="flex items-center gap-3 text-white font-semibold">
                                                    {expanded ? (
                                                        <ChevronDown size={18} />
                                                    ) : (
                                                        <ChevronRight size={18} />
                                                    )}
                                                    Module {index + 1}:{" "}
                                                    {module.title}
                                                </div>

                                                <span className="text-xs text-gray-500">
                                                    {module.lessons.length} Lessons
                                                </span>
                                            </div>

                                            {expanded && (
                                                <div className="border-t border-white/10">
                                                    {module.lessons.map(
                                                        (lesson) => (
                                                            <div
                                                                key={lesson.id}
                                                                onClick={() => {
                                                                    if (
                                                                        isEnrolled &&
                                                                        lesson.type ===
                                                                        "PDF" &&
                                                                        lesson.contentUrl
                                                                    ) {
                                                                        window.open(
                                                                            lesson.contentUrl,
                                                                            "_blank"
                                                                        );
                                                                    }
                                                                }}
                                                                className={`flex justify-between items-center p-4 border-b border-white/5 ${isEnrolled
                                                                    ? "cursor-pointer hover:bg-white/5"
                                                                    : "opacity-60 cursor-not-allowed"
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-3 text-sm">
                                                                    {lesson.type ===
                                                                        "VIDEO" ? (
                                                                        <PlayCircle
                                                                            size={16}
                                                                            className="text-cyan-400"
                                                                        />
                                                                    ) : (
                                                                        <FileText
                                                                            size={16}
                                                                            className="text-purple-400"
                                                                        />
                                                                    )}
                                                                    {lesson.title}
                                                                </div>

                                                                <span className="text-xs text-gray-400">
                                                                    {isEnrolled
                                                                        ? lesson.duration ||
                                                                        "Available"
                                                                        : "Locked"}
                                                                </span>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="self-start sticky top-32">
                        <div className="bg-[#1a2433] border border-white/10 rounded-2xl p-8 space-y-5">
                            <span className="text-4xl font-extrabold text-white">
                                ₹{course.price.toLocaleString()}
                            </span>

                            <button
                                onClick={() => setShowModal(true)}
                                disabled={isEnrolled}
                                className={`w-full h-14 rounded-xl font-bold text-white ${isEnrolled
                                    ? "bg-green-600 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-500"
                                    }`}
                            >
                                {isEnrolled ? "Enrolled ✓" : "Enroll Now →"}
                            </button>
                            {course.objectives && course.objectives.length > 0 && (
                                <>
                                    <div className="border-t border-white/10" />
                                    <div className="p-2 space-y-5">
                                        <h4 className="text-white font-semibold tracking-wide text-lg">
                                            WHAT YOU'LL LEARN:
                                        </h4>

                                        <ul className="space-y-3 text-gray-300 text-sm">
                                            {course.objectives.map((obj) => (
                                                <li
                                                    key={obj.id}
                                                    className="flex items-start gap-3"
                                                >
                                                    <span className="text-green-400 mt-1">
                                                        ✔
                                                    </span>
                                                    <span>{obj.text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-[#151e2b] p-8 rounded-xl w-full max-w-lg space-y-4">
                        <h3 className="text-xl font-bold text-white">
                            Enter Your Details
                        </h3>

                        <input
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    fullName: e.target.value,
                                })
                            }
                            className="w-full h-10 px-3 bg-black border border-white/10 text-white"
                        />

                        <input
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            className="w-full h-10 px-3 bg-black border border-white/10 text-white"
                        />

                        <input
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    phone: e.target.value,
                                })
                            }
                            className="w-full h-10 px-3 bg-black border border-white/10 text-white"
                        />

                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-600"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleEnroll}
                                disabled={enrolling}
                                className="px-4 py-2 bg-blue-600"
                            >
                                {enrolling ? "Processing..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}