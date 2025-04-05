import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import channelRepository from '../repository/channelRepository.js';
import userRespository from '../repository/userRepsitory.js';
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

const isChannelAlreadyPartOfWorkspace = (workspace, channelName) => {
  return workspace.channels.find(
    (channel) => channel.name.toLowerCase() === channelName.toLowerCase()
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

export const getWorkspaceByJoinCodeService = async (joinCode, userId) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceByJoinCode(joinCode);

    if (!workspace) {
      throw new clientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isMember = isUserMemeberOfWorkspace(userId);

    if (!isMember) {
      throw new clientError({
        explanation: 'User is not a part of workspace',
        message: 'User is not a part of workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    return workspace;
  } catch (error) {
    console.log('🚀 ~ getWorkspaceByJoinCodeService ~ error:', error);
    throw error;
  }
};

export const updateWorkspaceService = async (
  workspaceId,
  workspaceData,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new clientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new clientError({
        explanation: 'User is not admin of the workspace',
        message: 'User is not admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const updatedWorkspace = await workspaceRepository.update(
      workspaceId,
      workspaceData
    );

    return updatedWorkspace;
  } catch (error) {
    console.log('🚀updateWorkspaceService ~ error:', error);
    throw error;
  }
};

export const addMemberToWorkspaceService = async (
  workspaceId,
  userId,
  role
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);

    if (!workspace) {
      throw new clientError({
        explanation: 'Invalid data is sent from client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isValidUser = await userRespository.getById(userId);
    if (!isValidUser) {
      throw new clientError({
        explanation: 'Invalid data sent from client ',
        message: 'User not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isMember = isUserMemeberOfWorkspace(workspace, userId);
    if (isMember) {
      throw new clientError({
        explanation: 'User is already a member of workspace',
        message: 'User is already a member of workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const reponse = await workspaceRepository.addMemberToWorkspace(
      workspaceId,
      userId,
      role
    );
    return reponse;
  } catch (error) {
    console.log('🚀 addMemberToWorkspaceService ~ error:', error);
    throw error;
  }
};

export const addChannelToWorkspaceService = async (
  workspaceId,
  channelName,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new clientError({
        explanation: 'Invalid data is sent from client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new clientError({
        explanation: 'User is not the admin of the workspace',
        message: 'User is not the admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const isChannelPartOfWorkspace = isChannelAlreadyPartOfWorkspace(
      workspace,
      channelName
    );

    if (isChannelPartOfWorkspace) {
      throw new clientError({
        explanation: 'Invalid data is sent from the user',
        message: 'Channel is already a part of workspace',
        statusCode: StatusCodes.FORBIDDEN
      });
    }

    const response = await workspaceRepository.addChannelToWorkspace(
      workspaceId,
      channelName
    );

    return response;
  } catch (error) {
    console.log('🚀 ~addChannelToWorkspaceService error:', error);
    throw error;
  }
};
