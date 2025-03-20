export default function crudRespository(model) {
  return {
    create: async function (data) {
      const newDoc = await model.create(data);
      return newDoc;
    },
    getAll: async function () {
      const allDocs = await model.find();
      return allDocs;
    },
    getById: async function (id) {
      const doc = await model.findById(id);
      return doc;
    },
    delete: async function (id) {
      const deleteDoc = await model.findByIdAndDelete(id);
      return deleteDoc;
    },
    update: async function (id, data) {
      const updatedDoc = await model.findByIdAndUpdate(id, data);
      return updatedDoc;
    }
  };
}
