import { StatusCodes } from 'http-status-codes';
import channelRepository from '../repository/channelRepository.js';
import clientError from '../utils/errors/clientError.js';
import { isUserMemeberOfWorkspace } from './workspaceService.js';

export const getChannelByIdService = async (channelId, userId) => {
  try {
    const channel =
      await channelRepository.getChannelWithWorkspaceDetails(channelId);

    if (!channel || !channel.workspaceId) {
      throw new clientError({
        explanation: 'Invalid data sent from client',
        message: 'Channel not found with provided ID',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isUserPartOfWorkspace = isUserMemeberOfWorkspace(
      channel.workspaceId,
      userId
    );
    if (!isUserPartOfWorkspace) {
      throw new clientError({
        message:
          'User is not a member of channel hence cannot acess the channel',
        explanation: 'User is not a memeber of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    return channel;
  } catch (error) {
    console.log('🚀 ~ getChannelByIdService ~ error:', error);
    throw error;
  }
};
