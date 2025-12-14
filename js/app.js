function renderFriendsModal(container) {
    const styles = getStyles();
    const user = state.currentUser;
    const friends = user.friends || [];
    container.innerHTML = `
        <div class="p-6 space-y-6">
            <div class="text-center">
                <h3 class="text-2xl font-bold ${styles.textPrimary} mb-2">Danh sách bạn bè</h3>
                <p class="${styles.textSecondary} text-sm">Bạn có <span class="font-bold ${getColorClass('text-soft')}">${friends.length}</span> bạn bè</p>
            </div>
            <div class="flex gap-2">
                <input type="email" id="friend-email-input" placeholder="Nhập email bạn..." class="flex-1 ${styles.inputBg} border ${styles.border} rounded-lg px-4 py-2 ${styles.textPrimary} text-sm outline-none ${getColorClass('focus')} transition-all">
                <button onclick="addFriend()" class="px-6 py-2 rounded-lg ${getColorClass('bg')} ${getColorClass('bg-hover')} text-white font-bold transition-all flex items-center gap-2">
                    <i data-lucide="user-plus" size="16"></i> Thêm
                </button>
            </div>
            <div class="max-h-96 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                ${friends.length === 0 ? `
                    <div class="text-center py-8 ${styles.textSecondary}">
                        <i data-lucide="users" size="32" class="mx-auto opacity-30 mb-2"></i>
                        <p>Chưa có bạn bè</p>
                    </div>
                ` : friends.map((friend, idx) => `
                    <div class="p-3 rounded-lg ${styles.inputBg} border ${styles.border} flex items-center justify-between">
                        <div>
                            <p class="font-bold ${styles.textPrimary}">${friend.name}</p>
                            <p class="text-xs ${styles.textSecondary}">${friend.email}</p>
                        </div>
                        <button onclick="removeFriend(${idx})" class="p-2 rounded-lg hover:bg-red-500/10 hover:border-red-500/30 text-red-400 transition-all">
                            <i data-lucide="trash-2" size="16"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
            <div class="flex gap-3 pt-4 border-t ${styles.border}">
                <button onclick="closeModal()" class="btn-core btn-glass flex-1 px-5 py-3 ${styles.textPrimary}">
                    Đóng
                </button>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderMyPromptsModal(container) {
    const styles = getStyles();
    const user = state.currentUser;
    if (!user) {
        container.innerHTML = `<div class="p-8 text-center ${styles.textSecondary}">Vui lòng đăng nhập</div>`;
        return;
    }
    
    const customPrompts = user.customPrompts || [];
    const isTeacher = user.userType === 'teacher';
    
    container.innerHTML = `
        <div class="p-6 space-y-6">
            <div class="text-center">
                <div class="flex items-center justify-center gap-2 mb-3">
                    <i data-lucide="${isTeacher ? 'graduation-cap' : 'book-open'}" class="${isTeacher ? 'text-purple-500' : 'text-blue-500'}" size="24"></i>
                    <h3 class="text-2xl font-bold ${styles.textPrimary}">Các Prompt Của Bạn</h3>
                </div>
                <p class="${styles.textSecondary} text-sm">
                    ${isTeacher 
                        ? '🎓 Bạn là <span class="font-bold text-purple-500">Giáo viên</span> - Prompt sẽ hiển thị cho toàn bộ học sinh' 
                        : '📚 Bạn là <span class="font-bold text-blue-500">Học sinh</span> - Chia sẻ prompt với bạn bè'}
                </p>
            </div>
            
            <button onclick="addPromptToSystem()" class="w-full py-3 rounded-xl ${getColorClass('bg')} hover:opacity-90 text-white font-bold transition-all flex items-center justify-center gap-2">
                <i data-lucide="plus" size="18"></i> Thêm Prompt Mới
            </button>
            
            <div class="max-h-[500px] overflow-y-auto space-y-3 custom-scrollbar pr-2">
                ${customPrompts.length === 0 ? `
                    <div class="text-center py-8 ${styles.textSecondary}">
                        <i data-lucide="list" size="32" class="mx-auto opacity-30 mb-2"></i>
                        <p>Chưa có prompt tùy chỉnh</p>
                    </div>
                ` : customPrompts.map(prompt => `
                    <div class="p-4 rounded-lg ${styles.inputBg} border ${styles.border} space-y-3">
                        <div>
                            <p class="font-bold ${styles.textPrimary}">${prompt.title}</p>
                            <p class="text-sm ${styles.textSecondary}">${prompt.description || 'Không có mô tả'}</p>
                        </div>
                        <p class="text-xs font-mono ${styles.textSecondary} line-clamp-2 bg-black/20 p-2 rounded">${prompt.content}</p>
                        <div class="flex gap-2">
                            ${!isTeacher && prompt.isTeacherFixed ? `
                                <span class="flex-1 py-1 px-2 rounded text-xs text-center bg-orange-500/20 text-orange-500 border border-orange-500/30">
                                    🔒 Prompt cố định
                                </span>
                            ` : `
                                <button onclick="deletePrompt(${prompt.id})" class="flex-1 py-1.5 rounded-lg hover:bg-red-500/10 hover:border-red-500/30 text-red-400 text-xs font-bold transition-all border ${styles.border}">
                                    <i data-lucide="trash-2" size="14" class="inline mr-1"></i> Xóa
                                </button>
                            `}
                            ${!isTeacher && !prompt.isTeacherFixed ? `
                                <button onclick="sharePrompt(${prompt.id})" class="flex-1 py-1.5 rounded-lg ${getColorClass('softBg')} ${getColorClass('softHover')} ${getColorClass('text')} text-xs font-bold transition-all">
                                    <i data-lucide="share-2" size="14" class="inline mr-1"></i> Chia sẻ
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="flex gap-3 pt-4 border-t ${styles.border}">
                <button onclick="closeModal()" class="btn-core btn-glass flex-1 px-5 py-3 ${styles.textPrimary}">
                    Đóng
                </button>
            </div>
        </div>
    `;
    lucide.createIcons();
}
// ==========================================
// 1. STATE MANAGEMENT & INITIALIZATION
// ==========================================

// Phiên bản dữ liệu (Tăng số này lên để reset localStorage của user nếu cấu trúc dữ liệu thay đổi)
const APP_VERSION = '1.1';

// Primary color palette (fixed indigo theme)
const COLOR_PRESETS = {
    indigo: {
        text: 'text-indigo-600',
        textSoft: 'text-indigo-500',
        bg: 'bg-indigo-600',
        bgHover: 'hover:bg-indigo-500',
        focus: 'focus:border-indigo-500',
        softBg: 'bg-indigo-500/10',
        softHover: 'hover:bg-indigo-500/20',
        border: 'border-indigo-500/30',
        shadow: 'shadow-indigo-500/30',
        ring: 'ring-indigo-400/50',
        gradientMain: 'from-indigo-600 to-purple-600',
        gradientBright: 'from-indigo-500 via-purple-500 to-pink-500'
    },
    emerald: {
        text: 'text-emerald-600',
        textSoft: 'text-emerald-500',
        bg: 'bg-emerald-600',
        bgHover: 'hover:bg-emerald-500',
        focus: 'focus:border-emerald-500',
        softBg: 'bg-emerald-500/10',
        softHover: 'hover:bg-emerald-500/20',
        border: 'border-emerald-500/30',
        shadow: 'shadow-emerald-500/30',
        ring: 'ring-emerald-400/50',
        gradientMain: 'from-emerald-600 to-teal-600',
        gradientBright: 'from-emerald-500 via-teal-500 to-lime-500'
    },
    orange: {
        text: 'text-orange-600',
        textSoft: 'text-orange-500',
        bg: 'bg-orange-600',
        bgHover: 'hover:bg-orange-500',
        focus: 'focus:border-orange-500',
        softBg: 'bg-orange-500/10',
        softHover: 'hover:bg-orange-500/20',
        border: 'border-orange-500/30',
        shadow: 'shadow-orange-500/30',
        ring: 'ring-orange-400/50',
        gradientMain: 'from-orange-600 to-amber-600',
        gradientBright: 'from-orange-500 via-amber-500 to-yellow-500'
    },
    sky: {
        text: 'text-sky-600',
        textSoft: 'text-sky-500',
        bg: 'bg-sky-600',
        bgHover: 'hover:bg-sky-500',
        focus: 'focus:border-sky-500',
        softBg: 'bg-sky-500/10',
        softHover: 'hover:bg-sky-500/20',
        border: 'border-sky-500/30',
        shadow: 'shadow-sky-500/30',
        ring: 'ring-sky-400/50',
        gradientMain: 'from-sky-600 to-blue-600',
        gradientBright: 'from-sky-500 via-cyan-500 to-blue-500'
    },
    cyber: {
        text: 'text-lime-400',
        textSoft: 'text-lime-300',
        bg: 'bg-lime-400',
        bgHover: 'hover:bg-lime-300',
        focus: 'focus:border-lime-300',
        softBg: 'bg-lime-400/10',
        softHover: 'hover:bg-lime-400/20',
        border: 'border-lime-400/40',
        shadow: 'shadow-lime-400/30',
        ring: 'ring-lime-300/60',
        gradientMain: 'from-lime-400 to-cyan-400',
        gradientBright: 'from-lime-400 via-cyan-400 to-emerald-300'
    }
};

// Fixed primary color (remove user switching)
const DEFAULT_PRIMARY_COLOR = 'indigo';

// Function to detect initial theme (Auto Dark/Light Mode)
const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('pm_theme');
    if (savedTheme) return savedTheme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
};

// Data Migration Logic (Fix lỗi xung đột dữ liệu cũ)
const initializePrompts = () => {
    const savedVersion = localStorage.getItem('pm_version');
    const savedPrompts = localStorage.getItem('pm_data');

    // Nếu chưa có version hoặc version cũ -> Reset về dữ liệu gốc để tránh lỗi
    if (savedVersion !== APP_VERSION) {
        localStorage.setItem('pm_version', APP_VERSION);
        localStorage.setItem('pm_data', JSON.stringify(MASTER_PROMPTS));
        return MASTER_PROMPTS;
    }
    return savedPrompts ? JSON.parse(savedPrompts) : MASTER_PROMPTS;
};

// Application State
let state = {
    theme: getInitialTheme(),
    prompts: initializePrompts(), // Sử dụng hàm khởi tạo an toàn
    activeCategory: "Tất cả",
    activeSubject: null, 
    searchTerm: "",
    currentView: "library",
    modalOpen: false,
    currentModal: null, 
    activePrompt: null,
    activeTool: null, 
    chatHistory: [],
    isListening: false,
    scanResult: "",
    currentUser: JSON.parse(localStorage.getItem('pm_currentUser')) || null,
    users: JSON.parse(localStorage.getItem('pm_users')) || [],
    // Cho phép user nhập key riêng nếu key chung hết hạn
    userApiKey: localStorage.getItem('pm_api_key') || "",
    // Kiểu trả lời: 'fast' (nhanh - hiển thị toàn bộ) hoặc 'detailed' (chi tiết - typewriter)
    responseMode: 'detailed',
    isLoadingPrompts: false,
    loadingTimer: null,
    // Firebase sync
    firebaseSynced: false,
    // Learning space
    learningTab: 'prompts',
    learningSearch: '',
    learningContext: '', // Nội dung từ prompt hoặc file
    learningFiles: [], // Danh sách files đã upload
    learningResults: [], // Kết quả từ các công cụ
    selectingForLearning: false, // Đang chọn prompt cho Learning Space
    learningSelectedPrompt: null, // Prompt đã chọn
    // Learning session persistence
    learningSessions: [], // Danh sách phiên đã lưu (metadata)
    activeLearningSessionId: null
};

// ==========================================
// FIREBASE SYNC FUNCTIONS
// ==========================================

// Khởi tạo Firebase listeners
function initFirebase() {
    if (!window.firebaseDB) {
        console.warn('Firebase not loaded yet');
        setTimeout(initFirebase, 1000);
        return;
    }
    
    // Listen to users changes
    const usersRef = window.firebaseRef(window.firebaseDB, 'users');
    window.firebaseOnValue(usersRef, (snapshot) => {
        if (snapshot.exists()) {
            const firebaseUsers = [];
            snapshot.forEach((child) => {
                firebaseUsers.push({ id: child.key, ...child.val() });
            });
            state.users = firebaseUsers;
            localStorage.setItem('pm_users', JSON.stringify(firebaseUsers));
        }
    });
    
    // Listen to prompts changes
    const promptsRef = window.firebaseRef(window.firebaseDB, 'prompts');
    window.firebaseOnValue(promptsRef, (snapshot) => {
        if (snapshot.exists()) {
            const firebasePrompts = [];
            snapshot.forEach((child) => {
                firebasePrompts.push({ id: child.key, ...child.val() });
            });
            // Merge with MASTER_PROMPTS
            state.prompts = [...MASTER_PROMPTS, ...firebasePrompts];
            localStorage.setItem('pm_prompts', JSON.stringify(state.prompts));
            if (state.currentView === 'library') {
                renderApp();
            }
        }
    });
    
    state.firebaseSynced = true;
}

// Sync user to Firebase
async function syncUserToFirebase(user) {
    if (!window.firebaseDB || !user?.id) return;
    
    try {
        // Đảm bảo user đã đăng nhập trước khi sync
        if (!window.firebaseAuth?.currentUser) {
            console.warn('⚠️ User chưa đăng nhập, không thể sync');
            return;
        }
        
        const userRef = window.firebaseRef(window.firebaseDB, `users/${user.id}`);
        await window.firebaseSet(userRef, {
            email: user.email || null,
            name: user.name || '',
            userType: user.userType || 'student',
            avatar: user.avatar || null,
            createdAt: user.createdAt || new Date().toISOString(),
            lastLogin: Date.now(),
            customPrompts: user.customPrompts || [],
            friends: user.friends || [],
            favorites: user.favorites || [],
            sharedPrompts: user.sharedPrompts || []
        });
    } catch (error) {
        console.error('❌ Lỗi sync user:', error);
    }
}

// Sync prompt to Firebase
async function syncPromptToFirebase(prompt) {
    if (!window.firebaseDB) return;
    
    const promptRef = window.firebaseRef(window.firebaseDB, `prompts/${prompt.id}`);
    const safePrompt = {
        id: prompt.id,
        title: prompt.title || '',
        description: prompt.description || '',
        content: prompt.content || '',
        category: prompt.category || 'Cá nhân',
        tags: prompt.tags || [],
        createdBy: prompt.createdBy || null,
        createdAt: prompt.createdAt || new Date().toISOString(),
        isShared: prompt.isShared ?? false,
        sharedWith: prompt.sharedWith || [],
        isTeacherFixed: prompt.isTeacherFixed ?? false
    };
    await window.firebaseSet(promptRef, safePrompt);
}

// Delete prompt from Firebase
async function deletePromptFromFirebase(promptId) {
    if (!window.firebaseDB) return;
    
    const promptRef = window.firebaseRef(window.firebaseDB, `prompts/${promptId}`);
    await window.firebaseRemove(promptRef);
}

// Search users in Firebase
async function searchUsersInFirebase(query) {
    if (!window.firebaseDB) return [];
    
    const usersRef = window.firebaseRef(window.firebaseDB, 'users');
    const snapshot = await window.firebaseGet(usersRef);
    
    if (!snapshot.exists()) return [];
    
    const users = [];
    snapshot.forEach((child) => {
        const user = { id: child.key, ...child.val() };
        if (user.email.includes(query) || user.name?.includes(query)) {
            users.push(user);
        }
    });
    
    return users;
}

async function addFriendToFirebase(userId, friendData) {
    if (!window.firebaseDB) {
        return { success: false, error: 'Firebase not initialized' };
    }
    
    try {
        const userRef = window.firebaseRef(window.firebaseDB, `users/${userId}/friends/${friendData.id}`);
        await window.firebaseSet(userRef, {
            name: friendData.name,
            email: friendData.email,
            addedAt: new Date().toISOString()
        });
        
        return { success: true };
    } catch (error) {
        console.error('❌ Lỗi thêm bạn vào Firebase:', error);
        return { success: false, error: error.message };
    }
}

// Firestore chat helpers
async function sendMessage(content, user) {
    if (!window.db || !content || !user) return;

    try {
        await window.addDoc(window.collection(window.db, 'messages'), {
            text: content,
            userId: user.id,
            userName: user.name,
            createdAt: window.serverTimestamp()
        });
    } catch (error) {
        console.error('❌ Lỗi gửi tin nhắn:', error);
    }
}

function listenToMessages() {
    if (!window.db) return () => {};

    const messagesQuery = window.query(
        window.collection(window.db, 'messages'),
        window.orderBy('createdAt', 'asc')
    );

    return window.onSnapshot(messagesQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added' && typeof render === 'function') {
                render(change.doc.data());
            }
        });
    });
}

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

function getStyles() {
    return THEME_CONFIG[state.theme];
}

function getColorClass(type) {
    const palette = COLOR_PRESETS[DEFAULT_PRIMARY_COLOR] || COLOR_PRESETS.indigo;
    switch (type) {
        case 'text': return palette.text;
        case 'text-soft': return palette.textSoft;
        case 'bg-500': return palette.textSoft.replace('text', 'bg');
        case 'bg': return palette.bg;
        case 'bg-hover': return palette.bgHover;
        case 'focus': return palette.focus;
        case 'soft-bg': return palette.softBg;
        case 'soft-hover': return palette.softHover;
        case 'border': return palette.border;
        case 'shadow': return palette.shadow;
        case 'ring': return palette.ring;
        case 'gradient-main': return palette.gradientMain;
        case 'gradient-bright': return palette.gradientBright;
        default: return '';
    }
}

// Empty-state toast renderer (bottom-right, auto-hide)
function renderEmptyOverlay(title = 'Không tìm thấy dữ liệu', message = 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm', imageSrc = 'images/Trạng thái rỗng.png') {
    const styles = getStyles();
    return `
        <div class="fixed bottom-4 right-4 z-[60] animate-emptyToast">
            <div class="${styles.cardBg} border ${styles.border} rounded-xl p-3 shadow-lg flex items-center gap-3 max-w-[340px]">
                <img src="${imageSrc}" alt="Empty" class="w-10 h-10 rounded-lg object-contain" />
                <div class="min-w-0">
                    <h4 class="text-sm font-bold ${styles.textPrimary} truncate">${title}</h4>
                    <p class="text-xs ${styles.textSecondary} truncate">${message}</p>
                </div>
                <button aria-label="Close" onclick="this.closest('[class*=animate-emptyToast]')?.remove()" class="ml-auto p-1 rounded-md ${styles.iconBg} border ${styles.border} ${styles.textSecondary} hover:${styles.textPrimary}">
                    <i data-lucide="x" size="14"></i>
                </button>
            </div>
        </div>
    `;
}

// Imperative helper to show the empty toast outside render
function showEmptyToast(title, message, imageSrc = 'images/Trạng thái rỗng.png') {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = renderEmptyOverlay(title, message, imageSrc);
    const toast = wrapper.firstElementChild;
    if (!toast) return;
    document.body.appendChild(toast);
    if (window.lucide?.createIcons) lucide.createIcons();
    setTimeout(() => toast.remove(), 3800);
}





function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('pm_theme', state.theme);
    applyTheme();
    renderApp();
}

// Generic Gemini caller with auth token
async function callGeminiAPI(prompt) {
    const url = '/api/gemini';
    const idToken = await getFirebaseIdToken();

    const headers = { 'Content-Type': 'application/json' };
    if (idToken) headers['Authorization'] = `Bearer ${idToken}`;

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message || data.error);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ==========================================
// LEARNING SPACE FUNCTIONS
// ==========================================

async function submitLearningPrompt() {
    const textarea = document.getElementById('learning-prompt-input');
    const content = textarea?.value?.trim();
    
    if (!content) {
        showToast('Vui lòng nhập nội dung', 'warning');
        return;
    }
    
    try {
        state.isLoadingPrompts = true;
        renderApp();
        
        // Send to Gemini to process and expand the content
        const enhancedContent = await callGeminiAPI(`
Bạn là một trợ lý giáo dục thông minh. Người dùng đã cung cấp nội dung sau để học:

${content}

Hãy phân tích và trình bày lại nội dung này một cách có cấu trúc, dễ hiểu, chi tiết hơn. Nếu đó là câu hỏi, hãy trả lời đầy đủ. Nếu là chủ đề, hãy giải thích toàn diện.
        `);
        
        // Save to context
        state.learningContext = enhancedContent;
        textarea.value = '';
        
        state.isLoadingPrompts = false;
        renderApp();
        showToast('Nội dung đã được xử lý thành công!', 'success');
    } catch (error) {
        console.error('Error processing prompt:', error);
        state.isLoadingPrompts = false;
        renderApp();
        showEmptyToast('Lỗi xử lý nội dung', error.message);
    }
}

async function handleLearningFileUpload(event) {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;
    
    try {
        state.isLoadingPrompts = true;
        renderApp();
        
        for (const file of files) {
            const fileType = file.type;
            const fileName = file.name;
            const fileExt = fileName.split('.').pop().toLowerCase();
            
            let extractedContent = '';
            
            // Process based on file type
            if (fileType.startsWith('image/')) {
                // For images, use image-scan API (expects imageBase64, mimeType, action)
                const base64 = await fileToBase64(file); // only the data part
                const idToken = await getFirebaseIdToken();
                const headers = { 'Content-Type': 'application/json' };
                if (idToken) headers['Authorization'] = `Bearer ${idToken}`;

                const result = await fetch('/api/image-scan', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ 
                        imageBase64: base64,
                        mimeType: fileType,
                        action: 'scan'
                    })
                });

                if (!result.ok) {
                    const errText = await result.text();
                    throw new Error('Lỗi xử lý ảnh: ' + errText);
                }

                const data = await result.json();
                extractedContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Không thể trích xuất nội dung từ ảnh';
                
            } else if (fileType === 'application/pdf' || fileExt === 'pdf') {
                // For PDF, read as text (basic extraction - limited)
                extractedContent = `[PDF: ${fileName}]\n\nĐây là file PDF. Trình duyệt có giới hạn trong việc đọc PDF. Vui lòng copy-paste nội dung hoặc mô tả nội dung PDF này.`;
                
            } else if (fileType.includes('word') || fileExt === 'doc' || fileExt === 'docx') {
                // For Word, limited support in browser
                extractedContent = `[Word: ${fileName}]\n\nĐây là file Word. Trình duyệt không thể đọc trực tiếp file Word. Vui lòng copy-paste nội dung hoặc mô tả tài liệu này.`;
                
            } else if (fileType.startsWith('video/')) {
                // For video, we'll just save the file reference
                extractedContent = `[Video: ${fileName}]\n\nĐây là file video. Vui lòng mô tả nội dung video để các công cụ có thể xử lý.`;
            } else if (fileType.startsWith('text/')) {
                // Plain text files
                extractedContent = await file.text();
            } else {
                extractedContent = `[File: ${fileName}]\n\nKhông thể trích xuất nội dung tự động. Vui lòng mô tả nội dung file này.`;
            }
            
            // Add to learning files
            state.learningFiles.push({
                name: fileName,
                type: fileType,
                size: file.size,
                content: extractedContent
            });
            
            // Append to context
            state.learningContext = (state.learningContext || '') + `\n\n### Tài liệu: ${fileName}\n\n${extractedContent}`;
        }
        
        // Clear file input
        event.target.value = '';
        
        state.isLoadingPrompts = false;
        renderApp();
        showToast(`Đã tải lên ${files.length} tệp`, 'success');
        
    } catch (error) {
        console.error('Error uploading files:', error);
        state.isLoadingPrompts = false;
        renderApp();
        showEmptyToast('Lỗi tải tệp', error.message);
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function processLearningAction(action) {
    if (!state.learningContext) {
        showToast('Không có nội dung để xử lý', 'warning');
        return;
    }
    
    try {
        state.isLoadingPrompts = true;
        render();
        
        let prompt = '';
        let resultTitle = '';
        let resultIcon = '';
        let resultColor = '';
        
        if (action === 'summary') {
            prompt = `Hãy tóm tắt nội dung sau đây một cách ngắn gọn, súc tích, nêu được các ý chính:\n\n${state.learningContext}`;
            resultTitle = '📝 Tóm tắt nội dung';
            resultIcon = '<i data-lucide="file-text" size="18" class="text-blue-500"></i>';
            resultColor = 'blue';
            
        } else if (action === 'flashcards') {
            prompt = `Dựa trên nội dung sau, tạo các flashcard để ôn tập (định dạng: Câu hỏi | Câu trả lời). Tạo ít nhất 5 flashcard:\n\n${state.learningContext}`;
            resultTitle = '🎴 Flashcards ôn tập';
            resultIcon = '<i data-lucide="layers" size="18" class="text-green-500"></i>';
            resultColor = 'green';
            
        } else if (action === 'quiz') {
            prompt = `Tạo bộ câu hỏi trắc nghiệm từ nội dung sau (4 lựa chọn, đánh dấu đáp án đúng). Tạo ít nhất 5 câu:\n\n${state.learningContext}`;
            resultTitle = '❓ Câu hỏi kiểm tra';
            resultIcon = '<i data-lucide="help-circle" size="18" class="text-purple-500"></i>';
            resultColor = 'purple';
            
        } else if (action === 'explain') {
            prompt = `Giải thích nội dung sau một cách dễ hiểu nhất, như thể bạn đang dạy một học sinh:\n\n${state.learningContext}`;
            resultTitle = '💡 Giải thích chi tiết';
            resultIcon = '<i data-lucide="lightbulb" size="18" class="text-orange-500"></i>';
            resultColor = 'orange';
        }
        
        const result = await callGeminiAPI(prompt);
        
        // Add to results
        state.learningResults.push({
            title: resultTitle,
            content: result,
            icon: resultIcon,
            color: resultColor,
            timestamp: Date.now()
        });
        
        state.isLoadingPrompts = false;
        renderApp();
        showToast('Xử lý thành công!', 'success');
        
    } catch (error) {
        console.error('Error processing learning action:', error);
        state.isLoadingPrompts = false;
        renderApp();
        showEmptyToast('Lỗi xử lý', error.message);
    }
}

function removeLearningFile(index) {
    state.learningFiles.splice(index, 1);
    
    // Rebuild context from remaining files
    state.learningContext = state.learningFiles
        .map(f => `### Tài liệu: ${f.name}\n\n${f.content}`)
        .join('\n\n');
    
    renderApp();
    showToast('Đã xóa tệp', 'info');
}

function removeLearningResult(index) {
    state.learningResults.splice(index, 1);
    renderApp();
    showToast('Đã xóa kết quả', 'info');
}

function clearLearningContext() {
    if (!confirm('Xóa toàn bộ nội dung và kết quả?')) return;
    
    state.learningContext = '';
    state.learningFiles = [];
    state.learningResults = [];
    
    const textarea = document.getElementById('learning-prompt-input');
    if (textarea) textarea.value = '';
    
    renderApp();
    showToast('Đã xóa toàn bộ', 'info');
}

// ==========================================
// LEARNING SESSION PERSISTENCE (Firebase)
// ==========================================

async function saveLearningSession() {
    if (!state.currentUser) {
        showToast('Vui lòng đăng nhập để lưu phiên học', 'warning');
        openModal('login');
        return;
    }

    if (!window.firebaseDB) {
        showEmptyToast('Firebase chưa sẵn sàng', 'Hãy thử lại sau vài giây');
        return;
    }

    const hasContent = (state.learningContext && state.learningContext.trim().length > 0) || state.learningResults.length > 0;
    if (!hasContent) {
        showToast('Chưa có nội dung để lưu', 'info');
        return;
    }

    const titleInput = document.getElementById('learning-session-title');
    const title = titleInput?.value?.trim() || `Phiên học ${new Date().toLocaleString('vi-VN')}`;

    try {
        const sessionRef = window.firebasePush(window.firebaseRef(window.firebaseDB, 'learningSessions'));
        const sessionId = sessionRef.key;
        const now = new Date().toISOString();

        const payload = {
            id: sessionId,
            ownerId: state.currentUser.id,
            ownerName: state.currentUser.name || state.currentUser.email,
            title,
            learningContext: state.learningContext || '',
            learningResults: state.learningResults || [],
            learningFiles: state.learningFiles || [],
            learningTab: state.learningTab || 'prompts',
            createdAt: now,
            updatedAt: now,
            isPublic: true
        };

        await window.firebaseSet(sessionRef, payload);

        const userIndexRef = window.firebaseRef(window.firebaseDB, `users/${state.currentUser.id}/learningSessions/${sessionId}`);
        await window.firebaseSet(userIndexRef, {
            id: sessionId,
            title,
            updatedAt: now,
            createdAt: now,
            isPublic: true
        });

        state.learningSessions = [
            { id: sessionId, title, updatedAt: now, createdAt: now, isPublic: true },
            ...state.learningSessions
        ];
        state.activeLearningSessionId = sessionId;
        renderApp();
        showToast('Đã lưu phiên học', 'success');
    } catch (error) {
        console.error('Lỗi lưu phiên học:', error);
        showEmptyToast('Lỗi lưu phiên học', error.message);
    }
}

async function loadUserLearningSessions() {
    if (!state.currentUser || !window.firebaseDB) return;

    try {
        const listRef = window.firebaseRef(window.firebaseDB, `users/${state.currentUser.id}/learningSessions`);
        const snapshot = await window.firebaseGet(listRef);
        if (snapshot.exists()) {
            const val = snapshot.val();
            const sessions = Object.values(val).sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
            state.learningSessions = sessions;
            renderApp();
        }
    } catch (error) {
        console.error('Lỗi tải danh sách phiên học:', error);
        showEmptyToast('Lỗi tải phiên học', error.message);
    }
}

async function openLearningSession(sessionId) {
    if (!sessionId || !window.firebaseDB) return;

    try {
        const sessionRef = window.firebaseRef(window.firebaseDB, `learningSessions/${sessionId}`);
        const snapshot = await window.firebaseGet(sessionRef);

        if (!snapshot.exists()) {
            showEmptyToast('Không tìm thấy phiên học', 'Link có thể đã bị xóa hoặc không tồn tại');
            return;
        }

        const data = snapshot.val();
        state.learningContext = data.learningContext || '';
        state.learningResults = data.learningResults || [];
        state.learningFiles = data.learningFiles || [];
        state.learningTab = data.learningTab || 'prompts';
        state.activeLearningSessionId = sessionId;

        const titleInput = document.getElementById('learning-session-title');
        if (titleInput) titleInput.value = data.title || '';

        renderApp();
        showToast('Đã mở phiên học', 'info');
    } catch (error) {
        console.error('Lỗi mở phiên học:', error);
        showEmptyToast('Lỗi mở phiên học', error.message);
    }
}

function copyLearningSessionLink(sessionId) {
    if (!sessionId) return;
    const origin = window.location?.origin || '';
    const url = `${origin}?session=${sessionId}`;
    copyToClipboard(url);
    showToast('Đã copy link chia sẻ', 'success');
}

function loadPromptTemplate() {
    console.log('loadPromptTemplate called');
    
    // Set flag that we're selecting prompt for Learning Space
    state.selectingForLearning = true;
    
    // Switch to library view
    state.currentView = 'library';
    
    console.log('State updated:', { selectingForLearning: state.selectingForLearning, currentView: state.currentView });
    
    renderApp();
    
    showToast('Chọn prompt từ thư viện để sử dụng', 'info');
}

function selectPromptForLearning(promptId) {
    console.log('selectPromptForLearning called with promptId:', promptId);
    console.log('Available prompts count:', state.prompts.length);
    
    const prompt = state.prompts.find(p => p.id === promptId);
    if (!prompt) {
        console.error('Prompt not found:', promptId);
        console.log('All prompt IDs:', state.prompts.map(p => p.id));
        showToast('Không tìm thấy prompt', 'error');
        return;
    }
    
    console.log('Found prompt:', prompt.title);
    
    // Save to learning context
    state.learningSelectedPrompt = prompt;
    
    // Switch back to learning space
    state.selectingForLearning = false;
    state.currentView = 'learning';
    
    console.log('Switching to learning view');
    
    renderApp();
    
    // Auto-fill the textarea
    setTimeout(() => {
        const textarea = document.getElementById('learning-prompt-input');
        console.log('Textarea found:', !!textarea);
        if (textarea) {
            textarea.value = prompt.content;
            textarea.focus();
            console.log('Textarea filled with content');
        }
        lucide.createIcons();
    }, 100);
    
    showToast(`Đã chọn: ${prompt.title}`, 'success');
}

function cancelSelectingForLearning() {
    state.selectingForLearning = false;
    state.currentView = 'learning';
    renderApp();
}



function applyTheme() {
    const styles = getStyles();
    const bgDiv = document.getElementById('app-bg');
    bgDiv.className = `fixed inset-0 z-0 pointer-events-none transition-all duration-500 ${styles.bg}`;
    
    if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    const content = document.getElementById('toast-content');
    const msgSpan = document.getElementById('toast-message');
    const styles = getStyles();

    content.className = `backdrop-blur-xl border px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 ${state.theme === 'dark' ? 'bg-slate-900/90 border-emerald-500/30 text-emerald-400' : 'bg-white/90 border-emerald-500/30 text-emerald-600'}`;
    msgSpan.innerText = message;

    container.classList.remove('translate-y-10', 'opacity-0');
    container.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        container.classList.add('translate-y-10', 'opacity-0');
        container.classList.remove('translate-y-0', 'opacity-100');
    }, 3000);
}

