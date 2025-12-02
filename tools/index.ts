// Export all functions
export { get_current_weather } from './weather';
export { get_lyrics } from './lyrics';

// Export all tool definitions
export { weatherTool } from './weather';
export { lyricsTool } from './lyrics';

// Map function names to actual functions
import { get_current_weather } from './weather';
import { get_lyrics } from './lyrics';

export const functionMap: { [key: string]: Function } = {
    get_current_weather: get_current_weather,
    get_lyrics: get_lyrics
};

// All tools array
import { weatherTool } from './weather';
import { lyricsTool } from './lyrics';

export const tools = [
    weatherTool,
    lyricsTool
];

