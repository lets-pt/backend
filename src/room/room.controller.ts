import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from './schemas/room.schemas';
import { AddCommentDTO } from './dto/add-comment.dto';

@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService) { }
    
    @Post()
    createRoom(@Body('id') userId: String): Promise<String> { 
        return this.roomService.createRoom(userId);
    }

    @Post('addComment')
    addComment(@Body() addCommentDTO: AddCommentDTO) {
        this.roomService.addCommentToRoom(addCommentDTO);
    }

    @Get()
    findAllRoom(): Promise<Room[]> {
        return this.roomService.findAllRoom();
    }
}