function copyToClipboard(text) {
    if (!text) return;
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => showToast("Đã sao chép nội dung!"));
    } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showToast("Đã sao chép nội dung!");
        } catch (err) {
            showToast("Lỗi sao chép!");
        }
        document.body.removeChild(textArea);
    }
}

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Escape regex special chars so placeholders with symbols still replace correctly
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function simpleMarkdown(text) {
    if (!text) return '';
    let codeBlocks = [];
    
    // Lưu code blocks để xử lý sau
    let cleanText = text.replace(/```([\s\S]*?)```/g, (match, content) => {
        codeBlocks.push(content);
        return `__CODEBLOCK_${codeBlocks.length - 1}__`;
    });
    
    cleanText = escapeHtml(cleanText);
    
    // Xử lý Markdown formatting
    let html = cleanText
        .replace(/\*\*(.*?)\*\*/g, `<strong>$1</strong>`)
        .replace(/\*(.*?)\*/g, `<em>$1</em>`)
        .replace(/^#### (.*$)/gim, `<h4 class="text-base font-semibold mt-3 mb-2 flex items-center gap-2"><span class="w-1 h-4 ${getColorClass('bg-500')} rounded-full"></span>$1</h4>`)
        .replace(/^### (.*$)/gim, `<h3 class="text-lg font-bold mt-4 mb-2 flex items-center gap-2"><span class="w-1 h-5 ${getColorClass('bg-500')} rounded-full"></span>$1</h3>`)
        .replace(/^## (.*$)/gim, `<h2 class="text-xl font-bold mt-5 mb-3 flex items-center gap-2"><span class="w-1 h-6 ${getColorClass('bg-500')} rounded-full"></span>$1</h2>`)
        .replace(/^# (.*$)/gim, `<h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${getColorClass('gradient-bright')} mt-6 mb-4 pb-2 border-b border-white/10">$1</h1>`)
        .replace(/^\- (.*$)/gim, `<div class="flex items-start gap-3 ml-2 mb-1"><span class="${getColorClass('text-soft')} mt-2 text-[8px]">●</span><span class="flex-1">$1</span></div>`);
    
    // Xử lý Markdown Tables (markdown table format)
    html = html.replace(/^\|(.+)\n\|[-:\s|]+\n((?:\|.+\n?)*)/gim, (match) => {
        const lines = match.trim().split('\n');
        let tableHtml = `<div class="overflow-x-auto my-4"><table class="w-full border-collapse border ${state.theme === 'dark' ? 'border-slate-600' : 'border-slate-300'}">`;
        
        // Header row
        const headerCells = lines[0].split('|').filter(cell => cell.trim());
        tableHtml += '<thead class="' + (state.theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100') + '">';
        tableHtml += '<tr>';
        headerCells.forEach(cell => {
            tableHtml += `<th class="border ${state.theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} px-4 py-2 font-bold text-left">${cell.trim()}</th>`;
        });
        tableHtml += '</tr></thead>';
        
        // Body rows
        tableHtml += '<tbody>';
        for (let i = 2; i < lines.length; i++) {
            const row = lines[i].trim();
            if (!row) continue;
            const cells = row.split('|').filter(cell => cell.trim());
            tableHtml += '<tr>';
            cells.forEach(cell => {
                tableHtml += `<td class="border ${state.theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} px-4 py-2">${cell.trim()}</td>`;
            });
            tableHtml += '</tr>';
        }
        tableHtml += '</tbody></table></div>';
        return tableHtml;
    });
    
    // Xử lý code blocks
    html = html.replace(/__CODEBLOCK_(\d+)__/g, (match, index) => {
        const content = codeBlocks[index];
        const styles = getStyles();
        const cleanContent = content.trim();
        
        // Kiểm tra nếu là Mermaid diagram
        if (cleanContent.startsWith('mermaid\n') || cleanContent.startsWith('graph') || 
            cleanContent.startsWith('sequenceDiagram') || cleanContent.startsWith('classDiagram') ||
            cleanContent.startsWith('stateDiagram') || cleanContent.startsWith('erDiagram')) {
            
            const mermaidContent = cleanContent.replace(/^mermaid\n/, '');
            const mermaidId = 'mermaid-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            
            return `<div class="my-4 p-4 rounded-xl ${state.theme === 'dark' ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-50 border border-slate-300'} overflow-x-auto">
                        <div class="mermaid" id="${mermaidId}">${escapeHtml(mermaidContent)}</div>
                    </div>`;
        }
        
        // Nếu là code block thường
        const displayContent = escapeHtml(cleanContent);
        return `<div class="${styles.codeBlock} rounded-xl overflow-hidden my-4 shadow-sm w-full group transition-colors duration-300">
                    <div class="flex justify-between items-center px-4 py-2 border-b ${styles.border} ${state.theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}">
                        <span class="text-xs font-mono opacity-70 flex items-center gap-2"><i data-lucide="terminal" size="12"></i> Code</span>
                        <button onclick="copyToClipboard(\`${cleanContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)" class="opacity-60 hover:opacity-100 transition-colors p-1.5 rounded-md ${state.theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-slate-200'}">
                            <i data-lucide="copy" size="14"></i>
                        </button>
                    </div>
                    <div class="p-4 overflow-x-auto custom-scrollbar"><code class="font-mono text-sm whitespace-pre ${state.theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}">${displayContent}</code></div>
                </div>`;
    });
    
    return `<div class="markdown-body leading-7 text-sm space-y-3 w-full whitespace-pre-wrap ${state.theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}">${html}</div>`;
}

// ==========================================
// 3. LOGIC FUNCTIONS
// ==========================================

// --- Prompt Handling (Switch to dedicated chat view) ---
function switchToChatMode(promptId) {
    const prompt = (state.prompts || []).find(p => p.id === promptId);
    if (!prompt) {
        showToast("Không tìm thấy dữ liệu prompt!");
        return;
    }
    state.activePrompt = prompt;
    state.chatHistory = [];
    state.currentView = 'chat';
    renderApp();
}

function openQuickTestModal(promptId) {
    const prompt = state.prompts.find(p => p.id === promptId);
    if (!prompt) {
        showToast("Không tìm thấy dữ liệu prompt!");
        return;
    }
    state.activePrompt = prompt;
    openModal('test');
}

// --- Auth ---
async function handleLogin(e) {
    e.preventDefault();
    const email = document.querySelector('#auth-form input[name="email"]').value;
    const password = document.querySelector('#auth-form input[name="password"]').value;
    
    if (!email || !password) {
        showToast("Vui lòng nhập email và mật khẩu!");
        return;
    }
    
    // Đăng nhập bằng Firebase
    const result = await firebaseLogin(email, password);
    
    if (result.success) {
        // Dữ liệu người dùng sẽ được load bởi watchAuthState
        closeModal();
        renderApp();
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.querySelector('#auth-form input[name="name"]').value;
    const email = document.querySelector('#auth-form input[name="email"]').value;
    const password = document.querySelector('#auth-form input[name="password"]').value;
    const userType = document.querySelector('input[name="userType"]:checked')?.value || 'student';
    
    if (!name || !email || !password) {
        showToast("Vui lòng nhập đầy đủ thông tin!");
        return;
    }
    
    if (password.length < 6) {
        showToast("Mật khẩu phải có ít nhất 6 ký tự!");
        return;
    }
    
    // Đăng ký bằng Firebase
    const result = await firebaseSignUp(email, password, name, userType);
    
    if (result.success) {
        // Dữ liệu người dùng sẽ được load bởi watchAuthState
        closeModal();
        renderApp();
    }
}

// --- Forgot Password - Firebase Password Reset ---
async function handleForgotPassword() {
    const emailInput = document.querySelector('#auth-form input[name="email"]');
    const email = emailInput?.value?.trim();
    
    if (!email) {
        showToast("Vui lòng nhập email!");
        emailInput?.focus();
        return;
    }
    
    // Gửi email reset password bằng Firebase
    const result = await firebaseSendPasswordReset(email);
    
    if (result.success) {
        showToast('✓ Email reset mật khẩu đã được gửi. Kiểm tra hộp thư của bạn!');
        closeModal();
    }
}

// --- Toggle password visibility ---
function togglePasswordVisibility() {
    const input = document.querySelector('#auth-form input[name="password"]');
    const eye = document.getElementById('password-eye');
    if (!input) return;
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    if (eye) {
        eye.setAttribute('data-lucide', isHidden ? 'eye-off' : 'eye');
        lucide.createIcons();
    }
}

function updateUserTypeDisplay() {
    const options = document.querySelectorAll('.user-type-option');
    const selectedValue = document.querySelector('input[name="userType"]:checked')?.value;
    
    options.forEach(option => {
        const box = option.querySelector('.user-type-box');
        const isSelected = option.dataset.type === selectedValue;
        
        if (isSelected) {
            // Chọn
            box.classList.add('border-indigo-500', 'bg-indigo-500/10', 'shadow-lg', 'shadow-indigo-500/20');
            box.classList.remove('border-slate-300', 'border-indigo-200', 'hover:bg-indigo-500/5');
            
            // Highlight icon
            const icon = box.querySelector('[data-lucide]');
            if (icon) {
                if (selectedValue === 'student') {
                    icon.classList.remove('text-purple-500');
                    icon.classList.add('text-blue-500');
                } else {
                    icon.classList.remove('text-blue-500');
                    icon.classList.add('text-purple-500');
                }
            }
        } else {
            // Không chọn
            box.classList.remove('border-indigo-500', 'bg-indigo-500/10', 'shadow-lg', 'shadow-indigo-500/20');
            box.classList.add('border-slate-300');
            box.classList.add('hover:bg-indigo-500/5');
        }
    });
}

async function handleLogout() {
    const result = await firebaseLogout();
    if (result.success) {
        state.currentUser = null;
        state.activeCategory = "Tất cả";
        renderApp();
    }
}

window.toggleAuthMode = function() {
    window.isRegisterMode = !window.isRegisterMode;
    const title = document.getElementById('auth-title');
    const btn = document.getElementById('auth-btn');
    const form = document.getElementById('auth-form');
    const nameField = document.getElementById('name-field');
    const userTypeField = document.getElementById('user-type-field');
    const switchText = document.getElementById('auth-switch-text');
    const switchBtn = document.getElementById('auth-switch-btn');

    if (window.isRegisterMode) {
        title.innerText = "Đăng ký tài khoản";
        btn.innerText = "Tạo tài khoản mới";
        form.onsubmit = handleRegister;
        nameField.classList.remove('hidden');
        userTypeField.classList.remove('hidden');
        nameField.querySelector('input').setAttribute('required', 'true');
        switchText.innerText = "Đã có tài khoản?";
        switchBtn.innerText = "Đăng nhập";
        // Update display khi hiển thị user-type-field
        setTimeout(() => updateUserTypeDisplay(), 100);
    } else {
        title.innerText = "Đăng nhập";
        btn.innerText = "Đăng nhập ngay";
        form.onsubmit = handleLogin;
        nameField.classList.add('hidden');
        userTypeField.classList.add('hidden');
        nameField.querySelector('input').removeAttribute('required');
        switchText.innerText = "Chưa có tài khoản?";
        switchBtn.innerText = "Đăng ký";
    }
    lucide.createIcons();
};

// --- Favorites ---
async function toggleFavorite(e, promptId) {
    e.stopPropagation();
    if (!state.currentUser) {
        openModal('login');
        showToast("Vui lòng đăng nhập để lưu yêu thích!");
        return;
    }

    const user = state.currentUser;
    if (!user.favorites) user.favorites = [];
    
    const isFavorited = user.favorites.includes(promptId);
    
    if (isFavorited) {
        user.favorites = user.favorites.filter(id => id !== promptId);
    } else {
        user.favorites.push(promptId);
    }

    // Sync với Firebase
    try {
        const favRef = window.firebaseRef(window.firebaseDB, `users/${user.id}/favorites`);
        await window.firebaseSet(favRef, user.favorites);
        
        state.currentUser = user;
        localStorage.setItem('pm_currentUser', JSON.stringify(user));
        
        showToast(isFavorited ? "Đã xóa khỏi yêu thích." : "Đã thêm vào yêu thích!");
        renderApp();
    } catch (error) {
        console.error('❌ Lỗi cập nhật yêu thích:', error);
        showToast("❌ Không thể cập nhật. Vui lòng thử lại.");
    }
}

function getAvatarColor(name) {
    const colors = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

// --- Data Management ---
function exportData() {
    const dataToExport = {
        users: state.users,
        prompts: state.prompts,
        theme: state.theme,
        timestamp: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "prompt_master_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showToast("Đã tải xuống file sao lưu!");
}

// Delete prompt from library and user data
function deletePrompt(promptId) {
    if (!promptId) return;
    if (!confirm('Xóa prompt này? Hành động này không thể hoàn tác.')) return;

    // Remove from main list
    state.prompts = state.prompts.filter(p => p.id !== promptId);
    localStorage.setItem('pm_data', JSON.stringify(state.prompts));

    // Remove from users: favorites & customPrompts
    let usersChanged = false;
    state.users = state.users.map(u => {
        const next = { ...u };
        const favLen = next.favorites?.length || 0;
        next.favorites = (next.favorites || []).filter(id => id !== promptId);
        const custLen = next.customPrompts?.length || 0;
        next.customPrompts = (next.customPrompts || []).filter(p => p.id !== promptId);
        if (favLen !== next.favorites.length || custLen !== next.customPrompts.length) usersChanged = true;
        return next;
    });
    if (usersChanged) localStorage.setItem('pm_users', JSON.stringify(state.users));

    // Sync current user cache
    if (state.currentUser) {
        const refreshed = (state.users || []).find(u => u.id === state.currentUser.id);
        if (refreshed) {
            state.currentUser = refreshed;
            localStorage.setItem('pm_currentUser', JSON.stringify(state.currentUser));
        }
    }

    // Reset active prompt if removed
    if (state.activePrompt?.id === promptId) {
        state.activePrompt = null;
        state.currentView = 'library';
    }

    renderApp();
    showToast('Đã xóa prompt thành công');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (importedData.users) localStorage.setItem('pm_users', JSON.stringify(importedData.users));
            if (importedData.prompts) localStorage.setItem('pm_data', JSON.stringify(importedData.prompts));
            if (importedData.theme) localStorage.setItem('pm_theme', importedData.theme);
            
            showToast("Khôi phục dữ liệu thành công! Đang tải lại...");
            setTimeout(() => location.reload(), 1500);
        } catch (error) {
            console.error("Import error:", error);
            showToast("File không hợp lệ!");
        }
    };
    reader.readAsText(file);
}

// --- Voice & Scan ---
function toggleVoiceInput(targetId, btnId) {
    if (!('webkitSpeechRecognition' in window)) {
        showToast("Trình duyệt không hỗ trợ nhận diện giọng nói!");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = false;

    const btn = document.getElementById(btnId);

    recognition.onstart = function() {
        btn.classList.add('text-red-500', 'animate-pulse');
        showToast("Đang nghe...");
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const inputField = document.getElementById(targetId);
        inputField.value = transcript;
        if(targetId === 'preview-prompt') updatePreview(); 
        inputField.dispatchEvent(new Event('input', { bubbles: true }));
    };

    recognition.onerror = function(event) {
        showToast("Lỗi nhận diện: " + event.error);
        btn.classList.remove('text-red-500', 'animate-pulse');
    };

    recognition.onend = function() {
        btn.classList.remove('text-red-500', 'animate-pulse');
    };

    recognition.start();
}

let currentFileBase64 = null;
let currentFileType = null;

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('image-preview');
            const container = document.getElementById('preview-container');
            const placeholder = document.getElementById('upload-placeholder');
            const scanBtn = document.getElementById('scan-btn');
            
            preview.src = e.target.result;
            container.classList.remove('hidden');
            placeholder.classList.add('hidden');
            scanBtn.disabled = false;

            currentFileBase64 = e.target.result.split(',')[1];
            currentFileType = file.type;
        }
        reader.readAsDataURL(file);
    }
}

async function handleImageScan() {
    if (!currentFileBase64) {
        showToast("Vui lòng chọn ảnh trước!");
        return;
    }
    const loading = document.getElementById('scan-loading');
    const resultArea = document.getElementById('scan-result');
    loading.classList.remove('hidden');
    if(loading.querySelector('span')) loading.querySelector('span').innerText = "Đang phân tích ảnh...";

    try {
        // Call internal serverless function for image scanning
        const url = '/api/image-scan';
        const idToken = await getFirebaseIdToken();
        
        const headers = { 'Content-Type': 'application/json' };
        if (idToken) {
            headers['Authorization'] = `Bearer ${idToken}`;
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                imageBase64: currentFileBase64,
                mimeType: currentFileType,
                action: 'scan'
            })
        });

        const data = await response.json();
        if(data.error) throw new Error(data.error.message || data.error);
        
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Không tìm thấy văn bản nào.";
        resultArea.value = text;
        state.scanResult = text;
        showToast("✓ Trích xuất thành công!");
    } catch (error) {
        console.error('handleImageScan Error:', error);
        showToast("✗ Lỗi: " + error.message);
        resultArea.value = "Đã xảy ra lỗi. Vui lòng kiểm tra lại API Key hoặc mạng.";
    } finally {
        loading.classList.add('hidden');
    }
}

async function refineScannedText() {
    const currentText = document.getElementById('scan-result').value;
    if (!currentText || currentText.includes("Đang phân tích") || currentText.includes("lỗi")) {
        showToast("Chưa có nội dung để tinh chỉnh!");
        return;
    }

    const loading = document.getElementById('scan-loading');
    const resultArea = document.getElementById('scan-result');
    if(loading.querySelector('span')) loading.querySelector('span').innerText = "Đang tối ưu hóa prompt...";
    loading.classList.remove('hidden');

    try {
        // Call internal serverless function for text refinement
        const url = '/api/image-scan';
        const idToken = await getFirebaseIdToken();
        
        const headers = { 'Content-Type': 'application/json' };
        if (idToken) {
            headers['Authorization'] = `Bearer ${idToken}`;
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                action: 'refine',
                currentText: currentText,
                imageBase64: '',
                mimeType: ''
            })
        });

        const data = await response.json();
        if(data.error) throw new Error(data.error.message || data.error);

        const refinedText = data.candidates?.[0]?.content?.parts?.[0]?.text || currentText;
        resultArea.value = refinedText;
        state.scanResult = refinedText;
        showToast("Đã tinh chỉnh thành công!");
    } catch (error) {
        console.error(error);
        showToast("Lỗi: " + error.message);
    } finally {
        loading.classList.add('hidden');
    }
}

function transferScanToadd() {
    if (!state.scanResult) {
        showToast("Chưa có nội dung để thêm!");
        return;
    }
    openModal('add', { content: state.scanResult });
}

function suggestPromptsFromScan() {
    const scannedText = document.getElementById('scan-result').value.trim();
    if (!scannedText) {
        showToast("Vui lòng trích xuất văn bản từ ảnh trước!");
        return;
    }
    
    // Tìm từ khóa từ text đã trích xuất
    const keywords = scannedText.toLowerCase().split(/[\s,;.!?]+/);
    
    // Tìm prompts phù hợp dựa trên tags
    const suggestedPrompts = state.prompts.filter(prompt => {
        return prompt.tags.some(tag => {
            const tagLower = tag.toLowerCase();
            return keywords.some(keyword => 
                keyword.length > 2 && (
                    tagLower.includes(keyword) || 
                    keyword.includes(tagLower.substring(0, 3))
                )
            );
        });
    }).slice(0, 6); // Giới hạn 6 gợi ý
    
    if (suggestedPrompts.length === 0) {
        showToast("Không tìm thấy prompt phù hợp. Hãy tạo prompt mới!");
        return;
    }
    
    // Tạo modal hiển thị gợi ý
    const styles = getStyles();
    const suggestionsHTML = suggestedPrompts.map(p => `
        <div class="p-4 rounded-xl border ${styles.border} hover:bg-white/5 cursor-pointer transition-all" onclick="selectSuggestedPrompt(${p.id}, '${scannedText.replace(/"/g, '\\"')}')">
            <h4 class="font-bold ${styles.textPrimary} mb-1">${p.title}</h4>
            <p class="text-sm ${styles.textSecondary} mb-2">${p.description}</p>
            <div class="flex flex-wrap gap-2">
                ${p.tags.map(tag => `<span class="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
    
    // Chèn gợi ý vào bên dưới kết quả
    const scanResultArea = document.getElementById('scan-result').parentElement;
    let suggestionsContainer = document.getElementById('scan-suggestions');
    
    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = 'scan-suggestions';
        suggestionsContainer.className = 'mt-4 p-4 rounded-xl bg-white/5 border border-dashed ' + styles.border;
        scanResultArea.parentElement.appendChild(suggestionsContainer);
    }
    
    suggestionsContainer.innerHTML = `
        <h3 class="font-bold ${styles.textPrimary} mb-3 flex items-center gap-2">
            <i data-lucide="lightbulb" size="18"></i> Prompt gợi ý cho đề bài này:
        </h3>
        <div class="space-y-2 max-h-60 overflow-y-auto">
            ${suggestionsHTML}
        </div>
    `;
    
    lucide.createIcons();
    showToast("Đã tìm thấy " + suggestedPrompts.length + " prompt phù hợp!");
}

function selectSuggestedPrompt(promptId, scannedText) {
    const prompt = (state.prompts || []).find(p => p.id === promptId);
    if (prompt && scannedText) {
        state.activePrompt = prompt;
        closeModal();
        
        // Tự động gửi request với text đã trích xuất
        const previewPrompt = document.getElementById('preview-prompt');
        if (previewPrompt) {
            previewPrompt.value = scannedText;
            // Tự động gọi runPrompt
            setTimeout(() => {
                runPrompt();
            }, 100);
        }
        showToast(`Đã chọn: ${prompt.title}`);
        renderApp();
    }
}

async function generateSmartPrompt() {
    const idea = document.getElementById('smart-idea-input').value;
    if (!idea) {
        showToast("Vui lòng nhập ý tưởng trước!");
        return;
    }

    const btn = document.getElementById('smart-gen-btn');
    const loading = document.getElementById('smart-loading');
    
    btn.disabled = true;
    btn.classList.add('opacity-50');
    loading.classList.remove('hidden');

    try {
        // Call internal serverless function for smart prompt generation
        const url = '/api/smart-generate';
        const idToken = await getFirebaseIdToken();
        
        const headers = { 'Content-Type': 'application/json' };
        if (idToken) {
            headers['Authorization'] = `Bearer ${idToken}`;
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                idea: idea
            })
        });

        const data = await response.json();
        if(data.error) throw new Error(data.error.message || data.error);

        let jsonText = data.candidates[0].content.parts[0].text;
        
        // Loại bỏ markdown code blocks (```json ... ```)
        jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        
        const result = JSON.parse(jsonText);

        // Kiểm tra các trường bắt buộc
        if (!result.title || !result.description || !result.content) {
            throw new Error("JSON thiếu các trường bắt buộc (title, description, content)");
        }

        document.querySelector('input[name="title"]').value = result.title || '';
        document.querySelector('input[name="description"]').value = result.description || '';
        document.querySelector('textarea[name="content"]').value = result.content || '';
        
        const catSelect = document.querySelector('select[name="category"]');
        if (result.category && CATEGORIES.includes(result.category)) {
            catSelect.value = result.category;
        }
        showToast("✓ Đã tạo prompt thành công!");
    } catch (error) {
        console.error('generateSmartPrompt Error:', error);
        showToast("❌ Lỗi: " + error.message);
    } finally {
        btn.disabled = false;
        btn.classList.remove('opacity-50');
        loading.classList.add('hidden');
    }
}

