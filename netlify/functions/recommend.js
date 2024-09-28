const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { userInput } = JSON.parse(event.body);

  // OpenAI API 호출
  const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
body: JSON.stringify({
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'system', content: 'You are a helpful assistant that recommends books based on user concerns.' },
    { role: 'user', content: `사용자가 이런 고민을 하고 있습니다: ${userInput}. 이 고민을 해결할 수 있는 책을 찾기 위한 짧고 간단한 키워드를 추천해 주세요. 키워드는 1~2개의 단어로만 구성되어야 합니다.` }
  ]
})
  });

  const openAIResult = await openAIResponse.json();
  const keyword = openAIResult.choices[0].message.content.trim();

  // 키워드를 로그로 출력해 확인
  console.log("생성된 키워드: ", keyword);

  // 네이버 도서 API 호출
  const naverResponse = await fetch(`https://openapi.naver.com/v1/search/book.json?query=${keyword}`, {
    method: 'GET',
    headers: {
      'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
    }
  });

  const data = await naverResponse.json();

  // 첫 번째 책 데이터를 반환
  if (data.items && data.items.length > 0) {
    const book = data.items[0];  // 첫 번째 책 정보 선택

    return {
      statusCode: 200,
      body: JSON.stringify({
        title: book.title || "제목 정보 없음",
        author: book.author || "저자 정보 없음",
        description: book.description || "설명 정보 없음",
        image: book.image || "이미지 없음",
        link: book.link || "#"
      })
    };
  } else {
    console.log("책을 찾을 수 없습니다. 키워드:", keyword);
    return {
      statusCode: 404,
      body: JSON.stringify({ message: '책을 찾을 수 없습니다.' })
    };
  }
};
