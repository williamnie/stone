import { useCallback, useRef } from 'react';
import { useImmer } from 'use-immer';
import { saveFuncService, getFuncListService, deleteFuncService, getFunctionDetailService } from '@/services';
import { message } from 'antd'


type TMethod = 'post' | 'get' | 'delete' | 'put';
interface GlobalState {
  router: string;
  method: TMethod;
  code: string;
}

interface IFunc {
  router: string;
  method: TMethod;
  file: boolean;
}
interface IDeleteData {
  router: string;
  method: 'post' | 'get' | 'delete' | 'put';
}
const defaultCode = "// 默认的初始化代码,代码中必须有 return {data} \nimport { store, stone } from 'stone_client';\n\nconst func = async (ctx) => {\n\n    return {data}\n\n}\n\nstone(func)"
const useGlobal = () => {

  const [state, setState] = useImmer<GlobalState>({
    router: '',
    method: 'get',
    code: defaultCode
  });

  const [funcList, setFuncList] = useImmer<IFunc[]>([])

  // const [currentSelectFunc, setCurrentSeclectFunc] = useState<string>('')

  const codeRef = useRef<string>('')

  const setRoute = useCallback((route: string) => {
    if (!route) {
      setState((draft) => {
        draft.router = route;
        draft.code = defaultCode;
      });
    } else {
      setState((draft) => {
        draft.router = route;
      });
    }

  }, []);

  const setMethod = useCallback((method: TMethod) => {
    setState((draft) => {
      draft.method = method;
    });
  }, []);

  const setCode = useCallback((code: string) => {
    codeRef.current = code
    setState((draft) => {
      draft.code = code;
    });
  }, [])

  const getFuncList = useCallback(async () => {
    const { code, data } = await getFuncListService()
    if (code === 0) {
      setFuncList(data)
    } else {
      message.error('获取function列表失败')
    }
  }, [])

  const saveFunction = useCallback(async (router: string, method: TMethod) => {
    if (!router) {
      message.error('请输入路由地址')
    }
    if (!codeRef.current) {
      message.error('请输入代码')
    }
    // TODO: 这里需要区分是保存还是创建
    const { code } = await saveFuncService({ router, method, code: codeRef.current })
    if (code === 0) {
      message.success('保存成功')
      codeRef.current = ''
      getFuncList()
    } else {
      message.error('保存失败')
    }
  }, [])



  const deleteFunc = useCallback(async (data: IDeleteData) => {
    const { code, message: msg } = await deleteFuncService(data)
    if (code === 0) {
      getFuncList()
    } else {
      message.error(msg)
    }
  }, [])


  const selectFunc = useCallback(async (router: string, method: TMethod) => {
    const { code, data, message: msg } = await getFunctionDetailService({ router, method })
    let fRouter = router
    if (router?.startsWith('/')) {
      fRouter = router?.replace('/', '')
    }
    if (code === 0) {
      codeRef.current = data?.code
      setState((draft) => {
        draft.router = fRouter;
        draft.method = method;
        draft.code = data?.code;
      });
    } else {
      message.error(msg)
      setState((draft) => {
        draft.router = fRouter;
        draft.method = method;
      });
    }
  }, [])



  return {
    funcInfo: state,
    setRoute,
    setMethod,
    setCode,
    saveFunction,
    getFuncList,
    funcList,
    deleteFunc,
    selectFunc,
    currentSelectFunc: `${state.router}+${state.method}`
  };
};

export default useGlobal;