function handleAddSubmit(e) {
    e.preventDefault();
    if (!state.currentUser) {
        showToast('Vui lòng đăng nhập để lưu prompt');
        return;
    }

    if (!Array.isArray(state.currentUser.customPrompts)) {
        state.currentUser.customPrompts = [];
    }

    const formData = new FormData(e.target);
    const newPrompt = {
        id: Date.now(),
        title: formData.get('title'),
        category: formData.get('category'),
        description: formData.get('description'),
        content: formData.get('content'),
        tags: ["New", "User"]
    };
    // Phân quyền lưu prompt
    if (state.currentUser.userType === 'teacher') {
        newPrompt.isTeacherFixed = true;
        MASTER_PROMPTS.push(newPrompt);
        state.prompts.unshift(newPrompt);
        // Sync prompt hệ thống
        syncPromptToFirebase(newPrompt);
    } else {
        state.currentUser.customPrompts.push(newPrompt);
        state.prompts.unshift(newPrompt);
    }

    // Lưu user và state
    const userIndex = state.users.findIndex(u => u.id === state.currentUser.id);
    if (userIndex !== -1) {
        state.users[userIndex] = state.currentUser;
        localStorage.setItem('pm_users', JSON.stringify(state.users));
    }
    localStorage.setItem('pm_currentUser', JSON.stringify(state.currentUser));
    localStorage.setItem('pm_data', JSON.stringify(state.prompts));

    // Sync user profile (chứa customPrompts hoặc metadata)
    syncUserToFirebase(state.currentUser);
    
    closeModal();
    renderApp();
    showToast("Đã thêm prompt mới!");
}

function downloadChatImage() {
    const chatContainer = document.getElementById('chat-container');
    if (!chatContainer) return;
    showToast("Đang tạo ảnh...");
    
    html2canvas(chatContainer, {
        backgroundColor: state.theme === 'dark' ? '#0b0d14' : '#f8fafc',
        scale: 2 
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `chat_export_${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        showToast("Đã tải ảnh chat!");
    }).catch(err => {
        console.error(err);
        showToast("Lỗi khi tạo ảnh!");
    });
}

function copyCurrentPrompt() {
    const text = document.getElementById('preview-prompt').value;
    copyToClipboard(text);
}

function copyAndOpen(url) {
    const text = document.getElementById('preview-prompt').value;
    copyToClipboard(text);
    setTimeout(() => window.open(url, '_blank'), 500);
}

function clearChat() {
    state.chatHistory = [];
    document.getElementById('chat-container').innerHTML = `
        <div class="h-full flex flex-col items-center justify-center ${getStyles().textSecondary} gap-4 opacity-50">
            <i data-lucide="bot" size="64" stroke-width="1"></i><p>Sẵn sàng trò chuyện</p>
        </div>
    `;
}

function updatePreview() {
    const inputs = document.querySelectorAll('.variable-input');
    let content = state.activePrompt?.content || '';
    inputs.forEach(input => {
        const key = input.getAttribute('data-key');
        const val = input.value;
        if (!key) return;
        const safeKey = escapeRegExp(key);
        // If input empty, keep placeholder so user sees required variables
        // Use function replacer so special chars ($, \) show literally
        const replacement = val || key;
        content = content.replace(new RegExp(safeKey, 'g'), () => replacement);
    });
    document.getElementById('preview-prompt').value = content;
}

function toggleResponseMode(mode) {
    state.responseMode = mode;
    // Cập nhật UI nút chọn
    document.querySelectorAll('[data-response-mode]').forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-500/30');
        btn.classList.add('bg-white/5', 'text-slate-400');
    });
    document.querySelector(`[data-response-mode="${mode}"]`).classList.add('bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-500/30');
    document.querySelector(`[data-response-mode="${mode}"]`).classList.remove('bg-white/5', 'text-slate-400');
}

// ==========================================
// TYPEWRITER EFFECT FOR AI MESSAGES
// ==========================================

/**
 * Hàm helper tạo hiệu ứng gõ máy chữ cho tin nhắn AI
 * Hiển thị từ từ smooth, bảo tồn tất cả ký tự đặc biệt
 * @param {HTMLElement} element - Element chứa nội dung
 * @param {string} htmlContent - Nội dung HTML đã được xử lý từ simpleMarkdown
 * @param {number} speed - Tốc độ gõ (ms per character), mặc định 20ms
 */
function typeWriter(element, htmlContent, speed = 100) {
    return new Promise((resolve) => {
        // Parse HTML để lấy danh sách text nodes
        const wrapper = document.createElement('div');
        wrapper.innerHTML = htmlContent;
        
        // Lấy toàn bộ text để đếm ký tự
        const fullText = wrapper.innerText;
        let charIndex = 0;
        
        // Build HTML string progressively
        let builtHTML = '';
        let charCount = 0; // Đếm ký tự đã thêm vào builtHTML
        
        // Parse HTML thành mảng các token
        const tokens = [];
        let i = 0;
        while (i < htmlContent.length) {
            if (htmlContent[i] === '<') {
                // Tag HTML
                const tagEnd = htmlContent.indexOf('>', i);
                if (tagEnd !== -1) {
                    tokens.push({
                        type: 'tag',
                        content: htmlContent.substring(i, tagEnd + 1)
                    });
                    i = tagEnd + 1;
                } else {
                    i++;
                }
            } else {
                // Text node - lấy từng ký tự
                tokens.push({
                    type: 'char',
                    content: htmlContent[i]
                });
                i++;
            }
        }
        
        let tokenIndex = 0;
        
        function typeNextChar() {
            if (charCount >= fullText.length) {
                // Hoàn tất
                element.innerHTML = htmlContent;
                
                // Highlight code blocks
                const codeElements = element.querySelectorAll('pre code');
                codeElements.forEach((block) => {
                    if (window.hljs && block.textContent.trim()) {
                        try {
                            hljs.highlightElement(block);
                        } catch (e) {}
                    }
                });
                
                lucide.createIcons();
                resolve();
                return;
            }
            
            // Thêm token tiếp theo
            if (tokenIndex < tokens.length) {
                const token = tokens[tokenIndex];
                
                if (token.type === 'tag') {
                    // Tag HTML - thêm luôn
                    builtHTML += token.content;
                    tokenIndex++;
                    setTimeout(typeNextChar, 0); // Không delay cho tag
                } else {
                    // Character
                    if (charCount < fullText.length) {
                        builtHTML += token.content;
                        charCount++;
                        tokenIndex++;
                        
                        // Render HTML
                        element.innerHTML = builtHTML;
                        
                        // Highlight code blocks
                        const codeElements = element.querySelectorAll('pre code');
                        codeElements.forEach((block) => {
                            if (window.hljs && block.textContent.trim()) {
                                try {
                                    hljs.highlightElement(block);
                                } catch (e) {}
                            }
                        });
                        
                        setTimeout(typeNextChar, speed);
                    }
                }
            }
        }
        
        typeNextChar();
    });
}

// Helper: Get Firebase ID Token for authenticated API calls
async function getFirebaseIdToken() {
    if (!window.firebaseAuth?.currentUser) return null;
    try {
        return await window.firebaseAuth.currentUser.getIdToken();
    } catch (error) {
        console.error('❌ Lỗi lấy token:', error);
        return null;
    }
}

// API Call Logic (Updated with better Error Handling & User Key)
async function runPrompt() {
    const promptText = document.getElementById('preview-prompt').value;
    const temperature = parseFloat(document.getElementById('temp-slider').value);
    
    if(!promptText) return;
    const chatContainer = document.getElementById('chat-container');
    const styles = getStyles();

    if(state.chatHistory.length === 0) chatContainer.innerHTML = '';

    state.chatHistory.push({ role: 'user', content: promptText });
    const userMsgHTML = `
        <div class="flex gap-4 justify-end">
            <div class="max-w-[85%] rounded-2xl p-5 shadow-md bg-indigo-600 text-white rounded-tr-sm">
                <p class="whitespace-pre-wrap text-sm leading-relaxed">${escapeHtml(promptText)}</p>
            </div>
            <div class="w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center mt-1"><i data-lucide="user" class="text-white" size="16"></i></div>
        </div>
    `;
    chatContainer.insertAdjacentHTML('beforeend', userMsgHTML);
    lucide.createIcons();
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const loadingId = 'loading-' + Date.now();
    const loadingHTML = `
        <div id="${loadingId}" class="flex gap-4 justify-start">
            <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center mt-1 shadow-lg shadow-indigo-600/30"><i data-lucide="loader-2" class="animate-spin text-white" size="16"></i></div>
            <div class="${styles.cardBg} rounded-2xl p-4 border ${styles.border}">
                <div class="flex gap-1"><span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span><span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span><span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span></div>
            </div>
        </div>
    `;
    chatContainer.insertAdjacentHTML('beforeend', loadingHTML);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        // Call internal serverless function endpoint
        const url = '/api/gemini';
        const idToken = await getFirebaseIdToken();
        
        const headers = { 'Content-Type': 'application/json' };
        if (idToken) {
            headers['Authorization'] = `Bearer ${idToken}`;
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ 
                prompt: promptText,
                temperature: temperature
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message || data.error || "API Error");
        }

        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi từ AI.";
        
        document.getElementById(loadingId).remove();
        state.chatHistory.push({ role: 'ai', content: responseText });
        
        // Tạo bong bóng chat của AI trước (rỗng)
        const aiMsgHTML = `
            <div class="flex gap-4 justify-start">
                <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center mt-1 shadow-lg shadow-indigo-600/30 flex-shrink-0"><i data-lucide="bot" class="text-white" size="16"></i></div>
                <div class="ai-message-content max-w-[85%] rounded-2xl p-5 shadow-md ${styles.cardBg} border ${styles.border} ${styles.textPrimary} rounded-tl-sm min-h-[2rem]">
                    <!-- Content will be filled by typeWriter -->
                </div>
            </div>
        `;
        chatContainer.insertAdjacentHTML('beforeend', aiMsgHTML);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Lấy element content vừa tạo
        const aiContentElement = chatContainer.querySelector('.ai-message-content:last-of-type');
        
        // Xử lý nội dung (highlight code, format markdown, etc)
        const htmlContent = simpleMarkdown(responseText);
        
        // Chọn kiểu hiển thị dựa trên responseMode
        if (state.responseMode === 'fast') {
            // Kiểu Nhanh: Hiển thị toàn bộ ngay lập tức
            aiContentElement.innerHTML = htmlContent;
            
            // Highlight code blocks
            const codeElements = aiContentElement.querySelectorAll('pre code');
            codeElements.forEach((block) => {
                if (window.hljs && block.textContent.trim()) {
                    try {
                        hljs.highlightElement(block);
                    } catch (e) {}
                }
            });
        } else {
            // Kiểu Chi tiết: Typewriter effect
            await typeWriter(aiContentElement, htmlContent, 20);
        }
        
        // Render công thức LaTeX/KaTeX
        if (window.renderMathInElement) {
            renderMathInElement(aiContentElement, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},      // Math hiển thị độc lập ($$...$$)
                    {left: '$', right: '$', display: false},       // Math hiển thị nội tuyến ($...$)
                    {left: '\\(', right: '\\)', display: false},   // Math nội tuyến (\(...\))
                    {left: '\\[', right: '\\]', display: true}     // Math độc lập (\[...\])
                ],
                throwOnError: false
            });
        }
        
        // Render Mermaid diagrams
        if (window.mermaid) {
            try {
                await mermaid.contentLoaded();
            } catch (e) {
                console.error('Mermaid rendering error:', e);
            }
        }
        
        // Lưu responseText vào state để các function khác có thể truy cập
        const resultIndex = state.chatHistory.length - 1;
        
        // Thêm action buttons cho kết quả AI
        const actionButtonsHTML = `
            <div class="flex gap-2 mt-4 flex-wrap">
                <button onclick="summarizeResult(${resultIndex})" class="px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/30 text-xs font-bold transition-all flex items-center gap-2">
                    <i data-lucide="file-text" size="14"></i> Tóm tắt
                </button>
                <button onclick="createFlashcards(${resultIndex})" class="px-4 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 border border-purple-500/30 text-xs font-bold transition-all flex items-center gap-2">
                    <i data-lucide="credit-card" size="14"></i> Flashcard
                </button>
                <button onclick="createQuiz(${resultIndex})" class="px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/30 text-xs font-bold transition-all flex items-center gap-2">
                    <i data-lucide="help-circle" size="14"></i> Câu hỏi
                </button>
                <button onclick="copyToClipboard(\`${responseText.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)" class="px-4 py-2 rounded-lg bg-gray-500/10 hover:bg-gray-500/20 text-gray-500 border border-gray-500/30 text-xs font-bold transition-all flex items-center gap-2">
                    <i data-lucide="copy" size="14"></i> Sao chép
                </button>
            </div>
        `;
        aiContentElement.insertAdjacentHTML('afterend', actionButtonsHTML);
        
        // Tạo icons Lucide
        lucide.createIcons();
        chatContainer.scrollTop = chatContainer.scrollHeight;

    } catch (error) {
        document.getElementById(loadingId).remove();
        const errorHTML = `
            <div class="flex gap-4 justify-start">
                <div class="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center mt-1"><i data-lucide="alert-triangle" class="text-white" size="16"></i></div>
                <div class="max-w-[85%] rounded-2xl p-4 bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                    <strong>Lỗi kết nối:</strong> ${error.message}
                    <br/><br/>Gợi ý: Kiểm tra lại kết nối mạng hoặc API Key.
                </div>
            </div>
        `;
        chatContainer.insertAdjacentHTML('beforeend', errorHTML);
        lucide.createIcons();
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

// ==========================================
// 4. RENDER FUNCTIONS
// ==========================================

function renderApp() {
    const root = document.getElementById('root');
    const styles = getStyles();
    let contentHTML = `${renderHeader()}`;

    if (state.currentView === 'chat') {
        contentHTML += renderChatView();
    } else if (state.currentView === 'showcase') {
        contentHTML += renderShowcase();
    } else if (state.currentView === 'learning') {
        contentHTML += renderLearningSpace();
    } else {
        contentHTML += renderLibrary();
    }

    // Restore bottom navigation for mobile
    contentHTML += renderBottomNav();

    root.innerHTML = contentHTML;
    root.className = `relative z-10 transition-colors duration-500 ${styles.textPrimary}`; 
    lucide.createIcons();
    document.getElementById('search-input')?.addEventListener('input', (e) => {
        state.searchTerm = e.target.value;
        renderApp();
        document.getElementById('search-input').focus(); 
    });
    document.getElementById('learning-search-input')?.addEventListener('input', (e) => {
        state.learningSearch = e.target.value;
        renderApp();
        document.getElementById('learning-search-input').focus(); 
    });
}

function renderHeader() {
    const styles = getStyles();
    let userSectionHTML = '';

    if (state.currentUser) {
        const initial = state.currentUser.name.charAt(0).toUpperCase();
        const avatarColor = state.currentUser.avatarColor || getAvatarColor(state.currentUser.name);
        const avatarText = state.currentUser.avatarText || initial;

        userSectionHTML = `
            <div class="flex items-center gap-3 relative group/profile cursor-pointer">
                <button onclick="toggleTheme(); renderApp();" class="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-full border ${styles.border} ${styles.iconBg} text-xs font-semibold hover:border-indigo-500/50 hover:text-indigo-500 transition-colors">
                    <i data-lucide="sun" class="${styles.textSecondary}" size="16"></i>
                    <span class="${styles.textSecondary}">Sáng/Tối</span>
                </button>
                <div class="text-right hidden sm:block" onclick="openModal('login')">
                    <p class="text-xs ${styles.textSecondary}">Xin chào,</p>
                    <p class="text-sm font-bold ${styles.textPrimary} hover:text-indigo-400 transition-colors">${state.currentUser.name}</p>
                </div>
                <div class="w-10 h-10 ${state.currentUser.avatarImage ? 'bg-cover bg-center' : avatarColor} rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/20 hover:ring-indigo-400/50 transition-all overflow-hidden" style="${state.currentUser.avatarImage ? `background-image: url(${state.currentUser.avatarImage})` : ''}" onclick="openModal('login')">
                    ${!state.currentUser.avatarImage ? avatarText : ''}
                </div>
                
                <div class="absolute top-full right-0 mt-2 w-48 ${styles.cardBg} border ${styles.border} rounded-xl shadow-xl overflow-hidden hidden group-hover/profile:block animate-fadeIn">
                    <div class="py-2">
                        <button onclick="setCategory('Cá nhân')" class="w-full text-left px-4 py-2 text-sm ${styles.textPrimary} hover:bg-white/5 flex items-center gap-2">
                            <i data-lucide="heart" size="16" class="text-red-500"></i> Yêu thích
                        </button>
                        <button onclick="exportData()" class="w-full text-left px-4 py-2 text-sm ${styles.textPrimary} hover:bg-white/5 flex items-center gap-2">
                            <i data-lucide="download" size="16" class="text-blue-500"></i> Sao lưu dữ liệu
                        </button>
                        <label for="import-file" class="w-full text-left px-4 py-2 text-sm ${styles.textPrimary} hover:bg-white/5 flex items-center gap-2 cursor-pointer">
                            <i data-lucide="upload" size="16" class="text-emerald-500"></i> Khôi phục dữ liệu
                        </label>
                        <input type="file" id="import-file" accept=".json" class="hidden" onchange="importData(event)">
                        <button onclick="handleLogout()" class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 border-t ${styles.border}">
                            <i data-lucide="log-out" size="16"></i> Đăng xuất
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        userSectionHTML = `
            <div class="flex items-center gap-3">
                <button onclick="toggleTheme(); renderApp();" class="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-full border ${styles.border} ${styles.iconBg} text-xs font-semibold hover:border-indigo-500/50 hover:text-indigo-500 transition-colors">
                    <i data-lucide="sun" class="${styles.textSecondary}" size="16"></i>
                    <span class="${styles.textSecondary}">Sáng/Tối</span>
                </button>
                <button onclick="openModal('login')" class="px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 border ${styles.border} ${state.theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'}">
                Đăng nhập
                </button>
            </div>
        `;
    }

    const quickAction = (icon, label, action, isPrimary = false) => {
        const baseClasses = 'btn-core flex items-center gap-2 px-5 py-2.5 text-sm';
        let styleClasses = '';
        
        // Phân biệt hiệu ứng riêng cho từng nút
        if (label === 'Thư viện') {
            styleClasses = `btn-nav-library ${styles.textPrimary}`;
        } else if (label === 'Showcase') {
            styleClasses = `btn-nav-showcase ${styles.textPrimary}`;
        } else if (isPrimary) {
            styleClasses = 'btn-primary text-white shadow-lg';
        } else {
            styleClasses = `btn-glass ${styles.textPrimary}`;
        }
        
        return `
            <button onclick="${action}" class="${baseClasses} ${styleClasses}">
                <i data-lucide="${icon}" size="16"></i>
                <span>${label}</span>
            </button>
        `;
    };

    return `
        <header class="relative z-40 w-full">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex items-center gap-4">
                <div class="flex items-center gap-3 cursor-pointer group" onclick="switchView('library')">
                    <div class="w-10 h-10 bg-gradient-to-br ${getColorClass('gradient-main')} rounded-xl flex items-center justify-center shadow-lg ${getColorClass('shadow')} group-hover:scale-110 transition-transform">
                        <i data-lucide="terminal" class="text-white" size="22"></i>
                    </div>
                    <span class="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${state.theme === 'dark' ? 'from-white via-slate-200 to-white' : 'from-slate-900 via-slate-700 to-slate-900'} hidden sm:inline">
                        PromptMaster<span class="${getColorClass('text-soft')}">.vn</span>
                    </span>
                </div>

                <div class="flex-1 hidden md:flex items-center justify-center gap-3">
                    ${quickAction('home', 'Thư viện', "switchView('library')", false)}
                    ${quickAction('book-open', 'Học tập', "switchView('learning')", false)}
                    ${quickAction('globe-2', 'Showcase', "switchView('showcase')", false)}
                    ${quickAction('plus-circle', 'Thêm prompt', "openModal('add')", true)}
                    ${quickAction('scan', 'Quét ảnh', "openModal('scan')", true)}
                </div>

                <div class="flex items-center gap-3 ml-auto">
                    ${userSectionHTML}
                </div>
            </div>
        </header>
    `;
}

function renderBottomNav() {
    const styles = getStyles();
    const isDark = state.theme === 'dark';
    const activeKey = state.currentModal === 'add' ? 'add' : (state.currentModal === 'login' ? 'profile' : state.currentView);
    const baseClass = `${isDark ? 'bg-slate-900/90 border-slate-700 text-slate-200' : 'bg-white/90 border-slate-200 text-slate-700'}`;

    const item = (key, icon, label, action) => {
        const isActive = activeKey === key;
        const activeStyles = isActive ? (isDark ? 'text-indigo-300' : 'text-indigo-600') : styles.textSecondary;
        const weight = isActive ? 'font-bold' : 'font-medium';
        const badge = isActive ? (isDark ? 'bg-indigo-500/15' : 'bg-indigo-50') : (isDark ? 'bg-white/5' : 'bg-slate-100');
        return `
            <button onclick="${action}" class="flex flex-col items-center gap-1 flex-1 ${activeStyles} ${weight}">
                <span class="p-2 rounded-full ${badge} border ${styles.border} shadow-sm">
                    <i data-lucide="${icon}" size="18"></i>
                </span>
                <span class="text-[11px] leading-none">${label}</span>
            </button>
        `;
    };

    return `
        <nav class="fixed bottom-0 left-0 w-full ${baseClass} backdrop-blur-md border-t md:hidden z-50 flex justify-around py-3 px-2 gap-1">
            ${item('library', 'home', 'Trang chủ', "switchView('library')")}
            ${item('showcase', 'globe-2', 'Thế giới AI', "switchView('showcase')")}
            ${item('learning', 'book-open', 'Học tập', "switchView('learning')")}
            ${item('add', 'plus-circle', 'Thêm mới', "openModal('add')")}
            ${item('profile', 'user', 'Tài khoản', "openModal('login')")}
        </nav>
    `;
}

function renderLibrary() {
    const styles = getStyles();
    const filteredPrompts = state.prompts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(state.searchTerm.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(state.searchTerm.toLowerCase()));

        let matchesCategory = false;
        if (state.activeCategory === "Tất cả") {
            matchesCategory = true;
        } else if (state.activeCategory === "Cá nhân") {
            if (!state.currentUser) return false;
            const isFavorite = state.currentUser.favorites.includes(p.id);
            matchesCategory = isFavorite;
        } else {
            matchesCategory = p.category === state.activeCategory;
        }

        const matchesSubject = (state.activeCategory === "Giáo dục" && state.activeSubject)
            ? p.tags.some(t => t === state.activeSubject)
            : true;

        return matchesSearch && matchesCategory && matchesSubject;
    });

    const isEmpty = !state.isLoadingPrompts && filteredPrompts.length === 0;

    return `
        ${renderHero()}
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 animate-slideUp relative z-10">
            ${state.selectingForLearning ? `
                <div class="mb-6 ${styles.cardBg} border-2 border-purple-500/50 rounded-xl p-4 flex items-center justify-between animate-pulse">
                    <div class="flex items-center gap-3">
                        <i data-lucide="book-open" class="text-purple-500" size="24"></i>
                        <div>
                            <p class="font-bold ${styles.textPrimary}">Đang chọn prompt cho Không gian học tập</p>
                            <p class="text-sm ${styles.textSecondary}">Click vào biểu tượng 📖 ở prompt để chọn</p>
                        </div>
                    </div>
                    <button onclick="cancelSelectingForLearning()" class="px-4 py-2 rounded-lg ${styles.iconBg} border ${styles.border} ${styles.textPrimary} hover:bg-red-500/10 hover:border-red-500/50 transition-all">
                        <i data-lucide="x" size="16" class="inline mr-1"></i> Hủy
                    </button>
                </div>
            ` : ''}

            <div class="flex gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x mb-2">
                ${CATEGORIES.map(cat => {
                    if (cat === "Cá nhân" && !state.currentUser) return '';
                    return `
                        <button onclick="setCategory('${cat}')" class="whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 snap-center ${state.activeCategory === cat ? 'btn-core btn-primary text-white shadow-lg transform scale-105' : `btn-core btn-glass ${styles.textSecondary} hover:${styles.textPrimary} hover:scale-105`}">
                            ${cat === "Cá nhân" ? '<i data-lucide="heart" size="14" class="inline mb-0.5 mr-1 text-red-400" fill="currentColor"></i>' : ''} ${cat}
                        </button>
                    `
                }).join('')}
            </div>

            ${state.activeCategory === "Giáo dục" ? `
                <div class="flex gap-2 overflow-x-auto pb-6 scrollbar-hide snap-x mb-2 animate-fadeIn">
                    <button onclick="setSubject(null)" class="whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 snap-center border ${styles.border} ${!state.activeSubject ? 'bg-emerald-500 text-white shadow-md' : `${styles.glass} ${styles.textSecondary} hover:bg-emerald-500/10`}">
                        Tất cả
                    </button>
                    ${SUBJECT_LIST.map(sub => `
                        <button onclick="setSubject('${sub}')" class="whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 snap-center border ${styles.border} ${state.activeSubject === sub ? 'bg-emerald-500 text-white shadow-md transform scale-105' : `${styles.glass} ${styles.textSecondary} hover:bg-emerald-500/10`}">
                            ${sub}
                        </button>
                    `).join('')}
                </div>
            ` : '<div class="mb-8"></div>'}

            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold ${styles.textPrimary} flex items-center gap-3">
                    <i data-lucide="zap" class="text-indigo-500"></i>
                    ${state.activeCategory === "Tất cả" ? "Khám phá Prompt" : (state.activeSubject ? `${state.activeCategory} > ${state.activeSubject}` : state.activeCategory)}
                </h2>
                <span class="${styles.textSecondary} font-mono text-xs ${styles.glass} px-3 py-1 rounded-full border ${styles.border}">${filteredPrompts.length} kết quả</span>
            </div>

            ${isEmpty ? renderEmptyOverlay('No Data Found', 'Không tìm thấy prompt phù hợp. Hãy thử từ khóa khác hoặc xóa bộ lọc.') : ''}

            ${state.isLoadingPrompts
                ? renderSkeletonLoader(6)
                : (filteredPrompts.length > 0
                    ? `
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            ${filteredPrompts.map(p => renderPromptCard(p)).join('')}
                        </div>
                    `
                    : `
                        <div class="text-center py-32 opacity-50">
                            <i data-lucide="${state.activeCategory === 'Cá nhân' ? 'heart-off' : 'search'}" class="w-16 h-16 mx-auto mb-4 text-slate-500"></i>
                            <h3 class="text-xl font-medium">${state.activeCategory === 'Cá nhân' ? 'Bạn chưa lưu prompt nào vào yêu thích' : 'Không tìm thấy kết quả nào'}</h3>
                        </div>
                    `
                )}
        </main>
    `;
}

