import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

let openai: OpenAI | null = null

// Initialize OpenAI client only when API key is available
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { playerCount, spyCount } = await request.json()

    if (!openai || !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一个"谁是卧底"游戏的出题助手。请生成两个相似但不同的中文词语，一个给平民，一个给卧底。这两个词语应该相似到让人容易混淆，但又有明显区别。只返回JSON格式：{"civilianWord": "词语1", "spyWord": "词语2"}',
        },
        {
          role: 'user',
          content: `请为${playerCount}个玩家（其中${spyCount}个卧底）生成游戏词语。`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    }, {
      timeout: 30000,
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('No content returned from OpenAI')
    }

    // Parse the response with error handling
    let words
    try {
      words = JSON.parse(content)
    } catch (parseError) {
      throw new Error('Failed to parse OpenAI response as JSON')
    }

    return NextResponse.json({
      civilianWord: words.civilianWord,
      spyWord: words.spyWord,
    })
  } catch (error: any) {
    console.error('Error generating words:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate words' },
      { status: 500 }
    )
  }
}
