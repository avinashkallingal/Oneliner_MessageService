import { IChat, IImage, IMessage, IVideo } from "../domain/entities/IChat";
import { ChatRepository } from "../domain/respositories/ChatRepository";
import { fetchFileFromS3, uploadFileToS3 } from "../infrastructure/s3/s3Actions";


class ChatService {
    private chatRepo: ChatRepository;

    constructor() {
        this.chatRepo = new ChatRepository();
    }

    async getConversationData(userId: string): Promise<{ success: boolean, message: string, data?: IChat[] }> {
        try {
            const result = await this.chatRepo.find(userId);
            console.log(result, 'res')
            console.log(result, 'res')
            if (!result || !result.success) {
                return { success: result.success, message: result.message }
            }
            return { success: true, message: 'chats found', data: result.data }
        } catch (error) {
            console.error("Error fetching convo users:", error);
            return { success: false, message: 'Unable to load the chats' }
        }
    }

    async getChatId(userId: string, recievedId: string): Promise<{ success: boolean, message: string, data?: IChat }> {
        try {
            const result = await this.chatRepo.createChatId(userId, recievedId);

            if (!result || !result.success) {
                return { success: result.success, message: result.message }
            }

            return { success: result.success, message: result.message, data: result.data }
        } catch (error) {
            console.error("Error creating chatId:", error);
            return { success: false, message: 'Something wen wrong' }
        }
    }

    async fetchMessages(userId: string, recievedId: string): Promise<{ success: boolean, message: string, data?: IMessage[] }> {
        try {
            const result = await this.chatRepo.findMessages(userId, recievedId)
            if (!result || !result.success) {
                return { success: result.success, message: result.message }
            }
            return { success: result.success, message: result.message, data: result.data }
        } catch (error) {
            console.error("Error fetching messages:", error);
            return { success: false, message: 'Something went wrong' }
        }
    }

    
    async fetchInboxMessages(userId: string): Promise<{ success: boolean, message: string, data?: IMessage[]|null }> {
        try {
            const result = await this.chatRepo.findInboxMessages(userId)
            if (!result || !result.success) {
                return { success: result.success, message: result.message }
            }
            return { success: result.success, message: result.message, data: result.data }
        } catch (error) {
            console.error("Error fetching messages:", error);
            return { success: false, message: 'Something went wrong' }
        }
    }
    
    async readUpdate(read: boolean,userId:string,receiverId:string): Promise<{ success: boolean, message: string }> {
        try {
            const result = await this.chatRepo.readUpdate(read,userId,receiverId)
            if (!result || !result.success) {
                return { success: result.success, message: result.message }
            }
            return { success: result.success, message: result.message }
        } catch (error) {
            console.error("Error fetching messages:", error);
            return { success: false, message: 'Something went wrong' }
        }
    }

    async newMessage(chatId: string, content: string,fileType:string, image: string, pdf:string, video: string, senderId: string, receiverId: string): Promise<{ success: boolean, message: string, data?: IMessage }> {
        try {

            console.log(senderId, '-----------', receiverId)
            // const data={
            //     chatId,
            //     content,
            //     image,
            //     pdf,
            //     video,
            //     senderId,
            //     receiverId
            // }
            // if(pdf||image||video){
            //     const result=await this.saveMedia(data)
            //     if(result){
            //         return { success: result.success, message: result.message, data: result.data };
            //     }
            // }

            const result = await this.chatRepo.createMessage(chatId, content,fileType, senderId, receiverId);

            if (!result || !result.success) {
                return { success: result.success, message: result.message };
            }

            return { success: result.success, message: result.message, data: result.data };
        } catch (error) {
            console.error("Error creating messages:", error);
            throw new Error(`Error creating messages: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    
  
    async saveMedia(data: any): Promise<{ success: boolean, message: string, data?: string }> {
        try {



            console.log(data.file.FileData[0],"data in message service upload image")
            const file=data.file.FileData[0]

            let fileUrl='';

            if (file) {
             
                    try {
                        fileUrl = await uploadFileToS3(file.buffer, file.originalname);
                        // imageUrls.push(imageUrl);
                        console.log(`Successfully uploaded image: ${file.originalname}, URL: ${fileUrl}`);
                    } catch (uploadError) {
                        console.error(`Error uploading image to S3:`, uploadError);
                    }
               
            }




            // const res = await this.chatRepo.saveMedia(data, imageUrl);
            // if (!res.success) {
            //     return { success: false, message: "Something went wrong" }
            // }

            // if (imageUrl.length === 0) {
            //     return { success: false, message: "No images were successfully uploaded" };
            // }
            return { success: true, message: "Images uploaded successfully", data: fileUrl };
        } catch (error) {
            console.error("Error in addImages function:", error);
            return { success: false, message: `Error uploading images: ${error instanceof Error ? error.message : "Unknown error"}` };
        }
    }


}

export { ChatService }