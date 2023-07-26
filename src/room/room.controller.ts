import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from './schemas/room.schemas';

@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService) { }
    
    @Post()
    createRoom(@Body('id') userId: String): Promise<String> { 
        return this.roomService.createRoom(userId);
    }

    @Get()
    findAllRoom(): Promise<Room[]> {
        return this.roomService.findAllRoom();
    }
}
