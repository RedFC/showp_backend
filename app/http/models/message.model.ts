export interface IMessage {
    id?: string,
    message?: string,
    sender?: string,
    roomId: string,
    createdAt: Date,
    updatedAt: Date,
}