// server/src/schemas/resolvers.ts
import Tea from '../models/TeaCategory';

const resolvers = {
  Query: {
    teas: async () => Tea.find(),
    tea: async (_: any, { id }: { id: string }) => Tea.findById(id),
  },
  Mutation: {
    addTea: async (_: any, { name, brand, type, imageUrl, tastingNotes, tags }: any, context: any) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      const tea = await Tea.create({
        name,
        brand,
        type,
        imageUrl,
        tastingNotes,
        tags,
        createdBy: context.user._id,
      });
      return tea;
    },
  },
};
