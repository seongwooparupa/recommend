const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    const data = JSON.parse(event.body);
    const userInput = data.user_input;

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that recommends books.' },
          { role: 'user', content: `사용자가 다음과 같은 고민을 가지고 있습니다: ${userInput}. 이 고민을 해결하기 위해 적절한 책을 추천해 주세요. 책 제목, 요약 설명, 그리고 책을 추천한 이유를 감동적으로 설명해 주세요.` }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const result = await response.json();

    // AI 응답 데이터에서 책 제목, 설명, 추천 이유를 추출
    const recommendedText = result.choices[0].message.content.split('\n');
    const bookTitle = recommendedText[0];  // 첫 번째 줄이 책 제목
    const bookSummary = recommendedText[1]; // 두 번째 줄이 요약 설명
    const emotionalExplanation = recommendedText.slice(2).join(' '); // 나머지 부분이 추천 이유

    return {
      statusCode: 200,
      body: JSON.stringify({
        bookTitle: bookTitle.trim(),
        bookSummary: bookSummary.trim(),
        bookCover: 'https://example.com/book-cover.jpg',  // 예시: 실제 커버 이미지 URL을 받아야 함
        purchaseLink: 'https://example.com/buy-book',     // 예시: 실제 구매 링크
        emotionalExplanation: emotionalExplanation.trim()
      })
    };
  } catch (error) {
    console.error('서버 에러:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '서버에서 오류가 발생했습니다.' })
    };
  }
};
