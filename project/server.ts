import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post('/supabase/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;

    const response = await axios.post(
      'https://db.onelvfqzohegmtbdswsf.supabase.co/auth/v1/signup',
      { email, password },
      {
        headers: {
          'apikey': process.env.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const { user } = response.data;

    if (user) {
      await axios.post(
        'https://db.onelvfqzohegmtbdswsf.supabase.co/rest/v1/students',
        [
          {
            id: user.id,
            full_name: fullName,
            email,
            score: 0,
          },
        ],
        {
          headers: {
            'apikey': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
