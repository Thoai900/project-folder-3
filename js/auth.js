// ==========================================
// FIREBASE AUTHENTICATION & USER MANAGEMENT
// ==========================================

/**
 * Đăng ký tài khoản mới với email và password
 * @param {string} email - Email người dùng
 * @param {string} password - Mật khẩu
 * @param {string} name - Tên người dùng
 * @param {string} userType - Loại người dùng (student/teacher)
 * @returns {Promise}
 */
async function firebaseSignUp(email, password, name, userType = 'student') {
    try {
        // Đăng ký tài khoản Firebase Auth
        const userCredential = await window.firebaseCreateUserWithEmailAndPassword(
            window.firebaseAuth,
            email,
            password
        );
        
        const user = userCredential.user;
        const userId = user.uid;
        
        // Lưu thông tin người dùng vào Realtime Database
        const userRef = window.firebaseRef(window.firebaseDB, `users/${userId}`);
        
        await window.firebaseSet(userRef, {
            id: userId,
            email: email || '',
            name: name || email.split('@')[0],
            userType: userType || 'student',
            avatar: null,
            phone: null,
            isAnonymous: false,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            favorites: [],
            friends: [],
            customPrompts: [],
            sharedPrompts: [],
            settings: {
                theme: 'dark',
                language: 'vi'
            }
        });
        
        console.log('✅ Đăng ký thành công:', userId);
        // Gửi email xác minh
        if (window.firebaseSendEmailVerification) {
            try {
                await window.firebaseSendEmailVerification(user);
                console.log('📧 Email xác minh đã gửi tới:', email);
                showToast(`✓ Đăng ký thành công! Kiểm tra email ${email} để xác minh (kể cả spam).`, 'info');
            } catch (emailError) {
                console.error('❌ Lỗi gửi email xác minh:', emailError);
                showToast(`✓ Đăng ký thành công nhưng không gửi được email xác minh. Vui lòng yêu cầu gửi lại.`, 'warning');
            }
        } else {
            showToast(`✓ Chào mừng ${name}! Đăng ký thành công.`, 'success');
        }
        
        return { success: true, userId };
    } catch (error) {
        console.error('❌ Lỗi đăng ký:', error.message);
        
        let errorMsg = 'Đăng ký thất bại. Vui lòng thử lại.';
        
        if (error.code === 'auth/email-already-in-use') {
            errorMsg = 'Email này đã được sử dụng.';
        } else if (error.code === 'auth/weak-password') {
            errorMsg = 'Mật khẩu quá yếu (tối thiểu 6 ký tự).';
        } else if (error.code === 'auth/invalid-email') {
            errorMsg = 'Email không hợp lệ.';
        }
        
        showToast(`❌ ${errorMsg}`);
        return { success: false, error: error.message };
    }
}

/**
 * Đăng nhập với email và password
 * @param {string} email - Email người dùng
 * @param {string} password - Mật khẩu
 * @returns {Promise}
 */
async function firebaseLogin(email, password) {
    try {
        const userCredential = await window.firebaseSignInWithEmailAndPassword(
            window.firebaseAuth,
            email,
            password
        );
        
        const user = userCredential.user;
        const userId = user.uid;

        // Yêu cầu email đã xác minh
        if (!user.emailVerified) {
            if (window.firebaseSendEmailVerification) {
                await window.firebaseSendEmailVerification(user);
            }
            showToast('Vui lòng xác minh email trước khi sử dụng.', 'warning');
            await window.firebaseSignOut(window.firebaseAuth);
            return { success: false, error: 'Email chưa xác minh' };
        }
        
        // Cập nhật thời gian đăng nhập cuối cùng
        const userRef = window.firebaseRef(window.firebaseDB, `users/${userId}`);
        await window.firebaseUpdate(userRef, {
            lastLogin: new Date().toISOString()
        });
        
        console.log('✅ Đăng nhập thành công:', userId);
        showToast('✓ Đăng nhập thành công!');
        
        return { success: true, userId };
    } catch (error) {
        console.error('❌ Lỗi đăng nhập:', error.message);
        
        let errorMsg = 'Đăng nhập thất bại.';
        
        if (error.code === 'auth/user-not-found') {
            errorMsg = 'Email không tồn tại.';
        } else if (error.code === 'auth/wrong-password') {
            errorMsg = 'Mật khẩu không chính xác.';
        } else if (error.code === 'auth/invalid-email') {
            errorMsg = 'Email không hợp lệ.';
        }
        
        showToast(`❌ ${errorMsg}`);
        return { success: false, error: error.message };
    }
}

