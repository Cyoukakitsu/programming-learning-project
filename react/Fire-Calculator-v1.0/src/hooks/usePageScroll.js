import { useRef, useEffect } from "react";

export const usePageScroll = (result) => {
  const fireModelsRef = useRef(null); // 左边：FIRE 模式
  const investorRef = useRef(null); // 右边：大师策略
  const resultRef = useRef(null); // 底部：计算结果

  const scrollToRef = (ref) => {
    setTimeout(() => {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth", blick: "start" });
      }
    }, 100);
  };

  const handleScrollToModels = () => {
    scrollToRef(fireModelsRef);
  };
  const handleScrollToInvestor = () => {
    scrollToRef(investorRef);
  };

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [result]);

  return {
    refs: {
      resultRef,
      fireModelsRef,
      investorRef,
    },
    handlers: {
      handleScrollToModels,
      handleScrollToInvestor,
    },
  };
};
