import { Request, Response } from 'express';
import { solveWithGroq } from '../services/groqService.js';
import { Conversation } from '../models/Conversation.js';
import { User } from '../models/User.js';

export async function solveProblem(req: Request, res: Response) {
  try {
    const { problem, subject, level, mode, conversationId, userId } = req.body;

    if (!problem) {
      return res.status(400).json({ error: 'Problem is required' });
    }

    // Get user and check limits
    let user = null;
    if (userId) {
      user = await User.findById(userId);
      
      if (user && !user.isPremium) {
        // Reset daily count if new day
        const today = new Date().toDateString();
        const lastDate = new Date(user.lastMessageDate).toDateString();
        
        if (today !== lastDate) {
          user.messagesUsedToday = 0;
          user.lastMessageDate = new Date();
        }
        
        // Check free tier limit
        if (user.messagesUsedToday >= 15) {
          return res.status(429).json({ 
            error: 'Daily message limit reached',
            message: 'Upgrade to Premium for unlimited messages!'
          });
        }
      }
    }

    // Get conversation history if exists
    let conversation = null;
    let conversationHistory: any[] = [];
    
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (conversation) {
        conversationHistory = conversation.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      }
    }

    // Solve with Groq
    const solution = await solveWithGroq(
      problem,
      { 
        subject: subject || 'Mathématiques', 
        level: level || 'lycee', 
        mode: mode || 'full', 
        isPremium: user?.isPremium || false 
      },
      conversationHistory
    );

    // Save to database
    if (!conversation && userId) {
      conversation = new Conversation({
        userId,
        subject: subject || 'Mathématiques',
        level: level || 'lycee',
        messages: [
          { role: 'user', content: problem, timestamp: new Date() },
          { role: 'assistant', content: solution, timestamp: new Date() }
        ]
      });
      await conversation.save();
    } else if (conversation) {
      conversation.messages.push(
        { role: 'user', content: problem, timestamp: new Date() },
        { role: 'assistant', content: solution, timestamp: new Date() }
      );
      conversation.updatedAt = new Date();
      await conversation.save();
    }

    // Update user message count
    if (user && !user.isPremium) {
      user.messagesUsedToday += 1;
      await user.save();
    }

    res.json({ 
      solution,
      conversationId: conversation?._id,
      messagesRemaining: user && !user.isPremium ? 15 - user.messagesUsedToday : null
    });

  } catch (error: any) {
    console.error('Error solving problem:', error);
    res.status(500).json({ error: 'Failed to solve problem', details: error.message });
  }
}

export async function getConversations(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    
    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(20);
    
    res.json({ conversations });
  } catch (error: any) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
}
