import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './schemas/room.schemas';
import { Model } from 'mongoose';
import { AddCommentDTO } from './dto/add-comment.dto';

@Injectable()
export class RoomService {
    constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) { }

    async createRoom(userId: String): Promise<String> {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let code = '';
        for (let i = 0; i < 10; i++) { //10자리 참관코드 생성
          const randomIndex = Math.floor(Math.random() * characters.length);
          code += characters.charAt(randomIndex);
        }

        const isCode = await this.roomModel.exists({ "visitorcode": code });
        if (isCode)
            throw new Error("방 생성 실패");
        const data = {
            "visitorcode": code,
            "id": userId,
            "comment": [],
        };
        const result = await this.roomModel.create(data);
        if (!result)
            return null;
        return code;
    }

    async addCommentToRoom(addCommentDTO: AddCommentDTO) {
        const { visitorcode, time, userid, comment } = addCommentDTO;
        const room = await this.roomModel.findOne({ visitorcode });
        if (!room) {
            throw new Error("Not Exist room");
        }

        const data = {
            "time": time,
            "userid": userid,
            "message": comment
        };
        room.comment.push(data);

        //변경사항 저장
        await room.save();
    }

    async findAllRoom(): Promise<Room[]> {
        return await this.roomModel.find().exec();
    }
}
