import { Injectable } from '@angular/core';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    
    this.genAI = new GoogleGenerativeAI('AIzaSyDjyMfcXe_y8NSbkowbsaLAHU0cCdvUveQ');
  }

  async generateResponse(prompt: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    return result.response.text();
  }
}
