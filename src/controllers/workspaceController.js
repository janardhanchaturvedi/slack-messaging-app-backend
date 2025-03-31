import { StatusCodes } from 'http-status-codes';

import { createWorkspaceService } from '../service/workspaceService.js';
import {
  customErrorResponse,
  internalServerError,
  sucessResponse
} from '../utils/common/responseObjects.js';

export const createWorkspaceController = async (req, res) => {
  try {
    const { name, description } = req.body;
    const response = await createWorkspaceService({
      name,
      description,
      owner: req.user
    });

    return res
      .status(StatusCodes.CREATED)
      .json(sucessResponse(response, 'Workspace create successfully'));
  } catch (error) {
    console.log('🚀 ~ createWorkspaceController ~ error:', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerError(error));
  }
};
