interface IInitialState {
  id: string;
  role: string;
}


export default function (initialState: IInitialState) {
  console.log('initialState', initialState);
  const { id } = initialState || {};
  console.log('id', !!id);
  return {
    isUser: !!id
  };
}
