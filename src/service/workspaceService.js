import { v4 as uuidv4 } from 'uuid';
import workspaceRepository from '../repository/workspaceRepository';
import { channels, roles } from '../utils/common/enum';

export const createWorkspaceService = async (workspaceData) => {
  try {
    const joinCode = uuidv4.substring(0, 6).toUpperCase();

    const response = await workspaceRepository.create({
      name: workspaceData.name,
      description: workspaceData.description,
      joinCode
    });

    await workspaceRepository.addMemberToWorkspace(
      response._id,
      workspaceData.owner,
      roles.ADMIN
    );

    const updatedWorkspace = await workspaceRepository.addChannelToWorkspace(
      response._id,
      channels.GENERAL
    );

    return updatedWorkspace;
  } catch (error) {
    console.log('🚀 ~ createWorkspaceService ~ error:', error);
    if (error.name === 'ValidationError') {
      throw new ValidationError(
        {
          error: error.errors
        },
        error.message
      );
    }

    if (error.name == 'MongoServerError' && error.code === 11000) {
      throw new ValidationError(
        {
          error: ['A workspace with the same name is already exits']
        },
        'A workspace with same details already exists'
      );
    }
    throw error;
  }
};
