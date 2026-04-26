/**
 * Memory Moment Data Type
 */
export interface MemoryMoment {
    id: number;
    thumbnail: string;
    videoUrl?: string;
    location: string;
    caption: string;
}

/**
 * Memory Moments Data
 * Extracted from the original implementation
 */
export const memoryMomentsData: MemoryMoment[] = [
    {
        id: 0,
        thumbnail: "https://social-media.zim.vn/stories/7e41eae4-57f6-4889-af11-07331d007bea/S320yD-thumbnail-1/S320yD-thumbnail-1.png",
        videoUrl: "https://social-media.zim.vn/stories/ed12b226-51c2-436a-ae7d-877ccef6b6da/vw77hN-BÀIĐĂNG22:4/output/hls/vw77hN-BÀIĐĂNG22:41080p.m3u8",
        location: "ZIM Academy - 787 Luỹ Bán Bích - Tân Phú",
        caption: "✨ Hãy cùng xem các ZIMIANS của ZIM ACADEMY học READING như thế nào nhé!\n\n👉 Tìm hiểu thêm thông tin tại đây nhé: m.me/288249894369519?ref=ZIM660290\n--------\nANH NGỮ ZIM - Cá nhân hoá học tập\nĐịa chỉ: 787 Luỹ Bán Bích, phường Tân Thành, quận Tân Phú, TP.HCM\nHotline: 1900 2833"
    },
    {
        id: 1,
        thumbnail: "https://social-media.zim.vn/stories/cb531f66-ed20-43f9-9b9f-c1ee338ce88c/h6-sM2-IMG_9314/h6-sM2-IMG_9314.jpeg",
        videoUrl: "https://social-media.zim.vn/stories/ed12b226-51c2-436a-ae7d-877ccef6b6da/vw77hN-BÀIĐĂNG22:4/output/hls/vw77hN-BÀIĐĂNG22:41080p.m3u8",
        location: "ZIM Academy - 133 Nguyễn Thị Thập - P. Tân Hưng, Q.7",
        caption: "Định về nhà làm bài tập… ai ngờ bị giữ lại học tiếp 😭\n\n“Không làm bài chị làm giúp em à?”\n→ Và cái kết: bị dắt vô phòng tự học không kịp trở tay 🤡\n\nNhưng mà… ở lại cũng có lý do:\n❄️ Điều hoà mát rượi, ngồi là không muốn về\n😌 Không gian tối giản – học cực kỳ tập trung\n⚡ Wifi mạnh, ổ cắm đầy đủ – học mượt khỏi nói\n🍬 Mệt là có kẹo “buff năng lượng” ngay\n📚 Thư viện tài liệu đầy đủ – muốn lười cũng khó"
    },
    {
        id: 2,
        thumbnail: "https://social-media.zim.vn/stories/17776b29-6384-4424-817d-a73b035be615/qP6nwQ-thumbnail-0/qP6nwQ-thumbnail-0.png",
        videoUrl: "https://social-media.zim.vn/stories/ed12b226-51c2-436a-ae7d-877ccef6b6da/vw77hN-BÀIĐĂNG22:4/output/hls/vw77hN-BÀIĐĂNG22:41080p.m3u8",
        location: "ZIM Academy - 395 Quang Trung, Q. Hà Đông",
        caption: "📚 Một buổi học IELTS tại ZIM có gì thú vị?\nĐi học không còn là nghĩa vụ, mà là hành trình nâng cấp bản thân 🚀\n-------------\nANH NGỮ ZIM - Cá nhân hoá học tập\nSố 395 đường Quang Trung, phường Hà Cầu, quận Hà Đông, Hà Nội\nHotline: 1900 2833"
    },
    {
        id: 3,
        thumbnail: "https://social-media.zim.vn/stories/573c6f31-2c64-431d-a0df-49fd36dade4b/1MLLUK-z7753473793167_a0379d26271271b3a499245ad6c87c89/1MLLUK-z7753473793167_a0379d26271271b3a499245ad6c87c89.jpg",
        videoUrl: "https://social-media.zim.vn/stories/ed12b226-51c2-436a-ae7d-877ccef6b6da/vw77hN-BÀIĐĂNG22:4/output/hls/vw77hN-BÀIĐĂNG22:41080p.m3u8",
        location: "ZIM Academy - 12 Huỳnh Lan Khanh - Q.Tân Bình",
        caption: "Đi học một mình cũng được… mà có hội vẫn vui hơn 🫶\nHãy cùng lắng nghe những chia sẻ nhỏ của nhóm học viên sau một thời gian học tại ZIM nha! 🥰\n\nTìm hiểu thêm tại: m.me/102750189401648?ref=ZIM527144"
    },
    {
        id: 4,
        thumbnail: "https://social-media.zim.vn/stories/03778903-5e25-4d3c-9d12-47b5a075fc55/-SwoXK-IMG_4165/-SwoXK-IMG_4165.jpeg",
        videoUrl: "https://social-media.zim.vn/stories/ed12b226-51c2-436a-ae7d-877ccef6b6da/vw77hN-BÀIĐĂNG22:4/output/hls/vw77hN-BÀIĐĂNG22:41080p.m3u8",
        location: "ZIM Academy - 65 Yên Lãng, Q. Đống Đa",
        caption: "Lan toả sự chăm học và năng lượng tích cực của Zimians tại ZIM Yên Lãng 📚\n\n👉Tìm hiểu hệ sinh thái học tập tại ZIM: m.me/102644659414165?ref=ZIM320703"
    },
    {
        id: 5,
        thumbnail: "https://social-media.zim.vn/stories/cc8739d4-ecf5-4750-a7ca-6e3348a9163f/aDrI-m-thumbnail-1/aDrI-m-thumbnail-1.png",
        videoUrl: "https://social-media.zim.vn/stories/ed12b226-51c2-436a-ae7d-877ccef6b6da/vw77hN-BÀIĐĂNG22:4/output/hls/vw77hN-BÀIĐĂNG22:41080p.m3u8",
        location: "ZIM Academy - 143 Hồng Tiến - Q. Long Biên",
        caption: "“Em từng học rất nhiều… nhưng không biết mình đang học đúng hay sai.”\n\nĐó là lúc Nguyễn Huy Quang ở 5.0 IELTS — và mất định hướng hoàn toàn.\n\nHọc theo cảm tính.\nLàm đề liên tục nhưng không tiến bộ.\nKhông ai chỉ ra mình sai ở đâu.\n\n3 tháng sau — 6.0 IELTS"
    },
    {
        id: 6,
        thumbnail: "https://social-media.zim.vn/stories/7cb9b51b-a2a5-4ea0-a05e-5c8752ad2f32/gwPLgj-IMGT6_8802/gwPLgj-IMGT6_8802.jpg",
        videoUrl: "https://social-media.zim.vn/stories/ed12b226-51c2-436a-ae7d-877ccef6b6da/vw77hN-BÀIĐĂNG22:4/output/hls/vw77hN-BÀIĐĂNG22:41080p.m3u8",
        location: "ZIM Academy - 109 Nguyễn Thái Học, Tp. Vũng Tàu",
        caption: "\"Sao chị bảo với em là chị cho ÍT BÀI TẬP lắm màaaaa\"\nCác Zimians cứ yên tâm, cứ siêng năng là chị có Thưởng nha!!! 😝😝\n\n➡️ Tìm chị ở đây nè: m.me/864118950129121?ref=ZIM660287"
    },
    {
        id: 7,
        thumbnail: "https://social-media.zim.vn/stories/448a04de-e2ae-4071-a8b4-2506d3b27f00/-frs1N-IMG_2827/-frs1N-IMG_2827.jpeg",
        videoUrl: "https://social-media.zim.vn/stories/ed12b226-51c2-436a-ae7d-877ccef6b6da/vw77hN-BÀIĐĂNG22:4/output/hls/vw77hN-BÀIĐĂNG22:41080p.m3u8",
        location: "ZIM Academy - 16 Nguyễn Văn Huyên - Q. Cầu Giấy",
        caption: "Người ta hỏi “đi học hay đi ngủ?”\nCòn tụi mình:\nngủ thì áy náy, học thì buồn ngủ 🥲\n\nNhưng thôi… vẫn đi học,\nvì nghỉ 1 buổi là mất luôn động lực 💪💪💪"
    },
    {
        id: 8,
        thumbnail: "https://social-media.zim.vn/stories/9b01d256-c248-4fe4-b9ac-631122e038d8/b0Xl-S-Thumbnails/b0Xl-S-Thumbnails.jpg",
        videoUrl: "https://social-media.zim.vn/stories/ed12b226-51c2-436a-ae7d-877ccef6b6da/vw77hN-BÀIĐĂNG22:4/output/hls/vw77hN-BÀIĐĂNG22:41080p.m3u8",
        location: "ZIM Academy - 395 Quang Trung, Q. Hà Đông",
        caption: "🎧 TOEIC Listening mãi không lên điểm? Có thể bạn đang sai ngay từ Part 1."
    }
];

/**
 * Section configuration
 */
export const sectionConfig = {
    title: "6576 khoảnh khắc đáng nhớ",
    description: "Hàng ngàn khoảnh khắc đáng nhớ về hành trình học tập thú vị luôn được ZIM ghi lại mỗi ngày tại 21 trung tâm Anh Ngữ ZIM trên toàn quốc.",
    totalMoments: 6576
};