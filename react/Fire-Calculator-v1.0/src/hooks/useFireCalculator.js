import { useState } from "react";
import { calculateFireResult } from "./calculateFireResult";

export const useFireCalculator = () => {
  const [inputs, setInputs] = useState({
    //左侧卡片
    currentAge: "",
    currentSavings: "",
    annualSpending: "",
    inflationRate: 0,
    targetAge: 100,

    // 右侧：投资策略
    stockYearly: "",
    stockReturn: "",
    bondYearly: "",
    bondReturn: "",
    cashYearly: "",
    cashReturn: "",
  });

  const [result, setResult] = useState(null);

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value === "" ? "" : Number(value),
    }));
  };

  const handleAnalyze = () => {
    const calculatedResult = calculateFireResult(inputs);
    setResult(calculatedResult);
  };

  return {
    inputs,
    handleInputChange,
    handleAnalyze,
    result,
  };
};
