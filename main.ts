import * as dotenv from 'dotenv';
import axios from 'axios';
import { functionMap, tools } from './tools';

// Load environment variables from .env file
dotenv.config();

// Get environment variables
const API_KEY = process.env.NODE_API_KEY;
const END_POINT = process.env.NODE_END_POINT;
const MODEL = process.env.NODE_MODEL;

// Validate required environment variables
if (!API_KEY || !END_POINT || !MODEL) {
  console.error('Error: NODE_API_KEY, NODE_END_POINT, and NODE_MODEL are required');
  process.exit(1);
}

// TypeScript: After validation, these are guaranteed to be strings
const token: string = API_KEY;
const endpoint: string = END_POINT;
const model: string = MODEL;

// Function to execute tool calls
function executeToolCall(toolCall: any): string {
  const functionName = toolCall.function?.name;
  const functionArgs = JSON.parse(toolCall.function?.arguments || '{}');
  
  console.log(`\n[Executing Tool] Function: ${functionName}`);
  console.log(`[Arguments]`, functionArgs);
  
  const func = functionMap[functionName];
  if (!func) {
    return `Error: Function ${functionName} not found`;
  }
  
  try {
    const result = func(...Object.values(functionArgs));
    return typeof result === 'string' ? result : JSON.stringify(result);
  } catch (error: any) {
    return `Error executing ${functionName}: ${error.message}`;
  }
}

// Function to make POST request to API
async function makeAPIRequest(messages: any[], useTools: boolean = false) {
  const requestBody: any = {
    model: model,
    messages: messages
  };
  
  if (useTools) {
    requestBody.tools = tools;
    requestBody.tool_choice = "auto";
  }
  
  console.log('\n=== Request Body ===');
  console.log(JSON.stringify(requestBody, null, 2));
  
  const response = await axios.post(
    endpoint,
    requestBody,
    {
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json"
      }
    }
  );
  
  return response.data;
}

// Function to make POST request to API with tool support
async function fetchFromAPI() {
  try {
    console.log('Making POST request to API with tools...');
    console.log(`Endpoint: ${endpoint}`);
    console.log(`Model: ${model}`);
    
    // Initial messages
    let messages: any[] = [
      { role: "user", content: "Tôi đang tìm kiếm bài hát hothit hiện tại có vài câu hát sau đây \"lấy cây kim may đồ...\", hãy giúp tôi tim ra bài hát đó và cánh đánh guitar" }
    ];
    
    let maxIterations = 5; // Prevent infinite loops
    let iteration = 0;
    
    while (iteration < maxIterations) {
      iteration++;
      console.log(`\n--- Iteration ${iteration} ---`);
      
      // Make API request with tools
      const responseData = await makeAPIRequest(messages, true);
      
      console.log('\n=== Response Data ===');
      console.log(JSON.stringify(responseData, null, 2));
      
      if (!responseData?.choices || responseData.choices.length === 0) {
        console.log('No choices in response');
        break;
      }
      
      const choice = responseData.choices[0];
      const message = choice.message;
      
      // Add assistant message to conversation
      messages.push({
        role: message.role,
        content: message.content,
        tool_calls: message.tool_calls
      });
      
      // Check if model wants to call a tool
      if (message.tool_calls && message.tool_calls.length > 0) {
        console.log('\n=== Tool Calls Detected ===');
        
        // Execute all tool calls
        const toolResults = message.tool_calls.map((toolCall: any) => {
          const result = executeToolCall(toolCall);
          return {
            tool_call_id: toolCall.id,
            role: "tool",
            name: toolCall.function.name,
            content: result
          };
        });
        
        // Add tool results to messages
        messages.push(...toolResults);
        
        // Continue the conversation
        continue;
      } else {
        // Model has final response
        if (message.content) {
          console.log('\n=== Final Assistant Response ===');
          console.log(message.content);
        }
        break;
      }
    }
    
    if (iteration >= maxIterations) {
      console.log('\n⚠️ Maximum iterations reached');
    }
    
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('\n=== Error Details ===');
      console.error(`Status: ${error.response?.status || 'N/A'}`);
      console.error(`Message: ${error.message}`);
      if (error.response?.data) {
        console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
      }
    } else {
      console.error('Unexpected error:', error);
    }
    process.exit(1);
  }
}

// Execute the request
fetchFromAPI();
