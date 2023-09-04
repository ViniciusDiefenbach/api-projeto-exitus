import { ObjUUID } from '../user/dto/create-user.dto';

export const adptCreateMany = ({
  array,
  key,
}: {
  array: Array<ObjUUID>;
  key: string;
}): unknown => {
  if (!array) return undefined;
  return {
    createMany: {
      data: [
        ...array?.map(({ id }) => ({
          [key]: id,
        })),
      ],
    },
  };
};
