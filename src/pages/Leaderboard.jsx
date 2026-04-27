import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Table, Select, Spin, Empty, Result, Card, Tag, Avatar, ConfigProvider, theme } from "antd";
import { TrophyOutlined, CrownOutlined, ReloadOutlined, UserOutlined } from "@ant-design/icons";
import { Trophy, Medal, ArrowLeft } from "lucide-react";
import { fetchLeaderboard, fetchMyLeaderboardCommunities } from "../api/leaderboard.api";

// ─── Helpers: decode userId and role from JWT stored in localStorage ──────
function getCurrentUserId() {
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) return null;
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload._id || null;
    } catch {
        return null;
    }
}

function getUserRole() {
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) return null;
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.role || null;
    } catch {
        return null;
    }
}

// ─── Rank badge component for top 3 ────────────────────────────
function RankBadge({ rank }) {
    if (rank === 1)
        return (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/30">
                <CrownOutlined className="text-white text-lg" />
            </div>
        );
    if (rank === 2)
        return (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 shadow-lg shadow-slate-400/30">
                <span className="text-white font-black text-base">2</span>
            </div>
        );
    if (rank === 3)
        return (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/30">
                <span className="text-white font-black text-base">3</span>
            </div>
        );
    return <span className="text-blue-300 font-bold text-lg pl-2">#{rank}</span>;
}

