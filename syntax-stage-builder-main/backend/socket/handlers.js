const jwt = require('jsonwebtoken');
const { db } = require('../config/supabase');
const winston = require('winston');

// Store active connections and rooms
const activeConnections = new Map();
const codeRooms = new Map();
const chatRooms = new Map();

const socketHandlers = (io, socket) => {
    let userId = null;
    let user = null;

    // Authenticate socket connection
    socket.on('authenticate', async(data) => {
        try {
            const token = data.token;
            if (!token) {
                socket.emit('error', { message: 'Authentication token required' });
                return;
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            user = await db.getUserById(decoded.id);

            if (!user || !user.is_active) {
                socket.emit('error', { message: 'Invalid or inactive user' });
                return;
            }

            userId = user.id;
            activeConnections.set(userId, socket.id);

            // Join user's personal room
            socket.join(`user_${userId}`);

            socket.emit('authenticated', {
                userId,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar
                }
            });

            winston.info(`User ${user.name} (${userId}) connected`);
        } catch (error) {
            winston.error('Socket authentication error:', error);
            socket.emit('error', { message: 'Authentication failed' });
        }
    });

    // Join a code collaboration room
    socket.on('join-code-room', async(data) => {
        try {
            if (!userId) {
                socket.emit('error', { message: 'Authentication required' });
                return;
            }

            const { roomId, language } = data;
            const roomKey = `code_${roomId}`;

            // Join the room
            socket.join(roomKey);

            // Initialize room if it doesn't exist
            if (!codeRooms.has(roomKey)) {
                codeRooms.set(roomKey, {
                    id: roomId,
                    language,
                    participants: new Set(),
                    code: '',
                    cursors: new Map(),
                    lastModified: Date.now()
                });
            }

            const room = codeRooms.get(roomKey);
            room.participants.add(userId);

            // Notify others in the room
            socket.to(roomKey).emit('user-joined', {
                userId,
                user: {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                },
                timestamp: Date.now()
            });

            // Send current room state to the new user
            socket.emit('room-state', {
                participants: Array.from(room.participants).map(id => ({
                    id,
                    name: activeConnections.has(id) ? 'Active User' : 'Unknown User'
                })),
                code: room.code,
                cursors: Array.from(room.cursors.entries()).map(([userId, cursor]) => ({
                    userId,
                    ...cursor
                }))
            });

            winston.info(`User ${user.name} joined code room ${roomId}`);
        } catch (error) {
            winston.error('Join code room error:', error);
            socket.emit('error', { message: 'Failed to join code room' });
        }
    });

    // Leave a code collaboration room
    socket.on('leave-code-room', (data) => {
        try {
            if (!userId) return;

            const { roomId } = data;
            const roomKey = `code_${roomId}`;

            socket.leave(roomKey);

            const room = codeRooms.get(roomKey);
            if (room) {
                room.participants.delete(userId);
                room.cursors.delete(userId);

                // Remove room if empty
                if (room.participants.size === 0) {
                    codeRooms.delete(roomKey);
                } else {
                    // Notify others
                    socket.to(roomKey).emit('user-left', {
                        userId,
                        user: {
                            id: user.id,
                            name: user.name
                        },
                        timestamp: Date.now()
                    });
                }
            }

            winston.info(`User ${user.name} left code room ${roomId}`);
        } catch (error) {
            winston.error('Leave code room error:', error);
        }
    });

    // Handle code changes in real-time
    socket.on('code-change', (data) => {
        try {
            if (!userId) return;

            const { roomId, code, cursor, selection } = data;
            const roomKey = `code_${roomId}`;

            const room = codeRooms.get(roomKey);
            if (room) {
                room.code = code;
                room.lastModified = Date.now();

                if (cursor) {
                    room.cursors.set(userId, {
                        position: cursor,
                        selection,
                        timestamp: Date.now()
                    });
                }

                // Broadcast to other participants
                socket.to(roomKey).emit('code-updated', {
                    userId,
                    user: {
                        id: user.id,
                        name: user.name
                    },
                    code,
                    cursor: room.cursors.get(userId),
                    timestamp: Date.now()
                });
            }
        } catch (error) {
            winston.error('Code change error:', error);
        }
    });

    // Handle cursor movements
    socket.on('cursor-move', (data) => {
        try {
            if (!userId) return;

            const { roomId, cursor, selection } = data;
            const roomKey = `code_${roomId}`;

            const room = codeRooms.get(roomKey);
            if (room) {
                room.cursors.set(userId, {
                    position: cursor,
                    selection,
                    timestamp: Date.now()
                });

                // Broadcast cursor position
                socket.to(roomKey).emit('cursor-moved', {
                    userId,
                    user: {
                        id: user.id,
                        name: user.name
                    },
                    cursor: room.cursors.get(userId)
                });
            }
        } catch (error) {
            winston.error('Cursor move error:', error);
        }
    });

    // Join a chat room
    socket.on('join-chat-room', async(data) => {
        try {
            if (!userId) {
                socket.emit('error', { message: 'Authentication required' });
                return;
            }

            const { roomId, roomType } = data;
            const roomKey = `chat_${roomId}`;

            socket.join(roomKey);

            // Initialize chat room if it doesn't exist
            if (!chatRooms.has(roomKey)) {
                chatRooms.set(roomKey, {
                    id: roomId,
                    type: roomType,
                    participants: new Set(),
                    messages: [],
                    lastActivity: Date.now()
                });
            }

            const room = chatRooms.get(roomKey);
            room.participants.add(userId);

            // Notify others
            socket.to(roomKey).emit('user-joined-chat', {
                userId,
                user: {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                },
                timestamp: Date.now()
            });

            // Send recent messages to the new user
            const recentMessages = room.messages.slice(-50); // Last 50 messages
            socket.emit('chat-history', {
                messages: recentMessages,
                participants: Array.from(room.participants).map(id => ({
                    id,
                    name: activeConnections.has(id) ? 'Active User' : 'Unknown User'
                }))
            });

            winston.info(`User ${user.name} joined chat room ${roomId}`);
        } catch (error) {
            winston.error('Join chat room error:', error);
            socket.emit('error', { message: 'Failed to join chat room' });
        }
    });

    // Send chat message
    socket.on('send-message', (data) => {
        try {
            if (!userId) return;

            const { roomId, message, messageType = 'text' } = data;
            const roomKey = `chat_${roomId}`;

            const room = chatRooms.get(roomKey);
            if (room) {
                const chatMessage = {
                    id: `msg_${Date.now()}_${Math.random()}`,
                    userId,
                    user: {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar
                    },
                    message,
                    type: messageType,
                    timestamp: Date.now()
                };

                room.messages.push(chatMessage);
                room.lastActivity = Date.now();

                // Broadcast to all participants
                io.to(roomKey).emit('new-message', chatMessage);
            }
        } catch (error) {
            winston.error('Send message error:', error);
        }
    });

    // Handle typing indicators
    socket.on('typing-start', (data) => {
        try {
            if (!userId) return;

            const { roomId } = data;
            const roomKey = `chat_${roomId}`;

            socket.to(roomKey).emit('user-typing', {
                userId,
                user: {
                    id: user.id,
                    name: user.name
                },
                isTyping: true
            });
        } catch (error) {
            winston.error('Typing start error:', error);
        }
    });

    socket.on('typing-stop', (data) => {
        try {
            if (!userId) return;

            const { roomId } = data;
            const roomKey = `chat_${roomId}`;

            socket.to(roomKey).emit('user-typing', {
                userId,
                user: {
                    id: user.id,
                    name: user.name
                },
                isTyping: false
            });
        } catch (error) {
            winston.error('Typing stop error:', error);
        }
    });

    // Handle study group collaboration
    socket.on('join-study-group', async(data) => {
        try {
            if (!userId) {
                socket.emit('error', { message: 'Authentication required' });
                return;
            }

            const { groupId } = data;
            const groupKey = `group_${groupId}`;

            socket.join(groupKey);

            // Notify group members
            socket.to(groupKey).emit('member-joined', {
                userId,
                user: {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                },
                timestamp: Date.now()
            });

            winston.info(`User ${user.name} joined study group ${groupId}`);
        } catch (error) {
            winston.error('Join study group error:', error);
            socket.emit('error', { message: 'Failed to join study group' });
        }
    });

    // Handle mentorship sessions
    socket.on('join-mentorship', async(data) => {
        try {
            if (!userId) {
                socket.emit('error', { message: 'Authentication required' });
                return;
            }

            const { sessionId, role } = data; // role: 'mentor' or 'mentee'
            const sessionKey = `mentorship_${sessionId}`;

            socket.join(sessionKey);

            // Notify the other participant
            socket.to(sessionKey).emit('participant-joined', {
                userId,
                user: {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                },
                role,
                timestamp: Date.now()
            });

            winston.info(`User ${user.name} joined mentorship session ${sessionId} as ${role}`);
        } catch (error) {
            winston.error('Join mentorship error:', error);
            socket.emit('error', { message: 'Failed to join mentorship session' });
        }
    });

    // Handle screen sharing
    socket.on('screen-share-start', (data) => {
        try {
            if (!userId) return;

            const { roomId, streamId } = data;
            const roomKey = `code_${roomId}`;

            socket.to(roomKey).emit('screen-share-started', {
                userId,
                user: {
                    id: user.id,
                    name: user.name
                },
                streamId,
                timestamp: Date.now()
            });
        } catch (error) {
            winston.error('Screen share start error:', error);
        }
    });

    socket.on('screen-share-stop', (data) => {
        try {
            if (!userId) return;

            const { roomId } = data;
            const roomKey = `code_${roomId}`;

            socket.to(roomKey).emit('screen-share-stopped', {
                userId,
                user: {
                    id: user.id,
                    name: user.name
                },
                timestamp: Date.now()
            });
        } catch (error) {
            winston.error('Screen share stop error:', error);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        try {
            if (userId) {
                // Remove from active connections
                activeConnections.delete(userId);

                // Leave all rooms and notify participants
                codeRooms.forEach((room, roomKey) => {
                    if (room.participants.has(userId)) {
                        room.participants.delete(userId);
                        room.cursors.delete(userId);

                        socket.to(roomKey).emit('user-disconnected', {
                            userId,
                            user: {
                                id: user.id,
                                name: user.name
                            },
                            timestamp: Date.now()
                        });

                        // Remove empty rooms
                        if (room.participants.size === 0) {
                            codeRooms.delete(roomKey);
                        }
                    }
                });

                chatRooms.forEach((room, roomKey) => {
                    if (room.participants.has(userId)) {
                        room.participants.delete(userId);

                        socket.to(roomKey).emit('user-disconnected', {
                            userId,
                            user: {
                                id: user.id,
                                name: user.name
                            },
                            timestamp: Date.now()
                        });
                    }
                });

                winston.info(`User ${user?.name} (${userId}) disconnected`);
            }
        } catch (error) {
            winston.error('Disconnect error:', error);
        }
    });

    // Handle errors
    socket.on('error', (error) => {
        winston.error('Socket error:', error);
    });
};

module.exports = socketHandlers;