function renderChatView() {
    const styles = getStyles();
    const prompt = state.activePrompt;

    if (!prompt) {
        return `
            <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fadeIn">
                <div class="${styles.cardBg} border ${styles.border} rounded-2xl p-10 text-center shadow-lg space-y-4">
                    <div class="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center">
                        <i data-lucide="alert-circle" size="24"></i>
                    </div>
                    <h2 class="text-2xl font-bold ${styles.textPrimary}">Chưa chọn Prompt để chạy thử</h2>
                    <p class="${styles.textSecondary}">Quay lại thư viện và chọn một Prompt để mở chế độ chat.</p>
                    <div class="pt-2">
                        <button onclick="switchView('library')" class="btn-core btn-primary px-6 py-3 text-white shadow-lg">Quay lại thư viện</button>
                    </div>
                </div>
            </main>
        `;
    }

    templateVariables = {};
    const matches = prompt.content.match(/\[(.*?)\]/g);
    if (matches) matches.forEach(m => templateVariables[m] = '');

    return `
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 animate-fadeIn">
            <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <p class="${styles.textSecondary} text-xs uppercase tracking-widest">Chế độ Chat thử</p>
                    <h1 class="text-2xl font-bold ${styles.textPrimary} flex items-center gap-2">
                        <i data-lucide="message-square" size="18" class="text-emerald-500"></i>
                        ${prompt.title}
                    </h1>
                </div>
                <div class="flex gap-2">
                    <button onclick="switchView('library')" class="btn-core btn-glass px-5 py-2 ${styles.textPrimary} flex items-center gap-2">
                        <i data-lucide="arrow-left" size="16"></i> Quay lại thư viện
                    </button>
                    ${state.currentUser ? `<button onclick="deletePrompt(${prompt.id})" class="btn-core btn-danger px-4 py-2 text-white flex items-center gap-2">
                        <i data-lucide="trash-2" size="16"></i> Xóa
                    </button>` : ''}
                </div>
            </div>

            <div class="grid gap-6 lg:grid-cols-[32%_1fr] items-start">
                <section class="${styles.cardBg} border ${styles.border} rounded-2xl shadow-lg flex flex-col h-full">
                    <div class="p-5 border-b ${styles.border} flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-indigo-500/20 rounded-lg text-indigo-500"><i data-lucide="sparkles" size="18"></i></div>
                            <div>
                                <p class="text-sm font-bold ${styles.textPrimary}">Cấu hình Prompt</p>
                                <p class="text-xs ${styles.textSecondary}">Điền biến số & chỉnh Temperature</p>
                            </div>
                        </div>
                        <span class="text-[11px] font-mono ${styles.textSecondary} px-2 py-1 rounded-lg border ${styles.border}">${prompt.category}</span>
                    </div>

                    <div class="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar" id="variables-container">
                        ${Object.keys(templateVariables).length > 0 ? Object.keys(templateVariables).map((key, idx) => `
                            <div>
                                <label class="text-xs font-bold ${styles.textAccent} mb-1.5 flex justify-between ml-1">
                                    ${key.replace(/[\[\]]/g, '')}
                                    <button onclick="toggleVoiceInput('var-input-${idx}', 'mic-btn-${idx}')" id="mic-btn-${idx}" class="text-xs opacity-50 hover:opacity-100 hover:text-indigo-500 transition-colors" title="Nói để nhập"><i data-lucide="mic" size="12"></i></button>
                                </label>
                                <div class="flex gap-2">
                                    <input id="var-input-${idx}" class="variable-input flex-1 ${styles.inputBg} border ${styles.border} rounded-lg px-3 py-2 text-sm ${styles.textPrimary} focus:border-indigo-500 outline-none transition-all" placeholder="..." data-key="${key}" oninput="updatePreview()">
                                </div>
                            </div>
                        `).join('') : `<div class="text-center ${styles.textSecondary} italic text-sm mt-6">Prompt này không có biến số cần điền.</div>`}

                        <div class="pt-4 border-t ${styles.border}">
                            <label class="text-xs font-bold ${styles.textSecondary} mb-2 block flex justify-between">
                                Độ sáng tạo (Temperature) <span id="temp-val">0.7</span>
                            </label>
                            <input type="range" id="temp-slider" min="0" max="1" step="0.1" value="0.7" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" oninput="document.getElementById('temp-val').innerText = this.value">
                        </div>

                        <div class="pt-2">
                            <label class="text-xs font-bold ${styles.textSecondary} mb-2 block">Preview Prompt</label>
                            <textarea id="preview-prompt" class="w-full ${styles.inputBg} border ${styles.border} rounded-lg p-3 text-xs ${styles.textSecondary} font-mono h-32 resize-none focus:border-indigo-500 outline-none" readonly>${prompt.content}</textarea>
                            <button onclick="copyCurrentPrompt()" class="mt-2 text-xs flex items-center gap-1 text-indigo-500 hover:text-indigo-400 font-bold ml-auto"><i data-lucide="copy" size="12"></i> Sao chép</button>
                        </div>

                        <div class="pt-2 border-t ${styles.border} space-y-3">
                            <div class="text-[10px] font-bold uppercase tracking-widest ${styles.textSecondary} text-center">Kiểu trả lời</div>
                            <div class="grid grid-cols-2 gap-2">
                                <button data-response-mode="fast" onclick="toggleResponseMode('fast')" class="py-2 px-3 rounded-lg border ${styles.border} bg-white/5 text-slate-400 text-xs font-bold transition-all hover:bg-white/10">
                                    <i data-lucide="zap" size="14" class="inline mr-1"></i> Nhanh
                                </button>
                                <button data-response-mode="detailed" onclick="toggleResponseMode('detailed')" class="py-2 px-3 rounded-lg border ${styles.border} bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 transition-all">
                                    <i data-lucide="type" size="14" class="inline mr-1"></i> Chi tiết
                                </button>
                            </div>
                        </div>

                        <button onclick="runPrompt()" class="btn-core btn-primary w-full px-6 py-3 text-white shadow-lg flex items-center justify-center gap-2">
                            <i data-lucide="play" size="18" fill="currentColor"></i> Gửi cho Gemini
                        </button>

                        <div class="pt-4 border-t ${styles.border} space-y-2">
                            <div class="text-[10px] font-bold uppercase tracking-widest ${styles.textSecondary} text-center">Chạy nhanh trên nền tảng khác</div>
                            <div class="grid grid-cols-4 gap-2">
                                ${AI_TOOLS.map(tool => `
                                    <button onclick="copyAndOpen('${tool.url}')" class="aspect-square rounded-xl border ${styles.border} hover:bg-white/5 flex flex-col items-center justify-center gap-1 transition-all group relative overflow-hidden" title="Copy & Mở ${tool.name}">
                                        <div class="w-6 h-6"><img src="${tool.icon}" class="w-full h-full object-contain"></div>
                                        <span class="text-[9px] font-medium opacity-60 group-hover:opacity-100 transition-opacity ${styles.textSecondary}">${tool.name}</span>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </section>

                <section class="rounded-2xl border ${styles.border} ${styles.cardBg} h-[calc(100vh-220px)] min-h-[520px] flex flex-col relative overflow-hidden">
                    <div class="p-4 border-b ${styles.border} flex justify-between items-center ${styles.glass} sticky top-0 left-0 right-0 z-10">
                        <span class="text-sm font-bold text-emerald-500 flex items-center gap-2"><i data-lucide="bot" size="16"></i> Chat Session</span>
                        <div class="flex gap-2">
                            <button onclick="downloadChatImage()" class="text-xs ${styles.textSecondary} hover:text-indigo-500 px-3 py-1 rounded-full border ${styles.border} hover:border-indigo-500/30 transition-all flex items-center gap-1">
                                <i data-lucide="image-down" size="14"></i> Tải ảnh chat
                            </button>
                            <button onclick="clearChat()" class="text-xs ${styles.textSecondary} hover:text-red-500 px-3 py-1 rounded-full border ${styles.border} hover:border-red-500/30 transition-all">Clear</button>
                        </div>
                    </div>
                    <div id="chat-container" class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        <div class="h-full flex flex-col items-center justify-center ${styles.textSecondary} gap-4 opacity-50">
                            <i data-lucide="bot" size="64" stroke-width="1"></i><p>Sẵn sàng trò chuyện</p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    `;
}

// ==========================================
// SUBMIT PROBLEM MODAL & SUGGESTION
// ==========================================
function renderSubmitProblemModal(container) {
    const styles = getStyles();
    container.innerHTML = `
        <div class="p-6 border-b ${styles.border} bg-gradient-to-r from-indigo-900/10 to-purple-900/10">
            <h2 class="text-2xl font-bold ${styles.textPrimary} flex items-center gap-3"><i data-lucide="send" class="text-indigo-500"></i> Gửi đề bài & Nhận gợi ý Prompt</h2>
            <p class="text-sm ${styles.textSecondary} mt-2">Mô tả đề bài của bạn, chúng tôi sẽ gợi ý các prompt phù hợp hoặc tạo prompt mới để giải quyết.</p>
        </div>
        <div class="p-8 flex-1 overflow-y-auto">
            <div class="space-y-6">
                <!-- Tab buttons -->
                <div class="flex gap-2 border-b ${styles.border}">
                    <button onclick="switchProblemTab('text')" class="px-4 py-2 border-b-2 border-indigo-500 text-indigo-500 font-bold transition-all flex items-center gap-2" id="tab-text">
                        <i data-lucide="type" size="18"></i> Nhập văn bản
                    </button>
                    <button onclick="switchProblemTab('image')" class="px-4 py-2 text-slate-500 hover:text-slate-400 font-bold transition-all flex items-center gap-2" id="tab-image">
                        <i data-lucide="image" size="18"></i> Tải ảnh lên
                    </button>
                </div>
                
                <!-- Text input tab -->
                <div id="text-tab-content" class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold ${styles.textPrimary} mb-2">Nhập đề bài / Mô tả vấn đề của bạn</label>
                        <textarea id="problem-input" placeholder="VD: Tôi cần giải bài toán về hàm số bậc 2. Cho f(x) = x² + 2x + 3. Tìm đỉnh của parabol..." class="w-full h-40 ${styles.inputBg} border ${styles.border} rounded-xl px-4 py-3 ${styles.textPrimary} placeholder-slate-400 focus:border-indigo-500 outline-none resize-none"></textarea>
                    </div>
                </div>
                
                <!-- Image upload tab -->
                <div id="image-tab-content" class="hidden space-y-4">
                    <div class="upload-area rounded-2xl border-2 border-dashed ${state.theme === 'dark' ? 'border-slate-700 hover:border-indigo-500 bg-slate-800/30' : 'border-slate-300 hover:border-indigo-500 bg-slate-50'} flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all relative group">
                        <input type="file" id="problem-image-input" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer z-10" onchange="handleProblemImageSelect(event)">
                        <div id="problem-preview-placeholder" class="pointer-events-none">
                            <div class="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-500">
                                <i data-lucide="image-plus" size="32"></i>
                            </div>
                            <p class="font-bold ${styles.textPrimary} mb-1">Tải ảnh chứa đề bài lên</p>
                            <p class="text-sm ${styles.textSecondary}">Hoặc kéo thả ảnh vào đây</p>
                        </div>
                        <div id="problem-image-preview" class="hidden absolute inset-0 z-0 p-4">
                            <img id="problem-preview-img" class="w-full h-full object-contain rounded-xl">
                            <div class="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span class="text-white bg-black/50 px-4 py-2 rounded-lg font-medium">Thay đổi ảnh</span>
                            </div>
                        </div>
                    </div>
                    <button onclick="recognizeImageText()" class="btn-core btn-primary w-full px-6 py-3 text-white shadow-lg flex items-center justify-center gap-2" id="ocr-btn">
                        <i data-lucide="search" size="18"></i>
                        Nhận diện văn bản
                    </button>
                    <div id="ocr-loading" class="hidden text-center">
                        <div class="inline-flex items-center gap-2 text-indigo-500">
                            <i data-lucide="loader-2" class="animate-spin" size="20"></i>
                            <span>Đang nhận diện văn bản...</span>
                        </div>
                    </div>
                </div>
                
                <div id="suggestions-container" class="hidden">
                    <h3 class="font-bold ${styles.textPrimary} mb-3">Các Prompt gợi ý:</h3>
                    <div id="suggestions-list" class="space-y-3">
                        <!-- Suggestions will be inserted here -->
                    </div>
                </div>
                
                <div id="custom-prompt-container" class="hidden">
                    <h3 class="font-bold ${styles.textPrimary} mb-3">Hoặc tạo Prompt tùy chỉnh:</h3>
                    <textarea id="custom-prompt-text" placeholder="Prompt được tạo sẽ hiển thị ở đây..." class="w-full h-32 ${styles.inputBg} border ${styles.border} rounded-xl px-4 py-3 ${styles.textPrimary} focus:border-indigo-500 outline-none resize-none" readonly></textarea>
                    <button onclick="useCustomPrompt()" class="btn-core btn-primary mt-3 w-full px-6 py-3 text-white shadow-lg">
                        Sử dụng Prompt này
                    </button>
                </div>
                
                <div class="flex gap-3 pt-4">
                    <button onclick="suggestPromptsForProblem()" class="btn-core btn-primary flex-1 px-6 py-3 text-white shadow-lg flex items-center justify-center gap-2">
                        <i data-lucide="search" size="18"></i>
                        Tìm Prompt phù hợp
                    </button>
                    <button onclick="generatePromptForProblem()" class="btn-core btn-glass flex-1 px-5 py-3 ${styles.textPrimary} flex items-center justify-center gap-2">
                        <i data-lucide="sparkles" size="18"></i>
                        Tạo Prompt mới
                    </button>
                </div>
            </div>
        </div>
    `;
}

function suggestPromptsForProblem() {
    const problemText = document.getElementById('problem-input').value.trim();
    if (!problemText) {
        showToast('Vui lòng nhập đề bài!');
        return;
    }
    
    // Tìm từ khóa từ đề bài
    const keywords = problemText.toLowerCase().split(/[\s,;.!?]+/);
    
    // Tìm prompts phù hợp dựa trên tags
    const suggestedPrompts = state.prompts.filter(prompt => {
        return prompt.tags.some(tag => {
            const tagLower = tag.toLowerCase();
            return keywords.some(keyword => 
                keyword.length > 2 && (
                    tagLower.includes(keyword) || 
                    keyword.includes(tagLower.substring(0, 3))
                )
            );
        });
    }).slice(0, 5); // Giới hạn 5 gợi ý
    
    // Hiển thị gợi ý
    const suggestionsList = document.getElementById('suggestions-list');
    if (suggestedPrompts.length > 0) {
        suggestionsList.innerHTML = suggestedPrompts.map(p => `
            <div class="p-4 rounded-xl border ${getStyles().border} hover:bg-white/5 cursor-pointer transition-all" onclick="selectPromptForProblem(${p.id})">
                <h4 class="font-bold ${getStyles().textPrimary} mb-1">${p.title}</h4>
                <p class="text-sm ${getStyles().textSecondary} mb-2">${p.description}</p>
                <div class="flex flex-wrap gap-2">
                    ${p.tags.map(tag => `<span class="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');
        document.getElementById('suggestions-container').classList.remove('hidden');
    } else {
        showToast('Không tìm thấy prompt phù hợp. Hãy thử tạo prompt mới!');
    }
}

function selectPromptForProblem(promptId) {
    const prompt = (state.prompts || []).find(p => p.id === promptId);
    const problemText = document.getElementById('problem-input').value.trim();
    
    if (prompt && problemText) {
        state.activePrompt = prompt;
        closeModal();
        
        // Tự động gửi request với đề bài
        const previewPrompt = document.getElementById('preview-prompt');
        if (previewPrompt) {
            previewPrompt.value = problemText;
            // Tự động gọi runPrompt
            setTimeout(() => {
                runPrompt();
            }, 100);
        }
        showToast(`Đã chọn: ${prompt.title}`);
        renderApp();
    }
}

function generatePromptForProblem() {
    const problemText = document.getElementById('problem-input').value.trim();
    if (!problemText) {
        showToast('Vui lòng nhập đề bài!');
        return;
    }
    
    // Tạo prompt tự động từ đề bài
    const customPrompt = `Tôi có một đề bài như sau: ${problemText}\n\nHãy:\n1. Phân tích đề bài và xác định vấn đề cần giải quyết.\n2. Đề xuất các bước giải quyết chi tiết.\n3. Cung cấp ví dụ hoặc giải thích cụ thể nếu cần.\n4. Tóm tắt kết luận cuối cùng.`;
    
    document.getElementById('custom-prompt-text').value = customPrompt;
    document.getElementById('custom-prompt-container').classList.remove('hidden');
    showToast('Prompt đã được tạo!');
}

function useCustomPrompt() {
    const customPrompt = document.getElementById('custom-prompt-text').value;
    const problemText = document.getElementById('problem-input').value.trim();
    
    // Tạo prompt tạm thời
    const tempPrompt = {
        id: Date.now(),
        title: 'Prompt từ đề bài',
        category: 'Khác',
        description: 'Prompt được tạo từ đề bài của bạn',
        content: customPrompt,
        tags: ['Tùy chỉnh']
    };
    
    state.activePrompt = tempPrompt;
    closeModal();
    
    // Tự động gửi request với đề bài
    const previewPrompt = document.getElementById('preview-prompt');
    if (previewPrompt && problemText) {
        previewPrompt.value = problemText;
        setTimeout(() => {
            runPrompt();
        }, 100);
    }
    
    showToast('Đang giải quyết đề bài...');
    renderApp();
}

// ==========================================
// PROBLEM IMAGE & OCR FUNCTIONS
// ==========================================
function switchProblemTab(tab) {
    const textTab = document.getElementById('tab-text');
    const imageTab = document.getElementById('tab-image');
    const textContent = document.getElementById('text-tab-content');
    const imageContent = document.getElementById('image-tab-content');
    
    if (tab === 'text') {
        textTab.classList.add('border-b-2', 'border-indigo-500', 'text-indigo-500');
        textTab.classList.remove('text-slate-500', 'hover:text-slate-400');
        imageTab.classList.remove('border-b-2', 'border-indigo-500', 'text-indigo-500');
        imageTab.classList.add('text-slate-500', 'hover:text-slate-400');
        textContent.classList.remove('hidden');
        imageContent.classList.add('hidden');
    } else {
        imageTab.classList.add('border-b-2', 'border-indigo-500', 'text-indigo-500');
        imageTab.classList.remove('text-slate-500', 'hover:text-slate-400');
        textTab.classList.remove('border-b-2', 'border-indigo-500', 'text-indigo-500');
        textTab.classList.add('text-slate-500', 'hover:text-slate-400');
        imageContent.classList.remove('hidden');
        textContent.classList.add('hidden');
    }
    lucide.createIcons();
}

function handleProblemImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = document.getElementById('problem-preview-img');
        img.src = e.target.result;
        document.getElementById('problem-image-preview').classList.remove('hidden');
        document.getElementById('problem-preview-placeholder').classList.add('hidden');
    };
    reader.readAsDataURL(file);
}

function recognizeImageText() {
    const img = document.getElementById('problem-preview-img');
    if (!img.src) {
        showToast('Vui lòng chọn ảnh trước!');
        return;
    }
    
    const ocrBtn = document.getElementById('ocr-btn');
    const ocrLoading = document.getElementById('ocr-loading');
    
    ocrBtn.disabled = true;
    ocrLoading.classList.remove('hidden');
    
    // Sử dụng Tesseract.js để nhận diện văn bản
    // Nếu chưa load, sẽ load từ CDN
    if (!window.Tesseract) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
        script.onload = () => {
            performOCR(img.src, ocrBtn, ocrLoading);
        };
        document.head.appendChild(script);
    } else {
        performOCR(img.src, ocrBtn, ocrLoading);
    }
}

async function performOCR(imageSrc, ocrBtn, ocrLoading) {
    try {
        // Nhận diện tiếng Việt
        const { data: { text } } = await Tesseract.recognize(imageSrc, 'vie');
        
        // Đưa kết quả vào textarea
        const problemInput = document.getElementById('problem-input');
        problemInput.value = text;
        
        // Chuyển về tab text
        switchProblemTab('text');
        
        showToast('Nhận diện thành công! Hãy bấm "Tìm Prompt phù hợp" hoặc "Tạo Prompt mới"');
    } catch (error) {
        console.error('OCR error:', error);
        showToast('Lỗi: Không thể nhận diện văn bản. Vui lòng thử lại hoặc nhập thủ công.');
    } finally {
        ocrBtn.disabled = false;
        ocrLoading.classList.add('hidden');
    }
}

function renderHero() {
    const styles = getStyles();
    const heroBgStyle = "background-image: url('images/bia chinh.png'); background-size: cover; background-position: center;";
    const overlayClass = state.theme === 'dark' ? 'bg-black/70' : 'bg-white/60 backdrop-blur-[2px]';

    const fireflies = Array.from({ length: 15 }).map((_, i) => {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 5 + Math.random() * 10;
        const size = 2 + Math.random() * 4;
        return `<div class="firefly-dot animate-firefly" style="left: ${left}%; top: ${top}%; width: ${size}px; height: ${size}px; animation-delay: -${delay}s; animation-duration: ${duration}s;"></div>`;
    }).join('');

        return `
        <div class="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
            <div class="absolute inset-0 z-0 pointer-events-none transition-all duration-500" style="${heroBgStyle}">
                 <div class="absolute inset-0 ${overlayClass} transition-colors duration-500"></div> 
            </div>
            <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">${fireflies}</div>
            <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none ${styles.blobOpacity}">
                <div class="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] animate-pulse" style="animation-duration: 8s"></div>
                <div class="absolute bottom-[20%] right-[20%] w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[120px] animate-duration: 10s; animation-delay: 1s"></div>
            </div>
            
            <div class="absolute inset-0 max-w-7xl mx-auto pointer-events-none hidden md:block">
                <div class="absolute top-20 left-[12%] animate-float pointer-events-auto cursor-pointer transition-transform hover:scale-110" style="animation-delay: 0s" onclick="openToolModal('gemini')">
                    <div class="w-16 h-16 rounded-2xl ${styles.glass} flex items-center justify-center shadow-lg"><img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" class="w-10"></div>
                </div>
                <div class="absolute bottom-20 right-[12%] animate-float pointer-events-auto cursor-pointer transition-transform hover:scale-110" style="animation-delay: 2s" onclick="openToolModal('gpt')">
                    <div class="w-16 h-16 rounded-2xl ${styles.glass} flex items-center justify-center shadow-lg"><img src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" class="w-10"></div>
                </div>
                <div class="absolute top-32 right-[18%] animate-float pointer-events-auto cursor-pointer transition-transform hover:scale-110" style="animation-delay: 1s" onclick="openToolModal('claude')">
                    <div class="w-16 h-16 rounded-2xl ${styles.glass} flex items-center justify-center shadow-lg"><img src="https://sm.pcmag.com/t/pcmag_uk/review/c/claude/claude_5gnz.1200.jpg" class="w-10 rounded-lg"></div>
                </div>
                <div class="absolute bottom-32 left-[18%] animate-float pointer-events-auto cursor-pointer transition-transform hover:scale-110" style="animation-delay: 3s" onclick="openToolModal('copilot')">
                    <div class="w-16 h-16 rounded-2xl ${styles.glass} flex items-center justify-center shadow-lg"><img src="https://socialsciences.mcmaster.ca/app/uploads/2023/11/Untitled-design-81.png" class="w-10"></div>
                </div>
            </div>

            <div class="relative z-10 max-w-4xl mx-auto px-4 text-center">
                <h1 class="text-5xl md:text-7xl font-black ${state.theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tight mb-8 leading-tight drop-shadow-xl">
                    Khai phá tiềm năng <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">AI Chatbot</span>
                </h1>
                <p class="text-xl ${styles.textSecondary} max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                    Kho tàng các câu lệnh (prompts) được tinh chỉnh kỹ lưỡng giúp bạn làm việc nhanh hơn gấp 10 lần.
                </p>
                <div class="max-w-2xl mx-auto relative group transition-all duration-300 hover:scale-[1.02]">
                    <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                    <div class="relative flex items-center ${styles.glass} rounded-xl p-2">
                        <i data-lucide="search" class="ml-4 ${styles.textSecondary} group-focus-within:text-indigo-500 transition-colors" size="24"></i>
                        <input type="text" id="search-input" placeholder="Bạn muốn AI giúp gì hôm nay? (VD: Viết code, Soạn email...)" class="w-full bg-transparent border-none focus:outline-none ${styles.textPrimary} placeholder-slate-400 py-3 px-4 text-lg font-medium outline-none" value="${state.searchTerm}" autofocus>
                    </div>
                </div>
                <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button onclick="openModal('scan')" class="px-5 py-3 rounded-lg ${getColorClass('bg')} ${getColorClass('bg-hover')} text-white font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 button-glow">
                        <i data-lucide="scan" size="18"></i> Quét ảnh OCR
                    </button>
                    <button onclick="openModal('add')" class="px-5 py-3 rounded-lg ${styles.glass} ${styles.glassHover} border ${styles.border} ${styles.textPrimary} font-semibold flex items-center gap-2 button-glow">
                        <i data-lucide="sparkles" size="18"></i> Tạo prompt mới
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderPromptCard(prompt) {
    const styles = getStyles();
    const placeholderContent = prompt.content || '';
    const escapedContent = placeholderContent
        .replace(/`/g, "\\`")
        .replace(/\$/g, "\\$")
        .replace(/\n/g, "\\n");
    let iconPath = "";

    if (prompt.category === "Giáo dục") {
        const subjectTag = (prompt.tags || []).find(tag => SUBJECT_ICONS[tag]);
        if (subjectTag) iconPath = SUBJECT_ICONS[subjectTag];
    }
    if (!iconPath) iconPath = CATEGORY_ICONS[prompt.category];

    const iconHTML = iconPath
        ? `<img src="${iconPath}" alt="${prompt.category}" class="w-full h-full object-contain drop-shadow-sm">`
        : `<i data-lucide="sparkles" class="text-yellow-500" size="20"></i>`;

    const isFavorite = state.currentUser?.favorites?.includes(prompt.id) || false;
    const heartIcon = isFavorite 
        ? `<i data-lucide="heart" fill="#ef4444" class="text-red-500" size="20"></i>` 
        : `<i data-lucide="heart" class="text-slate-400 group-hover:text-red-400 transition-colors" size="20"></i>`;

    return `
        <div class="group relative ${styles.glass} ${styles.glassHover} rounded-2xl p-6 flex flex-col h-full transition-all duration-300 overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] group-hover:bg-indigo-500/20 transition-all"></div>
            <div class="flex justify-between items-start mb-5 relative z-10">
                <div class="p-2.5 ${styles.iconBg} rounded-xl border ${styles.border} group-hover:scale-110 transition-transform duration-300 w-12 h-12 flex items-center justify-center overflow-hidden relative">
                    ${iconHTML}
                    <div class="absolute -top-3 -right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <button onclick="copyToClipboard(\`${escapedContent}\`)" class="p-1.5 rounded-lg bg-slate-900/80 text-white shadow-lg hover:bg-indigo-600 transition-colors text-[10px] leading-none" title="Copy nhanh">Copy</button>
                        <button onclick="switchToChatMode(${prompt.id})" class="p-1.5 rounded-lg bg-white/90 text-slate-800 shadow-lg hover:bg-emerald-200 transition-colors text-[10px] leading-none" title="Xem chi tiết">Preview</button>
                        <button onclick="openQuickTestModal(${prompt.id})" class="p-1.5 rounded-lg bg-emerald-500/90 text-white shadow-lg hover:bg-emerald-400 transition-colors text-[10px] leading-none" title="Test nhanh trong popup">Test</button>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                     <button onclick="toggleFavorite(event, ${prompt.id})" class="p-2 rounded-full hover:bg-white/10 transition-colors relative z-20" title="${isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}">
                        ${heartIcon}
                    </button>
                    <span class="text-[10px] font-bold uppercase tracking-wider ${styles.textSecondary} ${styles.iconBg} px-2 py-1 rounded-md border ${styles.border}">${prompt.category}</span>
                </div>
            </div>
            <h3 class="text-xl font-bold ${styles.textPrimary} mb-2 group-hover:text-indigo-500 transition-colors relative z-10">${prompt.title}</h3>
            <p class="${styles.textSecondary} text-sm mb-6 line-clamp-2 relative z-10">${prompt.description}</p>
            <div class="mt-auto pt-4 border-t ${styles.border} flex items-center justify-between relative z-10">
                <div class="flex gap-2">
                    ${prompt.tags.slice(0, 2).map(tag => `<span class="text-xs ${styles.textSecondary} font-medium">#${tag}</span>`).join('')}
                </div>
                ${state.selectingForLearning ? `
                    <!-- Always visible button when selecting for learning -->
                    <button onclick="selectPromptForLearning(${prompt.id})" class="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-lg transition-all font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2">
                        <i data-lucide="book-open" size="16"></i> Chọn
                    </button>
                ` : `
                    <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                        <button onclick="switchToChatMode(${prompt.id})" class="p-2 bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-600 rounded-lg transition-colors" title="Chạy thử (chế độ chat)"><i data-lucide="play" size="16" fill="currentColor"></i></button>
                        <button onclick="openQuickTestModal(${prompt.id})" class="p-2 bg-indigo-500/10 hover:bg-indigo-500/30 text-indigo-600 rounded-lg transition-colors" title="Test nhanh (popup)"><i data-lucide="sparkles" size="16"></i></button>
                        <button onclick='copyToClipboard(\`${prompt.content.replace(/`/g, "\\`").replace(/\n/g, "\\n")}\`)' class="p-2 bg-indigo-500/10 hover:bg-indigo-500/30 text-indigo-600 rounded-lg transition-colors" title="Sao chép"><i data-lucide="copy" size="16"></i></button>
                        ${state.currentUser ? `<button onclick="deletePrompt(${prompt.id})" class="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-600 rounded-lg transition-colors" title="Xóa prompt"><i data-lucide="trash-2" size="16"></i></button>` : ''}
                    </div>
                `}
            </div>
        </div>
    `;
}

function renderSkeletonLoader(count = 6) {
    const styles = getStyles();
    const placeholderBg = state.theme === 'dark' ? 'bg-slate-700/60' : 'bg-slate-200/70';

    return `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${Array.from({ length: count }).map(() => `
                <div class="rounded-2xl border ${styles.border} ${styles.glass} p-6 animate-pulse h-full">
                    <div class="flex justify-between items-start mb-5">
                        <div class="w-12 h-12 rounded-xl ${placeholderBg}"></div>
                        <div class="flex gap-2">
                            <div class="w-8 h-8 rounded-full ${placeholderBg}"></div>
                            <div class="w-14 h-6 rounded-md ${placeholderBg}"></div>
                        </div>
                    </div>
                    <div class="h-5 w-3/4 rounded-md ${placeholderBg} mb-2"></div>
                    <div class="h-4 w-full rounded-md ${placeholderBg} mb-2"></div>
                    <div class="h-4 w-2/3 rounded-md ${placeholderBg} mb-6"></div>
                    <div class="pt-4 border-t ${styles.border} flex items-center justify-between">
                        <div class="flex gap-2">
                            <div class="w-12 h-4 rounded-full ${placeholderBg}"></div>
                            <div class="w-10 h-4 rounded-full ${placeholderBg}"></div>
                        </div>
                        <div class="flex gap-2">
                            <div class="w-8 h-8 rounded-lg ${placeholderBg}"></div>
                            <div class="w-8 h-8 rounded-lg ${placeholderBg}"></div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderShowcase() {
    const styles = getStyles();
    const heroBgStyle = "background-image: url('images/Gemini_Generated_Image_xpwlbixpwlbixpwl.png'); background-size: cover; background-position: center;";
    const overlayClass = state.theme === 'dark' ? 'bg-black/60' : 'bg-white/80';

    return `
        <div class="max-w-7xl mx-auto px-4 py-20 pb-28 animate-fadeIn relative z-10">
             <div class="relative mb-24 rounded-3xl overflow-hidden p-12 text-center border ${styles.border} shadow-2xl group">
                <div class="absolute inset-0 z-0 pointer-events-none transition-all duration-500" style="${heroBgStyle}">
                     <div class="absolute inset-0 ${overlayClass} backdrop-blur-sm transition-all duration-500"></div>
                </div>
                <div class="relative z-10 flex flex-col items-center">
                    <div class="mb-6 p-4 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-lg animate-float">
                        <i data-lucide="layout-grid" size="32" class="text-indigo-500"></i>
                    </div>
                    <h2 class="text-5xl md:text-7xl font-black ${styles.textPrimary} mb-6 tracking-tight">Thế Giới <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Siêu Trí Tuệ</span></h2>
                    <p class="text-xl ${styles.textSecondary} max-w-2xl mx-auto mb-10 leading-relaxed">Khám phá và so sánh sức mạnh của những mô hình ngôn ngữ lớn (LLM) hàng đầu thế giới.</p>
                </div>
            </div>

            <!-- Prompt Importance & Quick Refiner CTA -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-24">
                <div class="${styles.cardBg} rounded-3xl border ${styles.border} p-8 shadow-lg">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <i data-lucide="sparkles" size="24"></i>
                        </div>
                        <div>
                            <p class="text-sm ${styles.textSecondary} uppercase tracking-widest font-semibold">Prompt là chìa khóa</p>
                            <h3 class="text-2xl font-bold ${styles.textPrimary}">Tại sao prompt quyết định 70% chất lượng AI?</h3>
                        </div>
                    </div>
                    <ul class="space-y-3 text-sm ${styles.textSecondary} leading-relaxed">
                        <li class="flex gap-3"><i data-lucide="check-circle" class="text-emerald-500" size="18"></i><span>Giúp mô hình hiểu đúng ngữ cảnh, vai trò và mục tiêu đầu ra.</span></li>
                        <li class="flex gap-3"><i data-lucide="check-circle" class="text-emerald-500" size="18"></i><span>Giảm 30-50% số lần phải hỏi lại hoặc sửa câu trả lời.</span></li>
                        <li class="flex gap-3"><i data-lucide="check-circle" class="text-emerald-500" size="18"></i><span>Tối ưu chi phí token và thời gian phản hồi khi làm việc với LLM.</span></li>
                        <li class="flex gap-3"><i data-lucide="check-circle" class="text-emerald-500" size="18"></i><span>Tạo khuôn mẫu (prompt template) để tái sử dụng cho đội nhóm.</span></li>
                    </ul>
                </div>

                <div class="rounded-3xl border ${styles.border} p-8 bg-gradient-to-br from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-xl relative overflow-hidden">
                    <div class="absolute inset-0 bg-white/5 backdrop-blur-sm opacity-40"></div>
                    <div class="relative z-10">
                        <p class="text-sm font-semibold uppercase tracking-widest mb-2">Tiện ích trình duyệt</p>
                        <h3 class="text-3xl font-black mb-3">Tinh chỉnh Prompt siêu nhanh</h3>
                        <p class="text-white/80 mb-6 text-sm leading-relaxed">Một cú nhấp để cài đặt tiện ích AI Prompt Refiner. Tích hợp trực tiếp vào khung nhập ChatGPT, Gemini, Claude… và tối ưu prompt tức thì.</p>
                        <div class="flex flex-wrap gap-3">
                            <button onclick="installExtension()" class="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white text-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                                <i data-lucide="download" size="18"></i>
                                Cài tiện ích tinh chỉnh
                            </button>
                            <a href="SETUP_GUIDE.md" target="_blank" class="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white font-semibold hover:bg-white/15 transition-all duration-200">
                                <i data-lucide="book-open" size="18"></i>
                                Xem hướng dẫn nhanh
                            </a>
                        </div>
                        <p class="mt-4 text-xs text-white/70">Hỗ trợ Chrome/Edge. Sau khi cài đặt, nút “Tinh chỉnh” xuất hiện ngay trong hộp chat.</p>
                    </div>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                ${AI_TOOLS.map(tool => `
                    <div class="${styles.cardBg} rounded-3xl p-8 border ${styles.border} hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden shadow-sm hover:shadow-xl">
                        <div class="absolute top-0 left-0 w-full h-1 ${tool.bg.replace('bg-', 'bg-gradient-to-r from-transparent via-')}"></div>
                        <div class="w-16 h-16 mb-6 relative"><div class="absolute inset-0 ${tool.bg} blur-xl rounded-full opacity-50"></div><div class="relative z-10 w-full h-full"><img src="${tool.icon}" class="w-full h-full object-contain"></div></div>
                        <h4 class="text-2xl font-bold ${tool.color} mb-2">${tool.name}</h4>
                        <p class="text-xs ${styles.textSecondary} font-bold uppercase tracking-widest mb-4">${tool.company}</p>
                        <p class="${styles.textSecondary} text-sm leading-relaxed mb-8">${tool.description}</p>
                        <a href="${tool.url}" target="_blank" class="mt-auto flex items-center justify-center w-full py-3 rounded-xl ${styles.iconBg} hover:bg-indigo-500 hover:text-white border ${styles.border} hover:border-indigo-500 ${styles.textPrimary} font-medium transition-all">Truy cập ngay <i data-lucide="external-link" size="14" class="ml-2"></i></a>
                    </div>
                `).join('')}
            </div>

            <div class="mb-24">
                <h3 class="text-3xl font-bold ${styles.textPrimary} mb-8 flex items-center gap-3"><i data-lucide="file-text" class="text-indigo-500"></i> Báo cáo & Nghiên cứu Uy tín</h3>
                <div class="grid md:grid-cols-2 gap-6">
                    ${RELIABLE_ARTICLES.map(article => `
                        <a href="${article.url}" target="_blank" class="group block p-6 rounded-2xl ${styles.glass} hover:border-indigo-500/50 transition-all duration-300">
                            <div class="flex justify-between items-start mb-2">
                                <span class="text-xs font-bold text-indigo-500 uppercase tracking-wider">${article.org}</span>
                                <i data-lucide="arrow-up-right" size="16" class="${styles.textSecondary} group-hover:text-indigo-500 transition-colors"></i>
                            </div>
                            <h4 class="text-xl font-bold ${styles.textPrimary} mb-2 group-hover:text-indigo-500 transition-colors">${article.title}</h4>
                            <p class="${styles.textSecondary} text-sm line-clamp-2">${article.desc}</p>
                        </a>
                    `).join('')}
                </div>
            </div>

            <div class="rounded-3xl p-10 md:p-16 border ${styles.border} bg-gradient-to-br from-emerald-900/10 to-teal-900/10 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]"></div>
                <div class="relative z-10">
                    <div class="text-center mb-12">
                        <h3 class="text-3xl md:text-4xl font-black ${styles.textPrimary} mb-4">Đạo đức & Hướng dẫn Sử dụng AI</h3>
                        <p class="text-lg ${styles.textSecondary} max-w-3xl mx-auto">Công nghệ chỉ thực sự mạnh mẽ khi được sử dụng một cách có trách nhiệm.</p>
                    </div>
                    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        ${ETHICS_GUIDE.map(item => `
                            <div class="${styles.cardBg} p-6 rounded-2xl border ${styles.border} shadow-lg hover:-translate-y-1 transition-transform duration-300">
                                <div class="w-12 h-12 rounded-full bg-white/10 ${item.color} flex items-center justify-center mb-4 text-2xl">
                                    <i data-lucide="${item.icon}" size="24"></i>
                                </div>
                                <h4 class="text-lg font-bold ${styles.textPrimary} mb-2">${item.title}</h4>
                                <p class="${styles.textSecondary} text-sm leading-relaxed">${item.content}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// Learning Space View
// ==========================================
function renderLearningSpace() {
    const styles = getStyles();
    const hasContext = state.learningContext && state.learningContext.length > 0;
    
    return `
        <div class="flex h-screen pt-16 pb-20 md:pb-0">
            <!-- Left Side - Content & Results -->
            <div class="flex-1 overflow-y-auto ${styles.bg}">
                <div class="h-full px-6 py-8">
                    ${renderLearningMainContent()}
                </div>
            </div>
            
            <!-- Right Side - Tools Panel -->
            <div class="w-96 ${styles.cardBg} border-l ${styles.border} overflow-y-auto">
                <div class="p-6 space-y-6">
                    <!-- Upload Section -->
                    <div>
                        <h3 class="text-lg font-bold ${styles.textPrimary} mb-4 flex items-center gap-2">
                            <i data-lucide="upload-cloud" size="20" class="text-indigo-500"></i>
                            Tải tài liệu lên
                        </h3>
                        <div class="${styles.iconBg} border-2 border-dashed ${styles.border} rounded-xl p-4 text-center hover:border-indigo-500/50 transition-all cursor-pointer" onclick="document.getElementById('learning-file-input').click()">
                            <i data-lucide="file-plus" size="32" class="${styles.textSecondary} mx-auto mb-2"></i>
                            <p class="text-sm ${styles.textPrimary} font-medium mb-1">Click để tải file</p>
                            <p class="text-xs ${styles.textSecondary}">PDF, Word, Ảnh, Video</p>
                        </div>
                        <input type="file" id="learning-file-input" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mov" class="hidden" onchange="handleLearningFileUpload(event)" multiple>
                        
                        ${state.learningFiles && state.learningFiles.length > 0 ? `
                            <div class="mt-4 space-y-2">
                                ${state.learningFiles.map((file, idx) => `
                                    <div class="${styles.inputBg} rounded-lg p-3 flex items-center gap-3">
                                        <i data-lucide="file" size="16" class="${styles.textSecondary}"></i>
                                        <span class="flex-1 text-sm ${styles.textPrimary} truncate">${file.name}</span>
                                        <button onclick="removeLearningFile(${idx})" class="text-red-500 hover:bg-red-500/10 p-1 rounded">
                                            <i data-lucide="x" size="16"></i>
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- Context Status -->
                    ${hasContext ? `
                        <div class="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
                            <div class="flex items-center gap-2 mb-2">
                                <i data-lucide="check-circle" size="18" class="text-indigo-500"></i>
                                <p class="font-bold text-indigo-500 text-sm">Đã có nội dung</p>
                            </div>
                            <p class="text-xs ${styles.textSecondary}">Các công cụ bên dưới sẽ sử dụng nội dung này</p>
                        </div>
                    ` : ''}
                    
                    <!-- Quick Actions -->
                    <div>
                        <h3 class="text-lg font-bold ${styles.textPrimary} mb-4 flex items-center gap-2">
                            <i data-lucide="zap" size="20" class="text-yellow-500"></i>
                            Công cụ học tập
                        </h3>
                        
                        <div class="space-y-3">
                            <button onclick="processLearningAction('summary')" class="w-full ${styles.cardBg} border ${styles.border} rounded-xl p-4 hover:border-blue-500/50 hover:shadow-lg transition-all text-left group ${!hasContext ? 'opacity-50 cursor-not-allowed' : ''}" ${!hasContext ? 'disabled' : ''}>
                                <div class="flex items-center gap-3 mb-2">
                                    <div class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <i data-lucide="file-text" size="20" class="text-blue-500"></i>
                                    </div>
                                    <div class="flex-1">
                                        <p class="font-bold ${styles.textPrimary}">Tóm tắt</p>
                                    </div>
                                </div>
                                <p class="text-xs ${styles.textSecondary}">Trích xuất ý chính từ nội dung</p>
                            </button>
                            
                            <button onclick="processLearningAction('flashcards')" class="w-full ${styles.cardBg} border ${styles.border} rounded-xl p-4 hover:border-purple-500/50 hover:shadow-lg transition-all text-left group ${!hasContext ? 'opacity-50 cursor-not-allowed' : ''}" ${!hasContext ? 'disabled' : ''}>
                                <div class="flex items-center gap-3 mb-2">
                                    <div class="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <i data-lucide="credit-card" size="20" class="text-purple-500"></i>
                                    </div>
                                    <div class="flex-1">
                                        <p class="font-bold ${styles.textPrimary}">Flashcards</p>
                                    </div>
                                </div>
                                <p class="text-xs ${styles.textSecondary}">Tạo thẻ ghi nhớ hai mặt</p>
                            </button>
                            
                            <button onclick="processLearningAction('quiz')" class="w-full ${styles.cardBg} border ${styles.border} rounded-xl p-4 hover:border-green-500/50 hover:shadow-lg transition-all text-left group ${!hasContext ? 'opacity-50 cursor-not-allowed' : ''}" ${!hasContext ? 'disabled' : ''}>
                                <div class="flex items-center gap-3 mb-2">
                                    <div class="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <i data-lucide="help-circle" size="20" class="text-green-500"></i>
                                    </div>
                                    <div class="flex-1">
                                        <p class="font-bold ${styles.textPrimary}">Câu hỏi</p>
                                    </div>
                                </div>
                                <p class="text-xs ${styles.textSecondary}">Tạo câu hỏi kiểm tra</p>
                            </button>
                            
                            <button onclick="processLearningAction('explain')" class="w-full ${styles.cardBg} border ${styles.border} rounded-xl p-4 hover:border-orange-500/50 hover:shadow-lg transition-all text-left group ${!hasContext ? 'opacity-50 cursor-not-allowed' : ''}" ${!hasContext ? 'disabled' : ''}>
                                <div class="flex items-center gap-3 mb-2">
                                    <div class="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <i data-lucide="lightbulb" size="20" class="text-orange-500"></i>
                                    </div>
                                    <div class="flex-1">
                                        <p class="font-bold ${styles.textPrimary}">Giải thích</p>
                                    </div>
                                </div>
                                <p class="text-xs ${styles.textSecondary}">Giải thích chi tiết khái niệm</p>
                            </button>
                            
                            <button onclick="clearLearningContext()" class="w-full ${styles.inputBg} border ${styles.border} rounded-xl p-3 hover:border-red-500/50 transition-all text-center text-sm font-medium ${styles.textSecondary} hover:text-red-500">
                                <i data-lucide="trash-2" size="16" class="inline mr-2"></i>
                                Xóa tất cả nội dung
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderLearningMainContent() {
    const styles = getStyles();
    
    return `
        <div class="h-full flex flex-col">
            <!-- Header -->
            <div class="mb-6">
                <h1 class="text-4xl font-black ${styles.textPrimary} mb-2">📚 Không gian học tập</h1>
                <p class="${styles.textSecondary}">Sử dụng prompt hoặc tải tài liệu lên, sau đó áp dụng các công cụ bên phải</p>
            </div>

            <!-- Session Save/Load Bar -->
            <div class="mb-4 flex flex-wrap items-center gap-3 ${styles.cardBg} border ${styles.border} rounded-xl p-4">
                <input id="learning-session-title" type="text" placeholder="Đặt tên phiên học..." class="flex-1 min-w-[220px] ${styles.inputBg} border ${styles.border} rounded-lg px-3 py-2 ${styles.textPrimary} text-sm outline-none focus:border-indigo-500" />
                <button onclick="saveLearningSession()" class="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md hover:from-indigo-500 hover:to-purple-500 flex items-center gap-2">
                    <i data-lucide="save" size="16"></i> Lưu phiên
                </button>
                <button onclick="loadUserLearningSessions()" class="px-3 py-2 rounded-lg ${styles.iconBg} border ${styles.border} ${styles.textPrimary} hover:border-indigo-500 flex items-center gap-2">
                    <i data-lucide="refresh-ccw" size="16"></i> Tải phiên đã lưu
                </button>
                <button onclick="copyLearningSessionLink(state.activeLearningSessionId)" class="px-3 py-2 rounded-lg ${styles.iconBg} border ${styles.border} ${styles.textPrimary} hover:border-indigo-500 flex items-center gap-2 ${!state.activeLearningSessionId ? 'opacity-50 cursor-not-allowed' : ''}" ${!state.activeLearningSessionId ? 'disabled' : ''}>
                    <i data-lucide="link" size="16"></i> Link chia sẻ
                </button>
            </div>

            <!-- Saved Sessions List -->
            <div class="mb-6 ${styles.cardBg} border ${styles.border} rounded-xl p-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <i data-lucide="bookmark" size="16" class="text-indigo-500"></i>
                        <h3 class="font-bold ${styles.textPrimary}">Phiên đã lưu</h3>
                    </div>
                    ${state.activeLearningSessionId ? `<span class="text-xs ${styles.textSecondary}">Đang mở: ${state.activeLearningSessionId}</span>` : ''}
                </div>
                ${!state.currentUser ? `
                    <p class="text-sm ${styles.textSecondary}">Đăng nhập để lưu và mở lại phiên học.</p>
                ` : (state.learningSessions.length === 0 ? `
                    <p class="text-sm ${styles.textSecondary}">Chưa có phiên nào. Lưu phiên đầu tiên để tiếp tục sau.</p>
                ` : `
                    <div class="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                        ${state.learningSessions.map(sess => `
                            <div class="flex items-center gap-3 ${styles.inputBg} border ${styles.border} rounded-lg px-3 py-2">
                                <div class="min-w-0 flex-1">
                                    <p class="text-sm font-semibold ${styles.textPrimary} truncate">${sess.title || 'Phiên học'}</p>
                                    <p class="text-[11px] ${styles.textSecondary}">Cập nhật: ${new Date(sess.updatedAt || sess.createdAt).toLocaleString('vi-VN')}</p>
                                </div>
                                <button onclick="openLearningSession('${sess.id}')" class="px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-600 text-xs font-semibold hover:bg-emerald-500/20">Mở</button>
                                <button onclick="copyLearningSessionLink('${sess.id}')" class="p-2 rounded-md ${styles.iconBg} border ${styles.border} ${styles.textSecondary} hover:${styles.textPrimary}" title="Copy link">
                                    <i data-lucide="link" size="14"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                `)}
            </div>
            
            <!-- Prompt Input Area -->
            <div class="${styles.cardBg} border ${styles.border} rounded-2xl p-6 mb-6">
                <label class="block text-sm font-bold ${styles.textPrimary} mb-3">Nhập nội dung hoặc đặt câu hỏi</label>
                <textarea 
                    id="learning-prompt-input" 
                    class="w-full h-40 ${styles.inputBg} border ${styles.border} rounded-xl p-4 ${styles.textPrimary} outline-none focus:border-indigo-500 transition-all resize-none"
                    placeholder="Nhập bài học, kiến thức cần học, hoặc đặt câu hỏi...&#10;&#10;Ví dụ: Giải thích định lý Pythagore, Tóm tắt lịch sử Việt Nam thế kỷ 20..."
                ></textarea>
                <div class="flex gap-3 mt-4">
                    <button onclick="submitLearningPrompt()" class="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold transition-all flex items-center justify-center gap-2">
                        <i data-lucide="send" size="20"></i> Gửi và xử lý
                    </button>
                    <button onclick="loadPromptTemplate()" class="px-6 py-3 rounded-xl ${styles.iconBg} border ${styles.border} hover:border-indigo-500/50 ${styles.textPrimary} font-bold transition-all flex items-center gap-2">
                        <i data-lucide="book-open" size="20"></i> Chọn prompt mẫu
                    </button>
                </div>
            </div>
            
            <!-- Results Area -->
            <div class="flex-1 overflow-y-auto">
                ${state.isLoadingPrompts ? `
                    <div class="flex items-center justify-center py-12">
                        <div class="text-center">
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                            <p class="${styles.textPrimary} font-bold">Đang xử lý...</p>
                        </div>
                    </div>
                ` : state.learningContext ? `
                    <div class="${styles.cardBg} border ${styles.border} rounded-2xl p-6 mb-4">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-bold ${styles.textPrimary} flex items-center gap-2">
                                <i data-lucide="file-text" size="18" class="text-indigo-500"></i>
                                Nội dung gốc
                            </h3>
                            <button onclick="copyToClipboard(\`${state.learningContext.replace(/`/g, '\\`')}\`)" class="text-xs px-3 py-1.5 rounded-lg ${styles.iconBg} hover:bg-indigo-500/10 ${styles.textSecondary} hover:text-indigo-500 transition-all">
                                <i data-lucide="copy" size="14" class="inline mr-1"></i> Sao chép
                            </button>
                        </div>
                        <div class="prose prose-sm max-w-none ${styles.textPrimary}">
                            ${simpleMarkdown(state.learningContext)}
                        </div>
                    </div>
                ` : `
                    ${renderEmptyOverlay('No Data Found', 'Chưa có nội dung học tập. Nhập prompt hoặc tải tài liệu để bắt đầu.')}
                `}
                
                ${state.learningResults.length > 0 ? state.learningResults.map((result, idx) => `
                    <div class="${styles.cardBg} border ${styles.border} rounded-2xl p-6 mb-4 animate-fadeIn">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-bold ${styles.textPrimary} flex items-center gap-2">
                                ${result.icon}
                                ${result.title}
                            </h3>
                            <div class="flex gap-2">
                                <button onclick="copyToClipboard(\`${result.content.replace(/`/g, '\\`')}\`)" class="text-xs px-3 py-1.5 rounded-lg ${styles.iconBg} hover:bg-${result.color}-500/10 ${styles.textSecondary} hover:text-${result.color}-500 transition-all">
                                    <i data-lucide="copy" size="14" class="inline mr-1"></i> Sao chép
                                </button>
                                <button onclick="removeLearningResult(${idx})" class="text-xs px-3 py-1.5 rounded-lg ${styles.iconBg} hover:bg-red-500/10 ${styles.textSecondary} hover:text-red-500 transition-all">
                                    <i data-lucide="x" size="14"></i>
                                </button>
                            </div>
                        </div>
                        <div class="prose prose-sm max-w-none ${styles.textPrimary}">
                            ${simpleMarkdown(result.content)}
                        </div>
                    </div>
                `).join('') : ''}
                
                ${!state.learningContext && state.learningResults.length === 0 ? `
                    <div class="flex items-center justify-center h-full">
                        <div class="text-center py-12">
                            <i data-lucide="lightbulb" size="64" class="${styles.textSecondary} mx-auto mb-4 opacity-20"></i>
                            <h3 class="text-xl font-bold ${styles.textPrimary} mb-2">Bắt đầu học tập</h3>
                            <p class="${styles.textSecondary} max-w-md">Nhập nội dung bài học hoặc tải tài liệu lên, sau đó sử dụng các công cụ bên phải để học hiệu quả hơn</p>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function renderLearningContent() {
    const styles = getStyles();
    const tab = state.learningTab || 'prompts';
    
    if (tab === 'prompts') {
        // Lọc prompts từ thư viện (chỉ lấy category Giáo dục)
        const searchTerm = state.learningSearch || '';
        const learningPrompts = state.prompts.filter(p => {
            if (p.category !== 'Giáo dục') return false;
            if (!searchTerm) return true;
            return p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
                   p.description.toLowerCase().includes(searchTerm.toLowerCase());
        });
        
        return `
            <!-- Header with search -->
            <div class="mb-8">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h1 class="text-4xl font-black ${styles.textPrimary} mb-2">Không gian học tập</h1>
                        <p class="${styles.textSecondary}">Khám phá các prompt mẫu và công cụ hỗ trợ học tập</p>
                    </div>
                </div>
                
                <!-- Search bar -->
                <div class="relative">
                    <i data-lucide="search" class="absolute left-5 top-1/2 -translate-y-1/2 ${styles.textSecondary}" size="20"></i>
                    <input 
                        type="text" 
                        id="learning-search-input"
                        value="${searchTerm}"
                        placeholder="Tìm kiếm theo môn học: Toán, Lý, Hóa, Sinh, Văn, Anh, Sử, Địa..." 
                        class="w-full ${styles.cardBg} border ${styles.border} rounded-2xl pl-14 pr-6 py-4 ${styles.textPrimary} text-lg outline-none focus:border-indigo-500 focus:shadow-lg transition-all"
                    />
                </div>
            </div>
            
            <!-- Subject filters -->
            <div class="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                ${SUBJECT_LIST.map(subject => {
                    const isActive = searchTerm === subject;
                    return `
                        <button 
                            onclick="setLearningSearch('${subject}')" 
                            class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${isActive ? 'bg-indigo-500 text-white shadow-lg' : styles.iconBg + ' ' + styles.textSecondary + ' hover:bg-indigo-500/10'}"
                        >
                            ${SUBJECT_ICONS[subject] ? `<img src="${SUBJECT_ICONS[subject]}" class="w-5 h-5 rounded object-cover" />` : ''}
                            ${subject}
                        </button>
                    `;
                }).join('')}
                ${searchTerm ? `
                    <button 
                        onclick="setLearningSearch('')" 
                        class="px-4 py-2.5 rounded-xl font-medium whitespace-nowrap ${styles.iconBg} ${styles.textSecondary} hover:bg-red-500/10 hover:text-red-500 transition-all"
                    >
                        <i data-lucide="x" size="16" class="inline"></i> Xóa bộ lọc
                    </button>
                ` : ''}
            </div>
            
            <!-- Prompts grid -->
            <div class="space-y-4">
                ${learningPrompts.length === 0 ? `
                    <div class="text-center py-20 ${styles.cardBg} border ${styles.border} rounded-3xl">
                        <i data-lucide="search-x" size="64" class="${styles.textSecondary} mx-auto mb-4 opacity-30"></i>
                        <h3 class="text-xl font-bold ${styles.textPrimary} mb-2">Không tìm thấy prompt</h3>
                        <p class="${styles.textSecondary}">Thử tìm kiếm với từ khóa khác</p>
                    </div>
                ` : learningPrompts.map(prompt => {
                    const subjectIcon = SUBJECT_ICONS[prompt.tags[0]] || '';
                    
                    return `
                        <div class="${styles.cardBg} border ${styles.border} rounded-2xl p-6 hover:border-indigo-500/50 hover:shadow-lg transition-all cursor-pointer group" onclick="useLearningPrompt(${prompt.id})">
                            <div class="flex items-start gap-5">
                                ${subjectIcon ? `
                                    <div class="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 ring-2 ${styles.border} group-hover:ring-indigo-500/50 transition-all">
                                        <img src="${subjectIcon}" alt="${prompt.tags[0]}" class="w-full h-full object-cover">
                                    </div>
                                ` : `
                                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                        📚
                                    </div>
                                `}
                                <div class="flex-1 min-w-0">
                                    <h3 class="text-xl font-bold ${styles.textPrimary} mb-2 group-hover:text-indigo-500 transition-colors">${prompt.title}</h3>
                                    <p class="text-sm ${styles.textSecondary} mb-4 line-clamp-2">${prompt.description}</p>
                                    <div class="flex gap-2 flex-wrap">
                                        ${prompt.tags.map(tag => `
                                            <span class="px-3 py-1.5 rounded-lg text-xs font-medium ${styles.iconBg} ${styles.textPrimary} border ${styles.border}">
                                                ${tag}
                                            </span>
                                        `).join('')}
                                    </div>
                                </div>
                                <div class="flex-shrink-0">
                                    <i data-lucide="arrow-right" size="24" class="${styles.textSecondary} group-hover:text-indigo-500 group-hover:translate-x-1 transition-all"></i>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } else if (tab === 'scan') {
        return `
            <div class="mb-8">
                <h1 class="text-4xl font-black ${styles.textPrimary} mb-2">📸 Quét và phân tích ảnh</h1>
                <p class="${styles.textSecondary}">Upload ảnh bài tập, tài liệu để AI phân tích và giải thích chi tiết</p>
            </div>
            
            <div class="${styles.cardBg} border-2 border-dashed ${styles.border} rounded-3xl p-12 hover:border-indigo-500/50 transition-all">
                <div class="text-center mb-8">
                    <div class="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 animate-pulse">
                        <i data-lucide="image-plus" size="56" class="text-indigo-500"></i>
                    </div>
                    <h3 class="text-2xl font-bold ${styles.textPrimary} mb-3">Kéo thả hoặc chọn ảnh</h3>
                    <p class="${styles.textSecondary} mb-6">Hỗ trợ: JPG, PNG, JPEG • Tối đa 10MB</p>
                </div>
                
                <input type="file" id="learning-image-input" accept="image/*" class="hidden" onchange="handleLearningImageUpload(event)">
                <button onclick="document.getElementById('learning-image-input').click()" class="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-lg font-bold transition-all flex items-center justify-center gap-3 shadow-xl">
                    <i data-lucide="upload" size="24"></i> Chọn ảnh từ thiết bị
                </button>
                
                <div id="learning-scan-result" class="mt-8"></div>
            </div>
        `;
    } else if (tab === 'summary') {
        return `
            <div class="mb-8">
                <h1 class="text-4xl font-black ${styles.textPrimary} mb-2">📝 Tóm tắt nội dung</h1>
                <p class="${styles.textSecondary}">AI sẽ trích xuất và tóm tắt các ý chính từ văn bản của bạn</p>
            </div>
            
            <div class="${styles.cardBg} border ${styles.border} rounded-3xl p-8">
                <div class="mb-4">
                    <label class="block text-sm font-bold ${styles.textPrimary} mb-3">Nội dung cần tóm tắt</label>
                    <textarea 
                        id="summary-input" 
                        class="w-full h-64 ${styles.inputBg} border ${styles.border} rounded-2xl p-5 ${styles.textPrimary} text-base outline-none focus:border-blue-500 focus:shadow-lg transition-all resize-none" 
                        placeholder="Dán nội dung văn bản dài vào đây... (bài giảng, tài liệu, bài báo...)"
                    ></textarea>
                </div>
                <button onclick="generateSummary()" class="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-lg font-bold transition-all flex items-center justify-center gap-3 shadow-xl">
                    <i data-lucide="sparkles" size="24"></i> Tạo tóm tắt thông minh
                </button>
                <div id="summary-result" class="mt-8"></div>
            </div>
        `;
    } else if (tab === 'flashcards') {
        return `
            <div class="mb-8">
                <h1 class="text-4xl font-black ${styles.textPrimary} mb-2">🎴 Tạo Flashcards</h1>
                <p class="${styles.textSecondary}">Tạo thẻ ghi nhớ hai mặt để ôn tập hiệu quả hơn</p>
            </div>
            
            <div class="${styles.cardBg} border ${styles.border} rounded-3xl p-8">
                <div class="mb-4">
                    <label class="block text-sm font-bold ${styles.textPrimary} mb-3">Nội dung học tập</label>
                    <textarea 
                        id="flashcard-input" 
                        class="w-full h-64 ${styles.inputBg} border ${styles.border} rounded-2xl p-5 ${styles.textPrimary} text-base outline-none focus:border-purple-500 focus:shadow-lg transition-all resize-none" 
                        placeholder="Nhập kiến thức cần ghi nhớ... AI sẽ tạo flashcards với mặt trước (câu hỏi) và mặt sau (đáp án)"
                    ></textarea>
                </div>
                <button onclick="generateFlashcards()" class="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-lg font-bold transition-all flex items-center justify-center gap-3 shadow-xl">
                    <i data-lucide="layers" size="24"></i> Tạo Flashcards
                </button>
                <div id="flashcard-result" class="mt-8"></div>
            </div>
        `;
    } else if (tab === 'quiz') {
        return `
            <div class="mb-8">
                <h1 class="text-4xl font-black ${styles.textPrimary} mb-2">❓ Tạo câu hỏi kiểm tra</h1>
                <p class="${styles.textSecondary}">Sinh câu hỏi trắc nghiệm và tự luận để kiểm tra kiến thức</p>
            </div>
            
            <div class="${styles.cardBg} border ${styles.border} rounded-3xl p-8">
                <div class="mb-4">
                    <label class="block text-sm font-bold ${styles.textPrimary} mb-3">Nội dung kiến thức</label>
                    <textarea 
                        id="quiz-input" 
                        class="w-full h-64 ${styles.inputBg} border ${styles.border} rounded-2xl p-5 ${styles.textPrimary} text-base outline-none focus:border-green-500 focus:shadow-lg transition-all resize-none" 
                        placeholder="Nhập nội dung bài học... AI sẽ tạo câu hỏi trắc nghiệm 4 đáp án và câu hỏi tự luận kèm đáp án"
                    ></textarea>
                </div>
                <button onclick="generateQuiz()" class="w-full py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-lg font-bold transition-all flex items-center justify-center gap-3 shadow-xl">
                    <i data-lucide="clipboard-check" size="24"></i> Tạo câu hỏi kiểm tra
                </button>
                <div id="quiz-result" class="mt-8"></div>
            </div>
        `;
    } else if (tab === 'chat') {
        return `
            <div class="mb-8">
                <h1 class="text-4xl font-black ${styles.textPrimary} mb-2">💬 Trò chuyện với AI</h1>
                <p class="${styles.textSecondary}">Đặt câu hỏi và nhận câu trả lời chi tiết từ AI</p>
            </div>
            
            <div class="${styles.cardBg} border ${styles.border} rounded-3xl p-8">
                <div class="text-center py-12">
                    <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center mb-6">
                        <i data-lucide="message-circle" size="40" class="text-teal-500"></i>
                    </div>
                    <h3 class="text-2xl font-bold ${styles.textPrimary} mb-3">Bắt đầu cuộc trò chuyện</h3>
                    <p class="${styles.textSecondary} mb-8 max-w-md mx-auto">Sử dụng prompt từ thư viện hoặc chuyển sang chế độ Chat để trò chuyện tự do với AI</p>
                    <button onclick="switchView('chat')" class="px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white text-lg font-bold transition-all inline-flex items-center gap-3 shadow-xl">
                        <i data-lucide="arrow-right" size="24"></i> Chuyển sang Chat
                    </button>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="${styles.cardBg} border ${styles.border} rounded-3xl p-12 text-center">
                <i data-lucide="construction" size="64" class="${styles.textSecondary} mx-auto mb-6 opacity-30"></i>
                <h3 class="text-2xl font-bold ${styles.textPrimary} mb-3">Đang phát triển</h3>
                <p class="${styles.textSecondary}">Tính năng này sẽ sớm được ra mắt</p>
            </div>
        `;
    }
}

// --- Modals ---
function openModal(type, data = null) {
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalContent = document.getElementById('modal-content-wrapper');
    const modalBody = document.getElementById('modal-body');
    const styles = getStyles();

    modalContent.className = `rounded-3xl w-full max-w-6xl border ${styles.border} shadow-2xl overflow-hidden relative flex flex-col h-[90vh] md:h-[85vh] transform scale-95 transition-transform duration-300 ${styles.modalBg}`;
    document.getElementById('modal-close-btn').className = `absolute top-4 right-4 p-2 ${styles.iconBg} rounded-full ${styles.textSecondary} hover:${styles.textPrimary} z-50 transition-colors`;

    state.currentModal = type;
    if (type === 'add') renderAddModal(modalBody, data); 
    else if (type === 'test') renderTestModal(modalBody);
    else if (type === 'tool') {
        modalContent.classList.replace('max-w-6xl', 'max-w-lg');
        modalContent.style.height = 'auto';
        renderToolModal(modalBody);
    }
    else if (type === 'scan') {
        modalContent.classList.replace('max-w-6xl', 'max-w-4xl');
        renderScanModal(modalBody);
    }
    else if (type === 'login') {
        modalContent.classList.replace('max-w-6xl', 'max-w-lg');
        modalContent.style.height = 'auto';
        renderLoginModal(modalBody);
    }
    else if (type === 'submitProblem') {
        modalContent.classList.replace('max-w-6xl', 'max-w-2xl');
        renderSubmitProblemModal(modalBody);
    }
    else if (type === 'share') {
        modalContent.classList.replace('max-w-6xl', 'max-w-lg');
        modalContent.style.height = 'auto';
        renderShareModal(modalBody);
    }
    else if (type === 'friends') {
        modalContent.classList.replace('max-w-6xl', 'max-w-lg');
        modalContent.style.height = 'auto';
        renderFriendsModal(modalBody);
    }

    modalBackdrop.classList.remove('hidden');
    void modalBackdrop.offsetWidth;
    modalBackdrop.classList.remove('opacity-0');
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');
    lucide.createIcons();
}

function closeModal() {
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalContent = document.getElementById('modal-content-wrapper');
    modalBackdrop.classList.add('opacity-0');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    setTimeout(() => {
        modalBackdrop.classList.add('hidden');
        modalContent.classList.replace('max-w-lg', 'max-w-6xl');
        modalContent.classList.replace('max-w-4xl', 'max-w-6xl');
        modalContent.style.height = ''; 
        state.currentModal = null;
        state.activePrompt = null;
        state.activeTool = null;
        state.chatHistory = [];
        state.scanResult = "";
    }, 300);
}

function openToolModal(toolId) {
    console.log('openToolModal called with toolId:', toolId);
    console.log('AI_TOOLS:', AI_TOOLS);
    state.activeTool = AI_TOOLS.find(t => t.id === toolId);
    console.log('state.activeTool:', state.activeTool);
    if(state.activeTool) {
        openModal('tool');
    } else {
        console.error('Tool not found:', toolId);
    }
}

function renderToolModal(container) {
    const tool = state.activeTool;
    const styles = getStyles();
    container.innerHTML = `
        <div class="p-8 text-center flex flex-col items-center justify-center h-full">
            <div class="w-24 h-24 mb-6 relative">
                <div class="absolute inset-0 ${tool.bg} blur-xl rounded-full opacity-50"></div>
                <div class="relative z-10 w-full h-full"><img src="${tool.icon}" class="w-full h-full object-contain"></div>
            </div>
            <h2 class="text-3xl font-bold ${tool.color} mb-2">${tool.name}</h2>
            <p class="text-sm font-bold uppercase tracking-widest ${styles.textSecondary} mb-4">${tool.company}</p>
            <p class="${styles.textSecondary} mb-8 leading-relaxed">${tool.description}</p>
            <a href="${tool.url}" target="_blank" class="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2">
                Truy cập ngay <i data-lucide="external-link" size="20" class="ml-2"></i>
            </a>
        </div>
    `;
}

function renderLoginModal(container) {
    const styles = getStyles();
    
    // Nếu đã đăng nhập
    if (state.currentUser) {
        const user = state.currentUser;
        const favoriteCount = user.favorites ? user.favorites.length : 0;
        // Thu nhỏ modal, thêm max-height và overflow-y-auto cho phần nội dung
        container.innerHTML = `
            <div class="flex flex-col h-full max-h-[75vh] md:max-h-[65vh]">
                <!-- Header -->
                <div class="text-center mb-6 pb-4 border-b ${styles.border}">
                    <div class="relative inline-block group mb-3">
                        <div id="user-avatar-display" class="w-16 h-16 ${user.avatarImage ? 'bg-cover bg-center' : user.avatarColor || 'bg-gradient-to-br from-indigo-600 to-purple-600'} rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-bold text-xl overflow-hidden" style="${user.avatarImage ? `background-image: url(${user.avatarImage})` : ''}">
                            ${!user.avatarImage ? user.avatarText || user.name.charAt(0).toUpperCase() : ''}
                        </div>
                        <button type="button" onclick="openAvatarPicker()" class="absolute bottom-0 right-0 w-7 h-7 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <i data-lucide="camera" size="16"></i>
                        </button>
                    </div>
                    <h2 class="text-2xl font-bold ${styles.textPrimary} mb-1">${user.name}</h2>
                    <div class="flex items-center justify-center gap-2 mb-2">
                        <p class="text-xs ${styles.textSecondary}">${user.email}</p>
                        <span class="px-2 py-1 rounded-full text-xs font-bold ${user.userType === 'teacher' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}">
                            <i data-lucide="${user.userType === 'teacher' ? 'graduation-cap' : 'book-open'}" size="12" class="inline mr-1"></i>
                            ${user.userType === 'teacher' ? '👨‍🏫 Giáo viên' : '📚 Học sinh'}
                        </span>
                    </div>
                </div>
                <!-- Nội dung profile có thanh cuộn -->
                <div class="flex-1 overflow-y-auto space-y-5 pr-1 custom-scrollbar">
                    <!-- Thống kê -->
                    <div class="grid grid-cols-2 gap-3">
                        <div class="p-3 rounded-xl ${styles.cardBg} border ${styles.border} text-center">
                            <div class="text-xl font-bold text-indigo-500 mb-1">${favoriteCount}</div>
                            <p class="text-xs ${styles.textSecondary}">Prompt yêu thích</p>
                        </div>
                        <div class="p-3 rounded-xl ${styles.cardBg} border ${styles.border} text-center">
                            <div class="text-xl font-bold text-purple-500 mb-1">${user.customPrompts ? user.customPrompts.length : 0}</div>
                            <p class="text-xs ${styles.textSecondary}">Prompt tạo</p>
                        </div>
                    </div>
                    <!-- Thông tin tài khoản -->
                    <div>
                        <h3 class="font-bold ${styles.textPrimary} mb-2 text-xs">THÔNG TIN TÀI KHOẢN</h3>
                        <div class="space-y-2">
                            <div class="p-2 rounded-lg ${styles.inputBg} border ${styles.border}">
                                <p class="text-[10px] ${styles.textSecondary} mb-1">Tên hiển thị</p>
                                <p class="${styles.textPrimary} font-medium text-sm">${user.name}</p>
                            </div>
                            <div class="p-2 rounded-lg ${styles.inputBg} border ${styles.border}">
                                <p class="text-[10px] ${styles.textSecondary} mb-1">Email</p>
                                <p class="${styles.textPrimary} font-medium text-sm">${user.email}</p>
                            </div>
                            <div class="p-2 rounded-lg ${styles.inputBg} border ${styles.border}">
                                <p class="text-[10px] ${styles.textSecondary} mb-1">Ngày tham gia</p>
                                <p class="${styles.textPrimary} font-medium text-sm">${new Date(user.createdAt || Date.now()).toLocaleDateString('vi-VN')}</p>
                            </div>
                        </div>
                    </div>
                    <!-- API Key -->
                    <div>
                        <h3 class="font-bold ${styles.textPrimary} mb-2 text-xs">API KEY CÁ NHÂN</h3>
                        <div class="p-3 rounded-xl ${styles.cardBg} border ${styles.border}">
                            <p class="text-[10px] ${styles.textSecondary} mb-2">Nhập API Key riêng của bạn (tùy chọn):</p>
                            <input type="password" id="user-api-key-input" value="${state.userApiKey}" class="w-full ${styles.inputBg} border ${styles.border} rounded-lg px-3 py-2 ${styles.textPrimary} text-xs outline-none focus:border-indigo-500 transition-all" placeholder="sk-...">
                            <p class="text-[10px] ${styles.textSecondary} mt-2">💡 Nếu để trống, sẽ dùng API Key chung.</p>
                        </div>
                    </div>
                </div>
                <!-- Social Actions -->
                <div class="grid grid-cols-3 gap-2 pt-3">
                    <button onclick="renderMyPromptsModal(document.getElementById('modal-body')); lucide.createIcons();" class="py-2 rounded-xl border ${styles.border} ${styles.textPrimary} hover:border-indigo-500/50 hover:bg-indigo-500/5 font-bold transition-all flex items-center justify-center gap-2 text-xs">
                        <i data-lucide="list" size="16"></i> Prompt
                    </button>
                    <button onclick="openFriendsModal()" class="py-2 rounded-xl border ${styles.border} ${styles.textPrimary} hover:border-blue-500/50 hover:bg-blue-500/5 font-bold transition-all flex items-center justify-center gap-2 text-xs">
                        <i data-lucide="users" size="16"></i> Bạn bè
                    </button>
                    <button onclick="openModal('share')" class="py-2 rounded-xl border ${styles.border} ${styles.textPrimary} hover:border-green-500/50 hover:bg-green-500/5 font-bold transition-all flex items-center justify-center gap-2 text-xs">
                        <i data-lucide="share-2" size="16"></i> Chia sẻ
                    </button>
                </div>
                <!-- Actions -->
                <div class="mt-4 pt-4 border-t ${styles.border} flex gap-2">
                    <button onclick="saveUserApiKey()" class="flex-1 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold transition-all flex items-center justify-center gap-2 text-xs">
                        <i data-lucide="save" size="16"></i> Lưu
                    </button>
                    <button onclick="logoutUser()" class="flex-1 py-2 rounded-xl border ${styles.border} ${styles.textPrimary} hover:bg-red-500/10 hover:border-red-500/30 font-bold transition-all flex items-center justify-center gap-2 text-xs">
                        <i data-lucide="log-out" size="16"></i> Đăng xuất
                    </button>
                </div>
            </div>
        `;
    } else {
        // Nếu chưa đăng nhập
        container.innerHTML = `
            <div class="min-h-full w-full flex items-center justify-center py-8">
                <div class="w-full max-w-[420px] rounded-2xl border ${styles.border} ${styles.cardBg} shadow-xl p-8 space-y-6">
                    <div class="flex flex-col items-center text-center space-y-2">
                        <div class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[20px] font-bold text-[#4285F4]">G</div>
                        <h2 class="text-2xl font-semibold ${styles.textPrimary}" id="auth-title">Đăng nhập</h2>
                        <p class="text-sm ${styles.textSecondary}">Sử dụng email của bạn để tiếp tục</p>
                    </div>

                    <form id="auth-form" onsubmit="handleLogin(event)" class="space-y-4">
                        <div id="name-field" class="hidden">
                            <label class="block text-sm font-medium ${styles.textSecondary} mb-1">Tên hiển thị</label>
                            <input type="text" name="name" class="w-full ${styles.inputBg} border ${styles.border} rounded-lg px-3 py-3 ${styles.textPrimary} outline-none focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/30" placeholder="VD: Minh Nhật">
                        </div>

                        <div id="user-type-field" class="hidden space-y-2">
                            <label class="block text-sm font-medium ${styles.textSecondary}">Bạn là:</label>
                            <div class="grid grid-cols-2 gap-2" id="user-type-options">
                                <label class="relative cursor-pointer user-type-option" data-type="student">
                                    <input type="radio" name="userType" value="student" checked class="absolute opacity-0 w-full h-full cursor-pointer" onchange="updateUserTypeDisplay()">
                                    <div class="user-type-box p-3 rounded-lg border border-slate-200 hover:border-[#4285F4] transition-all text-center">
                                        <p class="font-semibold text-sm ${styles.textPrimary}">Học sinh</p>
                                    </div>
                                </label>
                                <label class="relative cursor-pointer user-type-option" data-type="teacher">
                                    <input type="radio" name="userType" value="teacher" class="absolute opacity-0 w-full h-full cursor-pointer" onchange="updateUserTypeDisplay()">
                                    <div class="user-type-box p-3 rounded-lg border border-slate-200 hover:border-[#4285F4] transition-all text-center">
                                        <p class="font-semibold text-sm ${styles.textPrimary}">Giáo viên</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                        
                        <div class="space-y-1">
                            <label class="block text-sm font-medium ${styles.textSecondary}">Email</label>
                            <input type="email" name="email" required class="w-full ${styles.inputBg} border ${styles.border} rounded-lg px-3 py-3 ${styles.textPrimary} outline-none focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/30" placeholder="name@example.com">
                        </div>
                        
                        <div class="space-y-1">
                            <div class="flex items-center justify-between">
                                <label class="block text-sm font-medium ${styles.textSecondary}">Mật khẩu</label>
                                <button type="button" onclick="handleForgotPassword()" class="text-xs text-[#4285F4] hover:underline">Quên mật khẩu?</button>
                            </div>
                            <div class="relative">
                                <input type="password" name="password" required class="w-full ${styles.inputBg} border ${styles.border} rounded-lg px-3 pr-10 py-3 ${styles.textPrimary} outline-none focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/30" placeholder="••••••••">
                                <button type="button" onclick="togglePasswordVisibility()" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#4285F4] transition-colors">
                                    <i id="password-eye" data-lucide="eye" size="18"></i>
                                </button>
                            </div>
                        </div>

                        <div class="flex items-center justify-between text-xs ${styles.textSecondary}">
                            <span>Email chưa được xác minh?</span>
                            <button type="button" onclick="resendVerificationEmailFromForm()" class="text-[#4285F4] font-semibold hover:underline">Gửi lại email xác minh</button>
                        </div>

                        <button type="submit" id="auth-btn" class="w-full bg-[#1a73e8] hover:bg-[#1765cb] text-white font-semibold rounded-lg py-3 shadow-sm transition-colors flex items-center justify-center gap-2">
                            Đăng nhập
                        </button>
                    </form>

                    <div class="text-center text-sm ${styles.textSecondary}">
                        <span id="auth-switch-text">Chưa có tài khoản?</span>
                        <button onclick="toggleAuthMode()" class="text-[#1a73e8] font-semibold hover:underline ml-1" id="auth-switch-btn">Tạo tài khoản</button>
                    </div>
                </div>
            </div>
        `;
    }
    window.isRegisterMode = false;
}

function renderScanModal(container) {
    const styles = getStyles();
    container.innerHTML = `
        <div class="p-6 border-b ${styles.border} bg-gradient-to-r from-indigo-900/10 to-purple-900/10">
            <h2 class="text-2xl font-bold ${styles.textPrimary} flex items-center gap-3"><i data-lucide="scan-line" class="text-indigo-500"></i> Trích xuất Prompt từ Ảnh (OCR)</h2>
        </div>
        <div class="flex-1 p-8 flex flex-col md:flex-row gap-8 overflow-hidden">
            <div class="w-full md:w-1/2 flex flex-col gap-4">
                <div id="drop-zone" class="upload-area flex-1 rounded-2xl border-2 border-dashed ${state.theme === 'dark' ? 'border-slate-700 hover:border-indigo-500 bg-slate-800/30' : 'border-slate-300 hover:border-indigo-500 bg-slate-50'} flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all relative overflow-hidden group">
                    <input type="file" id="file-input" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer z-10" onchange="handleFileSelect(event)">
                    <div id="preview-container" class="hidden absolute inset-0 z-0">
                        <img id="image-preview" class="w-full h-full object-contain p-2">
                        <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span class="text-white bg-black/50 px-4 py-2 rounded-lg font-medium">Thay đổi ảnh</span>
                        </div>
                    </div>
                    <div id="upload-placeholder" class="pointer-events-none">
                        <div class="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-500">
                            <i data-lucide="image-plus" size="32"></i>
                        </div>
                        <h3 class="font-bold ${styles.textPrimary} mb-1">Tải ảnh lên</h3>
                        <p class="text-sm ${styles.textSecondary}">Kéo thả hoặc nhấn để chọn ảnh</p>
                    </div>
                </div>
                <button id="scan-btn" onclick="handleImageScan()" class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2" disabled>
                    <i data-lucide="sparkles" size="18"></i> Trích xuất văn bản
                </button>
            </div>

            <div class="w-full md:w-1/2 flex flex-col">
                <label class="block text-sm font-bold ${styles.textSecondary} mb-2">Kết quả trích xuất:</label>
                <div class="flex-1 relative">
                    <textarea id="scan-result" class="w-full h-full ${styles.inputBg} border ${styles.border} rounded-xl p-4 ${styles.textPrimary} font-mono text-sm outline-none focus:border-indigo-500 transition-all resize-none" placeholder="Nội dung văn bản sẽ xuất hiện tại đây..." readonly></textarea>
                    <div id="scan-loading" class="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center hidden">
                        <div class="flex flex-col items-center gap-3 text-white">
                            <i data-lucide="loader-2" class="animate-spin" size="32"></i>
                            <span>Đang phân tích ảnh...</span>
                        </div>
                    </div>
                </div>
                <div class="flex gap-3 mt-4">
                    <button onclick="copyToClipboard(document.getElementById('scan-result').value)" class="btn-core btn-glass flex-1 px-4 py-2.5 ${styles.textPrimary} flex items-center justify-center gap-2">
                        <i data-lucide="copy" size="16"></i> Copy
                    </button>
                    <button onclick="refineScannedText()" class="btn-core btn-success flex-1 px-4 py-2.5 text-white shadow-lg flex items-center justify-center gap-2">
                        <i data-lucide="wand-2" size="18"></i> Tinh chỉnh
                    </button>
                    <button onclick="suggestPromptsFromScan()" class="btn-core btn-primary flex-1 px-4 py-2.5 text-white shadow-lg flex items-center justify-center gap-2">
                        <i data-lucide="search" size="18"></i> Gợi ý
                    </button>
                    <button onclick="transferScanToadd()" class="btn-core btn-success flex-1 px-4 py-2.5 text-white shadow-lg flex items-center justify-center gap-2">
                        <i data-lucide="file-plus" size="18"></i> Tạo Prompt
                    </button>
                </div>
            </div>
        </div>
    `;
}



function renderAddModal(container, initialData = null) {
    const styles = getStyles();
    const defaultContent = initialData ? initialData.content : "";
    
    container.innerHTML = `
        <div class="p-8 border-b ${styles.border} bg-gradient-to-r from-indigo-900/10 to-purple-900/10">
            <h2 class="text-2xl font-bold ${styles.textPrimary} flex items-center gap-3"><i data-lucide="plus" class="text-indigo-500"></i> Đóng góp Prompt</h2>
        </div>
        
        <div class="px-8 pt-6 pb-2">
            <div class="p-4 rounded-xl border border-dashed ${state.theme === 'dark' ? 'border-purple-500/30 bg-purple-500/5' : 'border-purple-300 bg-purple-50'}">
                <div class="flex items-center gap-2 mb-3">
                    <div class="p-1.5 bg-purple-500/10 rounded-lg text-purple-600"><i data-lucide="sparkles" size="16"></i></div>
                    <span class="text-sm font-bold ${styles.textAccent}">Tạo Prompt Thông Minh</span>
                </div>
                <div class="flex gap-2">
                    <input id="smart-idea-input" class="flex-1 ${styles.inputBg} border ${styles.border} rounded-xl px-4 py-2 text-sm ${styles.textPrimary} focus:border-purple-500 outline-none transition-all" placeholder="Nhập ý tưởng ngắn (VD: Viết email xin nghỉ phép...)">
                    <button onclick="generateSmartPrompt()" id="smart-gen-btn" class="whitespace-nowrap px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold shadow-lg shadow-purple-500/30 transition-all flex items-center gap-2">
                        <i data-lucide="zap" size="14"></i> Tạo ngay
                    </button>
                </div>
                <div id="smart-loading" class="hidden mt-2 text-xs text-purple-500 flex items-center gap-2">
                    <i data-lucide="loader-2" class="animate-spin" size="12"></i> Đang suy nghĩ và viết prompt...
                </div>
            </div>
        </div>

        <form onsubmit="handleAddSubmit(event)" class="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1 ${styles.modalBg}">
            <div class="grid grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium ${styles.textSecondary} mb-2">Tiêu đề</label>
                    <input required name="title" class="w-full ${styles.inputBg} border ${styles.border} rounded-xl px-4 py-3 ${styles.textPrimary} focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" placeholder="VD: Sáng tạo slogan">
                </div>
                <div>
                    <label class="block text-sm font-medium ${styles.textSecondary} mb-2">Danh mục</label>
                    <select name="category" class="w-full ${styles.inputBg} border ${styles.border} rounded-xl px-4 py-3 ${styles.textPrimary} outline-none">
                        ${CATEGORIES.filter(c => c !== 'Tất cả' && c !== 'Cá nhân').map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium ${styles.textSecondary} mb-2">Mô tả ý tưởng</label>
                <input required name="description" class="w-full ${styles.inputBg} border ${styles.border} rounded-xl px-4 py-3 ${styles.textPrimary} outline-none" placeholder="Prompt này dùng để làm gì?">
            </div>
            <div>
                <label class="block text-sm font-medium ${styles.textSecondary} mb-2 flex justify-between">
                    Nội dung Prompt
                    <button type="button" onclick="toggleVoiceInput('add-content-input', 'mic-btn-add')" id="mic-btn-add" class="text-xs text-indigo-500 hover:text-indigo-400 flex items-center gap-1">
                        <i data-lucide="mic" size="14"></i> Nhập bằng giọng nói
                    </button>
                </label>
                <div class="relative">
                    <textarea id="add-content-input" required name="content" rows="8" class="w-full ${styles.inputBg} border ${styles.border} rounded-xl px-4 py-3 ${styles.textPrimary} font-mono text-sm outline-none focus:border-indigo-500 transition-all" placeholder="Nhập nội dung...">${defaultContent}</textarea>
                </div>
                ${initialData ? `<p class="text-xs text-emerald-500 mt-2 flex items-center gap-1"><i data-lucide="check-circle" size="12"></i> Đã điền tự động từ kết quả Scan ảnh</p>` : ''}
            </div>
            <button type="submit" class="w-full justify-center py-4 font-bold text-lg relative overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 px-5 rounded-xl flex items-center gap-2 backdrop-blur-md bg-indigo-600/90 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/30">Thêm vào thư viện</button>
        </form>
    `;
}

let templateVariables = {};
function renderTestModal(container) {
    const styles = getStyles();
    const prompt = state.activePrompt;
    const matches = prompt.content.match(/\[(.*?)\]/g);
    templateVariables = {};
    if(matches) matches.forEach(m => templateVariables[m] = '');

    container.innerHTML = `
        <div class="flex h-full flex-col md:flex-row">
            <div class="w-full md:w-4/12 ${styles.iconBg} border-r ${styles.border} flex flex-col h-full">
                 <div class="p-6 border-b ${styles.border} ${styles.modalBg}">
                     <div class="flex items-center gap-3 mb-2"><div class="p-2 bg-indigo-500/20 rounded-lg text-indigo-500"><i data-lucide="sparkles" size="18"></i></div><h3 class="font-bold ${styles.textPrimary}">Cấu hình Prompt</h3></div>
                     <p class="text-xs ${styles.textSecondary}">Điền thông tin vào các ô trống để hoàn thiện câu lệnh.</p>
                 </div>
                 <div class="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar" id="variables-container">
                     ${Object.keys(templateVariables).length > 0 ? Object.keys(templateVariables).map((key, idx) => `
                        <div>
                            <label class="text-xs font-bold ${styles.textAccent} mb-1.5 flex justify-between ml-1">
                                ${key.replace(/[\[\]]/g, '')}
                                <button onclick="toggleVoiceInput('var-input-${idx}', 'mic-btn-${idx}')" id="mic-btn-${idx}" class="text-xs opacity-50 hover:opacity-100 hover:text-indigo-500 transition-colors" title="Nói để nhập"><i data-lucide="mic" size="12"></i></button>
                            </label>
                            <div class="flex gap-2">
                                <input id="var-input-${idx}" class="variable-input flex-1 ${styles.inputBg} border ${styles.border} rounded-lg px-3 py-2 text-sm ${styles.textPrimary} focus:border-indigo-500 outline-none transition-all" placeholder="..." data-key="${key}" oninput="updatePreview()">
                            </div>
                        </div>
                     `).join('') : `<div class="text-center ${styles.textSecondary} italic text-sm mt-10">Prompt này không có biến số cần điền.</div>`}
                     
                     <div class="pt-4 border-t ${styles.border}">
                        <label class="text-xs font-bold ${styles.textSecondary} mb-2 block flex justify-between">
                            Độ sáng tạo (Temperature) <span id="temp-val">0.7</span>
                        </label>
                        <input type="range" id="temp-slider" min="0" max="1" step="0.1" value="0.7" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" oninput="document.getElementById('temp-val').innerText = this.value">
                     </div>

                     <div class="pt-4 border-t ${styles.border}">
                       <label class="text-xs font-bold ${styles.textSecondary} mb-2 block">Preview Prompt</label>
                       <textarea id="preview-prompt" class="w-full ${styles.inputBg} border ${styles.border} rounded-lg p-3 text-xs ${styles.textSecondary} font-mono h-32 resize-none focus:border-indigo-500 outline-none" readonly>${prompt.content}</textarea>
                       <button onclick="copyCurrentPrompt()" class="mt-2 text-xs flex items-center gap-1 text-indigo-500 hover:text-indigo-400 font-bold ml-auto"><i data-lucide="copy" size="12"></i> Sao chép</button>
                     </div>
                 </div>
                 <div class="p-4 border-t ${styles.border} ${styles.modalBg} space-y-4">
                     <div class="space-y-2">
                        <div class="text-xs font-bold ${styles.textSecondary} text-center mb-2">Kiểu Trả Lời</div>
                        <div class="grid grid-cols-2 gap-2">
                            <button data-response-mode="fast" onclick="toggleResponseMode('fast')" class="py-2 px-3 rounded-lg border ${styles.border} bg-white/5 text-slate-400 text-xs font-bold transition-all hover:bg-white/10">
                                <i data-lucide="zap" size="14" class="inline mr-1"></i> Nhanh
                            </button>
                            <button data-response-mode="detailed" onclick="toggleResponseMode('detailed')" class="py-2 px-3 rounded-lg border ${styles.border} bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 transition-all">
                                <i data-lucide="type" size="14" class="inline mr-1"></i> Chi tiết
                            </button>
                        </div>
                     </div>
                     <button onclick="runPrompt()" class="w-full justify-center relative overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 backdrop-blur-md bg-indigo-600/90 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/30">
                        <i data-lucide="play" size="18" fill="currentColor"></i> Gửi cho Gemini
                     </button>
                     <div>
                       <div class="text-[10px] font-bold uppercase tracking-widest ${styles.textSecondary} text-center mb-3">Chạy nhanh trên nền tảng khác</div>
                       <div class="grid grid-cols-4 gap-2">
                         ${AI_TOOLS.map(tool => `
                           <button onclick="copyAndOpen('${tool.url}')" class="aspect-square rounded-xl border ${styles.border} hover:bg-white/5 flex flex-col items-center justify-center gap-1 transition-all group relative overflow-hidden" title="Copy & Mở ${tool.name}">
                             <div class="w-6 h-6"><img src="${tool.icon}" class="w-full h-full object-contain"></div>
                             <span class="text-[9px] font-medium opacity-60 group-hover:opacity-100 transition-opacity ${styles.textSecondary}">${tool.name}</span>
                           </button>
                         `).join('')}
                       </div>
                     </div>
                 </div>
            </div>
            <div class="flex-1 flex flex-col ${state.theme === 'dark' ? 'bg-[#0b0d14]' : 'bg-slate-50'} relative">
                <div class="p-4 border-b ${styles.border} flex justify-between items-center ${styles.glass} absolute top-0 left-0 right-0 z-10">
                    <span class="text-sm font-bold text-emerald-500 flex items-center gap-2"><i data-lucide="bot" size="16"></i> Chat Session</span>
                    <div class="flex gap-2">
                        <button onclick="downloadChatImage()" class="text-xs ${styles.textSecondary} hover:text-indigo-500 px-3 py-1 rounded-full border ${styles.border} hover:border-indigo-500/30 transition-all flex items-center gap-1">
                            <i data-lucide="image-down" size="14"></i> Tải ảnh chat
                        </button>
                        <button onclick="clearChat()" class="text-xs ${styles.textSecondary} hover:text-red-500 px-3 py-1 rounded-full border ${styles.border} hover:border-red-500/30 transition-all">Clear</button>
                    </div>
                </div>
                <div id="chat-container" class="flex-1 overflow-y-auto p-6 space-y-6 pt-20 custom-scrollbar">
                    <div class="h-full flex flex-col items-center justify-center ${styles.textSecondary} gap-4 opacity-50">
                        <i data-lucide="bot" size="64" stroke-width="1"></i><p>Sẵn sàng trò chuyện</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function switchView(view) {
    state.currentView = view;
    renderApp();
}

function setCategory(cat) {
    state.activeCategory = cat;
    state.activeSubject = null;
    if (state.loadingTimer) {
        clearTimeout(state.loadingTimer);
    }
    state.isLoadingPrompts = true;
    renderApp();
    state.loadingTimer = setTimeout(() => {
        state.isLoadingPrompts = false;
        renderApp();
    }, 600);
}

function setSubject(sub) {
    state.activeSubject = sub;
    if (state.loadingTimer) {
        clearTimeout(state.loadingTimer);
    }
    state.isLoadingPrompts = true;
    renderApp();
    state.loadingTimer = setTimeout(() => {
        state.isLoadingPrompts = false;
        renderApp();
    }, 600);
}

// ==========================================
// INITIALIZATION
// ==========================================
// EXTENSION INSTALLATION
// ==========================================
function downloadExtensionSetup() {
    // Download ZIP file containing extension + script
    const link = document.createElement('a');
    link.href = './AI-Prompt-Refiner-Setup.zip';
    link.download = 'AI-Prompt-Refiner-Setup.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đang tải file AI-Prompt-Refiner-Setup.zip...');
}

function installExtension() {
    const styles = getStyles();
    const modalContent = document.getElementById('modal-body');
    
    modalContent.innerHTML = `
        <div class="p-8 space-y-6">
            <div class="text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl ${getColorClass('softBg')} mb-4">
                    <i data-lucide="zap" size="32" class="${getColorClass('text')}"></i>
                </div>
                <h2 class="text-3xl font-black ${styles.textPrimary} mb-2">Cài Tiện ích Ngay Bây Giờ</h2>
                <p class="${styles.textSecondary} text-sm">Chỉ 2 bước đơn giản, không cần phức tạp</p>
            </div>

            <div class="space-y-4">
                <div class="rounded-lg ${styles.inputBg} border ${styles.border} p-4">
                    <div class="flex items-start gap-3">
                        <div class="flex-shrink-0 w-8 h-8 rounded-full ${getColorClass('softBg')} flex items-center justify-center font-bold ${getColorClass('text')} text-sm">1</div>
                        <div class="flex-1">
                            <p class="font-semibold ${styles.textPrimary} mb-1">📥 Tải file cài đặt (ZIP)</p>
                            <p class="${styles.textSecondary} text-sm mb-3">File ZIP chứa extension + script cài đặt sẵn sàng</p>
                            <button onclick="downloadExtensionSetup()" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getColorClass('bg')} hover:opacity-90 text-white font-semibold text-sm transition-all">
                                <i data-lucide="download" size="16"></i>
                                Tải AI-Prompt-Refiner-Setup.zip
                            </button>
                        </div>
                    </div>
                </div>

                <div class="rounded-lg ${styles.inputBg} border ${styles.border} p-4">
                    <div class="flex items-start gap-3">
                        <div class="flex-shrink-0 w-8 h-8 rounded-full ${getColorClass('softBg')} flex items-center justify-center font-bold ${getColorClass('text')} text-sm">2</div>
                        <div class="flex-1">
                            <p class="font-semibold ${styles.textPrimary} mb-1">📂 Giải nén ZIP</p>
                            <p class="${styles.textSecondary} text-sm mb-2">
                                Bấm chuột phải vào file ZIP → <span class="font-bold">Extract All</span>
                            </p>
                            <p class="${styles.textSecondary} text-sm">Hoặc dùng 7-Zip, WinRAR để giải nén</p>
                        </div>
                    </div>
                </div>

                <div class="rounded-lg ${styles.inputBg} border ${styles.border} p-4">
                    <div class="flex items-start gap-3">
                        <div class="flex-shrink-0 w-8 h-8 rounded-full ${getColorClass('softBg')} flex items-center justify-center font-bold ${getColorClass('text')} text-sm">3</div>
                        <div class="flex-1">
                            <p class="font-semibold ${styles.textPrimary} mb-1">⚙️ Chạy script cài đặt</p>
                            <p class="${styles.textSecondary} text-sm mb-2">
                                Bấp chuột phải trên <span class="font-mono bg-black/20 px-1.5 py-0.5 rounded text-xs">install-extension.ps1</span>
                            </p>
                            <p class="${styles.textSecondary} text-sm mb-3">Chọn: <span class="font-bold">"Run with PowerShell ISE"</span></p>
                            <p class="${styles.textSecondary} text-sm text-yellow-600">⚠️ Quan trọng: Script sẽ tự động copy extension và mở browser!</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="rounded-lg bg-green-500/10 border border-green-500/30 p-4">
                <div class="flex gap-3">
                    <i data-lucide="check-circle" size="20" class="text-green-500 flex-shrink-0 mt-0.5"></i>
                    <div>
                        <p class="font-semibold text-green-600">✅ Sau khi script chạy xong</p>
                        <p class="text-sm text-green-600/80 mt-1">Trình duyệt sẽ tự động mở trang Extensions. Bạn sẽ thấy <strong>"AI Prompt Refiner"</strong> đã được cài đặt sẵn. Nó sẽ tự động được bật (enabled). Ghé ChatGPT, Gemini hoặc Claude để sử dụng ngay!</p>
                    </div>
                </div>
            </div>

            <div class="rounded-lg bg-blue-500/10 border border-blue-500/30 p-4">
                <div class="flex gap-3">
                    <i data-lucide="info" size="20" class="text-blue-500 flex-shrink-0 mt-0.5"></i>
                    <div>
                        <p class="font-semibold text-blue-600">❓ Nếu có vấn đề?</p>
                        <p class="text-sm text-blue-600/80 mt-1">
                            • Kiểm tra hộp thoại PowerShell - nó sẽ hiển thị từng bước<br>
                            • Đảm bảo bạn không chọn "Run with Administrator"<br>
                            • Nếu script báo lỗi, xem báo cáo trong PowerShell window
                        </p>
                    </div>
                </div>
            </div>

            <div class="rounded-lg bg-purple-500/10 border border-purple-500/30 p-4">
                <div class="flex gap-3">
                    <i data-lucide="rocket" size="20" class="text-purple-500 flex-shrink-0 mt-0.5"></i>
                    <div>
                        <p class="font-semibold text-purple-600">🚀 Sắp tới: Vercel Deployment</p>
                        <p class="text-sm text-purple-600/80 mt-1">Sau khi deploy lên Vercel, sẽ có cách cài đặt dễ hơn với 1 click từ trang web chính</p>
                    </div>
                </div>
            </div>

            <div class="flex gap-3 pt-4 border-t ${styles.border}">
                <button onclick="closeModal()" class="flex-1 py-3 rounded-xl border ${styles.border} ${styles.textPrimary} hover:bg-white/5 font-bold transition-all">
                    Đóng
                </button>
                <button onclick="window.open('extension/README.md', '_blank')" class="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center justify-center gap-2">
                    <i data-lucide="book-open" size="16"></i>
                    Chi tiết thêm
                </button>
            </div>
        </div>
    `;
    
    openModal();
    lucide.createIcons();
}

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================
function setupShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Phím Esc: Đóng modal
        if (e.key === 'Escape') {
            if (state.currentModal) {
                closeModal();
            }
            return;
        }
        
        // Phím /: Focus vào search bar
        if (e.key === '/') {
            // Kiểm tra không đang gõ trong input/textarea
            const activeElement = document.activeElement;
            const isTyping = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';
            
            if (!isTyping) {
                e.preventDefault();
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        }
        
        // Phím Ctrl+Enter (hoặc Cmd+Enter): Gửi prompt
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const previewPrompt = document.getElementById('preview-prompt');
            
            // Kiểm tra nếu đang focus vào ô nhập liệu chat
            if (document.activeElement === previewPrompt && previewPrompt.value.trim()) {
                e.preventDefault();
                runPrompt();
            }
        }
    });
}

// ==========================================
// USER PROFILE FUNCTIONS
// ==========================================
function saveUserApiKey() {
    const apiKeyInput = document.getElementById('user-api-key-input');
    if (!apiKeyInput) return;
    
    const newApiKey = apiKeyInput.value.trim();
    state.userApiKey = newApiKey;
    localStorage.setItem('pm_api_key', newApiKey);
    
    // Update current user if exists
    if (state.currentUser) {
        state.currentUser.apiKey = newApiKey;
        const users = JSON.parse(localStorage.getItem('pm_users') || '[]');
        const userIndex = users.findIndex(u => u.email === state.currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = state.currentUser;
            localStorage.setItem('pm_users', JSON.stringify(users));
        }
    }
    
    showToast('✓ API Key đã được cập nhật!');
}

function logoutUser() {
    state.currentUser = null;
    localStorage.removeItem('pm_currentUser');
    closeModal();
    renderApp();
    showToast('✓ Đã đăng xuất thành công!');
}

// ==========================================
// AVATAR FUNCTIONS
// ==========================================
const AVATAR_COLORS = [
    'bg-gradient-to-br from-indigo-600 to-purple-600',
    'bg-gradient-to-br from-pink-600 to-rose-600',
    'bg-gradient-to-br from-blue-600 to-cyan-600',
    'bg-gradient-to-br from-green-600 to-emerald-600',
    'bg-gradient-to-br from-yellow-600 to-orange-600',
    'bg-gradient-to-br from-red-600 to-pink-600',
    'bg-gradient-to-br from-purple-600 to-pink-600',
    'bg-gradient-to-br from-teal-600 to-green-600',
    'bg-gradient-to-br from-violet-600 to-purple-600',
    'bg-gradient-to-br from-sky-600 to-blue-600'
];

const AVATAR_EMOJIS = ['😊', '😎', '🤗', '😍', '🎉', '⭐', '🚀', '💎', '🎨', '🌟', '🎭', '🎪', '🎸', '📚', '🌈'];

function openAvatarPicker() {
    const styles = getStyles();
    const user = state.currentUser;
    
    const modalContent = `
        <div class="p-6 space-y-6">
            <div class="text-center">
                <h3 class="text-2xl font-bold ${styles.textPrimary} mb-2">Chọn ảnh đại diện</h3>
                <p class="${styles.textSecondary} text-sm">Chọn màu hoặc emoji yêu thích của bạn</p>
            </div>
            
            <!-- Tab chọn -->
            <div class="flex gap-2 border-b ${styles.border} overflow-x-auto">
                <button onclick="switchAvatarTab('color')" class="px-4 py-2 border-b-2 border-indigo-500 text-indigo-500 font-bold transition-all flex items-center gap-2 whitespace-nowrap" id="tab-color">
                    <i data-lucide="palette" size="18"></i> Màu sắc
                </button>
                <button onclick="switchAvatarTab('emoji')" class="px-4 py-2 text-slate-500 hover:text-slate-400 font-bold transition-all flex items-center gap-2 whitespace-nowrap" id="tab-emoji">
                    <i data-lucide="smile" size="18"></i> Emoji
                </button>
                <button onclick="switchAvatarTab('letter')" class="px-4 py-2 text-slate-500 hover:text-slate-400 font-bold transition-all flex items-center gap-2 whitespace-nowrap" id="tab-letter">
                    <i data-lucide="type" size="18"></i> Chữ cái
                </button>
                <button onclick="switchAvatarTab('image')" class="px-4 py-2 text-slate-500 hover:text-slate-400 font-bold transition-all flex items-center gap-2 whitespace-nowrap" id="tab-image">
                    <i data-lucide="image" size="18"></i> Ảnh
                </button>
            </div>
            
            <!-- Color tab -->
            <div id="color-tab-content">
                <p class="text-sm ${styles.textSecondary} mb-4">Chọn một trong những màu gradient này:</p>
                <div class="grid grid-cols-5 gap-3">
                    ${AVATAR_COLORS.map((color, idx) => `
                        <button onclick="selectAvatarColor('${color}')" class="w-12 h-12 ${color} rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all ring-2 ring-transparent hover:ring-white/50 ${user.avatarColor === color ? 'ring-indigo-400 scale-110' : ''}"></button>
                    `).join('')}
                </div>
            </div>
            
            <!-- Emoji tab -->
            <div id="emoji-tab-content" class="hidden">
                <p class="text-sm ${styles.textSecondary} mb-4">Chọn emoji yêu thích:</p>
                <div class="grid grid-cols-6 gap-2">
                    ${AVATAR_EMOJIS.map(emoji => `
                        <button onclick="selectAvatarEmoji('${emoji}')" class="w-12 h-12 text-2xl rounded-lg ${styles.inputBg} border ${styles.border} hover:border-indigo-500 hover:bg-indigo-500/10 transition-all flex items-center justify-center ${user.avatarText === emoji ? 'border-indigo-500 bg-indigo-500/10' : ''}">
                            ${emoji}
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <!-- Letter tab -->
            <div id="letter-tab-content" class="hidden">
                <p class="text-sm ${styles.textSecondary} mb-4">Nhập một chữ cái hoặc ký tự:</p>
                <input type="text" id="avatar-letter-input" maxlength="1" value="${user.avatarText && user.avatarText.length === 1 && !AVATAR_EMOJIS.includes(user.avatarText) ? user.avatarText : user.name.charAt(0).toUpperCase()}" class="w-full ${styles.inputBg} border ${styles.border} rounded-lg px-4 py-3 ${styles.textPrimary} text-center text-2xl font-bold outline-none focus:border-indigo-500 transition-all" placeholder="A">
                <p class="text-xs ${styles.textSecondary} mt-2">Ký tự sẽ được hiển thị trong avatar</p>
            </div>
            
            <!-- Image tab -->
            <div id="image-tab-content" class="hidden">
                <p class="text-sm ${styles.textSecondary} mb-4">Tải ảnh lên làm hình đại diện:</p>
                <div class="upload-area rounded-2xl border-2 border-dashed ${state.theme === 'dark' ? 'border-slate-700 hover:border-indigo-500 bg-slate-800/30' : 'border-slate-300 hover:border-indigo-500 bg-slate-50'} flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all relative group">
                    <input type="file" id="avatar-image-input" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer z-10" onchange="handleAvatarImageSelect(event)">
                    <div id="avatar-placeholder" class="pointer-events-none">
                        <div class="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-500">
                            <i data-lucide="image-plus" size="32"></i>
                        </div>
                        <p class="font-bold ${styles.textPrimary} mb-1">Tải ảnh lên</p>
                        <p class="text-sm ${styles.textSecondary}">Hoặc kéo thả ảnh vào đây</p>
                    </div>
                    <div id="avatar-image-preview" class="hidden absolute inset-0 z-0 p-4">
                        <img id="avatar-preview-img" class="w-full h-full object-cover rounded-xl">
                        <div class="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span class="text-white bg-black/50 px-4 py-2 rounded-lg font-medium">Thay đổi ảnh</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Actions -->
            <div class="flex gap-3 pt-4 border-t ${styles.border}">
                <button onclick="saveAvatar()" class="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold transition-all flex items-center justify-center gap-2">
                    <i data-lucide="check" size="18"></i> Lưu
                </button>
                <button onclick="closeModal()" class="flex-1 py-3 rounded-xl border ${styles.border} ${styles.textPrimary} hover:bg-white/5 font-bold transition-all">
                    Hủy
                </button>
            </div>
        </div>
    `;
    
    state.currentModal = 'avatarPicker';
    document.getElementById('modal-content-wrapper').innerHTML = modalContent;
    document.getElementById('modal-backdrop').classList.remove('hidden');
    lucide.createIcons();
    window.currentAvatarColor = user.avatarColor || AVATAR_COLORS[0];
    window.currentAvatarText = user.avatarText || user.name.charAt(0).toUpperCase();
}

function switchAvatarTab(tab) {
    document.getElementById('color-tab-content').classList.toggle('hidden', tab !== 'color');
    document.getElementById('emoji-tab-content').classList.toggle('hidden', tab !== 'emoji');
    document.getElementById('letter-tab-content').classList.toggle('hidden', tab !== 'letter');
    document.getElementById('image-tab-content').classList.toggle('hidden', tab !== 'image');
    
    document.getElementById('tab-color').classList.toggle('border-b-2', tab === 'color');
    document.getElementById('tab-color').classList.toggle('border-indigo-500', tab === 'color');
    document.getElementById('tab-color').classList.toggle('text-indigo-500', tab === 'color');
    document.getElementById('tab-color').classList.toggle('text-slate-500', tab !== 'color');
    
    document.getElementById('tab-emoji').classList.toggle('border-b-2', tab === 'emoji');
    document.getElementById('tab-emoji').classList.toggle('border-indigo-500', tab === 'emoji');
    document.getElementById('tab-emoji').classList.toggle('text-indigo-500', tab === 'emoji');
    document.getElementById('tab-emoji').classList.toggle('text-slate-500', tab !== 'emoji');
    
    document.getElementById('tab-letter').classList.toggle('border-b-2', tab === 'letter');
    document.getElementById('tab-letter').classList.toggle('border-indigo-500', tab === 'letter');
    document.getElementById('tab-letter').classList.toggle('text-indigo-500', tab === 'letter');
    document.getElementById('tab-letter').classList.toggle('text-slate-500', tab !== 'letter');
    
    document.getElementById('tab-image').classList.toggle('border-b-2', tab === 'image');
    document.getElementById('tab-image').classList.toggle('border-indigo-500', tab === 'image');
    document.getElementById('tab-image').classList.toggle('text-indigo-500', tab === 'image');
    document.getElementById('tab-image').classList.toggle('text-slate-500', tab !== 'image');
}

function selectAvatarColor(color) {
    window.currentAvatarColor = color;
    window.currentAvatarText = state.currentUser.name.charAt(0).toUpperCase();
    // Highlight button
    document.querySelectorAll('#color-tab-content button').forEach(btn => {
        btn.classList.remove('ring-indigo-400', 'scale-110');
        btn.classList.add('ring-transparent');
    });
    event.target.closest('button').classList.add('ring-indigo-400', 'scale-110');
}

function selectAvatarEmoji(emoji) {
    window.currentAvatarText = emoji;
    window.currentAvatarColor = 'bg-gradient-to-br from-indigo-600 to-purple-600';
    // Highlight button
    document.querySelectorAll('#emoji-tab-content button').forEach(btn => {
        btn.classList.remove('border-indigo-500', 'bg-indigo-500/10');
    });
    event.target.closest('button').classList.add('border-indigo-500', 'bg-indigo-500/10');
}

function saveAvatar() {
    const letterInput = document.getElementById('avatar-letter-input');
    const imagePreview = document.getElementById('avatar-image-preview');
    const currentTab = !document.getElementById('letter-tab-content').classList.contains('hidden');
    const imageTab = !document.getElementById('image-tab-content').classList.contains('hidden');
    
    if (currentTab) {
        const letter = letterInput.value.trim().toUpperCase();
        if (!letter) {
            showToast('⚠️ Vui lòng nhập một ký tự!');
            return;
        }
        window.currentAvatarText = letter;
        window.currentAvatarColor = AVATAR_COLORS[0];
    }
    
    if (imageTab && !imagePreview.classList.contains('hidden')) {
        // Save image avatar
        const img = document.getElementById('avatar-preview-img');
        window.currentAvatarImage = img.src;
    }
    
    // Save to state
    state.currentUser.avatarColor = window.currentAvatarColor;
    state.currentUser.avatarText = window.currentAvatarText;
    state.currentUser.avatarImage = window.currentAvatarImage || '';
    
    // Save to localStorage
    const users = JSON.parse(localStorage.getItem('pm_users') || '[]');
    const userIndex = users.findIndex(u => u.email === state.currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = state.currentUser;
        localStorage.setItem('pm_users', JSON.stringify(users));
    }
    localStorage.setItem('pm_currentUser', JSON.stringify(state.currentUser));
    
    closeModal();
    openModal('login');
    showToast('✓ Ảnh đại diện đã được cập nhật!');
}

function handleAvatarImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = document.getElementById('avatar-preview-img');
        img.src = e.target.result;
        window.currentAvatarImage = e.target.result;
        
        document.getElementById('avatar-placeholder').classList.add('hidden');
        document.getElementById('avatar-image-preview').classList.remove('hidden');
        
        showToast('✓ Ảnh đã được tải!');
    };
    reader.readAsDataURL(file);
}

// ==========================================
// SOCIAL FEATURES (Friends & Share)
// ==========================================

// Xử lý prompt dựa trên role
function getDisplayPrompts() {
    const user = state.currentUser;
    let allPrompts = [...MASTER_PROMPTS];
    
    if (user && user.userType === 'teacher') {
        // Giáo viên: Thêm prompt cố định + prompt của chính họ
        allPrompts = allPrompts.filter(p => !p.isTeacherFixed || p.createdBy === user.id);
        if (user.customPrompts && user.customPrompts.length > 0) {
            allPrompts.push(...user.customPrompts);
        }
    } else if (user && user.userType === 'student') {
        // Học sinh: Thêm prompt cố định + prompt của chính họ + prompt được chia sẻ
        allPrompts = allPrompts.filter(p => !p.createdBy); // Chỉ prompt cố định
        if (user.customPrompts && user.customPrompts.length > 0) {
            allPrompts.push(...user.customPrompts);
        }
        if (user.sharedPrompts && user.sharedPrompts.length > 0) {
            allPrompts.push(...user.sharedPrompts);
        }
    }
    
    return allPrompts;
}

function canDeletePrompt(promptId) {
    const user = state.currentUser;
    if (!user) return false;
    
    const prompt = MASTER_PROMPTS.find(p => p.id === promptId);
    if (prompt) {
        // Chỉ giáo viên mới có thể xóa prompt cố định
        return user.userType === 'teacher';
    }
    
    // Có thể xóa prompt của riêng mình
    return true;
}

function canEditPrompt(promptId) {
    const user = state.currentUser;
    if (!user) return false;
    
    // Chỉ có thể edit prompt của riêng mình
    const customPrompt = user.customPrompts?.find(p => p.id === promptId);
    return !!customPrompt;
}

function addPromptToSystem() {
    if (!state.currentUser) {
        openModal('login');
        showToast("Vui lòng đăng nhập trước!");
        return;
    }
    
    const user = state.currentUser;
    const title = prompt("Nhập tiêu đề prompt:");
    if (!title) return;
    
    const description = prompt("Nhập mô tả ngắn:");
    if (!description) return;
    
    const content = prompt("Nhập nội dung prompt:");
    if (!content) return;
    
    const newPrompt = {
        id: Date.now(),
        title: title,
        description: description,
        content: content,
        category: "Cá nhân",
        tags: ["Custom"],
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        isShared: false,
        sharedWith: [],
        isTeacherFixed: user.userType === 'teacher' // Giáo viên: prompt sẽ là "cố định"
    };
    
    if (!user.customPrompts) user.customPrompts = [];
    user.customPrompts.push(newPrompt);
    
    // Nếu là giáo viên, thêm vào MASTER_PROMPTS (toàn hệ thống)
    if (user.userType === 'teacher') {
        newPrompt.isTeacherFixed = true;
        MASTER_PROMPTS.push(newPrompt);
    }
    
    // Lưu
    state.currentUser = user;
    localStorage.setItem('pm_currentUser', JSON.stringify(user));
    const users = JSON.parse(localStorage.getItem('pm_users') || '[]');
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
        users[idx] = user;
        localStorage.setItem('pm_users', JSON.stringify(users));
    }
    
    // Sync to Firebase
    if (user.userType === 'teacher') {
        syncPromptToFirebase(newPrompt);
    }
    syncUserToFirebase(user);
    
    showToast(`✓ ${user.userType === 'teacher' ? 'Prompt đã được thêm vào hệ thống!' : 'Prompt đã được lưu trong tài khoản của bạn!'}`);
    renderApp();
}

function sharePrompt(promptId) {
    if (!state.currentUser) {
        openModal('login');
        showToast("Vui lòng đăng nhập trước!");
        return;
    }
    
    const user = state.currentUser;
    const emailInput = prompt("Nhập email bạn muốn chia sẻ:");
    if (!emailInput) return;
    
    const friendUser = (state.users || []).find(u => u.email === emailInput);
    if (!friendUser) {
        showToast("❌ Không tìm thấy người dùng!");
        return;
    }
    
    const prompt = user.customPrompts?.find(p => p.id === promptId);
    if (!prompt) {
        showToast("❌ Không tìm thấy prompt!");
        return;
    }
    
    if (!friendUser.sharedPrompts) friendUser.sharedPrompts = [];
    
    if (friendUser.sharedPrompts.some(p => p.id === promptId)) {
        showToast("ℹ️ Prompt này đã được chia sẻ!");
        return;
    }
    
    friendUser.sharedPrompts.push({...prompt, sharedFrom: user.id});
    
    // Lưu
    const users = JSON.parse(localStorage.getItem('pm_users') || '[]');
    const friendIdx = users.findIndex(u => u.id === friendUser.id);
    if (friendIdx !== -1) {
        users[friendIdx] = friendUser;
        localStorage.setItem('pm_users', JSON.stringify(users));
    }
    
    showToast("✓ Đã chia sẻ prompt thành công!");
}

function deletePrompt(promptId) {
    if (!canDeletePrompt(promptId)) {
        showToast("❌ Bạn không có quyền xóa prompt này!");
        return;
    }
    
    const user = state.currentUser;
    const promptIndex = user.customPrompts?.findIndex(p => p.id === promptId);
    
    if (promptIndex !== undefined && promptIndex >= 0) {
        user.customPrompts.splice(promptIndex, 1);
        
        // Nếu là prompt cố định, xóa từ MASTER_PROMPTS
        const masterIndex = MASTER_PROMPTS.findIndex(p => p.id === promptId);
        if (masterIndex >= 0) {
            MASTER_PROMPTS.splice(masterIndex, 1);
        }
        
        // Lưu
        state.currentUser = user;
        localStorage.setItem('pm_currentUser', JSON.stringify(user));
        const users = JSON.parse(localStorage.getItem('pm_users') || '[]');
        const userIdx = users.findIndex(u => u.id === user.id);
        if (userIdx !== -1) {
            users[userIdx] = user;
            localStorage.setItem('pm_users', JSON.stringify(users));
        }
        
        showToast("✓ Đã xóa prompt!");
        renderApp();
    }
}

function openFriendsModal() {
    openModal('friends');
}

async function addFriend() {
    const emailInput = document.getElementById('friend-email-input');
    const email = emailInput.value.trim();
    
    if (!email) {
        showToast('⚠️ Vui lòng nhập email!');
        return;
    }
    
    const user = state.currentUser;
    if (!user) {
        showToast('❌ Vui lòng đăng nhập!');
        return;
    }
    
    if (!user.friends) user.friends = [];
    
    if (user.friends.some(f => f.email === email)) {
        showToast('ℹ️ Bạn này đã trong danh sách!');
        return;
    }
    
    if (email === user.email) {
        showToast('❌ Không thể kết bạn với chính mình!');
        return;
    }
    
    showToast('⏳ Đang tìm kiếm người dùng...');
    
    try {
        // Tìm kiếm người dùng trong publicUsers (không cần permission đọc users)
        const publicUsersRef = window.firebaseRef(window.firebaseDB, 'publicUsers');
        const snapshot = await window.firebaseGet(publicUsersRef);
        
        if (!snapshot.exists()) {
            showToast('❌ Không tìm thấy người dùng!');
            return;
        }
        
        const allUsers = snapshot.val();
        let friendUser = null;
        
        // Tìm user theo email
        for (const userId in allUsers) {
            if (allUsers[userId].email === email) {
                friendUser = allUsers[userId];
                break;
            }
        }
        
        if (!friendUser) {
            showToast('❌ Không tìm thấy người dùng với email này!');
            return;
        }
        
        // Thêm bạn vào Firebase
        const friendData = {
            id: friendUser.id,
            name: friendUser.name,
            email: friendUser.email
        };
        
        const result = await addFriendToFirebase(user.id, friendData);
        
        if (result.success) {
            // Cập nhật state local
            user.friends.push(friendData);
            state.currentUser = user;
            localStorage.setItem('pm_currentUser', JSON.stringify(user));
            
            emailInput.value = '';
            showToast('✓ Đã kết bạn thành công!');
            
            // Re-render modal
            openModal('friends');
        }
    } catch (error) {
        console.error('❌ Lỗi thêm bạn:', error);
        showToast('❌ Không thể thêm bạn. Vui lòng thử lại.');
    }
}

function removeFriend(index) {
    const user = state.currentUser;
    if (!user.friends) return;
    
    user.friends.splice(index, 1);
    
    localStorage.setItem('pm_currentUser', JSON.stringify(user));
    const users = JSON.parse(localStorage.getItem('pm_users') || '[]');
    const idx = users.findIndex(u => u.email === user.email);
    if (idx !== -1) {
        users[idx] = user;
        localStorage.setItem('pm_users', JSON.stringify(users));
    }
    
    openFriendsModal();
    showToast('✓ Đã xóa bạn bè!');
}

function sharePrompt(promptId) {
    const prompt = (state.prompts || []).find(p => p.id === promptId);
    if (!prompt) return;
    
    const user = state.currentUser;
    const friends = user.friends || [];
    
    if (friends.length === 0) {
        showToast('❌ Bạn chưa có bạn bè để chia sẻ!');
        return;
    }
    
    const styles = getStyles();
    const modalContent = `
        <div class="p-6 space-y-6">
            <div class="text-center">
                <h3 class="text-2xl font-bold ${styles.textPrimary} mb-2">Chia sẻ Prompt</h3>
                <p class="${styles.textSecondary} text-sm">Chia sẻ "<strong>${prompt.title}</strong>" với bạn bè</p>
            </div>
            
            <!-- Friends list -->
            <div class="max-h-96 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                ${friends.map((friend, idx) => `
                    <button onclick="sendPromptToFriend(${promptId}, ${idx})" class="w-full p-3 rounded-lg ${styles.inputBg} border ${styles.border} hover:border-indigo-500/50 hover:bg-indigo-500/5 text-left transition-all flex items-center justify-between group">
                        <div>
                            <p class="font-bold ${styles.textPrimary} group-hover:text-indigo-400">${friend.name}</p>
                            <p class="text-xs ${styles.textSecondary}">${friend.email}</p>
                        </div>
                        <i data-lucide="send" class="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" size="16"></i>
                    </button>
                `).join('')}
            </div>
            
            <!-- Actions -->
            <div class="flex gap-3 pt-4 border-t ${styles.border}">
                <button onclick="closeModal()" class="flex-1 py-3 rounded-xl border ${styles.border} ${styles.textPrimary} hover:bg-white/5 font-bold transition-all">
                    Hủy
                </button>
            </div>
        </div>
    `;
    
    state.currentModal = 'sharePrompt';
    document.getElementById('modal-content-wrapper').innerHTML = modalContent;
    lucide.createIcons();
}

function sendPromptToFriend(promptId, friendIndex) {
    const user = state.currentUser;
    const friend = user?.friends?.[friendIndex];
    const prompt = (state.prompts || []).find(p => p.id === promptId);
    
    if (!friend || !prompt) return;
    
    // Create share record
    if (!user.sharedPrompts) user.sharedPrompts = [];
    user.sharedPrompts.push({
        promptId: promptId,
        friendEmail: friend.email,
        sharedAt: new Date().toISOString()
    });
    
    // Save
    localStorage.setItem('pm_currentUser', JSON.stringify(user));
    const users = JSON.parse(localStorage.getItem('pm_users') || '[]');
    const idx = users.findIndex(u => u.email === user.email);
    if (idx !== -1) {
        users[idx] = user;
        localStorage.setItem('pm_users', JSON.stringify(users));
    }
    
    closeModal();
    showToast(`✓ Đã chia sẻ với ${friend.name}!`);
}

function renderShareModal(container) {
    const styles = getStyles();
    const user = state.currentUser;
    
    if (!user.customPrompts || user.customPrompts.length === 0) {
        container.innerHTML = `
            <div class="p-8 text-center">
                <div class="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-500">
                    <i data-lucide="share-2" size="32"></i>
                </div>
                <h3 class="text-2xl font-bold ${styles.textPrimary} mb-2">Chưa có Prompt để chia sẻ</h3>
                <p class="${styles.textSecondary}">Hãy tạo hoặc thêm Prompt trước khi chia sẻ</p>
            </div>
        `;
        return;
    }
    
    const friends = user.friends || [];
    
    container.innerHTML = `
        <div class="p-6 space-y-6 h-full flex flex-col">
            <div class="text-center">
                <h3 class="text-2xl font-bold ${styles.textPrimary} mb-2">Chia sẻ Prompt</h3>
                <p class="${styles.textSecondary} text-sm">Chọn Prompt để chia sẻ với bạn bè</p>
            </div>
            
            ${friends.length === 0 ? `
                <div class="text-center py-8 ${styles.textSecondary}">
                    <p class="mb-3">Bạn chưa có bạn bè</p>
                    <button onclick="openFriendsModal()" class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all">
                        Thêm bạn bè
                    </button>
                </div>
            ` : `
                <!-- Prompts list -->
                <div class="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                    ${(user.customPrompts || []).map((promptId, idx) => {
                        const prompt = (state.prompts || []).find(p => p.id === promptId);
                        return prompt ? `
                            <button onclick="sharePrompt(${promptId})" class="w-full p-3 rounded-lg ${styles.inputBg} border ${styles.border} hover:border-indigo-500/50 hover:bg-indigo-500/5 text-left transition-all group">
                                <p class="font-bold ${styles.textPrimary} group-hover:text-indigo-400 truncate">${prompt.title}</p>
                                <p class="text-xs ${styles.textSecondary} truncate">${prompt.description || 'Không có mô tả'}</p>
                            </button>
                        ` : '';
                    }).join('')}
                </div>
            `}
            
            <!-- Actions -->
            <div class="flex gap-3 pt-4 border-t ${styles.border}">
                <button onclick="closeModal()" class="flex-1 py-3 rounded-xl border ${styles.border} ${styles.textPrimary} hover:bg-white/5 font-bold transition-all">
                    Hủy
                </button>
            </div>
        </div>
    `;
}

// ==========================================
// ==========================================
// AI Result Enhancement Functions
// ==========================================

// Tóm tắt kết quả
async function summarizeResult(resultIndex) {
    const text = state.chatHistory[resultIndex]?.content;
    if (!text) return;
    
    const chatContainer = document.getElementById('chat-container');
    const styles = getStyles();
    
    const loadingId = 'loading-summary-' + Date.now();
    const loadingHTML = `
        <div id="${loadingId}" class="flex gap-4 justify-start">
            <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mt-1"><i data-lucide="loader-2" class="animate-spin text-white" size="16"></i></div>
            <div class="${styles.cardBg} rounded-2xl p-4 border ${styles.border}">
                <div class="flex gap-1"><span class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span><span class="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></span><span class="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></span></div>
            </div>
        </div>
    `;
    chatContainer.insertAdjacentHTML('beforeend', loadingHTML);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    try {
        const prompt = `Hãy tóm tắt nội dung sau đây một cách ngắn gọn và súc tích, nêu các ý chính:\n\n${text}`;
        const summary = await callGeminiAPI(prompt);
        
        document.getElementById(loadingId).remove();
        
        const summaryHTML = `
            <div class="flex gap-4 justify-start">
                <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mt-1 shadow-lg"><i data-lucide="file-text" class="text-white" size="16"></i></div>
                <div class="max-w-[85%] rounded-2xl p-5 shadow-md ${styles.cardBg} border border-blue-500/30 ${styles.textPrimary} rounded-tl-sm">
                    <h4 class="font-bold text-blue-500 mb-2">📝 Tóm tắt</h4>
                    <div class="whitespace-pre-wrap text-sm leading-relaxed">${simpleMarkdown(summary)}</div>
                </div>
            </div>
        `;
        chatContainer.insertAdjacentHTML('beforeend', summaryHTML);
        lucide.createIcons();
        chatContainer.scrollTop = chatContainer.scrollHeight;
        showToast("Đã tạo tóm tắt!");
    } catch (error) {
        document.getElementById(loadingId).remove();
        showToast("Lỗi khi tạo tóm tắt: " + error.message);
    }
}

// Tạo flashcards
async function createFlashcards(resultIndex) {
    const text = state.chatHistory[resultIndex]?.content;
    if (!text) return;
    
    const chatContainer = document.getElementById('chat-container');
    const styles = getStyles();
    
    const loadingId = 'loading-flashcard-' + Date.now();
    const loadingHTML = `
        <div id="${loadingId}" class="flex gap-4 justify-start">
            <div class="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mt-1"><i data-lucide="loader-2" class="animate-spin text-white" size="16"></i></div>
            <div class="${styles.cardBg} rounded-2xl p-4 border ${styles.border}">
                <div class="flex gap-1"><span class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span><span class="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-75"></span><span class="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150"></span></div>
            </div>
        </div>
    `;
    chatContainer.insertAdjacentHTML('beforeend', loadingHTML);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    try {
        const prompt = `Từ nội dung sau, hãy tạo 5-7 flashcard để ôn tập. Mỗi flashcard có:
- Mặt trước (câu hỏi/khái niệm)
- Mặt sau (câu trả lời/giải thích)

Format:
---
[Mặt trước]
Câu hỏi hoặc khái niệm

[Mặt sau]
Câu trả lời hoặc giải thích chi tiết
---

Nội dung: ${text}`;
        
        const flashcards = await callGeminiAPI(prompt);
        
        document.getElementById(loadingId).remove();
        
        const flashcardHTML = `
            <div class="flex gap-4 justify-start">
                <div class="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mt-1 shadow-lg"><i data-lucide="credit-card" class="text-white" size="16"></i></div>
                <div class="max-w-[85%] rounded-2xl p-5 shadow-md ${styles.cardBg} border border-purple-500/30 ${styles.textPrimary} rounded-tl-sm">
                    <h4 class="font-bold text-purple-500 mb-2">🎴 Flashcards ôn tập</h4>
                    <div class="whitespace-pre-wrap text-sm leading-relaxed">${simpleMarkdown(flashcards)}</div>
                </div>
            </div>
        `;
        chatContainer.insertAdjacentHTML('beforeend', flashcardHTML);
        lucide.createIcons();
        chatContainer.scrollTop = chatContainer.scrollHeight;
        showToast("Đã tạo flashcards!");
    } catch (error) {
        document.getElementById(loadingId).remove();
        showToast("Lỗi khi tạo flashcards: " + error.message);
    }
}

// Tạo câu hỏi kiểm tra
async function createQuiz(resultIndex) {
    const text = state.chatHistory[resultIndex]?.content;
    if (!text) return;
    
    const chatContainer = document.getElementById('chat-container');
    const styles = getStyles();
    
    const loadingId = 'loading-quiz-' + Date.now();
    const loadingHTML = `
        <div id="${loadingId}" class="flex gap-4 justify-start">
            <div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mt-1"><i data-lucide="loader-2" class="animate-spin text-white" size="16"></i></div>
            <div class="${styles.cardBg} rounded-2xl p-4 border ${styles.border}">
                <div class="flex gap-1"><span class="w-2 h-2 bg-green-400 rounded-full animate-bounce"></span><span class="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-75"></span><span class="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-150"></span></div>
            </div>
        </div>
    `;
    chatContainer.insertAdjacentHTML('beforeend', loadingHTML);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    try {
        const prompt = `Dựa trên nội dung sau, hãy tạo 5 câu hỏi kiểm tra (trắc nghiệm hoặc tự luận) để đánh giá mức độ hiểu biết. 
Mỗi câu hỏi nên có:
- Câu hỏi
- Đáp án đúng (nếu là trắc nghiệm thì có 4 lựa chọn A, B, C, D)
- Giải thích ngắn gọn

Nội dung: ${text}`;
        
        const quiz = await callGeminiAPI(prompt);
        
        document.getElementById(loadingId).remove();
        
        const quizHTML = `
            <div class="flex gap-4 justify-start">
                <div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mt-1 shadow-lg"><i data-lucide="help-circle" class="text-white" size="16"></i></div>
                <div class="max-w-[85%] rounded-2xl p-5 shadow-md ${styles.cardBg} border border-green-500/30 ${styles.textPrimary} rounded-tl-sm">
                    <h4 class="font-bold text-green-500 mb-2">❓ Câu hỏi kiểm tra</h4>
                    <div class="whitespace-pre-wrap text-sm leading-relaxed">${simpleMarkdown(quiz)}</div>
                </div>
            </div>
        `;
        chatContainer.insertAdjacentHTML('beforeend', quizHTML);
        lucide.createIcons();
        chatContainer.scrollTop = chatContainer.scrollHeight;
        showToast("Đã tạo câu hỏi kiểm tra!");
    } catch (error) {
        document.getElementById(loadingId).remove();
        showToast("Lỗi khi tạo câu hỏi: " + error.message);
    }
}

// ==========================================
// Learning Space Functions
// ==========================================

function setLearningTab(tab) {
    state.learningTab = tab;
    renderApp();
}

function setLearningSearch(term) {
    state.learningSearch = term;
    renderApp();
    setTimeout(() => {
        document.getElementById('learning-search-input')?.focus();
    }, 100);
}

function useLearningPrompt(promptId) {
    const prompt = state.prompts.find(p => p.id === promptId);
    if (!prompt) return;
    
    state.currentView = 'chat';
    state.chatHistory = [];
    state.activePrompt = prompt;
    renderApp();
    
    // Set prompt vào preview
    setTimeout(() => {
        const previewPrompt = document.getElementById('preview-prompt');
        if (previewPrompt) {
            previewPrompt.value = prompt.content;
            previewPrompt.focus();
        }
    }, 100);
}

async function handleLearningImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const resultDiv = document.getElementById('learning-scan-result');
    const styles = getStyles();
    
    resultDiv.innerHTML = `
        <div class="${styles.cardBg} border ${styles.border} rounded-xl p-4">
            <div class="flex items-center gap-3">
                <i data-lucide="loader-2" class="animate-spin text-indigo-500" size="20"></i>
                <span class="${styles.textPrimary}">Đang xử lý ảnh...</span>
            </div>
        </div>
    `;
    
    try {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const base64Image = e.target.result.split(',')[1];
            
            const url = '/api/image-scan';
            const idToken = await getFirebaseIdToken();
            
            const headers = { 'Content-Type': 'application/json' };
            if (idToken) headers['Authorization'] = `Bearer ${idToken}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify({ 
                    imageBase64: base64Image,
                    action: 'analyze'
                })
            });
            
            const data = await response.json();
            
            if (data.error) throw new Error(data.error);
            
            const result = data.result || 'Không thể phân tích ảnh';
            
            resultDiv.innerHTML = `
                <div class="${styles.cardBg} border ${styles.border} rounded-xl p-6">
                    <h4 class="font-bold ${styles.textPrimary} mb-3 flex items-center gap-2">
                        <i data-lucide="check-circle" class="text-green-500" size="20"></i>
                        Kết quả phân tích
                    </h4>
                    <div class="whitespace-pre-wrap ${styles.textPrimary} text-sm leading-relaxed mb-4">${simpleMarkdown(result)}</div>
                    <button onclick="copyToClipboard(\`${result.replace(/`/g, '\\`')}\`)" class="px-4 py-2 rounded-lg ${styles.iconBg} hover:bg-indigo-500/10 ${styles.textPrimary} text-sm font-bold transition-all flex items-center gap-2">
                        <i data-lucide="copy" size="16"></i> Sao chép
                    </button>
                </div>
            `;
            lucide.createIcons();
        };
        reader.readAsDataURL(file);
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p class="text-red-500 text-sm">Lỗi: ${error.message}</p>
            </div>
        `;
    }
}

async function generateSummary() {
    const input = document.getElementById('summary-input').value.trim();
    if (!input) {
        showToast('Vui lòng nhập nội dung cần tóm tắt');
        return;
    }
    
    const resultDiv = document.getElementById('summary-result');
    const styles = getStyles();
    
    resultDiv.innerHTML = `
        <div class="${styles.cardBg} border ${styles.border} rounded-xl p-4">
            <div class="flex items-center gap-3">
                <i data-lucide="loader-2" class="animate-spin text-blue-500" size="20"></i>
                <span class="${styles.textPrimary}">Đang tạo tóm tắt...</span>
            </div>
        </div>
    `;
    
    try {
        const prompt = `Hãy tóm tắt nội dung sau đây một cách ngắn gọn và súc tích, nêu các ý chính:\n\n${input}`;
        const summary = await callGeminiAPI(prompt);
        
        resultDiv.innerHTML = `
            <div class="${styles.cardBg} border border-blue-500/30 rounded-xl p-6">
                <h4 class="font-bold text-blue-500 mb-3 flex items-center gap-2">
                    <i data-lucide="file-text" size="20"></i>
                    Tóm tắt
                </h4>
                <div class="whitespace-pre-wrap ${styles.textPrimary} text-sm leading-relaxed mb-4">${simpleMarkdown(summary)}</div>
                <button onclick="copyToClipboard(\`${summary.replace(/`/g, '\\`')}\`)" class="px-4 py-2 rounded-lg ${styles.iconBg} hover:bg-blue-500/10 text-blue-500 text-sm font-bold transition-all flex items-center gap-2">
                    <i data-lucide="copy" size="16"></i> Sao chép
                </button>
            </div>
        `;
        lucide.createIcons();
        showToast('Đã tạo tóm tắt!');
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p class="text-red-500 text-sm">Lỗi: ${error.message}</p>
            </div>
        `;
    }
}

async function generateFlashcards() {
    const input = document.getElementById('flashcard-input').value.trim();
    if (!input) {
        showToast('Vui lòng nhập nội dung');
        return;
    }
    
    const resultDiv = document.getElementById('flashcard-result');
    const styles = getStyles();
    
    resultDiv.innerHTML = `
        <div class="${styles.cardBg} border ${styles.border} rounded-xl p-4">
            <div class="flex items-center gap-3">
                <i data-lucide="loader-2" class="animate-spin text-purple-500" size="20"></i>
                <span class="${styles.textPrimary}">Đang tạo flashcards...</span>
            </div>
        </div>
    `;
    
    try {
        const prompt = `Từ nội dung sau, hãy tạo 5-7 flashcard để ôn tập. Mỗi flashcard có:
- Mặt trước (câu hỏi/khái niệm)
- Mặt sau (câu trả lời/giải thích)

Format:
---
[Mặt trước]
Câu hỏi hoặc khái niệm

[Mặt sau]
Câu trả lời hoặc giải thích chi tiết
---

Nội dung: ${input}`;
        
        const flashcards = await callGeminiAPI(prompt);
        
        resultDiv.innerHTML = `
            <div class="${styles.cardBg} border border-purple-500/30 rounded-xl p-6">
                <h4 class="font-bold text-purple-500 mb-3 flex items-center gap-2">
                    <i data-lucide="credit-card" size="20"></i>
                    Flashcards ôn tập
                </h4>
                <div class="whitespace-pre-wrap ${styles.textPrimary} text-sm leading-relaxed mb-4">${simpleMarkdown(flashcards)}</div>
                <button onclick="copyToClipboard(\`${flashcards.replace(/`/g, '\\`')}\`)" class="px-4 py-2 rounded-lg ${styles.iconBg} hover:bg-purple-500/10 text-purple-500 text-sm font-bold transition-all flex items-center gap-2">
                    <i data-lucide="copy" size="16"></i> Sao chép
                </button>
            </div>
        `;
        lucide.createIcons();
        showToast('Đã tạo flashcards!');
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p class="text-red-500 text-sm">Lỗi: ${error.message}</p>
            </div>
        `;
    }
}

async function generateQuiz() {
    const input = document.getElementById('quiz-input').value.trim();
    if (!input) {
        showToast('Vui lòng nhập nội dung');
        return;
    }
    
    const resultDiv = document.getElementById('quiz-result');
    const styles = getStyles();
    
    resultDiv.innerHTML = `
        <div class="${styles.cardBg} border ${styles.border} rounded-xl p-4">
            <div class="flex items-center gap-3">
                <i data-lucide="loader-2" class="animate-spin text-green-500" size="20"></i>
                <span class="${styles.textPrimary}">Đang tạo câu hỏi...</span>
            </div>
        </div>
    `;
    
    try {
        const prompt = `Dựa trên nội dung sau, hãy tạo 5 câu hỏi kiểm tra (trắc nghiệm hoặc tự luận) để đánh giá mức độ hiểu biết. 
Mỗi câu hỏi nên có:
- Câu hỏi
- Đáp án đúng (nếu là trắc nghiệm thì có 4 lựa chọn A, B, C, D)
- Giải thích ngắn gọn

Nội dung: ${input}`;
        
        const quiz = await callGeminiAPI(prompt);
        
        resultDiv.innerHTML = `
            <div class="${styles.cardBg} border border-green-500/30 rounded-xl p-6">
                <h4 class="font-bold text-green-500 mb-3 flex items-center gap-2">
                    <i data-lucide="help-circle" size="20"></i>
                    Câu hỏi kiểm tra
                </h4>
                <div class="whitespace-pre-wrap ${styles.textPrimary} text-sm leading-relaxed mb-4">${simpleMarkdown(quiz)}</div>
                <button onclick="copyToClipboard(\`${quiz.replace(/`/g, '\\`')}\`)" class="px-4 py-2 rounded-lg ${styles.iconBg} hover:bg-green-500/10 text-green-500 text-sm font-bold transition-all flex items-center gap-2">
                    <i data-lucide="copy" size="16"></i> Sao chép
                </button>
            </div>
        `;
        lucide.createIcons();
        showToast('Đã tạo câu hỏi!');
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p class="text-red-500 text-sm">Lỗi: ${error.message}</p>
            </div>
        `;
    }
}

// Phone OTP Authentication Modal
// ==========================================
window.onload = () => {
    applyTheme();
    setupShortcuts();
    
    // Khởi tạo Firebase Authentication State Listener
    watchAuthState((user) => {
        if (user) {
            // Người dùng đã đăng nhập
            renderApp();
        } else {
            // Người dùng chưa đăng nhập
            renderApp();
        }
    });
    
    renderApp();
    initFirebase(); // Initialize Firebase sync
};