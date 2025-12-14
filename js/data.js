// ==========================================
// DATA & CONFIGURATION
// ==========================================

const MASTER_PROMPTS = [
    { id: 201, title: "Toán: Ôn tập Lý thuyết", category: "Giáo dục", description: "Giải thích sâu định lý, công thức toán học và ý nghĩa.", content: "Đóng vai giáo viên Toán, hãy giải thích chi tiết về định lý/khái niệm [TÊN ĐỊNH LÝ/KHÁI NIỆM]. \n\nBao gồm:\n1. Định nghĩa chính xác.\n2. Công thức toán học (nếu có).\n3. Ý nghĩa hình học/đại số.\n4. Ví dụ minh họa đơn giản dễ hiểu.", tags: ["Toán", "Lý thuyết", "Math"] },
    { id: 202, title: "Toán: Luyện giải bài tập", category: "Giáo dục", description: "Hướng dẫn giải toán từng bước (Step-by-step).", content: "Đóng vai gia sư Toán kiên nhẫn, hãy hướng dẫn tôi giải bài toán sau theo từng bước (step-by-step): [ĐỀ BÀI]. \n\nSau mỗi bước hãy giải thích tại sao lại làm như vậy. Cuối cùng, hãy cho một bài toán tương tự (kèm đáp án) để tôi tự luyện.", tags: ["Toán", "Thực hành", "Bài tập"] },
    { id: 217, title: "Toán: Ứng dụng Thực tế", category: "Giáo dục", description: "Giải quyết các bài toán thực tế (tài chính, xác suất).", content: "Tôi muốn áp dụng toán học vào đời sống. Hãy giúp tôi giải quyết vấn đề: [MÔ TẢ VẤN ĐỀ - VD: Tính lãi suất vay, tối ưu diện tích nhà...].\n\nHãy lập mô hình toán học cho vấn đề này, giải thích các biến số và đưa ra lời khuyên tối ưu nhất dựa trên kết quả tính toán.", tags: ["Toán", "Thực tế", "Ứng dụng"] },
    { id: 401, title: "Toán: Thủ thuật Casio", category: "Giáo dục", description: "Các mẹo bấm máy tính cầm tay để giải nhanh trắc nghiệm.", content: "Tôi đang cần giải nhanh bài toán trắc nghiệm này bằng máy tính cầm tay (Casio/Vinacal): [ĐỀ BÀI].\n\nHãy hướng dẫn tôi quy trình bấm máy (các phím cần ấn) để ra kết quả nhanh nhất. Giải thích logic của việc bấm máy đó.", tags: ["Toán", "Mẹo", "Casio"] },
    { id: 402, title: "Toán: Sơ đồ tư duy", category: "Giáo dục", description: "Hệ thống hóa kiến thức chương học thành Mindmap.", content: "Hãy giúp tôi tóm tắt kiến thức của Chương/Chủ đề [TÊN CHƯƠNG] dưới dạng cấu trúc Sơ đồ tư duy (Mindmap). \n\nBao gồm: Nhánh chính (Khái niệm), Nhánh phụ (Các dạng bài tập, Công thức quan trọng) và Các lỗi sai thường gặp.", tags: ["Toán", "Lý thuyết", "Mindmap"] },
    { id: 403, title: "Toán: Tìm lỗi sai", category: "Giáo dục", description: "Phân tích và sửa chữa lỗi sai trong lời giải.", content: "Tôi giải bài toán này nhưng kết quả có vẻ sai. Đây là lời giải của tôi: [LỜI GIẢI CỦA BẠN].\n\nHãy đóng vai một giáo viên chấm thi khó tính, hãy chỉ ra chính xác tôi sai ở bước nào (logic hay tính toán) và trình bày lại lời giải đúng.", tags: ["Toán", "Debug", "Sửa lỗi"] },
    { id: 203, title: "Lý: Giải thích Hiện tượng", category: "Giáo dục", description: "Hiểu bản chất hiện tượng và định luật Vật lý.", content: "Hãy giải thích định luật/nguyên lý [TÊN ĐỊNH LUẬT] trong Vật Lý. \n\nHãy sử dụng phép ẩn dụ hoặc so sánh với đời sống thực tế để minh họa cho dễ hiểu. Liệt kê các công thức liên quan cần nhớ.", tags: ["Lý", "Physics", "Lý thuyết"] },
    { id: 204, title: "Lý: Hướng dẫn Bài tập", category: "Giáo dục", description: "Phân tích đề và giải bài tập Vật lý.", content: "Tôi có bài tập Vật Lý sau: [ĐỀ BÀI]. \n\nHãy giúp tôi:\n1. Tóm tắt đề bài (cho biết gì, tìm gì).\n2. Xác định công thức vật lý phù hợp.\n3. Giải chi tiết từng bước và biện luận kết quả.", tags: ["Lý", "Physics", "Thực hành"] },
    { id: 218, title: "Lý: Tư duy Thiết kế", category: "Giáo dục", description: "Lên ý tưởng thiết kế máy móc/mạch điện đơn giản.", content: "Tôi muốn chế tạo một [TÊN THIẾT BỊ - VD: Máy tưới cây tự động/Đèn ngủ cảm ứng].\n\nHãy gợi ý cho tôi:\n1. Nguyên lý hoạt động vật lý.\n2. Sơ đồ cấu tạo/mạch điện cơ bản.\n3. Các vật liệu cần thiết và lưu ý an toàn khi thực hiện.", tags: ["Lý", "Sáng tạo", "Thiết kế"] },
    { id: 404, title: "Lý: Mẹo nhớ công thức", category: "Giáo dục", description: "Cách ghi nhớ công thức vật lý khó qua thơ hoặc câu chuyện.", content: "Tôi gặp khó khăn khi nhớ công thức [TÊN CÔNG THỨC/CHƯƠNG]. \n\nHãy sáng tạo cho tôi một câu thần chú, một bài thơ vui hoặc một câu chuyện liên tưởng hình ảnh để tôi có thể ghi nhớ công thức này ngay lập tức.", tags: ["Lý", "Mẹo", "Ghi nhớ"] },
    { id: 405, title: "Lý: Đọc đồ thị", category: "Giáo dục", description: "Phân tích các dạng đồ thị dao động, điện xoay chiều...", content: "Hãy hướng dẫn tôi cách phân tích đồ thị Vật lý sau: [MÔ TẢ ĐỒ THỊ HOẶC DỮ LIỆU TRỤC TUNG/HOÀNH].\n\nLàm sao để xác định các đại lượng cực đại, pha ban đầu và chu kỳ từ hình dáng đồ thị này?", tags: ["Lý", "Đồ thị", "Kỹ năng"] },
    { id: 406, title: "Lý: Trắc nghiệm Lý thuyết", category: "Giáo dục", description: "Bộ câu hỏi Đúng/Sai để tránh bẫy lý thuyết.", content: "Hãy tạo cho tôi 10 câu hỏi trắc nghiệm lý thuyết (dạng đếm mệnh đề đúng sai) về chủ đề [CHỦ ĐỀ]. \n\nTập trung vào các chi tiết nhỏ dễ bị lừa. Sau đó cung cấp đáp án và giải thích chi tiết tại sao câu đó đúng/sai.", tags: ["Lý", "Ôn thi", "Trắc nghiệm"] },
    { id: 205, title: "Hóa: Lý thuyết Chất", category: "Giáo dục", description: "Tính chất hóa học, vật lý và điều chế.", content: "Trình bày chi tiết về đơn chất/hợp chất [TÊN CHẤT]. \n\nNội dung cần có:\n- Tính chất vật lý (màu, mùi, trạng thái).\n- Tính chất hóa học (tác dụng với chất nào, kèm phương trình phản ứng).\n- Ứng dụng và điều chế trong công nghiệp/phòng thí nghiệm.", tags: ["Hóa", "Chemistry", "Lý thuyết"] },
    { id: 206, title: "Hóa: Giải toán Hóa học", category: "Giáo dục", description: "Cân bằng phương trình và bài toán định lượng.", content: "Giúp tôi giải bài tập Hóa sau: [ĐỀ BÀI]. \n\nNếu là bài toán chuỗi phản ứng, hãy viết rõ phương trình và điều kiện (nhiệt độ, xúc tác). Nếu là bài toán tính toán, hãy giải thích rõ số mol và bảo toàn khối lượng/nguyên tố.", tags: ["Hóa", "Chemistry", "Bài tập"] },
    { id: 219, title: "Hóa: Nhận biết & Chuỗi pứ", category: "Giáo dục", description: "Phương pháp nhận biết hóa chất và chuỗi phản ứng.", content: "Hãy giúp tôi lập sơ đồ nhận biết các chất sau: [DANH SÁCH CHẤT CẦN NHẬN BIẾT].\n\nNêu rõ thuốc thử cần dùng, hiện tượng quan sát được và viết phương trình hóa học minh họa cho từng bước nhận biết.", tags: ["Hóa", "Thí nghiệm", "Nhận biết"] },
    { id: 407, title: "Hóa: Cơ chế hữu cơ", category: "Giáo dục", description: "Hiểu sâu về cách các chất hữu cơ phản ứng.", content: "Giải thích cơ chế phản ứng giữa [CHẤT A] và [CHẤT B]. \n\nTại sao phản ứng lại xảy ra ở vị trí đó (nhóm chức đó)? Sản phẩm chính và sản phẩm phụ là gì (tuân theo quy tắc nào: Mac-cop-ni-cop hay Zai-xep)?", tags: ["Hóa", "Hữu cơ", "Chuyên sâu"] },
    { id: 408, title: "Hóa: Ứng dụng đời sống", category: "Giáo dục", description: "Giải thích các hiện tượng hóa học thường gặp.", content: "Hãy giải thích hiện tượng hóa học sau trong đời sống: [TÊN HIỆN TƯỢNG - VD: Mưa axit, Hiệu ứng nhà kính, Tại sao ăn sắn bị say...].\n\nViết phương trình hóa học minh họa nếu có.", tags: ["Hóa", "Thực tế", "Thú vị"] },
    { id: 409, title: "Hóa: Phòng thí nghiệm ảo", category: "Giáo dục", description: "Mô phỏng quy trình thực hành và an toàn thí nghiệm.", content: "Tôi muốn thực hiện thí nghiệm điều chế [TÊN CHẤT] trong phòng thí nghiệm.\n\nHãy liệt kê dụng cụ cần thiết, các bước tiến hành chi tiết và đặc biệt là các lưu ý an toàn (xử lý khí độc, chống cháy nổ).", tags: ["Hóa", "Thí nghiệm", "An toàn"] },
    { id: 207, title: "Sinh: Cơ chế Sinh học", category: "Giáo dục", description: "Hệ thống hóa các quá trình sinh học phức tạp.", content: "Giải thích cơ chế/quá trình sinh học [TÊN QUÁ TRÌNH] (ví dụ: Quang hợp, Phiên mã, Nguyên phân...). \n\nHãy chia nhỏ quá trình thành các giai đoạn, mô tả diễn biến chính tại mỗi giai đoạn và ý nghĩa sinh học của nó.", tags: ["Sinh", "Biology", "Lý thuyết"] },
    { id: 208, title: "Sinh: Bài tập Di truyền", category: "Giáo dục", description: "Giải bài tập gen, phả hệ và sinh thái.", content: "Hãy hướng dẫn giải bài tập Di truyền/Sinh thái sau: [ĐỀ BÀI]. \n\nHãy phân tích dữ kiện đề bài (trội/lặn, quy luật di truyền) và trình bày phương pháp giải logic, khoa học.", tags: ["Sinh", "Biology", "Thực hành"] },
    { id: 220, title: "Sinh: Bệnh học & Miễn dịch", category: "Giáo dục", description: "Tìm hiểu nguyên nhân và cơ chế bệnh.", content: "Hãy giải thích cơ chế gây bệnh của [TÊN BỆNH/VIRUS] ở cấp độ tế bào/phân tử.\n\nCơ thể phản ứng lại như thế nào (cơ chế miễn dịch)? Các biện pháp phòng ngừa dựa trên cơ chế lây truyền là gì?", tags: ["Sinh", "Y học", "Cơ thể"] },
    { id: 410, title: "Sinh: So sánh Sinh học", category: "Giáo dục", description: "Phân biệt các khái niệm dễ nhầm lẫn.", content: "Hãy lập bảng so sánh chi tiết giữa [KHÁI NIỆM A] và [KHÁI NIỆM B] (VD: Nguyên phân vs Giảm phân, ADN vs ARN).\n\nCác tiêu chí so sánh: Cấu trúc, Chức năng, Vị trí diễn ra và Ý nghĩa sinh học.", tags: ["Sinh", "So sánh", "Lý thuyết"] },
    { id: 411, title: "Sinh: Sơ đồ chuyển hóa", category: "Giáo dục", description: "Học các chu trình sinh học (Crep, Canvin...).", content: "Hãy mô tả chu trình/quá trình [TÊN CHU TRÌNH] dưới dạng các gạch đầu dòng theo trình tự thời gian.\n\nNguyên liệu đầu vào là gì? Sản phẩm đầu ra là gì? Năng lượng (ATP) được tạo ra/tiêu thụ ở bước nào?", tags: ["Sinh", "Quy trình", "Ghi nhớ"] },
    { id: 412, title: "Sinh: Sinh thái & Môi trường", category: "Giáo dục", description: "Phân tích các vấn đề môi trường và hệ sinh thái.", content: "Phân tích mối quan hệ giữa các loài trong quần xã sau: [MÔ TẢ CÁC LOÀI].\n\nĐây là quan hệ gì (Cộng sinh, Hội sinh, Ký sinh...)? Nếu loài A bị tiêu diệt thì ảnh hưởng thế nào đến lưới thức ăn này?", tags: ["Sinh", "Sinh thái", "Tư duy"] },
    { id: 209, title: "Sử: Sự kiện & Nhân chứng", category: "Giáo dục", description: "Tái hiện bối cảnh và ý nghĩa lịch sử.", content: "Cung cấp kiến thức sâu về sự kiện/giai đoạn lịch sử [TÊN SỰ KIỆN]. \n\nPhân tích theo cấu trúc:\n1. Hoàn cảnh lịch sử (nguyên nhân sâu xa/trực tiếp).\n2. Diễn biến chính (timeline).\n3. Kết quả và Ý nghĩa lịch sử đối với thời đại.", tags: ["Sử", "History", "Lý thuyết"] },
    { id: 210, title: "Sử: Tư duy Phân tích", category: "Giáo dục", description: "So sánh và đánh giá các vấn đề lịch sử.", content: "Hãy phân tích hoặc so sánh vấn đề lịch sử sau: [VẤN ĐỀ CẦN SO SÁNH]. \n\nHãy đưa ra các luận điểm rõ ràng, khách quan, có dẫn chứng cụ thể và rút ra bài học kinh nghiệm.", tags: ["Sử", "History", "Tư duy"] },
    { id: 221, title: "Sử: Nhập vai Nhân vật", category: "Giáo dục", description: "Học sử qua góc nhìn người trong cuộc.", content: "Hãy đóng vai nhân vật lịch sử [TÊN NHÂN VẬT]. Hãy kể lại những suy nghĩ, trăn trở và quyết định của ông/bà trong bối cảnh [TÊN SỰ KIỆN/THỜI KỲ].\n\nGiọng văn cần phù hợp với thời đại và tính cách nhân vật.", tags: ["Sử", "Roleplay", "Kể chuyện"] },
    { id: 413, title: "Sử: Liên hệ Việt Nam - Thế giới", category: "Giáo dục", description: "Đặt lịch sử VN vào bối cảnh toàn cầu.", content: "Trong giai đoạn [KHOẢNG THỜI GIAN], tình hình thế giới (Chiến tranh lạnh, Khủng hoảng kinh tế...) đã tác động trực tiếp như thế nào đến cách mạng Việt Nam? Hãy phân tích mối liên hệ này.", tags: ["Sử", "Liên hệ", "Tư duy"] },
    { id: 414, title: "Sử: Ghi nhớ Niên biểu", category: "Giáo dục", description: "Phương pháp nhớ mốc thời gian không bao giờ quên.", content: "Tôi rất khó nhớ các mốc thời gian của [GIAI ĐOẠN LỊCH SỬ]. \n\nHãy giúp tôi nhóm các sự kiện này theo chủ đề hoặc tạo ra một trục thời gian (Timeline) logic để dễ học thuộc lòng.", tags: ["Sử", "Mẹo", "Timeline"] },
    { id: 415, title: "Sử: Giả định Lịch sử", category: "Giáo dục", description: "Tư duy phản biện 'Nếu... thì...'.", content: "Nếu sự kiện [TÊN SỰ KIỆN] có kết quả ngược lại, thì cục diện lịch sử sẽ thay đổi như thế nào? \n\nHãy đưa ra một giả thuyết lịch sử dựa trên các dữ kiện thực tế của thời kỳ đó.", tags: ["Sử", "Giả định", "Phản biện"] },
    { id: 211, title: "Địa: Đặc điểm Vùng miền", category: "Giáo dục", description: "Phân tích tự nhiên, dân cư và kinh tế xã hội.", content: "Trình bày đặc điểm [TỰ NHIÊN/KINH TẾ] của khu vực/quốc gia [TÊN VÙNG]. \n\nPhân tích các thế mạnh (thuận lợi) và hạn chế (khó khăn) ảnh hưởng đến sự phát triển của vùng này.", tags: ["Địa", "Geography", "Lý thuyết"] },
    { id: 212, title: "Địa: Phân tích Biểu đồ", category: "Giáo dục", description: "Kỹ năng làm việc với Atlat và số liệu.", content: "Dựa vào bảng số liệu/mô tả biểu đồ sau: [DỮ LIỆU/MÔ TẢ]. \n\nHãy nhận xét tình hình phát triển, so sánh sự thay đổi qua các năm và giải thích nguyên nhân của sự thay đổi đó.", tags: ["Địa", "Geography", "Thực hành"] },
    { id: 222, title: "Địa: Quy hoạch & Du lịch", category: "Giáo dục", description: "Lên kế hoạch phát triển du lịch hoặc tour.", content: "Tôi muốn thiết kế một tour du lịch 3 ngày 2 đêm tại [ĐỊA ĐIỂM].\n\nHãy gợi ý lịch trình dựa trên điều kiện địa lý, khí hậu và các danh lam thắng cảnh nổi bật. Giải thích tại sao chọn lộ trình đó (tính hợp lý về di chuyển và trải nghiệm).", tags: ["Địa", "Du lịch", "Quy hoạch"] },
    { id: 416, title: "Địa: Kỹ năng Atlat", category: "Giáo dục", description: "Khai thác tối đa Atlat Địa lý Việt Nam.", content: "Dựa vào Atlat Địa lý Việt Nam trang [SỐ TRANG/TÊN TRANG], hãy hướng dẫn tôi cách khai thác thông tin về [NỘI DUNG CẦN TÌM]. \n\nTôi cần chú ý đến các ký hiệu nào và kết hợp với trang nào khác để có câu trả lời đầy đủ nhất?", tags: ["Địa", "Atlat", "Kỹ năng"] },
    { id: 417, title: "Địa: Biến đổi khí hậu", category: "Giáo dục", description: "Liên hệ kiến thức với vấn đề nóng toàn cầu.", content: "Phân tích tác động của biến đổi khí hậu đến vùng [TÊN VÙNG - VD: ĐBSCL].\n\nNêu rõ các biểu hiện thực tế (xâm nhập mặn, sạt lở...) và đề xuất các giải pháp thích ứng phù hợp với điều kiện tự nhiên của vùng.", tags: ["Địa", "Thực tế", "Môi trường"] },
    { id: 418, title: "Địa: Chuyển dịch cơ cấu", category: "Giáo dục", description: "Phân tích xu hướng kinh tế vĩ mô.", content: "Dựa trên xu hướng hiện nay, hãy phân tích sự chuyển dịch cơ cấu kinh tế của ngành [TÊN NGÀNH/VÙNG]. \n\nTại sao lại có sự chuyển dịch đó? (Nguyên nhân khách quan và chủ quan).", tags: ["Địa", "Kinh tế", "Phân tích"] },
    { id: 213, title: "Văn: Tác giả & Tác phẩm", category: "Giáo dục", description: "Kiến thức nền tảng về văn học.", content: "Giới thiệu về tác giả [TÊN TÁC GIẢ] (phong cách nghệ thuật, đề tài chính) và tóm tắt giá trị nội dung, nghệ thuật của tác phẩm [TÊN TÁC PHẨM].", tags: ["Văn", "Literature", "Lý thuyết"] },
    { id: 214, title: "Văn: Luyện viết & Dàn ý", category: "Giáo dục", description: "Lập dàn ý chi tiết và viết đoạn văn mẫu.", content: "Lập dàn ý chi tiết cho đề văn: [ĐỀ BÀI]. \n\nDàn ý cần có:\n- Mở bài: Gián tiếp/Trực tiếp.\n- Thân bài: Các luận điểm chính (kèm dẫn chứng/trích dẫn thơ văn).\n- Kết bài: Mở rộng vấn đề.", tags: ["Văn", "Literature", "Thực hành"] },
    { id: 223, title: "Văn: Sáng tác & Phóng tác", category: "Giáo dục", description: "Sáng tạo kết thúc mới hoặc viết truyện ngắn.", content: "Hãy viết lại phần kết thúc (hoặc một đoạn trích) của tác phẩm [TÊN TÁC PHẨM] theo hướng: [HƯỚNG SÁNG TẠO - VD: Kết thúc có hậu hơn, thay đổi ngôi kể...].\n\nGiữ được giọng văn và phong cách của tác giả gốc.", tags: ["Văn", "Sáng tạo", "Viết lách"] },
    { id: 419, title: "Văn: Lý luận Văn học", category: "Giáo dục", description: "Nâng cao điểm số bằng kiến thức lý luận.", content: "Hãy giải thích nhận định lý luận văn học sau: '[CÂU NHẬN ĐỊNH]'. \n\nSau đó, hãy hướng dẫn tôi cách áp dụng nhận định này để phân tích tác phẩm [TÊN TÁC PHẨM] nhằm làm sâu sắc bài văn.", tags: ["Văn", "Lý luận", "Nâng cao"] },
    { id: 420, title: "Văn: Phân tích Nghệ thuật", category: "Giáo dục", description: "Đi sâu vào thủ pháp nghệ thuật của tác giả.", content: "Hãy phân tích các thủ pháp nghệ thuật đặc sắc (biện pháp tu từ, điểm nhìn trần thuật, giọng điệu) được sử dụng trong đoạn trích: [ĐOẠN TRÍCH]. \n\nHiệu quả thẩm mỹ mà các thủ pháp này mang lại là gì?", tags: ["Văn", "Nghệ thuật", "Phân tích"] },
    { id: 421, title: "Văn: Nghị luận Xã hội", category: "Giáo dục", description: "Viết đoạn văn 200 chữ về vấn đề nóng.", content: "Viết một đoạn văn nghị luận xã hội (khoảng 200 chữ) bàn về vấn đề: [VẤN ĐỀ - VD: Sống ảo, Lòng dũng cảm...].\n\nCấu trúc: Giải thích -> Phân tích/Bàn luận -> Phản đề -> Bài học nhận thức & Hành động.", tags: ["Văn", "Nghị luận", "Xã hội"] },
    { id: 215, title: "Anh: Ngữ pháp & Từ vựng", category: "Giáo dục", description: "Giải thích điểm ngữ pháp và từ vựng theo chủ đề.", content: "Giải thích chi tiết chủ đề ngữ pháp/từ vựng: [CHỦ ĐỀ]. \n\nBao gồm: Cấu trúc, Cách dùng, Dấu hiệu nhận biết và Các trường hợp ngoại lệ (nếu có). Cho 5 ví dụ minh họa.", tags: ["Anh", "English", "Lý thuyết"] },
    { id: 216, title: "Anh: Sửa lỗi & Writing", category: "Giáo dục", description: "Chấm bài và paraphrase câu văn hay hơn.", content: "Tôi đang luyện viết tiếng Anh. Hãy chấm và sửa lỗi cho đoạn văn sau của tôi: [ĐOẠN VĂN CỦA BẠN]. \n\nHãy chỉ ra lỗi sai ngữ pháp/từ vựng và đề xuất cách viết lại (paraphrase) cho tự nhiên và 'sang' hơn (academic).", tags: ["Anh", "English", "Thực hành"] },
    { id: 224, title: "Anh: Luyện thi IELTS Writing", category: "Giáo dục", description: "Hướng dẫn viết bài luận chuẩn IELTS.", content: "Hãy lập dàn ý và viết bài mẫu cho đề IELTS Writing Task [1 hoặc 2]: [ĐỀ BÀI].\n\nPhân tích các từ vựng band điểm cao (C1/C2) được sử dụng trong bài và giải thích cấu trúc lập luận.", tags: ["Anh", "IELTS", "Writing"] },
    { id: 422, title: "Anh: Collocations & Idioms", category: "Giáo dục", description: "Học các cụm từ cố định để dùng tiếng Anh tự nhiên.", content: "Hãy liệt kê 10 Collocations (cụm từ cố định) và Idioms (thành ngữ) hay nhất liên quan đến chủ đề [CHỦ ĐỀ]. \n\nGiải thích nghĩa và đặt câu ví dụ cho từng cụm từ.", tags: ["Anh", "Từ vựng", "Nâng cao"] },
    { id: 423, title: "Anh: Reading Strategy", category: "Giáo dục", description: "Chiến thuật làm bài đọc hiểu nhanh.", content: "Tôi có một bài đọc hiểu tiếng Anh (Reading Comprehension). Hãy giúp tôi:\n1. Skimming: Tìm ý chính của bài.\n2. Scanning: Tìm thông tin cho câu hỏi cụ thể [CÂU HỎI].\n3. Giải thích các từ mới quan trọng trong ngữ cảnh.", tags: ["Anh", "Kỹ năng", "Reading"] },
    { id: 424, title: "Anh: Speaking Partner", category: "Giáo dục", description: "Luyện nói tiếng Anh qua lại với AI.", content: "Hãy đóng vai một người bản xứ nói tiếng Anh. Chúng ta sẽ thảo luận về chủ đề [CHỦ ĐỀ]. \n\nHãy đặt câu hỏi cho tôi, đợi tôi trả lời, sau đó sửa lỗi phát âm/ngữ pháp cho tôi và tiếp tục câu chuyện một cách tự nhiên.", tags: ["Anh", "Giao tiếp", "Speaking"] },
    { id: 301, title: "Kỹ thuật 'Show, Don't Tell'", category: "Viết lách", description: "Biến văn kể lể nhàm chán thành hình ảnh sống động.", content: "Hãy giúp tôi áp dụng kỹ thuật 'Show, Don't Tell' (Tả chứ không kể) cho đoạn văn sau: [ĐOẠN VĂN CỦA BẠN].\n\nHãy viết lại đoạn văn trên để người đọc có thể hình dung, cảm nhận được cảm xúc/bối cảnh qua hành động, giác quan thay vì dùng tính từ miêu tả trực tiếp.", tags: ["Writing", "Kỹ thuật", "Sáng tạo"] },
    { id: 302, title: "Biến hóa Giọng văn (Tone)", category: "Viết lách", description: "Viết lại nội dung theo 3 sắc thái cảm xúc khác nhau.", content: "Hãy viết lại đoạn văn bản sau theo 3 phong cách (tone) khác nhau:\n1. Hài hước, dí dỏm (Witty).\n2. Trang trọng, chuyên nghiệp (Professional).\n3. Cảm xúc, sâu lắng (Emotional).\n\nĐoạn văn bản gốc: [ĐOẠN VĂN BẢN].", tags: ["Writing", "Tone", "Content"] },
    { id: 101, title: "Gia sư Toán Học (Chung)", category: "Giáo dục", description: "Giải bài toán chi tiết từng bước và giải thích lý thuyết.", content: "Hãy đóng vai một giáo viên Toán kiên nhẫn. Tôi sẽ đưa ra một bài toán [LOẠI TOÁN: Đại số/Hình học]. Hãy giải quyết nó theo từng bước (step-by-step), giải thích rõ công thức được sử dụng ở mỗi bước và tại sao lại dùng cách đó. Cuối cùng, hãy cho tôi một bài tập tương tự (kèm đáp án) để tôi tự luyện tập.\n\nBài toán của tôi là: [NỘI DUNG BÀI TOÁN]", tags: ["Toán", "Math", "Step-by-step"] },
    { id: 1, title: "Chuyên gia ReactJS", category: "Lập trình", description: "Biến AI thành một lập trình viên Senior React để review code và tối ưu hiệu năng.", content: "Hãy đóng vai một chuyên gia Senior React Developer. Tôi sẽ cung cấp cho bạn một đoạn code, hãy giúp tôi: 1. Tìm các lỗi tiềm ẩn (bugs). 2. Đề xuất cách tối ưu hiệu năng (performance). 3. Viết lại code theo phong cách Clean Code và tuân thủ các best practices mới nhất.\n\nCode của tôi:\n[DÁN CODE VÀO ĐÂY]", tags: ["React", "Clean Code", "Optimization"] },
    { id: 2, title: "Viết bài chuẩn SEO", category: "Marketing", description: "Tạo dàn ý và viết bài blog thân thiện với công cụ tìm kiếm.", content: "Bạn là một chuyên gia SEO và Content Marketing với 10 năm kinh nghiệm. Hãy viết một bài blog chi tiết về chủ đề [CHỦ ĐỀ BÀI VIẾT]. Bài viết cần bao gồm: Tiêu đề hấp dẫn, Sapo thu hút, Các thẻ H2/H3 được phân bổ hợp lý chứa từ khóa, và phần kết luận kêu gọi hành động (Call to Action).", tags: ["SEO", "Content", "Blog"] },
    { id: 3, title: "Giáo viên tiếng Anh (Chung)", category: "Giáo dục", description: "Luyện hội thoại và sửa lỗi ngữ pháp tiếng Anh.", content: "Tôi muốn bạn đóng vai giáo viên tiếng Anh IELTS 8.0. Chúng ta sẽ trò chuyện về chủ đề '[CHỦ ĐỀ HỘI THOẠI]'. Hãy sửa lỗi ngữ pháp cho tôi sau mỗi câu trả lời và gợi ý những từ vựng nâng cao hơn (C1/C2) để thay thế.", tags: ["English", "IELTS", "Learning"] },
    { id: 4, title: "Tóm tắt sách/tài liệu", category: "Năng suất", description: "Rút gọn nội dung dài thành các ý chính dễ hiểu.", content: "Hãy tóm tắt văn bản sau đây thành 5 ý chính quan trọng nhất dưới dạng danh sách (bullet points). Giọng văn cần ngắn gọn, súc tích và dễ hiểu cho người mới bắt đầu: [DÁN VĂN BẢN VÀO ĐÂY]", tags: ["Summary", "Productivity"] },
    { id: 5, title: "Tạo lịch đăng bài MXH", category: "Marketing", description: "Lên kế hoạch nội dung cho Facebook/Tiktok trong 1 tuần.", content: "Hãy tạo giúp tôi một lịch đăng bài content trong 7 ngày cho kênh Tiktok về chủ đề '[CHỦ ĐỀ KÊNH]'. Mỗi ngày cần có: 1. Ý tưởng video. 2. Hook (câu dẫn) mở đầu. 3. Gợi ý nhạc trending/âm thanh phù hợp.", tags: ["Social Media", "Plan", "Tiktok"] },
    { id: 6, title: "Giải thích khái niệm phức tạp", category: "Giáo dục", description: "Biến những thứ khó hiểu thành đơn giản (ELI5).", content: "Hãy giải thích khái niệm [KHÁI NIỆM CẦN GIẢI THÍCH] cho tôi như thể tôi là một đứa trẻ 5 tuổi. Sử dụng các phép ẩn dụ sinh động và tránh dùng từ ngữ chuyên ngành khó hiểu.", tags: ["Explain", "ELI5", "Fun"] },
    { id: 7, title: "Viết Email chuyên nghiệp", category: "Công việc", description: "Soạn thảo email công việc trang trọng và lịch sự.", content: "Viết một email gửi cho [NGƯỜI NHẬN] để [MỤC ĐÍCH EMAIL]. Giọng văn cần chân thành, chuyên nghiệp, nhận trách nhiệm và đề xuất giải pháp.", tags: ["Email", "Business", "Professional"] },
    { id: 8, title: "Debug Code Python", category: "Lập trình", description: "Tìm lỗi và giải thích nguyên nhân trong đoạn code Python.", content: "Đoạn code Python sau đây đang gặp lỗi [MÔ TẢ LỖI]. Hãy phân tích nguyên nhân gây lỗi, giải thích logic sai ở đâu và cung cấp đoạn code đã sửa hoàn chỉnh.\n\nCode:\n[DÁN CODE PYTHON]", tags: ["Python", "Debug", "Fix"] }
];

