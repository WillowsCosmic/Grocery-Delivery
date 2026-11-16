import 'dotenv/config';
import { connectDB } from './src/config/db.js';
import fastify from 'fastify';
import { PORT } from './src/config/config.js';

const start = async () => {
  await connectDB();
  const app = fastify();

  app.listen({ port: PORT,host:'0.0.0.0'},(err,addr)=>{
    if(err){
        console.log(err);
    } else {
         console.log(`Server running on port ${PORT}`);
    }
  });
};

start();
