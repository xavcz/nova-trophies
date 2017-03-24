const schema = {
  _id: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
  },
  // human readable uniq identifier = logo
  slug: {
    type: String,
    viewableBy: ['guests'],
    insertableBy: ['admins'],
    editableBy: ['admins'],
  },
  title: {
    type: String,
    viewableBy: ['guests'],
    insertableBy: ['admins'],
    editableBy: ['admins'],
  },
  value: {
    type: Number,
    viewableBy: ['guests'],
    insertableBy: ['admins'],
    editableBy: ['admins'],
  },
  description: {
    type: String,
    control: 'textarea',
    viewableBy: ['guests'],
    insertableBy: ['admins'],
    editableBy: ['admins'],
  },
  active: {
    type: Boolean,
    defaultValue: true,
    control: 'checkbox',
    viewableBy: ['guests'],
    insertableBy: ['admins'],
    editableBy: ['admins'],
  }
};

export default schema;
