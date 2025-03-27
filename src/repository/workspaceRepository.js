import Workspace from '../schema/workspace';
import crudRespository from './crudRepository';

const workspaceRepository = {
  ...crudRespository,
  getWorkspaceByName: async function () {},
  getWorkspaceByJoinCode: async function () {},
  addMemberToWorkspace: async function () {},
  addChannelToWorkspace: async function () {},
  fetchAllWorkspaceByMemberId: async function () {}
};

export default workspaceRepository;
