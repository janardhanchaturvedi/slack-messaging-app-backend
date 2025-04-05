import { StatusCodes } from 'http-status-codes';

import {
  createWorkspaceService,
  deleteWorkspaceService,
  getWorkspaceService,
  getWorkspaceUserIsMemberOfService
} from '../service/workspaceService.js';
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
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerError(error));
  }
};

export const getWorkspaceUserIsMemberOfController = async (req, res) => {
  try {
    const response = await getWorkspaceUserIsMemberOfService(req.user);
    return res
      .status(StatusCodes.OK)
      .json(sucessResponse(response, 'Workspaces fetched successfully'));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerError(error));
  }
};

export const deleteWorkspaceController = async (req, res) => {
  try {
    const response = await deleteWorkspaceService(
      req.params.workspaceId,
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(sucessResponse(response, 'Workspace deleted sucessfully'));
  } catch (error) {
    console.log('🚀 ~ deleteWorkspaceController ~ error:', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerError(error));
  }
};

export const getWorkspaceController = async (req, res) => {
  try {
    const response = await getWorkspaceService(
      req.params.workspaceId,
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(sucessResponse(response, 'Workspace fetched successfully'));
  } catch (error) {
    console.log('🚀 ~ getWorkspaceController ~ error:', error);

    if (res.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerError(error));
  }
};
