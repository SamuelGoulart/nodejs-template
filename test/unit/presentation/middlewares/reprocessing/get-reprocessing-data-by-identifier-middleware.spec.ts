import { ErrorHandler } from '@/domain/usecases';
import { GetReprocessingDataByIdentifierMiddleware } from '@/presentation/middlewares';
import { mockReprocessingModel } from '@/test/unit/domain';
import { GetReprocessingDataByIdentifierStub } from '@/test/unit/presentation/mocks';
import {
  makeErrorHandlerStub,
  makeNotFoundMock,
  makeServerErrorMock
} from '@/test/unit/utils';

type SutTypes = {
  sut: GetReprocessingDataByIdentifierMiddleware;
  getReprocessingDataByIdentifierStub: GetReprocessingDataByIdentifierStub;
  errorHandler: ErrorHandler;
};

const makeSut = (): SutTypes => {
  const getReprocessingDataByIdentifierStub =
    new GetReprocessingDataByIdentifierStub();
  const errorHandler = makeErrorHandlerStub();
  const sut = new GetReprocessingDataByIdentifierMiddleware(
    getReprocessingDataByIdentifierStub,
    errorHandler
  );

  return {
    sut,
    getReprocessingDataByIdentifierStub,
    errorHandler
  };
};

describe('GetReprocessingDataByIdentifierMiddleware', () => {
  const request: any = { body: { reprocessingIds: ['any_reprocessing_id'] } };
  const state: any = {};
  const setState = jest.fn();
  const next = jest.fn();

  it('Should call getReprocessingDataByIdentifier witch correct values', async () => {
    const { sut, getReprocessingDataByIdentifierStub } = makeSut();

    const getSpy = jest.spyOn(getReprocessingDataByIdentifierStub, 'get');

    await sut.handle(request, [state, setState], next);

    const expected = { reprocessingIds: ['any_reprocessing_id'] };

    expect(getSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledWith(expected);
  });

  it('Should call next if reprocessingIds is empty', async () => {
    const { sut } = makeSut();

    const request: any = { body: { reprocessingIds: [] } };

    await sut.handle(request, [state, setState], next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('Should call setState with getReprocessingDataByIdentifier result', async () => {
    const { sut } = makeSut();

    await sut.handle(request, [state, setState], next);

    const expected = {
      getReprocessingDataByIdentifier: [mockReprocessingModel]
    };

    expect(setState).toHaveBeenCalledTimes(1);
    expect(setState).toHaveBeenCalledWith(expected);
  });

  it('Should return if getReprocessingDataByIdentifier not find ', async () => {
    const { sut, getReprocessingDataByIdentifierStub, errorHandler } =
      makeSut();

    jest
      .spyOn(getReprocessingDataByIdentifierStub, 'get')
      .mockRejectedValueOnce(new Error('Reprocessing data not found.'));

    const errorHandlerSpy = jest.spyOn(errorHandler, 'handle');

    const result = await sut.handle(request, [state, setState], next);

    const expected = makeNotFoundMock(
      'Não foi encontrado nenhum dado para reprocessamento.'
    );

    expect(result).toStrictEqual(expected);
    expect(errorHandlerSpy).toHaveBeenCalledTimes(1);
  });

  it('Should return 500 if a unknown error throws', async () => {
    const { sut, getReprocessingDataByIdentifierStub, errorHandler } =
      makeSut();

    jest
      .spyOn(getReprocessingDataByIdentifierStub, 'get')
      .mockRejectedValueOnce(new Error('Unknown Error.'));

    const errorHandlerSpy = jest.spyOn(errorHandler, 'handle');
    const result = await sut.handle(request, [state, setState], next);

    const expected = makeServerErrorMock();
    expect(result).toStrictEqual(expected);
    expect(errorHandlerSpy).toHaveBeenCalledTimes(1);
  });
});
