const tabs = (state = [], action) => {
  switch (action.type) {
    case 'ALL_TABS':
      return {
        ...state,
        tabs: action.allTabs
      }
    case 'ADD_TAB':
      return [
        ...state,
        {
          name: action.name,
          slug: action.slug
        }
      ]
    default:
      return state
  }
}

export {
  tabs
}