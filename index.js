const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Neon DB 연결 설정 (SSL 연결 필수)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // 외부 호스팅 환경에서 SSL 연결을 위해 필요
  }
});

app.get('/', async (req, res) => {
  try {
    // 1. test 테이블에서 name 컬럼의 레코드 하나 조회
    // LIMIT 1을 사용하여 단일 레코드만 가져옵니다.
    const result = await pool.query('SELECT name FROM test LIMIT 1');

    if (result.rows.length > 0) {
      const name = result.rows[0].name;
      // 2. 'HELLO [이름]' 형식으로 응답
      res.send(`HELLO ${name}`);
    } else {
      res.send('테이블에 데이터가 없습니다.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('데이터베이스 연결 오류 발생');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
