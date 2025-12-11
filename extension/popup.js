// Popup JavaScript - Load prompt templates from main app

// Sample featured prompts (top prompts from library)
const FEATURED_PROMPTS = [
    {
        id: 1,
        title: "Chuyên gia ReactJS",
        category: "Lập trình",
        description: "Review code React và tối ưu hiệu năng",
        content: "Hãy đóng vai một chuyên gia Senior React Developer. Tôi sẽ cung cấp cho bạn một đoạn code, hãy giúp tôi: 1. Tìm các lỗi tiềm ẩn (bugs). 2. Đề xuất cách tối ưu hiệu năng. 3. Viết lại code theo Clean Code."
    },
    {
        id: 2,
        title: "Viết bài chuẩn SEO",
        category: "Marketing",
        description: "Tạo content thân thiện với công cụ tìm kiếm",
        content: "Bạn là một chuyên gia SEO và Content Marketing. Hãy viết một bài blog chi tiết về chủ đề [CHỦ ĐỀ]. Bài viết cần bao gồm: Tiêu đề hấp dẫn, Sapo thu hút, các thẻ H2/H3."
    },
    {
        id: 101,
        title: "Gia sư Toán Học",
        category: "Giáo dục",
        description: "Giải bài toán từng bước chi tiết",
        content: "Hãy đóng vai một giáo viên Toán kiên nhẫn. Giải quyết bài toán theo từng bước (step-by-step), giải thích rõ công thức được sử dụng ở mỗi bước."
    },
    {
        id: 3,
        title: "Giáo viên tiếng Anh",
        category: "Giáo dục",
        description: "Luyện hội thoại và sửa lỗi ngữ pháp",
        content: "Tôi muốn bạn đóng vai giáo viên tiếng Anh IELTS 8.0. Chúng ta sẽ trò chuyện về chủ đề [CHỦ ĐỀ]. Hãy sửa lỗi ngữ pháp cho tôi sau mỗi câu trả lời."
    },
    {
        id: 8,
        title: "Debug Code Python",
        category: "Lập trình",
        description: "Tìm lỗi và giải thích nguyên nhân",
        content: "Đoạn code Python sau đây đang gặp lỗi [MÔ TẢ LỖI]. Hãy phân tích nguyên nhân gây lỗi, giải thích logic sai ở đâu và cung cấp đoạn code đã sửa."
    },
    {
        id: 4,
        title: "Tóm tắt sách/tài liệu",
        category: "Năng suất",
        description: "Rút gọn nội dung thành ý chính",
        content: "Hãy tóm tắt văn bản sau đây thành 5 ý chính quan trọng nhất dưới dạng bullet points. Giọng văn cần ngắn gọn, súc tích và dễ hiểu."
    },
    {
        id: 201,
        title: "Toán: Ôn tập Lý thuyết",
        category: "Giáo dục",
        description: "Giải thích sâu định lý toán học",
        content: "Đóng vai giáo viên Toán, hãy giải thích chi tiết về định lý/khái niệm [TÊN ĐỊNH LÝ]. Bao gồm: định nghĩa, công thức, ý nghĩa và ví dụ minh họa."
    },
    {
        id: 203,
        title: "Lý: Giải thích Hiện tượng",
        category: "Giáo dục",
        description: "Hiểu bản chất định luật Vật lý",
        content: "Hãy giải thích định luật/nguyên lý [TÊN ĐỊNH LUẬT] trong Vật Lý. Sử dụng phép ẩn dụ hoặc so sánh với đời sống thực tế để minh họa."
    }
];

let currentFilter = 'all';

// Render prompts
function renderPrompts() {
    const container = document.getElementById('prompts-container');
    
    let filtered = FEATURED_PROMPTS;
    if (currentFilter !== 'all') {
        filtered = FEATURED_PROMPTS.filter(p => p.category === currentFilter);
    }

    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">Không có prompt nào</p>';
        return;
    }

    container.innerHTML = filtered.map(prompt => `
        <div class="prompt-item" data-content="${escapeHtml(prompt.content)}">
            <div class="prompt-title">${escapeHtml(prompt.title)}</div>
            <div class="prompt-desc">${escapeHtml(prompt.description)}</div>
        </div>
    `).join('');

    // Add click handlers
    container.querySelectorAll('.prompt-item').forEach(item => {
        item.addEventListener('click', () => {
            const content = item.dataset.content;
            copyToClipboard(content);
            showNotification('✅ Đã copy prompt vào clipboard!');
        });
    });
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
        console.error('Copy failed:', err);
    });
}

// Show notification
function showNotification(message) {
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) existingNotif.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        color: #667eea;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-size: 14px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Category filter
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.category;
        renderPrompts();
    });
});

// Initialize
renderPrompts();

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
