// 包装懒加载组件的函数
import React from "react";
export default function withLoadingComponent(comp) {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>{comp}</React.Suspense>
  );
}
