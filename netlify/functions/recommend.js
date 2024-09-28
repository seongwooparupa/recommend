async function getBookRecommendation(userInput) {
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
        { role: 'user', content: `사용자가 이런 고민을 하고 있습니다: ${userInput}. 이 고민을 해결할 수 있는 책을 추천하기 위해 적절한 키워드를 추천해 주세요.` }
      ]
    })
  });

  const openAIResult = await openAIResponse.json();
  const keyword = openAIResult.choices[0].message.content.trim();

  // 네이버 도서 API 호출
  const response = await fetch(`https://openapi.naver.com/v1/search/book.json?query=${keyword}`, {
    method: 'GET',
    headers: {
      'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
    }
  });

  const data = await response.json();

  if (data.items && data.items.length > 0) {
    const book = data.items[0];  // 첫 번째 책 정보 선택

    return {
      title: book.title,
      author: book.author,
      description: book.description,
      image: book.image,
      link: book.link
    };
  } else {
    throw new Error('책을 찾을 수 없습니다.');
  }
}

// 전역에서 사용할 수 있도록 window 객체에 함수 추가
window.getBookRecommendation = getBookRecommendation;
