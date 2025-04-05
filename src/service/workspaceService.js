import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import channelRepository from '../repository/channelRepository.js';
import workspaceRepository from '../repository/workspaceRepository.js';
import { channels, roles } from '../utils/common/enum.js';
import clientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';

const isUserAdminOfWorkspace = (workspace, userId) => {
  return workspace.members.find(
    (member) =>
      member.memberId.toString() === userId && member.role === roles.ADMIN
  );
};

const isUserMemeberOfWorkspace = (workspace, userId) => {
  return workspace.members.find(
    (member) => member.memberId.toString() === userId
  );
};
export const createWorkspaceService = async (workspaceData) => {
  try {
    const joinCode = uuidv4().substring(0, 6).toUpperCase();

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

export const getWorkspaceUserIsMemberOfService = async (userId) => {
  try {
    const response =
      await workspaceRepository.fetchAllWorkspaceByMemberId(userId);
    return response;
  } catch (error) {
    console.log('🚀 ~ getWorkspaceUserIsMemberOfService ~ error:', error);
    throw error;
  }
};

export const deleteWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);

    if (!workspace) {
      throw new clientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isAllowed = isUserAdminOfWorkspace(workspace, userId);

    if (isAllowed) {
      await channelRepository.deleteMany(workspace.channels);

      const response = await workspaceRepository.delete(workspaceId);
      return response;
    }

    throw new clientError({
      explanation: 'User is either not a member or and admin of the workspacce',
      message: 'User is not allowed to delete the workspace',
      statusCode: StatusCodes.UNAUTHORIZED
    });
  } catch (error) {
    console.log('🚀 ~ deleteWorkspaceService ~ error:', error);
    throw error;
  }
};

export const getWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);

    if (!workspace) {
      throw new clientError({
        explanation: 'Invalid data is sent from client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isMember = isUserMemeberOfWorkspace(workspace, userId);

    if (!isMember) {
      throw new clientError({
        explanation: 'User is not a member of the workspace',
        message: 'User is not a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    return workspace;
  } catch (error) {
    console.log('🚀 ~ getWorkspaceService ~ error:', error);
    throw error;
  }
};

// export const getWorkspaceByJoinCode = async (joinCode) => {};

// export const updateWorkspaceService = async (
//   workspaceId,
//   workspaceData,
//   userId
// ) => {};

// export const addMemeberToWorkspaceService = async (
//   workspaceId,
//   userId,
//   role
// ) => {};

// export const addChannelToWorkspaceService = async (
//   workspaceId,
//   channelName
// ) => {};
