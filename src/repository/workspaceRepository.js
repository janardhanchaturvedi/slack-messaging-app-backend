import { StatusCodes } from 'http-status-codes';
import Workspace from '../schema/workspace';
import clientError from '../utils/errors/clientError';
import crudRespository from './crudRepository';

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
  addChannelToWorkspace: async function () {},
  fetchAllWorkspaceByMemberId: async function () {}
};

export default workspaceRepository;
