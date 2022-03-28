const bpmn = {
  state: {
    nodeVisible: false,
    nodeInfo: {},
    to_del:false
  },
  mutations: {
    TOGGLENODEVISIBLE: (state, visible) => {
      state.nodeVisible = visible;
    },
    SETNODEINFO: (state, info) => {
      state.nodeInfo = info;
    },
    DELINFO:(state,del)=>{
      state.to_del=del
    }
  },
  actions: {}
};

export default bpmn;