// Gửi lại email xác minh dựa trên thông tin form (email + mật khẩu)
async function resendVerificationEmailFromForm() {
    try {
        const btn = document.querySelector('button[onclick="resendVerificationEmailFromForm()"]');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i data-lucide="loader-2" size="12" class="inline animate-spin mr-1"></i> Đang gửi...';
            if (window.lucide?.createIcons) lucide.createIcons();
        }

        const email = document.querySelector('#auth-form input[name="email"]')?.value?.trim();
        const password = document.querySelector('#auth-form input[name="password"]')?.value;

        if (!email || !password) {
            showToast('Nhập email và mật khẩu để gửi lại xác minh', 'warning');
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = 'Gửi lại email xác minh';
            }
            return;
        }

        const cred = await window.firebaseSignInWithEmailAndPassword(window.firebaseAuth, email, password);
        const user = cred.user;

        if (user.emailVerified) {
            showToast('Email đã được xác minh trước đó', 'info');
        } else {
            if (window.firebaseSendEmailVerification) {
                await window.firebaseSendEmailVerification(user);
            }
            showToast('✓ Đã gửi lại email xác minh. Kiểm tra hộp thư.', 'success');
        }

        await window.firebaseSignOut(window.firebaseAuth);
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = 'Gửi lại email xác minh';
        }
    } catch (error) {
        console.error('❌ Lỗi gửi lại email xác minh:', error);
        showToast('Không thể gửi lại email xác minh. Kiểm tra thông tin đăng nhập.', 'error');
        const btn = document.querySelector('button[onclick="resendVerificationEmailFromForm()"]');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = 'Gửi lại email xác minh';
        }
    }
}

/**
 * Đăng nhập với Google
 * @returns {Promise}
 */
