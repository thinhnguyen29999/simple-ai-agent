// Function to search for song lyrics
export function get_lyrics(query: string): string {
    /** Search for song lyrics based on query or song lyrics snippet */
    console.log(`\n[Tool Call] Đang tìm kiếm lời bài hát với từ khóa: "${query}"...`);
    
    // Kiểm tra nếu query chứa các từ khóa của bài "Muốn cua anh làm bồ"
    const keywords = ["lấy cây kim may", "muốn cua anh làm bồ", "muốn cua anh"];
    const lowerQuery = query.toLowerCase();
    
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
        return `Tên bài hát: Muốn cua anh làm bồ

Intro & vòng hợp âm: [Em][Bm]-[D][Em]-[Em][Bm]-[D][Em]

[Em] Lấy cây kim may [Bm] đồ rồi khâu cái [D] túi xong bắt trái tim anh bỏ [Em] vô

[Em] Muốn cua anh làm [Bm] bồ nhìn mình trong [D] gương em đây cũng xinh hơn nhiều [Em] cô

Nhà má mười mấy công [Em] ruộng nà còn tía thì mấy trăm [Bm] chuồng gà

Mình em thì lo sao [D] hết anh ơi có duyên xin mời [Em] qua

Mùa nước mình lấy chiếc [Em] xuồng chèo mùa nắng thì phóng xe [Bm] vèo vèo

Một năm là gôm đủ [D] thóc cho hai đứa mua hột xoàn [Em] đeo

ĐK: Nè gật đầu cho [Em] suông sang năm mình làm đám cưới [Bm] luôn

Hai đứa leo lên chung [D] xuồng hai bên họ hàng chơi tới [Em] luôn

Phải rót vô cho đầy [Em] ly hôm nay ngày vui suy nghĩ [Bm] chi

Hạnh phúc ta không cầu [D] kì yêu nhau một đời không phân [Em] ly`;
    }
    
    return `Không tìm thấy lời bài hát cho từ khóa: "${query}"`;
}

// Tool definition for lyrics
export const lyricsTool = {
    "type": "function",
    "function": {
        "name": "get_lyrics",
        "description": "Search for song lyrics based on query, song name, or lyrics snippet. Use this when user is looking for song lyrics or asking about a song.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query, song name, or lyrics snippet to find the song lyrics"
                }
            },
            "required": ["query"]
        }
    }
};

