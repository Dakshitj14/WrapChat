import User from '../models/user.models.js';
import Message from '../models/message.model.js';

// 
export const getUsersForsidebar = async (req, res) => {
    try{
        const loggedInUser = req.user;
        const filteredUsers = await User.find({_id:{$ne:loggedInUser._id}}).select("-password");
        return res.status(200).json(filteredUsers);
    }catch(error){
        console.log("Error in getUsersForsidebar controller", error);
        res.status(500).json({message:"Internal server error"});
    }
}
// getMessages
export const getMessages = async (req, res) => {
    try{
        const {id:userToChatId}= req.params;
        const myId = req.user._id;

        const messages = await Message.find(
            {
                $or:[
                    {senderId:myId, receiverId:userToChatId},
                    {senderId:userToChatId, receiverId:myId}
                ]
            }
        )
        res.status(200).json(messages);
    }catch(error){
        console.log("Error in getMessages controller", error);
        res.status(500).json({message:"Internal server error"});
    }
}
// sendMessage
export const sendMessage = async (req, res) => {
    try{
        const {text, image, voiceNote} = req.body;
        const {id: receiverId} = req.params;
        const myId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        let voiceUrl;
        if(voiceNote){
            const uploadResponse = await cloudinary.uploader.upload(voiceNote);
            voiceNote = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId: myId,
            receiverId,
            text,
            image: imageUrl,
            voiceNote: voiceUrl,
        });
        await newMessage.save();
        // todo: realtime functionality to be added with socket.io later
        return res.status(201).json(newMessage);
    }catch(error){
        console.log("Error in sendMessage controller", error);
        res.status(500).json({message:"Internal server error"});
    }
}