// ─── Podium card for top 3 ──────────────────────────────────────
function PodiumCard({ entry, place }) {
    if (!entry) return null;

    const styles = {
        1: {
            border: "border-yellow-500/60",
            bg: "bg-gradient-to-b from-blue-900 to-blue-950",
            badge: "bg-yellow-500 text-blue-950",
            label: "Gold",
            labelColor: "text-yellow-400",
            scoreStyle: "bg-yellow-500 text-blue-950",
            size: "sm:h-80 sm:w-80",
            textSize: "text-2xl",
        },
        2: {
            border: "border-blue-500/60",
            bg: "bg-gradient-to-b from-blue-900 to-blue-950",
            badge: "bg-blue-500 text-white",
            label: "Silver",
            labelColor: "text-blue-300",
            scoreStyle: "bg-blue-800 text-blue-100 border border-blue-600",
            size: "sm:h-72 sm:w-72",
            textSize: "text-xl",
        },
        3: {
            border: "border-orange-500/40",
            bg: "bg-gradient-to-b from-blue-900 to-blue-950",
            badge: "bg-orange-500 text-white",
            label: "Bronze",
            labelColor: "text-orange-400",
            scoreStyle: "bg-orange-500/10 text-orange-300 border border-orange-500/20",
            size: "sm:h-64 sm:w-72",
            textSize: "text-xl",
        },
    };

    const s = styles[place];
    const order = place === 1 ? "order-1 md:order-2" : place === 2 ? "order-2 md:order-1" : "order-3";

    return (
        <div className={`w-full ${s.size} ${s.bg} border-2 ${s.border} rounded-2xl p-6 text-center shadow-lg flex flex-col justify-center relative ${order}`}>
            <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${s.badge} w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-md`}>
                {place}
            </div>
            <p className={`${s.labelColor} font-bold text-sm uppercase tracking-wider mb-2`}>
                {s.label} Medal
            </p>
            <div className="flex justify-center mb-2">
                <Avatar size={48} src={entry.profileImage} icon={<UserOutlined />}
                    className="border-2 border-blue-500/50" />
            </div>
            <h3 className={`font-black ${s.textSize} text-blue-50 mb-1 truncate`}>{entry.name}</h3>
            <p className="text-blue-400 text-sm mb-3">{entry.submissionsCount} submission{entry.submissionsCount !== 1 ? "s" : ""}</p>
            <div className={`${s.scoreStyle} py-2 px-5 rounded-xl font-black inline-block mx-auto text-base`}>
                {entry.totalScore} PTS
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════
// ─── Main Leaderboard Component ─────────────────────────────────
// ═══════════════════════════════════════════════════════════════════
const Leaderboard = () => {
    const currentUserId = useMemo(() => getCurrentUserId(), []);
    const userRole = useMemo(() => getUserRole(), []);

    // ── State ────────────────────────────────────────────────────
    const [communities, setCommunities] = useState([]);
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [currentUserRank, setCurrentUserRank] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [loading, setLoading] = useState(false);
    const [communitiesLoading, setCommunitiesLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── Fetch communities on mount ──────────────────────────────
    useEffect(() => {
        let cancelled = false;
        async function load() {
            setCommunitiesLoading(true);
            try {
                const res = await fetchMyLeaderboardCommunities();
                const list = res.data?.communities || [];
                if (!cancelled) {
                    setCommunities(list);
                    if (list.length > 0) setSelectedCommunity(list[0]._id);
                }
            } catch (err) {
                if (!cancelled) setError("Failed to load your communities. Please try again.");
            } finally {
                if (!cancelled) setCommunitiesLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    // ── Fetch leaderboard when community or page changes ────────
    const loadLeaderboard = useCallback(async (communityId, page, pageSize) => {
        if (!communityId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetchLeaderboard(communityId, page, pageSize);
            const data = res.data;
            setLeaderboard(data.leaderboard || []);
            setCurrentUserRank(data.currentUserRank || null);
            setPagination(prev => ({
                ...prev,
                current: data.page,
                total: data.total
            }));
        } catch (err) {
            const status = err?.response?.status;
            if (status === 403) {
                setError("Access Denied. You are not assigned to this community.");
            } else {
                setError("Failed to load leaderboard. Please try again.");
            }
            setLeaderboard([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedCommunity) {
            setPagination(prev => ({ ...prev, current: 1 }));
            loadLeaderboard(selectedCommunity, 1, pagination.pageSize);
        }
    }, [selectedCommunity]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Table columns ───────────────────────────────────────────
    const columns = [
        {
            title: "Rank",
            dataIndex: "rank",
            key: "rank",
            width: 90,
            render: (rank) => <RankBadge rank={rank} />,
        },
        {
            title: "Student",
            dataIndex: "name",
            key: "name",
            render: (name, record) => (
                <div className="flex items-center gap-3">
                    <Avatar size={36} src={record.profileImage} icon={<UserOutlined />}
                        className="border border-blue-500/30 shrink-0" />
                    <div className="min-w-0">
                        <p className="font-bold text-blue-50 text-base truncate">
                            {name}
                            {record.userId === currentUserId && (
                                <Tag color="gold" className="ml-2 text-xs">YOU</Tag>
                            )}
                        </p>
                        <p className="text-blue-400 text-xs">
                            {record.submissionsCount} submission{record.submissionsCount !== 1 ? "s" : ""} graded
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: "Score",
            dataIndex: "totalScore",
            key: "totalScore",
            width: 180,
            sorter: false,
            render: (score) => (
                <div className="flex items-center gap-3">
                    <div className="flex-1 bg-blue-800 rounded-full h-2 w-24 hidden sm:block">
                        <div
                            className="bg-amber-400 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(100, score)}%` }}
                        />
                    </div>
                    <span className="font-black text-blue-100 text-base whitespace-nowrap">{score} pts</span>
                </div>
            ),
        },
    ];

    // ── Handle table pagination ─────────────────────────────────
    const handleTableChange = (pag) => {
        setPagination(prev => ({ ...prev, current: pag.current, pageSize: pag.pageSize }));
        loadLeaderboard(selectedCommunity, pag.current, pag.pageSize);
    };

    // ── Top 3 for podium (only on page 1) ───────────────────────
    const top3 = pagination.current === 1 ? leaderboard.slice(0, 3) : [];

    // ── Selected community name ─────────────────────────────────
    const selectedCommunityName = communities.find(c => c._id === selectedCommunity)?.name || "Leaderboard";

    // ═══════════════════════════════════════════════════════════════
    // ─── RENDER ─────────────────────────────────────────────────
    // ═══════════════════════════════════════════════════════════════

    // Error state
    if (error && communities.length === 0) {
        return (
            <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
                <Result
                    status="error"
                    title="Something went wrong"
                    subTitle={error}
                    extra={
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            <ReloadOutlined className="mr-2" />
                            Retry
                        </button>
                    }
                />
            </div>
        );
    }

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: "#f59e0b",
                    colorBgContainer: "#1e3a5f",
                    colorBgElevated: "#0f2744",
                    colorBorder: "#1e4976",
                    colorText: "#e2e8f0",
                    colorTextSecondary: "#94a3b8",
                    borderRadius: 12,
                    fontFamily: "'Nunito', sans-serif",
                },
                components: {
                    Table: {
                        headerBg: "#0c1f36",
                        headerColor: "#94a3b8",
                        rowHoverBg: "#1a3554",
                        colorBgContainer: "#132d4a",
                        borderColor: "#1e4976",
                    },
                    Select: {
                        colorBgContainer: "#132d4a",
                        optionSelectedBg: "#1e3a5f",
                    },
                },
            }}
        >
            <div className="min-h-screen bg-blue-50 pb-20">
                {/* ── Top Navigation Bar ─────────────────────────────── */}
                <nav className="bg-blue-900 border-b border-blue-700 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between relative z-30 gap-4 sm:gap-0">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <button
                            onClick={() => window.history.back()}
                            className="p-2 hover:bg-blue-800 rounded-full transition-colors"
                        >
                            <ArrowLeft size={20} className="text-blue-200" />
                        </button>
                        <div className="min-w-0">
                            <h2 className="font-black text-blue-50 text-xl truncate flex items-center gap-2">
                                <TrophyOutlined className="text-amber-400" />
                                {selectedCommunityName}
                            </h2>
                            <p className="text-sm text-blue-300 font-medium">Community Leaderboard</p>
                        </div>
                    </div>

                    {/* ── Community Selector ─────────────────────────── */}
                    <div className="w-full sm:w-72">
                        <Select
                            className="w-full"
                            placeholder="Select a community"
                            loading={communitiesLoading}
                            value={selectedCommunity}
                            onChange={(val) => setSelectedCommunity(val)}
                            size="large"
                            options={communities.map(c => ({
                                value: c._id,
                                label: c.name,
                            }))}
                            notFoundContent={
                                communitiesLoading
                                    ? <Spin size="small" />
                                    : <Empty description="No communities found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            }
                        />
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-4 mt-8">
                    {/* ── Your Rank Card ─────────────────────────────── */}
                    {currentUserRank && (
                        <div className="mb-6">
                            <Card className="border-amber-400/40 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-amber-400/10 border-2 border-amber-400/40 rounded-2xl flex items-center justify-center">
                                            <TrophyOutlined className="text-2xl text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-blue-300 text-sm font-semibold uppercase tracking-wider">Your Rank</p>
                                            <p className="text-3xl font-black text-blue-50">
                                                #{currentUserRank.rank}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-right">
                                        <p className="text-blue-300 text-sm font-semibold uppercase tracking-wider">Your Score</p>
                                        <p className="text-3xl font-black text-amber-400">
                                            {currentUserRank.totalScore} <span className="text-base text-blue-400">pts</span>
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* ── Stats Cards ────────────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-blue-100 p-6 rounded-2xl border border-blue-300 shadow-sm">
                            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">Total Participants</p>
                            <p className="text-4xl font-black text-blue-950">{pagination.total}</p>
                            <p className="text-sm text-blue-500 font-medium mt-1">Ranked students</p>
                        </div>
                        <div className="bg-blue-100 p-6 rounded-2xl border border-blue-300 shadow-sm">
                            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">Top Score</p>
                            <p className="text-4xl font-black text-blue-950">
                                {leaderboard.length > 0 ? leaderboard[0]?.totalScore : 0}
                            </p>
                            <p className="text-sm text-blue-500 font-medium mt-1">Highest achiever</p>
                        </div>
                        <div className="bg-blue-100 p-6 rounded-2xl border border-blue-300 shadow-sm">
                            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">Communities</p>
                            <p className="text-4xl font-black text-blue-950">{communities.length}</p>
                            <p className="text-sm text-blue-500 font-medium mt-1">
                                {userRole === "admin"
                                    ? "All communities"
                                    : userRole === "mentor"
                                    ? "Assigned to"
                                    : "You're enrolled in"}
                            </p>
                        </div>
                    </div>

                    {/* ── Top 3 Podium ───────────────────────────────── */}
                    {top3.length >= 3 && (
                        <div className="mb-12">
                            <h3 className="text-3xl font-black text-blue-900 mb-6 text-center">
                                Top Performers
                            </h3>
                            <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-8 md:gap-4">
                                <PodiumCard entry={top3[1]} place={2} />
                                <PodiumCard entry={top3[0]} place={1} />
                                <PodiumCard entry={top3[2]} place={3} />
                            </div>
                        </div>
                    )}

                    {/* ── Leaderboard Table ──────────────────────────── */}
                    <div className="bg-blue-900 rounded-2xl border border-blue-700 shadow-lg overflow-hidden">
                        <div className="px-6 py-5 border-b border-blue-700">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h3 className="font-black text-blue-50 text-xl">Student Rankings</h3>
                                    <p className="text-base text-blue-300 font-medium mt-0.5">
                                        {loading ? "Loading..." : `Showing ${leaderboard.length} of ${pagination.total} students`}
                                    </p>
                                </div>
                                <button
                                    onClick={() => loadLeaderboard(selectedCommunity, pagination.current, pagination.pageSize)}
                                    className="flex items-center gap-2 px-4 py-2 bg-amber-400/10 text-amber-400 border border-amber-400/30 rounded-lg font-bold text-sm hover:bg-amber-400 hover:text-blue-950 transition-all"
                                    disabled={loading}
                                >
                                    <ReloadOutlined spin={loading} />
                                    Refresh
                                </button>
                            </div>
                        </div>

                        {error && leaderboard.length === 0 ? (
                            <div className="py-16">
                                <Result
                                    status="warning"
                                    title="Failed to load leaderboard"
                                    subTitle={error}
                                    extra={
                                        <button
                                            onClick={() => loadLeaderboard(selectedCommunity, pagination.current, pagination.pageSize)}
                                            className="px-6 py-2 bg-amber-400 text-blue-950 rounded-lg font-bold hover:bg-amber-300 transition-colors"
                                        >
                                            Try Again
                                        </button>
                                    }
                                />
                            </div>
                        ) : (
                            <Table
                                dataSource={leaderboard}
                                columns={columns}
                                rowKey="userId"
                                loading={loading}
                                pagination={{
                                    current: pagination.current,
                                    pageSize: pagination.pageSize,
                                    total: pagination.total,
                                    showSizeChanger: true,
                                    pageSizeOptions: ["10", "20", "50"],
                                    showTotal: (total, range) =>
                                        `${range[0]}-${range[1]} of ${total} students`,
                                }}
                                onChange={handleTableChange}
                                rowClassName={(record) =>
                                    record.userId === currentUserId
                                        ? "!bg-amber-400/10 border-l-4 !border-l-amber-400"
                                        : ""
                                }
                                locale={{
                                    emptyText: (
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description={
                                                <span className="text-blue-300">
                                                    No submissions graded yet in this community
                                                </span>
                                            }
                                        />
                                    ),
                                }}
                                scroll={{ x: 600 }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default Leaderboard;