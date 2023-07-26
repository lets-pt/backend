import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './schemas/room.schemas';
import { Model } from 'mongoose';

@Injectable()
export class RoomService {
    constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) { }

    async createRoom(userId: String): Promise<string> {
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
        };
        const result = await this.roomModel.create(data);
        if (!result)
            return null;
        return code;
    }

    async findAllRoom(): Promise<Room[]> {
        return await this.roomModel.find().exec();
    }
}