async function firebaseLoginWithGoogle() {
    try {
        if (!window.firebaseGoogleAuthProvider) {
            console.error('❌ Google Auth Provider chưa được load');
            showToast('Google Sign-in không khả dụng. Vui lòng thử lại.', 'error');
            return { success: false, error: 'Google Auth not available' };
        }

        console.log('🔄 Đang bắt đầu Google OAuth popup...');
        const result = await window.firebaseSignInWithPopup(window.firebaseAuth, window.firebaseGoogleAuthProvider);
        const user = result.user;
        const userId = user.uid;

        console.log('✅ Google OAuth thành công. Email verified:', user.emailVerified, 'UID:', userId);

        // Kiểm tra user đã tồn tại trong DB chưa
        const userRef = window.firebaseRef(window.firebaseDB, `users/${userId}`);
        const snapshot = await window.firebaseGet(userRef);

        if (!snapshot.exists()) {
            // Tạo user profile nếu chưa tồn tại
            console.log('📝 Tạo user profile mới cho:', user.email);
            await window.firebaseSet(userRef, {
                id: userId,
                email: user.email || '',
                name: user.displayName || user.email.split('@')[0],
                userType: 'student',
                avatar: user.photoURL || null,
                phone: null,
                isAnonymous: false,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                favorites: [],
                friends: [],
                customPrompts: [],
                sharedPrompts: [],
                settings: {
                    theme: 'dark',
                    language: 'vi'
                }
            });
        } else {
            // Cập nhật lastLogin
            console.log('🔄 Cập nhật lastLogin cho user:', userId);
            await window.firebaseUpdate(userRef, {
                lastLogin: new Date().toISOString()
            });
        }

        console.log('✅ Đăng nhập Google thành công:', userId);
        showToast(`✓ Chào mừng ${user.displayName || user.email}!`);
        
        // Đóng modal và refresh app (watchAuthState sẽ tự động load dữ liệu người dùng)
        if (typeof closeModal === 'function') {
            closeModal();
        }
        if (typeof renderApp === 'function') {
            renderApp();
        }
        
        return { success: true, userId };
    } catch (error) {
        console.error('❌ Lỗi đăng nhập Google:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        let errorMsg = 'Không thể đăng nhập với Google.';
        if (error.code === 'auth/popup-closed-by-user') {
            errorMsg = 'Cửa sổ đăng nhập bị đóng. Vui lòng thử lại.';
        } else if (error.code === 'auth/popup-blocked') {
            errorMsg = 'Cửa sổ đăng nhập bị chặn. Vui lòng cho phép pop-up trong trình duyệt.';
        } else if (error.code === 'auth/account-exists-with-different-credential') {
            errorMsg = 'Email này đã được đăng ký. Vui lòng đăng nhập bằng email/mật khẩu.';
        } else if (error.code === 'auth/invalid-api-key') {
            errorMsg = 'Cấu hình Firebase không hợp lệ. Vui lòng liên hệ hỗ trợ.';
        }
        
        showToast(`❌ ${errorMsg}`);
        console.error('Full error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Đăng xuất khỏi tài khoản
 * @returns {Promise}
 */
async function firebaseLogout() {
    try {
        await window.firebaseSignOut(window.firebaseAuth);
        console.log('✅ Đã đăng xuất.');
        showToast('✓ Đăng xuất thành công!');
        return { success: true };
    } catch (error) {
        console.error('❌ Lỗi đăng xuất:', error.message);
        showToast('❌ Lỗi đăng xuất. Vui lòng thử lại.');
        return { success: false, error: error.message };
    }
}

// Xóa toàn bộ dữ liệu đăng nhập phía client (localStorage) và sign-out
async function clearLocalAuthData() {
    try {
        localStorage.removeItem('pm_currentUser');
        localStorage.removeItem('pm_users');
        localStorage.removeItem('pm_api_key');
        // Nếu muốn xóa luôn dữ liệu prompt cache cũ, bỏ comment dòng dưới
        // localStorage.removeItem('pm_prompts');

        if (window.firebaseAuth?.currentUser) {
            await window.firebaseSignOut(window.firebaseAuth);
        }

        state.currentUser = null;
        state.users = [];
        state.learningSessions = [];
        state.activeLearningSessionId = null;

        showToast('Đã xóa dữ liệu đăng nhập cục bộ', 'success');
        renderApp();
    } catch (error) {
        console.error('❌ Lỗi xóa dữ liệu local auth:', error);
        showToast('Không thể xóa dữ liệu đăng nhập cục bộ', 'error');
    }
}

/**
 * Gửi email reset mật khẩu
 * @param {string} email - Email người dùng
 * @returns {Promise}
 */
async function firebaseSendPasswordReset(email) {
    try {
        await window.firebaseSendPasswordResetEmail(window.firebaseAuth, email);
        console.log('✅ Email reset mật khẩu đã được gửi.');
        showToast('✓ Email reset mật khẩu đã được gửi! Kiểm tra hộp thư của bạn.');
        return { success: true };
    } catch (error) {
        console.error('❌ Lỗi gửi email reset:', error.message);
        
        let errorMsg = 'Không thể gửi email reset.';
        
        if (error.code === 'auth/user-not-found') {
            errorMsg = 'Email không tồn tại trong hệ thống.';
        } else if (error.code === 'auth/invalid-email') {
            errorMsg = 'Email không hợp lệ.';
        }
        
        showToast(`❌ ${errorMsg}`);
        return { success: false, error: error.message };
    }
}

/**
 * Lấy thông tin người dùng hiện tại từ Realtime Database
 * @param {string} userId - ID của người dùng
 * @returns {Promise}
 */
async function getUserData(userId) {
    try {
        const userRef = window.firebaseRef(window.firebaseDB, `users/${userId}`);
        const snapshot = await window.firebaseGet(userRef);
        
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.log('Người dùng không có dữ liệu.');
            return null;
        }
    } catch (error) {
        console.error('❌ Lỗi lấy dữ liệu người dùng:', error);
        return null;
    }
}

/**
 * Cập nhật thông tin người dùng
 * @param {string} userId - ID của người dùng
 * @param {Object} updates - Các trường cần cập nhật
 * @returns {Promise}
 */
async function updateUserData(userId, updates) {
    try {
        const userRef = window.firebaseRef(window.firebaseDB, `users/${userId}`);
        await window.firebaseUpdate(userRef, {
            ...updates,
            updatedAt: new Date().toISOString()
        });
        
        console.log('✅ Cập nhật thông tin người dùng thành công.');
        return { success: true };
    } catch (error) {
        console.error('❌ Lỗi cập nhật thông tin:', error);
        showToast('❌ Lỗi cập nhật thông tin. Vui lòng thử lại.');
        return { success: false, error: error.message };
    }
}

/**
 * Theo dõi trạng thái đăng nhập (Real-time)
 * @param {Function} callback - Hàm callback khi trạng thái thay đổi
 */
function watchAuthState(callback) {
    return window.firebaseOnAuthStateChanged(window.firebaseAuth, async (user) => {
        if (user) {
            console.log('✅ Người dùng đăng nhập:', user.uid);
            console.log('📧 Email verified:', user.emailVerified);
            console.log('🔐 Auth providers:', user.providerData?.map(p => p.providerId));

            // Google OAuth users có email đã được verify tự động
            // Chỉ yêu cầu email verification cho email/password users
            const isGoogleUser = user.providerData?.some(p => p.providerId === 'google.com');
            
            if (!user.emailVerified && !isGoogleUser) {
                console.warn('⚠️ Email chưa xác minh cho user email/password');
                showToast('Email chưa xác minh. Vui lòng kiểm tra hộp thư.', 'warning');
                if (window.firebaseSendEmailVerification) {
                    await window.firebaseSendEmailVerification(user);
                }
                await window.firebaseSignOut(window.firebaseAuth);
                callback(null);
                return;
            }
            
            // Lấy dữ liệu người dùng từ Database
            const userData = await getUserData(user.uid);
            
            if (userData) {
                // Chuyển đổi friends object thành array
                let friends = [];
                if (userData.friends) {
                    if (Array.isArray(userData.friends)) {
                        friends = userData.friends;
                    } else {
                        // Nếu friends là object, chuyển sang array
                        friends = Object.entries(userData.friends).map(([id, data]) => ({
                            id: id,
                            ...data
                        }));
                    }
                }
                
                // Chuyển đổi favorites sang array (nếu cần)
                let favorites = [];
                if (userData.favorites) {
                    if (Array.isArray(userData.favorites)) {
                        favorites = userData.favorites;
                    } else if (typeof userData.favorites === 'object') {
                        favorites = Object.values(userData.favorites);
                    }
                }
                
                // Sync public user profile (cập nhật name nếu thay đổi)
                const publicUserRef = window.firebaseRef(window.firebaseDB, `publicUsers/${user.uid}`);
                await window.firebaseSet(publicUserRef, {
                    id: user.uid,
                    email: user.email,
                    name: userData.name || user.email.split('@')[0]
                });
                
                // Lưu vào state global
                state.currentUser = {
                    id: user.uid,
                    email: user.email,
                    ...userData,
                    friends: friends,
                    favorites: favorites
                };
                
                // Lưu vào localStorage để truy cập nhanh
                localStorage.setItem('pm_currentUser', JSON.stringify(state.currentUser));
                
                // Tải danh sách phiên học đã lưu
                if (typeof loadUserLearningSessions === 'function') {
                    loadUserLearningSessions();
                }

                callback(state.currentUser);
            } else {
                // User exists nhưng không có data - có thể permission denied
                // Tạo user profile từ auth user
                console.log('⚠️ Tạo user profile mới');
                
                try {
                    const userRef = window.firebaseRef(window.firebaseDB, `users/${user.uid}`);
                    const newUserData = {
                        id: user.uid,
                        email: user.email,
                        phone: null,
                        name: user.displayName || user.email.split('@')[0],
                        userType: 'student',
                        isAnonymous: user.isAnonymous || false,
                        createdAt: new Date().toISOString(),
                        lastLogin: new Date().toISOString(),
                        favorites: [],
                        friends: [],
                        customPrompts: [],
                        sharedPrompts: [],
                        settings: {
                            theme: 'dark',
                            language: 'vi'
                        }
                    };
                    
                    await window.firebaseSet(userRef, newUserData);
                    
                    // Tạo public user profile để tìm kiếm
                    const publicUserRef = window.firebaseRef(window.firebaseDB, `publicUsers/${user.uid}`);
                    await window.firebaseSet(publicUserRef, {
                        id: user.uid,
                        email: user.email,
                        name: newUserData.name
                    });
                    
                    state.currentUser = newUserData;
                    localStorage.setItem('pm_currentUser', JSON.stringify(state.currentUser));
                    callback(state.currentUser);
                } catch (error) {
                    console.error('❌ Lỗi tạo user profile:', error);
                    callback(null);
                }
            }
        } else {
            console.log('❌ Người dùng chưa đăng nhập.');
            state.currentUser = null;
            localStorage.removeItem('pm_currentUser');
            state.learningSessions = [];
            state.activeLearningSessionId = null;
            callback(null);
        }
    });
}

/**
 * Thêm bạn bè (sync qua Firebase)
 * @param {string} userId - ID của người dùng hiện tại
 * @param {Object} friendData - Dữ liệu bạn bè
 * @returns {Promise}
 */
async function addFriendToFirebase(userId, friendData) {
    try {
        const friendsRef = window.firebaseRef(window.firebaseDB, `users/${userId}/friends`);
        
        // Tạo friend entry
        const newFriendRef = window.firebasePush(friendsRef);
        await window.firebaseSet(newFriendRef, {
            ...friendData,
            addedAt: new Date().toISOString()
        });
        
        console.log('✅ Thêm bạn thành công.');
        showToast('✓ Thêm bạn thành công!');
        return { success: true };
    } catch (error) {
        console.error('❌ Lỗi thêm bạn:', error);
        showToast('❌ Không thể thêm bạn. Vui lòng thử lại.');
        return { success: false, error: error.message };
    }
}

/**
 * Xóa bạn bè (sync qua Firebase)
 * @param {string} userId - ID của người dùng hiện tại
 * @param {string} friendKey - Key của bạn cần xóa
 * @returns {Promise}
 */
async function removeFriendFromFirebase(userId, friendKey) {
    try {
        const friendRef = window.firebaseRef(window.firebaseDB, `users/${userId}/friends/${friendKey}`);
        await window.firebaseRemove(friendRef);
        
        console.log('✅ Xóa bạn thành công.');
        showToast('✓ Xóa bạn thành công!');
        return { success: true };
    } catch (error) {
        console.error('❌ Lỗi xóa bạn:', error);
        showToast('❌ Không thể xóa bạn. Vui lòng thử lại.');
        return { success: false, error: error.message };
    }
}

/**
 * Lưu custom prompt vào Firebase
 * @param {string} userId - ID của người dùng
 * @param {Object} promptData - Dữ liệu prompt
 * @returns {Promise}
 */
async function saveCustomPromptToFirebase(userId, promptData) {
    try {
        const promptsRef = window.firebaseRef(window.firebaseDB, `users/${userId}/customPrompts`);
        
        const newPromptRef = window.firebasePush(promptsRef);
        const promptId = newPromptRef.key;
        
        await window.firebaseSet(newPromptRef, {
            id: promptId,
            ...promptData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        
        console.log('✅ Lưu prompt thành công.');
        showToast('✓ Prompt đã được lưu!');
        return { success: true, promptId };
    } catch (error) {
        console.error('❌ Lỗi lưu prompt:', error);
        showToast('❌ Không thể lưu prompt. Vui lòng thử lại.');
        return { success: false, error: error.message };
    }
}

/**
 * Xóa custom prompt từ Firebase
 * @param {string} userId - ID của người dùng
 * @param {string} promptKey - Key của prompt cần xóa
 * @returns {Promise}
 */
async function deleteCustomPromptFromFirebase(userId, promptKey) {
    try {
        const promptRef = window.firebaseRef(window.firebaseDB, `users/${userId}/customPrompts/${promptKey}`);
        await window.firebaseRemove(promptRef);
        
        console.log('✅ Xóa prompt thành công.');
        showToast('✓ Prompt đã được xóa!');
        return { success: true };
    } catch (error) {
        console.error('❌ Lỗi xóa prompt:', error);
        showToast('❌ Không thể xóa prompt. Vui lòng thử lại.');
        return { success: false, error: error.message };
    }
}

/**
 * Theo dõi thay đổi dữ liệu người dùng (Real-time sync)
 * @param {string} userId - ID của người dùng
 * @param {Function} callback - Hàm callback khi dữ liệu thay đổi
 */
function listenToUserChanges(userId, callback) {
    const userRef = window.firebaseRef(window.firebaseDB, `users/${userId}`);
    
    return window.firebaseOnValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            state.currentUser = {
                id: userId,
                ...userData
            };
            localStorage.setItem('pm_currentUser', JSON.stringify(state.currentUser));
            callback(userData);
        }
    }, (error) => {
        console.error('❌ Lỗi theo dõi thay đổi:', error);
    });
}

/**
 * Chia sẻ prompt với bạn bè
 * @param {string} userId - ID của người dùng (người chia sẻ)
 * @param {Array<string>} friendIds - Danh sách ID bạn bè cần chia sẻ
 * @param {Object} promptData - Dữ liệu prompt
 * @returns {Promise}
 */
async function sharePromptWithFriends(userId, friendIds, promptData) {
    try {
        const sharedPromptData = {
            ...promptData,
            sharedBy: userId,
            sharedAt: new Date().toISOString()
        };
        
        // Tạo shared prompt entry
        const sharedRef = window.firebaseRef(window.firebaseDB, `users/${userId}/sharedPrompts`);
        const newSharedRef = window.firebasePush(sharedRef);
        
        await window.firebaseSet(newSharedRef, {
            ...sharedPromptData,
            sharedWith: friendIds
        });
        
        // Thêm vào danh sách prompt chia sẻ của bạn bè
        for (const friendId of friendIds) {
            const friendSharedRef = window.firebaseRef(window.firebaseDB, `users/${friendId}/sharedPrompts`);
            const newFriendSharedRef = window.firebasePush(friendSharedRef);
            
            await window.firebaseSet(newFriendSharedRef, {
                ...sharedPromptData,
                sharedBy: userId
            });
        }
        
        console.log('✅ Chia sẻ prompt thành công.');
        showToast('✓ Prompt đã được chia sẻ!');
        return { success: true };
    } catch (error) {
        console.error('❌ Lỗi chia sẻ prompt:', error);
        showToast('❌ Không thể chia sẻ prompt. Vui lòng thử lại.');
        return { success: false, error: error.message };
    }
}
/**
 * Gửi email verification (magic link) để đăng nhập
 * @param {string} email - Email người dùng
 * @param {Object} actionCodeSettings - Cấu hình email action
 * @returns {Promise}
 */
async function sendEmailVerification(email) {
    try {
        const actionCodeSettings = {
            url: `${window.location.origin}?email=${encodeURIComponent(email)}`,
            handleCodeInApp: true
        };
        
        await window.firebaseSendSignInLinkToEmail(window.firebaseAuth, email, actionCodeSettings);
        
        // Lưu email vào localStorage để xác minh sau
        window.localStorage.setItem('emailForSignIn', email);
        
        console.log('✅ Email xác minh đã được gửi.');
        showToast('✓ Email xác minh đã được gửi! Kiểm tra hộp thư của bạn.');
        return { success: true };
    } catch (error) {
        console.error('❌ Lỗi gửi email xác minh:', error.message);
        
        let errorMsg = 'Không thể gửi email xác minh.';
        
        if (error.code === 'auth/invalid-email') {
            errorMsg = 'Email không hợp lệ.';
        } else if (error.code === 'auth/missing-email') {
            errorMsg = 'Vui lòng nhập email.';
        }
        
        showToast(`❌ ${errorMsg}`);
        return { success: false, error: error.message };
    }
}

/**
 * Đăng nhập bằng email verification link
 * @param {string} email - Email người dùng
 * @param {string} name - Tên người dùng
 * @param {string} userType - Loại người dùng (student/teacher)
 * @returns {Promise}
 */
async function signInWithEmailLink(email, name, userType = 'student') {
    try {
        // Kiểm tra xem đây có phải là email verification link không
        if (window.firebaseAuth.isSignInWithEmailLink(window.location.href)) {
            // Đăng nhập người dùng
            const userCredential = await window.firebaseAuth.signInWithEmailLink(email, window.location.href);
            const user = userCredential.user;
            const userId = user.uid;
            
            // Xóa email khỏi localStorage
            window.localStorage.removeItem('emailForSignIn');
            
            // Kiểm tra xem người dùng có tồn tại không
            const userRef = window.firebaseRef(window.firebaseDB, `users/${userId}`);
            const snapshot = await window.firebaseGet(userRef);
            
            // Nếu người dùng mới, tạo profile
            if (!snapshot.exists()) {
                await window.firebaseSet(userRef, {
                    id: userId,
                    email: email,
                    name: name || email.split('@')[0],
                    userType: userType,
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString(),
                    favorites: [],
                    friends: [],
                    customPrompts: [],
                    sharedPrompts: [],
                    settings: {
                        theme: 'dark',
                        language: 'vi'
                    }
                });
            } else {
                // Cập nhật thời gian đăng nhập cuối cùng
                await window.firebaseUpdate(userRef, {
                    lastLogin: new Date().toISOString()
                });
            }
            
            console.log('✅ Đăng nhập bằng email link thành công:', userId);
            showToast('✓ Đăng nhập thành công!');
            
            return { success: true, userId };
        } else {
            return { success: false, error: 'Đây không phải là email verification link hợp lệ.' };
        }
    } catch (error) {
        console.error('❌ Lỗi đăng nhập email link:', error.message);
        showToast('❌ Lỗi đăng nhập. Vui lòng kiểm tra email của bạn.');
        return { success: false, error: error.message };
    }
}

/**
 * Đăng nhập ẩn danh (Guest)
 * @param {string} guestName - Tên khách (tùy chọn)
 * @returns {Promise}
 */
async function firebaseGuestLogin(guestName = 'Guest') {
    try {
        console.log('🔍 Starting anonymous login...');
        
        // Kiểm tra xem firebaseSignInAnonymously có tồn tại không
        if (!window.firebaseSignInAnonymously) {
            throw new Error('firebaseSignInAnonymously is not available');
        }
        
        const userCredential = await window.firebaseSignInAnonymously(window.firebaseAuth);
        const user = userCredential.user;
        const userId = user.uid;
        
        console.log('✅ Anonymous auth successful, userId:', userId);
        
        // Lưu thông tin guest vào Realtime Database
        const userRef = window.firebaseRef(window.firebaseDB, `users/${userId}`);
        
        await window.firebaseSet(userRef, {
            id: userId,
            email: null,
            name: guestName,
            userType: 'guest',
            isAnonymous: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            favorites: [],
            friends: [],
            customPrompts: [],
            sharedPrompts: [],
            settings: {
                theme: 'dark',
                language: 'vi'
            }
        });
        
        console.log('✅ Đăng nhập ẩn danh thành công:', userId);
        showToast(`✓ Chào mừng ${guestName}!`);
        
        return { success: true, userId };
    } catch (error) {
        console.error('❌ Lỗi đăng nhập ẩn danh:', error);
        
        let errorMsg = 'Không thể đăng nhập ẩn danh.';
        
        // Xử lý các lỗi cụ thể
        if (error.code === 'auth/operation-not-allowed') {
            errorMsg = 'Đăng nhập ẩn danh chưa được bật trên Firebase. Vui lòng liên hệ admin.';
        } else if (error.code === 'auth/network-request-failed') {
            errorMsg = 'Lỗi kết nối mạng. Vui lòng kiểm tra internet.';
        } else if (error.message) {
            errorMsg = error.message;
        }
        
        showToast(`❌ ${errorMsg}`);
        return { success: false, error: errorMsg };
    }
}

/**
 * Khởi tạo reCAPTCHA cho đăng nhập bằng SMS
 * @param {string} containerId - ID của container chứa reCAPTCHA
 * @returns {RecaptchaVerifier}
 */
function initializeRecaptcha(containerId = 'recaptcha-container') {
    try {
        // Kiểm tra container tồn tại
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('❌ Container không tồn tại:', containerId);
            return null;
        }

        const recaptchaVerifier = new window.firebaseRecaptchaVerifier(window.firebaseAuth, containerId, {
            size: 'normal',
            callback: (response) => {
                console.log('✅ reCAPTCHA verified:', response);
            },
            'expired-callback': () => {
                console.log('⚠️ reCAPTCHA expired');
            },
            'error-callback': (error) => {
                console.error('❌ reCAPTCHA error:', error);
            }
        });
        
        return recaptchaVerifier;
    } catch (error) {
        console.error('❌ Lỗi khởi tạo reCAPTCHA:', error.message);
        showToast('❌ Lỗi khởi tạo reCAPTCHA. Hãy tải lại trang.');
        return null;
    }
}

/**
 * Gửi mã OTP đến số điện thoại
 * @param {string} phoneNumber - Số điện thoại (định dạng: +84xxxxxxxxx)
 * @param {string} containerId - ID của container chứa reCAPTCHA
 * @returns {Promise}
 */
async function sendPhoneOTP(phoneNumber, containerId = 'recaptcha-container') {
    try {
        const recaptchaVerifier = initializeRecaptcha(containerId);
        
        if (!recaptchaVerifier) {
            return { success: false, error: 'Lỗi khởi tạo reCAPTCHA' };
        }
        
        const appVerifier = recaptchaVerifier;
        const confirmationResult = await window.firebaseSignInWithPhoneNumber(
            window.firebaseAuth,
            phoneNumber,
            appVerifier
        );
        
        // Lưu confirmationResult để xác minh OTP sau
        window.phoneAuthConfirmationResult = confirmationResult;
        
        console.log('✅ OTP đã được gửi đến số điện thoại.');
        showToast('✓ Mã OTP đã được gửi! Kiểm tra tin nhắn của bạn.');
        
        return { success: true, confirmationResult };
    } catch (error) {
        console.error('❌ Lỗi gửi OTP:', error.message);
        
        let errorMsg = 'Không thể gửi OTP.';
        
        if (error.code === 'auth/invalid-phone-number') {
            errorMsg = 'Số điện thoại không hợp lệ. Sử dụng định dạng: +84xxxxxxxxx';
        } else if (error.code === 'auth/too-many-requests') {
            errorMsg = 'Quá nhiều yêu cầu. Vui lòng thử lại sau.';
        } else if (error.code === 'auth/captcha-check-failed') {
            errorMsg = 'reCAPTCHA verification thất bại.';
        }
        
        showToast(`❌ ${errorMsg}`);
        return { success: false, error: error.message };
    }
}

/**
 * Xác minh mã OTP và đăng nhập
 * @param {string} otp - Mã OTP từ tin nhắn
 * @param {string} phoneNumber - Số điện thoại
 * @param {string} name - Tên người dùng
 * @param {string} userType - Loại người dùng (student/teacher)
 * @returns {Promise}
 */
async function verifyPhoneOTP(otp, phoneNumber, name, userType = 'student') {
    try {
        if (!window.phoneAuthConfirmationResult) {
            return { success: false, error: 'Vui lòng gửi OTP trước.' };
        }
        
        const userCredential = await window.phoneAuthConfirmationResult.confirm(otp);
        const user = userCredential.user;
        const userId = user.uid;
        
        // Kiểm tra xem người dùng có tồn tại không
        const userRef = window.firebaseRef(window.firebaseDB, `users/${userId}`);
        const snapshot = await window.firebaseGet(userRef);
        
        // Nếu người dùng mới, tạo profile
        if (!snapshot.exists()) {
            await window.firebaseSet(userRef, {
                id: userId,
                email: null,
                phone: phoneNumber,
                name: name || phoneNumber,
                userType: userType,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                favorites: [],
                friends: [],
                customPrompts: [],
                sharedPrompts: [],
                settings: {
                    theme: 'dark',
                    language: 'vi'
                }
            });
        } else {
            // Cập nhật thời gian đăng nhập cuối cùng
            await window.firebaseUpdate(userRef, {
                lastLogin: new Date().toISOString()
            });
        }
        
        console.log('✅ Xác minh OTP thành công:', userId);
        showToast('✓ Đăng nhập thành công!');
        
        // Xóa confirmationResult
        window.phoneAuthConfirmationResult = null;
        
        return { success: true, userId };
    } catch (error) {
        console.error('❌ Lỗi xác minh OTP:', error.message);
        
        let errorMsg = 'Mã OTP không chính xác.';
        
        if (error.code === 'auth/invalid-verification-code') {
            errorMsg = 'Mã OTP không hợp lệ hoặc đã hết hạn.';
        } else if (error.code === 'auth/code-expired') {
            errorMsg = 'Mã OTP đã hết hạn. Vui lòng gửi lại.';
        }
        
        showToast(`❌ ${errorMsg}`);
        return { success: false, error: error.message };
    }
}

/**
 * Gửi email link đăng nhập (Passwordless Sign-in)
 * @param {string} email - Email người dùng
 * @returns {Promise}
 */
async function sendEmailLinkSignIn(email) {
    try {
        if (!email) {
            showToast('Vui lòng nhập email để nhận link đăng nhập', 'warning');
            return { success: false, error: 'Email required' };
        }

        // Kiểm tra Firebase Auth đã sẵn sàng chưa
        if (!window.firebaseAuth || !window.firebaseSendSignInLinkToEmail) {
            console.error('❌ Firebase Auth chưa được khởi tạo');
            showToast('Lỗi hệ thống. Vui lòng tải lại trang.', 'error');
            return { success: false, error: 'Firebase not initialized' };
        }

        console.log('🔍 Kiểm tra Firebase Auth:', window.firebaseAuth);
        console.log('🔍 Current URL:', window.location.href);
        console.log('🔍 Origin:', window.location.origin);

        // Cấu hình ActionCodeSettings - Sử dụng full URL thay vì origin
        const actionCodeSettings = {
            // URL để redirect sau khi click link (phải là HTTPS trong production)
            url: window.location.href.split('?')[0], // Loại bỏ query params
            // Phải set là true để hoàn thành sign-in trong app
            handleCodeInApp: true
        };

        console.log('📧 Đang gửi email link đăng nhập cho:', email);
        console.log('📋 ActionCodeSettings:', actionCodeSettings);
        
        // Gửi email link
        await window.firebaseSendSignInLinkToEmail(window.firebaseAuth, email, actionCodeSettings);
        
        // Lưu email vào localStorage để xác minh sau
        localStorage.setItem('emailForSignIn', email);
        
        console.log('✅ Email link đã gửi thành công tới:', email);
        console.log('📝 Email đã lưu vào localStorage');
        showToast(`✅ Link đăng nhập đã gửi tới ${email}. Kiểm tra hộp thư (kể cả spam)!`, 'success');
        
        return { success: true, email };
    } catch (error) {
        console.error('❌ Lỗi gửi email link:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Full error object:', error);
        
        let errorMsg = 'Không thể gửi email đăng nhập.';
        if (error.code === 'auth/invalid-email') {
            errorMsg = 'Email không hợp lệ. Vui lòng kiểm tra lại.';
        } else if (error.code === 'auth/too-many-requests') {
            errorMsg = 'Quá nhiều yêu cầu. Vui lòng thử lại sau 5 phút.';
        } else if (error.code === 'auth/unauthorized-domain' || error.code === 'auth/invalid-continue-uri') {
            errorMsg = `Domain chưa được authorize trên Firebase. Vui lòng thêm "${window.location.origin}" vào Authorized domains trong Firebase Console.`;
        } else if (error.code === 'auth/operation-not-allowed') {
            errorMsg = 'Email link sign-in chưa được bật trong Firebase Console. Vào Authentication → Sign-in method → Email/Password → Bật "Email link (passwordless sign-in)".';
        }
        
        showToast(`❌ ${errorMsg}`, 'error');
        return { success: false, error: error.message, code: error.code };
    }
}

/**
 * Hoàn thành đăng nhập với email link
 * @param {string} email - Email người dùng (bắt buộc để xác minh)
 * @returns {Promise}
 */
async function completeEmailLinkSignIn(email) {
    try {
        if (!email) {
            showToast('Email không được tìm thấy. Vui lòng thử lại.', 'warning');
            return { success: false, error: 'Email required' };
        }

        const emailLink = window.location.href;
        
        // Kiểm tra xem link có phải là sign-in link không
        if (!window.firebaseIsSignInWithEmailLink(window.firebaseAuth, emailLink)) {
            console.warn('⚠️ URL không phải là valid sign-in email link');
            return { success: false, error: 'Invalid sign-in link' };
        }

        console.log('🔐 Đang hoàn thành đăng nhập với email link...');
        
        // Hoàn thành sign-in
        const result = await window.firebaseSignInWithEmailLink(window.firebaseAuth, email, emailLink);
        const user = result.user;
        const userId = user.uid;

        console.log('✅ Đăng nhập bằng email link thành công:', userId);
        
        // Kiểm tra user đã tồn tại trong DB chưa
        const userRef = window.firebaseRef(window.firebaseDB, `users/${userId}`);
        const snapshot = await window.firebaseGet(userRef);

        if (!snapshot.exists()) {
            // Tạo user profile nếu chưa tồn tại
            console.log('📝 Tạo user profile mới');
            await window.firebaseSet(userRef, {
                id: userId,
                email: user.email || '',
                name: user.email.split('@')[0] || 'User',
                userType: 'student',
                avatar: null,
                phone: null,
                isAnonymous: false,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                favorites: [],
                friends: [],
                customPrompts: [],
                sharedPrompts: [],
                settings: {
                    theme: 'dark',
                    language: 'vi'
                }
            });
        } else {
            // Cập nhật lastLogin
            await window.firebaseUpdate(userRef, {
                lastLogin: new Date().toISOString()
            });
        }

        // Xóa email khỏi localStorage
        localStorage.removeItem('emailForSignIn');
        
        showToast(`✅ Đăng nhập thành công!`);
        
        return { success: true, userId };
    } catch (error) {
        console.error('❌ Lỗi hoàn thành email link sign-in:', error.message);
        
        let errorMsg = 'Không thể đăng nhập.';
        if (error.code === 'auth/invalid-email') {
            errorMsg = 'Email không hợp lệ.';
        } else if (error.code === 'auth/invalid-oob-code') {
            errorMsg = 'Link đăng nhập không hợp lệ hoặc đã hết hạn.';
        } else if (error.code === 'auth/user-disabled') {
            errorMsg = 'Tài khoản này đã bị vô hiệu hóa.';
        }
        
        showToast(`❌ ${errorMsg}`);
        console.error('Full error:', error);
        return { success: false, error: error.message };
    }
}

console.log('✅ auth.js loaded successfully');
