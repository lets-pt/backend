import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from 'src/room/room.service';

@WebSocketGateway({ cors: { origin: ['http://localhost:3000', 'http://localhost:3001'], credentials: true }, namespace: 'room' })
export class RoomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly roomService: RoomService) { }
  rooms = {}; //{roomCode: [socketId, socketId, ...]}

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket server initialized.');
  }

  handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.removeSocketFromRooms(socket);
    console.log(`Client disconnected: ${socket.id}`);
  }

  private removeSocketFromRooms(socket: Socket) { //방에서 나가면 방 목록에서도 나간다.
    for (const roomId of Object.keys(this.rooms)) {
      this.rooms[roomId] = this.rooms[roomId].filter(id => id !== socket.id);
      if (this.rooms[roomId].length === 0) {
        delete this.rooms[roomId];
      }
    }
  }

  @SubscribeMessage('createRoom')
  async handleMessage(@ConnectedSocket() socket, @MessageBody() data) {
    //방을 생성한 사람의 ID
    const { userId } = data;

    //참관코드 생성 및 DB 관련 작업
    const roomCode = await this.roomService.createRoom(userId);

    //방장이 방에 입장하도록 한다.
    socket.join(roomCode);

    this.rooms[roomCode] = []; //방 참가자 초기화
    this.rooms[roomCode].push(socket.id);

    console.log("createRoom join: ", roomCode, socket.id);
    socket.emit("create-succ", roomCode); //참관코드 전송
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() socket, @MessageBody() data) {
    const { visitorcode, userId } = data;

    if (!this.rooms[visitorcode]) {
      socket.emit("join-fail", "존재하지 않는 방입니다.");
      return;
    }
    socket.join(visitorcode);

    this.rooms[visitorcode].push(socket.id); //방 목록에 추가
    console.log("user list", this.rooms[visitorcode]);

    console.log("joinRoom join : ", visitorcode, userId);
    socket.emit("join-succ", { visitorcode: visitorcode, userlist: this.rooms[visitorcode] });
    console.log("userlist", this.rooms[visitorcode]);
    socket.broadcast.emit("user-join", this.rooms[visitorcode]);
  }

  @SubscribeMessage('offer')
  handleOffer(@ConnectedSocket() socket, @MessageBody() data) {
    const { visitorcode, offer, to } = data;
    if (this.rooms[visitorcode] && this.rooms[visitorcode].includes(to)) {
      socket.to(to).emit("offer", { visitorcode: visitorcode, offer: offer, from: socket.id });
    }
  }

  @SubscribeMessage('answer')
  handleAnswer(@ConnectedSocket() socket, @MessageBody() data) {
    const { visitorcode, answer, to } = data;
    if (this.rooms[visitorcode] && this.rooms[visitorcode].includes(to)) {
      socket.to(to).emit("answer", { visitorcode: visitorcode, answer: answer, from: socket.id });
    }
  }

  @SubscribeMessage('ice')
  handleIcecandidate(@ConnectedSocket() socket, @MessageBody() data) {
    const { visitorcode, icecandidate, to } = data;

    if (this.rooms[visitorcode] && this.rooms[visitorcode].includes(to)) {
      socket.to(to).emit("ice", { visitorcode: visitorcode, icecandidate: icecandidate, from: socket.id });
    }
  }

  @SubscribeMessage('title-url')
  handleTitleUrl(@ConnectedSocket() socket, @MessageBody() data) {
    const { title, pdfURL, userName } = data;
    socket.broadcast.emit("title-url", { title: title, pdfURL: pdfURL, userName: userName });
  }

  @SubscribeMessage('leftArrow')
  handleLeftArrow(@ConnectedSocket() socket) {
    socket.broadcast.emit("leftArrow");
  }

  @SubscribeMessage('rightArrow')
  handleRightArrow(@ConnectedSocket() socket) {
    socket.broadcast.emit("rightArrow");
  }

  @SubscribeMessage('start-timer')
  handleStartTimer(@ConnectedSocket() socket) {
    socket.broadcast.emit("start-timer");
  }

  @SubscribeMessage('stop-timer')
  handleStopTimer(@ConnectedSocket() socket) {
    socket.broadcast.emit("stop-timer");
  }
}