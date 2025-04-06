import Channel from '../schema/channel.js';
import crudRespository from './crudRepository.js';

const channelRepository = {
  ...crudRespository(Channel),
  getChannelWithWorkspaceDetails: async function (channelId) {
    const channel = await Channel.findById(channelId).populate('workspaceId');
    return channel;
  }
};

export default channelRepository;
