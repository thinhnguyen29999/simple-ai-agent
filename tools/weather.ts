// Function to get current weather
export function get_current_weather(location: string, unit: string): string {
    /** Get the current weather in a given location */
    // Hardcoded để demo, nhưng bạn cũng có thể gọi API bên ngoài
    console.log(`\n[Tool Call] Đang gọi API thời tiết cho ${location}, đơn vị ${unit}...`);
    return "Trời rét vãi nôi, 7 độ C";
}

// Tool definition for weather
export const weatherTool = {
    "type": "function",
    "function": {
        "name": "get_current_weather",
        "description": "Get the current weather in a given location",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city name"
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "The temperature unit"
                }
            },
            "required": ["location", "unit"]
        }
    }
};

