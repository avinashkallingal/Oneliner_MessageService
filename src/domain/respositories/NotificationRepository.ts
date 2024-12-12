import mongoose, { Mongoose } from "mongoose";
import { Notification } from '../../model/Notification';

export class NotificationRepository {

    async saveNotification(data: any) {
        try {
            console.log(data," data from like notification triger socket***********")
            if (!data.userId || !data.senderId || !data.type) {
                return { success: false, message: 'id is missing' }
            }

            const newNotification = new Notification({
                userId: new mongoose.Types.ObjectId(data.userId),
                senderId: new mongoose.Types.ObjectId(data.senderId),
                type: data.type,
                postId: new mongoose.Types.ObjectId(data.postId),
                message: data.message
            })

            await newNotification.save();
            return { success: true, message: 'message saved' }
        } catch (error) {

        }
    }

    async getNotification(id: string) {
        try {
            console.log(id)
            const newId = new mongoose.Types.ObjectId(id);
            const notifications = await Notification.find({ senderId: newId,isRead: false })
            .sort({ _id: -1 })  
            .limit(15);
            console.log(notifications," consoling notification in ")
            return notifications
        } catch (error) {

        }
    }

    async updateNotification(id: string) {
        try {
            console.log(id,"44444444444444444444")
            const update = await Notification.updateMany({ senderId: id }, { $set: { isRead: true } });
            console.log(update," update in read notification repo&&&&&&&&&&&&&")
            return update;
        } catch (error) {
            console.log('Error in the updateNotification in repo -->', error);
        }
    }
}