import { NextRequest, NextResponse } from 'next/server'

// Demo mode with predefined word pairs for testing
const demoWordPairs = [
  { civilianWord: '西瓜', spyWord: '冬瓜' },
  { civilianWord: '眉毛', spyWord: '胡须' },
  { civilianWord: '手机', spyWord: '电话' },
  { civilianWord: '包子', spyWord: '饺子' },
  { civilianWord: '马', spyWord: '驴' },
  { civilianWord: '牛奶', spyWord: '豆浆' },
  { civilianWord: '烧饼', spyWord: '煎饼' },
  { civilianWord: '蝴蝶', spyWord: '蜜蜂' },
]

export async function POST(request: NextRequest) {
  try {
    // Randomly select a word pair
    const randomPair = demoWordPairs[Math.floor(Math.random() * demoWordPairs.length)]

    return NextResponse.json({
      civilianWord: randomPair.civilianWord,
      spyWord: randomPair.spyWord,
    })
  } catch (error: any) {
    console.error('Error in demo mode:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate demo words' },
      { status: 500 }
    )
  }
}
