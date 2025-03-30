import Channel from '../schema/channel';
import crudRespository from './crudRepository';

const channelRepository = {
  ...crudRespository(Channel)
};

export default channelRepository;
