import Channel from '../schema/channel.js';
import crudRespository from './crudRepository.js';

const channelRepository = {
  ...crudRespository(Channel)
};

export default channelRepository;
