import { StatusCodes } from 'http-status-codes';

import Workspace from '../schema/workspace.js';
import clientError from '../utils/errors/clientError.js';
import channelRepository from './channelRepository.js';
import crudRespository from './crudRepository.js';

const workspaceRepository = {
  ...crudRespository,
  getWorkspaceByName: async function (workspaceName) {
    const workspace = await Workspace.findOne({
      name: workspaceName
    });

    if (!workspace) {
      throw new clientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    return workspace;
  },
  getWorkspaceByJoinCode: async function (joinCode) {
    const workspace = await Workspace.findOne({
      joinCode
    });

    if (!workspace) {
      throw new clientError({
        explanation: 'Invalid data send from the client',
        mesaage: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    return workspace;
  },
  addMemberToWorkspace: async function (workspaceId, memberId, role) {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw new clientError({
        explanation: 'Invalid data send from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isValidUser = await Workspace.findById(memberId);

    if (!isValidUser) {
      throw new clientError({
        explanation: 'Invalid data send from client',
        message: 'User not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isMemberAlreadyPartOfWorkspace = workspace.members.find(
      (member) => member.memberId === memberId
    );

    if (isMemberAlreadyPartOfWorkspace) {
      throw new clientError({
        explanation: 'Invalid data sent from the user',
        mesaage: 'User already part of workspace',
        statusCode: StatusCodes.FORBIDDEN
      });
    }

    workspace.members.push({
      memberId,
      role
    });

    await workspace.save();

    return workspace;
  },
  addChannelToWorkspace: async function (workspaceId, channelName) {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      clientError({
        explanation: 'Invalid data send from the user',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isChannelAlreadyPartOfWorkspace = workspace.channels.find(
      (channel) => channel.name === channelName
    );

    if (isChannelAlreadyPartOfWorkspace) {
      throw new clientError({
        explanation: 'Invalid data sent from the client',
        mesaage: 'Channel already part of workspace',
        statusCode: StatusCodes.FORBIDDEN
      });
    }

    const channel = await channelRepository.create({ name: channelName });

    workspace.channels.push(channel);
    await workspace.save();

    return workspace;
  },
  fetchAllWorkspaceByMemberId: async function (memberId) {
    const workspaces = await Workspace.find({
      'members.memberId': memberId
    }).populate('members.memberId', 'username email avatar');

    return workspaces;
  }
};

export default workspaceRepository;
