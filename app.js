import 'dotenv/config';
import { connectDB } from './src/config/db.js';
import fastify from 'fastify';
import { PORT } from './src/config/config.js';
import fastifySocketIO from 'fastify-socket.io';
import { registerRoutes } from './src/routes/index.js';

const start = async () => {
  await connectDB();
  const app = fastify();

  app.register(fastifySocketIO,{
    cors:{
      origin:"*"
    },
    pingInterval:10000,
    pingTimeout:5000,
    transports:['websocket']
  })

  await registerRoutes(app)

  app.listen({ port: PORT,host:'0.0.0.0'},(err,addr)=>{
    if(err){
        console.log(err);
    } else {
         console.log(`Server running on port ${PORT}`);
    }
  })

  app.ready().then(()=>{
    app.io.on('connection',(socket)=>{
      console.log("User connected");

      socket.on("joinRoom",(orderId)=>{
        socket.join(orderId);
        console.log(`User Joined room ${orderId}`);
        
      })
      socket.on("disconnect",()=>{
        console.log('User Disconnected');  
      })
      
    })
  })
  
};

start();
