import { useState } from "react";
import axios from "axios";
import useDebouncedPromise from "./useDebouncedPromise";

const initialRequestInfo = {
  data: null,
};

export default function useApi(config) {
  const [requestInfo, setRequestInfo] = useState(initialRequestInfo);
  const debouncedAxios = useDebouncedPromise(axios, config.debounceDelay);

  async function call() {
    setRequestInfo({
      ...initialRequestInfo,
    });
    const finalConfig = {
      baseURL: "http://612f96dd5fc50700175f1693.mockapi.io",
      ...config,
    };
    const fn = finalConfig.debounceDelay ? debouncedAxios : axios;
    const response = await fn(finalConfig);

    setRequestInfo({
      ...initialRequestInfo,
      data: response.data,
    });

    if (config.onCompleted) {
      config.onCompleted(response);
    }
    return response;
  }

  return [call, requestInfo];
}
