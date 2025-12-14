// ==========================================
// GAMIFICATION SYSTEM
// ==========================================

const BADGE_DEFINITIONS = [
    { id: 'first-step', name: 'Bước Đầu', icon: '👣', bgGradient: 'from-blue-500 to-cyan-500', description: 'Hoàn thành hoạt động học đầu tiên' },
    { id: 'quick-learner', name: 'Học Nhanh', icon: '⚡', bgGradient: 'from-yellow-500 to-orange-500', description: 'Tích lũy 100 điểm' },
    { id: 'flash-master', name: 'Thạo Flashcard', icon: '🎴', bgGradient: 'from-purple-500 to-pink-500', description: 'Tạo 5 flashcard' },
    { id: 'quiz-champ', name: 'Vô Địch Quiz', icon: '🏆', bgGradient: 'from-amber-500 to-orange-500', description: 'Trả lời 10 câu hỏi' },
    { id: 'streak-warrior', name: 'Chiến Sĩ Streak', icon: '🔥', bgGradient: 'from-red-500 to-pink-500', description: 'Duy trì streak 7 ngày' },
    { id: 'knowledge-seeker', name: 'Tìm Tòi Kiến Thức', icon: '🔍', bgGradient: 'from-indigo-500 to-purple-500', description: 'Sử dụng 5 tính năng học tập' },
    { id: 'level-10', name: 'Cấp 10', icon: '👑', bgGradient: 'from-yellow-500 to-red-500', description: 'Đạt cấp độ 10' },
    { id: 'legend', name: 'Huyền Thoại', icon: '⭐', bgGradient: 'from-pink-500 to-purple-500', description: 'Đạt 1000 điểm' }
];

function addPoints(amount, reason = '') {
    state.points += amount;
    state.totalActivities += 1;
    
    // Check level up
    const currentLevel = state.level;
    while (state.points >= getPointsForLevel(state.level + 1)) {
        state.level += 1;
        addBadge('level-' + state.level);
    }
    
    // Update streak
    updateStreak();
    
    // Check for badges
    checkBadgeUnlocks();
    
    // Save to localStorage
    saveGamificationData();
    
    // Show animation if enough points
    if (amount >= 50) {
        showPointsAnimation(amount);
    }
}

function getPointsForLevel(level) {
    return level * 100; // Level 1 = 100, Level 2 = 200, etc
}

function getNextLevelProgress() {
    const currentLevelPoints = getPointsForLevel(state.level);
    const nextLevelPoints = getPointsForLevel(state.level + 1);
    const progress = Math.floor(((state.points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100);
    return Math.min(100, Math.max(0, progress));
}

function updateStreak() {
    const today = new Date().toDateString();
    if (state.lastActivityDate === today) {
        return; // Streak already updated today
    }
    
    if (state.lastActivityDate) {
        const lastDate = new Date(state.lastActivityDate);
        const todayDate = new Date();
        const dayDiff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
            state.streak += 1; // Streak continues
            addPoints(50, 'Daily streak bonus');
        } else if (dayDiff > 1) {
            state.streak = 1; // Streak resets
        }
    } else {
        state.streak = 1;
    }
    
    state.lastActivityDate = today;
}

function addBadge(badgeId) {
    if (!state.badges.find(b => b.id === badgeId)) {
        state.badges.push({
            id: badgeId,
            unlocked_at: new Date().toISOString()
        });
        
        const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);
        if (badge) {
            showToast(`🎉 Huy hiệu mới: ${badge.icon} ${badge.name}!`);
            addPoints(25, 'Badge unlocked');
        }
        saveGamificationData();
    }
}

function checkBadgeUnlocks() {
    // First step
    if (state.totalActivities === 1) {
        addBadge('first-step');
    }
    
    // Quick learner (100 points)
    if (state.points >= 100) {
        addBadge('quick-learner');
    }
    
    // Streak warrior (7 days)
    if (state.streak >= 7) {
        addBadge('streak-warrior');
    }
    
    // Knowledge seeker (should be tracked separately - placeholder)
    if (state.totalActivities >= 5) {
        addBadge('knowledge-seeker');
    }
    
    // Level 10
    if (state.level >= 10) {
        addBadge('level-10');
    }
    
    // Legend (1000 points)
    if (state.points >= 1000) {
        addBadge('legend');
    }
}

function getAllBadges() {
    return BADGE_DEFINITIONS;
}

function saveGamificationData() {
    if (state.currentUser) {
        state.currentUser.gamification = {
            points: state.points,
            level: state.level,
            streak: state.streak,
            badges: state.badges,
            lastActivityDate: state.lastActivityDate,
            totalActivities: state.totalActivities
        };
        
        const users = JSON.parse(localStorage.getItem('pm_users') || '[]');
        const userIndex = users.findIndex(u => u.email === state.currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = state.currentUser;
            localStorage.setItem('pm_users', JSON.stringify(users));
        }
        localStorage.setItem('pm_currentUser', JSON.stringify(state.currentUser));
    }
}

function loadGamificationData() {
    if (state.currentUser && state.currentUser.gamification) {
        state.points = state.currentUser.gamification.points || 0;
        state.level = state.currentUser.gamification.level || 1;
        state.streak = state.currentUser.gamification.streak || 0;
        state.badges = state.currentUser.gamification.badges || [];
        state.lastActivityDate = state.currentUser.gamification.lastActivityDate || null;
        state.totalActivities = state.currentUser.gamification.totalActivities || 0;
    }
}

function showPointsAnimation(points) {
    const randomX = window.innerWidth * 0.3 + Math.random() * window.innerWidth * 0.4;
    const randomY = window.innerHeight * 0.3 + Math.random() * window.innerHeight * 0.4;
    
    const el = document.createElement('div');
    el.textContent = '+' + points + ' 📌';
    el.style.cssText = `
        position: fixed;
        left: ${randomX}px;
        top: ${randomY}px;
        font-size: 1.5rem;
        font-weight: bold;
        color: #f59e0b;
        pointer-events: none;
        z-index: 9999;
        animation: floatUp 1.5s ease-out forwards;
    `;
    
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1500);
}

// Add float animation to style
const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes floatUp {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-100px); opacity: 0; }
    }
`;
document.head.appendChild(floatStyle);
