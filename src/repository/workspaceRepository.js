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
  getWorkspaceByJoinCode: async function () {},
  addMemberToWorkspace: async function () {},
  addChannelToWorkspace: async function () {},
  fetchAllWorkspaceByMemberId: async function () {}
};

export default workspaceRepository;