const CATEGORIES = ["Tất cả", "Cá nhân", "Giáo dục", "Lập trình", "Marketing", "Viết lách", "Công việc", "Năng suất"];

const CATEGORY_ICONS = {
    "Công việc": "images/công việc.png",
    "Giáo dục": "images/Giáo dục và viết lách.png",
    "Lập trình": "images/Lập trình.png",
    "Marketing": "images/Marketing và năng suất.png",
    "Năng suất": "images/Marketing và năng suất.png",
    "Viết lách": "images/Giáo dục và viết lách.png",
    "Cá nhân": "https://cdn-icons-png.flaticon.com/512/1077/1077114.png", 
    "Tất cả": null 
};

const SUBJECT_ICONS = {
    // Match actual files in /images (case and accents)
    "Toán": "images/Toán.png",
    "Lý": "images/Lý.png",
    "Hóa": "images/Hoá.png",
    "Sinh": "images/Sinh.png",
    "Sử": "images/Lịch sử .png",
    "Địa": "images/Địa.png",
    "Văn": "images/Văn.png", 
    "Anh": "images/Anh.png" 
};

const SUBJECT_LIST = ["Toán", "Lý", "Hóa", "Sinh", "Sử", "Địa", "Văn", "Anh"];

const AI_TOOLS = [
    { id: "gpt", name: "ChatGPT", company: "OpenAI", description: "AI tiên phong trong cuộc cách mạng LLM. Nổi bật với khả năng hội thoại tự nhiên, viết code và sáng tạo nội dung đa dạng.", url: "https://chat.openai.com", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
    { id: "gemini", name: "Gemini", company: "Google", description: "Mô hình đa phương thức mạnh mẽ của Google. Tích hợp sâu vào hệ sinh thái Google và xử lý thông tin thời gian thực tốt.", url: "https://gemini.google.com", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" },
    { id: "claude", name: "Claude", company: "Anthropic", description: "Nổi tiếng với khả năng xử lý văn bản dài (context window lớn), lập luận logic an toàn và giọng văn tự nhiên.", url: "https://claude.ai", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", icon: "https://sm.pcmag.com/t/pcmag_uk/review/c/claude/claude_5gnz.1200.jpg" },
    { id: "copilot", name: "Copilot", company: "Microsoft", description: "Trợ lý AI tích hợp trong Windows và Office 365, sử dụng công nghệ GPT-4. Hỗ trợ tìm kiếm web hiệu quả.", url: "https://copilot.microsoft.com", color: "text-sky-500", bg: "bg-sky-500/10", border: "border-sky-500/20", icon: "https://socialsciences.mcmaster.ca/app/uploads/2023/11/Untitled-design-81.png" }
];

const RELIABLE_ARTICLES = [
    { title: "Báo cáo Chỉ số AI 2024 - Stanford", org: "Stanford HAI", url: "https://aiindex.stanford.edu/report/", desc: "Tổng hợp toàn diện về tác động, xu hướng và sự phát triển của AI toàn cầu." },
    { title: "Hướng dẫn Đạo đức AI", org: "UNESCO", url: "https://www.unesco.org/en/artificial-intelligence/recommendation-ethics", desc: "Khung tiêu chuẩn toàn cầu đầu tiên về việc sử dụng AI có trách nhiệm và nhân văn." },
    { title: "Tương lai của công việc với AI", org: "World Economic Forum", url: "https://www.weforum.org/reports/the-future-of-jobs-report-2030/", desc: "Phân tích cách AI sẽ thay đổi thị trường lao động và kỹ năng cần thiết trong tương lai." },
    { title: "AI Act: Luật AI của Châu Âu", org: "European Commission", url: "https://digital-strategy.ec.europa.eu/en/policies/ai-act", desc: "Tìm hiểu về đạo luật toàn diện đầu tiên trên thế giới nhằm kiểm soát rủi ro của AI." }
];

const ETHICS_GUIDE = [
    { icon: "shield-check", color: "text-emerald-500", title: "Bảo mật Dữ liệu", content: "Không bao giờ nhập thông tin cá nhân nhạy cảm, mật khẩu hoặc bí mật công ty vào các chatbox AI công cộng." },
    { icon: "search-check", color: "text-blue-500", title: "Luôn Kiểm Chứng", content: "AI có thể 'ảo giác' (bịa đặt thông tin). Hãy luôn đối chiếu các số liệu và sự kiện quan trọng với nguồn chính thống." },
    { icon: "user-check", color: "text-purple-500", title: "Giữ Chất Riêng", content: "Sử dụng AI để hỗ trợ ý tưởng và phác thảo, nhưng hãy để tư duy và giọng văn của chính bạn quyết định sản phẩm cuối cùng." },
    { icon: "alert-triangle", color: "text-orange-500", title: "Tránh Lạm Dụng", content: "Không sử dụng AI để tạo tin giả (fake news), gian lận trong học tập hoặc tạo nội dung gây thù hằn, xúc phạm." }
];

const THEME_CONFIG = {
    dark: {
        id: 'dark',
        bg: "bg-[#050505]",
        overlay: "bg-black/70",
        textPrimary: "text-slate-200",
        textSecondary: "text-slate-400",
        textAccent: "text-indigo-400",
        glass: "bg-black/40 backdrop-blur-xl border border-white/10",
        glassHover: "hover:bg-white/5 hover:border-white/20",
        cardBg: "bg-[#0f111a]/80 backdrop-blur-sm",
        inputBg: "bg-black/40",
        border: "border-white/10",
        iconBg: "bg-white/5",
        modalBg: "bg-[#0f111a]",
        modalOverlay: "bg-black/80",
        codeBlock: "bg-black/40 border-white/10",
        blobOpacity: "opacity-20",
        scrollThumb: "bg-white/10"
    },
    light: {
        id: 'light',
        bg: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-blue-50",
        overlay: "bg-white/80",
        textPrimary: "text-slate-800",
        textSecondary: "text-slate-600",
        textAccent: "text-indigo-600",
        glass: "bg-white/70 backdrop-blur-xl border border-slate-200 shadow-sm",
        glassHover: "hover:bg-white hover:border-indigo-200 hover:shadow-md",
        cardBg: "bg-white/80 backdrop-blur-sm",
        inputBg: "bg-slate-100",
        border: "border-slate-200",
        iconBg: "bg-slate-100",
        modalBg: "bg-white",
        modalOverlay: "bg-slate-900/40",
        codeBlock: "bg-slate-100 border-slate-200",
        blobOpacity: "opacity-40",
        scrollThumb: "bg-slate-300"
    }
};